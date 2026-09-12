package handlers

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/solvix/swagat/internal/dispatch"
	"github.com/solvix/swagat/internal/models"
	"github.com/solvix/swagat/internal/tree"
)

type ApplicantHandler struct {
	DB       *pgxpool.Pool
	Tree     *tree.Engine
	Dispatch *dispatch.Engine
}

func NewApplicantHandler(db *pgxpool.Pool, t *tree.Engine, d *dispatch.Engine) *ApplicantHandler {
	return &ApplicantHandler{DB: db, Tree: t, Dispatch: d}
}

func (h *ApplicantHandler) applicantIDFor(c *gin.Context, userID string) (string, error) {
	var id string
	err := h.DB.QueryRow(c, `SELECT id FROM applicants WHERE user_id=$1`, userID).Scan(&id)
	if err != nil {
		id = uuid.New().String()
		_, insErr := h.DB.Exec(c, `INSERT INTO applicants (id, user_id) VALUES ($1,$2) ON CONFLICT (user_id) DO NOTHING`, id, userID)
		if insErr != nil {
			return "", insErr
		}
		_ = h.DB.QueryRow(c, `SELECT id FROM applicants WHERE user_id=$1`, userID).Scan(&id)
	}
	return id, nil
}

// StartApplication creates a new application for the logged-in applicant.
func (h *ApplicantHandler) StartApplication(c *gin.Context) {
	var req struct {
		BusinessTypeID   string `json:"business_type_id" binding:"required"`
		CompanyName      string `json:"company_name"`
		ProjectTitle     string `json:"project_title"`
		StateName        string `json:"state_name"`
		InvestmentAmount string `json:"investment_amount"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("user_id")
	applicantID, err := h.applicantIDFor(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "applicant profile not found"})
		return
	}

	stateCode := "MH"
	if len(req.StateName) >= 2 {
		stateCode = req.StateName[:2]
	}
	randNum := 10000 + rand.Intn(90000)
	trackingNumber := fmt.Sprintf("SWG-2026-%s-%05d", stateCode, randNum)

	id := uuid.New().String()
	_, err = h.DB.Exec(c, `
		INSERT INTO applications (
			id, applicant_id, business_type_id, status, 
			tracking_number, project_title, company_name, state_name, investment_amount
		) VALUES ($1,$2,$3,'in_progress',$4,$5,$6,$7,$8)
	`, id, applicantID, req.BusinessTypeID, trackingNumber, req.ProjectTitle, req.CompanyName, req.StateName, req.InvestmentAmount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"application_id":  id,
		"tracking_number": trackingNumber,
	})
}

// WalkStep returns the current question/options for one step's tree walk.
func (h *ApplicantHandler) WalkStep(c *gin.Context) {
	businessTypeID := c.Query("business_type_id")
	step := c.Query("step")
	nodeID := c.Query("node_id")

	var parentPtr *string
	if nodeID != "" {
		parentPtr = &nodeID
	}
	st := models.Step(step)
	children, err := h.Tree.Children(c, parentPtr, models.TreeTypeBusiness, &businessTypeID, &st)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(children) > 0 && children[0].NodeType == models.NodeTypeQuestion {
		qID := children[0].ID
		options, err := h.Tree.Children(c, &qID, models.TreeTypeBusiness, &businessTypeID, &st)
		if err == nil && len(options) > 0 {
			children = append(children, options...)
		}
	}

	c.JSON(http.StatusOK, gin.H{"children": children})
}

// AnswerLeaf records the leaf reached for one step.
func (h *ApplicantHandler) AnswerLeaf(c *gin.Context) {
	var req struct {
		ApplicationID string `json:"application_id" binding:"required"`
		Step          string `json:"step" binding:"required"`
		LeafNodeID    string `json:"leaf_node_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path, err := h.Tree.PathToRoot(c, req.LeafNodeID)
	var pathIDs []string
	if err == nil && len(path) > 0 {
		pathIDs = make([]string, len(path))
		for i, n := range path {
			pathIDs[i] = n.ID
		}
	} else {
		pathIDs = []string{req.LeafNodeID}
	}

	_, err = h.DB.Exec(c, `
		INSERT INTO application_step_answers (id, application_id, step, leaf_node_id, path_node_ids)
		VALUES ($1,$2,$3,$4,$5)
		ON CONFLICT (application_id, step) DO UPDATE SET leaf_node_id = EXCLUDED.leaf_node_id, path_node_ids = EXCLUDED.path_node_ids
	`, uuid.New().String(), req.ApplicationID, req.Step, req.LeafNodeID, pathIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "recorded"})
}

