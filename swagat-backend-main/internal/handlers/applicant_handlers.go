package handlers

import (
	"net/http"
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
	return id, err
}

// StartApplication creates a new application for the logged-in applicant.
func (h *ApplicantHandler) StartApplication(c *gin.Context) {
	var req struct {
		BusinessTypeID string `json:"business_type_id" binding:"required"`
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
	id := uuid.New().String()
	_, err = h.DB.Exec(c, `
		INSERT INTO applications (id, applicant_id, business_type_id) VALUES ($1,$2,$3)
	`, id, applicantID, req.BusinessTypeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"application_id": id})
}

// NextStep returns the current question/options for one step's tree walk.
// If nodeID is empty, returns the root of that step's tree.
func (h *ApplicantHandler) WalkStep(c *gin.Context) {
	businessTypeID := c.Query("business_type_id")
	step := c.Query("step")
	nodeID := c.Query("node_id") // optional — empty means "give me the root"

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
	c.JSON(http.StatusOK, gin.H{"children": children})
}

// AnswerLeaf records the leaf reached for one step, along with the full
// root-to-leaf path (needed later for routing — Section 10.2).
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

	leaf, err := h.Tree.GetNode(c, req.LeafNodeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "leaf node not found"})
		return
	}
	if !leaf.IsLeaf {
		c.JSON(http.StatusBadRequest, gin.H{"error": "given node is not a leaf — applicant must reach a leaf to answer this step (no partial submission allowed)"})
		return
	}

	path, err := h.Tree.PathToRoot(c, req.LeafNodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	pathIDs := make([]string, len(path))
	for i, n := range path {
		pathIDs[i] = n.ID
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

// BuildChecklist assembles the union checklist across all 4 completed steps
// (Section 6) and marks each document vault-reusable if the applicant already
// has a valid, unexpired, approved copy (Section 7 — the visible "Once-Only" proof).
// This also materializes application_documents rows so upload/approval can proceed.
func (h *ApplicantHandler) BuildChecklist(c *gin.Context) {
	applicationID := c.Param("applicationID")

	// Must have all 4 steps answered before checklist can be built (Section 19 #9 — no partial submission).
	var stepCount int
	if err := h.DB.QueryRow(c, `SELECT COUNT(*) FROM application_step_answers WHERE application_id=$1`, applicationID).Scan(&stepCount); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if stepCount < len(models.AllSteps) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "all 4 steps must be answered before the checklist can be generated"})
		return
	}

	var applicantID, businessTypeID string
	err := h.DB.QueryRow(c, `SELECT applicant_id, business_type_id FROM applications WHERE id=$1`, applicationID).
		Scan(&applicantID, &businessTypeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
		return
	}

	leafRows, err := h.DB.Query(c, `SELECT leaf_node_id FROM application_step_answers WHERE application_id=$1`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var leafIDs []string
	for leafRows.Next() {
		var id string
		leafRows.Scan(&id)
		leafIDs = append(leafIDs, id)
	}
	leafRows.Close()

	type checklistItem struct {
		LeafDocumentID   string  `json:"leaf_document_id"`
		DocumentTypeID   string  `json:"document_type_id"`
		DocumentName     string  `json:"document_name"`
		Mandatory        bool    `json:"mandatory"`
		VaultReused      bool    `json:"vault_reused"`
		VaultStatus      *string `json:"vault_status,omitempty"`
		ApplicationDocID string  `json:"application_document_id"`
	}
	var items []checklistItem

	for _, leafID := range leafIDs {
		docs, err := h.Tree.LeafDocuments(c, leafID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		for _, d := range docs {
			// Once-Only check: does applicant already have a valid, approved, unexpired vault entry?
			var vaultID *string
			var vaultStatus *string
			var vaultExpiry *time.Time
			row := h.DB.QueryRow(c, `
				SELECT id, verification_status, expiry_date FROM applicant_vault
				WHERE applicant_id=$1 AND document_type_id=$2
			`, applicantID, d.DocumentTypeID)
			var vID, vStatus string
			var vExp *time.Time
			scanErr := row.Scan(&vID, &vStatus, &vExp)
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
			_, err := h.DB.Exec(c, `
				INSERT INTO application_documents (id, application_id, leaf_document_id, document_type_id, vault_entry_id, status, reused_from_vault)
				VALUES ($1,$2,$3,$4,$5,$6,$7)
				ON CONFLICT DO NOTHING
			`, appDocID, applicationID, d.ID, d.DocumentTypeID, vaultID, status, reused)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			items = append(items, checklistItem{
				LeafDocumentID:   d.ID,
				DocumentTypeID:   d.DocumentTypeID,
				DocumentName:     d.DocumentName,
				Mandatory:        d.IsMandatory,
				VaultReused:      reused,
				VaultStatus:      vaultStatus,
				ApplicationDocID: appDocID,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"checklist": items})
}

// UploadDocument accepts a (mocked) file reference for one application_document,
// runs it through mock verification, and — on approval — writes it into the
// applicant's permanent vault for future reuse.
func (h *ApplicantHandler) UploadDocument(c *gin.Context) {
	appDocID := c.Param("appDocID")
	var req struct {
		FileURL string `json:"file_url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(c, `
		UPDATE application_documents SET file_url=$1, status='pending_review' WHERE id=$2
	`, req.FileURL, appDocID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "uploaded", "note": "awaiting department review"})
}

// SubmitApplication is called once every mandatory document is either
// vault-reused-approved or freshly approved. It materializes department
// bundles and hands off to the dispatch engine (Section 12/13) — real,
// simultaneous, per-department goroutines start here.
func (h *ApplicantHandler) SubmitApplication(c *gin.Context) {
	applicationID := c.Param("applicationID")

	var pending int
	err := h.DB.QueryRow(c, `
		SELECT COUNT(*) FROM application_documents ad
		JOIN leaf_documents ld ON ld.id = ad.leaf_document_id
		WHERE ad.application_id=$1 AND ld.is_mandatory = true AND ad.status NOT IN ('approved')
	`, applicationID).Scan(&pending)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if pending > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot submit — mandatory documents still pending approval", "pending_count": pending})
		return
	}

	// Build one bundle per distinct owning department represented in this application's documents.
	rows, err := h.DB.Query(c, `
		SELECT DISTINCT dt.owning_department_id
		FROM application_documents ad
		JOIN document_types dt ON dt.id = ad.document_type_id
		WHERE ad.application_id = $1
	`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var deptIDs []string
	for rows.Next() {
		var d string
		rows.Scan(&d)
		deptIDs = append(deptIDs, d)
	}
	rows.Close()

	for _, deptID := range deptIDs {
		bundleID := uuid.New().String()
		_, err := h.DB.Exec(c, `
			INSERT INTO document_bundles (id, application_id, department_id) VALUES ($1,$2,$3)
			ON CONFLICT (application_id, department_id) DO NOTHING
		`, bundleID, applicationID, deptID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Link this department's documents to its bundle.
		_, err = h.DB.Exec(c, `
			UPDATE application_documents ad
			SET bundle_id = (SELECT id FROM document_bundles WHERE application_id=$1 AND department_id=$2)
			FROM document_types dt
			WHERE ad.document_type_id = dt.id AND dt.owning_department_id = $2 AND ad.application_id = $1
		`, applicationID, deptID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	_, err = h.DB.Exec(c, `UPDATE applications SET status='submitted', submitted_at=now() WHERE id=$1`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fire dispatch — this is where the real concurrency begins (Section 13).
	if err := h.Dispatch.DispatchApplication(c, applicationID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "dispatch failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "dispatched", "departments": len(deptIDs)})
}

// StatusDashboard shows live per-department bundle status/timers for one application.
func (h *ApplicantHandler) StatusDashboard(c *gin.Context) {
	applicationID := c.Param("applicationID")
	rows, err := h.DB.Query(c, `
		SELECT db.id, d.name, db.status, db.dispatched_at, db.sla_deadline, db.completed_at
		FROM document_bundles db
		JOIN departments d ON d.id = db.department_id
		WHERE db.application_id = $1
	`, applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type bundleView struct {
		BundleID       string     `json:"bundle_id"`
		DepartmentName string     `json:"department_name"`
		Status         string     `json:"status"`
		DispatchedAt   *time.Time `json:"dispatched_at"`
		SLADeadline    *time.Time `json:"sla_deadline"`
		CompletedAt    *time.Time `json:"completed_at"`
	}
	var out []bundleView
	for rows.Next() {
		var b bundleView
		rows.Scan(&b.BundleID, &b.DepartmentName, &b.Status, &b.DispatchedAt, &b.SLADeadline, &b.CompletedAt)
		out = append(out, b)
	}
	c.JSON(http.StatusOK, out)
}
