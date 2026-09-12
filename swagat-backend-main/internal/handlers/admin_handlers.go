package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/solvix/swagat/internal/models"
	"github.com/solvix/swagat/internal/tree"
)

type AdminHandler struct {
	DB   *pgxpool.Pool
	Tree *tree.Engine
}

func NewAdminHandler(db *pgxpool.Pool, t *tree.Engine) *AdminHandler {
	return &AdminHandler{DB: db, Tree: t}
}

// ---------- Business Types ----------

func (h *AdminHandler) CreateBusinessType(c *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid := c.GetString("user_id")
	id := uuid.New().String()
	_, err := h.DB.Exec(c, `INSERT INTO business_types (id, name, created_by) VALUES ($1,$2,$3)`, id, req.Name, uid)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id, "name": req.Name})
}

func (h *AdminHandler) ListBusinessTypes(c *gin.Context) {
	rows, err := h.DB.Query(c, `SELECT id, name FROM business_types ORDER BY name`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	var out []models.BusinessType
	for rows.Next() {
		var b models.BusinessType
		rows.Scan(&b.ID, &b.Name)
		out = append(out, b)
	}
	c.JSON(http.StatusOK, out)
}

// ---------- Departments ----------

func (h *AdminHandler) CreateDepartment(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		SLAHours int    `json:"sla_hours"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.SLAHours == 0 {
		req.SLAHours = 72
	}
	uid := c.GetString("user_id")
	id := uuid.New().String()
	_, err := h.DB.Exec(c, `INSERT INTO departments (id, name, sla_hours, created_by) VALUES ($1,$2,$3,$4)`,
		id, req.Name, req.SLAHours, uid)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id, "name": req.Name, "sla_hours": req.SLAHours})
}

func (h *AdminHandler) ListDepartments(c *gin.Context) {
	rows, err := h.DB.Query(c, `SELECT id, name, sla_hours FROM departments ORDER BY name`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	var out []models.Department
	for rows.Next() {
		var d models.Department
		rows.Scan(&d.ID, &d.Name, &d.SLAHours)
		out = append(out, d)
	}
	c.JSON(http.StatusOK, out)
}

// ---------- Document Types ----------

func (h *AdminHandler) CreateDocumentType(c *gin.Context) {
	var req struct {
		Name               string `json:"name" binding:"required"`
		OwningDepartmentID string `json:"owning_department_id" binding:"required"`
		ValidityDays       *int   `json:"validity_days"`
		TemplateFileURL    string `json:"template_file_url"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id := uuid.New().String()
	_, err := h.DB.Exec(c, `
		INSERT INTO document_types (id, name, owning_department_id, validity_days, template_file_url)
		VALUES ($1,$2,$3,$4,$5)
	`, id, req.Name, req.OwningDepartmentID, req.ValidityDays, nullIfEmpty(req.TemplateFileURL))
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func nullIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// ---------- Tree node CRUD (GUI path) ----------

func (h *AdminHandler) CreateBusinessNode(c *gin.Context) {
	var req struct {
		BusinessTypeID string  `json:"business_type_id" binding:"required"`
		Step           string  `json:"step" binding:"required"`
		ParentID       *string `json:"parent_id"`
		NodeType       string  `json:"node_type" binding:"required,oneof=question option"`
		Label          string  `json:"label" binding:"required"`
		IsLeaf         bool    `json:"is_leaf"`
		SortOrder      int     `json:"sort_order"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	step := models.Step(req.Step)
	n := models.TreeNode{
		TreeType:       models.TreeTypeBusiness,
		BusinessTypeID: &req.BusinessTypeID,
		Step:           &step,
		ParentID:       req.ParentID,
		NodeType:       models.NodeType(req.NodeType),
		Label:          req.Label,
		IsLeaf:         req.IsLeaf,
		SortOrder:      req.SortOrder,
	}
	id, err := h.Tree.CreateNode(c, n)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *AdminHandler) CreateOrgNode(c *gin.Context) {
	var req struct {
		DepartmentID string  `json:"department_id" binding:"required"`
		ParentID     *string `json:"parent_id"`
		NodeType     string  `json:"node_type" binding:"required,oneof=question option"`
		Label        string  `json:"label" binding:"required"`
		IsLeaf       bool    `json:"is_leaf"`
		SortOrder    int     `json:"sort_order"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	n := models.TreeNode{
		TreeType:     models.TreeTypeOrg,
		DepartmentID: &req.DepartmentID,
		ParentID:     req.ParentID,
		NodeType:     models.NodeType(req.NodeType),
		Label:        req.Label,
		IsLeaf:       req.IsLeaf,
		SortOrder:    req.SortOrder,
	}
	id, err := h.Tree.CreateNode(c, n)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *AdminHandler) AttachLeafDocument(c *gin.Context) {
	var req struct {
		LeafNodeID     string  `json:"leaf_node_id" binding:"required"`
		DocumentTypeID string  `json:"document_type_id" binding:"required"`
		Mandatory      bool    `json:"mandatory"`
		DependsOn      *string `json:"depends_on"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, err := h.Tree.AttachDocument(c, req.LeafNodeID, req.DocumentTypeID, req.Mandatory, req.DependsOn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

// ---------- JSON bulk import (Section 15) ----------

func (h *AdminHandler) ImportBusinessTree(c *gin.Context) {
	businessTypeID := c.Param("businessTypeID")
	step := c.Param("step")

	var body struct {
		Root               tree.ImportNode   `json:"root" binding:"required"`
		DocumentTypeByName map[string]string `json:"document_type_by_name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Tree.ImportBusinessTree(c, businessTypeID, models.Step(step), body.Root, body.DocumentTypeByName); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "imported"})
}

func (h *AdminHandler) ImportOrgTree(c *gin.Context) {
	departmentID := c.Param("departmentID")
	var body struct {
		Root tree.ImportNode `json:"root" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Tree.ImportOrgTree(c, departmentID, body.Root); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "imported"})
}

// ---------- Tree viewers ----------

func (h *AdminHandler) ViewBusinessTree(c *gin.Context) {
	businessTypeID := c.Param("businessTypeID")
	step := c.Param("step")
	nodes, err := h.Tree.WholeBusinessTree(c, businessTypeID, models.Step(step))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, nodes)
}

func (h *AdminHandler) ViewOrgTree(c *gin.Context) {
	departmentID := c.Param("departmentID")
	nodes, err := h.Tree.WholeOrgTree(c, departmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, nodes)
}

// CoverageView (Section 9.5): org tree with a live admin-count per node,
// so gaps that the bubble-up router would have to climb past are visible.
func (h *AdminHandler) OrgCoverage(c *gin.Context) {
	departmentID := c.Param("departmentID")
	rows, err := h.DB.Query(c, `
		SELECT tn.id, tn.label, tn.parent_id, COUNT(ar.id) AS admin_count
		FROM tree_nodes tn
		LEFT JOIN admin_registrations ar ON ar.org_node_id = tn.id AND ar.department_id = $1
		WHERE tn.tree_type='org' AND tn.department_id = $1
		GROUP BY tn.id, tn.label, tn.parent_id
		ORDER BY tn.sort_order
	`, departmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	type row struct {
		ID         string  `json:"id"`
		Label      string  `json:"label"`
		ParentID   *string `json:"parent_id"`
		AdminCount int     `json:"admin_count"`
	}
	var out []row
	for rows.Next() {
		var r row
		rows.Scan(&r.ID, &r.Label, &r.ParentID, &r.AdminCount)
		out = append(out, r)
	}
	c.JSON(http.StatusOK, out)
}

// ---------- User Directory & Registration Tracking ----------

func (h *AdminHandler) ListUsers(c *gin.Context) {
	rows, err := h.DB.Query(c, `
		SELECT 
			u.id, 
			u.email, 
			u.full_name, 
			u.role, 
			COALESCE(u.status, 'Active') as status, 
			u.created_at,
			COUNT(DISTINCT a.id) as applications_count
		FROM users u
		LEFT JOIN applicants ap ON ap.user_id = u.id
		LEFT JOIN applications a ON a.applicant_id = ap.id
		GROUP BY u.id, u.email, u.full_name, u.role, u.status, u.created_at
		ORDER BY u.created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type UserItem struct {
		ID                string    `json:"id"`
		Email             string    `json:"email"`
		FullName          string    `json:"full_name"`
		Role              string    `json:"role"`
		Status            string    `json:"status"`
		CreatedAt         time.Time `json:"created_at"`
		ApplicationsCount int       `json:"applications_count"`
	}
	var out []UserItem
	for rows.Next() {
		var it UserItem
		rows.Scan(&it.ID, &it.Email, &it.FullName, &it.Role, &it.Status, &it.CreatedAt, &it.ApplicationsCount)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

func (h *AdminHandler) ToggleUserStatus(c *gin.Context) {
	userID := c.Param("userID")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := h.DB.Exec(c, `UPDATE users SET status=$1 WHERE id=$2`, req.Status, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": req.Status})
}

// ---------- System-Wide Applications Governance ----------

func (h *AdminHandler) ListApplications(c *gin.Context) {
	rows, err := h.DB.Query(c, `
		SELECT 
			a.id, 
			COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(a.id::text, 1, 8)) as tracking_number,
			u.full_name as applicant_name,
			u.email as applicant_email,
			COALESCE(a.company_name, u.full_name || ' Enterprises') as company_name,
			COALESCE(a.state_name, 'Maharashtra') as state_name,
			bt.name as sector,
			a.status,
			COALESCE(a.project_title, bt.name || ' Facility') as project_title,
			COALESCE(a.investment_amount, '₹25.0 Crore') as investment_amount,
			COALESCE(a.admin_remarks, '') as admin_remarks,
			a.created_at,
			a.submitted_at,
			COUNT(ad.id) as documents_count,
			COUNT(CASE WHEN ad.status = 'approved' THEN 1 END) as approved_count,
			COUNT(CASE WHEN ad.status = 'pending_review' THEN 1 END) as pending_count,
			COUNT(CASE WHEN ad.status = 'rejected' THEN 1 END) as rejected_count
		FROM applications a
		JOIN applicants ap ON ap.id = a.applicant_id
		JOIN users u ON u.id = ap.user_id
		JOIN business_types bt ON bt.id = a.business_type_id
		LEFT JOIN application_documents ad ON ad.application_id = a.id
		GROUP BY a.id, a.tracking_number, u.full_name, u.email, a.company_name, a.state_name, bt.name, a.status, a.project_title, a.investment_amount, a.admin_remarks, a.created_at, a.submitted_at
		ORDER BY a.created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type AppItem struct {
		ID               string     `json:"id"`
		TrackingNumber   string     `json:"tracking_number"`
		ApplicantName    string     `json:"applicant_name"`
		ApplicantEmail   string     `json:"applicant_email"`
		CompanyName      string     `json:"company_name"`
		StateName        string     `json:"state_name"`
		Sector           string     `json:"sector"`
		Status           string     `json:"status"`
		ProjectTitle     string     `json:"project_title"`
		InvestmentAmount string     `json:"investment_amount"`
		AdminRemarks     string     `json:"admin_remarks"`
		CreatedAt        time.Time  `json:"created_at"`
		SubmittedAt      *time.Time `json:"submitted_at"`
		DocumentsCount   int        `json:"documents_count"`
		ApprovedCount    int        `json:"approved_count"`
		PendingCount     int        `json:"pending_count"`
		RejectedCount    int        `json:"rejected_count"`
	}
	var out []AppItem
	for rows.Next() {
		var it AppItem
		rows.Scan(
			&it.ID, &it.TrackingNumber, &it.ApplicantName, &it.ApplicantEmail,
			&it.CompanyName, &it.StateName, &it.Sector, &it.Status,
			&it.ProjectTitle, &it.InvestmentAmount, &it.AdminRemarks,
			&it.CreatedAt, &it.SubmittedAt,
			&it.DocumentsCount, &it.ApprovedCount, &it.PendingCount, &it.RejectedCount,
		)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

func (h *AdminHandler) GetApplicationDetail(c *gin.Context) {
	appID := c.Param("applicationID")

	type AppDetail struct {
		ID               string     `json:"id"`
		TrackingNumber   string     `json:"tracking_number"`
		ApplicantName    string     `json:"applicant_name"`
		ApplicantEmail   string     `json:"applicant_email"`
		CompanyName      string     `json:"company_name"`
		StateName        string     `json:"state_name"`
		Sector           string     `json:"sector"`
		Status           string     `json:"status"`
		ProjectTitle     string     `json:"project_title"`
		InvestmentAmount string     `json:"investment_amount"`
		AdminRemarks     string     `json:"admin_remarks"`
		CreatedAt        time.Time  `json:"created_at"`
		SubmittedAt      *time.Time `json:"submitted_at"`
	}
	var app AppDetail
	err := h.DB.QueryRow(c, `
		SELECT 
			a.id, 
			COALESCE(a.tracking_number, 'SWG-2026-' || SUBSTRING(a.id::text, 1, 8)) as tracking_number,
			u.full_name as applicant_name,
			u.email as applicant_email,
			COALESCE(a.company_name, u.full_name || ' Enterprises') as company_name,
			COALESCE(a.state_name, 'Maharashtra') as state_name,
			bt.name as sector,
			a.status,
			COALESCE(a.project_title, bt.name || ' Facility') as project_title,
			COALESCE(a.investment_amount, '₹25.0 Crore') as investment_amount,
			COALESCE(a.admin_remarks, '') as admin_remarks,
			a.created_at,
			a.submitted_at
		FROM applications a
		JOIN applicants ap ON ap.id = a.applicant_id
		JOIN users u ON u.id = ap.user_id
		JOIN business_types bt ON bt.id = a.business_type_id
		WHERE a.id = $1
	`, appID).Scan(
		&app.ID, &app.TrackingNumber, &app.ApplicantName, &app.ApplicantEmail,
		&app.CompanyName, &app.StateName, &app.Sector, &app.Status,
		&app.ProjectTitle, &app.InvestmentAmount, &app.AdminRemarks,
		&app.CreatedAt, &app.SubmittedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
		return
	}

	// Fetch documents
	docRows, _ := h.DB.Query(c, `
		SELECT 
			ad.id, 
			dt.name as document_name, 
			d.name as department_name, 
			COALESCE(ad.is_mandatory, true) as is_mandatory,
			ad.status, 
			ad.reused_from_vault, 
			ad.file_url,
			COALESCE(ad.rejection_reason, '') as rejection_reason,
			ad.reviewed_at,
			ad.created_at
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		JOIN departments d ON d.id = dt.owning_department_id
		WHERE ad.application_id = $1
		ORDER BY ad.created_at ASC
	`, appID)

	type DocDetail struct {
		ID              string     `json:"id"`
		DocumentName    string     `json:"document_name"`
		DepartmentName  string     `json:"department_name"`
		IsMandatory     bool       `json:"is_mandatory"`
		Status          string     `json:"status"`
		ReusedFromVault bool       `json:"reused_from_vault"`
		FileURL         *string    `json:"file_url"`
		RejectionReason string     `json:"rejection_reason"`
		ReviewedAt      *time.Time `json:"reviewed_at"`
		CreatedAt       time.Time  `json:"created_at"`
	}
	var docs []DocDetail
	if docRows != nil {
		defer docRows.Close()
		for docRows.Next() {
			var d DocDetail
			docRows.Scan(
				&d.ID, &d.DocumentName, &d.DepartmentName, &d.IsMandatory,
				&d.Status, &d.ReusedFromVault, &d.FileURL, &d.RejectionReason,
				&d.ReviewedAt, &d.CreatedAt,
			)
			docs = append(docs, d)
		}
	}

	// Fetch bundles
	bundleRows, _ := h.DB.Query(c, `
		SELECT db.id, d.name, db.status, db.dispatched_at, db.sla_deadline, db.completed_at, d.sla_hours
		FROM document_bundles db
		JOIN departments d ON d.id = db.department_id
		WHERE db.application_id = $1
	`, appID)

	type BundleDetail struct {
		ID             string     `json:"id"`
		DepartmentName string     `json:"department_name"`
		Status         string     `json:"status"`
		DispatchedAt   *time.Time `json:"dispatched_at"`
		SLADeadline    *time.Time `json:"sla_deadline"`
		CompletedAt    *time.Time `json:"completed_at"`
		SLAHours       int        `json:"sla_hours"`
	}
	var bundles []BundleDetail
	if bundleRows != nil {
		defer bundleRows.Close()
		for bundleRows.Next() {
			var b BundleDetail
			bundleRows.Scan(&b.ID, &b.DepartmentName, &b.Status, &b.DispatchedAt, &b.SLADeadline, &b.CompletedAt, &b.SLAHours)
			bundles = append(bundles, b)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"application": app,
		"documents":   docs,
		"bundles":     bundles,
	})
}

func (h *AdminHandler) UpdateApplicationStatus(c *gin.Context) {
	appID := c.Param("applicationID")
	userID := c.GetString("user_id")

	var req struct {
		Status  string `json:"status" binding:"required"`
		Remarks string `json:"remarks"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	normalized := strings.ToLower(req.Status)
	var dbStatus string
	switch normalized {
	case "approved":
		dbStatus = "approved"
	case "rejected":
		dbStatus = "rejected"
	case "query raised", "query_raised":
		dbStatus = "query_raised"
	case "under review", "under_review", "in_review":
		dbStatus = "in_review"
	default:
		dbStatus = "in_review"
	}

	_, err := h.DB.Exec(c, `
		UPDATE applications 
		SET status = $1, admin_remarks = $2 
		WHERE id = $3
	`, dbStatus, req.Remarks, appID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if dbStatus == "approved" {
		_, _ = h.DB.Exec(c, `
			UPDATE application_documents 
			SET status = 'approved', reviewed_by = $1, reviewed_at = now(), rejection_reason = NULL 
			WHERE application_id = $2 AND status <> 'approved'
		`, userID, appID)
		_, _ = h.DB.Exec(c, `
			UPDATE document_bundles 
			SET status = 'approved', completed_at = now() 
			WHERE application_id = $1
		`, appID)
	} else if dbStatus == "rejected" {
		_, _ = h.DB.Exec(c, `
			UPDATE application_documents 
			SET status = 'rejected', reviewed_by = $1, reviewed_at = now(), rejection_reason = $2 
			WHERE application_id = $3 AND status <> 'approved'
		`, userID, req.Remarks, appID)
		_, _ = h.DB.Exec(c, `
			UPDATE document_bundles 
			SET status = 'rejected' 
			WHERE application_id = $1
		`, appID)
	}

	c.JSON(http.StatusOK, gin.H{"status": dbStatus, "application_id": appID})
}

func (h *AdminHandler) AdminDocumentQueue(c *gin.Context) {
	rows, err := h.DB.Query(c, `
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
		ORDER BY ad.created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type QueueItem struct {
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
	var out []QueueItem
	for rows.Next() {
		var it QueueItem
		rows.Scan(
			&it.AppDocID, &it.ApplicationID, &it.TrackingNumber,
			&it.DocumentName, &it.DepartmentName, &it.ApplicantName, &it.ApplicantEmail,
			&it.CompanyName, &it.FileURL, &it.Status, &it.BundleID,
			&it.CreatedAt, &it.RejectionReason,
		)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}
