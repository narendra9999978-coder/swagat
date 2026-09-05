// Package dispatch implements the concurrency model (System Design doc, Section 13).
// This is the part that makes the "true concurrency, not NSWS-style sequential
// processing" claim mechanically real: each department bundle gets its own
// goroutine and its own independently-ticking SLA timer, started at the same instant.
package dispatch

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/solvix/swagat/internal/routing"
	"github.com/solvix/swagat/internal/tree"
)

type Engine struct {
	DB     *pgxpool.Pool
	Router *routing.Router
	Tree   *tree.Engine
	// pollInterval controls how often each SLA watcher checks whether its
	// deadline has passed. Short for demo purposes; production would use a
	// single scheduled job instead of one goroutine per bundle.
	pollInterval time.Duration
}

func NewEngine(db *pgxpool.Pool, r *routing.Router, t *tree.Engine) *Engine {
	return &Engine{DB: db, Router: r, Tree: t, pollInterval: 2 * time.Second}
}

// DispatchApplication is the entry point called the instant an application is
// submitted with all documents uploaded/vault-linked. It fans out one
// goroutine per department bundle, all starting at the same instant — this
// is the literal mechanical basis for "simultaneous, not sequential" dispatch.
func (e *Engine) DispatchApplication(ctx context.Context, applicationID string) error {
	bundles, err := e.bundlesForApplication(ctx, applicationID)
	if err != nil {
		return err
	}

	now := time.Now()

	for _, b := range bundles {
		b := b // capture
		deadline := now.Add(time.Duration(b.SLAHours) * time.Hour)

		if _, err := e.DB.Exec(ctx, `
			UPDATE document_bundles
			SET dispatched_at = $1, sla_deadline = $2, status = 'in_review'
			WHERE id = $3
		`, now, deadline, b.BundleID); err != nil {
			log.Printf("dispatch: failed to set deadline for bundle %s: %v", b.BundleID, err)
			continue
		}

		e.logEvent(ctx, b.BundleID, "dispatched", "Dispatched in parallel with all sibling department bundles")

		// Route this bundle to an admin right away (Section 10).
		path, perr := e.pathForBundle(ctx, applicationID, b.DepartmentID)
		if perr == nil && len(path) > 0 {
			if _, _, rerr := e.Router.RouteBundle(ctx, b.BundleID, b.DepartmentID, path); rerr != nil {
				log.Printf("dispatch: routing failed for bundle %s: %v", b.BundleID, rerr)
			}
		}

		// One independent goroutine per department bundle. This is the actual
		// concurrency: no bundle waits on another to start or finish.
		go e.watchSLA(b.BundleID, deadline)
	}

	_, err = e.DB.Exec(ctx, `UPDATE applications SET status = 'dispatched' WHERE id = $1`, applicationID)
	return err
}

// watchSLA runs for the lifetime of one bundle's review window. It polls
// (in place of a message-queue delayed job, per the documented NATS->goroutine
// simplification) until the bundle is either completed or its deadline passes.
func (e *Engine) watchSLA(bundleID string, deadline time.Time) {
	ticker := time.NewTicker(e.pollInterval)
	defer ticker.Stop()

	ctx := context.Background()

	for range ticker.C {
		status, done, err := e.bundleStatus(ctx, bundleID)
		if err != nil {
			log.Printf("watchSLA(%s): status check failed: %v", bundleID, err)
			continue
		}
		if done {
			return // approved (or deemed-approved) already — nothing more to watch
		}

		if time.Now().After(deadline) && status != "breached" {
			e.breachAndEscalate(ctx, bundleID)
			return
		}
	}
}

