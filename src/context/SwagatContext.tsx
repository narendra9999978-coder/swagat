import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Approval, 
  Scheme, 
  Application, 
  DocumentItem, 
  RenewalItem, 
  UserProfile, 
  KYAState,
  ApplicationQuery,
  StateData,
  UserRole,
  BusinessType,
  WizardSession,
  AppNotification,
  ApplicationDocumentItem,
  ApplicationApprovalItem,
} from '../types/swagat';
import { approvalsData } from '../data/approvalsData';
import { schemesData } from '../data/schemesData';
import { getStateDataByCode, allIndianStatesList } from '../data/indiaStatesData';
import { 
  authApi, 
  checkBackendHealth 
} from '../services/api';
import {
  loadUserApplications,
  addApplication,
  updateApplication,
  respondToQueryInStore,
  reuploadDocumentInStore,
  loadNotifications,
  markNotificationRead,
} from '../lib/applicationStore';
import {
  mockLogin,
  mockRegister,
  getStoredSession,
  clearSession,
  MockRole,
  seedDefaultUsers,
} from '../lib/mockAuth';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// ── View type ─────────────────────────────────────────────────────────────────

type AppView = 
  | 'home'
  | 'dashboard'
  | 'admin-dashboard'
  | 'wizard'
  | 'approvals'
  | 'schemes'
  | 'kya'
  | 'state-approvals'
  | 'tracking'
  | 'about'
  | 'help';

// ── Context type ──────────────────────────────────────────────────────────────

interface SwagatContextType {
  // Auth & Profile
  userProfile: UserProfile | null;
  login: (
    mode: 'signin' | 'signup',
    role: 'USER' | 'ADMIN',
    data: { email: string; password: string; name?: string; mobile?: string }
  ) => Promise<void>;
  logout: () => void;
  isBackendOnline: boolean;

  // Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin-user' | 'signup-user' | 'signin-admin' | 'signin-super';
  setAuthModalMode: (mode: 'signin-user' | 'signup-user' | 'signin-admin' | 'signin-super') => void;

  // View & Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  dashboardActiveTab: string;
  setDashboardActiveTab: (tab: string) => void;

  // Approvals & Schemes Data
  approvals: Approval[];
  schemes: Scheme[];
  selectedApproval: Approval | null;
  setSelectedApproval: (approval: Approval | null) => void;
  selectedScheme: Scheme | null;
  setSelectedScheme: (scheme: Scheme | null) => void;

  // KYA State & Session Continuity
  kyaState: KYAState;
  setKyaState: React.Dispatch<React.SetStateAction<KYAState>>;
  updateKyaState: (partial: Partial<KYAState>) => void;
  resetKya: () => void;

  // Application Journey & Apply Wizard
  pendingApprovalToApply: Approval | null;
  setPendingApprovalToApply: (approval: Approval | null) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  startApplication: (approval: Approval) => void;
  submitNewApplication: (applicationData: Partial<Application>) => Application;

  // Applications Tracking & Queries
  applications: Application[];
  selectedApplication: Application | null;
  setSelectedApplication: (app: Application | null) => void;
  selectedQueryApp: { application: Application; query: ApplicationQuery } | null;
  setSelectedQueryApp: (item: { application: Application; query: ApplicationQuery } | null) => void;
  respondToQuery: (applicationId: string, queryId: string, responseText: string, attachedDocs?: string[]) => void;
  reuploadDocument: (applicationId: string, documentName: string, fileName: string) => void;
  refreshApplications: () => void;

  // Real-time notifications
  userNotifications: AppNotification[];
  markNotifAsRead: (id: string) => void;

  // Documents Locker
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  previewDocument: DocumentItem | null;
  setPreviewDocument: (doc: DocumentItem | null) => void;

  // Renewals
  renewals: RenewalItem[];
  triggerRenewal: (renewalId: string) => void;

  // Global Search Modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // State Detail Modal
  selectedStateForModal: StateData | null;
  openStateDetailModal: (stateCodeOrName: string) => void;
  closeStateDetailModal: () => void;

