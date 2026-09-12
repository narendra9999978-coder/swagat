/**
 * SWAGAT Shared Application Store
 *
 * Acts as the persistent "database" for the frontend deployment.
 * Both User and Admin read/write from the same localStorage key, making
 * it the single source of truth for all application data, documents,
 * approvals roadmap, queries, and notification logs.
 *
 * Keys:
 * - Applications: swagat_applications_v1
 * - Notifications: swagat_notifications_v1
 */

import { 
  Application, 
  ApplicationQuery, 
  ApplicationDocumentItem, 
  ApplicationApprovalItem,
  DocumentVerificationStatus,
  ApprovalItemStatus,
  AppNotification
} from '../types/swagat';

const STORE_KEY = 'swagat_applications_v1';
const NOTIF_STORE_KEY = 'swagat_notifications_v1';

// ─────────────────────────────────────────────────────────────────────────────
// Seed demo application with realistic documents and approvals
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_DOCUMENTS: ApplicationDocumentItem[] = [
  {
    id: 'doc-pan-01',
    documentName: 'Permanent Account Number (PAN Card)',
    category: 'Company Registration',
    fileUrl: '/docs/PAN_AABCA9082F.pdf',
    uploadDate: '22 Aug 2026',
    verificationStatus: 'Approved',
    adminRemark: 'Verified successfully with DigiLocker / MCA corporate database',
  },
  {
    id: 'doc-gst-01',
    documentName: 'GST Registration Certificate (Form REG-06)',
    category: 'Company Registration',
    fileUrl: '/docs/GST_27AABCA9082F1ZG.pdf',
    uploadDate: '22 Aug 2026',
    verificationStatus: 'Approved',
    adminRemark: 'Active GSTIN verified via GSTN API',
  },
  {
    id: 'doc-land-01',
    documentName: 'MIDC Land Possession Order & Lease Agreement',
    category: 'Land Documents',
    fileUrl: '/docs/MIDC_Land_Possession.pdf',
    uploadDate: '24 Aug 2026',
    verificationStatus: 'Under Review',
    adminRemark: 'Waiting for department field verification and boundary confirmation',
  },
  {
    id: 'doc-env-01',
    documentName: 'Effluent Treatment Plant (ETP) Scheme Blueprint',
    category: 'Environmental Documents',
    fileUrl: '/docs/ETP_Scheme_Blueprint.pdf',
    uploadDate: '24 Aug 2026',
    verificationStatus: 'Correction Required',
    adminRemark: 'Please upload the updated ETP flow diagram with capacity details (50 KLD minimum)',
  },
  {
    id: 'doc-layout-01',
    documentName: 'Factory Building & Machinery Layout Plan',
    category: 'Factory & Labour',
    fileUrl: '/docs/Factory_Machinery_Layout.pdf',
    uploadDate: '24 Aug 2026',
    verificationStatus: 'Pending Upload',
    adminRemark: 'Not yet reviewed by structural engineer',
  },
];

const DEMO_APPROVALS: ApplicationApprovalItem[] = [
  {
    id: 'appr-mca',
    approvalName: 'Company Incorporation & Business Registration',
    department: 'Ministry of Corporate Affairs (MCA)',
    centralOrState: 'Central',
    status: 'Approved',
    submittedDate: '22 Aug 2026',
    lastUpdated: '24 Aug 2026',
    remarks: 'Certificate of Incorporation (CIN: U29253MH2021PTC368940) active',
  },
  {
    id: 'appr-dish',
    approvalName: 'Factory License & Building Plan Approval',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    centralOrState: 'State',
    status: 'Under Review',
    submittedDate: '24 Aug 2026',
    lastUpdated: '02 Sep 2026',
    remarks: 'Technical scrutinizer reviewing structural & boiler safety parameters',
  },
  {
    id: 'appr-fire',
    approvalName: 'Fire Safety Clearance / Provisional NOC',
    department: 'State Fire Prevention Services',
    centralOrState: 'State',
    status: 'Pending',
    submittedDate: '24 Aug 2026',
    lastUpdated: '24 Aug 2026',
    remarks: 'Site inspection pending inspector assignment',
  },
  {
    id: 'appr-cte',
    approvalName: 'Consent to Establish (CTE) - Orange Category',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    centralOrState: 'State',
    status: 'Under Review',
    submittedDate: '24 Aug 2026',
    lastUpdated: '02 Sep 2026',
    remarks: 'Field scrutiny scheduled by Sub-Regional Officer Pune II',
  },
  {
    id: 'appr-labour',
    approvalName: 'Contract Labour & Shop Establishment Registration',
    department: 'Department of Labour Welfare',
    centralOrState: 'State',
    status: 'Approved',
    submittedDate: '24 Aug 2026',
    lastUpdated: '28 Aug 2026',
    remarks: 'Form V verified; digital certificate issued',
  },
];

