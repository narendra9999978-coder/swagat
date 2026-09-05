-- ============================================================
-- SWAGAT Initial Prototype Seed Data
-- ============================================================

-- 1. Super Admin User (password: 'pass123')
-- Bcrypt hash for 'pass123' with cost 10: $2a$10$5pQG54u1z0r1tG37R/86KujKq1H0b1b/jCgnm0qV5P7p1RzM2l2eG
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@swagat.gov',
    '$2a$10$5pQG54u1z0r1tG37R/86KujKq1H0b1b/jCgnm0qV5P7p1RzM2l2eG',
    'National Administrator',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- 2. Core Government Departments with Statutory SLAs
INSERT INTO departments (id, name, sla_hours, created_by)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'Pollution Control Board', 72, 'a0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000002', 'Fire & Emergency Services', 48, 'a0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000003', 'Directorate of Industrial Safety & Factories', 96, 'a0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000004', 'Town Planning & Municipal Administration', 120, 'a0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000005', 'State Electricity Distribution Company (DISCOM)', 72, 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (name) DO NOTHING;

-- 3. Standard Business Types
INSERT INTO business_types (id, name, created_by)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Manufacturing', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'IT & Technology', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000003', 'Hotel & Hospitality', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000004', 'Food Processing', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (name) DO NOTHING;

-- 4. Key Statutory Document Types
INSERT INTO document_types (id, name, owning_department_id, validity_days, template_file_url)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Consent to Establish (CTE)', 'd0000000-0000-0000-0000-000000000001', 1825, 'https://swagat.gov.in/templates/cte.pdf'),
    ('c0000000-0000-0000-0000-000000000002', 'Consent to Operate (CTO)', 'd0000000-0000-0000-0000-000000000001', 1825, 'https://swagat.gov.in/templates/cto.pdf'),
    ('c0000000-0000-0000-0000-000000000003', 'Provisional Fire NOC', 'd0000000-0000-0000-0000-000000000002', 365, 'https://swagat.gov.in/templates/fire_noc.pdf'),
    ('c0000000-0000-0000-0000-000000000004', 'Factory License (Form 4)', 'd0000000-0000-0000-0000-000000000003', 365, 'https://swagat.gov.in/templates/factory_lic.pdf'),
    ('c0000000-0000-0000-0000-000000000005', 'High Tension Power Load Sanction', 'd0000000-0000-0000-0000-000000000005', NULL, 'https://swagat.gov.in/templates/ht_power.pdf')
ON CONFLICT (name, owning_department_id) DO NOTHING;
