package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/solvix/swagat/internal/routing"
)

type DeptAdminHandler struct {
	DB     *pgxpool.Pool
	Router *routing.Router
}

func NewDeptAdminHandler(db *pgxpool.Pool, r *routing.Router) *DeptAdminHandler {
	return &DeptAdminHandler{DB: db, Router: r}
}

// RegisterOrgNode lets a Department Admin register at any depth of their
// department's org tree (Section 9.3) — stopping early is allowed and simply
// means broader default workload via bubble-up routing later (Section 10.3).
func (h *DeptAdminHandler) Register(c *gin.Context) {
	var req struct {
		DepartmentID string `json:"department_id" binding:"required"`
		OrgNodeID    string `json:"org_node_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("user_id")
	id := uuid.New().String()
	_, err := h.DB.Exec(c, `
		INSERT INTO admin_registrations (id, user_id, department_id, org_node_id) VALUES ($1,$2,$3,$4)
		ON CONFLICT (user_id, department_id) DO UPDATE SET org_node_id = EXCLUDED.org_node_id
	`, id, userID, req.DepartmentID, req.OrgNodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "registered"})
}

// Queue returns the pending-review documents for department admins and super admins.
func (h *DeptAdminHandler) Queue(c *gin.Context) {
	userID := c.GetString("user_id")
	role := c.GetString("role")

	var rows pgxpool.Rows
	var err error

	if role == "super_admin" {
		// Super admins have visibility across all departments
		rows, err = h.DB.Query(c, `
			SELECT 
				ad.id, 
				ad.application_id, 
				COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(ad.application_id::text, 1, 8)) as tracking_number,
				dt.name as document_name, 
				d.name as department_name,
				u.full_name as applicant_name,
				u.email as applicant_email,
				COALESCE(a.company_name, u.full_name || ' Enterprises') as company_name,
				ad.file_url, 
				ad.status, 
				ad.bundle_id,
				ad.created_at,
				COALESCE(ad.rejection_reason, '') as rejection_reason
			FROM application_documents ad
			JOIN document_types dt ON dt.id = ad.document_type_id
			JOIN departments d ON d.id = dt.owning_department_id
			JOIN applications a ON a.id = ad.application_id
			JOIN applicants ap ON ap.id = a.applicant_id
			JOIN users u ON u.id = ap.user_id
			LEFT JOIN document_bundles db ON db.id = ad.bundle_id
			WHERE ad.status = 'pending_review' OR ad.status = 'rejected'
			ORDER BY ad.created_at DESC
		`)
	} else {
		// Department admin: documents assigned to caller, unassigned in department, or for their department
		rows, err = h.DB.Query(c, `
			SELECT 
				ad.id, 
				ad.application_id, 
				COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(ad.application_id::text, 1, 8)) as tracking_number,
				dt.name as document_name, 
				d.name as department_name,
				u.full_name as applicant_name,
				u.email as applicant_email,
				COALESCE(a.company_name, u.full_name || ' Enterprises') as company_name,
				ad.file_url, 
				ad.status, 
				ad.bundle_id,
				ad.created_at,
				COALESCE(ad.rejection_reason, '') as rejection_reason
			FROM application_documents ad
			JOIN document_types dt ON dt.id = ad.document_type_id
			JOIN departments d ON d.id = dt.owning_department_id
			JOIN applications a ON a.id = ad.application_id
			JOIN applicants ap ON ap.id = a.applicant_id
			JOIN users u ON u.id = ap.user_id
			LEFT JOIN document_bundles db ON db.id = ad.bundle_id
			WHERE (
				db.assigned_admin_id = $1 
				OR db.assigned_admin_id IS NULL 
				OR db.department_id IN (SELECT department_id FROM admin_registrations WHERE user_id = $1)
				OR dt.owning_department_id IN (SELECT department_id FROM admin_registrations WHERE user_id = $1)
			) AND (ad.status = 'pending_review' OR ad.status = 'rejected')
			ORDER BY ad.created_at DESC
		`, userID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type item struct {
		AppDocID        string     `json:"application_document_id"`
		ApplicationID   string     `json:"application_id"`
		TrackingNumber  string     `json:"tracking_number"`
		DocumentName    string     `json:"document_name"`
		DepartmentName  string     `json:"department_name"`
		ApplicantName   string     `json:"applicant_name"`
		ApplicantEmail  string     `json:"applicant_email"`
		CompanyName     string     `json:"company_name"`
		FileURL         *string    `json:"file_url"`
		Status          string     `json:"status"`
		BundleID        *string    `json:"bundle_id"`
		CreatedAt       *time.Time `json:"created_at"`
		RejectionReason string     `json:"rejection_reason"`
	}
	var out []item
	for rows.Next() {
		var it item
		rows.Scan(
			&it.AppDocID, 
			&it.ApplicationID, 
			&it.TrackingNumber,
			&it.DocumentName, 
			&it.DepartmentName,
			&it.ApplicantName,
			&it.ApplicantEmail,
			&it.CompanyName,
			&it.FileURL, 
			&it.Status, 
			&it.BundleID,
			&it.CreatedAt,
			&it.RejectionReason,
		)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

// Approve marks one document approved, sets expiry, updates vault, closes bundle/application if ready.
func (h *DeptAdminHandler) Approve(c *gin.Context) {
	appDocID := c.Param("appDocID")
	userID := c.GetString("user_id")

	var applicationID, documentTypeID string
	var bundleID *string
	var validityDays *int
	err := h.DB.QueryRow(c, `
		SELECT ad.application_id, ad.document_type_id, ad.bundle_id, dt.validity_days
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		WHERE ad.id = $1
	`, appDocID).Scan(&applicationID, &documentTypeID, &bundleID, &validityDays)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "document not found"})
		return
	}

	var expiry *time.Time
	if validityDays != nil {
		t := time.Now().AddDate(0, 0, *validityDays)
		expiry = &t
	}

	_, err = h.DB.Exec(c, `
		UPDATE application_documents
		SET status='approved', reviewed_by=$1, reviewed_at=now(), expiry_date=$2, rejection_reason=NULL
		WHERE id=$3
	`, userID, expiry, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Once-Only: upsert into applicant vault
	var applicantID, fileURL string
	h.DB.QueryRow(c, `SELECT applicant_id FROM applications WHERE id=$1`, applicationID).Scan(&applicantID)
	h.DB.QueryRow(c, `SELECT COALESCE(file_url,'') FROM application_documents WHERE id=$1`, appDocID).Scan(&fileURL)

	if applicantID != "" && documentTypeID != "" {
		_, _ = h.DB.Exec(c, `
			INSERT INTO applicant_vault (id, applicant_id, document_type_id, file_url, verification_status, verified_at, expiry_date)
			VALUES ($1,$2,$3,$4,'approved',now(),$5)
			ON CONFLICT (applicant_id, document_type_id)
			DO UPDATE SET file_url=EXCLUDED.file_url, verification_status='approved', verified_at=now(), expiry_date=EXCLUDED.expiry_date
		`, uuid.New().String(), applicantID, documentTypeID, fileURL, expiry)
	}

	if bundleID != nil && *bundleID != "" {
		h.maybeCloseBundle(c, *bundleID, applicationID)
	} else {
		h.checkApplicationCompletion(c, applicationID)
	}

	c.JSON(http.StatusOK, gin.H{"status": "approved", "application_document_id": appDocID})
}

// BulkApprove approves multiple documents in one call.
func (h *DeptAdminHandler) BulkApprove(c *gin.Context) {
	var req struct {
		AppDocIDs []string `json:"application_document_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for _, id := range req.AppDocIDs {
		c.Params = append(c.Params, gin.Param{Key: "appDocID", Value: id})
		h.Approve(c)
		c.Params = c.Params[:len(c.Params)-1]
	}
	c.JSON(http.StatusOK, gin.H{"status": "bulk approved", "count": len(req.AppDocIDs)})
}

