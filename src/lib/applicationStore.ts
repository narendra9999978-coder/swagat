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
    documentName: 'PAN Card',
    category: 'Company Registration',
    fileUrl: '/docs/PAN_AABCA9082F.pdf',
    uploadDate: '12 Sep 2026',
    verificationStatus: 'Approved',
    adminRemark: 'Verified successfully',
  },
  {
    id: 'doc-land-01',
    documentName: 'Land Document',
    category: 'Land Documents',
    fileUrl: '/docs/MIDC_Land_Possession.pdf',
    uploadDate: '12 Sep 2026',
    verificationStatus: 'Under Review',
    adminRemark: 'Waiting for department verification',
  },
  {
    id: 'doc-gst-01',
    documentName: 'GST Certificate',
    category: 'Company Registration',
    fileUrl: '/docs/GST_27AABCA9082F1ZG.pdf',
    uploadDate: '12 Sep 2026',
    verificationStatus: 'Approved',
    adminRemark: 'Verified',
  },
  {
    id: 'doc-env-01',
    documentName: 'Environmental Report',
    category: 'Environmental Documents',
    fileUrl: '/docs/Environmental_Report.pdf',
    uploadDate: '12 Sep 2026',
    verificationStatus: 'Correction Required',
    adminRemark: 'Please upload the updated report',
  },
  {
    id: 'doc-layout-01',
    documentName: 'Factory Layout',
    category: 'Factory & Labour',
    fileUrl: '/docs/Factory_Layout.pdf',
    uploadDate: '12 Sep 2026',
    verificationStatus: 'Pending',
    adminRemark: 'Not yet reviewed',
  },
];

const DEMO_APPROVALS: ApplicationApprovalItem[] = [
  {
    id: 'appr-mca',
    approvalName: 'Company Registration',
    department: 'Ministry of Corporate Affairs (MCA)',
    centralOrState: 'Central',
    status: 'Approved',
    submittedDate: '12 Sep 2026',
    lastUpdated: '12 Sep 2026',
    remarks: 'Corporate CIN active and authenticated',
  },
  {
    id: 'appr-dish',
    approvalName: 'Factory License',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    centralOrState: 'State',
    status: 'Under Review',
    submittedDate: '12 Sep 2026',
    lastUpdated: '12 Sep 2026',
    remarks: 'Technical scrutinizer reviewing structural & boiler safety parameters',
  },
  {
    id: 'appr-fire',
    approvalName: 'Fire NOC',
    department: 'State Fire Prevention Services',
    centralOrState: 'State',
    status: 'Pending',
    submittedDate: '12 Sep 2026',
    lastUpdated: '12 Sep 2026',
    remarks: 'Site inspection pending inspector assignment',
  },
  {
    id: 'appr-cte',
    approvalName: 'Pollution Consent',
    department: 'State Pollution Control Board',
    centralOrState: 'State',
    status: 'Query Raised',
    submittedDate: '12 Sep 2026',
    lastUpdated: '12 Sep 2026',
    remarks: 'Awaiting applicant response to department query',
  },
  {
    id: 'appr-labour',
    approvalName: 'Labour Registration',
    department: 'Department of Labour Welfare',
    centralOrState: 'State',
    status: 'Approved',
    submittedDate: '12 Sep 2026',
    lastUpdated: '12 Sep 2026',
    remarks: 'Digital clearance certificate issued',
  },
];

