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
import { Application, DocumentItem, RenewalItem, BusinessType } from '../types/swagat';
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
    openWizard
  } = useSwagat();

  const [documentSearch, setDocumentSearch] = useState('');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentItem['category']>('Licenses');
  const [newDocNumber, setNewDocNumber] = useState('');

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
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
                <div>
                  <h3 className="text-xl font-display font-bold text-[#07182C]">
                    My Applications &amp; Statutory Approvals
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track the full statutory lifecycle across Central and State portals
                  </p>
                </div>

                <div className="space-y-6">
                  {applications.map((app) => (
                    <div key={app.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-300">
                              {app.trackingNumber}
                            </span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {app.currentStatus}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#07182C] mt-1.5">{app.approvalName}</h4>
                          <div className="text-xs text-slate-500">{app.department}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => showToast(`Downloaded Acknowledgement for ${app.trackingNumber}`)}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                          >
                            Ack Slip
                          </button>
                          {app.queries.length > 0 && app.queries[0].status === 'Open' && (
                            <button
                              onClick={() => setSelectedQueryApp({ application: app, query: app.queries[0] })}
                              className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                            >
                              Respond to Query
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Timeline Steps */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                        {app.timeline.map((step, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs ${
                              step.completed
                                ? 'bg-white border-emerald-300'
                                : step.current
                                ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300'
                                : 'bg-slate-100 opacity-60'
                            }`}
                          >
                            <div className="font-bold text-[#07182C]">{step.title}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{step.description}</div>
                            {step.date && <div className="text-[9px] font-semibold text-slate-400 mt-1">{step.date}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

    </div>
  );
};
