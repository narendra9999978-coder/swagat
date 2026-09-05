// Package routing implements the hierarchical bubble-up + least-pending-load
// algorithm (System Design doc, Section 10) that assigns a document bundle
// to a specific Department Admin.
package routing

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNoAdminFound = errors.New("no admin registered anywhere in this department's org tree")

type Router struct {
	DB *pgxpool.Pool
}

func NewRouter(db *pgxpool.Pool) *Router {
	return &Router{DB: db}
}

// RouteBundle assigns bundleID (a (application, department) pair) to an admin.
// pathNodeIDs is the org-tree path to search along, DEEPEST NODE LAST
// (mirroring the applicant's own answer path — state -> category -> ... -> leaf-equivalent).
// It walks from the deepest node upward (bubble-up), and at each level picks
// the admin registered there with the fewest currently-pending bundles.
func (r *Router) RouteBundle(ctx context.Context, bundleID string, departmentID string, pathNodeIDs []string) (adminID string, landedNodeID string, err error) {
	// Walk deepest-first (bubble up toward root).
	for i := len(pathNodeIDs) - 1; i >= 0; i-- {
		nodeID := pathNodeIDs[i]

		admin, ok, aerr := r.leastLoadedAdminAt(ctx, departmentID, nodeID)
		if aerr != nil {
			return "", "", aerr
		}
		if ok {
			if assignErr := r.assign(ctx, bundleID, admin); assignErr != nil {
				return "", "", assignErr
			}
			return admin, nodeID, nil
		}
	}

	// No admin found anywhere on the path -> flag for manual Super Admin / dept-head review.
	if flagErr := r.flagForManualReview(ctx, bundleID); flagErr != nil {
		return "", "", flagErr
	}
	return "", "", ErrNoAdminFound
}

// leastLoadedAdminAt finds, among admins registered exactly at nodeID for departmentID,
// the one with the fewest bundles currently assigned and not yet completed.
func (r *Router) leastLoadedAdminAt(ctx context.Context, departmentID, nodeID string) (adminID string, found bool, err error) {
	row := r.DB.QueryRow(ctx, `
		SELECT ar.user_id
		FROM admin_registrations ar
		LEFT JOIN document_bundles db
		       ON db.assigned_admin_id = ar.user_id
		      AND db.status IN ('pending','in_review')
		WHERE ar.department_id = $1 AND ar.org_node_id = $2
		GROUP BY ar.user_id
		ORDER BY COUNT(db.id) ASC
		LIMIT 1
	`, departmentID, nodeID)

	var uid string
	scanErr := row.Scan(&uid)
	if scanErr != nil {
		// pgx.ErrNoRows -> no admin registered at this exact node
		return "", false, nil
	}
	return uid, true, nil
}

func (r *Router) assign(ctx context.Context, bundleID, adminID string) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE document_bundles
		SET assigned_admin_id = $1, status = 'in_review', reassigned_count = reassigned_count + 1
		WHERE id = $2
	`, adminID, bundleID)
	if err != nil {
		return fmt.Errorf("assign bundle: %w", err)
	}
	return nil
}

func (r *Router) flagForManualReview(ctx context.Context, bundleID string) error {
	_, err := r.DB.Exec(ctx, `
		INSERT INTO sla_events (bundle_id, event_type, note)
		VALUES ($1, 'escalated', 'No admin found anywhere in department org tree — flagged for manual Super Admin / department-head review')
	`, bundleID)
	return err
}

// RerouteBundle implements Section 11: on reupload of a rejected document, the
// WHOLE bundle re-enters routing (not just the single document). Already-approved
// documents in the bundle are NOT reopened — caller is responsible for leaving
// their status untouched; only the bundle's admin assignment changes here.
func (r *Router) RerouteBundle(ctx context.Context, bundleID, departmentID string, pathNodeIDs []string) (adminID string, landedNodeID string, err error) {
	// Reset bundle to pending before re-routing so it's visible in load counts correctly.
	_, err = r.DB.Exec(ctx, `UPDATE document_bundles SET status = 'pending' WHERE id = $1`, bundleID)
	if err != nil {
		return "", "", fmt.Errorf("reset bundle before reroute: %w", err)
	}
	return r.RouteBundle(ctx, bundleID, departmentID, pathNodeIDs)
}