func (e *Engine) breachAndEscalate(ctx context.Context, bundleID string) {
	_, err := e.DB.Exec(ctx, `UPDATE document_bundles SET status = 'breached' WHERE id = $1`, bundleID)
	if err != nil {
		log.Printf("breach: failed to mark bundle %s breached: %v", bundleID, err)
		return
	}
	e.logEvent(ctx, bundleID, "breached", "SLA deadline passed before all documents in bundle were approved")
	e.logEvent(ctx, bundleID, "escalated", "Auto-escalated per Section 14 — issuing deemed approval")

	// Deemed Approval (Section 14): auto-approve any document in the bundle
	// still pending_review at breach time.
	_, err = e.DB.Exec(ctx, `
		UPDATE application_documents
		SET status = 'approved', reviewed_at = now()
		WHERE bundle_id = $1 AND status = 'pending_review'
	`, bundleID)
	if err != nil {
		log.Printf("deemed approval: failed to bulk-approve docs for bundle %s: %v", bundleID, err)
		return
	}

	_, err = e.DB.Exec(ctx, `
		UPDATE document_bundles SET status = 'deemed_approved', completed_at = now() WHERE id = $1
	`, bundleID)
	if err != nil {
		log.Printf("deemed approval: failed to close bundle %s: %v", bundleID, err)
		return
	}
	e.logEvent(ctx, bundleID, "deemed_approved", "All pending documents auto-approved; department could not silently sit on the file")
}

func (e *Engine) logEvent(ctx context.Context, bundleID, eventType, note string) {
	_, err := e.DB.Exec(ctx, `INSERT INTO sla_events (bundle_id, event_type, note) VALUES ($1,$2,$3)`, bundleID, eventType, note)
	if err != nil {
		log.Printf("logEvent(%s,%s): %v", bundleID, eventType, err)
	}
}

// --- helper queries ---

type bundleRow struct {
	BundleID     string
	DepartmentID string
	SLAHours     int
}

func (e *Engine) bundlesForApplication(ctx context.Context, applicationID string) ([]bundleRow, error) {
	rows, err := e.DB.Query(ctx, `
		SELECT db.id, db.department_id, d.sla_hours
		FROM document_bundles db
		JOIN departments d ON d.id = db.department_id
		WHERE db.application_id = $1
	`, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []bundleRow
	for rows.Next() {
		var b bundleRow
		if err := rows.Scan(&b.BundleID, &b.DepartmentID, &b.SLAHours); err != nil {
			return nil, err
		}
		out = append(out, b)
	}
	return out, rows.Err()
}

func (e *Engine) bundleStatus(ctx context.Context, bundleID string) (status string, done bool, err error) {
	err = e.DB.QueryRow(ctx, `SELECT status FROM document_bundles WHERE id = $1`, bundleID).Scan(&status)
	if err != nil {
		return "", false, err
	}
	done = status == "approved" || status == "deemed_approved"
	return status, done, nil
}

// pathForBundle derives the org-tree routing path for a department from the
// applicant's own business-tree answers (System Design 10.2): the path is not
// looked up in the org tree directly, it is *matched* level-by-level using the
// same labels the applicant answered with (e.g. state name, category name).
// For the prototype this does a simple label-based match; production would
// use a more formal mapping table between business-tree answers and org-tree structure.
func (e *Engine) pathForBundle(ctx context.Context, applicationID, departmentID string) ([]string, error) {
	rows, err := e.DB.Query(ctx, `
		SELECT unnest(path_node_ids) FROM application_step_answers WHERE application_id = $1
	`, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var businessPathIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		businessPathIDs = append(businessPathIDs, id)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Fetch labels for the business path.
	labelRows, err := e.DB.Query(ctx, `
		SELECT label FROM tree_nodes WHERE id = ANY($1) ORDER BY sort_order
	`, businessPathIDs)
	if err != nil {
		return nil, err
	}
	defer labelRows.Close()
	var labels []string
	for labelRows.Next() {
		var l string
		if err := labelRows.Scan(&l); err != nil {
			return nil, err
		}
		labels = append(labels, l)
	}

	// Walk the department's org tree, matching by label at each level, as far as it goes.
	var path []string
	var parentID *string
	for _, label := range labels {
		var nodeID string
		q := `SELECT id FROM tree_nodes WHERE tree_type='org' AND department_id=$1 AND label=$2 AND `
		var args []interface{}
		if parentID == nil {
			q += `parent_id IS NULL`
			args = []interface{}{departmentID, label}
		} else {
			q += `parent_id=$3`
			args = []interface{}{departmentID, label, *parentID}
		}
		q += ` LIMIT 1`

		err := e.DB.QueryRow(ctx, q, args...).Scan(&nodeID)
		if err != nil {
			break // org tree doesn't go this deep / doesn't have a matching branch — stop here
		}
		path = append(path, nodeID)
		parentID = &nodeID
	}

	return path, nil
}
