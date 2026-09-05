import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  MessageSquare, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { Application, ApplicationStatus } from '../types/swagat';

export const ApplicationTrackingSection: React.FC = () => {
  const { 
    applications, 
    setSelectedApplication, 
    setSelectedQueryApp, 
    showToast,
    userProfile,
    setIsAuthModalOpen,
    setCurrentView,
    setDashboardActiveTab
  } = useSwagat();

  const [searchTrackingId, setSearchTrackingId] = useState<string>('');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim()) return;
    const found = applications.find(a => 
      a.trackingNumber.toLowerCase().includes(searchTrackingId.toLowerCase().trim()) ||
      a.approvalName.toLowerCase().includes(searchTrackingId.toLowerCase().trim())
    );
    if (found) {
      setSelectedAppId(found.id);
      showToast(`Located Application ${found.trackingNumber}`);
    } else {
      showToast(`No application found for "${searchTrackingId}".`);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Approved &amp; Certified</span>;
      case 'Under Review':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Under Department Review</span>;
      case 'Query Raised':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">Action Required: Query Raised</span>;
      case 'Response Submitted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">Response Under Scrutiny</span>;
      case 'Submitted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">Submitted / Awaiting Desk</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Draft</span>;
    }
  };

  const downloadAckSlip = (app: Application) => {
    showToast(`Downloaded Official Acknowledgement Slip for ${app.trackingNumber} (PDF format).`);
  };

  return (
    <section id="section-tracking" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#07182C] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-4 h-4 text-[#07182C]" />
            <span>National Unified Tracking Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            Real-Time Application Tracking
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Track statutory clearances with stage-by-stage transparent timelines, respond to departmental queries, and download certificates.
          </p>
        </div>

        {/* Search / Lookup Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2 p-2 rounded-2xl bg-slate-100 border border-slate-300/80 shadow-inner">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Application Tracking ID (e.g. SWG-2026-MH-78942)..."
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#07182C]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Live Application Detail & Timeline Card */}
        {activeApp && (
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg mb-10">
            
            {/* Top Bar: Tracking ID + Status + Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-slate-900 text-amber-300">
                    {activeApp.trackingNumber}
                  </span>
                  {getStatusBadge(activeApp.currentStatus)}
                  <span className="text-xs text-slate-500">
                    Submitted on <strong>{activeApp.submissionDate}</strong>
                  </span>
                </div>

                <h3 className="text-2xl font-display font-extrabold text-[#07182C] mt-2">
                  {activeApp.approvalName}
                </h3>
                <div className="text-xs text-slate-600 font-medium">
                  {activeApp.department} • {activeApp.ministry}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => downloadAckSlip(activeApp)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Ack</span>
                </button>

                {activeApp.queries.length > 0 && activeApp.queries[0].status === 'Open' && (
                  <button
                    id={`btn-track-respond-query`}
                    onClick={() => setSelectedQueryApp({ application: activeApp, query: activeApp.queries[0] })}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Respond to Query</span>
                  </button>
                )}

                {activeApp.currentStatus === 'Approved' && (
                  <button
                    onClick={() => showToast(`Downloaded digitally signed statutory certificate for ${activeApp.trackingNumber}.`)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Download Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Next Action Alert Box */}
            <div className={`my-6 p-4 rounded-2xl border flex items-start space-x-3.5 ${
              activeApp.currentStatus === 'Query Raised'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : activeApp.currentStatus === 'Approved'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}>
              {activeApp.currentStatus === 'Query Raised' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : activeApp.currentStatus === 'Approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-[#07182C] shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-wide text-[10px] block">Next Statutory Action / Status Note:</span>
                <span className="font-medium">{activeApp.nextAction}</span>
              </div>
            </div>

            {/* Visual Status Timeline (6 Stages) */}
            <div className="my-8">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                Statutory Progress Lifecycle
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
                {activeApp.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      step.completed
                        ? 'bg-white border-emerald-300 shadow-2xs'
                        : step.current
                        ? step.queryRaised
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                          : 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 shadow-xs'
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.current
                          ? step.queryRaised ? 'bg-amber-600 text-white animate-bounce' : 'bg-[#07182C] text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      {step.date && (
                        <span className="text-[10px] font-semibold text-slate-500">
                          {step.date}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-[#07182C]">
                      {step.title}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Project Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Applicant Enterprise</span>
                <span className="font-bold text-[#07182C] truncate block">{activeApp.companyName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Project Location</span>
                <span className="font-bold text-[#07182C] block">{activeApp.projectDistrict}, {activeApp.projectState}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Proposed Investment</span>
                <span className="font-bold text-[#07182C] block">{activeApp.investmentAmount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Statutory Fee Paid</span>
                <span className="font-bold text-emerald-700 block">{activeApp.statutoryFeePaid}</span>
              </div>
            </div>

          </div>
        )}

        {/* Quick Switch between other sample applications */}
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            Quickly switch sample live tracking applications:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedAppId === app.id
                    ? 'bg-[#07182C] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {app.trackingNumber} ({app.currentStatus})
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
