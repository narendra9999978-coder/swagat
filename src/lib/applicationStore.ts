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
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORE_KEY = 'swagat_applications_v1';
const NOTIF_STORE_KEY = 'swagat_notifications_v1';

// Concurrency lock validity duration (15 minutes)
export const LOCK_EXPIRY_MS = 15 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────────────────
// Database Mapping Helpers for Cross-Device Synchronization
// ─────────────────────────────────────────────────────────────────────────────

export function mapDbRowToApplication(row: any): Application {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    userId: row.user_id || undefined,
    applicantName: row.applicant_name || 'Applicant',
    applicantEmail: row.applicant_email || undefined,
    applicantPhone: row.applicant_phone || undefined,
    companyName: row.company_name || 'Enterprise',
    businessType: row.business_type || undefined,
    projectTitle: row.project_title || 'Project Setup',
    approvalId: row.approval_id || 'app-gen',
    approvalName: row.approval_name || 'Single Window Clearance',
    department: row.department || 'Single Window Authority',
    ministry: row.ministry || 'Ministry of Commerce & Industry',
    centralOrState: (row.central_or_state || 'State') as any,
    stateName: row.state_name || 'Maharashtra',
    submissionDate: row.submission_date || (row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')),
    lastUpdated: row.last_updated || 'Just now',
    currentStatus: (row.current_status || 'Under Review') as any,
    nextAction: row.next_action || 'Scrutiny in progress',
    estimatedCompletionDays: row.estimated_completion_days || 14,
    statutoryFeePaid: row.statutory_fee_paid || '₹15,000',
    panNumber: row.pan_number || '',
    gstNumber: row.gst_number || '',
    cinNumber: row.cin_number || '',
    projectState: row.project_state || row.state_name || 'Maharashtra',
    projectDistrict: row.project_district || 'Industrial Area',
    investmentAmount: row.investment_amount || '₹10 Cr',
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    documentsList: Array.isArray(row.documents_list) ? row.documents_list : [],
    documentsAttached: (Array.isArray(row.documents_list) ? row.documents_list : []).map((d: any) => ({
      name: d.documentName || d.name,
      category: d.category || 'General',
      verified: d.verificationStatus === 'Approved',
      url: d.fileUrl
    })),
    approvalsList: Array.isArray(row.approvals_list) ? row.approvals_list : [],
    queries: Array.isArray(row.queries) ? row.queries : [],
    lockedByAdminId: row.locked_by_admin_id || undefined,
    lockedByAdminName: row.locked_by_admin_name || undefined,
    lockedAt: row.locked_at || undefined,
  };
}

export function mapApplicationToDbRow(app: Application) {
  return {
    id: app.id,
    tracking_number: app.trackingNumber,
    user_id: app.userId || null,
    applicant_name: app.applicantName,
    applicant_email: app.applicantEmail || null,
    applicant_phone: app.applicantPhone || null,
    company_name: app.companyName,
    business_type: app.businessType || null,
    project_title: app.projectTitle || null,
    approval_id: app.approvalId || null,
    approval_name: app.approvalName || null,
    department: app.department || null,
    ministry: app.ministry || null,
    central_or_state: app.centralOrState || 'State',
    state_name: app.stateName || null,
    submission_date: app.submissionDate,
    last_updated: app.lastUpdated,
    current_status: app.currentStatus,
    next_action: app.nextAction,
    estimated_completion_days: app.estimatedCompletionDays || 14,
    statutory_fee_paid: app.statutoryFeePaid || null,
    pan_number: app.panNumber || null,
    gst_number: app.gstNumber || null,
    cin_number: app.cinNumber || null,
    project_state: app.projectState || app.stateName || null,
    project_district: app.projectDistrict || null,
    investment_amount: app.investmentAmount || null,
    timeline: app.timeline || [],
    documents_list: app.documentsList || [],
    approvals_list: app.approvalsList || [],
    queries: app.queries || [],
    locked_by_admin_id: app.lockedByAdminId || null,
    locked_by_admin_name: app.lockedByAdminName || null,
    locked_at: app.lockedAt || null,
    updated_at: new Date().toISOString(),
  };
}

export async function pushApplicationToSupabase(app: Application): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const row = mapApplicationToDbRow(app);
    await supabase.from('swagat_portal_applications').upsert(row, { onConflict: 'id' });
  } catch (err) {
    console.warn('[SWAGAT] Cloud push error:', err);
  }
}

