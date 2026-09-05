import { Approval } from '../types/swagat';

export const approvalsData: Approval[] = [
  // 1. CPCB / SPCB Consent to Establish & Operate (Applicable across all states via respective SPCBs)
  {
    id: 'app-cpcb-cto',
    code: 'SPCB-CTE-01',
    name: 'Consent to Establish (CTE) & Consent to Operate (CTO)',
    approvalName: 'Consent to Establish (CTE) & Consent to Operate (CTO)',
    department: 'State Pollution Control Board (KSPCB / GPCB / TNPCB / UPPCB / MPCB / TSPCB)',
    ministry: 'Ministry of Environment, Forest and Climate Change',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Rajasthan', 'Haryana', 'Delhi', 'West Bengal', 'Andhra Pradesh', 'Punjab', 'Madhya Pradesh'],
    category: 'Pollution & Environment',
    description: 'Mandatory statutory environmental clearance under the Water (Prevention and Control of Pollution) Act 1974 and Air Act 1981 before setting up or running manufacturing facilities.',
    longDescription: 'Under the Water Act 1974 and Air Act 1981, all manufacturing enterprises in Red, Orange, and Green categories must obtain Consent to Establish (CTE) prior to site civil construction and Consent to Operate (CTO) before commercial production.',
    requiredDocuments: [
      'Site Layout & Manufacturing Process Flowchart',
      'Effluent Treatment Plant (ETP) / Sewage Treatment Plant (STP) Scheme',
      'Air Pollution Control Measures (Stack Details)',
      'Capital Investment Certificate (CA Certified)',
      'Land Possession / Lease Agreement & Non-Agriculture (NA) Order'
    ],
    documents: [
      'Site Layout & Process Flowchart',
      'ETP/STP Scheme Blueprint',
      'Chartered Accountant Investment Certificate'
    ],
    eligibility: [
      'Industrial plants categorized under Red, Orange, or Green categories',
      'Manufacturing units with air/water discharges or hazardous waste generation'
    ],
    processingDays: 45,
    statutoryFee: '₹15,000 – ₹1,25,000 (Based on Capital Investment)',
    validityYears: '5 Years (Renewable)',
    stage: 'Pre-Establishment',
    type: 'State Clearance',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'Chemicals', 'Pharmaceuticals', 'Textiles', 'Automobile', 'Electronics & Semiconductors', 'Food Processing', 'Renewable Energy'],
    sector: 'Manufacturing',
    iconName: 'Factory',
    tags: ['Pollution', 'Environment', 'CTE', 'CTO', 'Mandatory', 'Green Clearance'],
    applicationUrl: '#apply-cte-cto',
    status: 'Active'
  },

  // 2. Factory License under Factories Act 1948 (All States)
  {
    id: 'app-factory-license',
    code: 'FAC-LIC-02',
    name: 'Factory License & Machinery Layout Approval',
    approvalName: 'Factory License & Machinery Layout Approval',
    department: 'Directorate of Industrial Safety and Health (DISH) / State Labour Dept',
    ministry: 'Ministry of Labour and Employment',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Haryana', 'Rajasthan', 'Delhi', 'West Bengal', 'Andhra Pradesh', 'Punjab'],
    category: 'Factory & Labour',
    description: 'Statutory manufacturing license required under the Factories Act, 1948 for any premises engaging 10+ workers with power or 20+ workers without power.',
    longDescription: 'Ensures occupational health, worker welfare, machinery safety, ventilation, emergency exits, and statutory fire safeguards in manufacturing premises before commissioning.',
    requiredDocuments: [
      'Factory Building Plan Approval Letter',
      'Machinery Layout & Electrical Connected Load Chart',
      'Stability Certificate from Chartered Civil Engineer',
      'List of Directors / Partners and Factory Manager Appointment',
      'Occupational Health & First-Aid Provision Plan'
    ],
    documents: [
      'Approved Building Plan',
      'Stability Certificate by Chartered Engineer',
      'Connected Power Load Schedule'
    ],
    eligibility: [
      'Enterprises with 10 or more workers using electrical power',
      'Enterprises with 20 or more workers working without power'
    ],
    processingDays: 30,
    statutoryFee: '₹8,500 – ₹65,000',
    validityYears: '10 Years',
    stage: 'Pre-Operation',
    type: 'State License',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'Automobile', 'Textiles', 'Electronics & Semiconductors', 'Pharmaceuticals', 'Food Processing', 'Chemicals'],
    sector: 'Manufacturing',
    iconName: 'Building2',
    tags: ['Safety', 'Factories Act', 'Labour', 'Workers', 'DISH'],
    applicationUrl: '#apply-factory-license',
    status: 'Active'
  },

  // 3. Central FSSAI License
  {
    id: 'app-fssai-license',
    code: 'FSSAI-LIC-03',
    name: 'FSSAI Central / State Food Business License',
    approvalName: 'FSSAI Central / State Food Business License',
    department: 'Food Safety and Standards Authority of India (FSSAI)',
    ministry: 'Ministry of Health and Family Welfare',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Health & Food Safety',
    description: 'Mandatory statutory license for manufacturing, processing, packaging, storage, distribution, and export of food and beverage products across India.',
    longDescription: 'Under the Food Safety and Standards Act 2006, all food business operators (FBOs) exceeding ₹12 Lakhs annual turnover or operating multi-state units must secure FSSAI licensing with strict hygiene audits.',
    requiredDocuments: [
      'Blueprint / Layout Plan of the Processing Unit',
      'List of Equipment and Machinery with installed capacities',
      'List of Food Categories to be manufactured',
      'Water Analysis Test Report from NABL Accredited Lab',
      'Food Safety Management System (FSMS) Plan or Certificate'
    ],
    documents: [
      'Processing Layout Blueprint',
      'NABL Water Potability Test Report',
      'FSMS Compliance Undertaking'
    ],
    eligibility: [
      'Food manufacturers, dairy processors, meat packaging, cold chains',
      'Food importers, exporters and 100% Export Oriented Units (EOUs)'
    ],
    processingDays: 25,
    statutoryFee: '₹7,500 / year',
    validityYears: '1 to 5 Years (Choice of Applicant)',
    stage: 'Pre-Operation',
    type: 'Central License',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Food Processing', 'Agriculture & Food', 'Retail & E-commerce', 'Tourism & Hospitality'],
    sector: 'Food Processing',
    iconName: 'Utensils',
    tags: ['Food Safety', 'FSSAI', 'FBO', 'Consumer Protection', 'Central'],
    applicationUrl: '#apply-fssai',
    status: 'Active'
  },

  // 4. Fire Safety Clearance & Final NOC (State)
  {
    id: 'app-fire-noc',
    code: 'FIRE-NOC-04',
    name: 'Fire Safety Clearance & Final NOC',
    approvalName: 'Fire Safety Clearance & Final NOC',
    department: 'State Directorate of Fire & Emergency Services',
    ministry: 'Ministry of Home Affairs / State Urban Development',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Delhi', 'Rajasthan', 'Haryana', 'West Bengal'],
    category: 'Fire Safety',
    description: 'Provisional and Final Fire NOC ensuring automated sprinklers, hydrants, smoke detectors, and emergency evacuation access under National Building Code (NBC) 2016.',
    longDescription: 'Mandatory certification following National Building Code (NBC) Part IV fire and life safety norms before building occupancy and power connection energization.',
    requiredDocuments: [
      'Architectural Layout with Fire Escape Stairs and Refuge Areas',
      'Hydrant & Sprinkler Design Schematic by Certified Fire Consultant',
      'Underground / Overhead Water Storage Tank Capacity Drawings',
      'Fire Audit & Mock Drill Compliance Certificate'
    ],
    documents: [
      'Architectural Fire Escape Drawings',
      'Sprinkler & Hydrant Schematics',
      'Fire Safety Equipment Bill of Quantities'
    ],
    eligibility: [
      'Industrial buildings exceeding 250 sq.m built-up area',
      'Commercial high-rise structures, IT campuses, warehouse complexes, and hotels'
    ],
    processingDays: 21,
    statutoryFee: '₹12,000 – ₹45,000 (Based on Built-Up Area)',
    validityYears: '1 Year (Annual Renewal)',
    stage: 'Pre-Establishment',
    type: 'State NOC',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Healthcare', 'Construction & Infrastructure', 'Textiles', 'Tourism & Hospitality', 'Automobile', 'Chemicals'],
    sector: 'Construction & Infrastructure',
    iconName: 'Flame',
    tags: ['Fire NOC', 'Safety', 'NBC 2016', 'Hazardous', 'State'],
    applicationUrl: '#apply-fire-noc',
    status: 'Active'
  },

  // 5. Importer-Exporter Code (IEC) Issuance (Central - DGFT)
  {
    id: 'app-dgft-iec',
    code: 'DGFT-IEC-05',
    name: 'Importer-Exporter Code (IEC) Issuance',
    approvalName: 'Importer-Exporter Code (IEC) Issuance',
    department: 'Directorate General of Foreign Trade (DGFT)',
    ministry: 'Ministry of Commerce and Industry',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Trade & Export',
    description: '10-digit PAN-based digital identification code required for all commercial import and export shipments across Indian customs ports.',
    longDescription: 'Enables custom clearance, cross-border remittance through authorized dealer banks, and claim of export incentives under Foreign Trade Policy (RoDTEP, EPCG, Advance Authorisation).',
    requiredDocuments: [
      'PAN Card of Entity (Company / LLP / Firm)',
      'Bank Account Certificate or Cancelled Cheque',
      'Proof of Address of Registered Business Location',
      'Digital Signature Certificate (DSC) / Aadhaar e-Sign'
    ],
    documents: [
      'Company PAN Card',
      'Cancelled Cheque with Pre-printed Name',
      'Registered Office Proof'
    ],
    eligibility: [
      'Any business entity planning cross-border export or import of goods/services'
    ],
    processingDays: 1,
    statutoryFee: '₹500',
    validityYears: 'Lifetime (Annual Online Re-validation Free)',
    stage: 'Pre-Operation',
    type: 'Central License',
    mandatory: false,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Pharmaceuticals', 'Textiles', 'Electronics & Semiconductors', 'Food Processing', 'Automobile', 'Logistics', 'Retail & E-commerce'],
    sector: 'Logistics',
    iconName: 'Ship',
    tags: ['Export', 'Import', 'DGFT', 'Customs', 'Instant Issuance', 'Central'],
    applicationUrl: '#apply-iec',
    status: 'Active'
  },

  // 6. High Tension (HT) Industrial Power Sanction (State Discoms)
  {
    id: 'app-power-load',
    code: 'UTIL-ELEC-06',
    name: 'High Tension (HT) / Low Tension Industrial Power Load Sanction',
    approvalName: 'High Tension (HT) / Low Tension Industrial Power Load Sanction',
    department: 'State Electricity Distribution Co. (BESCOM / UGVCL / TANGEDCO / UPPCL / MSEDCL / TSSPDCL)',
    ministry: 'Ministry of Power / State Energy Department',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Maharashtra', 'Telangana', 'Haryana', 'Rajasthan', 'Delhi', 'West Bengal', 'Andhra Pradesh'],
    category: 'Electricity & Utilities',
    description: 'Sanction and energization of dedicated high-voltage or low-voltage industrial power connections, including transformer substation CEIG inspection approval.',
    longDescription: 'Processes load feasibility survey, installation of metering units, submission of safety test certificates from Electrical Inspectorate, and line energization.',
    requiredDocuments: [
      'Connected Load List with Motor Ratings and Kilowatt Demand',
      'Electrical Contractor Test Report & CEIG Safety Approval',
      'Land Ownership Proof / Factory Allotment Letter',
      'NOC from Local Authority / Industrial Development Board'
    ],
    documents: [
      'Connected Machinery Load Schedule',
      'Electrical Contractor Safety Certificate',
      'Land Title / Allotment Letter'
    ],
    eligibility: [
      'All industrial, commercial and processing units requiring dedicated electricity supply'
    ],
    processingDays: 20,
    statutoryFee: 'Based on Connected Load Demand (₹2,500/kVA)',
    validityYears: 'Continuous Contract',
    stage: 'Pre-Establishment',
    type: 'State Utility',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Automobile', 'Textiles', 'Electronics & Semiconductors', 'Chemicals', 'Pharmaceuticals'],
    sector: 'Manufacturing',
    iconName: 'Zap',
    tags: ['Electricity', 'Power Load', 'Discom', 'HT Connection', 'Substation', 'State'],
    applicationUrl: '#apply-power-load',
    status: 'Active'
  },

  // 7. DPIIT Startup India Recognition & Tax Holiday (Central)
  {
    id: 'app-dpiit-startup',
    code: 'DPIIT-REC-07',
    name: 'DPIIT Startup India Recognition & 80-IAC Tax Exemption',
    approvalName: 'DPIIT Startup India Recognition & 80-IAC Tax Exemption',
    department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    ministry: 'Ministry of Commerce and Industry',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Business Registration',
    description: 'Official Government of India certification providing 3-year income tax holiday, angel tax exemption, 80% patent rebate, and public procurement relaxations.',
    longDescription: 'Empowers innovative, scalable and tech-driven Indian startups with access to government public procurement relaxations (no prior turnover/experience criteria) and SIDBI Fund of Funds.',
    requiredDocuments: [
      'Certificate of Incorporation / Registration (MCA)',
      'Brief Pitch Deck & Video Demonstrating Innovation / Scalability',
      'Website Link, Product Demo URL or Mobile App Link',
      'Audited Financial Statements / Balance Sheet'
    ],
    documents: [
      'MCA Certificate of Incorporation',
      'Innovation Pitch Deck',
      'Product Demo URL / App Link'
    ],
    eligibility: [
      'Entity incorporated as Private Limited or LLP within the last 10 years',
      'Annual turnover has not exceeded ₹100 Crores in any financial year',
      'Working towards innovation, development or improvement of products/services/processes'
    ],
    processingDays: 7,
    statutoryFee: 'Free (₹0 Government Fee)',
    validityYears: '10 Years from Incorporation',
    stage: 'Pre-Establishment',
    type: 'Central Recognition',
    mandatory: false,
    onlineFormAvailable: true,
    sectorApplicability: ['IT & Technology', 'Healthcare', 'Electronics & Semiconductors', 'Renewable Energy', 'Retail & E-commerce', 'Automobile', 'Financial Services', 'Education', 'Logistics'],
    sector: 'IT & Technology',
    iconName: 'Sparkles',
    tags: ['Startup India', 'Tax Exemption', 'DPIIT', 'Innovation', 'Fast-Track', 'Zero Fee', 'Central'],
    applicationUrl: '#apply-dpiit',
    status: 'Active'
  },

  // 8. Company Incorporation via MCA SPICe+ (Central)
  {
    id: 'app-mca-incorporation',
    code: 'MCA-SPICE-08',
    name: 'Company Incorporation & Corporate Affairs Filings (SPICe+)',
    approvalName: 'Company Incorporation & Corporate Affairs Filings (SPICe+)',
    department: 'Ministry of Corporate Affairs (MCA)',
    ministry: 'Ministry of Corporate Affairs',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Business Registration',
    description: 'Integrated single-window digital filing for Company Name Reservation, Director Identification Number (DIN), Certificate of Incorporation (COI), PAN, TAN, EPFO, ESIC, and Bank Account.',
    longDescription: 'Simplified Proforma for Incorporating Company Electronically (SPICe+ Form INC-32) consolidates 10 separate central and state registrations into a single instantaneous web-form.',
    requiredDocuments: [
      'Identity & Address Proof of Proposed Directors (Passport/Voter ID/Driving License)',
      'Registered Office Proof (Utility Bill + NOC from Property Owner)',
      'Memorandum of Association (e-MoA) & Articles of Association (e-AoA)',
      'Digital Signature Certificates (Class 3 DSC) of all Promoters'
    ],
    documents: [
      'Promoter Identity & Address Proof',
      'Registered Office Utility Bill & Owner NOC',
      'Digital Signature Certificate (DSC)'
    ],
    eligibility: [
      'All entrepreneurs and corporate entities establishing a Private Limited, Public Limited, Section 8 or One Person Company in India'
    ],
    processingDays: 3,
    statutoryFee: '₹0 for authorized capital up to ₹15 Lakhs (Statutory state stamp duty extra)',
    validityYears: 'Perpetual Existence',
    stage: 'Pre-Establishment',
    type: 'Central Registration',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Healthcare', 'Pharmaceuticals', 'Food Processing', 'Textiles', 'Automobile', 'Electronics & Semiconductors', 'Construction & Infrastructure', 'Tourism & Hospitality', 'Renewable Energy', 'Chemicals', 'Mining', 'Retail & E-commerce', 'Oil & Gas', 'Aviation', 'Financial Services', 'Education', 'Logistics'],
    sector: 'Manufacturing',
    iconName: 'Building',
    tags: ['MCA', 'SPICe+', 'Incorporation', 'CIN', 'PAN/TAN', 'DIN', 'Central'],
    applicationUrl: '#apply-mca-spice',
    status: 'Active'
  },

  // 9. Udyam MSME Registration Certificate (Central)
  {
    id: 'app-udyam-msme',
    code: 'MSME-UDYAM-09',
    name: 'Udyam MSME Registration Certificate',
    approvalName: 'Udyam MSME Registration Certificate',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Business Registration',
    description: 'Official digital self-declaration certificate granting micro, small and medium enterprises priority sector lending, collateral-free credit, tender fee exemptions, and delayed payment dispute resolution.',
    longDescription: 'Fully integrated with Income Tax and GST databases. Automatically classifies businesses based on plant & machinery investment (<₹1Cr Micro, <₹10Cr Small, <₹50Cr Medium) and turnover limits.',
    requiredDocuments: [
      'Aadhaar Number of Proprietor / Managing Director',
      'PAN Number of Enterprise',
      'GSTIN (Unless exempt under GST Act)',
      'Bank Account Number and IFSC Code'
    ],
    documents: [
      'Aadhaar Card of Signatory',
      'Enterprise PAN Card',
      'Bank Account Number & IFSC'
    ],
    eligibility: [
      'Enterprises engaged in manufacturing or service activities meeting MSME investment & turnover criteria'
    ],
    processingDays: 1,
    statutoryFee: 'Free (₹0 Official Portal Fee)',
    validityYears: 'Permanent / Lifetime',
    stage: 'Pre-Establishment',
    type: 'Central Certificate',
    mandatory: false,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Food Processing', 'Textiles', 'Electronics & Semiconductors', 'Retail & E-commerce', 'Healthcare', 'Renewable Energy', 'Automobile', 'Agriculture & Food'],
    sector: 'Manufacturing',
    iconName: 'Award',
    tags: ['MSME', 'Udyam', 'Zero Fee', 'Subsidies', 'Priority Lending', 'Central'],
    applicationUrl: '#apply-udyam',
    status: 'Active'
  },

  // 10. DoT OSP / IP-1 Telecom Registration (Central - IT/Tech)
  {
    id: 'app-dot-osp',
    code: 'DOT-OSP-10',
    name: 'DoT Other Service Provider (OSP) / IP-1 Registration',
    approvalName: 'DoT Other Service Provider (OSP) / IP-1 Registration',
    department: 'Department of Telecommunications (DoT)',
    ministry: 'Ministry of Communications',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Telecom & IT',
    description: 'Registration for IT-enabled services (BPO, KPO, call centers, SaaS telecom interconnect, and data centers) operating voice and non-voice business processes.',
    longDescription: 'Substantially deregulated in 2021 by DoT. Replaced cumbersome security deposits with simple digital self-declaration, allowing work-from-anywhere and international cross-connections.',
    requiredDocuments: [
      'Certificate of Incorporation (CIN) and MoA / AoA',
      'Network Architecture Diagram & Leased Line Circuit Details',
      'Board Resolution authorizing Authorized Signatory',
      'List of Directors with Contact Information'
    ],
    documents: [
      'Network Architecture Topology Diagram',
      'MCA Certificate of Incorporation',
      'Board Resolution for Authorized Signatory'
    ],
    eligibility: [
      'IT, BPM, Call Centers, Cloud Service Providers and FinTech platforms in India'
    ],
    processingDays: 2,
    statutoryFee: '₹0 (Registration fee waived under reformed OSP guidelines)',
    validityYears: '20 Years',
    stage: 'Pre-Operation',
    type: 'Central Registration',
    mandatory: false,
    onlineFormAvailable: true,
    sectorApplicability: ['IT & Technology', 'Telecom', 'Retail & E-commerce', 'Financial Services'],
    sector: 'IT & Technology',
    iconName: 'Radio',
    tags: ['DoT', 'IT-BPM', 'OSP', 'Telecom', 'Zero Fee', 'Central'],
    applicationUrl: '#apply-dot-osp',
    status: 'Active'
  },

  // 11. State Industrial Land Allotment (Karnataka - KIADB, Gujarat - GIDC, Tamil Nadu - SIPCOT, UP - UPSIDA, etc.)
  {
    id: 'app-state-land',
    code: 'LAND-DEV-11',
    name: 'State Industrial Land / Tech Park Allotment & Lease Possession',
    approvalName: 'State Industrial Land / Tech Park Allotment & Lease Possession',
    department: 'State Industrial Development Corporation (KIADB / GIDC / SIPCOT / UPSIDA / TSIIC / MIDC)',
    ministry: 'State Department of Industries & Commerce',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Maharashtra', 'Haryana', 'Rajasthan', 'Andhra Pradesh', 'Odisha', 'Madhya Pradesh'],
    category: 'Land & Infrastructure',
    description: 'Direct allotment of ready-to-build industrial plots, electronics parks, pharma clusters, or plug-and-play tech park sheds with pre-cleared industrial zoning.',
    longDescription: 'Provides 90 to 99-year long-term leasehold industrial plots with pre-laid road networks, water supply pipelines, sub-station electricity connectivity, and common effluent infrastructure.',
    requiredDocuments: [
      'Detailed Project Report (DPR) with 5-Year Financial & Employment Projections',
      'Site Block Plan showing Proposed Floor Space Index (FSI) Utilization',
      'Company Board Resolution & Power of Attorney',
      'Financial Net Worth Certificate / Bank Solvency Proof'
    ],
    documents: [
      'Detailed Project Report (DPR)',
      'Site Block Plan with FSI Calculations',
      'Bank Solvency / Net Worth Certificate'
    ],
    eligibility: [
      'Micro, Small, Medium, Large or Mega industrial investment projects in the respective state'
    ],
    processingDays: 30,
    statutoryFee: '₹2,000 Processing Fee + Land Premium as per State Industrial Board Rates',
    validityYears: '95 Years Lease',
    stage: 'Pre-Establishment',
    type: 'State Allotment',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Manufacturing', 'IT & Technology', 'Automobile', 'Pharmaceuticals', 'Electronics & Semiconductors', 'Textiles', 'Chemicals', 'Food Processing'],
    sector: 'Manufacturing',
    iconName: 'Landmark',
    tags: ['Industrial Land', 'Infrastructure', 'KIADB', 'GIDC', 'SIPCOT', 'UPSIDA', 'State'],
    applicationUrl: '#apply-industrial-land',
    status: 'Active'
  },

  // 12. CDSCO Drug Manufacturing License (Central / State FDA)
  {
    id: 'app-cdsco-pharma',
    code: 'CDSCO-LIC-12',
    name: 'CDSCO Drug Manufacturing & Quality Control License',
    approvalName: 'CDSCO Drug Manufacturing & Quality Control License',
    department: 'Central Drugs Standard Control Organization (CDSCO) / State FDA',
    ministry: 'Ministry of Health and Family Welfare',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Health & Food Safety',
    description: 'Mandatory statutory license under Drugs and Cosmetics Rules for manufacturing APIs, biologicals, medical devices, and pharmaceutical dosage formulations.',
    longDescription: 'Enforces Good Manufacturing Practices (WHO-GMP Schedule M), clean-room air handling units (AHU), sterile quality assurance protocols, and clinical stability testing.',
    requiredDocuments: [
      'Site Master File & HVAC Air Handling Schematics',
      'List of Technical Staff & Approved Competent Persons',
      'Equipment Qualification & Analytical Method Validation Dossier',
      'Consent to Operate from State Pollution Control Board'
    ],
    documents: [
      'Site Master File (SMF)',
      'HVAC Clean Room Layout',
      'Qualified Technical Persons Registration'
    ],
    eligibility: [
      'Pharmaceutical manufacturers, vaccine facilities, IVD kit and medical device producers'
    ],
    processingDays: 60,
    statutoryFee: '₹25,000 – ₹1,50,000',
    validityYears: '5 Years',
    stage: 'Pre-Operation',
    type: 'Central License',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Pharmaceuticals', 'Healthcare'],
    sector: 'Pharmaceuticals',
    iconName: 'Pill',
    tags: ['Pharma', 'CDSCO', 'FDA', 'GMP', 'Medical Devices', 'Central'],
    applicationUrl: '#apply-cdsco',
    status: 'Active'
  },

  // 13. BIS Certification & Compulsory Registration Scheme (CRS)
  {
    id: 'app-bis-crs',
    code: 'BIS-CRS-13',
    name: 'BIS Product Quality Certification & Compulsory Registration (CRS)',
    approvalName: 'BIS Product Quality Certification & Compulsory Registration (CRS)',
    department: 'Bureau of Indian Standards (BIS)',
    ministry: 'Ministry of Consumer Affairs, Food and Public Distribution',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Trade & Export',
    description: 'Mandatory product quality and safety standard certification for electronics, IT goods, solar panels, auto components, and steel.',
    longDescription: 'Certifies that electronic and electrical products meet IS (Indian Standards) for electrical insulation, electromagnetic compatibility, and radiation safety through accredited lab testing.',
    requiredDocuments: [
      'Safety Test Reports from BIS Recognized Laboratory',
      'Factory Inspection Report and Manufacturing QC Equipment Details',
      'Trademark Registration Certificate / Authorization Letter',
      'Undertaking for Compliance with Indian Standards'
    ],
    documents: [
      'BIS Accredited Lab Safety Test Report',
      'Factory QC Testing Machinery List',
      'Trademark Registration Certificate'
    ],
    eligibility: [
      'Domestic manufacturers and importers bringing electronic/industrial products into India'
    ],
    processingDays: 30,
    statutoryFee: '₹35,000 – ₹75,000',
    validityYears: '2 Years (Renewable up to 5 Years)',
    stage: 'Pre-Operation',
    type: 'Central Standard',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Electronics & Semiconductors', 'Automobile', 'Solar Energy', 'Manufacturing', 'IT & Technology'],
    sector: 'Electronics & Semiconductors',
    iconName: 'Cpu',
    tags: ['BIS', 'Standards', 'ISI Mark', 'CRS', 'Electronics Safety', 'Central'],
    applicationUrl: '#apply-bis',
    status: 'Active'
  },

  // 14. PESO Storage License for Bulk Chemicals & Petroleum (Central)
  {
    id: 'app-peso-storage',
    code: 'PESO-LIC-14',
    name: 'PESO Storage & Handling License for Petroleum & Solvents',
    approvalName: 'PESO Storage & Handling License for Petroleum & Solvents',
    department: 'Petroleum and Explosives Safety Organization (PESO)',
    ministry: 'Ministry of Commerce and Industry (DPIIT)',
    centralOrState: 'Central',
    state: 'Central (Pan-India)',
    statesApplicable: ['All States'],
    category: 'Mining & Explosives',
    description: 'Statutory clearance under Petroleum Rules 2002 and Gas Cylinders Rules for bulk storage tanks, solvents, LPG, and hazardous volatile materials.',
    longDescription: 'Enforces stringent safety perimeters, dyke wall specifications, flameproof electrical fittings, and emergency venting systems before storing Class A/B/C petroleum products or compressed gases.',
    requiredDocuments: [
      'Safety Distances & Fabrication Drawing of Pressure Vessels / Storage Tanks',
      'Hydrostatic Pressure Test Certificate by Competent Person',
      'Site Layout showing safety clear buffer zones',
      'Local District Magistrate / Police NOC'
    ],
    documents: [
      'Storage Tank Fabrication & Layout Drawing',
      'Hydrostatic Pressure Test Certificate',
      'District Magistrate No Objection Certificate'
    ],
    eligibility: [
      'Industrial units storing bulk solvents, diesel generator fuel > 2,500L, LPG or specialty gases'
    ],
    processingDays: 40,
    statutoryFee: '₹10,000 – ₹50,000',
    validityYears: '3 to 5 Years',
    stage: 'Pre-Establishment',
    type: 'Central License',
    mandatory: false,
    onlineFormAvailable: true,
    sectorApplicability: ['Chemicals', 'Pharmaceuticals', 'Oil & Gas', 'Manufacturing', 'Automobile'],
    sector: 'Chemicals',
    iconName: 'Fuel',
    tags: ['PESO', 'Hazardous', 'Petroleum', 'Chemical Safety', 'Central'],
    applicationUrl: '#apply-peso',
    status: 'Active'
  },

  // 15. Municipal Commercial Trade License (All States / Cities)
  {
    id: 'app-municipal-trade',
    code: 'MUNIC-TRD-15',
    name: 'Municipal Corporation Trade & Health License',
    approvalName: 'Municipal Corporation Trade & Health License',
    department: 'Urban Local Body / Municipal Corporation (BBMP / BMC / MCD / GHMC / GCC)',
    ministry: 'State Urban Development Department',
    centralOrState: 'State',
    state: 'All States',
    statesApplicable: ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'],
    category: 'Local Permissions',
    description: 'Statutory municipal permission to operate commercial trade, professional services, retail outlets, restaurants, or storage warehouses within municipal limits.',
    longDescription: 'Ensures the commercial establishment does not pose a public health hazard, nuisance, or fire safety violation to the surrounding local urban community.',
    requiredDocuments: [
      'Property Tax Receipt / Registered Lease Deed',
      'Fire Safety NOC / Self-declaration',
      'Approved Floor Plan of Premises',
      'Shop and Establishment Act Registration'
    ],
    documents: [
      'Registered Commercial Lease Deed',
      'Property Tax Clearance Certificate',
      'Floor Area Blueprint'
    ],
    eligibility: [
      'All commercial shops, offices, software campuses, restaurants, and service establishments'
    ],
    processingDays: 14,
    statutoryFee: '₹2,500 – ₹18,000',
    validityYears: '1 Year (Annual Renewal)',
    stage: 'Pre-Operation',
    type: 'Municipal License',
    mandatory: true,
    onlineFormAvailable: true,
    sectorApplicability: ['Retail & E-commerce', 'IT & Technology', 'Tourism & Hospitality', 'Healthcare', 'Financial Services', 'Food Processing', 'Education'],
    sector: 'Retail & E-commerce',
    iconName: 'ShoppingBag',
    tags: ['Trade License', 'Municipal', 'Gumasta', 'Local Body', 'State'],
    applicationUrl: '#apply-trade-license',
    status: 'Active'
  }
];
