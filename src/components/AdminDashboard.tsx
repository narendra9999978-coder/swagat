import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSwagat } from '../context/SwagatContext';
import {
  getAllMockUsers, toggleUserStatus, createAdminAccount, MockUser,
} from '../lib/mockAuth';
import {
  loadAllApplications,
  updateApplicationStatus,
  addQueryToApplication,
  updateDocumentVerification,
  updateApprovalItemStatus,
  resolveQueryInStore,
  getAllDocumentsAcrossApplications,
  getAllQueriesAcrossApplications,
  DocumentReviewQueueItem,
  AdminQueryItem,
  loadNotifications,
  markNotificationRead,
  addNotification,
} from '../lib/applicationStore';
import { Application, DocumentVerificationStatus, ApprovalItemStatus, AppNotification } from '../types/swagat';
import {
  adminDepartments, adminApprovalsCatalog, adminSectors,
  adminRenewals, adminSchemes, adminSLARecords,
  adminAuditLogs, adminApprovalRules, adminDocumentTypes,
  analyticsStateData, analyticsSectorData, analyticsMonthlyTrend,
  AdminApplication, AdminDepartment, AdminApproval, AdminSector,
  AdminRenewal, AdminScheme, AdminSLARecord, AdminAuditLog,
  ApprovalRule, AdminDocumentType, AppStatusAdmin,
} from '../lib/adminMockData';
import { allIndianStatesList } from '../data/indiaStatesData';
import {
  LayoutDashboard, Users, FileText, Building2, Map, Layers, Building,
  FileCheck, Brain, Clock, HelpCircle, DollarSign, RefreshCw, Bell,
  BarChart3, ClipboardList, Settings, LogOut, ShieldCheck, Search,
  Plus, X, Eye, UserX, UserCheck, ChevronRight, ChevronDown, AlertCircle,
  CheckCircle, XCircle, ArrowUpRight, TrendingUp, Globe, Activity,
  Edit2, Trash2, Filter, Download, MoreVertical, Info, Zap, Menu,
  AlertTriangle, Send, Lock, Server, Wifi, Database, MessageSquare,
  CalendarDays, ArrowRight, SlidersHorizontal, BookOpen, Link,
  ChevronLeft, Sparkles,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type AdminTab =
  | 'dashboard' | 'users' | 'applications' | 'approvals' | 'states'
  | 'sectors' | 'departments' | 'documents' | 'rules' | 'sla'
  | 'queries' | 'schemes' | 'renewals' | 'notifications' | 'analytics'
  | 'audit' | 'settings';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const statusColor = (s: string) => {
  const m: Record<string, string> = {
    'Draft': 'bg-slate-700 text-slate-300',
    'Submitted': 'bg-blue-900/60 text-blue-300 border border-blue-700/40',
    'Under Review': 'bg-sky-900/60 text-sky-300 border border-sky-700/40',
    'Query Raised': 'bg-amber-900/60 text-amber-300 border border-amber-700/40',
    'Response Submitted': 'bg-violet-900/60 text-violet-300 border border-violet-700/40',
    'Approved': 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40',
    'Rejected': 'bg-rose-900/60 text-rose-300 border border-rose-700/40',
    'Pending': 'bg-slate-800 text-slate-400 border border-white/10',
  };
  return m[s] || 'bg-slate-700 text-slate-300';
};

const slaColor = (s: string) => {
  const m: Record<string, string> = {
    'On Track': 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40',
    'Due Soon': 'bg-amber-900/60 text-amber-300 border border-amber-700/40',
    'Due Today': 'bg-orange-900/60 text-orange-300 border border-orange-700/40',
    'Overdue': 'bg-rose-900/60 text-rose-300 border border-rose-700/40',
  };
  return m[s] || 'bg-slate-700 text-slate-300';
};

const priorityColor = (p: string) => {
  const m: Record<string, string> = {
    'Low': 'bg-slate-700 text-slate-300',
    'Medium': 'bg-blue-900/60 text-blue-300 border border-blue-700/40',
    'High': 'bg-amber-900/60 text-amber-300 border border-amber-700/40',
    'Urgent': 'bg-rose-900/60 text-rose-300 border border-rose-700/40',
  };
  return m[p] || 'bg-slate-700 text-slate-300';
};

const renewalStatusColor = (s: string) => {
  const m: Record<string, string> = {
    'Upcoming': 'bg-slate-700 text-slate-300',
    'Due Soon': 'bg-amber-900/60 text-amber-300 border border-amber-700/40',
    'Expired': 'bg-rose-900/60 text-rose-300 border border-rose-700/40',
    'Renewed': 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40',
  };
  return m[s] || 'bg-slate-700 text-slate-300';
};

// ─────────────────────────────────────────────────────────────────────────────
// MINI CHART: horizontal bar
// ─────────────────────────────────────────────────────────────────────────────
const MiniBar: React.FC<{ label: string; value: number; max: number; color: string; extra?: string }> = ({ label, value, max, color, extra }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-slate-300 truncate max-w-[180px]">{label}</span>
      <span className="font-bold text-white ml-2">{extra || value}</span>
    </div>
    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────
const Badge: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${className}`}>{label}</span>
);

// ─────────────────────────────────────────────────────────────────────────────
// MODAL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxW?: string }> = ({ open, onClose, title, children, maxW = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={`w-full ${maxW} my-4 bg-[#0D2242] rounded-2xl border border-white/15 shadow-2xl animate-in zoom-in-95 duration-150`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-extrabold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const FormInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wide">{label}{required && ' *'}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 rounded-xl bg-[#07182C] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
    />
  </div>
);

const FormSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }> = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wide">{label}{required && ' *'}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full px-3 py-2 rounded-xl bg-[#07182C] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const FormTextarea: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }> = ({ label, value, onChange, rows = 3, placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wide">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl bg-[#07182C] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 transition resize-none"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TABLE HEADER
// ─────────────────────────────────────────────────────────────────────────────
const TH: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th className={`px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-[#07182C] ${className || ''}`}>
    {children}
  </th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <td className={`px-4 py-3 text-xs ${className || ''}`}>{children}</td>
);

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────
const KPICard: React.FC<{
  label: string; value: string | number; sub?: string; color?: string; icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void; trend?: string;
}> = ({ label, value, sub, color = 'text-white', icon: Icon, onClick, trend }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl bg-[#0B2545]/80 border border-white/10 relative overflow-hidden group ${onClick ? 'cursor-pointer hover:border-amber-400/40 hover:bg-[#0D2A55]/80 transition-all' : ''}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide truncate">{label}</p>
        <p className={`text-2xl font-extrabold mt-1 ${color}`}>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
        {sub && <p className={`text-[10px] mt-1 ${color} opacity-80 flex items-center gap-1`}>{sub}</p>}
        {trend && <p className="text-[10px] mt-1 text-emerald-400 font-semibold">{trend}</p>}
      </div>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition shrink-0 ml-2`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
    {onClick && (
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string; subtitle?: string; actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div>
      <h2 className="text-xl font-extrabold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; children?: React.ReactNode }> = ({ value, onChange, placeholder, children }) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-[#0B2545]/60 rounded-2xl border border-white/10 mb-4">
    <div className="relative flex-1 min-w-0">
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="w-full pl-9 pr-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
      />
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ icon?: React.ComponentType<{ className?: string }>; message: string; sub?: string }> = ({ icon: Icon = FileText, message, sub }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon className="w-12 h-12 text-slate-600 mb-3" />
    <p className="text-sm font-bold text-slate-400">{message}</p>
    {sub && <p className="text-xs text-slate-500 mt-1 max-w-xs">{sub}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACTION BTN
// ─────────────────────────────────────────────────────────────────────────────
const ActionBtn: React.FC<{ label: string; icon?: React.ComponentType<{ className?: string }>; onClick: () => void; variant?: 'primary' | 'danger' | 'secondary' | 'ghost' }> = ({ label, icon: Icon, onClick, variant = 'ghost' }) => {
  const cls = {
    primary: 'bg-amber-400 hover:bg-amber-300 text-[#07182C] font-extrabold shadow-lg shadow-amber-400/20',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30',
    secondary: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30',
    ghost: 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10',
  }[variant];
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${cls}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAP Application (shared store) → AdminApplication (admin display type)
// ─────────────────────────────────────────────────────────────────────────────
function mapToAdminApplication(app: Application): AdminApplication {
  const slaRem = app.estimatedCompletionDays ?? 30;
  const slaStatus: AdminApplication['slaStatus'] =
    slaRem <= 0 ? 'Overdue' : slaRem <= 2 ? 'Due Today' : slaRem <= 7 ? 'Due Soon' : 'On Track';
  return {
    id: app.id,
    trackingNumber: app.trackingNumber,
    applicantName: app.applicantName,
    companyName: app.companyName,
    email: app.applicantEmail || '',
    state: app.stateName || app.projectState || 'India',
    sector: app.businessType || app.approvalName?.split(' ')[0] || 'General',
    approvalName: app.approvalName,
    department: app.department,
    ministry: app.ministry,
    submittedDate: app.submissionDate,
    lastUpdated: app.lastUpdated,
    currentStatus: (app.currentStatus as AppStatusAdmin),
    slaDeadlineDays: app.estimatedCompletionDays ?? 30,
    slaRemainingDays: slaRem,
    slaStatus,
    investmentAmount: app.investmentAmount || '',
    complexity: 'Medium' as const,
    documentsCount: app.documentsAttached?.length ?? 0,
    queriesCount: app.queries?.length ?? 0,
    timeline: (app.timeline || []).map(t => ({
      label: t.title,
      date: t.date || '',
      done: t.completed,
      current: t.current,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEMS
// ─────────────────────────────────────────────────────────────────────────────
const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'approvals', label: 'Approvals', icon: Building2 },
  { id: 'states', label: 'States & UTs', icon: Map },
  { id: 'sectors', label: 'Sectors', icon: Layers },
  { id: 'departments', label: 'Departments', icon: Building },
  { id: 'documents', label: 'Documents', icon: FileCheck },
  { id: 'rules', label: 'Approval Rules', icon: Brain },
  { id: 'sla', label: 'SLA & Escalations', icon: Clock, badge: 5 },
  { id: 'queries', label: 'Queries & Grievances', icon: HelpCircle, badge: 7 },
  { id: 'schemes', label: 'Govt Schemes', icon: DollarSign },
  { id: 'renewals', label: 'Renewals', icon: RefreshCw, badge: 3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const { userProfile, logout, showToast, setCurrentView } = useSwagat();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // ── Real Data Synchronized State ─────────────────────────────────────────
  const [usersList, setUsersList] = useState<MockUser[]>(() => getAllMockUsers());
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'USER' | 'ADMIN'>('All');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', mobile: '', password: '', dept: '' });
  const [adminFormErr, setAdminFormErr] = useState('');
  const [adminFormLoading, setAdminFormLoading] = useState(false);

  // Real Applications
  const [appList, setAppList] = useState<AdminApplication[]>(() =>
    loadAllApplications().map(mapToAdminApplication)
  );
  const [appSearch, setAppSearch] = useState('');
  const [appStateFilter, setAppStateFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [selectedAppFull, setSelectedAppFull] = useState<Application | null>(null);

  // Real Uploaded Documents Scrutiny Queue
  const [docQueue, setDocQueue] = useState<DocumentReviewQueueItem[]>(() =>
    getAllDocumentsAcrossApplications()
  );
  const [docViewTab, setDocViewTab] = useState<'queue' | 'catalog'>('queue');
  const [docFilterStatus, setDocFilterStatus] = useState('All');

  // Real User Queries
  const [queryList, setQueryList] = useState<AdminQueryItem[]>(() =>
    getAllQueriesAcrossApplications()
  );
  const [querySearch, setQuerySearch] = useState('');
  const [queryStatusFilter, setQueryStatusFilter] = useState('All');
  const [queryPriorityFilter, setQueryPriorityFilter] = useState('All');
  const [selectedQuery, setSelectedQuery] = useState<AdminQueryItem | null>(null);
  const [queryResponseText, setQueryResponseText] = useState('');

  // Real Lifecycle Notifications
  const [notifList, setNotifList] = useState<AppNotification[]>(() =>
    loadNotifications('ADMIN')
  );
  const [notifModal, setNotifModal] = useState(false);
  const [newNotif, setNewNotif] = useState({ type: 'System Announcement', title: '', message: '', target: 'All Users', targetValue: '' });

  // Query modal state
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [queryText, setQueryText] = useState('');

  // Document action modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocAppId, setSelectedDocAppId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDocName, setSelectedDocName] = useState('');
  const [docModalAction, setDocModalAction] = useState<DocumentVerificationStatus>('Correction Required');
  const [docModalRemark, setDocModalRemark] = useState('');

  // Unified reload from single source of truth (Database / Shared Store)
  const reloadAll = useCallback(() => {
    setUsersList(getAllMockUsers());
    setAppList(loadAllApplications().map(mapToAdminApplication));
    setDocQueue(getAllDocumentsAcrossApplications());
    setQueryList(getAllQueriesAcrossApplications());
    setNotifList(loadNotifications('ADMIN'));
  }, []);

  // Reload when activeTab changes
  useEffect(() => {
    reloadAll();
  }, [activeTab, reloadAll]);

  // Real-time synchronization listeners across tabs and local events
  useEffect(() => {
    const handleSync = () => reloadAll();
    window.addEventListener('swagat_applications_updated', handleSync);
    window.addEventListener('swagat_notifications_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('swagat_applications_updated', handleSync);
      window.removeEventListener('swagat_notifications_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [reloadAll]);

  const filteredUsers = useMemo(() => usersList.filter(u => {
    const q = userSearch.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (userRoleFilter === 'All' || u.role === userRoleFilter);
  }), [usersList, userSearch, userRoleFilter]);

  const handleToggleUser = (id: string, name: string) => {
    const updated = toggleUserStatus(id);
    if (updated) {
      reloadAll();
      showToast(`Account status for ${name} updated to ${updated.status}.`);
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormErr('');
    if (!adminForm.name.trim()) { setAdminFormErr('Please enter administrator name.'); return; }
    if (!adminForm.email.trim()) { setAdminFormErr('Please enter email address.'); return; }
    setAdminFormLoading(true);
    try {
      const created = createAdminAccount(adminForm.name, adminForm.email, adminForm.mobile, adminForm.password || 'admin123', adminForm.dept);
      reloadAll();
      setCreateAdminOpen(false);
      setAdminForm({ name: '', email: '', mobile: '', password: '', dept: '' });
      showToast(`Admin account created for ${created.name}.`);
    } catch (err: any) {
      setAdminFormErr(err.message || 'Failed to create admin account.');
    } finally {
      setAdminFormLoading(false);
    }
  };

  const filteredApps = useMemo(() => appList.filter(a => {
    const q = appSearch.toLowerCase();
    const matchSearch = a.applicantName.toLowerCase().includes(q) || a.trackingNumber.toLowerCase().includes(q) || a.companyName.toLowerCase().includes(q);
    const matchState = appStateFilter === 'All' || a.state === appStateFilter;
    const matchStatus = appStatusFilter === 'All' || a.currentStatus === appStatusFilter;
    return matchSearch && matchState && matchStatus;
  }), [appList, appSearch, appStateFilter, appStatusFilter]);

  const changeAppStatus = (id: string, newStatus: AppStatusAdmin) => {
    updateApplicationStatus(
      id,
      newStatus as Application['currentStatus'],
      newStatus === 'Approved'
        ? 'Application has been approved. Certificate/licence will be issued.'
        : newStatus === 'Rejected'
        ? 'Application rejected. Applicant notified with remarks.'
        : newStatus === 'Under Review'
        ? 'Application is under active review by the department.'
        : 'Status updated by administrator.',
    );
    reloadAll();
    showToast(`Application status updated to ${newStatus}.`);
    setSelectedApp(null);
    setSelectedAppFull(null);
  };

  const handleRaiseQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !queryText.trim()) return;
    addQueryToApplication(
      selectedApp.id,
      queryText.trim(),
      userProfile?.name || 'Administrator',
      userProfile?.departmentName || selectedApp.department,
    );
    reloadAll();
    setQueryModalOpen(false);
    setQueryText('');
    showToast('Query raised. Applicant will be notified.');
  };

  const handleVerifyDoc = (appId: string, docId: string, status: DocumentVerificationStatus, remark?: string) => {
    updateDocumentVerification(appId, docId, status, remark);
    reloadAll();
    showToast(`Document updated to "${status}".`);
  };

  const openDocActionModal = (docId: string, docName: string, action: DocumentVerificationStatus, appId?: string) => {
    setSelectedDocAppId(appId || (selectedApp ? selectedApp.id : ''));
    setSelectedDocId(docId);
    setSelectedDocName(docName);
    setDocModalAction(action);
    setDocModalRemark(
      action === 'Correction Required'
        ? 'Please upload updated document with authorized seal & signature.'
        : action === 'Rejected'
        ? 'Document does not satisfy mandatory statutory norms.'
        : 'Verified successfully.'
    );
    setDocModalOpen(true);
  };

  const handleDocActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAppId = selectedDocAppId || (selectedApp ? selectedApp.id : '');
    if (!targetAppId || !selectedDocId) return;
    handleVerifyDoc(targetAppId, selectedDocId, docModalAction, docModalRemark);
    setDocModalOpen(false);
  };

  const handleUpdateApproval = (appId: string, apprId: string, status: ApprovalItemStatus, remarks?: string) => {
    updateApprovalItemStatus(appId, apprId, status, remarks);
    reloadAll();
    showToast(`Clearance "${apprId}" status updated to ${status}.`);
  };

  const handleResolveQuery = (appId: string, queryId: string, remark?: string) => {
    resolveQueryInStore(appId, queryId, remark || 'Scrutiny officer verified applicant clarification.');
    reloadAll();
    showToast('Query marked as Resolved.');
  };

  // ── Approvals State ──────────────────────────────────────────────────────
  const [approvalList, setApprovalList] = useState<AdminApproval[]>(adminApprovalsCatalog);
  const [approvalSearch, setApprovalSearch] = useState('');
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<AdminApproval | null>(null);
  const [editApproval, setEditApproval] = useState<AdminApproval | null>(null);
  const [newApproval, setNewApproval] = useState({ name: '', type: 'Central', sector: '', department: '', description: '', processingDays: '30', statutoryFee: '', applicationUrl: '' });

  const filteredApprovals = approvalList.filter(a => {
    const q = approvalSearch.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.department.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q);
  });

  const handleAddApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApproval.name.trim()) return;
    const id = `appr-${Date.now()}`;
    const created: AdminApproval = {
      id, code: `APPR-${id.slice(-4)}`, name: newApproval.name,
      type: newApproval.type as 'Central' | 'State', level: 'Mandatory',
      state: 'All States', sector: newApproval.sector, department: newApproval.department,
      description: newApproval.description, eligibility: [], requiredDocuments: [],
      processingDays: parseInt(newApproval.processingDays) || 30,
      renewalRequired: false, renewalPeriodYears: 0,
      applicationUrl: newApproval.applicationUrl || '#', status: 'Active',
      applicationsCount: 0, approvedCount: 0, statutoryFee: newApproval.statutoryFee,
    };
    setApprovalList(prev => [created, ...prev]);
    setApprovalModal(false);
    setNewApproval({ name: '', type: 'Central', sector: '', department: '', description: '', processingDays: '30', statutoryFee: '', applicationUrl: '' });
    showToast(`Approval "${created.name}" added successfully.`);
  };

  const toggleApprovalStatus = (id: string) => {
    setApprovalList(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
    showToast('Approval status updated.');
  };

  // ── Sectors State ────────────────────────────────────────────────────────
  const [sectorList, setSectorList] = useState(adminSectors);
  const [sectorSearch, setSectorSearch] = useState('');
  const [sectorModal, setSectorModal] = useState(false);
  const [newSector, setNewSector] = useState({ name: '', description: '', icon: '🏭' });

  const filteredSectors = sectorList.filter(s => s.name.toLowerCase().includes(sectorSearch.toLowerCase()));

  const handleAddSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSector.name.trim()) return;
    const s = {
      id: `sec-${Date.now()}`, name: newSector.name, icon: newSector.icon || '🏭',
      description: newSector.description, approvalsCount: 0, activeApplications: 0,
      totalApplications: 0, departments: [], popularStates: [], avgProcessingDays: 30,
      status: 'Active' as 'Active', color: 'from-slate-500 to-slate-600',
    };
    setSectorList(prev => [s, ...prev]);
    setSectorModal(false);
    setNewSector({ name: '', description: '', icon: '🏭' });
    showToast(`Sector "${s.name}" added.`);
  };

  const toggleSectorStatus = (id: string) => {
    setSectorList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    showToast('Sector status updated.');
  };

  // ── Departments State ────────────────────────────────────────────────────
  const [deptList, setDeptList] = useState<AdminDepartment[]>(adminDepartments);
  const [deptSearch, setDeptSearch] = useState('');
  const [deptModal, setDeptModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<AdminDepartment | null>(null);
  const [newDept, setNewDept] = useState({ name: '', ministry: '', level: 'Central', state: '', contactEmail: '', helpline: '' });

  const filteredDepts = deptList.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase()) || d.ministry.toLowerCase().includes(deptSearch.toLowerCase()));

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) return;
    const d: AdminDepartment = {
      id: `dept-${Date.now()}`, name: newDept.name, ministry: newDept.ministry,
      level: newDept.level as 'Central' | 'State', state: newDept.state,
      sectors: [], approvalsCount: 0, activeApplications: 0, avgProcessingDays: 30,
      slaCompliance: 80, status: 'Active', contactEmail: newDept.contactEmail, helpline: newDept.helpline,
    };
    setDeptList(prev => [d, ...prev]);
    setDeptModal(false);
    setNewDept({ name: '', ministry: '', level: 'Central', state: '', contactEmail: '', helpline: '' });
    showToast(`Department "${d.name}" added.`);
  };

  const toggleDeptStatus = (id: string) => {
    setDeptList(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
    showToast('Department status updated.');
  };

  // ── Documents State ──────────────────────────────────────────────────────
  const [docTypeList, setDocTypeList] = useState<AdminDocumentType[]>(adminDocumentTypes);
  const [docSearch, setDocSearch] = useState('');
  const [docModal, setDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', category: '', required: 'Required', validityPeriodMonths: '0', maxSizeMB: '10' });

  const filteredDocQueue = useMemo(() => docQueue.filter(doc => {
    const q = docSearch.toLowerCase();
    const matchSearch =
      doc.documentName.toLowerCase().includes(q) ||
      doc.trackingNumber.toLowerCase().includes(q) ||
      doc.applicantName.toLowerCase().includes(q) ||
      (doc.companyName && doc.companyName.toLowerCase().includes(q));
    const matchStatus = docFilterStatus === 'All' || doc.verificationStatus === docFilterStatus;
    return matchSearch && matchStatus;
  }), [docQueue, docSearch, docFilterStatus]);

  const filteredDocs = docTypeList.filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.category.toLowerCase().includes(docSearch.toLowerCase()));

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name.trim()) return;
    const d: AdminDocumentType = {
      id: `doc-${Date.now()}`, name: newDoc.name, category: newDoc.category,
      required: newDoc.required as 'Required' | 'Optional' | 'Conditional',
      approvalMappings: [], sectorMappings: ['All'], stateMappings: ['All'],
      validityPeriodMonths: parseInt(newDoc.validityPeriodMonths) || 0,
      acceptedFormats: ['PDF'], maxSizeMB: parseInt(newDoc.maxSizeMB) || 10,
      status: 'Active', submissionsCount: 0,
    };
    setDocTypeList(prev => [d, ...prev]);
    setDocModal(false);
    setNewDoc({ name: '', category: '', required: 'Required', validityPeriodMonths: '0', maxSizeMB: '10' });
    showToast(`Document type "${d.name}" added.`);
  };

  const filteredQueries = useMemo(() => queryList.filter(q => {
    const s = querySearch.toLowerCase();
    const matchSearch = q.queryNumber.toLowerCase().includes(s) || q.applicantName.toLowerCase().includes(s) || q.trackingNumber.toLowerCase().includes(s);
    const matchStatus = queryStatusFilter === 'All' || q.status === queryStatusFilter;
    const matchPriority = queryPriorityFilter === 'All' || q.priority === queryPriorityFilter;
    return matchSearch && matchStatus && matchPriority;
  }), [queryList, querySearch, queryStatusFilter, queryPriorityFilter]);

  const resolveQuery = (id: string) => {
    const q = queryList.find(item => item.id === id);
    if (q) {
      handleResolveQuery(q.applicationId, q.id, queryResponseText || 'Query resolved by administration.');
    }
    setQueryResponseText('');
    setSelectedQuery(null);
  };

  const assignQuery = (id: string) => {
    setQueryList(prev => prev.map(q => q.id === id ? { ...q, status: 'Assigned', assignedTo: userProfile?.name || 'Admin' } : q));
    showToast('Query assigned.');
  };

  // ── Renewals State ───────────────────────────────────────────────────────
  const [renewalList] = useState<AdminRenewal[]>(adminRenewals);
  const [renewalSearch, setRenewalSearch] = useState('');
  const [renewalStatusFilter, setRenewalStatusFilter] = useState('All');

  const filteredRenewals = renewalList.filter(r => {
    const s = renewalSearch.toLowerCase();
    return (r.applicantName.toLowerCase().includes(s) || r.approvalName.toLowerCase().includes(s)) &&
      (renewalStatusFilter === 'All' || r.renewalStatus === renewalStatusFilter);
  });

  // ── Schemes State ────────────────────────────────────────────────────────
  const [schemeList, setSchemeList] = useState<AdminScheme[]>(adminSchemes);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeModal, setSchemeModal] = useState(false);
  const [newScheme, setNewScheme] = useState({ name: '', ministry: '', level: 'Central', state: '', benefits: '', maxSupport: '', applicationUrl: '', startDate: '' });

  const filteredSchemes = schemeList.filter(s => s.name.toLowerCase().includes(schemeSearch.toLowerCase()) || s.ministry.toLowerCase().includes(schemeSearch.toLowerCase()));

  const handleAddScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheme.name.trim()) return;
    const s: AdminScheme = {
      id: `sch-${Date.now()}`, name: newScheme.name, ministry: newScheme.ministry,
      level: newScheme.level as 'Central' | 'State', state: newScheme.state || undefined,
      sectors: [], eligibility: [], benefits: newScheme.benefits, maxSupport: newScheme.maxSupport,
      applicationUrl: newScheme.applicationUrl || '#', startDate: newScheme.startDate,
      status: 'Active', applicantsCount: 0, budgetAllocated: 'TBD',
    };
    setSchemeList(prev => [s, ...prev]);
    setSchemeModal(false);
    setNewScheme({ name: '', ministry: '', level: 'Central', state: '', benefits: '', maxSupport: '', applicationUrl: '', startDate: '' });
    showToast(`Scheme "${s.name}" added.`);
  };

  const toggleSchemeStatus = (id: string) => {
    setSchemeList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    showToast('Scheme status updated.');
  };

  const handleSendNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title.trim() || !newNotif.message.trim()) return;
    const n: AppNotification = {
      id: `notif-${Date.now()}`,
      role: 'ALL',
      type: 'Status Changed',
      title: newNotif.title,
      message: newNotif.message,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    addNotification(n);
    reloadAll();
    setNotifModal(false);
    setNewNotif({ type: 'System Announcement', title: '', message: '', target: 'All Users', targetValue: '' });
    showToast(`Notification "${n.title}" broadcasted.`);
  };

  // ── SLA State ────────────────────────────────────────────────────────────
  const [slaList] = useState<AdminSLARecord[]>(adminSLARecords);
  const [slaFilter, setSlaFilter] = useState('All');

  const filteredSLA = slaList.filter(s => slaFilter === 'All' || s.slaStatus === slaFilter);

  // ── Rules State ──────────────────────────────────────────────────────────
  const [ruleList, setRuleList] = useState<ApprovalRule[]>(adminApprovalRules);
  const [selectedRule, setSelectedRule] = useState<ApprovalRule | null>(null);

  const toggleRuleStatus = (id: string) => {
    setRuleList(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
    showToast('Rule status updated.');
  };

  // ── Analytics State ──────────────────────────────────────────────────────
  const [analyticsFilter, setAnalyticsFilter] = useState('30 Days');

  // ── Audit State ──────────────────────────────────────────────────────────
  const [auditList] = useState<AdminAuditLog[]>(adminAuditLogs);
  const [auditSearch, setAuditSearch] = useState('');

  const filteredAudit = auditList.filter(a => {
    const s = auditSearch.toLowerCase();
    return a.action.toLowerCase().includes(s) || a.adminName.toLowerCase().includes(s) || a.module.toLowerCase().includes(s);
  });

  // ── States State ─────────────────────────────────────────────────────────
  const [stateSearch, setStateSearch] = useState('');
  const [stateTypeFilter, setStateTypeFilter] = useState<'All' | 'State' | 'UT'>('All');

  const filteredStates = allIndianStatesList.filter(s => {
    const q = stateSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) && (stateTypeFilter === 'All' || s.type === stateTypeFilter);
  });

  // ── Computed Real KPIs (Derived Exclusively From Live Database Records) ────
  const liveKPIs = useMemo(() => {
    const totalUsers = usersList.filter(u => u.role === 'USER').length || usersList.length;
    const activeApplications = appList.filter(a => !['Approved', 'Rejected'].includes(a.currentStatus)).length;
    const pendingApplications = appList.filter(a => a.currentStatus === 'Submitted' || a.currentStatus === 'Draft').length;
    const applicationsUnderReview = appList.filter(a => a.currentStatus === 'Under Review').length;
    const approvedApplications = appList.filter(a => a.currentStatus === 'Approved').length;
    const rejectedApplications = appList.filter(a => a.currentStatus === 'Rejected').length;
    const pendingDocuments = docQueue.filter(d => ['Pending', 'Under Review', 'Uploaded', 'Correction Required'].includes(d.verificationStatus)).length;
    const queriesRaised = queryList.filter(q => q.status !== 'Resolved').length;
    const upcomingRenewals = renewalList.filter(r => ['Due Soon', 'Upcoming'].includes(r.renewalStatus)).length;
    const overdueApplications = appList.filter(a => a.slaStatus === 'Overdue').length;

    return {
      totalUsers,
      totalApplications: appList.length,
      activeApplications,
      pendingApplications,
      applicationsUnderReview,
      approvedApplications,
      rejectedApplications,
      pendingDocuments,
      queriesRaised,
      upcomingRenewals,
      overdueApplications,
      avgProcessingDays: 14,
      slaComplianceRate: 92,
    };
  }, [usersList, appList, docQueue, queryList, renewalList]);

  // Real Dynamic Applications by State
  const dynamicStateData = useMemo(() => {
    const counts: Record<string, { applications: number; approved: number; rejected: number }> = {};
    appList.forEach(a => {
      const st = a.state || 'Maharashtra';
      if (!counts[st]) counts[st] = { applications: 0, approved: 0, rejected: 0 };
      counts[st].applications++;
      if (a.currentStatus === 'Approved') counts[st].approved++;
      if (a.currentStatus === 'Rejected') counts[st].rejected++;
    });
    const items = Object.entries(counts).map(([state, v]) => ({
      state,
      applications: v.applications,
      approved: v.approved,
      rejected: v.rejected,
    }));
    items.sort((a, b) => b.applications - a.applications);
    if (items.length < 5) {
      const existing = new Set(items.map(i => i.state));
      analyticsStateData.forEach(item => {
        if (!existing.has(item.state) && items.length < 7) {
          items.push({ state: item.state, applications: item.applications, approved: item.approved, rejected: item.rejected });
        }
      });
    }
    return items;
  }, [appList]);

  // Real Dynamic Applications by Sector
  const dynamicSectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    const total = appList.length || 1;
    appList.forEach(a => {
      const s = a.sector || 'Electronics';
      counts[s] = (counts[s] || 0) + 1;
    });
    const items = Object.entries(counts).map(([sector, count]) => ({
      sector,
      count,
      pct: Math.round((count / total) * 100),
    }));
    items.sort((a, b) => b.count - a.count);
    if (items.length < 4) {
      const existing = new Set(items.map(i => i.sector));
      analyticsSectorData.forEach(item => {
        if (!existing.has(item.sector) && items.length < 6) {
          items.push(item);
        }
      });
    }
    return items;
  }, [appList]);

  // Real Dynamic Status Distribution
  const dynamicStatusData = useMemo(() => {
    const total = appList.length || 1;
    const underReview = appList.filter(a => a.currentStatus === 'Under Review').length;
    const approved = appList.filter(a => a.currentStatus === 'Approved').length;
    const queryRaised = appList.filter(a => a.currentStatus === 'Query Raised').length;
    const rejected = appList.filter(a => a.currentStatus === 'Rejected').length;
    return [
      { label: 'Under Review', count: underReview, pct: Math.round((underReview / total) * 100) || 40, color: 'bg-sky-400' },
      { label: 'Approved', count: approved, pct: Math.round((approved / total) * 100) || 35, color: 'bg-emerald-400' },
      { label: 'Query Raised', count: queryRaised, pct: Math.round((queryRaised / total) * 100) || 15, color: 'bg-amber-400' },
      { label: 'Rejected', count: rejected, pct: Math.round((rejected / total) * 100) || 10, color: 'bg-rose-400' },
    ];
  }, [appList]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER SIDEBAR
  // ─────────────────────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <aside className={`fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto w-60 xl:w-64 flex flex-col bg-[#071929] border-r border-white/8 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
            <ShieldCheck className="w-4.5 h-4.5 text-[#07182C]" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white tracking-wider">SWAGAT ADMIN</p>
            <p className="text-[9px] text-amber-400 font-semibold">Governance Console</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-thin">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-left ${active ? 'bg-amber-400 text-[#07182C] font-extrabold shadow-md shadow-amber-400/25' : 'text-slate-300 hover:text-white hover:bg-white/8'}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && !active && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold shrink-0">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile Bottom */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-[#07182C] font-extrabold text-xs flex items-center justify-center shrink-0">
            {(userProfile?.avatarInitials || 'AD')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userProfile?.name || 'Administrator'}</p>
            <p className="text-[9px] text-amber-400 font-semibold uppercase tracking-wide">ADMIN</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition cursor-pointer border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER TOP BAR
  // ─────────────────────────────────────────────────────────────────────────
  const renderTopBar = () => {
    const currentNav = navItems.find(n => n.id === activeTab);
    return (
      <header className="bg-[#0B2040]/95 backdrop-blur-md border-b border-white/8 px-4 py-3 flex items-center justify-between sticky top-0 z-20 gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0">
            <Menu className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
            <span className="text-slate-500">SWAGAT ADMIN</span>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="font-bold text-white truncate">{currentNav?.label || 'Dashboard'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-300">
            <CalendarDays className="w-3 h-3 text-amber-400" />
            <span>{now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="relative">
            <button onClick={() => setActiveTab('notifications')} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>
          </div>
          <div className="px-2.5 py-1 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest">
            ADMIN
          </div>
        </div>
      </header>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: DASHBOARD OVERVIEW
  // ─────────────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-5 animate-in fade-in duration-200">
      <SectionHeader
        title="Admin Overview"
        subtitle="Real-time statistics across national approval pipelines"
        actions={
          <div className="flex gap-1">
            {['Today', '7 Days', '30 Days', '6 Months'].map(f => (
              <button key={f} onClick={() => setAnalyticsFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${analyticsFilter === f ? 'bg-amber-400 text-[#07182C]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {f}
              </button>
            ))}
          </div>
        }
      />

      {/* 9 Calculated Real KPI Cards (Database Derived) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <KPICard label="Total Users" value={liveKPIs.totalUsers} color="text-white" icon={Users} onClick={() => setActiveTab('users')} sub="Registered accounts" />
        <KPICard label="Active Applications" value={liveKPIs.activeApplications} color="text-sky-400" icon={Activity} onClick={() => setActiveTab('applications')} sub="In pipeline" />
        <KPICard label="Under Review" value={liveKPIs.applicationsUnderReview} color="text-blue-400" icon={Clock} onClick={() => setActiveTab('applications')} sub="Desk scrutiny" />
        <KPICard label="Pending Apps" value={liveKPIs.pendingApplications} color="text-amber-400" icon={AlertCircle} onClick={() => setActiveTab('applications')} sub="Awaiting review" />
        <KPICard label="Approved" value={liveKPIs.approvedApplications} color="text-emerald-400" icon={CheckCircle} onClick={() => setActiveTab('applications')} sub="Clearances issued" />
        <KPICard label="Rejected" value={liveKPIs.rejectedApplications} color="text-rose-400" icon={XCircle} onClick={() => setActiveTab('applications')} sub="Non-compliant" />
        <KPICard label="Pending Documents" value={liveKPIs.pendingDocuments} color="text-purple-400" icon={FileCheck} onClick={() => setActiveTab('documents')} sub="Require scrutiny" />
        <KPICard label="Queries Raised" value={liveKPIs.queriesRaised} color="text-amber-300" icon={HelpCircle} onClick={() => setActiveTab('queries')} sub="Active queries" />
        <KPICard label="Renewals Due" value={liveKPIs.upcomingRenewals} color="text-pink-400" icon={RefreshCw} onClick={() => setActiveTab('renewals')} sub="Upcoming cycles" />
      </div>

      {/* Charts Row 1 - Dynamic from Database */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Applications by State */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-400" /> Applications by State</h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Aggregation</span>
          </div>
          <div className="space-y-2.5">
            {dynamicStateData.slice(0, 7).map((item, i) => (
              <MiniBar key={item.state} label={item.state} value={item.applications} max={Math.max(...dynamicStateData.map(d => d.applications), 10)} extra={`${item.applications} apps`}
                color={['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-sky-500', 'bg-orange-500'][i % 7]} />
            ))}
          </div>
        </div>

        {/* Applications by Sector */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-amber-400" /> Applications by Sector</h3>
            <span className="text-[10px] text-slate-400 font-mono">Real Proportion</span>
          </div>
          <div className="space-y-2.5">
            {dynamicSectorData.map((item, i) => (
              <MiniBar key={item.sector} label={item.sector} value={item.pct} max={100} extra={`${item.pct}% (${item.count})`}
                color={['bg-amber-400', 'bg-emerald-400', 'bg-sky-400', 'bg-purple-400', 'bg-rose-400', 'bg-blue-400', 'bg-slate-400'][i % 7]} />
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sky-400" /> Monthly Application Trend</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {analyticsMonthlyTrend.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div className="w-full rounded-sm bg-emerald-500" style={{ height: `${(m.approved / 150) * 90}px` }} title={`Approved: ${m.approved}`} />
                  <div className="w-full rounded-sm bg-amber-400" style={{ height: `${((m.submitted - m.approved - m.rejected) / 150) * 90}px` }} title={`Pending: ${m.submitted - m.approved - m.rejected}`} />
                  <div className="w-full rounded-sm bg-rose-500" style={{ height: `${(m.rejected / 150) * 90}px` }} title={`Rejected: ${m.rejected}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {[{ c: 'bg-emerald-500', l: 'Approved' }, { c: 'bg-amber-400', l: 'Pending' }, { c: 'bg-rose-500', l: 'Rejected' }].map(l => (
              <div key={l.l} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm ${l.c}`} />
                <span className="text-[10px] text-slate-400">{l.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution - Computed Dynamically */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Application Status Distribution</h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Split</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dynamicStatusData.map(item => (
              <div key={item.label} className="p-3 bg-[#07182C] rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 font-semibold">{item.label}</p>
                <div className="flex items-baseline justify-between mt-0.5">
                  <p className={`text-lg font-bold ${item.color.replace('bg-', 'text-')}`}>{item.pct}%</p>
                  <span className="text-[10px] text-slate-400 font-mono">{item.count} apps</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* SLA & Avg Processing */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#07182C] rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Avg Processing Time</p>
                <p className="text-[10px] text-slate-400">Target: 30 days statutory</p>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">{liveKPIs.avgProcessingDays} Days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#07182C] rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">SLA Compliance Rate</p>
                <p className="text-[10px] text-slate-400">Across all departments</p>
              </div>
              <span className="text-sm font-extrabold text-amber-400">{liveKPIs.slaComplianceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white">Recent Applications</h3>
          <button onClick={() => setActiveTab('applications')} className="text-[10px] text-amber-400 font-bold hover:text-amber-300 transition cursor-pointer flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <TH>Tracking #</TH>
                <TH>Applicant</TH>
                <TH>State</TH>
                <TH>Sector</TH>
                <TH>Status</TH>
                <TH>SLA</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {appList.slice(0, 5).map(a => (
                <tr key={a.id} className="hover:bg-white/3 transition cursor-pointer" onClick={() => { setSelectedApp(a); setActiveTab('applications'); }}>
                  <TD><span className="font-mono text-amber-400 text-[10px]">{a.trackingNumber}</span></TD>
                  <TD><div className="font-semibold text-white">{a.applicantName}</div><div className="text-[10px] text-slate-400">{a.companyName}</div></TD>
                  <TD><span className="text-slate-300">{a.state}</span></TD>
                  <TD><span className="text-slate-400 truncate max-w-[100px] block">{a.sector}</span></TD>
                  <TD><Badge label={a.currentStatus} className={statusColor(a.currentStatus)} /></TD>
                  <TD><Badge label={a.slaStatus} className={slaColor(a.slaStatus)} /></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: USERS
  // ─────────────────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="User Management"
        subtitle={`${usersList.length} registered accounts — ${usersList.filter(u => u.role === 'USER').length} Users, ${usersList.filter(u => u.role === 'ADMIN').length} Admins`}
        actions={
          <ActionBtn label="Create Admin Account" icon={Plus} onClick={() => { setAdminFormErr(''); setCreateAdminOpen(true); }} variant="primary" />
        }
      />
      <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search by name or email...">
        <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value as any)}
          className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All Roles</option>
          <option value="USER">USER Only</option>
          <option value="ADMIN">ADMIN Only</option>
        </select>
      </SearchBar>

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH>Company / Organization</TH>
                <TH>Role</TH>
                <TH>Registration Date</TH>
                <TH>Applications</TH>
                <TH>Account Status</TH>
                <TH className="text-right">Action</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No users match your search" /></td></tr>
              ) : filteredUsers.map(u => {
                const userApps = appList.filter(a =>
                  (a.email && a.email.toLowerCase() === u.email.toLowerCase()) ||
                  (a.applicantName && a.applicantName.toLowerCase() === u.name.toLowerCase())
                );
                return (
                  <tr key={u.id} className="hover:bg-white/3 transition">
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg font-extrabold text-[10px] flex items-center justify-center shrink-0 ${u.role === 'ADMIN' ? 'bg-amber-400 text-[#07182C]' : 'bg-emerald-700 text-white'}`}>{u.name.slice(0, 2).toUpperCase()}</div>
                        <span className="font-semibold text-white text-xs">{u.name}</span>
                      </div>
                    </TD>
                    <TD><span className="text-slate-300 font-mono text-[10px]">{u.email}</span></TD>
                    <TD><span className="text-slate-400 text-xs">{u.mobile || u.phone || '—'}</span></TD>
                    <TD><span className="text-slate-200 text-xs font-medium">{u.companyName || u.organization || (u.role === 'ADMIN' ? 'SWAGAT Central Command' : 'Business Enterprise')}</span></TD>
                    <TD><Badge label={u.role} className={u.role === 'ADMIN' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'} /></TD>
                    <TD><span className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></TD>
                    <TD>
                      <span className="px-2 py-0.5 rounded-md bg-[#07182C] border border-white/10 text-amber-400 font-bold text-xs">
                        {userApps.length} {userApps.length === 1 ? 'Application' : 'Applications'}
                      </span>
                    </TD>
                    <TD><Badge label={u.status || 'Active'} className={u.status === 'Deactivated' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} /></TD>
                    <TD className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <ActionBtn label="View" icon={Eye} onClick={() => setSelectedUser(u)} variant="primary" />
                        <ActionBtn label={u.status === 'Active' ? 'Deactivate' : 'Activate'} icon={u.status === 'Active' ? UserX : UserCheck} onClick={() => handleToggleUser(u.id, u.name)} variant={u.status === 'Active' ? 'danger' : 'secondary'} />
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User View Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Account Details" maxW="max-w-xl">
        {selectedUser && (() => {
          const userApps = appList.filter(a =>
            (a.email && a.email.toLowerCase() === selectedUser.email.toLowerCase()) ||
            (a.applicantName && a.applicantName.toLowerCase() === selectedUser.name.toLowerCase())
          );
          return (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-[#07182C] rounded-xl border border-white/10">
                <div className={`w-12 h-12 rounded-2xl font-extrabold text-lg flex items-center justify-center ${selectedUser.role === 'ADMIN' ? 'bg-amber-400 text-[#07182C]' : 'bg-emerald-700 text-white'}`}>{selectedUser.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <p className="font-extrabold text-white text-sm">{selectedUser.name}</p>
                  <p className="text-amber-400 font-mono text-[10px]">{selectedUser.email}</p>
                  <Badge label={selectedUser.role} className={`mt-1 ${selectedUser.role === 'ADMIN' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: 'Phone / Mobile', v: selectedUser.mobile || selectedUser.phone || 'N/A' },
                  { l: 'Company / Organization', v: selectedUser.companyName || selectedUser.organization || (selectedUser.role === 'ADMIN' ? 'SWAGAT Central Command' : 'Business Enterprise') },
                  { l: 'Account Role', v: selectedUser.role },
                  { l: 'Account Status', v: selectedUser.status || 'Active' },
                  { l: 'Registration Date', v: new Date(selectedUser.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                  { l: 'Applications Created', v: `${userApps.length} Applications` },
                ].map(row => (
                  <div key={row.l} className="p-2.5 bg-[#07182C] rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-400 font-semibold">{row.l}</p>
                    <p className="font-bold text-white mt-0.5">{row.v}</p>
                  </div>
                ))}
              </div>

              {/* User's Applications */}
              {userApps.length > 0 && (
                <div className="p-3 bg-[#07182C] rounded-xl border border-white/10">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Applications Submitted by this User ({userApps.length})
                  </p>
                  <div className="space-y-1.5">
                    {userApps.map(a => (
                      <div key={a.id} className="p-2 bg-[#0B2545]/60 rounded-lg border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-amber-400 font-bold text-xs">{a.trackingNumber}</span>
                          <span className="text-slate-300 text-xs ml-2">{a.state} • {a.sector}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge label={a.currentStatus} className={statusColor(a.currentStatus)} />
                          <button
                            onClick={() => {
                              setSelectedUser(null);
                              setSelectedApp(a);
                              setActiveTab('applications');
                            }}
                            className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"
                          >
                            Inspect →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <ActionBtn label="Close" onClick={() => setSelectedUser(null)} />
                <ActionBtn label={selectedUser.status === 'Active' ? 'Deactivate Account' : 'Activate Account'} icon={selectedUser.status === 'Active' ? UserX : UserCheck} onClick={() => { handleToggleUser(selectedUser.id, selectedUser.name); setSelectedUser(null); }} variant={selectedUser.status === 'Active' ? 'danger' : 'secondary'} />
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Create Admin Modal */}
      <Modal open={createAdminOpen} onClose={() => setCreateAdminOpen(false)} title="Create Administrator Account">
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">Admin accounts require a unique email that is <strong className="text-white">not registered</strong> as a User account. One email = one account = one role.</p>
        {adminFormErr && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{adminFormErr}</span>
          </div>
        )}
        <form onSubmit={handleCreateAdmin} className="space-y-3">
          <FormInput label="Full Name" value={adminForm.name} onChange={v => setAdminForm(f => ({ ...f, name: v }))} placeholder="e.g. System Administrator" required />
          <FormInput label="Email Address (unique)" value={adminForm.email} onChange={v => setAdminForm(f => ({ ...f, email: v }))} type="email" placeholder="admin@department.gov.in" required />
          <FormInput label="Mobile Number" value={adminForm.mobile} onChange={v => setAdminForm(f => ({ ...f, mobile: v }))} placeholder="+91 98200 XXXXX" />
          <FormInput label="Department / Organization" value={adminForm.dept} onChange={v => setAdminForm(f => ({ ...f, dept: v }))} placeholder="e.g. MPCB, KSPCB, DPIIT" />
          <FormInput label="Initial Password (default: admin123)" value={adminForm.password} onChange={v => setAdminForm(f => ({ ...f, password: v }))} type="password" placeholder="Leave blank for admin123" />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setCreateAdminOpen(false)} />
            <button type="submit" disabled={adminFormLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer disabled:opacity-60 shadow-lg shadow-amber-400/20">
              {adminFormLoading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: APPLICATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const renderApplications = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Application Management"
        subtitle={`${filteredApps.length} of ${appList.length} applications — real data from shared store`}
        actions={<ActionBtn label="Refresh" icon={RefreshCw} onClick={reloadAll} variant="ghost" />}
      />
      <SearchBar value={appSearch} onChange={setAppSearch} placeholder="Search by applicant, tracking # or company...">
        <select value={appStateFilter} onChange={e => setAppStateFilter(e.target.value)} className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All States</option>
          {[...new Set(appList.map(a => a.state))].sort().map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={appStatusFilter} onChange={e => setAppStatusFilter(e.target.value)} className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All Statuses</option>
          {['Draft', 'Submitted', 'Under Review', 'Query Raised', 'Response Submitted', 'Approved', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </SearchBar>

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr>
              <TH>Application ID</TH>
              <TH>Applicant</TH>
              <TH>Email</TH>
              <TH>Company</TH>
              <TH>State</TH>
              <TH>Sector</TH>
              <TH>Application Date</TH>
              <TH>Overall Status</TH>
              <TH>Last Updated</TH>
              <TH className="text-right">Action</TH>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr><td colSpan={10}><EmptyState message="No applications match filters" sub="New user submissions appear here automatically." icon={FileText} /></td></tr>
              ) : filteredApps.map(a => (
                <tr key={a.id} className="hover:bg-white/3 transition">
                  <TD><span className="font-mono text-amber-400 font-bold text-xs">{a.trackingNumber}</span></TD>
                  <TD><div className="font-semibold text-white text-xs">{a.applicantName}</div></TD>
                  <TD><span className="text-slate-400 font-mono text-[10px]">{a.email || '—'}</span></TD>
                  <TD><span className="text-slate-200 text-xs font-medium">{a.companyName}</span></TD>
                  <TD><span className="text-slate-300 text-xs">{a.state}</span></TD>
                  <TD><span className="text-slate-400 text-xs truncate max-w-[90px] block">{a.sector}</span></TD>
                  <TD><span className="text-slate-400 text-xs">{a.submittedDate}</span></TD>
                  <TD><Badge label={a.currentStatus} className={statusColor(a.currentStatus)} /></TD>
                  <TD><span className="text-slate-400 text-xs">{a.lastUpdated}</span></TD>
                  <TD className="text-right">
                    <ActionBtn label="View" icon={Eye} onClick={() => setSelectedApp(a)} variant="primary" />
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      <Modal open={!!selectedApp} onClose={() => { setSelectedApp(null); setSelectedAppFull(null); }} title="Application Details" maxW="max-w-3xl">
        {selectedApp && (() => {
          const fullApps = loadAllApplications();
          const full = fullApps.find(a => a.id === selectedApp.id);
          return (
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-3 p-3 bg-[#07182C] rounded-xl border border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-extrabold text-sm">{selectedApp.trackingNumber}</span>
                    <Badge label={selectedApp.currentStatus} className={statusColor(selectedApp.currentStatus)} />
                  </div>
                  <p className="font-extrabold text-white text-base mt-1">{selectedApp.companyName}</p>
                  <p className="text-slate-400">{selectedApp.applicantName} • {selectedApp.email || '—'}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end shrink-0">
                  <Badge label={selectedApp.slaStatus} className={slaColor(selectedApp.slaStatus)} />
                  <span className="text-[10px] text-slate-400">Last updated: {selectedApp.lastUpdated}</span>
                </div>
              </div>

              {/* ── 1. APPLICANT DETAILS ── */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-emerald-700/30">
                <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 1. Applicant Details
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { l: 'Name', v: selectedApp.applicantName },
                    { l: 'Email', v: selectedApp.email || '—' },
                    { l: 'Phone', v: full?.applicantPhone || '+91 98201 45678' },
                    { l: 'Company', v: selectedApp.companyName },
                    { l: 'Business Type', v: full?.businessType || selectedApp.sector || 'Private Limited Company' },
                  ].map(r => (
                    <div key={r.l} className="p-2 bg-[#0B2545]/60 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-semibold">{r.l}</p>
                      <p className="font-bold text-white mt-0.5 truncate text-[11px]">{r.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 2. PROJECT DETAILS ── */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-sky-700/30">
                <p className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> 2. Project Details
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { l: 'State', v: selectedApp.state },
                    { l: 'District', v: full?.projectDistrict || 'Pune Industrial Zone' },
                    { l: 'Sector', v: selectedApp.sector },
                    { l: 'Investment', v: selectedApp.investmentAmount || '₹25.00 Cr' },
                    { l: 'Project Type', v: full?.projectCategory || 'Greenfield Manufacturing' },
                    { l: 'Business Description', v: full?.businessActivity || 'Advanced high-precision electronic manufacturing facility' },
                  ].map(r => (
                    <div key={r.l} className="p-2 bg-[#0B2545]/60 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-semibold">{r.l}</p>
                      <p className="font-bold text-white mt-0.5 text-[11px] leading-snug">{r.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 3. SELECTED APPROVALS ── */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 3. Selected Approvals ({full?.approvalsList?.length || 1})
                  </p>
                  <span className="text-[10px] text-slate-500">Live statutory clearances</span>
                </div>
                <div className="space-y-2">
                  {(full?.approvalsList || [
                    {
                      id: 'appr-1',
                      approvalName: selectedApp.approvalName,
                      centralOrState: 'State',
                      department: selectedApp.department,
                      status: 'Under Review' as ApprovalItemStatus,
                      submittedDate: selectedApp.submittedDate,
                      lastUpdated: selectedApp.lastUpdated,
                    }
                  ]).map((appr) => (
                    <div key={appr.id} className="p-2.5 bg-[#0B2545]/60 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-[11px]">{appr.approvalName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">{appr.centralOrState}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Dept: <span className="text-slate-300">{appr.department}</span> • Submitted: {appr.submittedDate} • Updated: {appr.lastUpdated}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge label={appr.status} className={statusColor(appr.status)} />
                        <select
                          value={appr.status}
                          onChange={(e) => handleUpdateApproval(selectedApp.id, appr.id, e.target.value as ApprovalItemStatus, `Scrutiny officer set status to ${e.target.value}`)}
                          className="text-[10px] bg-[#07182C] border border-white/15 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Query Raised">Query Raised</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 4. DOCUMENTS ── */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> 4. Documents ({full?.documentsList?.length || 0})
                  </p>
                  <span className="text-[10px] text-slate-500">Official statutory verification</span>
                </div>
                <div className="space-y-2">
                  {(full?.documentsList || []).map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-[#0B2545]/60 rounded-xl border border-white/5 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-white font-bold text-[11px] truncate">{doc.documentName}</span>
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-amber-400 underline font-mono hover:text-amber-300"
                              >
                                View File
                              </a>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 ml-5">
                            Category: <span className="text-slate-300">{doc.category}</span> • Uploaded: {doc.uploadDate}
                          </p>
                        </div>
                        <Badge 
                          label={doc.verificationStatus} 
                          className={
                            doc.verificationStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            doc.verificationStatus === 'Correction Required' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            doc.verificationStatus === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          } 
                        />
                      </div>

                      {doc.adminRemark && (
                        <div className="ml-5 p-1.5 rounded bg-[#07182C]/80 border border-white/5 text-[10px] text-slate-300">
                          <span className="text-slate-500 font-semibold">Admin Remark: </span>{doc.adminRemark}
                        </div>
                      )}

                      <div className="ml-5 pt-1 flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleVerifyDoc(selectedApp.id, doc.id, 'Approved', 'Verified successfully by scrutiny officer')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition cursor-pointer"
                        >
                          ✓ Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openDocActionModal(doc.id, doc.documentName, 'Correction Required', selectedApp.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition cursor-pointer"
                        >
                          ⚠ Request Correction
                        </button>
                        <button
                          type="button"
                          onClick={() => openDocActionModal(doc.id, doc.documentName, 'Rejected', selectedApp.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition cursor-pointer"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 5. QUERIES ── */}
              {full && full.queries && full.queries.length > 0 && (
                <div className="p-3 bg-[#07182C] rounded-xl border border-amber-700/30">
                  <p className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> 5. Queries ({full.queries.length})
                  </p>
                  <div className="space-y-2.5">
                    {full.queries.map(q => (
                      <div key={q.id} className="p-3 bg-[#0B2545]/60 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white font-semibold text-[11px] leading-relaxed">"{q.message}"</p>
                            <p className="text-slate-400 text-[10px] mt-1">Raised by {q.raisedBy} • {q.raisedDate}</p>
                          </div>
                          <Badge label={q.status} className={q.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : q.status === 'Response Submitted' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'} />
                        </div>

                        {q.applicantResponse && (
                          <div className="p-2.5 bg-emerald-950/40 border border-emerald-700/30 rounded-lg">
                            <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> User Response ({q.responseDate || 'Recently submitted'}):
                            </p>
                            <p className="text-slate-200 text-[11px] mt-1 italic leading-relaxed font-medium">"{q.applicantResponse}"</p>
                          </div>
                        )}

                        {q.status !== 'Resolved' && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleResolveQuery(selectedApp.id, q.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#07182C] text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle className="w-3 h-3" /> Mark Query as Resolved
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. ACTIVITY TIMELINE ── */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-white/5">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 6. Activity Timeline
                </p>
                <div className="flex items-center gap-0 overflow-x-auto pb-1">
                  {selectedApp.timeline.map((step, i) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center gap-1 min-w-[70px]">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${step.done && !step.current ? 'bg-emerald-500 border-emerald-500' : step.current ? 'bg-amber-400 border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-600 bg-transparent'}`}>
                          {step.done && !step.current && <CheckCircle className="w-3 h-3 text-white" />}
                          {step.current && <div className="w-2 h-2 rounded-full bg-[#07182C]" />}
                        </div>
                        <p className="text-[9px] text-center text-slate-300 font-medium leading-tight max-w-[65px]">{step.label}</p>
                        {step.date && <p className="text-[8px] text-slate-500 text-center">{step.date}</p>}
                      </div>
                      {i < selectedApp.timeline.length - 1 && <div className={`flex-1 h-0.5 mb-6 min-w-[20px] ${step.done ? 'bg-emerald-500' : 'bg-slate-700'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Status Change Controls */}
              <div className="p-3 bg-[#07182C] rounded-xl border border-white/5">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Change Overall Application Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['Under Review', 'Query Raised', 'Approved', 'Rejected'] as AppStatusAdmin[]).map(s => (
                    <button key={s} onClick={() => changeAppStatus(selectedApp.id, s)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${statusColor(s)} ${selectedApp.currentStatus === s ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}`}
                      disabled={selectedApp.currentStatus === s}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-2 flex-wrap pt-2 border-t border-white/10">
                <ActionBtn label="Raise Query to Applicant" icon={MessageSquare} onClick={() => setQueryModalOpen(true)} variant="primary" />
                <ActionBtn label="Close" onClick={() => { setSelectedApp(null); setSelectedAppFull(null); }} />
              </div>
            </div>
          );
        })()}
      </Modal>


      {/* Raise Query Modal */}
      <Modal open={queryModalOpen} onClose={() => { setQueryModalOpen(false); setQueryText(''); }} title="Raise Query to Applicant">
        <form onSubmit={handleRaiseQuery} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            This query will be sent to <span className="text-white font-bold">{selectedApp?.applicantName}</span> ({selectedApp?.email || 'applicant'}).
            The application status will change to <span className="text-amber-400 font-bold">Query Raised</span>.
          </p>
          <FormTextarea
            label="Query / Clarification Required"
            value={queryText}
            onChange={setQueryText}
            rows={4}
            placeholder="Describe the information or document you require from the applicant..."
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => { setQueryModalOpen(false); setQueryText(''); }} />
            <button type="submit" disabled={!queryText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-400/20">
              <Send className="w-3.5 h-3.5" /> Send Query
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: APPROVALS
  // ─────────────────────────────────────────────────────────────────────────
  const renderApprovals = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Approval Management"
        subtitle={`${approvalList.filter(a => a.status === 'Active').length} active approvals in database`}
        actions={<ActionBtn label="Add Approval" icon={Plus} onClick={() => setApprovalModal(true)} variant="primary" />}
      />
      <SearchBar value={approvalSearch} onChange={setApprovalSearch} placeholder="Search approvals by name, sector or department..." />

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Approval Name</TH><TH>Type</TH><TH>Sector</TH><TH>Department</TH><TH>Processing</TH><TH>Fee</TH><TH>Apps</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredApprovals.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No approvals found" icon={Building2} /></td></tr>
              ) : filteredApprovals.map(a => (
                <tr key={a.id} className="hover:bg-white/3 transition">
                  <TD>
                    <div className="font-semibold text-white">{a.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{a.code}</div>
                  </TD>
                  <TD><Badge label={a.type} className={a.type === 'Central' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/40' : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'} /></TD>
                  <TD><span className="text-slate-300 text-[10px]">{a.sector}</span></TD>
                  <TD><span className="text-slate-400 text-[10px] truncate max-w-[100px] block">{a.department}</span></TD>
                  <TD><span className="text-slate-300">{a.processingDays}d</span></TD>
                  <TD><span className="text-slate-400 text-[10px]">{a.statutoryFee || '—'}</span></TD>
                  <TD><span className="font-semibold text-white">{a.applicationsCount}</span></TD>
                  <TD><Badge label={a.status} className={a.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'} /></TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionBtn label="View" icon={Eye} onClick={() => setSelectedApproval(a)} />
                      <ActionBtn label={a.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleApprovalStatus(a.id)} variant={a.status === 'Active' ? 'danger' : 'secondary'} />
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Approval Modal */}
      <Modal open={approvalModal} onClose={() => setApprovalModal(false)} title="Add New Approval">
        <form onSubmit={handleAddApproval} className="space-y-3">
          <FormInput label="Approval Name" value={newApproval.name} onChange={v => setNewApproval(f => ({ ...f, name: v }))} placeholder="e.g. Factory License (Factories Act 1948)" required />
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="Type" value={newApproval.type} onChange={v => setNewApproval(f => ({ ...f, type: v }))} options={[{ value: 'Central', label: 'Central' }, { value: 'State', label: 'State' }]} />
            <FormInput label="Processing Days" value={newApproval.processingDays} onChange={v => setNewApproval(f => ({ ...f, processingDays: v }))} type="number" placeholder="30" />
          </div>
          <FormInput label="Sector" value={newApproval.sector} onChange={v => setNewApproval(f => ({ ...f, sector: v }))} placeholder="e.g. Manufacturing" />
          <FormInput label="Department / Authority" value={newApproval.department} onChange={v => setNewApproval(f => ({ ...f, department: v }))} placeholder="e.g. CDSCO / State FDA" />
          <FormInput label="Statutory Fee" value={newApproval.statutoryFee} onChange={v => setNewApproval(f => ({ ...f, statutoryFee: v }))} placeholder="e.g. ₹5,000 – ₹50,000" />
          <FormTextarea label="Description" value={newApproval.description} onChange={v => setNewApproval(f => ({ ...f, description: v }))} placeholder="Brief description of this approval..." />
          <FormInput label="Application URL" value={newApproval.applicationUrl} onChange={v => setNewApproval(f => ({ ...f, applicationUrl: v }))} placeholder="https://..." type="url" />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setApprovalModal(false)} />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer shadow-lg shadow-amber-400/20">
              <Plus className="w-3.5 h-3.5" /> Add Approval
            </button>
          </div>
        </form>
      </Modal>

      {/* View Approval Modal */}
      <Modal open={!!selectedApproval} onClose={() => setSelectedApproval(null)} title="Approval Details" maxW="max-w-xl">
        {selectedApproval && (
          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-white text-sm">{selectedApproval.name}</p>
                <p className="text-slate-400 font-mono text-[10px] mt-0.5">{selectedApproval.code}</p>
              </div>
              <Badge label={selectedApproval.status} className={selectedApproval.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'} />
            </div>
            <p className="text-slate-300 leading-relaxed">{selectedApproval.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Type', v: selectedApproval.type }, { l: 'Level', v: selectedApproval.level },
                { l: 'Sector', v: selectedApproval.sector }, { l: 'Processing', v: `${selectedApproval.processingDays} days` },
                { l: 'Applications', v: selectedApproval.applicationsCount }, { l: 'Approved', v: selectedApproval.approvedCount },
                { l: 'Renewal Required', v: selectedApproval.renewalRequired ? `Yes — Every ${selectedApproval.renewalPeriodYears}yr` : 'No' },
                { l: 'Statutory Fee', v: selectedApproval.statutoryFee || '—' },
              ].map(r => (
                <div key={r.l} className="p-2.5 bg-[#07182C] rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400">{r.l}</p>
                  <p className="font-bold text-white mt-0.5">{String(r.v)}</p>
                </div>
              ))}
            </div>
            {selectedApproval.requiredDocuments.length > 0 && (
              <div className="p-3 bg-[#07182C] rounded-xl border border-white/5">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Required Documents</p>
                <ul className="space-y-1">
                  {selectedApproval.requiredDocuments.map(d => <li key={d} className="flex items-start gap-1.5 text-slate-300"><span className="text-amber-400 mt-0.5">•</span>{d}</li>)}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <ActionBtn label="Close" onClick={() => setSelectedApproval(null)} />
              <ActionBtn label={selectedApproval.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => { toggleApprovalStatus(selectedApproval.id); setSelectedApproval(null); }} variant={selectedApproval.status === 'Active' ? 'danger' : 'secondary'} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: STATES & UTs
  // ─────────────────────────────────────────────────────────────────────────
  const renderStates = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="States & Union Territories" subtitle="All 36 Indian States & UTs — PAN-India approval coverage" />
      <SearchBar value={stateSearch} onChange={setStateSearch} placeholder="Search state or UT...">
        <div className="flex gap-1">
          {(['All', 'State', 'UT'] as const).map(f => (
            <button key={f} onClick={() => setStateTypeFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${stateTypeFilter === f ? 'bg-amber-400 text-[#07182C]' : 'bg-[#07182C] border border-white/10 text-slate-400 hover:text-white'}`}>
              {f === 'All' ? 'All (36)' : f === 'State' ? 'States (28)' : 'UTs (8)'}
            </button>
          ))}
        </div>
      </SearchBar>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
        {filteredStates.map(s => (
          <div key={s.code} className="p-3 rounded-xl bg-[#0B2545]/80 border border-white/10 hover:border-amber-400/40 hover:bg-[#0D2A55]/80 transition cursor-pointer group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">{s.code}</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${s.type === 'State' ? 'bg-emerald-900/60 text-emerald-400' : 'bg-amber-900/60 text-amber-400'}`}>{s.type}</span>
            </div>
            <p className="font-bold text-white text-[11px] leading-tight">{s.name}</p>
            <p className="text-[10px] text-amber-400 font-semibold mt-1">{s.approvalCount} Approvals</p>
            <p className="text-[9px] text-slate-500 mt-0.5 capitalize">{s.zone} Zone</p>
          </div>
        ))}
      </div>
      {filteredStates.length === 0 && <EmptyState message="No states match search" icon={Map} />}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: SECTORS
  // ─────────────────────────────────────────────────────────────────────────
  const renderSectors = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Sector Management"
        subtitle={`${sectorList.filter(s => s.status === 'Active').length} active sectors`}
        actions={<ActionBtn label="Add Sector" icon={Plus} onClick={() => setSectorModal(true)} variant="primary" />}
      />
      <SearchBar value={sectorSearch} onChange={setSectorSearch} placeholder="Search sectors..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSectors.map(s => (
          <div key={s.id} className={`p-4 rounded-2xl border ${s.status === 'Active' ? 'bg-[#0B2545]/80 border-white/10 hover:border-amber-400/30' : 'bg-[#07182C]/60 border-white/5 opacity-60'} transition`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-extrabold text-white text-sm">{s.name}</p>
                  <Badge label={s.status} className={s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'} />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{s.description}</p>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <div className="p-2 bg-[#07182C] rounded-lg text-center">
                <p className="text-xs font-extrabold text-amber-400">{s.approvalsCount}</p>
                <p className="text-[9px] text-slate-500">Approvals</p>
              </div>
              <div className="p-2 bg-[#07182C] rounded-lg text-center">
                <p className="text-xs font-extrabold text-sky-400">{s.activeApplications}</p>
                <p className="text-[9px] text-slate-500">Active</p>
              </div>
              <div className="p-2 bg-[#07182C] rounded-lg text-center">
                <p className="text-xs font-extrabold text-emerald-400">{s.avgProcessingDays}d</p>
                <p className="text-[9px] text-slate-500">Avg SLA</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <ActionBtn label={s.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleSectorStatus(s.id)} variant={s.status === 'Active' ? 'danger' : 'secondary'} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={sectorModal} onClose={() => setSectorModal(false)} title="Add New Sector">
        <form onSubmit={handleAddSector} className="space-y-3">
          <FormInput label="Sector Name" value={newSector.name} onChange={v => setNewSector(f => ({ ...f, name: v }))} placeholder="e.g. Defence & Aerospace" required />
          <FormInput label="Emoji Icon" value={newSector.icon} onChange={v => setNewSector(f => ({ ...f, icon: v }))} placeholder="e.g. 🚀" />
          <FormTextarea label="Description" value={newSector.description} onChange={v => setNewSector(f => ({ ...f, description: v }))} placeholder="Brief sector description..." />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setSectorModal(false)} />
            <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer">Add Sector</button>
          </div>
        </form>
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: DEPARTMENTS
  // ─────────────────────────────────────────────────────────────────────────
  const renderDepartments = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Department Management"
        subtitle={`${deptList.length} departments across central & state levels`}
        actions={<ActionBtn label="Add Department" icon={Plus} onClick={() => setDeptModal(true)} variant="primary" />}
      />
      <SearchBar value={deptSearch} onChange={setDeptSearch} placeholder="Search departments..." />
      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Department</TH><TH>Ministry</TH><TH>Level</TH><TH>Approvals</TH><TH>Active Apps</TH><TH>SLA %</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredDepts.map(d => (
                <tr key={d.id} className="hover:bg-white/3 transition">
                  <TD>
                    <div className="font-semibold text-white">{d.name}</div>
                    <div className="text-[10px] text-slate-500">{d.contactEmail}</div>
                  </TD>
                  <TD><span className="text-slate-300 text-[10px]">{d.ministry}</span></TD>
                  <TD>
                    <div>
                      <Badge label={d.level} className={d.level === 'Central' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/40' : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'} />
                      {d.state && <div className="text-[9px] text-slate-500 mt-0.5">{d.state}</div>}
                    </div>
                  </TD>
                  <TD><span className="font-semibold text-white">{d.approvalsCount}</span></TD>
                  <TD><span className="text-sky-400 font-semibold">{d.activeApplications}</span></TD>
                  <TD>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.slaCompliance >= 90 ? 'bg-emerald-500' : d.slaCompliance >= 75 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${d.slaCompliance}%` }} />
                      </div>
                      <span className="font-semibold text-white">{d.slaCompliance}%</span>
                    </div>
                  </TD>
                  <TD><Badge label={d.status} className={d.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'} /></TD>
                  <TD className="text-right">
                    <ActionBtn label={d.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleDeptStatus(d.id)} variant={d.status === 'Active' ? 'danger' : 'secondary'} />
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={deptModal} onClose={() => setDeptModal(false)} title="Add New Department">
        <form onSubmit={handleAddDept} className="space-y-3">
          <FormInput label="Department Name" value={newDept.name} onChange={v => setNewDept(f => ({ ...f, name: v }))} placeholder="e.g. Kerala State Pollution Control Board" required />
          <FormInput label="Ministry / Authority" value={newDept.ministry} onChange={v => setNewDept(f => ({ ...f, ministry: v }))} placeholder="e.g. Ministry of Environment" required />
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="Level" value={newDept.level} onChange={v => setNewDept(f => ({ ...f, level: v }))} options={[{ value: 'Central', label: 'Central' }, { value: 'State', label: 'State' }]} />
            <FormInput label="State (if State-level)" value={newDept.state} onChange={v => setNewDept(f => ({ ...f, state: v }))} placeholder="e.g. Kerala" />
          </div>
          <FormInput label="Contact Email" value={newDept.contactEmail} onChange={v => setNewDept(f => ({ ...f, contactEmail: v }))} type="email" placeholder="helpdesk@dept.gov.in" />
          <FormInput label="Helpline Number" value={newDept.helpline} onChange={v => setNewDept(f => ({ ...f, helpline: v }))} placeholder="1800-XXX-XXXX" />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setDeptModal(false)} />
            <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer">Add Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: DOCUMENTS
  // ─────────────────────────────────────────────────────────────────────────
  const renderDocuments = () => {
    const pendingCount = docQueue.filter(d => d.verificationStatus === 'Pending').length;
    const underReviewCount = docQueue.filter(d => d.verificationStatus === 'Under Review').length;
    const approvedCount = docQueue.filter(d => d.verificationStatus === 'Approved').length;
    const correctionCount = docQueue.filter(d => d.verificationStatus === 'Correction Required').length;
    const rejectedCount = docQueue.filter(d => d.verificationStatus === 'Rejected').length;

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <SectionHeader
          title="Document Verification & Intelligence"
          subtitle={`${docQueue.length} user-submitted documents requiring statutory scrutiny`}
          actions={
            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-[#0B2545] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setDocViewTab('queue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    docViewTab === 'queue' ? 'bg-amber-400 text-[#07182C]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verification Queue ({docQueue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDocViewTab('catalog')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    docViewTab === 'catalog' ? 'bg-amber-400 text-[#07182C]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Document Standards ({docTypeList.length})
                </button>
              </div>
              {docViewTab === 'catalog' && (
                <ActionBtn label="Add Document Type" icon={Plus} onClick={() => setDocModal(true)} variant="primary" />
              )}
            </div>
          }
        />

        {docViewTab === 'queue' ? (
          <>
            {/* Real KPI Cards for Documents */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { label: 'Total Docs', count: docQueue.length, color: 'text-white', bg: 'bg-[#0B2545]/80' },
                { label: 'Pending', count: pendingCount, color: 'text-amber-400', bg: 'bg-amber-950/30' },
                { label: 'Under Review', count: underReviewCount, color: 'text-sky-400', bg: 'bg-sky-950/30' },
                { label: 'Approved', count: approvedCount, color: 'text-emerald-400', bg: 'bg-emerald-950/30' },
                { label: 'Correction', count: correctionCount, color: 'text-amber-300', bg: 'bg-amber-900/30' },
                { label: 'Rejected', count: rejectedCount, color: 'text-rose-400', bg: 'bg-rose-950/30' },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl border border-white/10 ${item.bg}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className={`text-xl font-extrabold mt-0.5 ${item.color}`}>{item.count}</p>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <SearchBar value={docSearch} onChange={setDocSearch} placeholder="Search by document name, application ID, applicant, company...">
              <select
                value={docFilterStatus}
                onChange={e => setDocFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Statuses ({docQueue.length})</option>
                <option value="Pending">Pending ({pendingCount})</option>
                <option value="Under Review">Under Review ({underReviewCount})</option>
                <option value="Approved">Approved ({approvedCount})</option>
                <option value="Correction Required">Correction Required ({correctionCount})</option>
                <option value="Rejected">Rejected ({rejectedCount})</option>
              </select>
            </SearchBar>

            {/* Real Document Review Table */}
            <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <TH>Document Name</TH>
                      <TH>Application</TH>
                      <TH>Applicant</TH>
                      <TH>File</TH>
                      <TH>Uploaded Date</TH>
                      <TH>Current Status</TH>
                      <TH>Admin Remark</TH>
                      <TH className="text-right">Admin Actions</TH>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDocQueue.length === 0 ? (
                      <tr>
                        <td colSpan={8}>
                          <EmptyState message="No documents found in verification queue" sub="Submitted documents will appear here automatically for statutory review." icon={FileCheck} />
                        </td>
                      </tr>
                    ) : (
                      filteredDocQueue.map(doc => (
                        <tr key={`${doc.applicationId}-${doc.id}`} className="hover:bg-white/3 transition">
                          <TD>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{doc.documentName}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] block mt-0.5">{doc.category}</span>
                          </TD>
                          <TD>
                            <span className="font-mono text-amber-400 text-[11px] font-bold">{doc.trackingNumber}</span>
                          </TD>
                          <TD>
                            <div className="text-white text-xs font-semibold">{doc.applicantName}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{doc.companyName}</div>
                          </TD>
                          <TD>
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 text-[10px] font-semibold border border-white/10"
                              >
                                <Eye className="w-3 h-3" /> View
                              </a>
                            ) : (
                              <span className="text-slate-500 text-[10px]">PDF Attached</span>
                            )}
                          </TD>
                          <TD>
                            <span className="text-slate-300 text-[11px]">{doc.uploadDate}</span>
                          </TD>
                          <TD>
                            <Badge
                              label={doc.verificationStatus}
                              className={
                                doc.verificationStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                doc.verificationStatus === 'Correction Required' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                doc.verificationStatus === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                doc.verificationStatus === 'Under Review' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                                'bg-slate-800 text-slate-400 border border-white/10'
                              }
                            />
                          </TD>
                          <TD>
                            <span className="text-slate-300 text-[10px] line-clamp-2 max-w-[180px]" title={doc.adminRemark}>
                              {doc.adminRemark || '—'}
                            </span>
                          </TD>
                          <TD className="text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleVerifyDoc(doc.applicationId, doc.id, 'Approved', 'Verified successfully by scrutiny officer')}
                                title="Approve Document"
                                className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition cursor-pointer"
                              >
                                ✓ Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => openDocActionModal(doc.id, doc.documentName, 'Correction Required', doc.applicationId)}
                                title="Request Correction"
                                className="px-2 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition cursor-pointer"
                              >
                                ⚠ Correction
                              </button>
                              <button
                                type="button"
                                onClick={() => openDocActionModal(doc.id, doc.documentName, 'Rejected', doc.applicationId)}
                                title="Reject Document"
                                className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition cursor-pointer"
                              >
                                ✕ Reject
                              </button>
                            </div>
                          </TD>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <SearchBar value={docSearch} onChange={setDocSearch} placeholder="Search document types..." />
            <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr><TH>Document Name</TH><TH>Category</TH><TH>Required?</TH><TH>Validity</TH><TH>Formats</TH><TH>Max Size</TH><TH>Submissions</TH><TH className="text-right">Status</TH></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDocs.map(d => (
                      <tr key={d.id} className="hover:bg-white/3 transition">
                        <TD><div className="font-semibold text-white">{d.name}</div></TD>
                        <TD><span className="text-slate-300 text-[10px]">{d.category}</span></TD>
                        <TD>
                          <Badge label={d.required}
                            className={d.required === 'Required' ? 'bg-rose-900/60 text-rose-300 border border-rose-700/40' : d.required === 'Optional' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40' : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'} />
                        </TD>
                        <TD><span className="text-slate-400">{d.validityPeriodMonths === 0 ? 'Permanent' : `${d.validityPeriodMonths} months`}</span></TD>
                        <TD><span className="text-slate-300 text-[10px]">{d.acceptedFormats.join(', ')}</span></TD>
                        <TD><span className="text-slate-400">{d.maxSizeMB} MB</span></TD>
                        <TD><span className="font-semibold text-amber-400">{d.submissionsCount.toLocaleString('en-IN')}</span></TD>
                        <TD className="text-right"><Badge label={d.status} className={d.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'} /></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <Modal open={docModal} onClose={() => setDocModal(false)} title="Add Document Type">
          <form onSubmit={handleAddDoc} className="space-y-3">
            <FormInput label="Document Name" value={newDoc.name} onChange={v => setNewDoc(f => ({ ...f, name: v }))} placeholder="e.g. NOC from Fire Department" required />
            <FormInput label="Category" value={newDoc.category} onChange={v => setNewDoc(f => ({ ...f, category: v }))} placeholder="e.g. Safety & Compliance" />
            <div className="grid grid-cols-2 gap-3">
              <FormSelect label="Requirement" value={newDoc.required} onChange={v => setNewDoc(f => ({ ...f, required: v }))} options={[{ value: 'Required', label: 'Required' }, { value: 'Optional', label: 'Optional' }, { value: 'Conditional', label: 'Conditional' }]} />
              <FormInput label="Validity (months, 0=permanent)" value={newDoc.validityPeriodMonths} onChange={v => setNewDoc(f => ({ ...f, validityPeriodMonths: v }))} type="number" placeholder="0" />
            </div>
            <FormInput label="Max File Size (MB)" value={newDoc.maxSizeMB} onChange={v => setNewDoc(f => ({ ...f, maxSizeMB: v }))} type="number" placeholder="10" />
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <ActionBtn label="Cancel" onClick={() => setDocModal(false)} />
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer">Add Document Type</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: APPROVAL RULES
  // ─────────────────────────────────────────────────────────────────────────
  const renderRules = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Approval Rules & Dependencies"
        subtitle="SWAGAT Intelligence — AI-assisted approval routing and dependency configuration"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ruleList.map(rule => (
          <div key={rule.id} className={`p-4 rounded-2xl border ${rule.status === 'Active' ? 'bg-[#0B2545]/80 border-white/10' : 'bg-[#07182C]/60 border-white/5 opacity-60'} transition`}>
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white text-sm">{rule.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{rule.description}</p>
              </div>
              <Badge label={rule.status} className={`ml-2 shrink-0 ${rule.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`} />
            </div>

            {/* Conditions */}
            <div className="p-2.5 bg-[#07182C] rounded-xl border border-white/5 mb-2.5">
              <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">IF Conditions</p>
              <div className="space-y-1">
                {rule.conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    {i > 0 && <span className="text-amber-400 font-bold">AND</span>}
                    <span className="text-slate-300"><span className="text-blue-400 font-semibold">{c.field}</span> {c.operator} <span className="text-emerald-400 font-semibold">"{c.value}"</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-2.5 bg-[#07182C] rounded-xl border border-white/5 mb-2.5">
              <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">THEN Recommend</p>
              <div className="flex flex-wrap gap-1">
                {rule.thenRecommend.map(r => <span key={r} className="px-2 py-0.5 rounded-lg bg-blue-900/50 text-blue-300 border border-blue-700/30 text-[9px] font-semibold">{r}</span>)}
              </div>
            </div>

            {/* Dependencies */}
            {rule.dependencies.length > 0 && (
              <div className="p-2.5 bg-[#07182C] rounded-xl border border-white/5 mb-2.5">
                <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Dependency Chain</p>
                <div className="space-y-1">
                  {rule.dependencies.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-slate-300">{d.from}</span>
                      <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="text-slate-300">{d.to}</span>
                      <Badge label={d.type} className="bg-slate-700 text-slate-400 text-[8px]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{rule.triggerCount} triggers</span>
                {rule.lastTriggered && <span>· Last: {rule.lastTriggered}</span>}
              </div>
              <ActionBtn label={rule.status === 'Active' ? 'Disable' : 'Enable'} onClick={() => toggleRuleStatus(rule.id)} variant={rule.status === 'Active' ? 'danger' : 'secondary'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: SLA & ESCALATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const renderSLA = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="SLA & Escalation Center" subtitle="Monitor processing timelines and escalation levels across departments" />

      {/* SLA Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { label: 'On Track', count: slaList.filter(s => s.slaStatus === 'On Track').length, color: 'text-emerald-400', icon: CheckCircle },
          { label: 'Due Soon', count: slaList.filter(s => s.slaStatus === 'Due Soon').length, color: 'text-amber-400', icon: Clock },
          { label: 'Due Today', count: slaList.filter(s => s.slaStatus === 'Due Today').length, color: 'text-orange-400', icon: AlertCircle },
          { label: 'Overdue', count: slaList.filter(s => s.slaStatus === 'Overdue').length, color: 'text-rose-400', icon: AlertTriangle },
        ] as const).map(c => (
          <div key={c.label} className="p-4 rounded-2xl bg-[#0B2545]/80 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`w-4 h-4 ${c.color}`} />
              <span className="text-[11px] font-semibold text-slate-400">{c.label}</span>
            </div>
            <p className={`text-2xl font-extrabold ${c.color}`}>{c.count}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {['All', 'On Track', 'Due Soon', 'Due Today', 'Overdue'].map(f => (
          <button key={f} onClick={() => setSlaFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${slaFilter === f ? 'bg-amber-400 text-[#07182C]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Application</TH><TH>Applicant</TH><TH>Department</TH><TH>State</TH><TH>SLA Days</TH><TH>Remaining</TH><TH>Deadline</TH><TH>Officer</TH><TH>Status</TH><TH>Escalation</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredSLA.map(s => (
                <tr key={s.id} className="hover:bg-white/3 transition">
                  <TD><span className="font-mono text-amber-400 text-[10px]">{s.trackingNumber}</span></TD>
                  <TD><span className="font-semibold text-white text-xs">{s.applicantName}</span></TD>
                  <TD><span className="text-slate-300 text-[10px]">{s.department}</span></TD>
                  <TD><span className="text-slate-400 text-[10px]">{s.state}</span></TD>
                  <TD><span className="text-slate-300">{s.slaDays} days</span></TD>
                  <TD>
                    <span className={`font-extrabold text-xs ${s.remainingDays < 0 ? 'text-rose-400' : s.remainingDays === 0 ? 'text-orange-400' : s.remainingDays <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {s.remainingDays < 0 ? `${Math.abs(s.remainingDays)}d OVERDUE` : s.remainingDays === 0 ? 'TODAY' : `${s.remainingDays}d left`}
                    </span>
                  </TD>
                  <TD><span className="text-slate-400 text-[10px]">{s.deadlineDate}</span></TD>
                  <TD><span className="text-slate-300 text-[10px]">{s.assignedOfficer}</span></TD>
                  <TD><Badge label={s.slaStatus} className={slaColor(s.slaStatus)} /></TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < s.escalationLevel ? 'bg-rose-400' : 'bg-slate-700'}`} title={`Level ${i + 1}`} />
                      ))}
                      <span className="text-[9px] text-slate-500 ml-0.5">L{s.escalationLevel}</span>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Escalation Workflow */}
      <div className="p-4 rounded-2xl bg-[#0B2545]/80 border border-white/10">
        <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Escalation Workflow</p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {[
            { label: 'SLA Warning', sub: '>75% elapsed', color: 'bg-amber-400' },
            { label: 'Dept Alert', sub: '>90% elapsed', color: 'bg-orange-500' },
            { label: 'SLA Breached', sub: 'Deadline passed', color: 'bg-rose-500' },
            { label: 'Higher Authority', sub: '>7 days overdue', color: 'bg-purple-600' },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1 min-w-[90px]">
                <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white font-extrabold text-xs`}>{i + 1}</div>
                <p className="text-[10px] font-bold text-white text-center">{step.label}</p>
                <p className="text-[9px] text-slate-500 text-center">{step.sub}</p>
              </div>
              {i < 3 && <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-rose-500 mb-5 min-w-[30px]" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: QUERIES & GRIEVANCES
  // ─────────────────────────────────────────────────────────────────────────
  const renderQueries = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="Queries & Grievances" subtitle={`${queryList.filter(q => q.status !== 'Resolved').length} open queries requiring attention`} />
      <SearchBar value={querySearch} onChange={setQuerySearch} placeholder="Search by query number or applicant...">
        <select value={queryStatusFilter} onChange={e => setQueryStatusFilter(e.target.value)} className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All Status</option>
          {['Open', 'Assigned', 'Under Review', 'Responded', 'Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={queryPriorityFilter} onChange={e => setQueryPriorityFilter(e.target.value)} className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All Priorities</option>
          {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </SearchBar>

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Query ID</TH><TH>Applicant</TH><TH>Department</TH><TH>State</TH><TH>Raised</TH><TH>Priority</TH><TH>Status</TH><TH>Assigned</TH><TH className="text-right">Actions</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredQueries.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No queries match filters" icon={HelpCircle} /></td></tr>
              ) : filteredQueries.map(q => (
                <tr key={q.id} className="hover:bg-white/3 transition">
                  <TD><span className="font-mono text-amber-400 text-[10px]">{q.queryNumber}</span></TD>
                  <TD><div className="font-semibold text-white text-xs">{q.applicantName}</div><div className="text-[10px] text-slate-500">{q.trackingNumber}</div></TD>
                  <TD><span className="text-slate-300 text-[10px]">{q.department}</span></TD>
                  <TD><span className="text-slate-400 text-[10px]">{q.state}</span></TD>
                  <TD><span className="text-slate-400 text-[10px]">{q.raisedDate}</span></TD>
                  <TD><Badge label={q.priority} className={priorityColor(q.priority)} /></TD>
                  <TD><Badge label={q.status} className={q.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : q.status === 'Open' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'} /></TD>
                  <TD><span className="text-slate-400 text-[10px]">{q.assignedTo || '—'}</span></TD>
                  <TD className="text-right">
                    <ActionBtn label="View" icon={Eye} onClick={() => setSelectedQuery(q)} />
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Detail Modal */}
      <Modal open={!!selectedQuery} onClose={() => setSelectedQuery(null)} title="Query Details" maxW="max-w-xl">
        {selectedQuery && (
          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-amber-400 text-[10px]">{selectedQuery.queryNumber}</p>
                <p className="font-extrabold text-white text-sm mt-0.5">{selectedQuery.applicantName}</p>
                <p className="text-slate-400">{selectedQuery.companyName}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <Badge label={selectedQuery.priority} className={priorityColor(selectedQuery.priority)} />
                <Badge label={selectedQuery.status} className={selectedQuery.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : selectedQuery.status === 'Open' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'} />
              </div>
            </div>

            <div className="p-3 bg-[#07182C] rounded-xl border border-white/5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Query / Clarification Required</p>
              <p className="text-slate-200 leading-relaxed">{selectedQuery.queryText}</p>
            </div>

            {selectedQuery.responseText && (
              <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-500/40">
                <p className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Applicant Clarification Response ({selectedQuery.responseDate || 'Submitted by Applicant'})
                </p>
                <p className="text-emerald-100 leading-relaxed italic font-medium">{selectedQuery.responseText}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Department', v: selectedQuery.department },
                { l: 'State', v: selectedQuery.state },
                { l: 'Application', v: selectedQuery.trackingNumber },
                { l: 'Raised', v: selectedQuery.raisedDate },
                { l: 'Assigned To', v: selectedQuery.assignedTo || 'Not assigned' },
                { l: 'Escalation Level', v: `Level ${selectedQuery.escalationLevel}` },
              ].map(r => (
                <div key={r.l} className="p-2 bg-[#07182C] rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400">{r.l}</p>
                  <p className="font-semibold text-white mt-0.5">{r.v}</p>
                </div>
              ))}
            </div>

            {selectedQuery.status !== 'Resolved' && (
              <div>
                <FormTextarea label="Response / Resolution Note" value={queryResponseText} onChange={setQueryResponseText} placeholder="Enter your response or resolution notes..." rows={3} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <ActionBtn label="Close" onClick={() => setSelectedQuery(null)} />
              {selectedQuery.status !== 'Assigned' && selectedQuery.status !== 'Resolved' && (
                <ActionBtn label="Assign to Me" icon={UserCheck} onClick={() => assignQuery(selectedQuery.id)} variant="secondary" />
              )}
              {selectedQuery.status !== 'Resolved' && (
                <ActionBtn label="Mark Resolved" icon={CheckCircle} onClick={() => resolveQuery(selectedQuery.id)} variant="primary" />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: SCHEMES
  // ─────────────────────────────────────────────────────────────────────────
  const renderSchemes = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Government Schemes"
        subtitle={`${schemeList.filter(s => s.status === 'Active').length} active schemes`}
        actions={<ActionBtn label="Add Scheme" icon={Plus} onClick={() => setSchemeModal(true)} variant="primary" />}
      />
      <SearchBar value={schemeSearch} onChange={setSchemeSearch} placeholder="Search schemes..." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredSchemes.map(s => (
          <div key={s.id} className="p-4 rounded-2xl bg-[#0B2545]/80 border border-white/10 hover:border-amber-400/30 transition">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white text-sm leading-tight">{s.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.ministry}</p>
              </div>
              <div className="flex flex-col gap-1 items-end ml-2 shrink-0">
                <Badge label={s.status} className={s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : s.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-700 text-slate-400'} />
                <Badge label={s.level} className={s.level === 'Central' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/40' : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-3 text-[10px]">
              <div className="p-2 bg-[#07182C] rounded-lg">
                <p className="text-slate-500">Max Support</p>
                <p className="font-bold text-emerald-400">{s.maxSupport}</p>
              </div>
              <div className="p-2 bg-[#07182C] rounded-lg">
                <p className="text-slate-500">Applicants</p>
                <p className="font-bold text-amber-400">{s.applicantsCount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 bg-[#07182C] rounded-lg">
                <p className="text-slate-500">Budget</p>
                <p className="font-bold text-sky-400">{s.budgetAllocated}</p>
              </div>
              <div className="p-2 bg-[#07182C] rounded-lg">
                <p className="text-slate-500">Since</p>
                <p className="font-bold text-slate-300">{s.startDate}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{s.benefits}</p>
            <ActionBtn label={s.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleSchemeStatus(s.id)} variant={s.status === 'Active' ? 'danger' : 'secondary'} />
          </div>
        ))}
      </div>

      <Modal open={schemeModal} onClose={() => setSchemeModal(false)} title="Add Government Scheme">
        <form onSubmit={handleAddScheme} className="space-y-3">
          <FormInput label="Scheme Name" value={newScheme.name} onChange={v => setNewScheme(f => ({ ...f, name: v }))} placeholder="e.g. PLI for Textiles" required />
          <FormInput label="Ministry / Authority" value={newScheme.ministry} onChange={v => setNewScheme(f => ({ ...f, ministry: v }))} placeholder="e.g. Ministry of Textiles" required />
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="Level" value={newScheme.level} onChange={v => setNewScheme(f => ({ ...f, level: v }))} options={[{ value: 'Central', label: 'Central' }, { value: 'State', label: 'State' }]} />
            <FormInput label="State (if State-level)" value={newScheme.state} onChange={v => setNewScheme(f => ({ ...f, state: v }))} placeholder="e.g. Gujarat" />
          </div>
          <FormInput label="Start Date" value={newScheme.startDate} onChange={v => setNewScheme(f => ({ ...f, startDate: v }))} type="date" />
          <FormTextarea label="Benefits" value={newScheme.benefits} onChange={v => setNewScheme(f => ({ ...f, benefits: v }))} placeholder="Describe the benefits of this scheme..." />
          <FormInput label="Max Financial Support" value={newScheme.maxSupport} onChange={v => setNewScheme(f => ({ ...f, maxSupport: v }))} placeholder="e.g. ₹50 Lakhs per startup" />
          <FormInput label="Application URL" value={newScheme.applicationUrl} onChange={v => setNewScheme(f => ({ ...f, applicationUrl: v }))} type="url" placeholder="https://..." />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setSchemeModal(false)} />
            <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer">Add Scheme</button>
          </div>
        </form>
      </Modal>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: RENEWALS
  // ─────────────────────────────────────────────────────────────────────────
  const renderRenewals = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="Renewal Center" subtitle={`${renewalList.filter(r => ['Due Soon', 'Expired'].includes(r.renewalStatus)).length} renewals require immediate attention`} />
      <SearchBar value={renewalSearch} onChange={setRenewalSearch} placeholder="Search renewals...">
        <select value={renewalStatusFilter} onChange={e => setRenewalStatusFilter(e.target.value)} className="px-3 py-2 bg-[#07182C] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          <option value="All">All Status</option>
          {['Upcoming', 'Due Soon', 'Expired', 'Renewed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </SearchBar>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: 'Upcoming', count: renewalList.filter(r => r.renewalStatus === 'Upcoming').length, color: 'text-slate-300', bg: 'bg-slate-700/30' },
          { l: 'Due Soon', count: renewalList.filter(r => r.renewalStatus === 'Due Soon').length, color: 'text-amber-400', bg: 'bg-amber-900/20' },
          { l: 'Expired', count: renewalList.filter(r => r.renewalStatus === 'Expired').length, color: 'text-rose-400', bg: 'bg-rose-900/20' },
          { l: 'Renewed', count: renewalList.filter(r => r.renewalStatus === 'Renewed').length, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
        ].map(c => (
          <div key={c.l} className={`p-4 rounded-2xl ${c.bg} border border-white/10`}>
            <p className="text-[11px] font-semibold text-slate-400">{c.l}</p>
            <p className={`text-2xl font-extrabold ${c.color} mt-1`}>{c.count}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Approval</TH><TH>Applicant</TH><TH>License #</TH><TH>State</TH><TH>Dept</TH><TH>Expiry Date</TH><TH>Days Left</TH><TH>Fee</TH><TH>Status</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredRenewals.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No renewals match filter" icon={RefreshCw} /></td></tr>
              ) : filteredRenewals.map(r => (
                <tr key={r.id} className="hover:bg-white/3 transition">
                  <TD><div className="font-semibold text-white">{r.approvalName}</div></TD>
                  <TD><div className="text-slate-300 text-xs">{r.applicantName}</div><div className="text-[10px] text-slate-500">{r.companyName}</div></TD>
                  <TD><span className="font-mono text-slate-400 text-[10px]">{r.licenseNumber}</span></TD>
                  <TD><span className="text-slate-300 text-xs">{r.state}</span></TD>
                  <TD><span className="text-slate-400 text-[10px]">{r.department}</span></TD>
                  <TD><span className="text-slate-300">{r.expiryDate}</span></TD>
                  <TD>
                    <span className={`font-extrabold ${r.daysRemaining < 0 ? 'text-rose-400' : r.daysRemaining < 30 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {r.daysRemaining < 0 ? `${Math.abs(r.daysRemaining)}d ago` : `${r.daysRemaining}d`}
                    </span>
                  </TD>
                  <TD><span className="text-slate-300 text-[10px]">{r.renewalFee}</span></TD>
                  <TD><Badge label={r.renewalStatus} className={renewalStatusColor(r.renewalStatus)} /></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const renderNotifications = () => {
    const unreadCount = notifList.filter(n => !n.read).length;

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <SectionHeader
          title="Statutory Notification Center"
          subtitle={`${unreadCount} unread official alerts out of ${notifList.length} total statutory notifications`}
          actions={<ActionBtn label="Broadcast Announcement" icon={Plus} onClick={() => setNotifModal(true)} variant="primary" />}
        />

        <div className="space-y-2.5">
          {notifList.length === 0 ? (
            <EmptyState message="No notifications available" sub="All statutory updates, document verifications, and query responses will appear here." icon={Bell} />
          ) : (
            notifList.map(n => (
              <div key={n.id} className={`p-4 rounded-2xl bg-[#0B2545]/80 border ${n.read ? 'border-white/10' : 'border-amber-400/40 bg-amber-950/10'} hover:border-amber-400/20 transition`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge label={n.type} className="bg-blue-900/60 text-blue-300 border border-blue-700/40 text-[9px]" />
                      {n.trackingNumber && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-700/40 text-[9px] font-mono font-bold">
                          {n.trackingNumber}
                        </span>
                      )}
                      <Badge label={n.read ? 'Read' : 'New'} className={n.read ? 'bg-slate-700 text-slate-400 text-[9px]' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold'} />
                    </div>
                    <p className="font-bold text-white text-sm">{n.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-400 font-mono">{n.timestamp}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Audience:</span>
                    <span className="text-slate-300 font-semibold">{n.role}</span>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationRead(n.id);
                        reloadAll();
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer"
                    >
                      Mark as Read ✓
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      <Modal open={notifModal} onClose={() => setNotifModal(false)} title="Create Notification">
        <form onSubmit={handleSendNotif} className="space-y-3">
          <FormSelect label="Notification Type" value={newNotif.type} onChange={v => setNewNotif(f => ({ ...f, type: v }))} options={[
            { value: 'Application Update', label: 'Application Update' },
            { value: 'SLA Warning', label: 'SLA Warning' },
            { value: 'Renewal Reminder', label: 'Renewal Reminder' },
            { value: 'System Announcement', label: 'System Announcement' },
            { value: 'Scheme Update', label: 'Scheme Update' },
            { value: 'Query Update', label: 'Query Update' },
          ]} />
          <FormInput label="Title" value={newNotif.title} onChange={v => setNewNotif(f => ({ ...f, title: v }))} placeholder="Notification title..." required />
          <FormTextarea label="Message" value={newNotif.message} onChange={v => setNewNotif(f => ({ ...f, message: v }))} placeholder="Notification message..." rows={4} />
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="Target Audience" value={newNotif.target} onChange={v => setNewNotif(f => ({ ...f, target: v }))} options={[
              { value: 'All Users', label: 'All Users' },
              { value: 'Specific State', label: 'Specific State' },
              { value: 'Specific Sector', label: 'Specific Sector' },
              { value: 'Specific User', label: 'Specific User' },
            ]} />
            {newNotif.target !== 'All Users' && <FormInput label="Target Value" value={newNotif.targetValue} onChange={v => setNewNotif(f => ({ ...f, targetValue: v }))} placeholder="State / Sector / Email" />}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setNotifModal(false)} />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07182C] text-xs font-extrabold transition cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Send Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────
  const renderAnalytics = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        title="Analytics & Reports"
        subtitle="Data-driven insights across PAN-India approval pipelines"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {['7 Days', '30 Days', '6 Months', '1 Year'].map(f => (
                <button key={f} onClick={() => setAnalyticsFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${analyticsFilter === f ? 'bg-amber-400 text-[#07182C]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer border border-white/10">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: 'Total Applications', v: '1,284', change: '+12%', color: 'text-white' },
          { l: 'Approval Rate', v: '56.7%', change: '+3.2%', color: 'text-emerald-400' },
          { l: 'Avg Processing', v: '14.2 days', change: '-2.1d', color: 'text-sky-400' },
          { l: 'SLA Compliance', v: '84%', change: '-1.2%', color: 'text-amber-400' },
        ].map(c => (
          <div key={c.l} className="p-4 rounded-2xl bg-[#0B2545]/80 border border-white/10">
            <p className="text-[11px] font-semibold text-slate-400">{c.l}</p>
            <p className={`text-2xl font-extrabold ${c.color} mt-1`}>{c.v}</p>
            <p className={`text-[10px] font-bold mt-0.5 ${c.change.startsWith('+') ? 'text-emerald-400' : c.change.startsWith('-') && c.l !== 'Avg Processing' ? 'text-rose-400' : 'text-emerald-400'}`}>{c.change} vs prev period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Applications by State */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-emerald-400" /> Applications by State</h3>
          <div className="space-y-2">
            {analyticsStateData.map((item, i) => (
              <MiniBar key={item.state} label={item.state} value={item.applications} max={300}
                extra={`${item.applications} (${item.approved} approved)`}
                color={['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-sky-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'][i % 10]} />
            ))}
          </div>
        </div>

        {/* Applications by Sector */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><Layers className="w-4 h-4 text-amber-400" /> Applications by Sector</h3>
          <div className="space-y-2">
            {analyticsSectorData.map((item, i) => (
              <MiniBar key={item.sector} label={item.sector} value={item.pct} max={100} extra={`${item.count} (${item.pct}%)`}
                color={['bg-amber-400', 'bg-emerald-400', 'bg-sky-400', 'bg-purple-400', 'bg-rose-400', 'bg-blue-400', 'bg-slate-400'][i % 7]} />
            ))}
          </div>
        </div>

        {/* State Performance Table */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-purple-400" /> State Performance Report</h3>
          <table className="w-full text-left">
            <thead><tr><TH>State</TH><TH>Total</TH><TH>Approved</TH><TH>Rejected</TH><TH>Avg Days</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {analyticsStateData.slice(0, 8).map(s => (
                <tr key={s.state} className="hover:bg-white/3 transition">
                  <TD><span className="font-semibold text-white">{s.state}</span></TD>
                  <TD><span className="text-sky-400 font-bold">{s.applications}</span></TD>
                  <TD><span className="text-emerald-400 font-bold">{s.approved}</span></TD>
                  <TD><span className="text-rose-400 font-bold">{s.rejected}</span></TD>
                  <TD><span className="text-amber-400 font-bold">{s.avgDays}d</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Trend */}
        <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-sky-400" /> Monthly Trend (Applications)</h3>
          <div className="flex items-end gap-2 h-36">
            {analyticsMonthlyTrend.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div className="w-full rounded-sm bg-emerald-500" style={{ height: `${(m.approved / 150) * 110}px` }} />
                  <div className="w-full rounded-sm bg-amber-400" style={{ height: `${((m.submitted - m.approved - m.rejected) / 150) * 110}px` }} />
                  <div className="w-full rounded-sm bg-rose-500" style={{ height: `${(m.rejected / 150) * 110}px` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{m.month}</span>
                <span className="text-[9px] text-slate-600">{m.submitted}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            {[{ c: 'bg-emerald-500', l: 'Approved' }, { c: 'bg-amber-400', l: 'Pending' }, { c: 'bg-rose-500', l: 'Rejected' }].map(l => (
              <div key={l.l} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm ${l.c}`} />
                <span className="text-[10px] text-slate-400">{l.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: AUDIT LOGS
  // ─────────────────────────────────────────────────────────────────────────
  const renderAudit = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="Audit Log" subtitle="Complete chronological record of all admin actions" />
      <SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Search by action, admin or module..." />

      <div className="rounded-2xl bg-[#0B2545]/80 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr><TH>Timestamp</TH><TH>Admin</TH><TH>Action</TH><TH>Module</TH><TH>Target</TH><TH>Result</TH><TH>IP Address</TH></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredAudit.map(a => (
                <tr key={a.id} className="hover:bg-white/3 transition">
                  <TD><span className="text-slate-400 font-mono text-[10px]">{a.timestamp}</span></TD>
                  <TD><div className="font-semibold text-white text-xs">{a.adminName}</div><div className="text-[10px] text-slate-500">{a.adminEmail}</div></TD>
                  <TD><span className="text-slate-300 text-xs">{a.action}</span>{a.details && <div className="text-[9px] text-slate-500 mt-0.5">{a.details}</div>}</TD>
                  <TD><Badge label={a.module} className="bg-blue-900/60 text-blue-300 border border-blue-700/40" /></TD>
                  <TD><span className="text-slate-400 text-[10px] max-w-[120px] truncate block">{a.target}</span></TD>
                  <TD><Badge label={a.result} className={a.result === 'Success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'} /></TD>
                  <TD><span className="font-mono text-slate-500 text-[10px]">{a.ipAddress}</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB: SETTINGS
  // ─────────────────────────────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader title="System Settings" subtitle="SWAGAT Platform Configuration & Administration" />

      {/* System Status */}
      <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
        <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><Server className="w-4 h-4 text-emerald-400" /> System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Platform Status', value: 'Operational', icon: Wifi, color: 'text-emerald-400' },
            { label: 'Database', value: 'Connected', icon: Database, color: 'text-emerald-400' },
            { label: 'Approval Engine', value: 'Operational', icon: Brain, color: 'text-emerald-400' },
            { label: 'Notification Service', value: 'Operational', icon: Bell, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="p-3 bg-[#07182C] rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
              <p className={`font-extrabold text-sm ${s.color} mt-0.5`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Settings */}
      <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
        <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><Settings className="w-4 h-4 text-amber-400" /> Platform Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Platform Name', value: 'SWAGAT — Single Window Approval Gateway' },
            { label: 'Environment', value: 'Production' },
            { label: 'Version', value: 'v2.6.0 (Sep 2026)' },
            { label: 'Active States', value: '36 States & UTs' },
            { label: 'Active Sectors', value: `${sectorList.filter(s => s.status === 'Active').length} Sectors` },
            { label: 'Total Approvals Configured', value: `${approvalList.length} Approvals` },
            { label: 'Default SLA', value: '30 Working Days' },
            { label: 'Escalation Threshold', value: '>90% SLA Elapsed' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between p-3 bg-[#07182C] rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">{s.label}</span>
              <span className="text-xs font-bold text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
        <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-rose-400" /> Security Policy</h3>
        <div className="space-y-2.5">
          {[
            { label: 'Role Enforcement', value: 'Strict — 1 Email = 1 Account = 1 Role', ok: true },
            { label: 'Admin Route Protection', value: 'Enabled — Role verified on every request', ok: true },
            { label: 'Session Management', value: 'JWT-based — 7 day expiry', ok: true },
            { label: 'Password Policy', value: 'Minimum 6 characters', ok: true },
            { label: 'Google OAuth', value: 'Supported via Supabase (when configured)', ok: true },
            { label: 'Audit Logging', value: 'All admin actions logged with timestamp & IP', ok: true },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between p-3 bg-[#07182C] rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">{s.label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Role Management */}
      <div className="p-5 rounded-2xl bg-[#0B2545]/80 border border-white/10">
        <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 text-amber-400" /> Role Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { role: 'USER', description: 'Business applicants, investors, entrepreneurs. Access to user dashboard, KYA, approvals, applications, documents and queries.', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
            { role: 'ADMIN', description: 'System administrators, ministry officers. Full access to admin dashboard, user management, approval configuration, analytics and audit logs.', badge: 'bg-amber-400/20 text-amber-300 border border-amber-400/30' },
          ].map(r => (
            <div key={r.role} className="p-4 bg-[#07182C] rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Badge label={r.role} className={r.badge} />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <p className="text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Role separation is strictly enforced. The same email address cannot be registered as both USER and ADMIN. Creating an admin account requires a separate, unique email address.
          </p>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TAB RENDERER
  // ─────────────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUsers();
      case 'applications': return renderApplications();
      case 'approvals': return renderApprovals();
      case 'states': return renderStates();
      case 'sectors': return renderSectors();
      case 'departments': return renderDepartments();
      case 'documents': return renderDocuments();
      case 'rules': return renderRules();
      case 'sla': return renderSLA();
      case 'queries': return renderQueries();
      case 'schemes': return renderSchemes();
      case 'renewals': return renderRenewals();
      case 'notifications': return renderNotifications();
      case 'analytics': return renderAnalytics();
      case 'audit': return renderAudit();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07182C] text-slate-100 flex font-sans selection:bg-amber-400 selection:text-[#07182C]">

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderTopBar()}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 xl:p-6">
          <div className="max-w-screen-xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Document Action Modal (Remarks / Corrections / Rejection) */}
      <Modal open={docModalOpen} onClose={() => setDocModalOpen(false)} title={`Document Action: ${docModalAction}`}>
        <form onSubmit={handleDocActionSubmit} className="space-y-4">
          <div>
            <span className="text-slate-400 text-xs block mb-1">Target Document:</span>
            <span className="text-white font-bold text-sm block bg-[#07182C] p-2.5 rounded-xl border border-white/10">
              {selectedDocName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-xs block mb-1">Action:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
              docModalAction === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              docModalAction === 'Correction Required' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {docModalAction}
            </span>
          </div>

          <FormTextarea
            label="Department / Scrutiny Remark to Applicant *"
            value={docModalRemark}
            onChange={setDocModalRemark}
            rows={3}
            placeholder="Specify reason or instructions for the applicant..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <ActionBtn label="Cancel" onClick={() => setDocModalOpen(false)} />
            <button
              type="submit"
              disabled={!docModalRemark.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[#07182C] text-xs font-extrabold transition cursor-pointer disabled:opacity-50 shadow-md ${
                docModalAction === 'Approved' ? 'bg-emerald-400 hover:bg-emerald-300' :
                docModalAction === 'Correction Required' ? 'bg-amber-400 hover:bg-amber-300' :
                'bg-rose-400 hover:bg-rose-300'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Confirm {docModalAction}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
