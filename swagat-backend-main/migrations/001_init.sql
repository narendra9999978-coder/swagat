-- SWAGAT prototype schema
-- One generic tree engine reused for (a) applicant business tree and (b) admin org tree.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS / ROLES
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('super_admin', 'department_admin', 'applicant')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT UNIQUE NOT NULL,
    sla_hours       INTEGER NOT NULL DEFAULT 72,   -- default SLA per department, per bundle
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GENERIC TREE ENGINE
-- One physical table, two logical uses distinguished by tree_type.
--   tree_type = 'business'  -> applicant-facing checklist tree (per business_type, per step)
--   tree_type = 'org'       -> department's internal org taxonomy (per department)
-- ============================================================

CREATE TABLE business_types (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT UNIQUE NOT NULL,           -- e.g. "Hotel", "Petrol Pump"
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The applicant tree is split into 4 independent "steps" per business type
-- (Business Registration, Business Activity Details, Foreign Investment Details, Project Land Details).
-- Each step is its own single-path tree, rooted at a node with parent_id = NULL for that (business_type_id, step).

CREATE TABLE tree_nodes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_type           TEXT NOT NULL CHECK (tree_type IN ('business', 'org')),

    -- business tree fields
    business_type_id    UUID REFERENCES business_types(id) ON DELETE CASCADE,
    step                TEXT CHECK (step IN ('business_registration','business_activity','foreign_investment','project_land')),

    -- org tree fields
    department_id       UUID REFERENCES departments(id) ON DELETE CASCADE,

    parent_id           UUID REFERENCES tree_nodes(id) ON DELETE CASCADE,
    node_type           TEXT NOT NULL CHECK (node_type IN ('question', 'option')),
    label               TEXT NOT NULL,
    is_leaf             BOOLEAN NOT NULL DEFAULT false,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CHECK (
        (tree_type = 'business' AND business_type_id IS NOT NULL AND step IS NOT NULL AND department_id IS NULL)
        OR
        (tree_type = 'org' AND department_id IS NOT NULL AND business_type_id IS NULL AND step IS NULL)
    )
);

CREATE INDEX idx_tree_nodes_parent ON tree_nodes(parent_id);
CREATE INDEX idx_tree_nodes_business ON tree_nodes(business_type_id, step);
CREATE INDEX idx_tree_nodes_dept ON tree_nodes(department_id);

-- ============================================================
-- DOCUMENT TYPES (owned by a department, carry validity period)
-- ============================================================

CREATE TABLE document_types (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    TEXT NOT NULL,
    owning_department_id    UUID NOT NULL REFERENCES departments(id),
    validity_days           INTEGER,               -- NULL = never expires
    template_file_url       TEXT,                  -- downloadable blank-format PDF
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(name, owning_department_id)
);

-- Documents attached to a LEAF of a business tree (Section 6/19#9 — only leaves carry documents).
CREATE TABLE leaf_documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaf_node_id        UUID NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
    document_type_id    UUID NOT NULL REFERENCES document_types(id),
    is_mandatory        BOOLEAN NOT NULL DEFAULT true,
    depends_on          UUID REFERENCES leaf_documents(id),   -- Section 12.2: prerequisite, same leaf only
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(leaf_node_id, document_type_id)
);

CREATE INDEX idx_leaf_documents_leaf ON leaf_documents(leaf_node_id);

-- ============================================================
-- APPLICANTS / APPLICATIONS
-- ============================================================

CREATE TABLE applicants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id),
    pan         TEXT,
    entity_name TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id        UUID NOT NULL REFERENCES applicants(id),
    business_type_id    UUID NOT NULL REFERENCES business_types(id),
    status              TEXT NOT NULL DEFAULT 'in_progress'
                         CHECK (status IN ('in_progress','submitted','dispatched','completed')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at        TIMESTAMPTZ
);

-- Records the exact leaf reached for each of the 4 steps (the answer path).
CREATE TABLE application_step_answers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    step            TEXT NOT NULL CHECK (step IN ('business_registration','business_activity','foreign_investment','project_land')),
    leaf_node_id    UUID NOT NULL REFERENCES tree_nodes(id),
    -- full answer path stored for routing/context/audit
    path_node_ids   UUID[] NOT NULL,
    UNIQUE(application_id, step)
);

-- ============================================================
-- ONCE-ONLY VAULT
-- ============================================================

CREATE TABLE applicant_vault (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id        UUID NOT NULL REFERENCES applicants(id),
    document_type_id    UUID NOT NULL REFERENCES document_types(id),
    file_url            TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending'
                         CHECK (verification_status IN ('pending','approved','rejected','expired')),
    verified_at         TIMESTAMPTZ,
    expiry_date         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(applicant_id, document_type_id)
);

-- ============================================================
-- APPLICATION DOCUMENTS (per-application instance of a required document)
-- ============================================================

CREATE TABLE application_documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    leaf_document_id    UUID NOT NULL REFERENCES leaf_documents(id),
    document_type_id    UUID NOT NULL REFERENCES document_types(id),
    vault_entry_id       UUID REFERENCES applicant_vault(id),   -- non-null if reused from vault
    file_url            TEXT,
    status              TEXT NOT NULL DEFAULT 'pending_review'
                         CHECK (status IN ('pending_review','approved','rejected','expired','waiting_on_dependency')),
    reused_from_vault    BOOLEAN NOT NULL DEFAULT false,
    reviewed_by          UUID REFERENCES users(id),
    reviewed_at          TIMESTAMPTZ,
    expiry_date          TIMESTAMPTZ,
    rejection_reason      TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_docs_application ON application_documents(application_id);

-- ============================================================
-- ORG TAXONOMY / ADMIN REGISTRATION (Section 9)
-- ============================================================

CREATE TABLE admin_registrations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    department_id   UUID NOT NULL REFERENCES departments(id),
    org_node_id     UUID NOT NULL REFERENCES tree_nodes(id),  -- can be any depth, not just leaf
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, department_id)
);

CREATE INDEX idx_admin_reg_node ON admin_registrations(org_node_id);

-- ============================================================
-- BUNDLES (Section 11) — grouping unit for routing + SLA
-- One bundle = one (application, department) pair.
-- ============================================================

CREATE TABLE document_bundles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    department_id       UUID NOT NULL REFERENCES departments(id),
    assigned_admin_id   UUID REFERENCES users(id),
    status              TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','in_review','approved','deemed_approved','breached')),
    reassigned_count    INTEGER NOT NULL DEFAULT 0,
    dispatched_at       TIMESTAMPTZ,
    sla_deadline         TIMESTAMPTZ,
    completed_at         TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(application_id, department_id)
);

CREATE INDEX idx_bundles_admin ON document_bundles(assigned_admin_id);
CREATE INDEX idx_bundles_application ON document_bundles(application_id);

-- Links application_documents to the bundle that routes/tracks them.
ALTER TABLE application_documents
    ADD COLUMN bundle_id UUID REFERENCES document_bundles(id);

CREATE INDEX idx_app_docs_bundle ON application_documents(bundle_id);

-- ============================================================
-- SLA EVENTS (audit trail of breach/escalation/deemed-approval)
-- ============================================================

CREATE TABLE sla_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id       UUID NOT NULL REFERENCES document_bundles(id) ON DELETE CASCADE,
    event_type      TEXT NOT NULL CHECK (event_type IN ('dispatched','breached','escalated','deemed_approved','manually_approved')),
    event_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    note            TEXT
);

CREATE INDEX idx_sla_events_bundle ON sla_events(bundle_id);
