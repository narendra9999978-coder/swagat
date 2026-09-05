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
  StateData 
} from '../types/swagat';
import { approvalsData } from '../data/approvalsData';
import { schemesData } from '../data/schemesData';
import { getStateDataByCode, allIndianStatesList } from '../data/indiaStatesData';
import { 
  authApi, 
  applicantApi, 
  getStoredUser, 
  getStoredToken, 
  clearStoredAuth, 
  checkBackendHealth 
} from '../services/api';

interface SwagatContextType {
  // Auth & Profile
  userProfile: UserProfile | null;
  login: (role?: 'investor' | 'officer', customData?: Partial<UserProfile> & { password?: string }) => void;
  logout: () => void;
  isBackendOnline: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'investor' | 'officer';
  setAuthModalMode: (mode: 'login' | 'signup' | 'investor' | 'officer') => void;

  // View & Navigation
  currentView: 'home' | 'dashboard' | 'approvals' | 'schemes' | 'kya' | 'state-approvals' | 'tracking' | 'about' | 'help';
  setCurrentView: (view: 'home' | 'dashboard' | 'approvals' | 'schemes' | 'kya' | 'state-approvals' | 'tracking' | 'about' | 'help') => void;
  dashboardActiveTab: 'overview' | 'applications' | 'approvals' | 'kya' | 'documents' | 'projects' | 'renewals' | 'queries' | 'notifications' | 'settings';
  setDashboardActiveTab: (tab: 'overview' | 'applications' | 'approvals' | 'kya' | 'documents' | 'projects' | 'renewals' | 'queries' | 'notifications' | 'settings') => void;

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
}

