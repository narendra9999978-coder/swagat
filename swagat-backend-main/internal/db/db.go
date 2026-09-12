package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

// Connect initializes the global Postgres connection pool from DATABASE_URL.
func Connect() error {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgresql://postgres.vdcuqhwpnerguygvgdhv:Dhananjay%23DK%402610@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return fmt.Errorf("parse dsn: %w", err)
	}
	cfg.MaxConns = 20

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return fmt.Errorf("connect: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("ping: %w", err)
	}

	Pool = pool

	// Run auto-migration and seeding on startup
	go func() {
		seedCtx, seedCancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer seedCancel()
		if err := AutoMigrateAndSeed(seedCtx, pool); err != nil {
			log.Printf("db auto-migrate warning: %v", err)
		}
	}()

	return nil
}

// AutoMigrateAndSeed ensures schema enhancements, statutory departments, and admin accounts exist.
func AutoMigrateAndSeed(ctx context.Context, pool *pgxpool.Pool) error {
	// 1. Schema enhancements
	_, _ = pool.Exec(ctx, `
		-- Allow workflow status states
		ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
		ALTER TABLE applications ADD CONSTRAINT applications_status_check 
			CHECK (status = ANY (ARRAY['in_progress', 'submitted', 'dispatched', 'in_review', 'approved', 'rejected', 'query_raised', 'completed']));

		ALTER TABLE applications ADD COLUMN IF NOT EXISTS tracking_number TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS project_title TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS company_name TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS state_name TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS investment_amount TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_remarks TEXT;
		ALTER TABLE applications ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;

		ALTER TABLE document_bundles DROP CONSTRAINT IF EXISTS document_bundles_status_check;
		ALTER TABLE document_bundles ADD CONSTRAINT document_bundles_status_check
			CHECK (status = ANY (ARRAY['pending', 'in_review', 'approved', 'deemed_approved', 'breached', 'query_raised', 'rejected']));
		ALTER TABLE document_bundles ADD COLUMN IF NOT EXISTS reassigned_count INT DEFAULT 0;
		ALTER TABLE document_bundles ADD COLUMN IF NOT EXISTS assigned_admin_id UUID;

		ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS is_mandatory BOOLEAN DEFAULT true;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS reviewed_by UUID;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS vault_entry_id UUID;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS reused_from_vault BOOLEAN DEFAULT false;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS bundle_id UUID;
		ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS leaf_document_id UUID;
	`)

	// 2. Super admin seed user (password: pass123)
	_, _ = pool.Exec(ctx, `
		INSERT INTO users (id, email, password_hash, full_name, role)
		VALUES (
			'a0000000-0000-0000-0000-000000000001',
			'admin@swagat.gov',
			'$2a$10$5pQG54u1z0r1tG37R/86KujKq1H0b1b/jCgnm0qV5P7p1RzM2l2eG',
			'National Administrator',
			'super_admin'
		) ON CONFLICT (email) DO NOTHING;
	`)

	// 3. Departments
	_, _ = pool.Exec(ctx, `
		INSERT INTO departments (id, name, sla_hours, created_by)
		VALUES 
			('d0000000-0000-0000-0000-000000000001', 'Pollution Control Board', 72, 'a0000000-0000-0000-0000-000000000001'),
			('d0000000-0000-0000-0000-000000000002', 'Fire & Emergency Services', 48, 'a0000000-0000-0000-0000-000000000001'),
			('d0000000-0000-0000-0000-000000000003', 'Directorate of Industrial Safety & Factories', 96, 'a0000000-0000-0000-0000-000000000001'),
			('d0000000-0000-0000-0000-000000000004', 'Town Planning & Municipal Administration', 120, 'a0000000-0000-0000-0000-000000000001'),
			('d0000000-0000-0000-0000-000000000005', 'State Electricity Distribution Company (DISCOM)', 72, 'a0000000-0000-0000-0000-000000000001')
		ON CONFLICT (id) DO NOTHING;
	`)

	// 4. Business Types
	_, _ = pool.Exec(ctx, `
		INSERT INTO business_types (id, name, created_by)
		VALUES
			('b0000000-0000-0000-0000-000000000001', 'General Manufacturing', 'a0000000-0000-0000-0000-000000000001'),
			('b0000000-0000-0000-0000-000000000002', 'IT / Software Services', 'a0000000-0000-0000-0000-000000000001'),
			('b0000000-0000-0000-0000-000000000003', 'Hotel & Hospitality', 'a0000000-0000-0000-0000-000000000001'),
			('b0000000-0000-0000-0000-000000000004', 'Food Processing & Packaging', 'a0000000-0000-0000-0000-000000000001'),
			('b0000000-0000-0000-0000-000000000005', 'Petroleum & Fuel Retail', 'a0000000-0000-0000-0000-000000000001')
		ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
	`)

	// 5. Document Types
	_, _ = pool.Exec(ctx, `
		INSERT INTO document_types (id, name, owning_department_id, validity_days, template_file_url)
		VALUES
			('c0000000-0000-0000-0000-000000000001', 'Consent to Establish (CTE)', 'd0000000-0000-0000-0000-000000000001', 1825, 'https://swagat.gov.in/templates/cte.pdf'),
			('c0000000-0000-0000-0000-000000000002', 'Consent to Operate (CTO)', 'd0000000-0000-0000-0000-000000000001', 1825, 'https://swagat.gov.in/templates/cto.pdf'),
			('c0000000-0000-0000-0000-000000000003', 'Provisional Fire NOC', 'd0000000-0000-0000-0000-000000000002', 365, 'https://swagat.gov.in/templates/fire_noc.pdf'),
			('c0000000-0000-0000-0000-000000000004', 'Factory License (Form 4)', 'd0000000-0000-0000-0000-000000000003', 365, 'https://swagat.gov.in/templates/factory_lic.pdf'),
			('c0000000-0000-0000-0000-000000000005', 'High Tension Power Load Sanction', 'd0000000-0000-0000-0000-000000000005', NULL, 'https://swagat.gov.in/templates/ht_power.pdf')
		ON CONFLICT (id) DO NOTHING;
	`)

	// 6. Ensure admin registrations exist so router can find officers
	_, _ = pool.Exec(ctx, `
		INSERT INTO admin_registrations (id, user_id, department_id, org_node_id)
		SELECT 
			gen_random_uuid(),
			u.id,
			d.id,
			COALESCE(
				(SELECT id FROM tree_nodes WHERE department_id = d.id LIMIT 1),
				'e1000000-0000-0000-0000-000000000001'::uuid
			)
		FROM users u
		CROSS JOIN (SELECT id FROM departments LIMIT 1) d
		WHERE u.role IN ('super_admin', 'department_admin')
		ON CONFLICT (user_id, department_id) DO NOTHING;
	`)

	return nil
}
