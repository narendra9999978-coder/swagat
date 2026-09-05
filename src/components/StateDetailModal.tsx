import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  Layers, 
  Award, 
  CheckCircle2, 
  Search, 
  FileText,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const StateDetailModal: React.FC = () => {
  const { 
    selectedStateForModal, 
    closeStateDetailModal, 
    approvals, 
    schemes, 
    setSelectedApproval, 
    startApplication,
    updateKyaState,
    setCurrentView
  } = useSwagat();

  const [activeTab, setActiveTab] = useState<'overview' | 'state-approvals' | 'central-applicable' | 'schemes'>('overview');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  if (!selectedStateForModal) return null;

  const state = selectedStateForModal;

  // Filter state approvals
  const stateApprovals = approvals.filter(
    (app) => app.centralOrState === 'State' && (app.stateName === state.name || !app.stateName)
  );

  // Central approvals applicable in this state
  const centralApprovals = approvals.filter(
    (app) => app.centralOrState === 'Central'
  );

  // Schemes applicable in this state
  const stateSchemes = schemes.filter(
    (s) => s.level === 'State' && (s.stateName === state.name || !s.stateName)
  );

  const filteredStateApprovals = stateApprovals.filter((app) => {
    if (categoryFilter !== 'All' && app.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.department.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartKyaForState = () => {
    updateKyaState({ state: state.name });
    closeStateDetailModal();
    const el = document.getElementById('section-kya');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-[#07182C] via-[#0D2F57] to-[#07182C] text-white p-6 sm:p-7 relative shrink-0">
          
          {/* Close Button */}
          <button
            onClick={closeStateDetailModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              State Single Window Portal
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              {state.integrationStatus}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
              Rank #{state.easeOfDoingBusinessRank} Ease of Doing Business
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center space-x-3">
                <span>{state.name}</span>
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-white/10 text-amber-300 border border-white/15">
                  {state.code}
                </span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-normal">
                {state.description}
              </p>
            </div>
          </div>

          {/* Key Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nodal Agency</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">{state.nodalAgency}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Approvals</div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">{state.totalApprovals} Statutory Clearances</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Clearance Time</div>
              <div className="text-xs font-bold text-emerald-300 mt-0.5">{state.clearanceDaysAvg} Business Days (SLA)</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Helpline</div>
              <div className="text-xs font-bold text-sky-300 mt-0.5 flex items-center space-x-1">
                <PhoneCall className="w-3 h-3" />
                <span>{state.helpline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 shrink-0 flex space-x-6 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#07182C] text-[#07182C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview &amp; Industrial Profile
          </button>
          <button
            onClick={() => setActiveTab('state-approvals')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'state-approvals'
                ? 'border-[#07182C] text-[#07182C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>State Approvals &amp; Clearances</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {stateApprovals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('central-applicable')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'central-applicable'
                ? 'border-[#07182C] text-[#07182C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Applicable Central Approvals</span>
            <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[10px]">
              Pan-India
            </span>
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'schemes'
                ? 'border-[#07182C] text-[#07182C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Incentive Policies &amp; Schemes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {stateSchemes.length}
            </span>
          </button>
        </div>

        {/* Tab Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Focus Sectors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Priority Industrial Sectors in {state.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {state.topIndustries.map((ind, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-950 border border-blue-200 text-xs font-semibold"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clearance Categories Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Statutory Department Clearance Clusters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {state.categories.map((cat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{cat.description}</div>
                      </div>
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                        {cat.count} Clearances
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal Integration Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">Official State Portal</div>
                  <div className="text-base font-extrabold text-white mt-0.5">{state.portalName}</div>
                  <div className="text-xs text-slate-300 mt-1">Single-window interface interconnected with National SWAGAT API gateway.</div>
                </div>
                <button
                  onClick={handleStartKyaForState}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#07182C] font-bold text-xs rounded-xl transition-all shrink-0 flex items-center space-x-1.5 shadow-md"
                >
                  <span>Start KYA for {state.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STATE APPROVALS */}
          {activeTab === 'state-approvals' && (
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={`Search ${state.name} approvals (e.g. 'Pollution', 'Land', 'Fire', 'Power')...`}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* Approvals List */}
              <div className="space-y-3">
                {filteredStateApprovals.map((app) => (
                  <div 
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400/60 bg-white transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {app.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          SLA: {app.processingDays} Days
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{app.name}</h5>
                      <p className="text-xs text-slate-500 line-clamp-1">{app.department}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedApproval(app);
                          closeStateDetailModal();
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          startApplication(app);
                          closeStateDetailModal();
                        }}
                        className="px-3 py-1.5 bg-[#07182C] hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredStateApprovals.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No approvals match the specified search term in this state.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CENTRAL APPROVALS APPLICABLE */}
          {activeTab === 'central-applicable' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  These Central Government statutory licenses and approvals apply uniformly across all districts in <strong>{state.name}</strong> and are pre-integrated into the SWAGAT national portal.
                </span>
              </div>

              <div className="space-y-3">
                {centralApprovals.slice(0, 8).map((app) => (
                  <div 
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                          {app.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Central Ministry
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{app.name}</h5>
                      <p className="text-xs text-slate-500 line-clamp-1">{app.ministry}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedApproval(app);
                          closeStateDetailModal();
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          startApplication(app);
                          closeStateDetailModal();
                        }}
                        className="px-3 py-1.5 bg-[#07182C] hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCHEMES & INCENTIVES */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Industrial investment policies, MSME capital subsidies, stamp duty rebates, and power tariff subsidies offered by the Government of <strong>{state.name}</strong>.
                </span>
              </div>

              <div className="space-y-3">
                {stateSchemes.map((sch) => (
                  <div 
                    key={sch.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {sch.sector} Policy
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {sch.maxFinancialSupport}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900">{sch.name}</h5>
                    <p className="text-xs text-slate-600">{sch.benefits}</p>
                  </div>
                ))}

                {stateSchemes.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Specific state subsidy schemes are currently being updated by the state nodal cell. You can still apply for National PLI and MSME schemes.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Official Nodal Helpdesk: <strong className="text-slate-800">{state.helpline}</strong>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={closeStateDetailModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartKyaForState}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#07182C] hover:bg-slate-800 text-amber-300 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Know Your Approvals for {state.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