const DEMO_APPLICATION: Application = {
  id: 'app-swg-2026-0001',
  trackingNumber: 'SWG-2026-0001',
  userId: 'usr-demo-user',
  applicantEmail: 'user@demo.com',
  approvalId: 'app-factory-lic',
  approvalName: 'Factory Approval',
  department: 'Directorate of Industrial Safety & Health (DISH)',
  ministry: 'Labour & Employment Dept, Govt of Maharashtra',
  centralOrState: 'State',
  stateName: 'Maharashtra',
  submissionDate: '12 Sep 2026',
  lastUpdated: '12 Sep 2026',
  currentStatus: 'Under Review',
  nextAction: 'Under desk scrutiny by Directorate of Industrial Safety & Health (DISH)',
  estimatedCompletionDays: 30,
  statutoryFeePaid: 'Rs.35,000',
  applicantName: 'Narendra Singh',
  companyName: 'ABC Electronics Pvt Ltd',
  applicantPhone: '+91 98201 45678',
  businessType: 'Electronics',
  panNumber: 'AABCA9082F',
  gstNumber: '27AABCA9082F1ZG',
  cinNumber: 'U29253MH2021PTC368940',
  projectTitle: 'Consumer Electronics & SMT Manufacturing Facility',
  projectState: 'Maharashtra',
  projectDistrict: 'Pune (Chakan Industrial Area)',
  investmentAmount: 'Rs.18.50 Crores',
  timeline: [
    { title: 'Application Created', date: '12 Sep 2026', description: 'Application initiated and business details verified', completed: true, current: false },
    { title: 'Application Submitted', date: '12 Sep 2026', description: 'Statutory fee paid and common application submitted', completed: true, current: false },
    { title: 'Documents Uploaded', date: '12 Sep 2026', description: 'All statutory documents successfully attached to dossier', completed: true, current: false },
    { title: 'Department Review', date: '12 Sep 2026', description: 'Department scrutiny officer reviewing statutory documents', completed: false, current: true },
    { title: 'Approval', description: 'Final grant of statutory clearance order', completed: false, current: false },
    { title: 'Completion', description: 'Licence issue and commencement certificate generation', completed: false, current: false },
  ],
  documentsAttached: [
    { name: 'PAN Card', category: 'Company Registration', verified: true },
    { name: 'Land Document', category: 'Land Documents', verified: false },
    { name: 'GST Certificate', category: 'Company Registration', verified: true },
    { name: 'Environmental Report', category: 'Environmental Documents', verified: false },
    { name: 'Factory Layout', category: 'Factory & Labour', verified: false },
  ],
  documentsList: DEMO_DOCUMENTS,
  approvalsList: DEMO_APPROVALS,
  queries: [
    {
      id: 'qry-swg-01',
      approvalId: 'appr-cte',
      documentId: 'doc-env-01',
      queryText: 'Please upload the latest land ownership document.',
      message: 'Please upload the latest land ownership document.',
      raisedByOfficer: 'Scrutiny Officer - Industry Dept',
      raisedBy: 'Scrutiny Officer - Industry Dept',
      department: 'State Pollution Control Board',
      dateRaised: '12 Sep 2026',
      raisedDate: '12 Sep 2026',
      status: 'Open',
    },
  ],
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
    // Clean legacy test records and ensure complete document/approval lists
    return parsed.map(app => {
      // Migrate old demo tracking to canonical SWG-2026-0001
      if (app.trackingNumber === 'SWG-2026-MH-78942' || app.applicantEmail === 'rajesh@apexind.in') {
        app.id = 'app-swg-2026-0001';
        app.trackingNumber = 'SWG-2026-0001';
        app.userId = 'usr-demo-user';
        app.applicantEmail = 'user@demo.com';
        app.applicantName = 'Narendra Singh';
        app.applicantPhone = '+91 98201 45678';
        app.companyName = 'ABC Electronics Pvt Ltd';
        app.stateName = 'Maharashtra';
        app.businessType = 'Electronics';
        app.approvalName = 'Factory Approval';
        app.submissionDate = '12 Sep 2026';
        app.lastUpdated = '12 Sep 2026';
        app.currentStatus = 'Under Review';
        if (!app.documentsList || app.documentsList.length === 0) {
          app.documentsList = DEMO_DOCUMENTS;
        }
        if (!app.approvalsList || app.approvalsList.length === 0) {
          app.approvalsList = DEMO_APPROVALS;
        }
        if (!app.queries || app.queries.length === 0) {
          app.queries = DEMO_APPLICATION.queries;
        }
      }

      return {
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
      };
    });
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

export interface DocumentReviewQueueItem extends ApplicationDocumentItem {
  applicationId: string;
  trackingNumber: string;
  applicantName: string;
  companyName: string;
  applicantEmail?: string;
  stateName?: string;
  sector?: string;
}

/** Get all uploaded documents across all user applications for administrative verification */
export function getAllDocumentsAcrossApplications(): DocumentReviewQueueItem[] {
  const apps = loadAllApplications();
  const docs: DocumentReviewQueueItem[] = [];
  apps.forEach(app => {
    (app.documentsList || []).forEach(doc => {
      docs.push({
        ...doc,
        applicationId: app.id,
        trackingNumber: app.trackingNumber,
        applicantName: app.applicantName,
        companyName: app.companyName,
        applicantEmail: app.applicantEmail,
        stateName: app.stateName,
        sector: app.businessType,
      });
    });
  });
  return docs;
}

export interface AdminQueryItem {
  id: string;
  queryNumber: string;
  applicationId: string;
  trackingNumber: string;
  applicantName: string;
  companyName: string;
  applicantEmail?: string;
  department: string;
  state: string;
  sector?: string;
  raisedDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Responded' | 'Resolved' | 'Assigned' | 'Under Review';
  queryText: string;
  responseText?: string;
  responseDate?: string;
  assignedTo?: string;
  escalationLevel: number;
}

/** Get all queries across all user applications */
export function getAllQueriesAcrossApplications(): AdminQueryItem[] {
  const apps = loadAllApplications();
  const queries: AdminQueryItem[] = [];
  apps.forEach(app => {
    (app.queries || []).forEach((q, idx) => {
      queries.push({
        id: q.id,
        queryNumber: q.id.startsWith('QRY-') ? q.id : `QRY-${app.trackingNumber.replace('SWG-', '')}-${idx + 1}`,
        applicationId: app.id,
        trackingNumber: app.trackingNumber,
        applicantName: app.applicantName,
        companyName: app.companyName,
        applicantEmail: app.applicantEmail,
        department: app.department,
        state: app.stateName || 'India',
        sector: app.businessType || 'General',
        raisedDate: q.raisedDate,
        priority: 'High',
        status: q.status === 'Pending' ? 'Open' : q.status === 'Response Submitted' ? 'Responded' : 'Resolved',
        queryText: q.message,
        responseText: q.applicantResponse,
        responseDate: q.responseDate,
        assignedTo: q.raisedBy,
        escalationLevel: 1,
      });
    });
  });
  return queries;
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