// Reject marks a document rejected with a reason, and reflects the status back to applicant.
func (h *DeptAdminHandler) Reject(c *gin.Context) {
	appDocID := c.Param("appDocID")
	userID := c.GetString("user_id")
	var req struct {
		Reason string `json:"reason" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(c, `
		UPDATE application_documents
		SET status='rejected', reviewed_by=$1, reviewed_at=now(), rejection_reason=$2
		WHERE id=$3
	`, userID, req.Reason, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update bundle and application state to reflect rejection / query raised
	var applicationID string
	var bundleID *string
	_ = h.DB.QueryRow(c, `SELECT application_id, bundle_id FROM application_documents WHERE id=$1`, appDocID).Scan(&applicationID, &bundleID)

	if bundleID != nil && *bundleID != "" {
		_, _ = h.DB.Exec(c, `UPDATE document_bundles SET status='query_raised' WHERE id=$1`, *bundleID)
		_, _ = h.DB.Exec(c, `INSERT INTO sla_events (bundle_id, event_type, note) VALUES ($1, 'escalated', $2)`, *bundleID, "Document rejected: "+req.Reason)
	}

	if applicationID != "" {
		_, _ = h.DB.Exec(c, `
			UPDATE applications 
			SET status='query_raised', admin_remarks=$1 
			WHERE id=$2
		`, req.Reason, applicationID)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":                  "rejected",
		"application_document_id": appDocID,
		"reason":                  req.Reason,
	})
}

// Reupload is the applicant-facing re-submission of a rejected document.
func (h *DeptAdminHandler) Reupload(c *gin.Context) {
	appDocID := c.Param("appDocID")
	var req struct {
		FileURL string `json:"file_url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var applicationID, departmentID string
	var bundleID *string
	err := h.DB.QueryRow(c, `
		SELECT ad.application_id, ad.bundle_id, dt.owning_department_id
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		WHERE ad.id = $1
	`, appDocID).Scan(&applicationID, &bundleID, &departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "document not found"})
		return
	}

	_, err = h.DB.Exec(c, `
		UPDATE application_documents 
		SET file_url=$1, status='pending_review', rejection_reason=NULL 
		WHERE id=$2
	`, req.FileURL, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reset application to in_review
	_, _ = h.DB.Exec(c, `UPDATE applications SET status='in_review' WHERE id=$1`, applicationID)

	if bundleID != nil && *bundleID != "" {
		_, _ = h.DB.Exec(c, `UPDATE document_bundles SET status='in_review' WHERE id=$1`, *bundleID)
		path, _ := pathForDepartment(c, h.DB, applicationID, departmentID)
		adminID, landedNode, _ := h.Router.RerouteBundle(c, *bundleID, departmentID, path)
		c.JSON(http.StatusOK, gin.H{
			"status":              "reuploaded",
			"reassigned_admin_id": adminID,
			"landed_org_node_id":  landedNode,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "reuploaded"})
}

func (h *DeptAdminHandler) maybeCloseBundle(c *gin.Context, bundleID, applicationID string) {
	var pending int
	h.DB.QueryRow(c, `
		SELECT COUNT(*) FROM application_documents
		WHERE bundle_id = $1 AND COALESCE(is_mandatory, true) = true AND status <> 'approved'
	`, bundleID).Scan(&pending)

	if pending == 0 {
		h.DB.Exec(c, `UPDATE document_bundles SET status='approved', completed_at=now() WHERE id=$1`, bundleID)
		h.DB.Exec(c, `INSERT INTO sla_events (bundle_id, event_type, note) VALUES ($1,'manually_approved','All mandatory documents approved by department admin')`, bundleID)
	}

	h.checkApplicationCompletion(c, applicationID)
}

func (h *DeptAdminHandler) checkApplicationCompletion(c *gin.Context, applicationID string) {
	var pendingInApp int
	h.DB.QueryRow(c, `
		SELECT COUNT(*) FROM application_documents
		WHERE application_id = $1 AND COALESCE(is_mandatory, true) = true AND status <> 'approved'
	`, applicationID).Scan(&pendingInApp)

	if pendingInApp == 0 {
		// All documents across all departments approved!
		h.DB.Exec(c, `
			UPDATE applications 
			SET status='approved' 
			WHERE id=$1
		`, applicationID)
	} else {
		// Still some pending or under review
		h.DB.Exec(c, `
			UPDATE applications 
			SET status='in_review' 
			WHERE id=$1 AND status NOT IN ('approved', 'query_raised')
		`, applicationID)
	}
}

// pathForDepartment mirrors dispatch.Engine.pathForBundle — duplicated locally
// to avoid a handlers->dispatch->handlers import cycle; both implement the
// same label-matching walk described in System Design Section 10.2.
func pathForDepartment(c *gin.Context, db *pgxpool.Pool, applicationID, departmentID string) ([]string, error) {
	rows, err := db.Query(c, `SELECT unnest(path_node_ids) FROM application_step_answers WHERE application_id=$1`, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var businessPathIDs []string
	for rows.Next() {
		var id string
		rows.Scan(&id)
		businessPathIDs = append(businessPathIDs, id)
	}

	labelRows, err := db.Query(c, `SELECT label FROM tree_nodes WHERE id = ANY($1) ORDER BY sort_order`, businessPathIDs)
	if err != nil {
		return nil, err
	}
	defer labelRows.Close()
	var labels []string
	for labelRows.Next() {
		var l string
		labelRows.Scan(&l)
		labels = append(labels, l)
	}

	var path []string
	var parentID *string
	for _, label := range labels {
		var nodeID string
		var err error
		if parentID == nil {
			err = db.QueryRow(c, `SELECT id FROM tree_nodes WHERE tree_type='org' AND department_id=$1 AND label=$2 AND parent_id IS NULL LIMIT 1`, departmentID, label).Scan(&nodeID)
		} else {
			err = db.QueryRow(c, `SELECT id FROM tree_nodes WHERE tree_type='org' AND department_id=$1 AND label=$2 AND parent_id=$3 LIMIT 1`, departmentID, label, *parentID).Scan(&nodeID)
		}
		if err != nil {
			break
		}
		path = append(path, nodeID)
		parentID = &nodeID
	}
	return path, nil
}
