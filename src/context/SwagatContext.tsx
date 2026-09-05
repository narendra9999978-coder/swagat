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
} from '../types/swagat';
import { approvalsData } from '../data/approvalsData';
import { schemesData } from '../data/schemesData';
import { getStateDataByCode, allIndianStatesList } from '../data/indiaStatesData';
import { 
  authApi, 
  checkBackendHealth 
} from '../services/api';
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
    role: 'investor' | 'officer' | 'super_admin',
    data: { email: string; password: string; name?: string; mobile?: string }
  ) => Promise<void>;
  logout: () => void;
  isBackendOnline: boolean;

  // Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin-investor' | 'signup-investor' | 'signin-officer' | 'signup-officer' | 'signin-super';
  setAuthModalMode: (mode: 'signin-investor' | 'signup-investor' | 'signin-officer' | 'signup-officer' | 'signin-super') => void;

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
  const [authModalMode, setAuthModalMode] = useState<SwagatContextType['authModalMode']>('signin-investor');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [dashboardActiveTab, setDashboardActiveTab] = useState('overview');

  const [approvals] = useState<Approval[]>(approvalsData);
  const [schemes] = useState<Scheme[]>(schemesData);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const [kyaState, setKyaState] = useState<KYAState>(initialKyaState);
  const [pendingApprovalToApply, setPendingApprovalToApply] = useState<Approval | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedQueryApp, setSelectedQueryApp] = useState<{ application: Application; query: ApplicationQuery } | null>(null);

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
      const frontendRole: UserRole =
        user.role === 'super_admin' ? 'super_admin' :
        user.role === 'department_admin' ? 'officer' : 'investor';

      setUserProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.mobile || '',
        pan: '',
        gstNumber: '',
        companyName: user.departmentName || user.name,
        cin: '',
        entityType: 'Private Limited',
        state: 'India',
        address: '',
        isDigiLockerVerified: false,
        role: frontendRole,
        avatarInitials: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        departmentName: user.departmentName,
      });
    }

    // ── Supabase Google OAuth callback handler ────────────────────────────────
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supaSession) => {
        if (supaSession?.user) {
          const su = supaSession.user;
          const gName = su.user_metadata?.full_name || su.user_metadata?.name || su.email?.split('@')[0] || 'User';
          const gEmail = su.email || '';
          const oauthRole = (localStorage.getItem('swagat_oauth_role') || 'investor') as UserRole;
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
          setCurrentView('dashboard');
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
    role: 'investor' | 'officer' | 'super_admin',
    data: { email: string; password: string; name?: string; mobile?: string }
  ) => {
    const backendRole =
      role === 'super_admin' ? 'super_admin' :
      role === 'officer' ? 'department_admin' : 'applicant';

    let resolvedUser: { id: string; name: string; email: string; mobile?: string; departmentName?: string } | null = null;

    // 1. Try real backend
    try {
      if (mode === 'signup') {
        await authApi.register(data.email, data.password, data.name || data.email.split('@')[0], backendRole);
      } else {
        await authApi.login(data.email, data.password);
      }
      setIsBackendOnline(true);
    } catch {
      // 2. Fall back to mock JWT
      let session;
      if (mode === 'signup') {
        const mockRole: MockRole = role === 'super_admin' ? 'super_admin' : role === 'officer' ? 'department_admin' : 'applicant';
        session = mockRegister(data.name || data.email.split('@')[0], data.email, data.mobile || '', data.password, mockRole);
      } else {
        session = mockLogin(data.email, data.password);
        if (!session) {
          // Auto-register on first sign-in attempt (prototype convenience)
          const mockRole: MockRole = role === 'super_admin' ? 'super_admin' : role === 'officer' ? 'department_admin' : 'applicant';
          session = mockRegister(data.name || data.email.split('@')[0], data.email, data.mobile || '', data.password, mockRole);
        }
      }
      if (session) {
        resolvedUser = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          mobile: session.user.mobile,
          departmentName: session.user.departmentName,
        };
      }
    }

    const name = resolvedUser?.name || data.name || data.email.split('@')[0];
    const profile: UserProfile = {
      id: resolvedUser?.id || `usr-${Date.now()}`,
      name,
      email: data.email,
      phone: resolvedUser?.mobile || data.mobile || '',
      pan: '',
      gstNumber: '',
      companyName: resolvedUser?.departmentName || (role === 'officer' ? 'Government Department' : `${name}'s Enterprise`),
      cin: '',
      entityType: 'Private Limited',
      state: 'India',
      address: '',
      isDigiLockerVerified: false,
      role,
      avatarInitials: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      departmentName: resolvedUser?.departmentName,
    };

    setUserProfile(profile);
    setIsAuthModalOpen(false);
    setCurrentView('dashboard');
    showToast(`Welcome, ${name}! Signed in to SWAGAT Portal.`);

    if (pendingApprovalToApply) {
      setIsApplyModalOpen(true);
    }
  };

  const logout = () => {
    authApi.logout();
    clearSession();
    setUserProfile(null);
    setCurrentView('home');
    setWizardSession(null);
    showToast('Signed out from SWAGAT session.');
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
      setAuthModalMode('signin-investor');
      setIsAuthModalOpen(true);
      showToast('Please sign in to proceed.');
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const submitNewApplication = (applicationData: Partial<Application>): Application => {
    const newId = `app-new-${Date.now()}`;
    const newTracking = `SWG-2026-${(kyaState.state || 'IN').substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: Application = {
      id: newId,
      trackingNumber: newTracking,
      approvalId: pendingApprovalToApply?.id || 'app-custom',
      approvalName: pendingApprovalToApply?.name || applicationData.approvalName || 'Single Window Approval',
      department: pendingApprovalToApply?.department || applicationData.department || 'Competent Authority',
      ministry: pendingApprovalToApply?.ministry || applicationData.ministry || 'Government of India',
      centralOrState: pendingApprovalToApply?.centralOrState || 'State',
      stateName: kyaState.state || 'India',
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: 'Just now',
      currentStatus: 'Submitted',
      nextAction: 'Initial automated desk scrutiny in progress (SLA: 48 Hours)',
      estimatedCompletionDays: pendingApprovalToApply?.processingDays || 30,
      statutoryFeePaid: pendingApprovalToApply?.statutoryFee || '₹10,000',
      applicantName: userProfile?.name || 'Authorized Signatory',
      companyName: userProfile?.companyName || 'Enterprise Ltd',
      panNumber: userProfile?.pan || '',
      gstNumber: userProfile?.gstNumber || '',
      cinNumber: userProfile?.cin,
      projectTitle: applicationData.projectTitle || `${kyaState.sector} Project`,
      projectState: kyaState.state || 'India',
      projectDistrict: applicationData.projectDistrict || 'Industrial Area',
      investmentAmount: kyaState.investmentSize || '₹10 - ₹50 Cr',
      timeline: [
        { title: 'Application Drafted', date: 'Today', description: 'Application submitted', completed: true, current: false },
        { title: 'Desk Scrutiny', date: 'In Progress', description: 'Verification in progress', completed: false, current: true },
        { title: 'Competent Authority Approval', description: 'Final decision pending', completed: false, current: false }
      ],
      documentsAttached: documents.slice(0, 3).map(d => ({ name: d.name, category: d.category, verified: d.verified })),
      queries: []
    };

    setApplications(prev => [newApp, ...prev]);
    setPendingApprovalToApply(null);
    setIsApplyModalOpen(false);
    showToast(`Application ${newTracking} submitted! Tracking activated.`);
    return newApp;
  };

  const respondToQuery = (applicationId: string, queryId: string, responseText: string, attachedDocs?: string[]) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== applicationId) return app;
      return {
        ...app,
        currentStatus: 'Response Submitted',
        lastUpdated: 'Just now',
        nextAction: 'Department scrutinizing applicant response (Expected: 3 Days)',
        queries: app.queries.map(q =>
          q.id === queryId
            ? { ...q, status: 'Responded' as const, responseText, responseDate: 'Just now', attachedDocs: attachedDocs || [] }
            : q
        ),
        timeline: app.timeline.map(step =>
          step.queryRaised ? { ...step, completed: true, current: false, description: 'Response submitted' }
          : step.title === 'Query Clarification' ? { ...step, completed: true, current: false, date: 'Today' }
          : step
        ),
      };
    }));
    setSelectedQueryApp(null);
    showToast('Response submitted to department.');
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
