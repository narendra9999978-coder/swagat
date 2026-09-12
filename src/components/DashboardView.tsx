import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  FolderLock, 
  Compass, 
  RefreshCw, 
  MessageSquareDiff, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Building, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  Award,
  Calendar,
  ExternalLink,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { Application, DocumentItem, RenewalItem, BusinessType, ApprovalItemStatus } from '../types/swagat';
import { applicantApi } from '../services/api';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    logout, 
    setCurrentView,
    dashboardActiveTab, 
    setDashboardActiveTab,
    applications,
    documents,
    addDocument,
    renewals,
    triggerRenewal,
    deleteDocument,
    setPreviewDocument,
    setSelectedQueryApp,
    kyaState,
    showToast,
    startApplication,
    approvals,
    openWizard,
    reuploadDocument,
    refreshApplications,
    userNotifications,
    markNotifAsRead
  } = useSwagat();

  const [documentSearch, setDocumentSearch] = useState('');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentItem['category']>('Licenses');
  const [newDocNumber, setNewDocNumber] = useState('');

  // Re-upload corrected document modal state
  const [showReuploadModal, setShowReuploadModal] = useState(false);
  const [reuploadAppId, setReuploadAppId] = useState('');
  const [reuploadDocName, setReuploadDocName] = useState('');
  const [reuploadFileName, setReuploadFileName] = useState('');

  // Wizard sectors
  const [wizardSectors, setWizardSectors] = useState<BusinessType[]>([]);

  React.useEffect(() => {
    applicantApi.getBusinessTypes().then(types => {
      setWizardSectors(types);
    }).catch(err => {
      console.error('Failed to load business types', err);
    });
  }, []);

  // Dashboard Stats
  const activeApplicationsCount = applications.filter(a => ['Submitted', 'Under Review', 'Query Raised', 'Response Submitted'].includes(a.currentStatus)).length;
  const approvedCount = applications.filter(a => a.currentStatus === 'Approved').length;
  const pendingReviewCount = applications.filter(a => ['Submitted', 'Under Review'].includes(a.currentStatus)).length;
  const openQueriesCount = applications.reduce((acc, app) => acc + app.queries.filter(q => q.status === 'Open').length, 0);
  const expiringRenewalsCount = renewals.filter(r => r.daysRemaining <= 60).length;

  const filteredDocs = documents.filter(doc => {
    const matchQuery = doc.name.toLowerCase().includes(documentSearch.toLowerCase()) || doc.documentNumber.toLowerCase().includes(documentSearch.toLowerCase());
    const matchCat = documentCategoryFilter === 'All' || doc.category === documentCategoryFilter;
    return matchQuery && matchCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    addDocument({
      name: newDocName,
      category: newDocCategory,
      documentNumber: newDocNumber || `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
      issueDate: '01 Sep 2026',
      fileSize: '3.2 MB',
      fileType: 'PDF',
      verified: true,
      verificationAgency: 'DigiLocker Verified'
    });
    setShowUploadModal(false);
    setNewDocName('');
    setNewDocNumber('');
  };

  interface NavTabItem {
    id: 'overview' | 'applications' | 'approvals' | 'kya' | 'documents' | 'projects' | 'renewals' | 'queries' | 'notifications' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }

  const navTabs: NavTabItem[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: FileCheck2, badge: applications.length },
    { id: 'approvals', label: 'Active Licenses', icon: ShieldCheck, badge: approvedCount },
    { id: 'kya', label: 'Know Your Approvals', icon: Compass },
    { id: 'documents', label: 'My Documents Locker', icon: FolderLock, badge: documents.length },
    { id: 'projects', label: 'Projects & Units', icon: Building },
    { id: 'renewals', label: 'Upcoming Renewals', icon: RefreshCw, badge: expiringRenewalsCount > 0 ? expiringRenewalsCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'queries', label: 'Queries & Grievances', icon: MessageSquareDiff, badge: openQueriesCount > 0 ? openQueriesCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: userNotifications.filter(n => !n.read).length || undefined, badgeColor: 'bg-amber-500' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Header for Dashboard */}
      <div className="bg-[#07182C] text-white py-3 px-4 sm:px-8 border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1"
            >
              <span>← Back to SWAGAT Home</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>MY SWAGAT DASHBOARD</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                {userProfile?.companyName || 'Apex Precision Engineering Pvt Ltd'}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2 sticky top-20">
          
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#07182C] to-[#0B2545] text-white mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#07182C] font-extrabold flex items-center justify-center text-sm shadow-md">
                {userProfile?.avatarInitials || 'RS'}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm truncate">{userProfile?.name || 'Investor User'}</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>DigiLocker Verified</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-300 flex justify-between">
              <span>GSTIN:</span>
              <span className="font-mono text-white">{userProfile?.gstNumber}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = dashboardActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashboardActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#07182C] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#07182C]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      tab.badgeColor ? `${tab.badgeColor} text-white` : isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {dashboardActiveTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-1">
              
              {/* Top Overview Cards (5 KPI Metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                <div 
                  onClick={() => setDashboardActiveTab('applications')}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400">Active Applications</span>
                  <div className="text-2xl font-black text-[#07182C] mt-1">{activeApplicationsCount}</div>
                  <span className="text-[10px] text-blue-700 font-semibold">Under Process</span>
                </div>

                <div 
                  onClick={() => setDashboardActiveTab('approvals')}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400">Approved &amp; Certified</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Valid Licenses</span>
                </div>

                <div 
                  onClick={() => setDashboardActiveTab('applications')}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400">Pending Review</span>
                  <div className="text-2xl font-black text-sky-600 mt-1">{pendingReviewCount}</div>
                  <span className="text-[10px] text-sky-700 font-semibold">Department Scrutiny</span>
                </div>

                <div 
                  onClick={() => setDashboardActiveTab('queries')}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400">Open Queries</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">{openQueriesCount}</div>
                  <span className="text-[10px] text-amber-700 font-semibold">Requires Reply</span>
                </div>

                <div 
                  onClick={() => setDashboardActiveTab('renewals')}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400">Upcoming Renewals</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">{expiringRenewalsCount}</div>
                  <span className="text-[10px] text-rose-700 font-semibold">&lt; 60 Days Remaining</span>
                </div>

              </div>

              {/* Sector Selection Grid for 4-Step Questionnaire Wizard */}
              <div className="bg-gradient-to-br from-[#07182C] via-[#0B2545] to-[#133E70] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dynamic Decision Tree Engine</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                        Start New Business Approval Journey
                      </h3>
                      <p className="text-xs text-slate-300 max-w-2xl mt-1">
                        Select your business sector below to launch the 4-step dynamic questionnaire. Our intelligent engine automatically identifies statutory clearances, compiles your document checklist, and initiates real-time SLA countdowns.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                    {wizardSectors.map((sec) => (
                      <div
                        key={sec.id}
                        onClick={() => openWizard(sec)}
                        className="group p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400/50 cursor-pointer transition-all duration-200 backdrop-blur-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                              {sec.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-400">
                              {sec.code}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {sec.description || 'Statutory clearance tree & unified document checklist'}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                          <span>Launch 4-Step Wizard</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Applications Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-[#07182C]">
                      Active Clearances &amp; Applications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time statutory timeline progression and inspection tracking
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('home');
                      const el = document.getElementById('section-kya');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-[#07182C] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2545] transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Apply for New Approval</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <div key={app.id} className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                            {app.trackingNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            app.currentStatus === 'Query Raised' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.currentStatus}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Updated {app.lastUpdated}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#07182C]">
                          {app.approvalName}
                        </h4>

                        <p className="text-xs text-slate-500">
                          {app.department} • Next: <strong className="text-slate-700">{app.nextAction}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {app.queries.length > 0 && app.queries[0].status === 'Open' && (
                          <button
                            onClick={() => setSelectedQueryApp({ application: app, query: app.queries[0] })}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-xs flex items-center space-x-1"
                          >
                            <span>Respond to Query</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setDashboardActiveTab('applications');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                        >
                          View Timeline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Document Locker Snapshot */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-[#07182C]">
                      My Documents Locker (DigiLocker Connected)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Corporate KYC and site approvals linked to your single-window profile
                    </p>
                  </div>

                  <button
                    onClick={() => setDashboardActiveTab('documents')}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    View All {documents.length} Documents →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] text-blue-800 uppercase">{doc.category}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">✓ Verified</span>
                      </div>
                      <div className="font-bold text-slate-900 truncate">{doc.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{doc.documentNumber}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY APPLICATIONS */}
          {dashboardActiveTab === 'applications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#07182C]">
                      My Applications &amp; Statutory Approvals
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time statutory timeline, document scrutiny statuses, and approval roadmap
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={refreshApplications}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Status</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('home');
                        const el = document.getElementById('section-kya');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-[#07182C] hover:bg-[#0B2545] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Application</span>
                    </button>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No applications submitted yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                      Complete your Know Your Approvals (KYA) assessment or launch an approval journey to submit your Common Application Form.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentView('home');
                        const el = document.getElementById('section-kya');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#07182C] text-white rounded-xl text-xs font-bold hover:bg-[#0B2545] transition"
                    >
                      Launch KYA Assessment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {applications.map((app) => (
                      <div key={app.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
                        
                        {/* Application Header Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-[#07182C] text-amber-300 shadow-2xs">
                                {app.trackingNumber}
                              </span>
                              
                              {/* Overall Status Badge */}
                              {app.currentStatus === 'Approved' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Approved &amp; Certified</span>
                                </span>
                              ) : app.currentStatus === 'Query Raised' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Action Required: Query Raised</span>
                                </span>
                              ) : app.currentStatus === 'Response Submitted' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Response Under Review</span>
                                </span>
                              ) : app.currentStatus === 'Rejected' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  ✕ Rejected
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Under Department Review</span>
                                </span>
                              )}

                              <span className="text-xs text-slate-500">
                                Submitted: <strong>{app.submissionDate}</strong> • Updated: <strong>{app.lastUpdated}</strong>
                              </span>
                            </div>

                            <h4 className="text-xl font-display font-extrabold text-[#07182C] mt-2">
                              {app.approvalName}
                            </h4>
                            <div className="text-xs text-slate-600 font-medium mt-0.5">
                              {app.department} • {app.ministry}
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => showToast(`Downloaded Official Acknowledgement Slip for ${app.trackingNumber}`)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1.5 shadow-2xs transition"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span>Ack Slip</span>
                            </button>

                            {app.queries.length > 0 && app.queries[0].status === 'Open' && (
                              <button
                                onClick={() => setSelectedQueryApp({ application: app, query: app.queries[0] })}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition"
                              >
                                <MessageSquareDiff className="w-3.5 h-3.5" />
                                <span>Respond to Query</span>
                              </button>
                            )}

                            {app.currentStatus === 'Approved' && (
                              <button
                                onClick={() => showToast(`Downloaded statutory clearance certificate for ${app.trackingNumber}`)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Download Certificate</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Project & Applicant Parameters Card */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Applicant Company</span>
                            <span className="font-bold text-[#07182C] truncate block">{app.companyName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Project Location</span>
                            <span className="font-bold text-[#07182C] block">{app.projectDistrict}, {app.projectState}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Proposed Capital Outlay</span>
                            <span className="font-bold text-[#07182C] block">{app.investmentAmount}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Next Statutory Action</span>
                            <span className="font-bold text-blue-700 block truncate">{app.nextAction}</span>
                          </div>
                        </div>

                        {/* ── 1. STATUTORY PROGRESS LIFECYCLE (6-STAGE PROGRESS) ── */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Statutory Progress Lifecycle
                            </h5>
                            <span className="text-[11px] text-slate-500">Live single-window clearance tracker</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                            {[
                              { label: 'Application Submitted', completed: true, current: false },
                              { label: 'Documents Uploaded', completed: true, current: false },
                              { label: 'Application Received', completed: true, current: false },
                              { 
                                label: 'Department Review', 
                                completed: app.currentStatus === 'Approved', 
                                current: app.currentStatus === 'Under Review' || app.currentStatus === 'Submitted' || app.currentStatus === 'Response Submitted' || app.currentStatus === 'Query Raised',
                                queryRaised: app.currentStatus === 'Query Raised'
                              },
                              { label: 'Competent Approval', completed: app.currentStatus === 'Approved', current: false },
                              { label: 'Completion & License', completed: app.currentStatus === 'Approved', current: false }
                            ].map((stage, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-2xl border text-xs transition-all ${
                                  stage.completed
                                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                                    : stage.current
                                    ? stage.queryRaised
                                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 text-amber-950 font-bold'
                                      : 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 text-blue-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                    stage.completed ? 'bg-emerald-600 text-white' :
                                    stage.current ? stage.queryRaised ? 'bg-amber-500 text-slate-950' : 'bg-[#07182C] text-white' :
                                    'bg-slate-200 text-slate-600'
                                  }`}>
                                    {stage.completed ? '✓' : idx + 1}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500">Stage {idx + 1}</span>
                                </div>
                                <div className="text-[11px] leading-tight font-bold">{stage.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ── 2. DOCUMENT STATUS TABLE (AS SPECIFIED BY USER) ── */}
                        <div className="space-y-3 pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Document Verification Status
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Detailed verification state and scrutiny remarks for each required document
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="text-emerald-700 font-bold">✓ Approved</span>
                              <span className="text-blue-700 font-bold">● Under Review</span>
                              <span className="text-amber-700 font-bold">⚠ Correction Required</span>
                              <span className="text-rose-700 font-bold">✕ Rejected</span>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                    <th className="py-3 px-4">Document</th>
                                    <th className="py-3 px-3">Category</th>
                                    <th className="py-3 px-3">Verification Status</th>
                                    <th className="py-3 px-4">Scrutiny Officer Remark</th>
                                    <th className="py-3 px-3">Last Updated</th>
                                    <th className="py-3 px-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(app.documentsList || app.documentsAttached.map((d, i) => ({
                                    id: `doc-${i}`,
                                    documentName: d.name,
                                    category: d.category,
                                    uploadDate: app.submissionDate,
                                    verificationStatus: (d.verified ? 'Approved' : 'Under Review') as any,
                                    adminRemark: d.verified ? 'Verified successfully' : 'Pending department scrutiny'
                                  }))).map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                                      <td className="py-3 px-4">
                                        <div className="font-bold text-slate-900">{doc.documentName}</div>
                                        {doc.fileUrl && (
                                          <span className="text-[10px] font-mono text-slate-400">Attached File Available</span>
                                        )}
                                      </td>
                                      <td className="py-3 px-3 text-slate-600 font-medium text-[11px]">
                                        {doc.category}
                                      </td>
                                      <td className="py-3 px-3">
                                        {doc.verificationStatus === 'Approved' ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            ✓ Approved
                                          </span>
                                        ) : doc.verificationStatus === 'Correction Required' ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                            ⚠ Correction Required
                                          </span>
                                        ) : doc.verificationStatus === 'Rejected' ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                            ✕ Rejected
                                          </span>
                                        ) : doc.verificationStatus === 'Pending Upload' ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                            ○ Pending Upload
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                            ● Under Review
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-3 px-4">
                                        <span className={`text-[11px] ${doc.verificationStatus === 'Correction Required' ? 'text-amber-900 font-semibold' : 'text-slate-600'}`}>
                                          {doc.adminRemark || 'Waiting for department review'}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3 text-slate-400 font-medium text-[11px] whitespace-nowrap">
                                        {doc.uploadDate}
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        {doc.verificationStatus === 'Correction Required' ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReuploadAppId(app.id);
                                              setReuploadDocName(doc.documentName);
                                              setReuploadFileName(`Updated_${doc.documentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                                              setShowReuploadModal(true);
                                            }}
                                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-extrabold rounded-lg shadow-2xs transition inline-flex items-center space-x-1 cursor-pointer"
                                          >
                                            <Upload className="w-3 h-3" />
                                            <span>Re-upload</span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => showToast(`Previewing verified file for ${doc.documentName}`)}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg transition inline-flex items-center space-x-1"
                                          >
                                            <Eye className="w-3 h-3 text-slate-500" />
                                            <span>View</span>
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* ── 3. APPROVAL ROADMAP (APPROVAL-LEVEL STATUS SEPARATED FROM DOCUMENTS) ── */}
                        <div className="space-y-3 pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Approval Roadmap (Statutory Clearances)
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Independent clearance lifecycle per statutory department / authority
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Clearance items processed in parallel
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(app.approvalsList || [
                              {
                                id: 'appr-1',
                                approvalName: 'Company Registration',
                                department: 'Ministry of Corporate Affairs (MCA)',
                                centralOrState: 'Central' as const,
                                status: 'Approved' as const,
                                submittedDate: app.submissionDate,
                                lastUpdated: app.lastUpdated,
                                remarks: 'Incorporation authenticated via MCA'
                              },
                              {
                                id: 'appr-2',
                                approvalName: app.approvalName,
                                department: app.department,
                                centralOrState: app.centralOrState,
                                status: (app.currentStatus === 'Approved' ? 'Approved' : 'Under Review') as ApprovalItemStatus,
                                submittedDate: app.submissionDate,
                                lastUpdated: app.lastUpdated,
                                remarks: app.nextAction
                              }
                            ]).map((apr, idx) => (
                              <div
                                key={apr.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  apr.status === 'Approved' ? 'bg-emerald-50/40 border-emerald-200' :
                                  apr.status === 'Query Raised' ? 'bg-amber-50/50 border-amber-300' :
                                  apr.status === 'Under Review' ? 'bg-blue-50/40 border-blue-200' :
                                  'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-mono font-bold text-slate-500">
                                    {idx + 1}. {apr.centralOrState} Clearance
                                  </span>
                                  
                                  {apr.status === 'Approved' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      ✓ Approved
                                    </span>
                                  ) : apr.status === 'Under Review' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                      ● Under Review
                                    </span>
                                  ) : apr.status === 'Query Raised' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                      ⚠ Query Raised
                                    </span>
                                  ) : apr.status === 'Rejected' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                      ✕ Rejected
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                      ○ Pending
                                    </span>
                                  )}
                                </div>

                                <h6 className="text-sm font-bold text-[#07182C] leading-snug">
                                  {apr.approvalName}
                                </h6>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {apr.department}
                                </div>

                                {apr.remarks && (
                                  <div className="mt-2.5 p-2 rounded-xl bg-white/80 border border-slate-200 text-[11px] text-slate-700">
                                    <span className="font-bold text-slate-500">Remark: </span>{apr.remarks}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ── 4. OFFICIAL QUERIES / CLARIFICATION PANEL (IF ANY) ── */}
                        {app.queries.length > 0 && (
                          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                Official Department Query ({app.queries.length})
                              </span>
                              <span className="text-[11px] text-amber-800 font-semibold">
                                Statutory SLA Response Window
                              </span>
                            </div>

                            {app.queries.map((q) => (
                              <div key={q.id} className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2 text-xs">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="font-bold text-slate-900 block">"{q.queryText}"</span>
                                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                                      Raised by {q.raisedByOfficer} ({q.department}) on {q.dateRaised}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    q.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                    q.status === 'Responded' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                    'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                  }`}>
                                    {q.status === 'Resolved' ? '✓ Resolved' : q.status === 'Responded' ? 'Response Submitted' : 'Action Required'}
                                  </span>
                                </div>

                                {q.responseText && (
                                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                                    <span className="font-bold text-[10px] text-emerald-800 block">Your Clarification:</span>
                                    <span className="italic text-[11px]">"{q.responseText}"</span>
                                  </div>
                                )}

                                {q.status === 'Open' && (
                                  <div className="flex justify-end pt-1">
                                    <button
                                      onClick={() => setSelectedQueryApp({ application: app, query: q })}
                                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-2xs transition"
                                    >
                                      Submit Clarification &amp; Attachments
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE APPROVALS & LICENSES */}
          {dashboardActiveTab === 'approvals' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-[#07182C]">
                    Active Statutory Licenses &amp; Certificates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Digitally signed certificates stored with automatic validity monitoring
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.filter(a => a.currentStatus === 'Approved').map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          Active &amp; Compliant
                        </span>
                        <span className="text-xs font-mono text-emerald-800">{app.trackingNumber}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#07182C]">{app.approvalName}</h4>
                      <div className="text-xs text-slate-600">{app.department}</div>
                      <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Validity: <strong>10 Years (Perpetual)</strong></span>
                        <button
                          onClick={() => showToast(`Downloaded Certificate for ${app.approvalName}`)}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY DOCUMENTS LOCKER */}
          {dashboardActiveTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#07182C]">
                      My Documents Repository
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload PAN, GST, CIN, Land deeds, and Environmental NOCs once to auto-attach in applications
                    </p>
                  </div>

                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                {/* Filter & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 relative">
                    <input
                      type="text"
                      placeholder="Search documents by name or number..."
                      value={documentSearch}
                      onChange={(e) => setDocumentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={documentCategoryFilter}
                      onChange={(e) => setDocumentCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                    >
                      <option value="All">All Categories</option>
                      <option value="PAN">PAN</option>
                      <option value="GST">GST</option>
                      <option value="CIN">CIN</option>
                      <option value="Land Documents">Land Documents</option>
                      <option value="Environmental Documents">Environmental</option>
                      <option value="Licenses">Licenses &amp; NOCs</option>
                    </select>
                  </div>
                </div>

                {/* Documents Table / Grid */}
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] uppercase">
                            {doc.category}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            ✓ {doc.verificationAgency}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-[#07182C]">{doc.name}</div>
                        <div className="text-xs text-slate-500 font-mono">ID: {doc.documentNumber} • {doc.fileSize} • Uploaded {doc.uploadedAt}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewDocument(doc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => showToast(`Downloading ${doc.name}`)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: UPCOMING RENEWALS */}
          {dashboardActiveTab === 'renewals' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-[#07182C]">
                    Upcoming License Renewals &amp; Compliance Deadlines
                  </h3>
                  <p className="text-xs text-slate-500">
                    Avoid penalty fees and operational halts with 1-click statutory renewals
                  </p>
                </div>

                <div className="space-y-4">
                  {renewals.map((r) => (
                    <div
                      key={r.id}
                      className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        r.daysRemaining <= 30
                          ? 'bg-rose-50/60 border-rose-200'
                          : r.daysRemaining <= 60
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.daysRemaining <= 30
                              ? 'bg-rose-600 text-white'
                              : r.daysRemaining <= 60
                              ? 'bg-amber-500 text-slate-950 font-extrabold'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {r.daysRemaining} Days Remaining
                          </span>
                          <span className="text-xs font-mono text-slate-500">{r.licenseNumber}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#07182C]">{r.approvalName}</h4>
                        <div className="text-xs text-slate-600">
                          {r.department} • Expires on: <strong className="text-slate-900">{r.expiryDate}</strong>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right text-xs">
                          <div className="text-slate-400 text-[10px] uppercase">Renewal Fee</div>
                          <div className="font-bold text-[#07182C]">{r.renewalFee}</div>
                        </div>

                        <button
                          onClick={() => triggerRenewal(r.id)}
                          className="px-4 py-2 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-xs transition"
                        >
                          Renew License
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: QUERIES & GRIEVANCES */}
          {dashboardActiveTab === 'queries' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-[#07182C]">
                    Department Queries &amp; Grievances
                  </h3>
                  <p className="text-xs text-slate-500">
                    Respond to clarification requests raised by scrutiny officers across all ministries
                  </p>
                </div>

                <div className="space-y-4">
                  {applications.flatMap(app => app.queries.map(q => ({ app, q }))).map(({ app, q }) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          q.status === 'Open' ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse' : 'bg-emerald-600 text-white'
                        }`}>
                          Query Status: {q.status}
                        </span>
                        <span className="text-xs text-slate-400">Raised on {q.dateRaised}</span>
                      </div>

                      <div className="text-xs font-bold text-[#07182C]">
                        Application: {app.approvalName} ({app.trackingNumber})
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                        "{q.queryText}"
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Officer: <strong>{q.raisedByOfficer}</strong> ({q.department})
                      </div>

                      {q.status === 'Open' ? (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => setSelectedQueryApp({ application: app, query: q })}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
                          >
                            Submit Clarification &amp; Attachments
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 text-xs text-emerald-800 font-semibold flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Response submitted: "{q.responseText}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROJECTS & UNITS */}
          {dashboardActiveTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-[#07182C]">
                    Business Units &amp; Projects
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage multi-locational manufacturing plants, subsidiaries, and warehousing facilities
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                        Primary Manufacturing Unit
                      </span>
                      <span className="text-xs text-emerald-700 font-bold">● Active Operations</span>
                    </div>
                    <h4 className="text-base font-bold text-[#07182C]">Chakan Die-Casting Facility (Phase II)</h4>
                    <div className="text-xs text-slate-600">MIDC Chakan Industrial Area, Pune, Maharashtra</div>
                    <div className="pt-2 text-xs text-slate-500 flex justify-between">
                      <span>Investment: ₹24.5 Cr</span>
                      <span>Connected Load: 250 kVA</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-2 hover:border-slate-400 cursor-pointer">
                    <Plus className="w-6 h-6 text-slate-400" />
                    <div className="text-xs font-bold text-slate-700">Add New Unit / Branch Plant</div>
                    <div className="text-[11px] text-slate-400">Initiate fresh KYA for new location</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {dashboardActiveTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#07182C]">
                      Statutory Notifications &amp; Department Alerts
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time events for statutory clearances, document verifications, and queries
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {userNotifications.filter(n => !n.read).length} Unread Alerts
                  </div>
                </div>

                {userNotifications.length === 0 ? (
                  <div className="text-center py-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No notifications yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Notifications regarding application submissions, officer queries, and document approvals will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          notif.read ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-blue-200 shadow-xs'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              notif.type === 'Document Approved' ? 'bg-emerald-100 text-emerald-800' :
                              notif.type === 'Correction Requested' || notif.type === 'Query Raised' ? 'bg-amber-100 text-amber-900' :
                              notif.type === 'Document Rejected' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {notif.type}
                            </span>
                            {notif.trackingNumber && (
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {notif.trackingNumber}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                          </div>
                          <h5 className="text-sm font-bold text-[#07182C]">{notif.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && (
                            <button
                              type="button"
                              onClick={() => markNotifAsRead(notif.id)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                            >
                              Mark as Read
                            </button>
                          )}
                          {notif.applicationId && (
                            <button
                              type="button"
                              onClick={() => setDashboardActiveTab('applications')}
                              className="px-3 py-1 bg-[#07182C] hover:bg-[#0B2545] text-white font-bold rounded-lg text-xs transition"
                            >
                              View Application
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#07182C]">Upload to Documents Repository</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factory Building Stability Certificate"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Licenses">Licenses &amp; Clearances</option>
                  <option value="Land Documents">Land &amp; Property</option>
                  <option value="Environmental Documents">Environmental</option>
                  <option value="Company Registration">Company &amp; Board</option>
                  <option value="Other">Other Statutory Form</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document / Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. CE-STAB-2026-904"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07182C] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Re-Upload Corrected Document Modal */}
      {showReuploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#07182C]">Re-Upload Corrected Document</h3>
            <p className="text-xs text-slate-500">
              Submit the updated document requested by the scrutiny officer for <strong className="text-slate-800">{reuploadDocName}</strong>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reuploadFileName.trim()) return;
                reuploadDocument(reuploadAppId, reuploadDocName, reuploadFileName);
                setShowReuploadModal(false);
                setReuploadFileName('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Name</label>
                <input
                  type="text"
                  disabled
                  value={reuploadDocName}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Updated File Name / Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated_ETP_Flow_Diagram_v2.pdf"
                  value={reuploadFileName}
                  onChange={(e) => setReuploadFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReuploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Submit Corrected File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
