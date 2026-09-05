package handlers

import (
	"net/http"

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
