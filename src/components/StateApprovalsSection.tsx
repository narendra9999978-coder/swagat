import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { indiaStatesData, allIndianStatesList, getStateDataByCode } from '../data/indiaStatesData';
import { StateData, Approval } from '../types/swagat';
import { GlassSelect, GlassSelectOption } from './ui/GlassSelect';

export const StateApprovalsSection: React.FC = () => {
  const { 
    approvals, 
    setSelectedApproval, 
    startApplication, 
    showToast,
    selectedStateFilter,
    setSelectedStateFilter,
    theme
  } = useSwagat();
  const isDark = theme === 'dark';
  
  const [selectedStateCode, setSelectedStateCode] = useState<string>('KA');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');

  const stateOptions: GlassSelectOption[] = React.useMemo(() => {
    return [
      ...allIndianStatesList
        .filter((s) => s.type === 'State')
        .map((st) => ({
          value: st.code,
          label: `${st.name} - ${st.zone} India`,
          badge: `${st.approvalCount} Clearances`,
          group: 'All 28 Indian States',
        })),
      ...allIndianStatesList
        .filter((s) => s.type === 'UT')
        .map((ut) => ({
          value: ut.code,
          label: ut.name,
          badge: `${ut.approvalCount} Clearances`,
          group: '8 Union Territories',
        })),
    ];
  }, []);

  // Sync if selectedStateFilter changes
  React.useEffect(() => {
    if (selectedStateFilter && selectedStateFilter !== 'All') {
      const found = allIndianStatesList.find(s => s.name.toLowerCase() === selectedStateFilter.toLowerCase());
      if (found) {
        setSelectedStateCode(found.code);
      }
    }
  }, [selectedStateFilter]);

  const currentState: StateData = getStateDataByCode(selectedStateCode);

  // State specific approvals
  const stateApprovalsList = approvals.filter(
    app => app.centralOrState === 'State' && (app.stateName === currentState.name || !app.stateName)
  );

  return (
    <section id="section-states" className={`py-20 bg-transparent border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md border ${
            isDark ? 'bg-sky-500/10 border-sky-400/20 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-700'
          }`}>
            <MapPin className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            <span>State Single Window Clearance Systems</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#102A43]'
          }`}>
            Explore Approvals by State / UT
          </h2>
          <p className={`mt-3 text-base ${
            isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'
          }`}>
            Integrated with 28 State Single Window Systems &amp; Union Territory clearance portals for streamlined local licensing.
          </p>
        </div>

        {/* State Selection Bar */}
        <div className={`mb-10 rounded-2xl p-4 sm:p-5 border shadow-xl relative z-20 backdrop-blur-2xl transition-colors ${
          isDark 
            ? 'bg-[#07182C] border-white/15 shadow-black/40' 
            : 'bg-white border-[#D8E2EE] shadow-[0_10px_30px_rgba(0,0,0,0.05)]'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-amber-300' : 'text-[#0B2545]'
            }`}>
              Select Industrial State / Region:
            </div>
            <div className={`text-xs font-medium ${
              isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
            }`}>
              Click any state below to view its localized statutory clearances
            </div>
          </div>

          {/* State Dropdown Selector for All 36 States/UTs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <GlassSelect
                id="state-section-selector"
                value={selectedStateCode}
                onChange={(code) => {
                  if (code) {
                    setSelectedStateCode(code);
                    setSelectedCategoryName('All');
                  }
                }}
                options={stateOptions}
                placeholder="Select a State / Union Territory"
                searchable={true}
              />
            </div>
          </div>

          {/* Quick Popular State Destination Pills */}
          <div className="flex flex-wrap gap-2">
            {['KA', 'MH', 'GJ', 'TN', 'TS', 'UP', 'RJ', 'HR', 'DL', 'KL'].map((code) => {
              const st = allIndianStatesList.find(s => s.code === code);
              if (!st) return null;
              const isSelected = selectedStateCode === st.code;
              return (
                <button
                  key={st.code}
                  onClick={() => {
                    setSelectedStateCode(st.code);
                    setSelectedCategoryName('All');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-sky-500/25 text-white shadow-md ring-2 ring-sky-400/40 border border-sky-400/50'
                        : 'bg-[#EEF7FA] text-[#102A43] shadow-xs ring-2 ring-sky-500/30 border border-[#0284C7]'
                      : isDark
                        ? 'bg-white/10 text-[#D9E7F5] hover:bg-white/15 border border-white/10'
                        : 'bg-[#F8FAFC] text-[#334E68] hover:bg-slate-100 border border-[#CBD5E1]'
                  }`}
                >
                  <span>{st.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? isDark ? 'bg-sky-900/60 text-sky-200' : 'bg-sky-100 text-[#0369A1]'
                      : isDark ? 'bg-black/30 text-[#AFC4D8]' : 'bg-[#E8EEF5] text-[#52657A]'
                  }`}>{st.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* State Profile Banner — Clean Light Card in Light Theme (Option A) */}
        <div className={`rounded-3xl p-6 sm:p-8 shadow-xl mb-10 border transition-all ${
          isDark 
            ? 'bg-[#12365F] border-white/15 text-white shadow-black/40' 
            : 'bg-white border-[#D8E2EE] text-[#102A43] shadow-[0_12px_36px_rgba(0,0,0,0.06)]'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  {currentState.integrationStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  Ease of Doing Business Rank #{currentState.easeOfDoingBusinessRank}
                </span>
              </div>

              <h3 className={`text-3xl font-display font-extrabold ${
                isDark ? 'text-white' : 'text-[#102A43]'
              }`}>
                {currentState.name} Approvals &amp; Clearances
              </h3>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
                isDark ? 'text-[#D9E7F5]' : 'text-[#52657A]'
              }`}>
                {currentState.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className={`rounded-xl p-3.5 border ${
                  isDark ? 'bg-white/10 border-white/10' : 'bg-[#F8FAFC] border-[#D8E2EE]'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                  }`}>Nodal Agency</div>
                  <div className={`font-bold truncate mt-0.5 ${
                    isDark ? 'text-white' : 'text-[#102A43]'
                  }`}>{currentState.nodalAgency}</div>
                </div>

                <div className={`rounded-xl p-3.5 border ${
                  isDark ? 'bg-white/10 border-white/10' : 'bg-[#F8FAFC] border-[#D8E2EE]'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                  }`}>Average SLA Turnaround</div>
                  <div className={`font-bold mt-0.5 ${
                    isDark ? 'text-emerald-300' : 'text-emerald-700'
                  }`}>{currentState.clearanceDaysAvg} Business Days</div>
                </div>

                <div className={`rounded-xl p-3.5 border ${
                  isDark ? 'bg-white/10 border-white/10' : 'bg-[#F8FAFC] border-[#D8E2EE]'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                  }`}>State Support Helpline</div>
                  <div className={`font-bold flex items-center space-x-1 mt-0.5 ${
                    isDark ? 'text-amber-300' : 'text-amber-700'
                  }`}>
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{currentState.helpline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Industries in State */}
            <div className={`lg:col-span-4 rounded-2xl p-5 border space-y-3 ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-[#F8FAFC] border-[#D8E2EE]'
            }`}>
              <div className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                isDark ? 'text-amber-300' : 'text-[#102A43]'
              }`}>
                <span>Key Industrial Hubs &amp; Sectors</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentState.topIndustries.map((ind, i) => (
                  <span 
                    key={i} 
                    className="industry-chit px-3 py-1.5 rounded-xl text-xs font-semibold"
                    title={`${ind} in ${currentState.name}`}
                  >
                    {ind}
                  </span>
                ))}
              </div>

              <div className={`pt-2 border-t ${
                isDark ? 'border-white/10 text-[#D9E7F5]' : 'border-[#D8E2EE] text-[#52657A]'
              }`}>
                <div className="text-[11px]">
                  Single Window Portal: <strong className={isDark ? 'text-white' : 'text-[#102A43]'}>{currentState.portalName}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* State Approval Categories Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-display font-bold ${
              isDark ? 'text-white' : 'text-[#102A43]'
            }`}>
              Statutory Categories in {currentState.name}
            </h4>
            <span className={`text-xs font-semibold ${isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'}`}>
              {currentState.categories.length} Clearance Domains
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentState.categories.map((cat, idx) => {
              const isSelected = selectedCategoryName === cat.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCategoryName(isSelected ? 'All' : cat.name)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? isDark
                        ? 'border-sky-400/50 bg-sky-500/20 shadow-md ring-2 ring-sky-400/30'
                        : 'border-[#0284C7] bg-[#EEF7FA] shadow-sm ring-2 ring-sky-500/20'
                      : isDark
                        ? 'border-white/10 bg-[#07182C] hover:bg-[#0D223D] hover:border-white/20'
                        : 'border-[#D8E2EE] bg-white hover:border-[#0284C7]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold truncate ${
                      isDark ? 'text-[#F8FAFC]' : 'text-[#102A43]'
                    }`}>
                      {cat.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isDark
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/20'
                        : 'bg-[#E8EEF5] text-[#334E68] border-[#CBD5E1]'
                    }`}>
                      {cat.count}
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'
                  }`}>
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* List of State Approvals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-display font-bold ${
              isDark ? 'text-white' : 'text-[#102A43]'
            }`}>
              Clearances for {currentState.name}
            </h4>
            <div className={`text-xs font-medium ${
              isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
            }`}>
              Showing statutory forms integrated into SWAGAT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateApprovalsList.map((app) => (
              <div
                key={app.id}
                className={`rounded-3xl border p-6 transition-all flex flex-col justify-between space-y-4 ${
                  isDark
                    ? 'bg-[#07182C] border-white/15 hover:border-white/25 shadow-xl'
                    : 'bg-white border-[#D8E2EE] hover:border-[#0284C7]/60 shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {currentState.name} State
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                    }`}>
                      SLA: {app.processingDays} Days
                    </span>
                  </div>

                  <h5 className={`text-base font-bold leading-snug ${
                    isDark ? 'text-white' : 'text-[#102A43]'
                  }`}>
                    {app.name}
                  </h5>

                  <div className={`text-xs font-medium ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                  }`}>
                    {app.department}
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${
                    isDark ? 'text-[#D9E7F5]' : 'text-[#52657A]'
                  }`}>
                    {app.description}
                  </p>

                  <div className={`pt-2 text-[11px] font-medium ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                  }`}>
                    Fee: <strong className={isDark ? 'text-white' : 'text-[#102A43]'}>{app.statutoryFee}</strong>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <button
                    onClick={() => setSelectedApproval(app)}
                    className={`text-xs font-semibold transition cursor-pointer ${
                      isDark 
                        ? 'text-slate-300 hover:text-white' 
                        : 'text-[#334E68] hover:text-[#102A43] px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    View Details
                  </button>

                  <button
                    id={`state-apply-${app.id}`}
                    onClick={() => startApplication(app)}
                    className="px-4 py-2 text-xs font-bold !text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
