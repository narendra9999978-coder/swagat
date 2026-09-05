package tree

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/solvix/swagat/internal/models"
)

// ImportNode is the recursive JSON shape an admin can upload to bulk-author a tree,
// instead of building it node-by-node through the GUI. Same underlying tables either way.
//
// Business tree example:
//
//	{
//	  "label": "Which state?",
//	  "node_type": "question",
//	  "children": [
//	    { "label": "Maharashtra", "node_type": "option", "children": [
//	        { "label": "How many stars?", "node_type": "question", "children": [
//	            { "label": "5-star", "node_type": "option", "is_leaf": true,
//	              "documents": [ { "document_type_name": "Fire NOC", "mandatory": true } ] }
//	        ]}
//	    ]}
//	  ]
//	}
type ImportNode struct {
	Label     string           `json:"label"`
	NodeType  string           `json:"node_type"` // "question" | "option"
	IsLeaf    bool             `json:"is_leaf"`
	Documents []ImportDocument `json:"documents,omitempty"`
	Children  []ImportNode     `json:"children,omitempty"`
}

type ImportDocument struct {
	DocumentTypeName string  `json:"document_type_name"`
	Mandatory        bool    `json:"mandatory"`
	DependsOnDocName *string `json:"depends_on_document_name,omitempty"`
}

// ImportBusinessTree bulk-inserts a full step-tree for a business type from a JSON structure.
// documentTypeByName must be pre-resolved (name -> document_type_id) by the caller,
// since document types are owned by departments and created separately.
func (e *Engine) ImportBusinessTree(ctx context.Context, businessTypeID string, step models.Step, root ImportNode, documentTypeByName map[string]string) error {
	tx, err := e.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var walk func(n ImportNode, parentID *string, order int) error
	walk = func(n ImportNode, parentID *string, order int) error {
		id := uuid.New().String()
		bt := businessTypeID
		st := step
		_, err := tx.Exec(ctx, `
			INSERT INTO tree_nodes (id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order)
			VALUES ($1,'business',$2,$3,NULL,$4,$5,$6,$7,$8)
		`, id, bt, st, parentID, n.NodeType, n.Label, n.IsLeaf, order)
		if err != nil {
			return fmt.Errorf("insert node %q: %w", n.Label, err)
		}

		if n.IsLeaf {
			// leaf-level document name -> id lookup for depends_on within the same leaf
			localDocIDByName := map[string]string{}
			for _, d := range n.Documents {
				docTypeID, ok := documentTypeByName[d.DocumentTypeName]
				if !ok {
					return fmt.Errorf("unknown document_type_name %q — create the document type first", d.DocumentTypeName)
				}
				ldID := uuid.New().String()
				var dependsOn *string
				if d.DependsOnDocName != nil {
					if refID, ok2 := localDocIDByName[*d.DependsOnDocName]; ok2 {
						dependsOn = &refID
					}
				}
				_, err := tx.Exec(ctx, `
					INSERT INTO leaf_documents (id, leaf_node_id, document_type_id, is_mandatory, depends_on)
					VALUES ($1,$2,$3,$4,$5)
				`, ldID, id, docTypeID, d.Mandatory, dependsOn)
				if err != nil {
					return fmt.Errorf("insert leaf doc %q: %w", d.DocumentTypeName, err)
				}
				localDocIDByName[d.DocumentTypeName] = ldID
			}
		}

		for i, child := range n.Children {
			if err := walk(child, &id, i); err != nil {
				return err
			}
		}
		return nil
	}

	if err := walk(root, nil, 0); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

// ImportOrgTree bulk-inserts a department's org taxonomy from the same JSON shape
// (documents/is_leaf on org nodes are ignored — org nodes are registration points, not checklist leaves).
func (e *Engine) ImportOrgTree(ctx context.Context, departmentID string, root ImportNode) error {
	tx, err := e.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var walk func(n ImportNode, parentID *string, order int) error
	walk = func(n ImportNode, parentID *string, order int) error {
		id := uuid.New().String()
		dep := departmentID
		_, err := tx.Exec(ctx, `
			INSERT INTO tree_nodes (id, tree_type, business_type_id, step, department_id, parent_id, node_type, label, is_leaf, sort_order)
			VALUES ($1,'org',NULL,NULL,$2,$3,$4,$5,$6,$7)
		`, id, dep, parentID, n.NodeType, n.Label, n.IsLeaf, order)
		if err != nil {
			return fmt.Errorf("insert org node %q: %w", n.Label, err)
		}
		for i, child := range n.Children {
			if err := walk(child, &id, i); err != nil {
				return err
			}
		}
		return nil
	}

	if err := walk(root, nil, 0); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
