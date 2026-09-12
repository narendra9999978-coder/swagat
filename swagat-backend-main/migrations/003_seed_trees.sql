-- ============================================================
-- SWAGAT Migration 003: Seed Decision Tree Nodes for Business Types
-- Populates root questions and options for Hotel, Manufacturing, IT, Food, and more
-- ============================================================

-- Ensure all standard business types exist
INSERT INTO business_types (id, name, created_by)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'General Manufacturing', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'IT / Software Services', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000003', 'Hotel & Hospitality', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000004', 'Food Processing & Packaging', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000005', 'Petroleum & Fuel Retail', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000006', 'Leather & Footwear', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000007', 'Pharmaceutical & Life Sciences', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000008', 'Renewable Energy', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000009', 'Textile & Apparel', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000010', 'Mining & Minerals', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (name) DO NOTHING;

-- ── 1. HOTEL & HOSPITALITY (b0000000-0000-0000-0000-000000000003) ──

-- Step 1: Business Registration
INSERT INTO tree_nodes (id, tree_type, business_type_id, step, parent_id, node_type, label, is_leaf, sort_order)
VALUES 
    ('e1000000-0000-0000-0000-000000000001', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_registration', NULL, 'question', 'What is the constitution / legal structure of this hospitality venture?', false, 0),
    ('e1000000-0000-0000-0000-000000000002', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_registration', 'e1000000-0000-0000-0000-000000000001', 'option', 'Private Limited Company (Pvt Ltd)', true, 1),
    ('e1000000-0000-0000-0000-000000000003', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_registration', 'e1000000-0000-0000-0000-000000000001', 'option', 'Limited Liability Partnership (LLP)', true, 2),
    ('e1000000-0000-0000-0000-000000000004', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_registration', 'e1000000-0000-0000-0000-000000000001', 'option', 'Public Limited Company (Listed/Unlisted)', true, 3),
    ('e1000000-0000-0000-0000-000000000005', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_registration', 'e1000000-0000-0000-0000-000000000001', 'option', 'Sole Proprietorship / Partnership Firm', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Business Activity
INSERT INTO tree_nodes (id, tree_type, business_type_id, step, parent_id, node_type, label, is_leaf, sort_order)
VALUES 
    ('e1000000-0000-0000-0000-000000000010', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_activity', NULL, 'question', 'What is the planned star rating or operational scale of the hotel?', false, 0),
    ('e1000000-0000-0000-0000-000000000011', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_activity', 'e1000000-0000-0000-0000-000000000010', 'option', '5-Star Deluxe / 5-Star Luxury Resort', true, 1),
    ('e1000000-0000-0000-0000-000000000012', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_activity', 'e1000000-0000-0000-0000-000000000010', 'option', '3-Star to 4-Star Business Hotel', true, 2),
    ('e1000000-0000-0000-0000-000000000013', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_activity', 'e1000000-0000-0000-0000-000000000010', 'option', 'Budget / Economy Hotel / Highway Motel (1-2 Star equivalent)', true, 3),
    ('e1000000-0000-0000-0000-000000000014', 'business', 'b0000000-0000-0000-0000-000000000003', 'business_activity', 'e1000000-0000-0000-0000-000000000010', 'option', 'Heritage Palace / Eco-Tourism Jungle Lodge', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Foreign Investment
INSERT INTO tree_nodes (id, tree_type, business_type_id, step, parent_id, node_type, label, is_leaf, sort_order)
VALUES 
    ('e1000000-0000-0000-0000-000000000020', 'business', 'b0000000-0000-0000-0000-000000000003', 'foreign_investment', NULL, 'question', 'Does the hotel project involve Foreign Direct Investment (FDI) or external foreign equity?', false, 0),
    ('e1000000-0000-0000-0000-000000000021', 'business', 'b0000000-0000-0000-0000-000000000003', 'foreign_investment', 'e1000000-0000-0000-0000-000000000020', 'option', '100% Domestic Indian Capital (No Foreign Equity)', true, 1),
    ('e1000000-0000-0000-0000-000000000022', 'business', 'b0000000-0000-0000-0000-000000000003', 'foreign_investment', 'e1000000-0000-0000-0000-000000000020', 'option', 'FDI under 100% Automatic Route (RBI Reporting Required)', true, 2),
    ('e1000000-0000-0000-0000-000000000023', 'business', 'b0000000-0000-0000-0000-000000000003', 'foreign_investment', 'e1000000-0000-0000-0000-000000000020', 'option', 'External Commercial Borrowings (ECB) / Foreign Debt Loan', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Step 4: Project Land
INSERT INTO tree_nodes (id, tree_type, business_type_id, step, parent_id, node_type, label, is_leaf, sort_order)
VALUES 
    ('e1000000-0000-0000-0000-000000000030', 'business', 'b0000000-0000-0000-0000-000000000003', 'project_land', NULL, 'question', 'What is the site location and environmental zoning for the hotel property?', false, 0),
    ('e1000000-0000-0000-0000-000000000031', 'business', 'b0000000-0000-0000-0000-000000000003', 'project_land', 'e1000000-0000-0000-0000-000000000030', 'option', 'Urban Commercial / Municipal Corporation Zone', true, 1),
    ('e1000000-0000-0000-0000-000000000032', 'business', 'b0000000-0000-0000-0000-000000000003', 'project_land', 'e1000000-0000-0000-0000-000000000030', 'option', 'Coastal / Beachfront Land (Within 500m of High Tide Line / CRZ-II or III)', true, 2),
    ('e1000000-0000-0000-0000-000000000033', 'business', 'b0000000-0000-0000-0000-000000000003', 'project_land', 'e1000000-0000-0000-0000-000000000030', 'option', 'Hill Station / Forest Fringe / Eco-Sensitive Zone (ESZ)', true, 3),
    ('e1000000-0000-0000-0000-000000000034', 'business', 'b0000000-0000-0000-0000-000000000003', 'project_land', 'e1000000-0000-0000-0000-000000000030', 'option', 'State Tourism Development Corporation (STDC) Leased Land', true, 4)
ON CONFLICT (id) DO NOTHING;

-- ── 2. GENERAL MANUFACTURING (b0000000-0000-0000-0000-000000000001) ──
INSERT INTO tree_nodes (id, tree_type, business_type_id, step, parent_id, node_type, label, is_leaf, sort_order)
VALUES 
    ('e2000000-0000-0000-0000-000000000001', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_registration', NULL, 'question', 'What is the legal entity type for this industrial manufacturing unit?', false, 0),
    ('e2000000-0000-0000-0000-000000000002', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_registration', 'e2000000-0000-0000-0000-000000000001', 'option', 'Private Limited Company (Pvt Ltd)', true, 1),
    ('e2000000-0000-0000-0000-000000000003', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_registration', 'e2000000-0000-0000-0000-000000000001', 'option', 'Limited Liability Partnership (LLP)', true, 2),
    ('e2000000-0000-0000-0000-000000000004', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_registration', 'e2000000-0000-0000-0000-000000000001', 'option', 'Public Limited Company (Ltd)', true, 3),

    ('e2000000-0000-0000-0000-000000000010', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_activity', NULL, 'question', 'What is the Central Pollution Control Board (CPCB) industrial classification?', false, 0),
    ('e2000000-0000-0000-0000-000000000011', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_activity', 'e2000000-0000-0000-0000-000000000010', 'option', 'Red Category (Heavy Heavy Engineering, Foundries, Electroplating)', true, 1),
    ('e2000000-0000-0000-0000-000000000012', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_activity', 'e2000000-0000-0000-0000-000000000010', 'option', 'Orange Category (Precision Machining, Light Assembly, Heat Treatment)', true, 2),
    ('e2000000-0000-0000-0000-000000000013', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_activity', 'e2000000-0000-0000-0000-000000000010', 'option', 'Green Category (Dry Assembly, Electrical Equipment, Hand Tools)', true, 3),
    ('e2000000-0000-0000-0000-000000000014', 'business', 'b0000000-0000-0000-0000-000000000001', 'business_activity', 'e2000000-0000-0000-0000-000000000010', 'option', 'White Category (Zero Pollution / Non-Polluting Micro Assembly)', true, 4)
ON CONFLICT (id) DO NOTHING;
