-- ============================================================
-- SWAGAT Migration 004: End-to-End Workflow & Tracking Enhancements
-- Expands status checks, adds metadata columns, ensures admin routing
-- ============================================================

-- 1. Expand application statuses to include live workflow stages
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check 
  CHECK (status = ANY (ARRAY['in_progress', 'submitted', 'dispatched', 'in_review', 'approved', 'rejected', 'query_raised', 'completed']));

-- 2. Add extra metadata columns to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS project_title TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS state_name TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS investment_amount TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_remarks TEXT;

-- 3. Expand document_bundles statuses
ALTER TABLE document_bundles DROP CONSTRAINT IF EXISTS document_bundles_status_check;
ALTER TABLE document_bundles ADD CONSTRAINT document_bundles_status_check
  CHECK (status = ANY (ARRAY['pending', 'in_review', 'approved', 'deemed_approved', 'breached', 'query_raised', 'rejected']));

-- 4. Ensure users table has status column
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- 5. Ensure application_documents has is_mandatory column
ALTER TABLE application_documents ADD COLUMN IF NOT EXISTS is_mandatory BOOLEAN DEFAULT true;

-- 6. Attach initial leaf_documents for standard statutory documents if missing
INSERT INTO leaf_documents (id, leaf_node_id, document_type_id, is_mandatory)
SELECT 
  uuid_generate_v4(),
  tn.id,
  dt.id,
  true
FROM tree_nodes tn
CROSS JOIN (SELECT id FROM document_types LIMIT 3) dt
WHERE tn.is_leaf = true
ON CONFLICT (leaf_node_id, document_type_id) DO NOTHING;