export async function syncApplicationsFromCloud(): Promise<Application[]> {
  if (!isSupabaseConfigured()) return loadAllApplications();
  try {
    const { data, error } = await supabase
      .from('swagat_portal_applications')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) return loadAllApplications();

    const cloudApps = data.map(mapDbRowToApplication);
    const localApps = loadAllApplications();

    const mergedMap = new Map<string, Application>();
    cloudApps.forEach(ca => mergedMap.set(ca.id, ca));
    localApps.forEach(la => {
      if (!mergedMap.has(la.id)) {
        mergedMap.set(la.id, la);
        pushApplicationToSupabase(la);
      }
    });

    const merged = Array.from(mergedMap.values());
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(merged));
      broadcastStoreUpdate();
    } catch {}

    return merged;
  } catch (err) {
    console.warn('[SWAGAT] Cloud sync error:', err);
    return loadAllApplications();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Concurrency Control & Approval Locking Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function isAppLockedByOther(
  app: Application, 
  currentAdminId?: string
): { isLocked: boolean; lockedByName?: string; lockedAt?: string } {
  if (!app.lockedByAdminId) return { isLocked: false };
  if (currentAdminId && app.lockedByAdminId === currentAdminId) return { isLocked: false };
  if (!app.lockedAt) return { isLocked: false };

  const lockTime = new Date(app.lockedAt).getTime();
  if (isNaN(lockTime)) return { isLocked: false };
  const isExpired = Date.now() - lockTime > LOCK_EXPIRY_MS;
  if (isExpired) return { isLocked: false };

  return {
    isLocked: true,
    lockedByName: app.lockedByAdminName || 'Another Administrator',
    lockedAt: app.lockedAt,
  };
}

export async function claimApplicationLock(
  appId: string, 
  adminId: string, 
  adminName: string
): Promise<{ success: boolean; lockedByName?: string }> {
  const all = loadAllApplications();
  const app = all.find(a => a.id === appId);
  if (!app) return { success: false, lockedByName: 'Not Found' };

  const lockInfo = isAppLockedByOther(app, adminId);
  if (lockInfo.isLocked) {
    return { success: false, lockedByName: lockInfo.lockedByName };
  }

  const nowIso = new Date().toISOString();
  app.lockedByAdminId = adminId;
  app.lockedByAdminName = adminName;
  app.lockedAt = nowIso;
  saveAllApplications(all, false);

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('swagat_portal_applications')
        .update({
          locked_by_admin_id: adminId,
          locked_by_admin_name: adminName,
          locked_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', appId);
    } catch (e) {
      console.warn('[SWAGAT] Cloud lock claim error:', e);
    }
  }

  broadcastStoreUpdate();
  return { success: true };
}

export async function releaseApplicationLock(appId: string, adminId?: string): Promise<void> {
  const all = loadAllApplications();
  const app = all.find(a => a.id === appId);
  if (!app) return;

  if (adminId && app.lockedByAdminId && app.lockedByAdminId !== adminId) {
    return; // Don't release if locked by another admin unless adminId omitted for force release
  }

  app.lockedByAdminId = undefined;
  app.lockedByAdminName = undefined;
  app.lockedAt = undefined;
  saveAllApplications(all, false);

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('swagat_portal_applications')
        .update({
          locked_by_admin_id: null,
          locked_by_admin_name: null,
          locked_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appId);
    } catch (e) {
      console.warn('[SWAGAT] Cloud lock release error:', e);
    }
  }

  broadcastStoreUpdate();
}

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

/** Load all applications from localStorage. No demo data is seeded. */
export function loadAllApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: Application[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }

    // Purge any legacy demo records, test user accounts, or demo tracking numbers
    const DEMO_EMAILS = ['user@demo.com', 'admin@demo.com', 'rajesh@apexind.in', 'priya.mehta@startup.in'];
    const DEMO_TRACKINGS = ['SWG-2026-0001', 'SWG-2026-MH-78942'];
    const cleaned = parsed.filter(app => 
      !DEMO_EMAILS.includes(app.applicantEmail?.toLowerCase() || '') &&
      !DEMO_TRACKINGS.includes(app.trackingNumber || '') &&
      app.userId !== 'usr-demo-user'
    );

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORE_KEY, JSON.stringify(cleaned));
    }

    return cleaned.map(app => ({
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
    return [];
  }
}

/** Persist the full application list to localStorage, Supabase cloud, and broadcast. */
export function saveAllApplications(applications: Application[], syncCloud = true): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(applications));
    broadcastStoreUpdate();
  } catch {
    console.warn('[SWAGAT] applicationStore: could not persist to localStorage.');
  }

  if (syncCloud && isSupabaseConfigured()) {
    applications.forEach(app => {
      pushApplicationToSupabase(app);
    });
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

// ─────────────────────────────────────────────────────────────────────────────
// Real-time Cloud Synchronization Listener
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  setTimeout(() => {
    // Initial fetch from cloud
    syncApplicationsFromCloud();

    // Supabase Realtime channel
    try {
      if (isSupabaseConfigured()) {
        supabase
          .channel('swagat_portal_live_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'swagat_portal_applications' },
            (payload) => {
              if (payload.new) {
                const app = mapDbRowToApplication(payload.new);
                const all = loadAllApplications();
                const idx = all.findIndex(a => a.id === app.id);
                if (idx >= 0) {
                  all[idx] = app;
                } else {
                  all.unshift(app);
                }
                try {
                  localStorage.setItem(STORE_KEY, JSON.stringify(all));
                  broadcastStoreUpdate();
                } catch {}
              }
            }
          )
          .subscribe();
      }
    } catch (e) {
      console.warn('[SWAGAT] Realtime subscription init warning:', e);
    }

    // Interval polling sync (every 5 seconds) to ensure all devices stay in sync
    setInterval(() => {
      syncApplicationsFromCloud();
    }, 5000);
  }, 300);
}

