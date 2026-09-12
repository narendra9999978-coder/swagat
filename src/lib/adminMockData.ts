/**
 * SWAGAT Admin Dashboard — Comprehensive PAN-India Mock Data Store
 * Provides realistic data for all 17 Admin Dashboard modules.
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AppStatusAdmin =
  | 'Draft' | 'Submitted' | 'Under Review' | 'Query Raised'
  | 'Response Submitted' | 'Approved' | 'Rejected';

export type SLAStatusType = 'On Track' | 'Due Soon' | 'Due Today' | 'Overdue';
export type QueryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type QueryStatus = 'Open' | 'Assigned' | 'Under Review' | 'Responded' | 'Resolved';
export type RenewalStatus = 'Upcoming' | 'Due Soon' | 'Expired' | 'Renewed';
export type ComplexityLevel = 'Low' | 'Medium' | 'High';

export interface AdminApplication {
  id: string;
  trackingNumber: string;
  applicantName: string;
  companyName: string;
  email: string;
  state: string;
  sector: string;
  approvalName: string;
  department: string;
  ministry: string;
  submittedDate: string;
  lastUpdated: string;
  currentStatus: AppStatusAdmin;
  slaDeadlineDays: number;
  slaRemainingDays: number;
  slaStatus: SLAStatusType;
  investmentAmount: string;
  complexity: ComplexityLevel;
  documentsCount: number;
  queriesCount: number;
  timeline: { label: string; date: string; done: boolean; current: boolean }[];
}

export interface AdminDepartment {
  id: string;
  name: string;
  ministry: string;
  level: 'Central' | 'State';
  state?: string;
  sectors: string[];
  approvalsCount: number;
  activeApplications: number;
  avgProcessingDays: number;
  slaCompliance: number; // percentage
  status: 'Active' | 'Inactive';
  contactEmail: string;
  helpline: string;
}

export interface AdminApproval {
  id: string;
  code: string;
  name: string;
  type: 'Central' | 'State';
  level: 'Mandatory' | 'Conditional' | 'Optional';
  state: string;
  sector: string;
  department: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  processingDays: number;
  renewalRequired: boolean;
  renewalPeriodYears: number;
  applicationUrl: string;
  status: 'Active' | 'Inactive';
  applicationsCount: number;
  approvedCount: number;
  statutoryFee: string;
}

export interface AdminQuery {
  id: string;
  queryNumber: string;
  applicantName: string;
  companyName: string;
  applicationId: string;
  trackingNumber: string;
  department: string;
  state: string;
  sector: string;
  queryText: string;
  raisedDate: string;
  priority: QueryPriority;
  status: QueryStatus;
  assignedTo?: string;
  responseText?: string;
  responseDate?: string;
  escalationLevel: number;
}

export interface AdminRenewal {
  id: string;
  approvalName: string;
  applicantName: string;
  companyName: string;
  licenseNumber: string;
  state: string;
  sector: string;
  department: string;
  expiryDate: string;
  daysRemaining: number;
  renewalStatus: RenewalStatus;
  renewalFee: string;
  lastRenewalDate?: string;
}

export interface AdminScheme {
  id: string;
  name: string;
  ministry: string;
  level: 'Central' | 'State';
  state?: string;
  sectors: string[];
  eligibility: string[];
  benefits: string;
  maxSupport: string;
  applicationUrl: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Inactive' | 'Upcoming';
  applicantsCount: number;
  budgetAllocated: string;
}

export interface AdminSLARecord {
  id: string;
  applicationId: string;
  trackingNumber: string;
  applicantName: string;
  department: string;
  state: string;
  approvalName: string;
  slaDays: number;
  remainingDays: number;
  slaStatus: SLAStatusType;
  submittedDate: string;
  deadlineDate: string;
  assignedOfficer: string;
  escalationLevel: number;
}

export interface AdminNotification {
  id: string;
  type: 'Application Update' | 'SLA Warning' | 'Renewal Reminder' | 'System Announcement' | 'Scheme Update' | 'Query Update';
  title: string;
  message: string;
  target: 'All Users' | 'Specific State' | 'Specific Sector' | 'Specific User';
  targetValue?: string;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sentCount?: number;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  module: string;
  target: string;
  timestamp: string;
  result: 'Success' | 'Failed';
  ipAddress: string;
  details?: string;
}

export interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  conditions: { field: string; operator: string; value: string }[];
  thenRecommend: string[];
  dependencies: { from: string; to: string; type: 'Sequential' | 'Parallel' }[];
  complexity: ComplexityLevel;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

export interface AdminDocumentType {
  id: string;
  name: string;
  category: string;
  required: 'Required' | 'Optional' | 'Conditional';
  approvalMappings: string[];
  sectorMappings: string[];
  stateMappings: string[];
  validityPeriodMonths: number;
  acceptedFormats: string[];
  maxSizeMB: number;
  status: 'Active' | 'Inactive';
  submissionsCount: number;
}

export interface AdminSector {
  id: string;
  name: string;
  icon: string;
  description: string;
  approvalsCount: number;
  activeApplications: number;
  totalApplications: number;
  departments: string[];
  popularStates: string[];
  avgProcessingDays: number;
  status: 'Active' | 'Inactive';
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SECTORS
// ─────────────────────────────────────────────────────────────────────────────

export const adminSectors: AdminSector[] = [
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Heavy engineering, metal fabrication, industrial machinery and precision tools.', approvalsCount: 42, activeApplications: 184, totalApplications: 1240, departments: ['DPIIT', 'MoEFCC', 'MoLE'], popularStates: ['Gujarat', 'Maharashtra', 'Tamil Nadu', 'Haryana'], avgProcessingDays: 28, status: 'Active', color: 'from-blue-600 to-indigo-700' },
  { id: 'electronics', name: 'Electronics & Semiconductors', icon: '💻', description: 'PCB assembly, semiconductor fabs, consumer electronics, EV components.', approvalsCount: 38, activeApplications: 142, totalApplications: 890, departments: ['MeitY', 'DPIIT', 'MoEFCC'], popularStates: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh'], avgProcessingDays: 22, status: 'Active', color: 'from-sky-500 to-blue-600' },
  { id: 'it-technology', name: 'IT & Technology', icon: '🖥️', description: 'Software development, SaaS, AI/ML, cloud data centers, IT-BPM.', approvalsCount: 18, activeApplications: 98, totalApplications: 620, departments: ['DoT', 'MeitY', 'MoF'], popularStates: ['Karnataka', 'Telangana', 'Maharashtra', 'Delhi'], avgProcessingDays: 12, status: 'Active', color: 'from-violet-500 to-purple-600' },
  { id: 'pharmaceuticals', name: 'Pharmaceuticals', icon: '💊', description: 'Bulk drug manufacturing, formulations, API production, clinical research.', approvalsCount: 46, activeApplications: 112, totalApplications: 780, departments: ['CDSCO', 'MoHFW', 'DPIIT'], popularStates: ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Telangana'], avgProcessingDays: 35, status: 'Active', color: 'from-emerald-500 to-teal-600' },
  { id: 'renewable-energy', name: 'Renewable Energy', icon: '☀️', description: 'Solar parks, wind energy, hydro, biomass, green hydrogen facilities.', approvalsCount: 34, activeApplications: 88, totalApplications: 540, departments: ['MNRE', 'MoP', 'CEA'], popularStates: ['Rajasthan', 'Gujarat', 'Tamil Nadu', 'Karnataka'], avgProcessingDays: 40, status: 'Active', color: 'from-yellow-500 to-amber-600' },
  { id: 'automobile', name: 'Automobile', icon: '🚗', description: 'Auto OEMs, EV manufacturing, component suppliers, battery systems.', approvalsCount: 38, activeApplications: 76, totalApplications: 460, departments: ['DHI', 'DPIIT', 'MoLE'], popularStates: ['Maharashtra', 'Tamil Nadu', 'Haryana', 'Gujarat'], avgProcessingDays: 30, status: 'Active', color: 'from-red-500 to-rose-600' },
  { id: 'food-processing', name: 'Food Processing', icon: '🌾', description: 'Packaged foods, cold chain, agri-processing, beverages, dairy.', approvalsCount: 32, activeApplications: 64, totalApplications: 380, departments: ['MoFPI', 'FSSAI', 'MoA'], popularStates: ['Punjab', 'Maharashtra', 'Uttar Pradesh', 'West Bengal'], avgProcessingDays: 25, status: 'Active', color: 'from-orange-500 to-amber-600' },
  { id: 'textiles', name: 'Textiles', icon: '🧵', description: 'Spinning, weaving, technical textiles, garments, khadi and handicrafts.', approvalsCount: 28, activeApplications: 52, totalApplications: 340, departments: ['MoT', 'DPIIT', 'MoLE'], popularStates: ['Tamil Nadu', 'Maharashtra', 'Gujarat', 'West Bengal'], avgProcessingDays: 22, status: 'Active', color: 'from-pink-500 to-rose-500' },
  { id: 'chemicals', name: 'Chemicals', icon: '⚗️', description: 'Specialty chemicals, petrochemicals, fertilizers, agrochemicals.', approvalsCount: 44, activeApplications: 68, totalApplications: 420, departments: ['DoC', 'MoEFCC', 'PESO'], popularStates: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Andhra Pradesh'], avgProcessingDays: 45, status: 'Active', color: 'from-lime-500 to-green-600' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Hospitals, diagnostic centers, medical devices, health infrastructure.', approvalsCount: 36, activeApplications: 58, totalApplications: 320, departments: ['MoHFW', 'CDSCO', 'NMC'], popularStates: ['Delhi', 'Karnataka', 'Maharashtra', 'Tamil Nadu'], avgProcessingDays: 28, status: 'Active', color: 'from-cyan-500 to-blue-500' },
  { id: 'logistics', name: 'Logistics', icon: '🚚', description: 'Warehousing, 3PL, freight, multimodal logistics, cold chain hubs.', approvalsCount: 24, activeApplications: 44, totalApplications: 260, departments: ['MoRTH', 'Railways', 'MoCA'], popularStates: ['Maharashtra', 'Uttar Pradesh', 'Haryana', 'Delhi'], avgProcessingDays: 18, status: 'Active', color: 'from-slate-500 to-slate-600' },
  { id: 'construction', name: 'Construction & Infrastructure', icon: '🏗️', description: 'Real estate, industrial parks, road/highway projects, bridges, tunnels.', approvalsCount: 52, activeApplications: 122, totalApplications: 780, departments: ['MoHUA', 'RERA', 'MoRTH'], popularStates: ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana'], avgProcessingDays: 55, status: 'Active', color: 'from-stone-500 to-stone-600' },
  { id: 'aviation', name: 'Aviation', icon: '✈️', description: 'MRO facilities, cargo terminals, ground handling, airport retail.', approvalsCount: 30, activeApplications: 18, totalApplications: 120, departments: ['MoCA', 'AAI', 'DGCA'], popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'], avgProcessingDays: 60, status: 'Active', color: 'from-indigo-500 to-blue-600' },
  { id: 'mining', name: 'Mining', icon: '⛏️', description: 'Coal, iron ore, bauxite, sand mining, quarrying, gem mining.', approvalsCount: 40, activeApplications: 38, totalApplications: 240, departments: ['MoM', 'DGMS', 'IBM'], popularStates: ['Jharkhand', 'Odisha', 'Rajasthan', 'Chhattisgarh'], avgProcessingDays: 90, status: 'Active', color: 'from-stone-600 to-stone-700' },
  { id: 'education', name: 'Education', icon: '🎓', description: 'Private schools, colleges, universities, edtech institutes, skill centers.', approvalsCount: 22, activeApplications: 36, totalApplications: 220, departments: ['DoE', 'UGC', 'AICTE'], popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'], avgProcessingDays: 45, status: 'Active', color: 'from-amber-500 to-yellow-500' },
  { id: 'tourism', name: 'Tourism & Hospitality', icon: '🏨', description: 'Hotels, resorts, adventure tourism, travel agencies, MICE venues.', approvalsCount: 26, activeApplications: 42, totalApplications: 280, departments: ['MoT', 'FSSAI', 'MoCA'], popularStates: ['Kerala', 'Goa', 'Rajasthan', 'Himachal Pradesh'], avgProcessingDays: 30, status: 'Active', color: 'from-teal-500 to-cyan-600' },
  { id: 'telecom', name: 'Telecom', icon: '📡', description: 'Mobile towers, data centers, broadband infrastructure, OTT platforms.', approvalsCount: 20, activeApplications: 28, totalApplications: 180, departments: ['DoT', 'TRAI', 'BIS'], popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'], avgProcessingDays: 35, status: 'Active', color: 'from-purple-500 to-violet-600' },
  { id: 'ports-shipping', name: 'Ports & Shipping', icon: '🚢', description: 'Port facilities, ship repair yards, marine engineering, inland waterways.', approvalsCount: 32, activeApplications: 24, totalApplications: 160, departments: ['MoPSW', 'DG Shipping', 'CEA'], popularStates: ['Gujarat', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh'], avgProcessingDays: 75, status: 'Active', color: 'from-blue-600 to-cyan-700' },
  { id: 'agriculture', name: 'Agriculture & Food', icon: '🌱', description: 'Agri-infrastructure, seed processing, irrigation projects, farm equipment.', approvalsCount: 28, activeApplications: 46, totalApplications: 300, departments: ['MoA', 'MoFPI', 'NHB'], popularStates: ['Punjab', 'Haryana', 'Maharashtra', 'Uttar Pradesh'], avgProcessingDays: 35, status: 'Active', color: 'from-green-500 to-emerald-600' },
  { id: 'financial-services', name: 'Financial Services', icon: '🏦', description: 'Banks, NBFCs, insurance companies, fintech, payment aggregators.', approvalsCount: 18, activeApplications: 32, totalApplications: 210, departments: ['RBI', 'SEBI', 'IRDAI'], popularStates: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'], avgProcessingDays: 45, status: 'Active', color: 'from-emerald-600 to-teal-700' },
  { id: 'oil-gas', name: 'Oil & Gas', icon: '⛽', description: 'Petroleum refineries, LPG bottling, CNG stations, pipelines.', approvalsCount: 38, activeApplications: 26, totalApplications: 180, departments: ['MoPNG', 'PESO', 'OISD'], popularStates: ['Gujarat', 'Rajasthan', 'Assam', 'Maharashtra'], avgProcessingDays: 60, status: 'Active', color: 'from-amber-600 to-orange-700' },
  { id: 'retail', name: 'Retail & E-commerce', icon: '🛒', description: 'Large format retail, e-commerce warehouses, FDI retail, franchise models.', approvalsCount: 16, activeApplications: 38, totalApplications: 250, departments: ['DPIIT', 'MoCI', 'FMC'], popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'], avgProcessingDays: 15, status: 'Active', color: 'from-rose-500 to-pink-600' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DEPARTMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const adminDepartments: AdminDepartment[] = [
  { id: 'dept-mpcb', name: 'Maharashtra Pollution Control Board (MPCB)', ministry: 'Environment & Climate Change', level: 'State', state: 'Maharashtra', sectors: ['Manufacturing', 'Chemicals', 'Pharmaceuticals'], approvalsCount: 18, activeApplications: 42, avgProcessingDays: 32, slaCompliance: 84, status: 'Active', contactEmail: 'helpdesk@mpcb.gov.in', helpline: '1800-224-545' },
  { id: 'dept-kspcb', name: 'Karnataka State Pollution Control Board (KSPCB)', ministry: 'Environment & Climate Change', level: 'State', state: 'Karnataka', sectors: ['Manufacturing', 'Electronics', 'IT & Technology'], approvalsCount: 16, activeApplications: 38, avgProcessingDays: 28, slaCompliance: 88, status: 'Active', contactEmail: 'kspcb@kar.nic.in', helpline: '080-22383101' },
  { id: 'dept-gpcb', name: 'Gujarat Pollution Control Board (GPCB)', ministry: 'Environment & Climate Change', level: 'State', state: 'Gujarat', sectors: ['Chemicals', 'Pharmaceuticals', 'Textiles'], approvalsCount: 20, activeApplications: 52, avgProcessingDays: 30, slaCompliance: 86, status: 'Active', contactEmail: 'gpcb@gujarat.gov.in', helpline: '079-23232162' },
  { id: 'dept-cpcb', name: 'Central Pollution Control Board (CPCB)', ministry: 'Ministry of Environment, Forest and Climate Change', level: 'Central', sectors: ['Manufacturing', 'Chemicals', 'Mining'], approvalsCount: 24, activeApplications: 64, avgProcessingDays: 45, slaCompliance: 79, status: 'Active', contactEmail: 'cpcb@nic.in', helpline: '011-43102030' },
  { id: 'dept-dpiit', name: 'DPIIT — Dept for Promotion of Industry & Internal Trade', ministry: 'Ministry of Commerce & Industry', level: 'Central', sectors: ['Manufacturing', 'Electronics', 'IT & Technology', 'Retail'], approvalsCount: 32, activeApplications: 88, avgProcessingDays: 15, slaCompliance: 94, status: 'Active', contactEmail: 'dipp@nic.in', helpline: '011-23062261' },
  { id: 'dept-moefcc', name: 'Ministry of Environment, Forest and Climate Change', ministry: 'Ministry of Environment, Forest and Climate Change', level: 'Central', sectors: ['All'], approvalsCount: 28, activeApplications: 72, avgProcessingDays: 60, slaCompliance: 72, status: 'Active', contactEmail: 'contactus@moef.nic.in', helpline: '011-24695537' },
  { id: 'dept-mole', name: 'Ministry of Labour and Employment', ministry: 'Government of India', level: 'Central', sectors: ['Manufacturing', 'Construction', 'Textiles'], approvalsCount: 22, activeApplications: 56, avgProcessingDays: 20, slaCompliance: 91, status: 'Active', contactEmail: 'dgms@nic.in', helpline: '1800-11-9191' },
  { id: 'dept-fssai', name: 'Food Safety and Standards Authority of India (FSSAI)', ministry: 'Ministry of Health & Family Welfare', level: 'Central', sectors: ['Food Processing', 'Tourism & Hospitality', 'Retail'], approvalsCount: 14, activeApplications: 46, avgProcessingDays: 22, slaCompliance: 90, status: 'Active', contactEmail: 'foodlicensing@fssai.gov.in', helpline: '1800-11-2100' },
  { id: 'dept-cdsco', name: 'Central Drugs Standard Control Organisation (CDSCO)', ministry: 'Ministry of Health & Family Welfare', level: 'Central', sectors: ['Pharmaceuticals', 'Healthcare'], approvalsCount: 30, activeApplications: 48, avgProcessingDays: 42, slaCompliance: 78, status: 'Active', contactEmail: 'cdsco@nic.in', helpline: '011-23236975' },
  { id: 'dept-mnre', name: 'Ministry of New and Renewable Energy (MNRE)', ministry: 'Government of India', level: 'Central', sectors: ['Renewable Energy'], approvalsCount: 16, activeApplications: 34, avgProcessingDays: 38, slaCompliance: 82, status: 'Active', contactEmail: 'webmaster@mnre.gov.in', helpline: '011-24360707' },
  { id: 'dept-dish-mh', name: 'Directorate of Industrial Safety & Health (DISH) — Maharashtra', ministry: 'Labour Dept, Maharashtra', level: 'State', state: 'Maharashtra', sectors: ['Manufacturing', 'Chemicals', 'Construction'], approvalsCount: 18, activeApplications: 44, avgProcessingDays: 25, slaCompliance: 87, status: 'Active', contactEmail: 'dish.mh@maharashtra.gov.in', helpline: '022-22625251' },
  { id: 'dept-kiadb', name: 'Karnataka Industrial Areas Development Board (KIADB)', ministry: 'Industries Dept, Karnataka', level: 'State', state: 'Karnataka', sectors: ['Manufacturing', 'Electronics', 'IT & Technology'], approvalsCount: 12, activeApplications: 28, avgProcessingDays: 35, slaCompliance: 85, status: 'Active', contactEmail: 'kiadb@kar.nic.in', helpline: '080-22286230' },
  { id: 'dept-tnpcb', name: 'Tamil Nadu Pollution Control Board (TNPCB)', ministry: 'Environment Dept, Tamil Nadu', level: 'State', state: 'Tamil Nadu', sectors: ['Manufacturing', 'Textiles', 'Chemicals'], approvalsCount: 18, activeApplications: 36, avgProcessingDays: 30, slaCompliance: 83, status: 'Active', contactEmail: 'tnpcb@nic.in', helpline: '044-22350657' },
  { id: 'dept-uppcb', name: 'Uttar Pradesh Pollution Control Board (UPPCB)', ministry: 'Environment Dept, Uttar Pradesh', level: 'State', state: 'Uttar Pradesh', sectors: ['Manufacturing', 'Agriculture', 'Food Processing'], approvalsCount: 16, activeApplications: 48, avgProcessingDays: 35, slaCompliance: 76, status: 'Active', contactEmail: 'uppcb@up.gov.in', helpline: '0522-2287939' },
  { id: 'dept-meity', name: 'Ministry of Electronics and Information Technology (MeitY)', ministry: 'Government of India', level: 'Central', sectors: ['IT & Technology', 'Electronics'], approvalsCount: 14, activeApplications: 38, avgProcessingDays: 18, slaCompliance: 93, status: 'Active', contactEmail: 'webmaster@meity.gov.in', helpline: '011-24301851' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const adminApplications: AdminApplication[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN APPROVALS CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const adminApprovalsCatalog: AdminApproval[] = [
  { id: 'appr-001', code: 'SPCB-CTE-01', name: 'Consent to Establish & Operate (CTE/CTO)', type: 'State', level: 'Mandatory', state: 'All States', sector: 'Manufacturing', department: 'State Pollution Control Boards', description: 'Statutory environmental clearance before setting up manufacturing units.', eligibility: ['Manufacturing units with 10+ workers', 'Plants in Red/Orange/Green category'], requiredDocuments: ['Site Layout Plan', 'ETP/STP Design', 'Capital Investment Certificate', 'Land Ownership/Lease'], processingDays: 45, renewalRequired: true, renewalPeriodYears: 5, applicationUrl: '#', status: 'Active', applicationsCount: 482, approvedCount: 364, statutoryFee: '₹15,000 – ₹1,25,000' },
  { id: 'appr-002', code: 'FAC-LIC-02', name: 'Factory License (Factories Act 1948)', type: 'State', level: 'Mandatory', state: 'All States', sector: 'Manufacturing', department: 'Directorate of Industrial Safety & Health', description: 'Statutory manufacturing license for facilities with 10+ workers using power.', eligibility: ['10+ workers with electrical power', '20+ workers without power'], requiredDocuments: ['Building Plan Approval', 'Stability Certificate', 'Power Load Schedule'], processingDays: 30, renewalRequired: true, renewalPeriodYears: 1, applicationUrl: '#', status: 'Active', applicationsCount: 394, approvedCount: 310, statutoryFee: '₹8,500 – ₹65,000' },
  { id: 'appr-003', code: 'FIRE-NOC-03', name: 'Fire NOC (Fire Services)', type: 'State', level: 'Mandatory', state: 'All States', sector: 'Manufacturing', department: 'State Fire & Emergency Services', description: 'Fire safety compliance certificate for commercial and industrial premises.', eligibility: ['Buildings above ground floor', 'Industrial units with flammable material'], requiredDocuments: ['Building Plan', 'Fire Fighting Layout', 'Occupation Certificate'], processingDays: 21, renewalRequired: true, renewalPeriodYears: 1, applicationUrl: '#', status: 'Active', applicationsCount: 512, approvedCount: 478, statutoryFee: '₹5,000 – ₹50,000' },
  { id: 'appr-004', code: 'GST-REG-04', name: 'GST Registration (GSTN Portal)', type: 'Central', level: 'Mandatory', state: 'All India', sector: 'All', department: 'GSTN / CBIC', description: 'Goods and Services Tax registration for businesses with annual turnover > ₹20 lakhs.', eligibility: ['Turnover above ₹20 lakhs (general)', 'Supply of taxable goods/services'], requiredDocuments: ['PAN Card', 'Aadhaar', 'Bank Account Details', 'Business Proof'], processingDays: 7, renewalRequired: false, renewalPeriodYears: 0, applicationUrl: '#', status: 'Active', applicationsCount: 1284, approvedCount: 1248, statutoryFee: 'No Fee' },
  { id: 'appr-005', code: 'FSSAI-CTL-05', name: 'FSSAI Central License (Food Manufacturing)', type: 'Central', level: 'Mandatory', state: 'All India', sector: 'Food Processing', department: 'FSSAI', description: 'Mandatory food safety license for manufacturers with turnover > ₹20 Cr.', eligibility: ['Food manufacturers with >₹20 Cr turnover', 'Importers/exporters of food products'], requiredDocuments: ['Site Plan', 'Equipment List', 'Water Test Report', 'Partnership Deed'], processingDays: 22, renewalRequired: true, renewalPeriodYears: 1, applicationUrl: '#', status: 'Active', applicationsCount: 186, approvedCount: 162, statutoryFee: '₹7,500 – ₹75,000' },
  { id: 'appr-006', code: 'DRUG-MFG-06', name: 'Drug Manufacturing License (Form 25/28)', type: 'State', level: 'Mandatory', state: 'All States', sector: 'Pharmaceuticals', department: 'CDSCO / State FDA', description: 'License for manufacturing allopathic drugs in bulk or finished formulations.', eligibility: ['Pharmaceutical grade facility', 'Qualified production staff'], requiredDocuments: ['Site Master File', 'GMP Certificate', 'Product List', 'Key Personnel Qualifications'], processingDays: 42, renewalRequired: true, renewalPeriodYears: 5, applicationUrl: '#', status: 'Active', applicationsCount: 148, approvedCount: 112, statutoryFee: '₹25,000 – ₹2,50,000' },
  { id: 'appr-007', code: 'OSP-DOT-07', name: 'DoT OSP License (BPO/Call Center)', type: 'Central', level: 'Mandatory', state: 'All India', sector: 'IT & Technology', department: 'Department of Telecommunications', description: 'OSP Registration for IT/BPO companies providing voice-based services.', eligibility: ['IT companies providing outsourced services', 'Call centers with VoIP infrastructure'], requiredDocuments: ['Company Registration', 'Bank Statement', 'Site Plan', 'Equipment List'], processingDays: 18, renewalRequired: false, renewalPeriodYears: 0, applicationUrl: '#', status: 'Active', applicationsCount: 224, approvedCount: 208, statutoryFee: 'No Fee' },
  { id: 'appr-008', code: 'SOLAR-CERC-08', name: 'Grid Connectivity & Power Evacuation Approval', type: 'Central', level: 'Mandatory', state: 'All States', sector: 'Renewable Energy', department: 'CEA / State Electricity Boards', description: 'Mandatory approval for connecting solar/wind power plants to the national/state grid.', eligibility: ['Renewable energy projects above 1 MW', 'Grid-connected power producers'], requiredDocuments: ['Project DPR', 'Land Documents', 'Technical Feasibility Report'], processingDays: 60, renewalRequired: false, renewalPeriodYears: 0, applicationUrl: '#', status: 'Active', applicationsCount: 112, approvedCount: 86, statutoryFee: '₹50,000 – ₹5,00,000' },
  { id: 'appr-009', code: 'PESO-EXP-09', name: 'PESO Explosives Storage License', type: 'Central', level: 'Mandatory', state: 'All India', sector: 'Mining', department: 'Petroleum and Explosives Safety Organisation', description: 'License for storing and using explosives in mining operations.', eligibility: ['Mining companies requiring blasting operations', 'Explosives dealers and manufacturers'], requiredDocuments: ['Storage Site Plan', 'Safety Distance Certificate', 'License Holder Qualifications'], processingDays: 45, renewalRequired: true, renewalPeriodYears: 3, applicationUrl: '#', status: 'Active', applicationsCount: 68, approvedCount: 52, statutoryFee: '₹3,000 – ₹30,000' },
  { id: 'appr-010', code: 'NABH-HC-10', name: 'NABH Hospital Accreditation', type: 'Central', level: 'Optional', state: 'All India', sector: 'Healthcare', department: 'National Accreditation Board for Hospitals', description: 'Voluntary quality accreditation for hospitals demonstrating international patient safety standards.', eligibility: ['Hospitals with minimum 50 beds', 'Medical institutions meeting NABH standards'], requiredDocuments: ['Facility Profile', 'Quality Manual', 'Clinical Protocols', 'Staff Credentials'], processingDays: 120, renewalRequired: true, renewalPeriodYears: 3, applicationUrl: '#', status: 'Active', applicationsCount: 84, approvedCount: 62, statutoryFee: '₹75,000 – ₹5,00,000' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SLA RECORDS (Dynamic from live applications)
// ─────────────────────────────────────────────────────────────────────────────

export const adminSLARecords: AdminSLARecord[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// QUERY & GRIEVANCE RECORDS (Dynamic from live user queries)
// ─────────────────────────────────────────────────────────────────────────────

export const adminQueries: AdminQuery[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SCHEMES
// ─────────────────────────────────────────────────────────────────────────────

export const adminSchemes: AdminScheme[] = [
  { id: 'sch-001', name: 'Production Linked Incentive (PLI) — Electronics', ministry: 'Ministry of Electronics & IT', level: 'Central', sectors: ['Electronics & Semiconductors', 'IT & Technology'], eligibility: ['Minimum investment ₹100 Cr (large)', 'Incremental sales over base year'], benefits: 'Incentive of 4–6% on incremental sales above base year threshold for 5 years', maxSupport: '₹4,615 Cr total scheme outlay', applicationUrl: '#', startDate: '01 Apr 2021', endDate: '31 Mar 2027', status: 'Active', applicantsCount: 38, budgetAllocated: '₹4,615 Cr' },
  { id: 'sch-002', name: 'PLI Scheme for Pharmaceutical Sector', ministry: 'Ministry of Chemicals & Fertilizers', level: 'Central', sectors: ['Pharmaceuticals'], eligibility: ['Manufacturers of KSMs, APIs, formulations', 'Minimum committed investment'], benefits: 'Incentive of 10% on incremental sales for domestic pharma manufacturers', maxSupport: '₹15,000 Cr total outlay', applicationUrl: '#', startDate: '01 Jul 2020', endDate: '31 Mar 2029', status: 'Active', applicantsCount: 52, budgetAllocated: '₹15,000 Cr' },
  { id: 'sch-003', name: 'PM KUSUM — Solar Pump Scheme', ministry: 'Ministry of New and Renewable Energy', level: 'Central', sectors: ['Renewable Energy', 'Agriculture & Food'], eligibility: ['Farmers with agricultural landholding', 'State DISCOMs / SNA nominated beneficiaries'], benefits: 'Solar pump installation with 60% Government subsidy; 30% soft loan + 10% farmer contribution', maxSupport: 'Per pump subsidy up to ₹1,40,000', applicationUrl: '#', startDate: '01 Feb 2019', status: 'Active', applicantsCount: 284, budgetAllocated: '₹34,422 Cr' },
  { id: 'sch-004', name: 'Startup India Seed Fund Scheme (SISFS)', ministry: 'DPIIT, Ministry of Commerce & Industry', level: 'Central', sectors: ['IT & Technology', 'Healthcare', 'Pharmaceuticals', 'Electronics & Semiconductors'], eligibility: ['DPIIT recognized startups', 'Startup <2 years old', 'Not received >₹10 lakh funding'], benefits: 'Seed funding up to ₹20 lakhs for validation, ₹50 lakhs for prototype development', maxSupport: '₹50 Lakhs per startup', applicationUrl: '#', startDate: '01 Apr 2021', status: 'Active', applicantsCount: 562, budgetAllocated: '₹945 Cr' },
  { id: 'sch-005', name: 'Maharashtra Industrial Policy 2023 Capital Subsidy', ministry: 'Industries Dept, Government of Maharashtra', level: 'State', state: 'Maharashtra', sectors: ['Manufacturing', 'Electronics & Semiconductors', 'Pharmaceuticals'], eligibility: ['New or expansion units in Maharashtra', 'Minimum fixed capital investment ₹5 Cr'], benefits: 'Capital subsidy of 25–40% on fixed assets (up to ₹30 Cr) + stamp duty exemption', maxSupport: '₹30 Cr capital subsidy', applicationUrl: '#', startDate: '01 Jan 2023', status: 'Active', applicantsCount: 142, budgetAllocated: '₹4,200 Cr' },
  { id: 'sch-006', name: 'Karnataka Aerospace & Defence Policy 2022', ministry: 'Industries Dept, Government of Karnataka', level: 'State', state: 'Karnataka', sectors: ['Manufacturing', 'Electronics & Semiconductors', 'IT & Technology'], eligibility: ['Aerospace manufacturers', 'Defence electronics companies', 'Minimum investment ₹50 Cr'], benefits: '50% power tariff subsidy; 100% stamp duty exemption; 20% capital subsidy on plant & machinery', maxSupport: '₹50 Cr maximum support', applicationUrl: '#', startDate: '01 Apr 2022', status: 'Active', applicantsCount: 28, budgetAllocated: '₹1,500 Cr' },
  { id: 'sch-007', name: 'Gujarat Renewable Energy Policy 2023', ministry: 'Energy & Petrochemicals Dept, Govt of Gujarat', level: 'State', state: 'Gujarat', sectors: ['Renewable Energy'], eligibility: ['Solar and wind energy developers', 'Green hydrogen producers', 'Minimum project size 5 MW'], benefits: 'Land at concessional rates in REZs; power banking facility; net metering + wheeling charge waiver', maxSupport: 'Project-based benefits', applicationUrl: '#', startDate: '01 Jun 2023', status: 'Active', applicantsCount: 64, budgetAllocated: '₹8,000 Cr' },
  { id: 'sch-008', name: 'MSME Credit Guarantee Scheme (CGTMSE)', ministry: 'Ministry of MSME', level: 'Central', sectors: ['Manufacturing', 'Food Processing', 'Textiles', 'Retail & E-commerce'], eligibility: ['MSMEs with turnover below ₹250 Cr', 'No collateral security required'], benefits: 'Collateral-free credit guarantee up to ₹5 Cr; 75–85% guarantee cover', maxSupport: '₹5 Cr credit', applicationUrl: '#', startDate: '01 Jan 2000', status: 'Active', applicantsCount: 1842, budgetAllocated: '₹7,500 Cr corpus' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN RENEWALS (Dynamic from live approved applications)
// ─────────────────────────────────────────────────────────────────────────────

export const adminRenewals: AdminRenewal[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const adminNotifications: AdminNotification[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

export const adminAuditLogs: AdminAuditLog[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// APPROVAL RULES
// ─────────────────────────────────────────────────────────────────────────────

export const adminApprovalRules: ApprovalRule[] = [
  {
    id: 'rule-001',
    name: 'Electronics Manufacturing — Karnataka Rule',
    description: 'Recommends full set of clearances for electronics/semiconductor manufacturing in Karnataka',
    conditions: [
      { field: 'Sector', operator: 'equals', value: 'Electronics & Semiconductors' },
      { field: 'State', operator: 'equals', value: 'Karnataka' },
    ],
    thenRecommend: ['KSPCB CTE/CTO', 'Factory License (DISH KA)', 'Fire NOC (KSFES)', 'BESCOM Power Sanction', 'KIADB Land Allotment', 'GST Registration'],
    dependencies: [
      { from: 'KIADB Land Allotment', to: 'Factory License (DISH KA)', type: 'Sequential' },
      { from: 'Factory License (DISH KA)', to: 'KSPCB CTE/CTO', type: 'Sequential' },
      { from: 'Fire NOC (KSFES)', to: 'BESCOM Power Sanction', type: 'Parallel' },
    ],
    complexity: 'High',
    status: 'Active',
    createdAt: '01 Jan 2026',
    lastTriggered: '11 Sep 2026',
    triggerCount: 84,
  },
  {
    id: 'rule-002',
    name: 'Pharmaceutical Manufacturing — All States',
    description: 'Recommends drug manufacturing clearances for pharma units across India',
    conditions: [
      { field: 'Sector', operator: 'equals', value: 'Pharmaceuticals' },
    ],
    thenRecommend: ['Drug Manufacturing License (CDSCO)', 'CTE/CTO (State SPCB)', 'Factory License (DISH)', 'GST Registration', 'FSSAI Registration (if food-grade products)'],
    dependencies: [
      { from: 'Drug Manufacturing License (CDSCO)', to: 'CTE/CTO (State SPCB)', type: 'Parallel' },
      { from: 'CTE/CTO (State SPCB)', to: 'Factory License (DISH)', type: 'Sequential' },
    ],
    complexity: 'High',
    status: 'Active',
    createdAt: '01 Jan 2026',
    lastTriggered: '10 Sep 2026',
    triggerCount: 112,
  },
  {
    id: 'rule-003',
    name: 'Renewable Energy — Solar/Wind Projects',
    description: 'Clearances for large-scale renewable energy projects above 1 MW',
    conditions: [
      { field: 'Sector', operator: 'equals', value: 'Renewable Energy' },
      { field: 'Investment Size', operator: 'greater_than', value: '50 Cr' },
    ],
    thenRecommend: ['Environmental Clearance (EIA)', 'Grid Connectivity Approval (CEA)', 'Land Conversion Certificate', 'MNRE Registration'],
    dependencies: [
      { from: 'Environmental Clearance (EIA)', to: 'Grid Connectivity Approval (CEA)', type: 'Sequential' },
      { from: 'Land Conversion Certificate', to: 'Environmental Clearance (EIA)', type: 'Sequential' },
    ],
    complexity: 'High',
    status: 'Active',
    createdAt: '15 Feb 2026',
    lastTriggered: '09 Sep 2026',
    triggerCount: 68,
  },
  {
    id: 'rule-004',
    name: 'IT/BPO — Low Complexity Setup',
    description: 'Minimal clearance set for IT offices and BPO operations',
    conditions: [
      { field: 'Sector', operator: 'equals', value: 'IT & Technology' },
      { field: 'Investment Size', operator: 'less_than', value: '10 Cr' },
    ],
    thenRecommend: ['Shop & Establishment Registration', 'DoT OSP License', 'GST Registration', 'Professional Tax Registration'],
    dependencies: [],
    complexity: 'Low',
    status: 'Active',
    createdAt: '01 Mar 2026',
    lastTriggered: '12 Sep 2026',
    triggerCount: 224,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const adminDocumentTypes: AdminDocumentType[] = [
  { id: 'doc-type-001', name: 'PAN Card (Company / LLP / Proprietor)', category: 'Identity & Registration', required: 'Required', approvalMappings: ['GST Registration', 'Factory License', 'Drug Manufacturing License'], sectorMappings: ['All'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF', 'JPG', 'PNG'], maxSizeMB: 2, status: 'Active', submissionsCount: 1284 },
  { id: 'doc-type-002', name: 'GST Registration Certificate', category: 'Tax & Financial', required: 'Required', approvalMappings: ['Factory License', 'FSSAI License', 'Drug Manufacturing License'], sectorMappings: ['Manufacturing', 'Food Processing', 'Pharmaceuticals'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF'], maxSizeMB: 5, status: 'Active', submissionsCount: 1108 },
  { id: 'doc-type-003', name: 'Site Layout Plan', category: 'Technical Plans', required: 'Required', approvalMappings: ['CTE/CTO', 'Factory License', 'Fire NOC', 'FSSAI License'], sectorMappings: ['Manufacturing', 'Food Processing', 'Pharmaceuticals', 'Chemicals'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF', 'DWG', 'AutoCAD'], maxSizeMB: 20, status: 'Active', submissionsCount: 782 },
  { id: 'doc-type-004', name: 'Environmental Impact Assessment (EIA) Report', category: 'Environmental', required: 'Required', approvalMappings: ['Environmental Clearance', 'CTE/CTO'], sectorMappings: ['Mining', 'Chemicals', 'Renewable Energy', 'Manufacturing'], stateMappings: ['All'], validityPeriodMonths: 60, acceptedFormats: ['PDF'], maxSizeMB: 50, status: 'Active', submissionsCount: 284 },
  { id: 'doc-type-005', name: 'ETP/STP Design & Drawing', category: 'Environmental', required: 'Required', approvalMappings: ['CTE/CTO'], sectorMappings: ['Manufacturing', 'Pharmaceuticals', 'Chemicals', 'Textiles'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF', 'DWG'], maxSizeMB: 25, status: 'Active', submissionsCount: 482 },
  { id: 'doc-type-006', name: 'Chartered Accountant (CA) Investment Certificate', category: 'Financial', required: 'Required', approvalMappings: ['CTE/CTO', 'Factory License'], sectorMappings: ['Manufacturing', 'Chemicals', 'Pharmaceuticals'], stateMappings: ['All'], validityPeriodMonths: 6, acceptedFormats: ['PDF'], maxSizeMB: 5, status: 'Active', submissionsCount: 412 },
  { id: 'doc-type-007', name: 'GMP Certificate (Pharma)', category: 'Compliance & Certifications', required: 'Required', approvalMappings: ['Drug Manufacturing License'], sectorMappings: ['Pharmaceuticals'], stateMappings: ['All'], validityPeriodMonths: 12, acceptedFormats: ['PDF'], maxSizeMB: 10, status: 'Active', submissionsCount: 148 },
  { id: 'doc-type-008', name: 'Fire Fighting System Layout', category: 'Technical Plans', required: 'Required', approvalMappings: ['Fire NOC'], sectorMappings: ['All'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF', 'DWG'], maxSizeMB: 15, status: 'Active', submissionsCount: 512 },
  { id: 'doc-type-009', name: 'Land Ownership / Lease Agreement', category: 'Land & Property', required: 'Required', approvalMappings: ['CTE/CTO', 'Factory License', 'KIADB Allotment'], sectorMappings: ['Manufacturing', 'Mining', 'Renewable Energy'], stateMappings: ['All'], validityPeriodMonths: 0, acceptedFormats: ['PDF'], maxSizeMB: 10, status: 'Active', submissionsCount: 684 },
  { id: 'doc-type-010', name: 'Workforce Safety Plan', category: 'Labour & Safety', required: 'Conditional', approvalMappings: ['Factory License'], sectorMappings: ['Manufacturing', 'Mining', 'Chemicals'], stateMappings: ['All'], validityPeriodMonths: 12, acceptedFormats: ['PDF'], maxSizeMB: 10, status: 'Active', submissionsCount: 394 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS DATA (Populated dynamically from live applications)
// ─────────────────────────────────────────────────────────────────────────────

export const analyticsStateData: { state: string; applications: number; approved: number; pending: number; rejected: number; avgDays: number }[] = [];

export const analyticsSectorData: { sector: string; count: number; pct: number }[] = [];

export const analyticsMonthlyTrend: { month: string; submitted: number; approved: number; rejected: number }[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// KPI SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

export const adminKPISummary = {
  totalUsers: 0,
  activeApplications: 0,
  pendingApplications: 0,
  approvedApplications: 0,
  rejectedApplications: 0,
  openQueries: 0,
  overdueApplications: 0,
  upcomingRenewals: 0,
  avgProcessingDays: 0,
  slaComplianceRate: 100,
  totalApprovals: 0,
  activeApprovals: 0,
  totalDepartments: 0,
  totalSchemes: 0,
};