const defaultUserProfile: UserProfile = {
  id: 'usr-9042',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@apexind.in',
  phone: '+91 98201 45678',
  pan: 'AABCA9082F',
  gstNumber: '27AABCA9082F1ZG',
  companyName: 'Apex Precision Engineering Pvt Ltd',
  cin: 'U29253MH2021PTC368940',
  entityType: 'Private Limited',
  state: 'Maharashtra',
  address: 'Plot C-45, MIDC Chakan Phase II, Pune, Maharashtra 410501',
  isDigiLockerVerified: true,
  role: 'investor',
  avatarInitials: 'RS'
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
  },
  {
    id: 'app-mh-65412',
    trackingNumber: 'SWG-2026-MH-65412',
    approvalId: 'app-factory-license',
    approvalName: 'Factory License & Machinery Layout Approval',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    ministry: 'Labour Department, Govt of Maharashtra',
    centralOrState: 'State',
    stateName: 'Maharashtra',
    submissionDate: '15 Aug 2026',
    lastUpdated: '01 Sep 2026',
    currentStatus: 'Query Raised',
    nextAction: 'Department requires revised ventilation & emergency exit schematic',
    estimatedCompletionDays: 30,
    statutoryFeePaid: '₹18,500',
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
      { title: 'Form No. 2 Submitted', date: '15 Aug 2026', description: 'Factory drawing and worker strength submitted', completed: true, current: false },
      { title: 'Scrutiny Officer Assigned', date: '20 Aug 2026', description: 'Deputy Director DISH Pune initiated technical check', completed: true, current: false },
      { title: 'Technical Query Raised', date: '01 Sep 2026', description: 'Discrepancy noted in secondary emergency escape stairway width', completed: false, current: true, queryRaised: true },
      { title: 'Query Clarification', description: 'Awaiting applicant response & updated drawing', completed: false, current: false },
      { title: 'Factory License Issuance', description: 'Form 4 issuance with 10-year statutory validity', completed: false, current: false }
    ],
    documentsAttached: [
      { name: 'Chartered Engineer Stability Certificate.pdf', category: 'Licenses', verified: true },
      { name: 'Machinery Connected Load Schedule.pdf', category: 'Licenses', verified: true }
    ],
    queries: [
      {
        id: 'qry-991',
        queryText: 'Please submit a revised floor plan drawing indicating a minimum 2.0 meter clear passage width for the secondary emergency staircase in Bay 2, complying with Rule 71 of Maharashtra Factory Rules.',
        dateRaised: '01 Sep 2026',
        raisedByOfficer: 'S. K. Kulkarni (Dy Director, DISH Pune)',
        department: 'Directorate of Industrial Safety & Health (DISH)',
        status: 'Open'
      }
    ]
  },
  {
    id: 'app-cen-10294',
    trackingNumber: 'SWG-2026-CEN-10294',
    approvalId: 'app-dpiit-startup',
    approvalName: 'DPIIT Startup India Recognition & 80-IAC Tax Exemption',
    department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    ministry: 'Ministry of Commerce and Industry',
    centralOrState: 'Central',
    submissionDate: '10 Jul 2026',
    lastUpdated: '18 Jul 2026',
    currentStatus: 'Approved',
    nextAction: 'Certificate ready for download. Tax holiday eligibility granted.',
    estimatedCompletionDays: 7,
    statutoryFeePaid: '₹0 (Zero Fee)',
    applicantName: 'Rajesh Sharma',
    companyName: 'Apex Precision Engineering Pvt Ltd',
    panNumber: 'AABCA9082F',
    gstNumber: '27AABCA9082F1ZG',
    cinNumber: 'U29253MH2021PTC368940',
    projectTitle: 'Smart IoT Sensors for Industrial Robotics',
    projectState: 'Maharashtra',
    projectDistrict: 'Pune',
    investmentAmount: '₹5.00 Crores',
    timeline: [
      { title: 'Application Submitted', date: '10 Jul 2026', description: 'Pitch deck and MCA certificate uploaded', completed: true, current: false },
      { title: 'Innovation Verification', date: '14 Jul 2026', description: 'Evaluated by Inter-Ministerial Board', completed: true, current: false },
      { title: 'Recognition Approved', date: '18 Jul 2026', description: 'DPIIT Certificate No. DIPP98412 issued digitally', completed: true, current: false }
    ],
    documentsAttached: [
      { name: 'MCA Certificate of Incorporation.pdf', category: 'Company Registration', verified: true },
      { name: 'Pitch Deck & Innovation Summary.pdf', category: 'Other', verified: true }
    ],
    queries: [],
    certificateUrl: '#download-cert-dipp98412'
  }
];

const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-pan-01',
    name: 'Company PAN Card (Apex Precision)',
    category: 'PAN',
    documentNumber: 'AABCA9082F',
    issueDate: '12 Jan 2021',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'Income Tax Dept (e-KYC Verified)',
    uploadedAt: '15 Aug 2026'
  },
  {
    id: 'doc-gst-02',
    name: 'GST Registration Certificate (Form GST REG-06)',
    category: 'GST',
    documentNumber: '27AABCA9082F1ZG',
    issueDate: '24 Feb 2021',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'GSTN Verified',
    uploadedAt: '15 Aug 2026'
  },
  {
    id: 'doc-cin-03',
    name: 'MCA Certificate of Incorporation & Articles (SPICe+)',
    category: 'CIN',
    documentNumber: 'U29253MH2021PTC368940',
    issueDate: '05 Jan 2021',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'Ministry of Corporate Affairs',
    uploadedAt: '15 Aug 2026'
  },
  {
    id: 'doc-land-04',
    name: 'MIDC Industrial Land Lease & Possession Deed',
    category: 'Land Documents',
    documentNumber: 'MIDC/PUN/CHK-45/2022',
    issueDate: '18 May 2022',
    expiryDate: '17 May 2117',
    daysToExpiry: 33200,
    fileSize: '8.1 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'MIDC Land Revenue Cell',
    uploadedAt: '16 Aug 2026'
  },
  {
    id: 'doc-fire-05',
    name: 'Provisional Fire NOC (MIDC Chakan Fire Station)',
    category: 'Licenses',
    documentNumber: 'FIRE/MH/CHK/2025/1102',
    issueDate: '10 Oct 2025',
    expiryDate: '09 Oct 2026',
    daysToExpiry: 34,
    fileSize: '2.1 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'Directorate of Fire Services',
    uploadedAt: '16 Aug 2026'
  },
  {
    id: 'doc-env-06',
    name: 'Baseline Environmental Impact & Water Balance Report',
    category: 'Environmental Documents',
    documentNumber: 'EIA-APEX-2026-V2',
    issueDate: '01 Aug 2026',
    fileSize: '14.5 MB',
    fileType: 'PDF',
    verified: true,
    verificationAgency: 'NABL Accredited Lab',
    uploadedAt: '22 Aug 2026'
  }
];