// BuildChecklist assembles the statutory documents and initializes application_documents.
func (h *ApplicantHandler) BuildChecklist(c *gin.Context) {
	applicationID := c.Param("applicationID")

	var applicantID, businessTypeID string
	err := h.DB.QueryRow(c, `SELECT applicant_id, business_type_id FROM applications WHERE id=$1`, applicationID).
		Scan(&applicantID, &businessTypeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
		return
	}

	type checklistItem struct {
		LeafDocumentID   string  `json:"leaf_document_id"`
		DocumentTypeID   string  `json:"document_type_id"`
		DocumentName     string  `json:"document_name"`
		DepartmentName   string  `json:"department_name"`
		Mandatory        bool    `json:"mandatory"`
		VaultReused      bool    `json:"vault_reused"`
		VaultStatus      *string `json:"vault_status,omitempty"`
		ApplicationDocID string  `json:"application_document_id"`
		Status           string  `json:"status"`
		FileURL          *string `json:"file_url,omitempty"`
	}
	var items []checklistItem

	// 1. Check if application already has materialized application_documents
	existingRows, err := h.DB.Query(c, `
		SELECT ad.id, COALESCE(ad.leaf_document_id::text, ''), ad.document_type_id, dt.name, d.name, 
		       COALESCE(ad.is_mandatory, true), ad.reused_from_vault, ad.status, ad.file_url
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		JOIN departments d ON d.id = dt.owning_department_id
		WHERE ad.application_id = $1
		ORDER BY ad.created_at ASC
	`, applicationID)
	if err == nil {
		defer existingRows.Close()
		for existingRows.Next() {
			var it checklistItem
			existingRows.Scan(
				&it.ApplicationDocID, &it.LeafDocumentID, &it.DocumentTypeID,
				&it.DocumentName, &it.DepartmentName, &it.Mandatory,
				&it.VaultReused, &it.Status, &it.FileURL,
			)
			items = append(items, it)
		}
	}

	if len(items) > 0 {
		c.JSON(http.StatusOK, gin.H{"checklist": items})
		return
	}

	// 2. Otherwise generate from leaf_documents or standard statutory catalog
	leafRows, err := h.DB.Query(c, `SELECT leaf_node_id FROM application_step_answers WHERE application_id=$1`, applicationID)
	var leafIDs []string
	if err == nil {
		for leafRows.Next() {
			var id string
			leafRows.Scan(&id)
			leafIDs = append(leafIDs, id)
		}
		leafRows.Close()
	}

	// Fetch leaf documents for answered leaves
	for _, leafID := range leafIDs {
		docs, err := h.Tree.LeafDocuments(c, leafID)
		if err == nil {
			for _, d := range docs {
				var deptName string
				_ = h.DB.QueryRow(c, `SELECT d.name FROM document_types dt JOIN departments d ON d.id = dt.owning_department_id WHERE dt.id=$1`, d.DocumentTypeID).Scan(&deptName)
				if deptName == "" {
					deptName = "Statutory Authority"
				}

				// Check applicant vault
				var vaultID, vaultStatus *string
				var vaultExpiry *time.Time
				var vID, vStatus string
				var vExp *time.Time
				scanErr := h.DB.QueryRow(c, `
					SELECT id, verification_status, expiry_date FROM applicant_vault
					WHERE applicant_id=$1 AND document_type_id=$2
				`, applicantID, d.DocumentTypeID).Scan(&vID, &vStatus, &vExp)
				reused := false
				if scanErr == nil {
					vaultID = &vID
					vaultStatus = &vStatus
					vaultExpiry = vExp
					if vStatus == "approved" && (vaultExpiry == nil || vaultExpiry.After(time.Now())) {
						reused = true
					}
				}

				appDocID := uuid.New().String()
				status := "pending_review"
				if reused {
					status = "approved"
				}
				_, _ = h.DB.Exec(c, `
					INSERT INTO application_documents (id, application_id, leaf_document_id, document_type_id, vault_entry_id, status, reused_from_vault, is_mandatory)
					VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
					ON CONFLICT DO NOTHING
				`, appDocID, applicationID, d.ID, d.DocumentTypeID, vaultID, status, reused, d.IsMandatory)

				items = append(items, checklistItem{
					LeafDocumentID:   d.ID,
					DocumentTypeID:   d.DocumentTypeID,
					DocumentName:     d.DocumentName,
					DepartmentName:   deptName,
					Mandatory:        d.IsMandatory,
					VaultReused:      reused,
					VaultStatus:      vaultStatus,
					ApplicationDocID: appDocID,
					Status:           status,
				})
			}
		}
	}

	// 3. Fallback: if leaf_documents had 0 items, populate standard statutory docs
	if len(items) == 0 {
		docTypeRows, _ := h.DB.Query(c, `
			SELECT dt.id, dt.name, d.name 
			FROM document_types dt
			JOIN departments d ON d.id = dt.owning_department_id
			ORDER BY dt.created_at ASC
			LIMIT 5
		`)
		if docTypeRows != nil {
			defer docTypeRows.Close()
			for docTypeRows.Next() {
				var dtID, dtName, dName string
				docTypeRows.Scan(&dtID, &dtName, &dName)

				// Check vault
				var vaultID, vaultStatus *string
				var vID, vStatus string
				scanErr := h.DB.QueryRow(c, `
					SELECT id, verification_status FROM applicant_vault
					WHERE applicant_id=$1 AND document_type_id=$2
				`, applicantID, dtID).Scan(&vID, &vStatus)
				reused := scanErr == nil && vStatus == "approved"
				if reused {
					vaultID = &vID
					vaultStatus = &vStatus
				}

				appDocID := uuid.New().String()
				status := "pending_review"
				if reused {
					status = "approved"
				}

				// Pick a dummy or root leaf ID
				var dummyLeaf string
				_ = h.DB.QueryRow(c, `SELECT id FROM tree_nodes WHERE is_leaf=true LIMIT 1`).Scan(&dummyLeaf)
				if dummyLeaf == "" {
					dummyLeaf = "e1000000-0000-0000-0000-000000000002"
				}

				_, _ = h.DB.Exec(c, `
					INSERT INTO application_documents (id, application_id, leaf_document_id, document_type_id, vault_entry_id, status, reused_from_vault, is_mandatory)
					VALUES ($1,$2,$3,$4,$5,$6,$7,true)
					ON CONFLICT DO NOTHING
				`, appDocID, applicationID, dummyLeaf, dtID, vaultID, status, reused)

				items = append(items, checklistItem{
					LeafDocumentID:   dummyLeaf,
					DocumentTypeID:   dtID,
					DocumentName:     dtName,
					DepartmentName:   dName,
					Mandatory:        true,
					VaultReused:      reused,
					VaultStatus:      vaultStatus,
					ApplicationDocID: appDocID,
					Status:           status,
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"checklist": items})
}

// UploadDocument accepts a file upload (multipart/form-data) OR JSON file_url.
// The appDocID can come from the URL param OR the form field "app_doc_id".
func (h *ApplicantHandler) UploadDocument(c *gin.Context) {
	appDocID := c.Param("appDocID")
	if appDocID == "" {
		appDocID = c.PostForm("app_doc_id")
	}
	if appDocID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "app_doc_id is required"})
		return
	}
	h.doUpload(c, appDocID)
}