const DEMO_APPLICATION: Application = {
  id: 'app-mh-78942',
  trackingNumber: 'SWG-2026-MH-78942',
  userId: 'usr-app-001',
  applicantEmail: 'rajesh@apexind.in',
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
  statutoryFeePaid: 'Rs.45,000',
  applicantName: 'Rajesh Sharma',
  companyName: 'Apex Precision Engineering Pvt Ltd',
  applicantPhone: '+91 98201 45678',
  businessType: 'General Manufacturing',
  panNumber: 'AABCA9082F',
  gstNumber: '27AABCA9082F1ZG',
  cinNumber: 'U29253MH2021PTC368940',
  projectTitle: 'Automotive Component Die-Casting Unit Expansion',
  projectState: 'Maharashtra',
  projectDistrict: 'Pune (Chakan)',
  investmentAmount: 'Rs.24.50 Crores',
  timeline: [
    { title: 'Application Drafted', date: '22 Aug 2026', description: 'Form submitted with preliminary project blueprints', completed: true, current: false },
    { title: 'Payment & Submission', date: '24 Aug 2026', description: 'Statutory fee Rs.45,000 paid via Bharatkosh / GRAS gateway', completed: true, current: false },
    { title: 'Document Scrutiny', date: '28 Aug 2026', description: 'Desk verification completed by MPCB Regional Office', completed: true, current: false },
    { title: 'Site Inspection / Review', date: '02 Sep 2026', description: 'Inspection officer assigned; field visit scheduled', completed: false, current: true },
    { title: 'Consent Committee Decision', description: 'Final order issuance and digital signed CTE certificate', completed: false, current: false },
  ],
  documentsAttached: [
    { name: 'Permanent Account Number (PAN Card)', category: 'Company Registration', verified: true },
    { name: 'GST Registration Certificate (Form REG-06)', category: 'Company Registration', verified: true },
    { name: 'MIDC Land Possession Order & Lease Agreement', category: 'Land Documents', verified: false },
    { name: 'Effluent Treatment Plant (ETP) Scheme Blueprint', category: 'Environmental Documents', verified: false },
    { name: 'Factory Building & Machinery Layout Plan', category: 'Factory & Labour', verified: false },
  ],
  documentsList: DEMO_DOCUMENTS,
  approvalsList: DEMO_APPROVALS,
  queries: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// Broadcaster: notifies other components & windows in real-time
// ─────────────────────────────────────────────────────────────────────────────

function broadcastStoreUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('swagat_applications_updated'));
  }
}

function broadcastNotifUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('swagat_notifications_updated'));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Application Store helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Load all applications from localStorage. Seeds demo data on first run. */
export function loadAllApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const initial = [DEMO_APPLICATION];
      localStorage.setItem(STORE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: Application[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORE_KEY, JSON.stringify([DEMO_APPLICATION]));
      return [DEMO_APPLICATION];
    }
    // Ensure demo app or existing apps have documentsList and approvalsList
    return parsed.map(app => ({
      ...app,
      documentsList: app.documentsList && app.documentsList.length > 0 
        ? app.documentsList 
        : (app.documentsAttached || []).map((d, i) => ({
            id: `doc-${app.id}-${i}`,
            documentName: d.name,
            category: d.category || 'General Document',
            uploadDate: app.submissionDate,
            verificationStatus: (d.verified ? 'Approved' : 'Under Review') as DocumentVerificationStatus,
            adminRemark: d.verified ? 'Verified successfully' : 'Awaiting review',
          })),
      approvalsList: app.approvalsList && app.approvalsList.length > 0
        ? app.approvalsList
        : [
            {
              id: `appr-${app.id}-1`,
              approvalName: app.approvalName,
              department: app.department,
              centralOrState: app.centralOrState,
              status: (app.currentStatus === 'Approved' ? 'Approved' : 'Under Review') as ApprovalItemStatus,
              submittedDate: app.submissionDate,
              lastUpdated: app.lastUpdated,
              remarks: app.nextAction,
            },
          ],
    }));
  } catch {
    return [DEMO_APPLICATION];
  }
}

/** Persist the full application list to localStorage and broadcast. */
export function saveAllApplications(applications: Application[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(applications));
    broadcastStoreUpdate();
  } catch {
    console.warn('[SWAGAT] applicationStore: could not persist to localStorage.');
  }
}

