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

// Queue returns the pending-review documents in bundles assigned to the caller.
func (h *DeptAdminHandler) Queue(c *gin.Context) {
	userID := c.GetString("user_id")
	rows, err := h.DB.Query(c, `
		SELECT ad.id, ad.application_id, dt.name, ad.file_url, ad.status, ad.bundle_id
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		JOIN document_bundles db ON db.id = ad.bundle_id
		WHERE db.assigned_admin_id = $1 AND ad.status = 'pending_review'
		ORDER BY ad.created_at
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type item struct {
		AppDocID      string  `json:"application_document_id"`
		ApplicationID string  `json:"application_id"`
		DocumentName  string  `json:"document_name"`
		FileURL       *string `json:"file_url"`
		Status        string  `json:"status"`
		BundleID      *string `json:"bundle_id"`
	}
	var out []item
	for rows.Next() {
		var it item
		rows.Scan(&it.AppDocID, &it.ApplicationID, &it.DocumentName, &it.FileURL, &it.Status, &it.BundleID)
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

// Approve marks one document approved, sets its expiry from document_types.validity_days,
// and — critically — writes/updates the applicant's vault entry (Once-Only, Section 7).
// If this was the last pending mandatory document in its bundle, the bundle is closed.
func (h *DeptAdminHandler) Approve(c *gin.Context) {
	appDocID := c.Param("appDocID")
	userID := c.GetString("user_id")

	var applicationID, documentTypeID, bundleID string
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
		SET status='approved', reviewed_by=$1, reviewed_at=now(), expiry_date=$2
		WHERE id=$3
	`, userID, expiry, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Once-Only: upsert into the applicant's permanent vault.
	var applicantID, fileURL string
	h.DB.QueryRow(c, `SELECT applicant_id FROM applications WHERE id=$1`, applicationID).Scan(&applicantID)
	h.DB.QueryRow(c, `SELECT COALESCE(file_url,'') FROM application_documents WHERE id=$1`, appDocID).Scan(&fileURL)

	_, err = h.DB.Exec(c, `
		INSERT INTO applicant_vault (id, applicant_id, document_type_id, file_url, verification_status, verified_at, expiry_date)
		VALUES ($1,$2,$3,$4,'approved',now(),$5)
		ON CONFLICT (applicant_id, document_type_id)
		DO UPDATE SET file_url=EXCLUDED.file_url, verification_status='approved', verified_at=now(), expiry_date=EXCLUDED.expiry_date
	`, uuid.New().String(), applicantID, documentTypeID, fileURL, expiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "vault write failed: " + err.Error()})
		return
	}

	h.maybeCloseBundle(c, bundleID)

	c.JSON(http.StatusOK, gin.H{"status": "approved"})
}

// BulkApprove approves multiple documents in one call (Section 6.2 UI — "recommended path").
func (h *DeptAdminHandler) BulkApprove(c *gin.Context) {
	var req struct {
		AppDocIDs []string `json:"application_document_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Reuse single-approve logic per doc for correctness (vault + bundle-close side effects).
	for _, id := range req.AppDocIDs {
		c.Params = append(c.Params, gin.Param{Key: "appDocID", Value: id})
		h.Approve(c)
		c.Params = c.Params[:len(c.Params)-1]
	}
	c.JSON(http.StatusOK, gin.H{"status": "bulk approved", "count": len(req.AppDocIDs)})
}

// Reject marks a document rejected with a reason, and re-routes the WHOLE
// bundle (Section 11) — not just this document — the moment the applicant
// re-uploads. The reroute itself is triggered on re-upload (see Reupload below).
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
	c.JSON(http.StatusOK, gin.H{"status": "rejected"})
}

// Reupload is the applicant-facing re-submission of a rejected document.
// Per Section 11.2, this re-enters the WHOLE bundle into routing — not just
// the single document — while already-approved sibling documents in the
// bundle are left untouched (read-only context for whoever picks it up next).
func (h *DeptAdminHandler) Reupload(c *gin.Context) {
	appDocID := c.Param("appDocID")
	var req struct {
		FileURL string `json:"file_url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var applicationID, bundleID, departmentID string
	err := h.DB.QueryRow(c, `
		SELECT ad.application_id, ad.bundle_id, db.department_id
		FROM application_documents ad
		JOIN document_bundles db ON db.id = ad.bundle_id
		WHERE ad.id = $1
	`, appDocID).Scan(&applicationID, &bundleID, &departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "document/bundle not found"})
		return
	}

	_, err = h.DB.Exec(c, `
		UPDATE application_documents SET file_url=$1, status='pending_review', rejection_reason=NULL WHERE id=$2
	`, req.FileURL, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Rebuild the routing path from the applicant's own answers, same as initial dispatch.
	path, err := pathForDepartment(c, h.DB, applicationID, departmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	adminID, landedNode, err := h.Router.RerouteBundle(c, bundleID, departmentID, path)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"status": "reuploaded", "routing": "flagged for manual review (no admin found)"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "reuploaded", "reassigned_admin_id": adminID, "landed_org_node_id": landedNode})
}

func (h *DeptAdminHandler) maybeCloseBundle(c *gin.Context, bundleID string) {
	var pending int
	h.DB.QueryRow(c, `
		SELECT COUNT(*) FROM application_documents ad
		JOIN leaf_documents ld ON ld.id = ad.leaf_document_id
		WHERE ad.bundle_id = $1 AND ld.is_mandatory = true AND ad.status <> 'approved'
	`, bundleID).Scan(&pending)
	if pending == 0 {
		h.DB.Exec(c, `UPDATE document_bundles SET status='approved', completed_at=now() WHERE id=$1`, bundleID)
		h.DB.Exec(c, `INSERT INTO sla_events (bundle_id, event_type, note) VALUES ($1,'manually_approved','All mandatory documents approved by department admin before SLA breach')`, bundleID)
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