const initialRenewals: RenewalItem[] = [
  {
    id: 'ren-01',
    approvalId: 'app-fire-noc',
    approvalName: 'Annual Fire Safety NOC & Hydrant Certificate',
    licenseNumber: 'FIRE/MH/CHK/2025/1102',
    department: 'Directorate of Maharashtra Fire Services',
    expiryDate: '09 Oct 2026',
    daysRemaining: 34,
    status: 'Expiring Soon',
    renewalFee: '₹14,500',
    statutoryDaysAllowed: 60
  },
  {
    id: 'ren-02',
    approvalId: 'app-cpcb-cto',
    approvalName: 'Consent to Operate (CTO) - Air & Water Acts',
    licenseNumber: 'MPCB/RO-PUN/CTO/21094',
    department: 'Maharashtra Pollution Control Board',
    expiryDate: '30 Nov 2026',
    daysRemaining: 86,
    status: 'Active',
    renewalFee: '₹35,000',
    statutoryDaysAllowed: 90
  },
  {
    id: 'ren-03',
    approvalId: 'app-trade-license',
    approvalName: 'Municipal Trade & Storage License',
    licenseNumber: 'PMC/TRD/2025/8812',
    department: 'Pimpri-Chinchwad Municipal Corporation',
    expiryDate: '15 Sep 2026',
    daysRemaining: 10,
    status: 'Expiring Soon',
    renewalFee: '₹4,200',
    statutoryDaysAllowed: 30
  }
];

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
    'app-mca-incorporation',
    'app-midc-land',
    'app-cpcb-cto',
    'app-factory-license',
    'app-fire-noc',
    'app-power-load',
    'app-dgft-iec',
    'app-boilers-registration',
    'app-udyam-msme',
    'app-cgwa-groundwater',
    'app-epr-plastic'
  ]
};

const SwagatContext = createContext<SwagatContextType | undefined>(undefined);

