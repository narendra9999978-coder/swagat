export type CentralOrState = 'Central' | 'State';

export type ApprovalCategory = 
  | 'Business Registration'
  | 'Factory & Labour'
  | 'Pollution & Environment'
  | 'Fire Safety'
  | 'Land & Infrastructure'
  | 'Electricity & Utilities'
  | 'Construction & Building'
  | 'Trade & Export'
  | 'Health & Food Safety'
  | 'Mining & Explosives'
  | 'Telecom & IT'
  | 'Renewable Energy'
  | 'Local Permissions';

export type BusinessStage = 'Pre-Establishment' | 'Pre-Operation' | 'Post-Operation' | 'Periodic Renewal';

export interface Approval {
  id: string;
  code: string;
  name: string;
  approvalName?: string;
  department: string;
  ministry: string;
  centralOrState: CentralOrState;
  state?: string;
  stateName?: string;
  statesApplicable?: string[];
  category: ApprovalCategory;
  description: string;
  longDescription?: string;
  requiredDocuments: string[];
  documents?: string[];
  eligibility: string[];
  processingDays: number;
  statutoryFee: string;
  validityYears: string;
  stage: BusinessStage;
  type?: string;
  mandatory: boolean;
  onlineFormAvailable: boolean;
  sectorApplicability: string[];
  sector?: string;
  iconName: string;
  tags: string[];
  applicationUrl?: string;
  status?: string;
}

export interface Scheme {
  id: string;
  name: string;
  department: string;
  ministry: string;
  level: 'Central' | 'State';
  stateName?: string;
  sector: string;
  businessType: ('Startup' | 'MSME' | 'Manufacturing' | 'Investment' | 'Renewable Energy' | 'Export' | 'Technology' | 'Women-Led')[];
  eligibility: string[];
  benefits: string;
  maxFinancialSupport: string;
  applicationProcess: string;
  deadline?: string;
  active: boolean;
  documents: string[];
  iconName: string;
  tags: string[];
}

export interface StateApprovalCategory {
  name: string;
  count: number;
  description: string;
}

export interface StateData {
  code: string;
  name: string;
  nodalAgency: string;
  portalName: string;
  easeOfDoingBusinessRank: number;
  clearanceDaysAvg: number;
  topIndustries: string[];
  description: string;
  categories: StateApprovalCategory[];
  totalApprovals: number;
  integrationStatus: 'Fully Integrated' | 'API Connected' | 'Fast-Track';
  helpline: string;
}

export type ApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Query Raised'
  | 'Response Submitted'
  | 'Approved'
  | 'Rejected';

export interface TimelineStep {
  title: string;
  date?: string;
  description: string;
  completed: boolean;
  current: boolean;
  queryRaised?: boolean;
}

export interface ApplicationQuery {
  id: string;
  queryText: string;
  dateRaised: string;
  raisedByOfficer: string;
  department: string;
  status: 'Open' | 'Responded' | 'Resolved';
  responseText?: string;
  responseDate?: string;
  attachedDocs?: string[];
}

export interface Application {
  id: string;
  trackingNumber: string;
  approvalId: string;
  approvalName: string;
  department: string;
  ministry: string;
  centralOrState: CentralOrState;
  stateName?: string;
  submissionDate: string;
  lastUpdated: string;
  currentStatus: ApplicationStatus;
  nextAction: string;
  timeline: TimelineStep[];
  applicantName: string;
  companyName: string;
  panNumber: string;
  gstNumber: string;
  cinNumber?: string;
  projectTitle: string;
  projectState: string;
  projectDistrict: string;
  investmentAmount: string;
  estimatedCompletionDays: number;
  statutoryFeePaid: string;
  documentsAttached: { name: string; category: string; verified: boolean; url?: string }[];
  queries: ApplicationQuery[];
  remarks?: string;
  certificateUrl?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'PAN' | 'GST' | 'CIN' | 'Aadhaar / Identity' | 'Company Registration' | 'Address Proof' | 'Land Documents' | 'Environmental Documents' | 'Licenses' | 'Other';
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  daysToExpiry?: number;
  fileSize: string;
  fileType: string;
  verified: boolean;
  verificationAgency: string;
  uploadedAt: string;
}

export interface RenewalItem {
  id: string;
  approvalId: string;
  approvalName: string;
  licenseNumber: string;
  department: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'Active' | 'Expiring Soon' | 'Critical / Expired';
  renewalFee: string;
  statutoryDaysAllowed: number;
}

// ── New role type (includes super_admin) ────────────────────────────────────

export type UserRole = 'investor' | 'officer' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  gstNumber: string;
  companyName: string;
  cin: string;
  entityType: 'Private Limited' | 'LLP' | 'Public Limited' | 'Partnership' | 'Proprietorship';
  state: string;
  address: string;
  isDigiLockerVerified: boolean;
  role: UserRole;
  avatarInitials: string;
  avatarUrl?: string;
  departmentName?: string; // for officers
}

export interface KYAState {
  planningType: string;
  sector: string;
  state: string;
  investmentSize: string;
  employeeCount: string;
  landRequirement: string;
  fdiInvolved: string;
  powerRequirement: string;
  hazardousSubstances: string;
  exportOriented: string;
  completed: boolean;
  recommendedApprovalIds: string[];
}

// ── New types for backend API integration ───────────────────────────────────

export interface BusinessType {
  id: string;
  name: string;
  code?: string;
  icon?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface TreeNode {
  id: string;
  label: string;
  node_type: 'question' | 'option';
  is_leaf: boolean;
  sort_order: number;
  step?: string;
  children?: TreeNode[];
}

export interface ChecklistDocument {
  id: string;
  application_id: string;
  document_type_name: string;
  department_name: string;
  is_mandatory: boolean;
  file_url?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired' | 'waiting_on_dependency';
  reused_from_vault: boolean;
  depends_on?: string;
}

export interface BundleStatus {
  id: string;
  department_id: string;
  department_name: string;
  status: 'pending' | 'in_review' | 'approved' | 'deemed_approved' | 'breached';
  dispatched_at?: string;
  sla_deadline?: string;
  sla_hours: number;
  reassigned_count: number;
  documents: ChecklistDocument[];
}

export interface ApplicationStatusResponse {
  application: {
    id: string;
    status: 'in_progress' | 'submitted' | 'dispatched' | 'completed';
    business_type_name?: string;
    created_at: string;
    submitted_at?: string;
  };
  bundles: BundleStatus[];
}

// ── Department Admin Queue ──────────────────────────────────────────────────

export interface AdminQueueDocument {
  id: string;
  document_type_name: string;
  is_mandatory: boolean;
  file_url?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired';
  applicant_name?: string;
  company_name?: string;
  uploaded_at?: string;
}

export interface AdminQueueBundle {
  id: string;
  application_id: string;
  applicant_name: string;
  company_name: string;
  business_type: string;
  submitted_at: string;
  sla_deadline?: string;
  sla_hours: number;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'breached';
  documents: AdminQueueDocument[];
}

// ── Wizard session state ────────────────────────────────────────────────────

export type WizardStep = 'business_registration' | 'business_activity' | 'foreign_investment' | 'project_land';

export interface WizardStepState {
  currentNodeId: string | null;
  selectedPath: TreeNode[];
  leafReached: boolean;
  leafNodeId: string | null;
}

export interface WizardSession {
  businessType: BusinessType;
  applicationId: string | null;
  steps: Record<WizardStep, WizardStepState>;
  activeStep: WizardStep;
  allStepsComplete: boolean;
}