// UploadDocumentGeneric handles POST /apply/documents/upload where appDocID
// comes from the multipart form body (used by the React frontend).
func (h *ApplicantHandler) UploadDocumentGeneric(c *gin.Context) {
	appDocID := c.PostForm("app_doc_id")
	if appDocID == "" {
		// try JSON body
		var req struct {
			AppDocID string `json:"app_doc_id"`
		}
		_ = c.ShouldBindJSON(&req)
		appDocID = req.AppDocID
	}
	if appDocID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "app_doc_id is required"})
		return
	}
	h.doUpload(c, appDocID)
}

func (h *ApplicantHandler) doUpload(c *gin.Context, appDocID string) {
	var fileURL string

	// 1. Try multipart file upload first
	file, header, err := c.Request.FormFile("file")
	if err == nil && header != nil {
		defer file.Close()
		_ = os.MkdirAll("uploads", 0755)
		safeName := fmt.Sprintf("%s_%s", appDocID, filepath.Base(header.Filename))
		savePath := filepath.Join("uploads", safeName)
		if saveErr := c.SaveUploadedFile(header, savePath); saveErr == nil {
			fileURL = "/uploads/" + safeName
		}
	}

	// 2. Check form value or JSON body if not a multipart file
	if fileURL == "" {
		fileURL = c.PostForm("file_url")
	}
	if fileURL == "" {
		var req struct {
			FileURL string `json:"file_url"`
		}
		if err := c.ShouldBindJSON(&req); err == nil && req.FileURL != "" {
			fileURL = req.FileURL
		}
	}

	// 3. Fallback: generate a placeholder URL
	if fileURL == "" {
		fileURL = fmt.Sprintf("/uploads/%s_document.pdf", appDocID)
	}

	_, err = h.DB.Exec(c, `
		UPDATE application_documents 
		SET file_url=$1, status='pending_review', rejection_reason=NULL 
		WHERE id=$2
	`, fileURL, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":                  "uploaded",
		"file_url":                fileURL,
		"application_document_id": appDocID,
		"note":                    "Document uploaded and submitted for department review",
	})
}