/** Load only the applications that belong to a specific userId. */
export function loadUserApplications(userId: string): Application[] {
  return loadAllApplications().filter(app => app.userId === userId);
}

/** Add or upsert an application in the shared store. */
export function addApplication(application: Application): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === application.id);
  if (idx === -1) {
    all.unshift(application);
  } else {
    all[idx] = application;
  }
  saveAllApplications(all);

  // Notify Admin & User
  addNotification({
    id: `notif-${Date.now()}-adm`,
    role: 'ADMIN',
    applicationId: application.id,
    trackingNumber: application.trackingNumber,
    type: 'Application Submitted',
    title: `New Application Submitted: ${application.trackingNumber}`,
    message: `${application.applicantName} (${application.companyName}) submitted an application for ${application.approvalName} in ${application.projectState}.`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });

  addNotification({
    id: `notif-${Date.now()}-usr`,
    userId: application.userId,
    role: 'USER',
    applicationId: application.id,
    trackingNumber: application.trackingNumber,
    type: 'Application Submitted',
    title: `Application Successfully Submitted`,
    message: `Your application ${application.trackingNumber} for ${application.approvalName} is now under statutory desk scrutiny.`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** Update an existing application in the shared store. */
export function updateApplication(application: Application): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === application.id);
  if (idx !== -1) {
    all[idx] = application;
    saveAllApplications(all);
  }
}

/** Update application overall status (admin action). */
export function updateApplicationStatus(
  applicationId: string,
  newStatus: Application['currentStatus'],
  nextAction: string,
  remarks?: string
): Application | null {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return null;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  all[idx] = {
    ...all[idx],
    currentStatus: newStatus,
    nextAction,
    lastUpdated: today,
    remarks: remarks || all[idx].remarks,
    timeline: [
      ...all[idx].timeline.map(s => ({ ...s, current: false })),
      {
        title: 'Status: ' + newStatus,
        date: today,
        description: nextAction,
        completed: newStatus === 'Approved' || newStatus === 'Rejected',
        current: newStatus !== 'Approved' && newStatus !== 'Rejected',
      },
    ],
  };
  saveAllApplications(all);

  // Notify User
  addNotification({
    id: `notif-${Date.now()}`,
    userId: all[idx].userId,
    role: 'USER',
    applicationId,
    trackingNumber: all[idx].trackingNumber,
    type: 'Status Changed',
    title: `Application Status: ${newStatus}`,
    message: `Your application ${all[idx].trackingNumber} has been updated to "${newStatus}". ${nextAction}`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });

  return all[idx];
}