  // Global Sector & State Quick Filters
  selectedSectorFilter: string;
  setSelectedSectorFilter: (sec: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (st: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Sector Wizard
  wizardSession: WizardSession | null;
  setWizardSession: React.Dispatch<React.SetStateAction<WizardSession | null>>;
  openWizard: (businessType: BusinessType) => void;
  closeWizard: () => void;
}

// ── Default mock data ─────────────────────────────────────────────────────────

const initialKyaState: KYAState = {
  planningType: 'Start a new business',
  sector: '',
  state: '',
  investmentSize: 'Medium (₹10 Cr to ₹50 Cr)',
  employeeCount: '50 to 250 Employees',
  landRequirement: 'Required in Industrial Estate / Park',
  fdiInvolved: 'No (Domestic Capital)',
  powerRequirement: 'High Tension (HT > 150 kVA)',
  hazardousSubstances: 'Yes (Standard Industrial Solvents)',
  exportOriented: 'Yes (Direct Export Planned)',
  completed: false,
  recommendedApprovalIds: [
    'app-mca-incorporation','app-midc-land','app-cpcb-cto',
    'app-factory-license','app-fire-noc','app-power-load',
    'app-dgft-iec','app-boilers-registration','app-udyam-msme',
    'app-cgwa-groundwater','app-epr-plastic'
  ]
};

// Applications are loaded per-user from the shared applicationStore on login/session restore.
// The empty array below is the pre-login default.
const initialApplications: Application[] = [
  {
    id: 'app-mh-78942',
    trackingNumber: 'SWG-2026-MH-78942',
    approvalId: 'app-cpcb-cto',
    approvalName: 'Consent to Establish (CTE) - Orange Category',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    ministry: 'Environment & Climate Change Dept, Govt of Maharashtra',
    centralOrState: 'State',
    stateName: 'Maharashtra',
    submissionDate: '24 Aug 2026',
    lastUpdated: '02 Sep 2026',
    currentStatus: 'Under Review',
    nextAction: 'Field Scrutiny by Sub-Regional Officer scheduled on 08 Sep 2026',
    estimatedCompletionDays: 45,
    statutoryFeePaid: '₹45,000',
    applicantName: 'Rajesh Sharma',
    companyName: 'Apex Precision Engineering Pvt Ltd',
    panNumber: 'AABCA9082F',
    gstNumber: '27AABCA9082F1ZG',
    cinNumber: 'U29253MH2021PTC368940',
    projectTitle: 'Automotive Component Die-Casting Unit Expansion',
    projectState: 'Maharashtra',
    projectDistrict: 'Pune (Chakan)',
    investmentAmount: '₹24.50 Crores',
    timeline: [
      { title: 'Application Drafted', date: '22 Aug 2026', description: 'Form submitted with preliminary project blueprints', completed: true, current: false },
      { title: 'Payment & Submission', date: '24 Aug 2026', description: 'Statutory fee ₹45,000 paid via Bharatkosh / GRAS gateway', completed: true, current: false },
      { title: 'Document Scrutiny', date: '28 Aug 2026', description: 'Desk verification completed by MPCB Regional Office', completed: true, current: false },
      { title: 'Site Inspection / Review', date: '02 Sep 2026', description: 'Inspection officer assigned; field visit scheduled', completed: false, current: true },
      { title: 'Consent Committee Decision', description: 'Final order issuance and digital signed CTE certificate', completed: false, current: false }
    ],
    documentsAttached: [
      { name: 'Manufacturing Process Layout.pdf', category: 'Environmental Documents', verified: true },
      { name: 'ETP Scheme Blueprint.pdf', category: 'Environmental Documents', verified: true },
      { name: 'MIDC Land Possession Order.pdf', category: 'Land Documents', verified: true }
    ],
    queries: []
  }
];

const initialDocuments: DocumentItem[] = [
  { id: 'doc-pan-01', name: 'Company PAN Card (Apex Precision)', category: 'PAN', documentNumber: 'AABCA9082F', issueDate: '12 Jan 2021', fileSize: '1.2 MB', fileType: 'PDF', verified: true, verificationAgency: 'Income Tax Dept (e-KYC Verified)', uploadedAt: '15 Aug 2026' },
  { id: 'doc-gst-02', name: 'GST Registration Certificate (Form GST REG-06)', category: 'GST', documentNumber: '27AABCA9082F1ZG', issueDate: '24 Feb 2021', fileSize: '2.4 MB', fileType: 'PDF', verified: true, verificationAgency: 'GSTN Verified', uploadedAt: '15 Aug 2026' },
  { id: 'doc-cin-03', name: 'MCA Certificate of Incorporation & Articles (SPICe+)', category: 'CIN', documentNumber: 'U29253MH2021PTC368940', issueDate: '05 Jan 2021', fileSize: '4.8 MB', fileType: 'PDF', verified: true, verificationAgency: 'Ministry of Corporate Affairs', uploadedAt: '15 Aug 2026' },
];

const initialRenewals: RenewalItem[] = [
  { id: 'ren-01', approvalId: 'app-fire-noc', approvalName: 'Annual Fire Safety NOC & Hydrant Certificate', licenseNumber: 'FIRE/MH/CHK/2025/1102', department: 'Directorate of Maharashtra Fire Services', expiryDate: '09 Oct 2026', daysRemaining: 34, status: 'Expiring Soon', renewalFee: '₹14,500', statutoryDaysAllowed: 60 },
];

// ── Context ───────────────────────────────────────────────────────────────────

const SwagatContext = createContext<SwagatContextType | undefined>(undefined);

export const SwagatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<SwagatContextType['authModalMode']>('signin-user');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [dashboardActiveTab, setDashboardActiveTab] = useState('overview');

  const [approvals] = useState<Approval[]>(approvalsData);
  const [schemes] = useState<Scheme[]>(schemesData);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const [kyaState, setKyaState] = useState<KYAState>(initialKyaState);
  const [pendingApprovalToApply, setPendingApprovalToApply] = useState<Approval | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedQueryApp, setSelectedQueryApp] = useState<{ application: Application; query: ApplicationQuery } | null>(null);