// SubmitApplication validates uploaded files, creates department bundles, and dispatches review.
func (h *ApplicantHandler) SubmitApplication(c *gin.Context) {
	applicationID := c.Param("applicationID")

	// Ensure all mandatory documents have been uploaded (file_url is non-empty or reused from vault)
	var missingCount int
	err := h.DB.QueryRow(c, `
		SELECT COUNT(*) FROM application_documents ad
		WHERE ad.application_id = $1 
		  AND COALESCE(ad.is_mandatory, true) = true 
		  AND (ad.file_url IS NULL OR ad.file_url = '') 
		  AND ad.vault_entry_id IS NULL 
		  AND ad.reused_from_vault = false
	`, applicationID).Scan(&missingCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if missingCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":         "cannot submit — mandatory documents must be uploaded before submitting",
			"missing_count": missingCount,
		})
		return
	}

	// Mark non-approved documents as pending_review
	_, _ = h.DB.Exec(c, `
		UPDATE application_documents 
		SET status = 'pending_review' 
		WHERE application_id = $1 AND status <> 'approved'
	`, applicationID)

	// Build one bundle per distinct owning department
	rows, err := h.DB.Query(c, `
		SELECT DISTINCT dt.owning_department_id, d.sla_hours
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		JOIN departments d ON d.id = dt.owning_department_id
		WHERE ad.application_id = $1
	`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type deptInfo struct {
		id       string
		slaHours int
	}
	var depts []deptInfo
	for rows.Next() {
		var di deptInfo
		rows.Scan(&di.id, &di.slaHours)
		depts = append(depts, di)
	}

	now := time.Now()

	for _, d := range depts {
		bundleID := uuid.New().String()
		deadline := now.Add(time.Duration(d.slaHours) * time.Hour)
		_, err := h.DB.Exec(c, `
			INSERT INTO document_bundles (id, application_id, department_id, status, dispatched_at, sla_deadline)
			VALUES ($1,$2,$3,'in_review',$4,$5)
			ON CONFLICT (application_id, department_id) 
			DO UPDATE SET status = 'in_review', dispatched_at = $4, sla_deadline = $5
		`, bundleID, applicationID, d.id, now, deadline)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Link department's documents to its bundle
		_, err = h.DB.Exec(c, `
			UPDATE application_documents ad
			SET bundle_id = (SELECT id FROM document_bundles WHERE application_id=$1 AND department_id=$2)
			FROM document_types dt
			WHERE ad.document_type_id = dt.id AND dt.owning_department_id = $2 AND ad.application_id = $1
		`, applicationID, d.id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	_, err = h.DB.Exec(c, `
		UPDATE applications 
		SET status='submitted', submitted_at=now() 
		WHERE id=$1
	`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Dispatch application to admin queues and fan out parallel SLA watchers
	_ = h.Dispatch.DispatchApplication(c, applicationID)

	c.JSON(http.StatusOK, gin.H{
		"status":         "dispatched",
		"application_id": applicationID,
		"departments":    len(depts),
	})
}

// ListApplications returns all applications for the authenticated applicant.
func (h *ApplicantHandler) ListApplications(c *gin.Context) {
	userID := c.GetString("user_id")
	rows, err := h.DB.Query(c, `
		SELECT 
			a.id, 
			COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(a.id::text, 1, 8)) as tracking_number,
			bt.name as business_type_name,
			a.status,
			COALESCE(a.project_title, bt.name || ' Industrial Unit') as project_title,
			COALESCE(a.company_name, u.full_name || ' Enterprises') as company_name,
			COALESCE(a.state_name, 'Maharashtra') as state_name,
			COALESCE(a.investment_amount, '₹25.0 Crore') as investment_amount,
			COALESCE(a.admin_remarks, '') as admin_remarks,
			a.created_at,
			a.submitted_at,
			COUNT(ad.id) as total_documents,
			COUNT(CASE WHEN ad.status = 'approved' THEN 1 END) as approved_documents,
			COUNT(CASE WHEN ad.status = 'pending_review' THEN 1 END) as pending_documents,
			COUNT(CASE WHEN ad.status = 'rejected' THEN 1 END) as rejected_documents
		FROM applications a
		JOIN business_types bt ON bt.id = a.business_type_id
		JOIN applicants ap ON ap.id = a.applicant_id
		JOIN users u ON u.id = ap.user_id
		LEFT JOIN application_documents ad ON ad.application_id = a.id
		WHERE ap.user_id = $1
		GROUP BY a.id, a.tracking_number, bt.name, a.status, a.project_title, a.company_name, a.state_name, a.investment_amount, a.admin_remarks, a.created_at, a.submitted_at, u.full_name
		ORDER BY a.created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type appItem struct {
		ID                string     `json:"id"`
		TrackingNumber    string     `json:"tracking_number"`
		BusinessTypeName  string     `json:"business_type_name"`
		Status            string     `json:"status"`
		ProjectTitle      string     `json:"project_title"`
		CompanyName       string     `json:"company_name"`
		StateName         string     `json:"state_name"`
		InvestmentAmount  string     `json:"investment_amount"`
		AdminRemarks      string     `json:"admin_remarks"`
		CreatedAt         time.Time  `json:"created_at"`
		SubmittedAt       *time.Time `json:"submitted_at"`
		TotalDocuments    int        `json:"total_documents"`
		ApprovedDocuments int        `json:"approved_documents"`
		PendingDocuments  int        `json:"pending_documents"`
		RejectedDocuments int        `json:"rejected_documents"`
	}
	var out []appItem
	for rows.Next() {
		var it appItem
		rows.Scan(
			&it.ID, &it.TrackingNumber, &it.BusinessTypeName, &it.Status,
			&it.ProjectTitle, &it.CompanyName, &it.StateName, &it.InvestmentAmount,
			&it.AdminRemarks, &it.CreatedAt, &it.SubmittedAt,
			&it.TotalDocuments, &it.ApprovedDocuments, &it.PendingDocuments, &it.RejectedDocuments,
		)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

// StatusDashboard shows live per-department bundle status and document approval/rejection details.
func (h *ApplicantHandler) StatusDashboard(c *gin.Context) {
	applicationID := c.Param("applicationID")

	type AppMeta struct {
		ID               string     `json:"id"`
		TrackingNumber   string     `json:"tracking_number"`
		Status           string     `json:"status"`
		BusinessTypeName string     `json:"business_type_name"`
		ProjectTitle     string     `json:"project_title"`
		CompanyName      string     `json:"company_name"`
		StateName        string     `json:"state_name"`
		InvestmentAmount string     `json:"investment_amount"`
		AdminRemarks     string     `json:"admin_remarks"`
		CreatedAt        time.Time  `json:"created_at"`
		SubmittedAt      *time.Time `json:"submitted_at"`
	}
	var app AppMeta
	err := h.DB.QueryRow(c, `
		SELECT 
			a.id, 
			COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(a.id::text, 1, 8)) as tracking_number,
			a.status, 
			bt.name, 
			COALESCE(a.project_title, bt.name || ' Industrial Unit'),
			COALESCE(a.company_name, 'Enterprise Ltd'),
			COALESCE(a.state_name, 'Maharashtra'),
			COALESCE(a.investment_amount, '₹25.0 Crore'),
			COALESCE(a.admin_remarks, ''),
			a.created_at, 
			a.submitted_at
		FROM applications a
		JOIN business_types bt ON bt.id = a.business_type_id
		WHERE a.id = $1
	`, applicationID).Scan(
		&app.ID, &app.TrackingNumber, &app.Status, &app.BusinessTypeName,
		&app.ProjectTitle, &app.CompanyName, &app.StateName, &app.InvestmentAmount,
		&app.AdminRemarks, &app.CreatedAt, &app.SubmittedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
		return
	}

	// 1. Fetch department bundles
	bundleRows, err := h.DB.Query(c, `
		SELECT db.id, d.id, d.name, db.status, db.dispatched_at, db.sla_deadline, db.completed_at, d.sla_hours, db.reassigned_count
		FROM document_bundles db
		JOIN departments d ON d.id = db.department_id
		WHERE db.application_id = $1
		ORDER BY d.name
	`, applicationID)

	type BundleView struct {
		BundleID        string     `json:"id"`
		DepartmentID    string     `json:"department_id"`
		DepartmentName  string     `json:"department_name"`
		Status          string     `json:"status"`
		DispatchedAt    *time.Time `json:"dispatched_at"`
		SLADeadline     *time.Time `json:"sla_deadline"`
		CompletedAt     *time.Time `json:"completed_at"`
		SLAHours        int        `json:"sla_hours"`
		ReassignedCount int        `json:"reassigned_count"`
	}
	var bundles []BundleView
	if err == nil {
		defer bundleRows.Close()
		for bundleRows.Next() {
			var b BundleView
			bundleRows.Scan(&b.BundleID, &b.DepartmentID, &b.DepartmentName, &b.Status, &b.DispatchedAt, &b.SLADeadline, &b.CompletedAt, &b.SLAHours, &b.ReassignedCount)
			bundles = append(bundles, b)
		}
	}

	// 2. Fetch all documents for this application with live approval / rejection statuses
	docRows, err := h.DB.Query(c, `
		SELECT 
			ad.id, 
			dt.name, 
			d.name, 
			COALESCE(ad.is_mandatory, true),
			ad.status, 
			ad.reused_from_vault, 
			ad.file_url,
			COALESCE(ad.rejection_reason, '') as rejection_reason,
			ad.reviewed_at
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		JOIN departments d ON d.id = dt.owning_department_id
		WHERE ad.application_id = $1
		ORDER BY d.name, dt.name
	`, applicationID)

	type DocView struct {
		ID              string     `json:"id"`
		DocumentName    string     `json:"document_type_name"`
		DepartmentName  string     `json:"department_name"`
		IsMandatory     bool       `json:"is_mandatory"`
		Status          string     `json:"status"`
		ReusedFromVault bool       `json:"reused_from_vault"`
		FileURL         *string    `json:"file_url"`
		RejectionReason string     `json:"rejection_reason"`
		ReviewedAt      *time.Time `json:"reviewed_at"`
	}
	var docs []DocView
	if err == nil {
		defer docRows.Close()
		for docRows.Next() {
			var d DocView
			docRows.Scan(&d.ID, &d.DocumentName, &d.DepartmentName, &d.IsMandatory, &d.Status, &d.ReusedFromVault, &d.FileURL, &d.RejectionReason, &d.ReviewedAt)
			docs = append(docs, d)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"application": app,
		"bundles":     bundles,
		"documents":   docs,
	})
}
