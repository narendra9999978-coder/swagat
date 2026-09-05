// Package tree implements the single generic tree engine reused for both
// the applicant-facing business/checklist tree and the department org taxonomy.
// It is deliberately domain-agnostic: it has no idea whether it is walking
// a "Hotel" tree or a "Fire Dept" org tree.
package tree

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/solvix/swagat/internal/models"
)

type Engine struct {
	DB *pgxpool.Pool
}

func NewEngine(db *pgxpool.Pool) *Engine {
	return &Engine{DB: db}
}

// CreateNode inserts a single node (question or option) under an optional parent.
// For tree_type=business, businessTypeID+step must be set, departmentID must be nil.
// For tree_type=org, departmentID must be set, businessTypeID/step must be nil.
func (e *Engine) CreateNode(ctx context.Context, n models.TreeNode) (string, error) {
	id := uuid.New().String()
	_, err := e.DB.Exec(ctx, `
		INSERT INTO tree_nodes (id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`, id, n.TreeType, n.BusinessTypeID, n.Step, n.DepartmentID, n.ParentID, n.NodeType, n.Label, n.IsLeaf, n.SortOrder)
	if err != nil {
		return "", fmt.Errorf("create node: %w", err)
	}
	return id, nil
}

// Children returns the immediate children of a node, ordered for display.
// Passing parentID=nil returns root nodes for the given scope.
func (e *Engine) Children(ctx context.Context, parentID *string, treeType models.TreeType, scopeID *string, step *models.Step) ([]models.TreeNode, error) {
	var rows pgx.Rows
	var err error

	base := `SELECT id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order
		FROM tree_nodes WHERE tree_type = $1`

	args := []interface{}{treeType}
	argN := 1

	if parentID == nil {
		base += " AND parent_id IS NULL"
	} else {
		argN++
		base += fmt.Sprintf(" AND parent_id = $%d", argN)
		args = append(args, *parentID)
	}

	if treeType == models.TreeTypeBusiness {
		argN++
		base += fmt.Sprintf(" AND business_type_id = $%d", argN)
		args = append(args, scopeID)
		if step != nil {
			argN++
			base += fmt.Sprintf(" AND step = $%d", argN)
			args = append(args, *step)
		}
	} else {
		argN++
		base += fmt.Sprintf(" AND department_id = $%d", argN)
		args = append(args, scopeID)
	}

	base += " ORDER BY sort_order, label"

	rows, err = e.DB.Query(ctx, base, args...)
	if err != nil {
		return nil, fmt.Errorf("children query: %w", err)
	}
	defer rows.Close()

	var out []models.TreeNode
	for rows.Next() {
		var n models.TreeNode
		if err := rows.Scan(&n.ID, &n.TreeType, &n.BusinessTypeID, &n.Step, &n.DepartmentID, &n.ParentID, &n.NodeType, &n.Label, &n.IsLeaf, &n.SortOrder); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

// GetNode fetches a single node by ID.
func (e *Engine) GetNode(ctx context.Context, id string) (*models.TreeNode, error) {
	var n models.TreeNode
	err := e.DB.QueryRow(ctx, `
		SELECT id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order
		FROM tree_nodes WHERE id = $1
	`, id).Scan(&n.ID, &n.TreeType, &n.BusinessTypeID, &n.Step, &n.DepartmentID, &n.ParentID, &n.NodeType, &n.Label, &n.IsLeaf, &n.SortOrder)
	if err != nil {
		return nil, fmt.Errorf("get node: %w", err)
	}
	return &n, nil
}

// PathToRoot walks parent_id pointers upward from a node and returns
// the full ancestry (root-first), used for routing and audit trail.
func (e *Engine) PathToRoot(ctx context.Context, nodeID string) ([]models.TreeNode, error) {
	var path []models.TreeNode
	cursor := &nodeID
	for cursor != nil {
		n, err := e.GetNode(ctx, *cursor)
		if err != nil {
			return nil, err
		}
		path = append([]models.TreeNode{*n}, path...) // prepend -> root-first
		cursor = n.ParentID
	}
	return path, nil
}

// WholeTree returns every node for a given business type + step, for the
// Super Admin viewer / JSON export. Order doesn't matter here; caller reconstructs.
func (e *Engine) WholeBusinessTree(ctx context.Context, businessTypeID string, step models.Step) ([]models.TreeNode, error) {
	rows, err := e.DB.Query(ctx, `
		SELECT id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order
		FROM tree_nodes WHERE tree_type='business' AND business_type_id=$1 AND step=$2
	`, businessTypeID, step)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.TreeNode
	for rows.Next() {
		var n models.TreeNode
		if err := rows.Scan(&n.ID, &n.TreeType, &n.BusinessTypeID, &n.Step, &n.DepartmentID, &n.ParentID, &n.NodeType, &n.Label, &n.IsLeaf, &n.SortOrder); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

// WholeOrgTree returns every node in a department's org taxonomy.
func (e *Engine) WholeOrgTree(ctx context.Context, departmentID string) ([]models.TreeNode, error) {
	rows, err := e.DB.Query(ctx, `
		SELECT id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order
		FROM tree_nodes WHERE tree_type='org' AND department_id=$1
	`, departmentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.TreeNode
	for rows.Next() {
		var n models.TreeNode
		if err := rows.Scan(&n.ID, &n.TreeType, &n.BusinessTypeID, &n.Step, &n.DepartmentID, &n.ParentID, &n.NodeType, &n.Label, &n.IsLeaf, &n.SortOrder); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

// LeafDocuments returns the documents required at a given leaf node, joined with document_type info.
func (e *Engine) LeafDocuments(ctx context.Context, leafNodeID string) ([]models.LeafDocument, error) {
	rows, err := e.DB.Query(ctx, `
		SELECT ld.id, ld.leaf_node_id, ld.document_type_id, ld.is_mandatory, ld.depends_on,
		       dt.name, dt.owning_department_id
		FROM leaf_documents ld
		JOIN document_types dt ON dt.id = ld.document_type_id
		WHERE ld.leaf_node_id = $1
	`, leafNodeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.LeafDocument
	for rows.Next() {
		var d models.LeafDocument
		if err := rows.Scan(&d.ID, &d.LeafNodeID, &d.DocumentTypeID, &d.IsMandatory, &d.DependsOn, &d.DocumentName, &d.OwningDepartmentID); err != nil {
			return nil, err
		}
		out = append(out, d)
	}
	return out, rows.Err()
}

// AttachDocument attaches a required document type to a leaf node.
func (e *Engine) AttachDocument(ctx context.Context, leafNodeID, documentTypeID string, mandatory bool, dependsOn *string) (string, error) {
	id := uuid.New().String()
	_, err := e.DB.Exec(ctx, `
		INSERT INTO leaf_documents (id, leaf_node_id, document_type_id, is_mandatory, depends_on)
		VALUES ($1,$2,$3,$4,$5)
	`, id, leafNodeID, documentTypeID, mandatory, dependsOn)
	if err != nil {
		return "", fmt.Errorf("attach document: %w", err)
	}
	return id, nil
}