/** Update document verification status and admin remarks (admin action). */
export function updateDocumentVerification(
  applicationId: string,
  documentIdOrName: string,
  status: DocumentVerificationStatus,
  adminRemark?: string
): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const app = all[idx];

  const updatedDocsList = (app.documentsList || []).map(doc => {
    if (doc.id === documentIdOrName || doc.documentName === documentIdOrName) {
      return {
        ...doc,
        verificationStatus: status,
        adminRemark: adminRemark !== undefined ? adminRemark : doc.adminRemark,
      };
    }
    return doc;
  });

  const updatedAttached = (app.documentsAttached || []).map(doc => {
    if (doc.name === documentIdOrName) {
      return {
        ...doc,
        verified: status === 'Approved',
      };
    }
    return doc;
  });

  all[idx] = {
    ...app,
    documentsList: updatedDocsList,
    documentsAttached: updatedAttached,
    lastUpdated: today,
  };
  saveAllApplications(all);

  // Send Notification to User
  const notifType: AppNotification['type'] = 
    status === 'Approved' ? 'Document Approved' :
    status === 'Rejected' ? 'Document Rejected' :
    status === 'Correction Required' ? 'Correction Requested' : 'Status Changed';

  addNotification({
    id: `notif-${Date.now()}`,
    userId: app.userId,
    role: 'USER',
    applicationId,
    trackingNumber: app.trackingNumber,
    type: notifType,
    title: `Document ${status}: ${documentIdOrName}`,
    message: `The department updated document status to "${status}". Remark: ${adminRemark || 'No remarks.'}`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** Update document status (backward compatibility). */
export function updateDocumentStatus(
  applicationId: string,
  documentName: string,
  verified: boolean
): void {
  updateDocumentVerification(
    applicationId,
    documentName,
    verified ? 'Approved' : 'Under Review',
    verified ? 'Verified successfully' : 'Pending verification'
  );
}

/** Update individual approval status in the roadmap (admin action). */
export function updateApprovalItemStatus(
  applicationId: string,
  approvalItemId: string,
  status: ApprovalItemStatus,
  remarks?: string
): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const app = all[idx];

  const updatedApprovals = (app.approvalsList || []).map(appr => {
    if (appr.id === approvalItemId || appr.approvalName === approvalItemId) {
      return {
        ...appr,
        status,
        lastUpdated: today,
        remarks: remarks || appr.remarks,
      };
    }
    return appr;
  });

  all[idx] = {
    ...app,
    approvalsList: updatedApprovals,
    lastUpdated: today,
  };
  saveAllApplications(all);

  addNotification({
    id: `notif-${Date.now()}`,
    userId: app.userId,
    role: 'USER',
    applicationId,
    trackingNumber: app.trackingNumber,
    type: 'Status Changed',
    title: `Clearance Update: ${approvalItemId}`,
    message: `Statutory clearance status changed to "${status}". ${remarks ? 'Remark: ' + remarks : ''}`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** Admin raises a query on an application. */
export function addQueryToApplication(
  applicationId: string,
  queryText: string,
  officerName: string,
  departmentName: string
): ApplicationQuery | null {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return null;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const newQuery: ApplicationQuery = {
    id: 'qry-' + Date.now(),
    queryText,
    dateRaised: today,
    raisedByOfficer: officerName,
    department: departmentName,
    status: 'Open',
  };

  all[idx] = {
    ...all[idx],
    currentStatus: 'Query Raised',
    lastUpdated: today,
    nextAction: `Awaiting applicant response to ${departmentName} query`,
    queries: [...(all[idx].queries || []), newQuery],
    timeline: [
      ...all[idx].timeline.map(s => ({ ...s, current: false })),
      {
        title: 'Query Raised',
        date: today,
        description: 'Query raised by ' + officerName + ': "' + queryText.slice(0, 60) + '..."',
        completed: false,
        current: true,
        queryRaised: true,
      },
    ],
  };
  saveAllApplications(all);

  // User notification
  addNotification({
    id: `notif-${Date.now()}`,
    userId: all[idx].userId,
    role: 'USER',
    applicationId,
    trackingNumber: all[idx].trackingNumber,
    type: 'Query Raised',
    title: `Action Required: Query Raised on ${all[idx].trackingNumber}`,
    message: `${officerName} (${departmentName}): "${queryText}". Please submit your clarification.`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });

  return newQuery;
}

/** User responds to an official query. */
export function respondToQueryInStore(
  applicationId: string,
  queryId: string,
  responseText: string,
  attachedDocs?: string[]
): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const app = all[idx];

  const updatedQueries = (app.queries || []).map(q => {
    if (q.id === queryId) {
      return {
        ...q,
        status: 'Responded' as const,
        responseText,
        responseDate: today,
        attachedDocs,
      };
    }
    return q;
  });

  all[idx] = {
    ...app,
    currentStatus: 'Response Submitted',
    lastUpdated: today,
    nextAction: 'Department scrutinizing applicant response (Expected SLA: 3 Days)',
    queries: updatedQueries,
    timeline: [
      ...app.timeline.map(s => ({ ...s, current: false })),
      {
        title: 'Response Submitted',
        date: today,
        description: 'Applicant clarification submitted to department',
        completed: true,
        current: true,
      },
    ],
  };
  saveAllApplications(all);

  // Admin notification
  addNotification({
    id: `notif-${Date.now()}`,
    role: 'ADMIN',
    applicationId,
    trackingNumber: app.trackingNumber,
    type: 'Response Submitted',
    title: `Query Response Received: ${app.trackingNumber}`,
    message: `${app.applicantName} has submitted clarification to the outstanding query.`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** Admin resolves a query after reviewing the user's response. */
export function resolveQueryInStore(
  applicationId: string,
  queryId: string,
  resolutionRemark?: string
): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const app = all[idx];

  const updatedQueries = (app.queries || []).map(q => {
    if (q.id === queryId) {
      return {
        ...q,
        status: 'Resolved' as const,
      };
    }
    return q;
  });

  // Check if any open queries remain
  const hasRemainingOpen = updatedQueries.some(q => q.status === 'Open');

  all[idx] = {
    ...app,
    currentStatus: hasRemainingOpen ? 'Query Raised' : 'Under Review',
    lastUpdated: today,
    nextAction: hasRemainingOpen 
      ? app.nextAction 
      : (resolutionRemark || 'All queries resolved. Department proceeding with statutory clearance evaluation.'),
    queries: updatedQueries,
  };
  saveAllApplications(all);

  // User notification
  addNotification({
    id: `notif-${Date.now()}`,
    userId: app.userId,
    role: 'USER',
    applicationId,
    trackingNumber: app.trackingNumber,
    type: 'Query Resolved',
    title: `Query Resolved on ${app.trackingNumber}`,
    message: `The scrutiny officer has marked your query as Resolved. ${resolutionRemark || 'Scrutiny resumed.'}`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** User re-uploads a corrected document after correction was requested. */
export function reuploadDocumentInStore(
  applicationId: string,
  documentIdOrName: string,
  fileName: string
): void {
  const all = loadAllApplications();
  const idx = all.findIndex(a => a.id === applicationId);
  if (idx === -1) return;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const app = all[idx];

  const updatedDocsList = (app.documentsList || []).map(doc => {
    if (doc.id === documentIdOrName || doc.documentName === documentIdOrName) {
      return {
        ...doc,
        verificationStatus: 'Uploaded' as DocumentVerificationStatus,
        fileUrl: `/uploads/${fileName}`,
        uploadDate: today,
        adminRemark: `Applicant uploaded corrected document (${fileName}) on ${today}`,
      };
    }
    return doc;
  });

  all[idx] = {
    ...app,
    documentsList: updatedDocsList,
    lastUpdated: today,
  };
  saveAllApplications(all);

  // Admin notification
  addNotification({
    id: `notif-${Date.now()}`,
    role: 'ADMIN',
    applicationId,
    trackingNumber: app.trackingNumber,
    type: 'Status Changed',
    title: `Corrected Document Uploaded: ${app.trackingNumber}`,
    message: `${app.applicantName} uploaded corrected version of "${documentIdOrName}" (${fileName}).`,
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  });
}

/** Get a single application by ID. */
export function getApplicationById(applicationId: string): Application | null {
  return loadAllApplications().find(a => a.id === applicationId) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification Store
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-init-1',
    role: 'USER',
    userId: 'usr-app-001',
    applicationId: 'app-mh-78942',
    trackingNumber: 'SWG-2026-MH-78942',
    type: 'Correction Requested',
    title: 'Document Correction Required',
    message: 'Maharashtra Pollution Control Board has requested an updated ETP flow diagram for SWG-2026-MH-78942.',
    timestamp: '02 Sep 2026, 11:30',
    read: false,
  },
  {
    id: 'notif-init-2',
    role: 'USER',
    userId: 'usr-app-001',
    applicationId: 'app-mh-78942',
    trackingNumber: 'SWG-2026-MH-78942',
    type: 'Document Approved',
    title: 'PAN & GST Verified',
    message: 'Corporate identity documents approved by desk scrutiny officer.',
    timestamp: '28 Aug 2026, 14:15',
    read: true,
  },
  {
    id: 'notif-init-3',
    role: 'ADMIN',
    applicationId: 'app-mh-78942',
    trackingNumber: 'SWG-2026-MH-78942',
    type: 'Application Submitted',
    title: 'New Statutory Application Received',
    message: 'Apex Precision Engineering submitted CTE clearance application in Maharashtra.',
    timestamp: '24 Aug 2026, 09:45',
    read: true,
  },
];

export function loadNotifications(role?: 'USER' | 'ADMIN', userId?: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORE_KEY);
    let all: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (!Array.isArray(all)) all = INITIAL_NOTIFICATIONS;

    if (role === 'USER') {
      return all.filter(n => (n.role === 'USER' || n.role === 'ALL') && (!userId || !n.userId || n.userId === userId));
    }
    if (role === 'ADMIN') {
      return all.filter(n => n.role === 'ADMIN' || n.role === 'ALL');
    }
    return all;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(notif: AppNotification): void {
  try {
    const raw = localStorage.getItem(NOTIF_STORE_KEY);
    const all: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    all.unshift(notif);
    localStorage.setItem(NOTIF_STORE_KEY, JSON.stringify(all));
    broadcastNotifUpdate();
  } catch {
    console.warn('[SWAGAT] Could not add notification.');
  }
}

export function markNotificationRead(id: string): void {
  try {
    const raw = localStorage.getItem(NOTIF_STORE_KEY);
    if (!raw) return;
    const all: AppNotification[] = JSON.parse(raw);
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) {
      all[idx].read = true;
      localStorage.setItem(NOTIF_STORE_KEY, JSON.stringify(all));
      broadcastNotifUpdate();
    }
  } catch {
    // ignore
  }
}