  // Real-time notifications
  const [userNotifications, setUserNotifications] = useState<AppNotification[]>([]);

  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  const [renewals, setRenewals] = useState<RenewalItem[]>(initialRenewals);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [selectedStateForModal, setSelectedStateForModal] = useState<StateData | null>(null);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');

  const [wizardSession, setWizardSession] = useState<WizardSession | null>(null);

  // Logo click counter for super admin access
  const [logoClickCount, setLogoClickCount] = useState(0);

  // ── Boot: health check + session restore ──────────────────────────────────

  useEffect(() => {
    seedDefaultUsers();

    checkBackendHealth().then(online => {
      setIsBackendOnline(online);
      if (online) console.info('[SWAGAT] Connected to live Go backend.');
    }).catch(() => setIsBackendOnline(false));

    // Restore session from mock JWT store
    const session = getStoredSession();
    if (session) {
      const { user } = session;
      const frontendRole: UserRole = user.role === 'ADMIN' ? 'ADMIN' : 'USER';

      setUserProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.mobile || '',
        pan: '',
        gstNumber: '',
        companyName: user.departmentName || (frontendRole === 'ADMIN' ? 'SWAGAT System Administration' : `${user.name}'s Enterprise`),
        cin: '',
        entityType: 'Private Limited',
        state: 'India',
        address: '',
        isDigiLockerVerified: false,
        role: frontendRole,
        avatarInitials: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        departmentName: user.departmentName,
        status: user.status || 'Active',
        accountType: user.accountType || (frontendRole === 'ADMIN' ? 'System Administrator' : 'Business User'),
      });

      // Load this user's applications & notifications from shared store
      if (frontendRole === 'USER') {
        setApplications(loadUserApplications(user.id));
        setUserNotifications(loadNotifications('USER', user.id));
      } else {
        setUserNotifications(loadNotifications('ADMIN'));
      }

      // Synchronize view with restored session role if on dashboard path
      if (frontendRole === 'ADMIN') {
        setCurrentView('admin-dashboard');
      }
    }

