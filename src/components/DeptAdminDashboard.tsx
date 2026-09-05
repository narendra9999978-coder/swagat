import React, { useState, useEffect } from 'react';
import {
  FileCheck2, CheckCircle2, X, AlertTriangle, Clock, Building2,
  Download, Eye, ChevronDown, LogOut, LayoutDashboard, Search,
  Loader2, ShieldCheck, CheckSquare, Square, RefreshCw, Filter,
  Sparkles, Bell, User
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { deptAdminApi } from '../services/api';

interface QueueDoc {
  id: string;
  document_type_name: string;
  is_mandatory: boolean;
  file_url?: string;
  status: string;
  applicant_name?: string;
  company_name?: string;
  uploaded_at?: string;
}

interface QueueBundle {
  id: string;
  application_id: string;
  applicant_name: string;
  company_name: string;
  business_type: string;
  submitted_at: string;
  sla_deadline?: string;
  sla_hours: number;
  status: string;
  documents: QueueDoc[];
}

export const DeptAdminDashboard: React.FC = () => {
  const { userProfile, logout, showToast } = useSwagat();

  const [activeTab, setActiveTab] = useState<'queue' | 'approved' | 'rejected'>('queue');
  const [queue, setQueue] = useState<QueueBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState<QueueBundle | null>(null);
  const [rejectionDoc, setRejectionDoc] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingDoc, setProcessingDoc] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(Date.now());

  // Load queue
  useEffect(() => {
    loadQueue();
  }, []);

  // Tick for SLA countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await deptAdminApi.getQueue();
      setQueue(data);
    } finally {
      setLoading(false);
    }
  };

  const getDocStatus = (docId: string, original: string) => localStatuses[docId] || original;

  const handleApprove = async (docId: string) => {
    setProcessingDoc(docId);
    try {
      await deptAdminApi.approveDocument(docId);
      setLocalStatuses(prev => ({ ...prev, [docId]: 'approved' }));
      showToast('Document approved successfully.');
    } catch {
      showToast('Failed to approve. Please try again.');
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectionReason.trim()) { showToast('Please provide a rejection reason.'); return; }
    setProcessingDoc(docId);
    try {
      await deptAdminApi.rejectDocument(docId, rejectionReason);
      setLocalStatuses(prev => ({ ...prev, [docId]: 'rejected' }));
      setRejectionDoc(null);
      setRejectionReason('');
      showToast('Document rejected with reason provided.');
    } catch {
      showToast('Failed to reject. Please try again.');
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedDocs.size === 0) return;
    const toApprove = [...selectedDocs];
    for (const docId of toApprove) {
      await deptAdminApi.approveDocument(docId);
      setLocalStatuses(prev => ({ ...prev, [docId]: 'approved' }));
    }
    setSelectedDocs(new Set());
    showToast(`${toApprove.length} documents bulk-approved.`);
  };

  const toggleDocSelect = (docId: string) => {
    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId); else next.add(docId);
      return next;
    });
  };

  const formatSLA = (deadline?: string): string => {
    if (!deadline) return 'N/A';
    const diff = new Date(deadline).getTime() - now;
    if (diff <= 0) return 'BREACHED';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredQueue = queue.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q || b.applicant_name.toLowerCase().includes(q) || b.company_name.toLowerCase().includes(q) || b.application_id.toLowerCase().includes(q);
  });

  const pendingCount = queue.reduce((sum, b) => sum + b.documents.filter(d => getDocStatus(d.id, d.status) === 'pending_review').length, 0);
  const approvedCount = Object.values(localStatuses).filter(s => s === 'approved').length;
  const rejectedCount = Object.values(localStatuses).filter(s => s === 'rejected').length;
  const breachedCount = queue.filter(b => b.status === 'breached' || formatSLA(b.sla_deadline) === 'BREACHED').length;

  return (
    <div className="min-h-screen bg-[#07182C] flex flex-col">

      {/* Top Header */}
      <div className="bg-[#040E1C] border-b border-white/10 px-4 sm:px-8 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">SWAGAT</div>
                <div className="text-sm font-extrabold text-white">Department Admin Portal</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-xl">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">
                {userProfile?.departmentName || userProfile?.companyName || 'Government Department'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={loadQueue} className="p-2 text-slate-400 hover:text-white transition" title="Refresh Queue">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#07182C] border border-white/20 text-white flex items-center justify-center text-xs font-bold">
              {userProfile?.avatarInitials || 'OF'}
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-rose-400 hover:text-white hover:bg-rose-900/40 rounded-lg text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending Review', val: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
            { label: 'Approved', val: approvedCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
            { label: 'Rejected', val: rejectedCount, icon: X, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
            { label: 'SLA Breached', val: breachedCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${stat.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-2xl font-extrabold ${stat.color}`}>{stat.val}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bulk Approve Banner */}
        {selectedDocs.size > 0 && (
          <div className="mb-4 p-4 bg-blue-900/50 border border-blue-500/40 rounded-2xl flex items-center justify-between">
            <span className="text-sm text-blue-200 font-semibold">{selectedDocs.size} document(s) selected</span>
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedDocs(new Set())} className="text-xs text-slate-400 hover:text-white">
                Clear
              </button>
              <button
                onClick={handleBulkApprove}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Bulk Approve ({selectedDocs.size})</span>
              </button>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by applicant, company, or application ID…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/10 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm transition">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Queue */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white font-bold">No bundles in queue</p>
            <p className="text-slate-400 text-sm mt-1">All caught up! Refresh to check for new assignments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQueue.map((bundle) => {
              const slaCountdown = formatSLA(bundle.sla_deadline);
              const isBreached = bundle.status === 'breached' || slaCountdown === 'BREACHED';
              const isExpanded = selectedBundle?.id === bundle.id;

              return (
                <div
                  key={bundle.id}
                  className={`bg-white/5 border rounded-2xl overflow-hidden transition ${
                    isBreached ? 'border-rose-500/50' : 'border-white/10'
                  }`}
                >
                  {/* Bundle header */}
                  <button
                    className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition"
                    onClick={() => setSelectedBundle(isExpanded ? null : bundle)}
                  >
                    <div className="flex items-start space-x-4 text-left">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isBreached ? 'bg-rose-500/20' : 'bg-blue-500/20'
                      }`}>
                        <FileCheck2 className={`w-5 h-5 ${isBreached ? 'text-rose-400' : 'text-blue-400'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{bundle.company_name}</div>
                        <div className="text-xs text-slate-400">{bundle.applicant_name} • {bundle.business_type}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">App #{bundle.application_id.substring(0, 16)}…</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* SLA Countdown */}
                      <div className={`text-right ${isBreached ? 'text-rose-400' : 'text-amber-400'}`}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SLA</div>
                        <div className="text-sm font-mono font-extrabold">
                          {slaCountdown}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          isBreached ? 'bg-rose-500/20 text-rose-400' :
                          bundle.status === 'in_review' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {isBreached ? 'BREACHED' : bundle.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{bundle.documents.length} docs</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Document List */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 space-y-3 bg-black/20">
                      {bundle.documents.map((doc) => {
                        const docStatus = getDocStatus(doc.id, doc.status);
                        const isSelected = selectedDocs.has(doc.id);

                        return (
                          <div
                            key={doc.id}
                            className={`rounded-xl border p-4 ${
                              docStatus === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' :
                              docStatus === 'rejected' ? 'border-rose-500/30 bg-rose-500/5' :
                              'border-white/10 bg-white/5'
                            }`}
                          >
                            {/* Rejection reason input */}
                            {rejectionDoc === doc.id && (
                              <div className="mb-3 p-3 bg-rose-900/30 rounded-xl border border-rose-500/30">
                                <label className="text-xs text-rose-300 font-bold block mb-1.5">Rejection Reason (Required)</label>
                                <textarea
                                  value={rejectionReason}
                                  onChange={e => setRejectionReason(e.target.value)}
                                  placeholder="Provide a clear reason for rejection…"
                                  rows={2}
                                  className="w-full text-xs text-white bg-black/30 border border-rose-500/30 rounded-lg p-2 focus:outline-none resize-none placeholder-slate-600"
                                />
                                <div className="flex space-x-2 mt-2">
                                  <button
                                    onClick={() => handleReject(doc.id)}
                                    disabled={!!processingDoc}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                                  >
                                    {processingDoc === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                                    <span>Confirm Reject</span>
                                  </button>
                                  <button
                                    onClick={() => { setRejectionDoc(null); setRejectionReason(''); }}
                                    className="px-3 py-1.5 text-slate-400 hover:text-white text-xs rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-3">
                              {/* Checkbox */}
                              {docStatus === 'pending_review' && (
                                <button onClick={() => toggleDocSelect(doc.id)} className="shrink-0">
                                  {isSelected
                                    ? <CheckSquare className="w-4 h-4 text-blue-400" />
                                    : <Square className="w-4 h-4 text-slate-600" />}
                                </button>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{doc.document_type_name}</div>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  {doc.is_mandatory && (
                                    <span className="text-[10px] text-rose-400 font-bold">Mandatory</span>
                                  )}
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    docStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                    docStatus === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                                    'bg-slate-500/20 text-slate-400'
                                  }`}>
                                    {docStatus.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2 shrink-0">
                                {doc.file_url && doc.file_url !== '#' && (
                                  <>
                                    <button className="flex items-center space-x-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs rounded-lg transition">
                                      <Eye className="w-3 h-3" />
                                      <span>View</span>
                                    </button>
                                    <button className="flex items-center space-x-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs rounded-lg transition">
                                      <Download className="w-3 h-3" />
                                      <span>Download</span>
                                    </button>
                                  </>
                                )}
                                {docStatus === 'pending_review' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(doc.id)}
                                      disabled={!!processingDoc}
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                                    >
                                      {processingDoc === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => setRejectionDoc(doc.id === rejectionDoc ? null : doc.id)}
                                      disabled={!!processingDoc}
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-lg transition border border-rose-500/30 disabled:opacity-50"
                                    >
                                      <X className="w-3 h-3" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
