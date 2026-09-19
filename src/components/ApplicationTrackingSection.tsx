import React, { useState, useEffect } from 'react';
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
  QrCode
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { Application, ApplicationStatus } from '../types/swagat';
import { loadAllApplications } from '../lib/applicationStore';
import { StatusMark, StatusVariant } from './ui/StatusMark';
import { QRCodeDisplay } from './ui/QRCodeDisplay';
import { GlassDataTable, Column } from './ui/GlassDataTable';

/**
 * ApplicationTrackingSection
 * Curated with:
 * - Watermelon Table 1 (All Applications DataTable)
 * - Watermelon Licence-Key / Search input
 * - Reactbits Status-Mark (Radar Pulse)
 * - Watermelon Show-QR (Verification Card)
 */
export const ApplicationTrackingSection: React.FC = () => {
  const { 
    applications, 
    setSelectedApplication, 
    setSelectedQueryApp, 
    showToast,
    userProfile,
    setIsAuthModalOpen,
    setCurrentView,
    setDashboardActiveTab,
    refreshApplications
  } = useSwagat();

  const [allApps, setAllApps] = useState<Application[]>(() => loadAllApplications());
  const [searchTrackingId, setSearchTrackingId] = useState<string>('');
  const [selectedAppId, setSelectedAppId] = useState<string>(() => loadAllApplications()[0]?.id || '');
  const [showQrModal, setShowQrModal] = useState(false);

  // Refresh allApps when store updates
  useEffect(() => {
    const handleSync = () => setAllApps(loadAllApplications());
    window.addEventListener('swagat_applications_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('swagat_applications_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const activeApp = allApps.find(a => a.id === selectedAppId) || allApps[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim()) return;
    const currentList = loadAllApplications();
    setAllApps(currentList);
    const found = currentList.find(a => 
      a.trackingNumber.toLowerCase().includes(searchTrackingId.toLowerCase().trim()) ||
      a.approvalName.toLowerCase().includes(searchTrackingId.toLowerCase().trim()) ||
      (a.companyName && a.companyName.toLowerCase().includes(searchTrackingId.toLowerCase().trim()))
    );
    if (found) {
      setSelectedAppId(found.id);
      showToast(`Located Application ${found.trackingNumber}`);
    } else {
      showToast(`No application found for "${searchTrackingId}".`);
    }
  };

  const getStatusVariant = (status: ApplicationStatus): StatusVariant => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Under Review':
        return 'pending';
      case 'Query Raised':
        return 'warning';
      case 'Response Submitted':
        return 'active';
      case 'Rejected':
        return 'danger';
      default:
        return 'pending';
    }
  };

  const downloadAckSlip = (app: Application) => {
    showToast(`Downloaded Official Acknowledgement Slip for ${app.trackingNumber} (PDF format).`);
  };

  // Watermelon Table 1 columns configuration
  const columns: Column<Application>[] = [
    {
      key: 'trackingNumber',
      header: 'Tracking URN',
      render: (app) => (
        <span className="font-mono font-bold text-amber-300">{app.trackingNumber}</span>
      ),
    },
    {
      key: 'approvalName',
      header: 'Clearance Name',
      render: (app) => (
        <div>
          <span className="font-semibold text-white block">{app.approvalName}</span>
          <span className="text-[10px] text-slate-400">{app.department}</span>
        </div>
      ),
    },
    {
      key: 'currentStatus',
      header: 'Status',
      render: (app) => (
        <StatusMark
          status={getStatusVariant(app.currentStatus)}
          label={app.currentStatus}
          size="sm"
        />
      ),
    },
    {
      key: 'submissionDate',
      header: 'Filed Date',
      render: (app) => <span className="text-slate-300">{app.submissionDate}</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (app) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAppId(app.id);
          }}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-[11px] font-semibold transition"
        >
          Inspect
        </button>
      ),
    },
  ];

  return (
    <section id="section-tracking" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 text-sky-400 border border-white/10 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Activity className="w-4 h-4" />
            <span>National Unified Tracking Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Real-Time Application Tracking
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Track statutory clearances with stage-by-stage transparent timelines, respond to departmental queries, and download certificates.
          </p>
        </div>

        {/* Search / Lookup Bar with Watermelon Licence-Key styling */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Tracking URN (e.g. SWG-2026-MH-78942)..."
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Live Application Detail & Timeline Card */}
        {activeApp && (
          <div className="bg-slate-950/70 rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl mb-12 text-white">
            
            {/* Top Bar: Tracking ID + Status + Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-white/10 text-amber-300 border border-white/10">
                    {activeApp.trackingNumber}
                  </span>
                  <StatusMark
                    status={getStatusVariant(activeApp.currentStatus)}
                    label={activeApp.currentStatus}
                  />
                  <span className="text-xs text-slate-400">
                    Submitted on <strong>{activeApp.submissionDate}</strong>
                  </span>
                </div>

                <h3 className="text-2xl font-display font-extrabold text-white mt-2">
                  {activeApp.approvalName}
                </h3>
                <div className="text-xs text-slate-400 font-medium">
                  {activeApp.department} • {activeApp.ministry}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>{showQrModal ? 'Hide QR Code' : 'Verify QR Code'}</span>
                </button>

                <button
                  onClick={() => downloadAckSlip(activeApp)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download Ack</span>
                </button>

                {activeApp.queries.length > 0 && activeApp.queries[0].status === 'Open' && (
                  <button
                    id={`btn-track-respond-query`}
                    onClick={() => setSelectedQueryApp({ application: activeApp, query: activeApp.queries[0] })}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Respond to Query</span>
                  </button>
                )}

                {activeApp.currentStatus === 'Approved' && (
                  <button
                    onClick={() => showToast(`Downloaded digitally signed statutory certificate for ${activeApp.trackingNumber}.`)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Download Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* QR Code Animated Drawer (Watermelon Show-QR) */}
            {showQrModal && (
              <div className="my-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <QRCodeDisplay
                  value={`https://swagat.gov.in/verify?urn=${activeApp.trackingNumber}`}
                  trackingNumber={activeApp.trackingNumber}
                  title="Official Digilocker URN Validation"
                  onDownloadSlip={() => downloadAckSlip(activeApp)}
                />
              </div>
            )}

            {/* Next Action Alert Box */}
            <div className={`my-6 p-4 rounded-2xl border flex items-start space-x-3.5 backdrop-blur-md ${
              activeApp.currentStatus === 'Query Raised'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : activeApp.currentStatus === 'Approved'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
            }`}>
              {activeApp.currentStatus === 'Query Raised' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : activeApp.currentStatus === 'Approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-wide text-[10px] block text-slate-300">Next Statutory Action / Status Note:</span>
                <span className="font-medium">{activeApp.nextAction}</span>
              </div>
            </div>

            {/* Visual Status Timeline (5 Stages) */}
            <div className="my-8">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Statutory Progress Lifecycle
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
                {activeApp.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      step.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : step.current
                        ? step.queryRaised
                          ? 'bg-amber-500/15 border-amber-400/50 shadow-md text-white'
                          : 'bg-sky-500/15 border-sky-400/50 shadow-md text-white'
                        : 'bg-white/5 border-white/5 opacity-50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-500 text-slate-950'
                          : step.current
                          ? step.queryRaised ? 'bg-amber-400 text-slate-950' : 'bg-sky-400 text-slate-950'
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      {step.date && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {step.date}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold">
                      {step.title}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 leading-tight">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Project Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Applicant Enterprise</span>
                <span className="font-bold text-white truncate block">{activeApp.companyName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Project Location</span>
                <span className="font-bold text-white block">{activeApp.projectDistrict}, {activeApp.projectState}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Proposed Investment</span>
                <span className="font-bold text-white block">{activeApp.investmentAmount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Statutory Fee Paid</span>
                <span className="font-bold text-emerald-400 block">{activeApp.statutoryFeePaid}</span>
              </div>
            </div>

          </div>
        )}

        {/* Watermelon Table 1: All Applications Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white">All Active Applications on Portal</h4>
            <span className="text-xs text-slate-400">{allApps.length} total dossiers</span>
          </div>

          <GlassDataTable
            columns={columns}
            data={allApps}
            keyExtractor={(app) => app.id}
            onRowClick={(app) => {
              setSelectedAppId(app.id);
              showToast(`Selected Application ${app.trackingNumber}`);
            }}
          />
        </div>

      </div>
    </section>
  );
};