    // Real-time synchronization listeners across tabs & within page
    const syncStore = () => {
      const stored = getStoredSession();
      if (stored?.user) {
        if (stored.user.role !== 'ADMIN') {
          setApplications(loadUserApplications(stored.user.id));
          setUserNotifications(loadNotifications('USER', stored.user.id));
        } else {
          setUserNotifications(loadNotifications('ADMIN'));
        }
      }
    };

    window.addEventListener('swagat_applications_updated', syncStore);
    window.addEventListener('swagat_notifications_updated', syncStore);
    window.addEventListener('storage', syncStore);

    return () => {
      window.removeEventListener('swagat_applications_updated', syncStore);
      window.removeEventListener('swagat_notifications_updated', syncStore);
      window.removeEventListener('storage', syncStore);
    };
  }, []);

  // ── Supabase Google OAuth callback handler ────────────────────────────────
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supaSession) => {
        if (supaSession?.user) {
          const su = supaSession.user;
          const gName = su.user_metadata?.full_name || su.user_metadata?.name || su.email?.split('@')[0] || 'User';
          const gEmail = su.email || '';
          const oauthRole: UserRole = (localStorage.getItem('swagat_oauth_role') || 'USER') as UserRole;
          const initials = gName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          setUserProfile({
            id: su.id,
            name: gName,
            email: gEmail,
            phone: su.phone || '',
            pan: '',
            gstNumber: '',
            companyName: `${gName}'s Enterprise`,
            cin: '',
            entityType: 'Private Limited',
            state: 'India',
            address: '',
            isDigiLockerVerified: false,
            role: oauthRole,
            avatarInitials: initials,
          });
          setIsAuthModalOpen(false);
          setCurrentView(oauthRole === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // ── Toast helper ──────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = async (
    mode: 'signin' | 'signup',
    role: 'USER' | 'ADMIN',
    data: { email: string; password: string; name?: string; mobile?: string }
  ) => {
    const targetRole: 'USER' | 'ADMIN' = role === 'ADMIN' ? 'ADMIN' : 'USER';

    let resolvedSession;

    if (mode === 'signup') {
      resolvedSession = mockRegister(
        data.name || data.email.split('@')[0],
        data.email,
        data.mobile || '',
        data.password
      );
    } else {
      resolvedSession = mockLogin(data.email, data.password, targetRole);
    }

    const { user } = resolvedSession;
    const finalRole: UserRole = user.role === 'ADMIN' ? 'ADMIN' : 'USER';
    const name = user.name || data.name || data.email.split('@')[0];

    const profile: UserProfile = {
      id: user.id,
      name,
      email: user.email,
      phone: user.mobile || data.mobile || '',
      pan: '',
      gstNumber: '',
      companyName: user.departmentName || (finalRole === 'ADMIN' ? 'SWAGAT System Administration' : `${name}'s Enterprise`),
      cin: '',
      entityType: 'Private Limited',
      state: 'India',
      address: '',
      isDigiLockerVerified: false,
      role: finalRole,
      avatarInitials: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      departmentName: user.departmentName,
      status: user.status || 'Active',
      accountType: user.accountType || (finalRole === 'ADMIN' ? 'System Administrator' : 'Business User'),
    };

    setUserProfile(profile);
    setIsAuthModalOpen(false);

    if (finalRole === 'ADMIN') {
      setCurrentView('admin-dashboard');
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/dashboard');
      showToast(`Welcome, ${name}! Signed in to SWAGAT ADMIN Portal.`);
    } else {
      // Load this user's applications from the shared store
      setApplications(loadUserApplications(user.id));

      setCurrentView('dashboard');
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/dashboard');
      showToast(`Welcome, ${name}! Signed in to My SWAGAT Dashboard.`);

      // Process Preservation
      if (pendingApprovalToApply) {
        setIsApplyModalOpen(true);
      }
    }
  };

  const logout = () => {
    try {
      authApi.logout();
    } catch {
      // ignore offline errors
    }
    clearSession();
    setUserProfile(null);
    setWizardSession(null);
    setCurrentView('home');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
    showToast('Signed out successfully from SWAGAT session.');
  };

  // ── Wizard ────────────────────────────────────────────────────────────────

  const openWizard = (businessType: BusinessType) => {
    setWizardSession({
      businessType,
      applicationId: null,
      activeStep: 'business_registration',
      allStepsComplete: false,
      steps: {
        business_registration: { currentNodeId: null, selectedPath: [], leafReached: false, leafNodeId: null },
        business_activity: { currentNodeId: null, selectedPath: [], leafReached: false, leafNodeId: null },
        foreign_investment: { currentNodeId: null, selectedPath: [], leafReached: false, leafNodeId: null },
        project_land: { currentNodeId: null, selectedPath: [], leafReached: false, leafNodeId: null },
      }
    });
    setCurrentView('wizard');
  };

  const closeWizard = () => {
    setWizardSession(null);
    setCurrentView('dashboard');
  };

  // ── KYA ───────────────────────────────────────────────────────────────────

  const updateKyaState = (partial: Partial<KYAState>) =>
    setKyaState(prev => ({ ...prev, ...partial }));

  const resetKya = () => setKyaState({ ...initialKyaState, completed: false });

  // ── Applications ──────────────────────────────────────────────────────────

  const startApplication = (approval: Approval) => {
    setPendingApprovalToApply(approval);
    if (!userProfile) {
      setAuthModalMode('signin-user');
      setIsAuthModalOpen(true);
      showToast('Please sign in to proceed.');
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const submitNewApplication = (applicationData: Partial<Application>): Application => {
    const newId = `app-new-${Date.now()}`;
    const stateCode = (kyaState.state || applicationData.projectState || 'IN').substring(0, 2).toUpperCase();
    const newTracking = `SWG-2026-${stateCode}-${Math.floor(10000 + Math.random() * 90000)}`;

    const appName = pendingApprovalToApply?.name || applicationData.approvalName || 'Factory License & Industrial Clearance';
    const deptName = pendingApprovalToApply?.department || applicationData.department || 'Directorate of Industrial Safety & Health';
    const ministryName = pendingApprovalToApply?.ministry || applicationData.ministry || 'Ministry of Commerce & Industry';
    const state = kyaState.state || applicationData.projectState || 'Maharashtra';
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Build rich document items
    const docItems: ApplicationDocumentItem[] = [
      {
        id: `doc-${newId}-1`,
        documentName: 'Permanent Account Number (PAN Card)',
        category: 'Company Registration',
        fileUrl: '/docs/PAN_Document.pdf',
        uploadDate: today,
        verificationStatus: 'Approved',
        adminRemark: 'Verified via DigiLocker corporate record',
      },
      {
        id: `doc-${newId}-2`,
        documentName: 'GST Registration Certificate (Form REG-06)',
        category: 'Company Registration',
        fileUrl: '/docs/GST_Document.pdf',
        uploadDate: today,
        verificationStatus: 'Approved',
        adminRemark: 'Active GSTIN verified via GSTN API',
      },
      {
        id: `doc-${newId}-3`,
        documentName: 'Factory Building & Machinery Layout Plan',
        category: 'Land Documents',
        fileUrl: '/docs/Site_Layout.pdf',
        uploadDate: today,
        verificationStatus: 'Under Review',
        adminRemark: 'Awaiting scrutiny by zonal technical officer',
      },
      {
        id: `doc-${newId}-4`,
        documentName: 'Effluent Treatment Scheme & Environmental Report',
        category: 'Environmental Documents',
        fileUrl: '/docs/Environmental_Report.pdf',
        uploadDate: today,
        verificationStatus: 'Under Review',
        adminRemark: 'Desk scrutiny in progress by state pollution authority',
      },
    ];

    // Build approval roadmap items
    const approvalItems: ApplicationApprovalItem[] = [
      {
        id: `appr-${newId}-1`,
        approvalName: 'Company Incorporation & Business Registration',
        department: 'Ministry of Corporate Affairs (MCA)',
        centralOrState: 'Central',
        status: 'Approved',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Corporate CIN active and authenticated',
      },
      {
        id: `appr-${newId}-2`,
        approvalName: appName,
        department: deptName,
        centralOrState: (pendingApprovalToApply?.centralOrState || 'State') as 'Central' | 'State',
        status: 'Under Review',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Automated desk scrutiny in progress (SLA: 48 Hours)',
      },
      {
        id: `appr-${newId}-3`,
        approvalName: 'Fire Safety NOC / Provisional Clearance',
        department: 'State Fire Prevention Services',
        centralOrState: 'State',
        status: 'Pending',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Site inspection pending inspector assignment',
      },
      {
        id: `appr-${newId}-4`,
        approvalName: 'Consent to Establish (CTE) / Pollution Clearance',
        department: 'State Pollution Control Board',
        centralOrState: 'State',
        status: 'Under Review',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Regional office evaluating process emission parameters',
      },
      {
        id: `appr-${newId}-5`,
        approvalName: 'Contract Labour & Shop Establishment Registration',
        department: 'Department of Labour Welfare',
        centralOrState: 'State',
        status: 'Approved',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Digital clearance certificate issued',
      },
    ];

    const newApp: Application = {
      id: newId,
      trackingNumber: newTracking,
      userId: userProfile?.id,
      applicantEmail: userProfile?.email,
      applicantPhone: userProfile?.phone,
      businessType: kyaState.sector || applicationData.businessType || 'General Enterprise',
      approvalId: pendingApprovalToApply?.id || 'app-custom',
      approvalName: appName,
      department: deptName,
      ministry: ministryName,
      centralOrState: (pendingApprovalToApply?.centralOrState || 'State') as 'Central' | 'State',
      stateName: state,
      submissionDate: today,
      lastUpdated: 'Just now',
      currentStatus: 'Submitted',
      nextAction: 'Initial automated desk scrutiny in progress (SLA: 48 Hours)',
      estimatedCompletionDays: pendingApprovalToApply?.processingDays || 30,
      statutoryFeePaid: pendingApprovalToApply?.statutoryFee || 'Rs.10,000',
      applicantName: userProfile?.name || 'Authorized Signatory',
      companyName: userProfile?.companyName || 'Enterprise Ltd',
      panNumber: userProfile?.pan || 'AABCA9082F',
      gstNumber: userProfile?.gstNumber || '27AABCA9082F1ZG',
      cinNumber: userProfile?.cin || 'U29253MH2021PTC368940',
      projectTitle: applicationData.projectTitle || `${kyaState.sector || 'Industrial'} Unit (${state})`,
      projectState: state,
      projectDistrict: applicationData.projectDistrict || 'Industrial Area',
      investmentAmount: kyaState.investmentSize || applicationData.investmentAmount || 'Rs.10 - Rs.50 Cr',
      timeline: [
        { title: 'Application Drafted', date: today, description: 'Application submitted with CAF parameters', completed: true, current: false },
        { title: 'Desk Scrutiny', date: 'In Progress', description: 'Statutory desk verification in progress', completed: false, current: true },
        { title: 'Competent Authority Decision', description: 'Final order issuance and certification', completed: false, current: false }
      ],
      documentsAttached: docItems.map(d => ({ name: d.documentName, category: d.category, verified: d.verificationStatus === 'Approved' })),
      documentsList: docItems,
      approvalsList: approvalItems,
      queries: []
    };

    // Persist to shared store so Admin sees this application immediately
    addApplication(newApp);

    setApplications(prev => [newApp, ...prev]);
    setPendingApprovalToApply(null);
    setIsApplyModalOpen(false);
    showToast(`Application ${newTracking} submitted! Tracking activated.`);
    return newApp;
  };

  const respondToQuery = (applicationId: string, queryId: string, responseText: string, attachedDocs?: string[]) => {
    respondToQueryInStore(applicationId, queryId, responseText, attachedDocs);
    if (userProfile?.id) {
      setApplications(loadUserApplications(userProfile.id));
    }
    setSelectedQueryApp(null);
    showToast('Response submitted to department.');
  };

  const reuploadDocument = (applicationId: string, documentName: string, fileName: string) => {
    reuploadDocumentInStore(applicationId, documentName, fileName);
    if (userProfile?.id) {
      setApplications(loadUserApplications(userProfile.id));
    }
    showToast(`Corrected document "${documentName}" uploaded.`);
  };

  const refreshApplications = () => {
    if (userProfile?.id) {
      setApplications(loadUserApplications(userProfile.id));
      setUserNotifications(loadNotifications('USER', userProfile.id));
      showToast('Applications refreshed.');
    }
  };

  const markNotifAsRead = (id: string) => {
    markNotificationRead(id);
    setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // ── Documents ─────────────────────────────────────────────────────────────

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = { ...doc, id: `doc-${Date.now()}`, uploadedAt: 'Today' };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Document "${newDoc.name}" uploaded.`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Document deleted.');
  };

  const triggerRenewal = (renewalId: string) => {
    setRenewals(prev => prev.map(r =>
      r.id === renewalId
        ? { ...r, daysRemaining: 365, status: 'Active', expiryDate: '30 Sep 2027' }
        : r
    ));
    showToast('License renewal processed and extended for 1 year.');
  };

  // ── State Modal ───────────────────────────────────────────────────────────

  const openStateDetailModal = (stateCodeOrName: string) => {
    if (stateCodeOrName.length === 2) {
      setSelectedStateForModal(getStateDataByCode(stateCodeOrName.toUpperCase()));
      return;
    }
    const found = allIndianStatesList.find(s => s.name.toLowerCase() === stateCodeOrName.toLowerCase());
    if (found) setSelectedStateForModal(getStateDataByCode(found.code));
    else setSelectedStateForModal(getStateDataByCode('KA'));
  };

  const closeStateDetailModal = () => setSelectedStateForModal(null);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Provide ───────────────────────────────────────────────────────────────

  return (
    <SwagatContext.Provider value={{
      userProfile, login, logout, isBackendOnline,
      isAuthModalOpen, setIsAuthModalOpen,
      authModalMode, setAuthModalMode,
      currentView, setCurrentView,
      dashboardActiveTab, setDashboardActiveTab,
      approvals, schemes, selectedApproval, setSelectedApproval,
      selectedScheme, setSelectedScheme,
      kyaState, setKyaState, updateKyaState, resetKya,
      pendingApprovalToApply, setPendingApprovalToApply,
      isApplyModalOpen, setIsApplyModalOpen,
      startApplication, submitNewApplication,
      applications, selectedApplication, setSelectedApplication,
      selectedQueryApp, setSelectedQueryApp, respondToQuery,
      reuploadDocument, refreshApplications,
      userNotifications, markNotifAsRead,
      documents, addDocument, deleteDocument,
      previewDocument, setPreviewDocument,
      renewals, triggerRenewal,
      isSearchModalOpen, setIsSearchModalOpen,
      selectedStateForModal, openStateDetailModal, closeStateDetailModal,
      selectedSectorFilter, setSelectedSectorFilter,
      selectedStateFilter, setSelectedStateFilter,
      toastMessage, showToast,
      wizardSession, setWizardSession, openWizard, closeWizard,
    }}>
      {children}
    </SwagatContext.Provider>
  );
};

export const useSwagat = () => {
  const context = useContext(SwagatContext);
  if (!context) throw new Error('useSwagat must be used within a SwagatProvider');
  return context;
};