export const SwagatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'investor' | 'officer'>('login');
  
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'approvals' | 'schemes' | 'kya' | 'state-approvals' | 'tracking' | 'about' | 'help'>('home');
  const [dashboardActiveTab, setDashboardActiveTab] = useState<'overview' | 'applications' | 'approvals' | 'kya' | 'documents' | 'projects' | 'renewals' | 'queries' | 'notifications' | 'settings'>('overview');

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
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  // Check Backend health on mount & restore session if present
  useEffect(() => {
    checkBackendHealth()
      .then(online => {
        setIsBackendOnline(online);
        if (online) {
          console.info('[SWAGAT] Connected to live Go backend on :8080');
        }
      })
      .catch(() => {
        setIsBackendOnline(false);
      });

    // Check if token and user are in localStorage
    const stored = getStoredUser();
    const token = getStoredToken();
    if (stored && token) {
      setUserProfile({
        ...defaultUserProfile,
        id: stored.id,
        email: stored.email,
        name: stored.full_name,
        role: stored.role === 'department_admin' ? 'officer' : 'investor'
      });
    }
  }, []);

  // State Detail Modal State
  const [selectedStateForModal, setSelectedStateForModal] = useState<StateData | null>(null);

  // Global Sector & State Quick Filters
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');

  const openStateDetailModal = (stateCodeOrName: string) => {
    // If it's already a code (2 chars)
    if (stateCodeOrName.length === 2) {
      const data = getStateDataByCode(stateCodeOrName.toUpperCase());
      setSelectedStateForModal(data);
      return;
    }
    // Try finding by name
    const found = allIndianStatesList.find(s => s.name.toLowerCase() === stateCodeOrName.toLowerCase());
    if (found) {
      const data = getStateDataByCode(found.code);
      setSelectedStateForModal(data);
    } else {
      // Fallback
      const data = getStateDataByCode('KA');
      setSelectedStateForModal(data);
    }
  };

  const closeStateDetailModal = () => {
    setSelectedStateForModal(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = async (role: 'investor' | 'officer' = 'investor', customData?: Partial<UserProfile> & { password?: string }) => {
    const email = customData?.email || defaultUserProfile.email;
    const password = customData?.password || 'pass123';
    const fullName = customData?.name || defaultUserProfile.name;

    // Try communicating with the Go backend
    try {
      if (authModalMode === 'signup') {
        const backendRole = role === 'officer' ? 'department_admin' : 'applicant';
        await authApi.register(email, password, fullName, backendRole);
      } else {
        await authApi.login(email, password);
      }
      setIsBackendOnline(true);
    } catch {
      // Graceful offline fallback: allows UI to continue smoothly
      console.info('[SWAGAT] Go backend offline; proceeding with local session credentials');
    }

    const profile: UserProfile = {
      ...defaultUserProfile,
      role,
      ...(customData || {})
    };
    setUserProfile(profile);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${profile.name}! Signed in securely via DigiLocker ID.`);

    // If the user had a pending approval application in progress before logging in, resume it immediately!
    if (pendingApprovalToApply) {
      setIsApplyModalOpen(true);
    }
  };

  const logout = () => {
    authApi.logout();
    setUserProfile(null);
    if (currentView === 'dashboard') {
      setCurrentView('home');
    }
    showToast('Signed out successfully from SWAGAT session.');
  };

  const updateKyaState = (partial: Partial<KYAState>) => {
    setKyaState(prev => ({ ...prev, ...partial }));
  };

  const resetKya = () => {
    setKyaState({
      ...initialKyaState,
      completed: false
    });
  };

  const startApplication = (approval: Approval) => {
    setPendingApprovalToApply(approval);
    if (!userProfile) {
      // Prompt login, but notify user that their session and application context will be preserved
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Please sign in to proceed. Your selected approval & details will be preserved.');
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
      stateName: kyaState.state || pendingApprovalToApply?.stateName || 'Maharashtra',
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: 'Just now',
      currentStatus: 'Submitted',
      nextAction: 'Initial automated desk scrutiny in progress (SLA: 48 Hours)',
      estimatedCompletionDays: pendingApprovalToApply?.processingDays || 30,
      statutoryFeePaid: pendingApprovalToApply?.statutoryFee || '₹10,000',
      applicantName: userProfile?.name || 'Authorized Signatory',
      companyName: userProfile?.companyName || 'Enterprise Ltd',
      panNumber: userProfile?.pan || 'AABCA9082F',
      gstNumber: userProfile?.gstNumber || '27AABCA9082F1ZG',
      cinNumber: userProfile?.cin,
      projectTitle: applicationData.projectTitle || `${kyaState.sector} Unit (${kyaState.state})`,
      projectState: kyaState.state || 'Maharashtra',
      projectDistrict: applicationData.projectDistrict || 'Industrial Area',
      investmentAmount: kyaState.investmentSize || '₹10 - ₹50 Cr',
      timeline: [
        { title: 'Application Drafted', date: 'Today', description: 'Application parameters & questionnaires completed', completed: true, current: false },
        { title: 'Statutory Fee Paid & Submitted', date: 'Today', description: 'Payment verified via SWAGAT Unified Gateway', completed: true, current: false },
        { title: 'Desk Scrutiny', date: 'In Progress', description: 'Verification of digital attachments & certificates', completed: false, current: true },
        { title: 'Competent Authority Approval', description: 'Final decision & digitally signed license issuance', completed: false, current: false }
      ],
      documentsAttached: documents.slice(0, 3).map(d => ({ name: `${d.name}.${d.fileType.toLowerCase()}`, category: d.category, verified: d.verified })),
      queries: []
    };

    setApplications(prev => [newApp, ...prev]);
    setPendingApprovalToApply(null);
    setIsApplyModalOpen(false);
    showToast(`Application ${newTracking} submitted successfully! Tracking activated.`);
    return newApp;
  };

  const respondToQuery = (applicationId: string, queryId: string, responseText: string, attachedDocs?: string[]) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const updatedQueries = app.queries.map(q => {
          if (q.id === queryId) {
            return {
              ...q,
              status: 'Responded' as const,
              responseText,
              responseDate: 'Just now',
              attachedDocs: attachedDocs || []
            };
          }
          return q;
        });

        const updatedTimeline = app.timeline.map(step => {
          if (step.queryRaised) {
            return { ...step, completed: true, current: false, description: 'Response submitted by applicant' };
          }
          if (step.title === 'Query Clarification') {
            return { ...step, completed: true, current: false, date: 'Today' };
          }
          if (step.title.includes('License') || step.title.includes('Decision') || step.title.includes('Issuance')) {
            return { ...step, current: true };
          }
          return step;
        });

        return {
          ...app,
          currentStatus: 'Response Submitted',
          lastUpdated: 'Just now',
          nextAction: 'Department scrutinizing applicant response (Expected response: 3 Days)',
          queries: updatedQueries,
          timeline: updatedTimeline
        };
      }
      return app;
    }));

    setSelectedQueryApp(null);
    showToast('Response submitted to department with digital audit trail.');
  };

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: 'Today'
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Document "${newDoc.name}" uploaded to secure repository.`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Document deleted from repository.');
  };

  const triggerRenewal = (renewalId: string) => {
    setRenewals(prev => prev.map(r => {
      if (r.id === renewalId) {
        return {
          ...r,
          daysRemaining: 365,
          status: 'Active',
          expiryDate: '30 Sep 2027'
        };
      }
      return r;
    }));
    showToast('Statutory renewal fee processed and license extended for 1 year.');
  };

  // Listen for Cmd+K or Ctrl+K or '/' to open global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SwagatContext.Provider value={{
      userProfile,
      login,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      currentView,
      setCurrentView,
      dashboardActiveTab,
      setDashboardActiveTab,
      approvals,
      schemes,
      selectedApproval,
      setSelectedApproval,
      selectedScheme,
      setSelectedScheme,
      kyaState,
      setKyaState,
      updateKyaState,
      resetKya,
      pendingApprovalToApply,
      setPendingApprovalToApply,
      isApplyModalOpen,
      setIsApplyModalOpen,
      startApplication,
      submitNewApplication,
      applications,
      selectedApplication,
      setSelectedApplication,
      selectedQueryApp,
      setSelectedQueryApp,
      respondToQuery,
      documents,
      addDocument,
      deleteDocument,
      previewDocument,
      setPreviewDocument,
      renewals,
      triggerRenewal,
      isSearchModalOpen,
      setIsSearchModalOpen,
      selectedStateForModal,
      openStateDetailModal,
      closeStateDetailModal,
      selectedSectorFilter,
      setSelectedSectorFilter,
      selectedStateFilter,
      setSelectedStateFilter,
      toastMessage,
      showToast,
      isBackendOnline
    }}>
      {children}
    </SwagatContext.Provider>
  );
};

export const useSwagat = () => {
  const context = useContext(SwagatContext);
  if (!context) {
    throw new Error('useSwagat must be used within a SwagatProvider');
  }
  return context;
};
