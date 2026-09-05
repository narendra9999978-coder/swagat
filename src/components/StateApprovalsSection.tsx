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

export const StateApprovalsSection: React.FC = () => {
  const { 
    approvals, 
    setSelectedApproval, 
    startApplication, 
    showToast,
    selectedStateFilter,
    setSelectedStateFilter 
  } = useSwagat();
  
  const [selectedStateCode, setSelectedStateCode] = useState<string>('KA');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [searchStateText, setSearchStateText] = useState<string>('');

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
    <section id="section-states" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>State Single Window Clearance Systems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            Explore Approvals by State / UT
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Integrated with 28 State Single Window Systems &amp; Union Territory clearance portals for streamlined local licensing.
          </p>
        </div>

        {/* State Selection Bar */}
        <div className="mb-10 bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Industrial State / Region:
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Click any state below to view its localized statutory clearances
            </div>
          </div>

          {/* State Dropdown Selector for All 36 States/UTs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <select
                value={selectedStateCode}
                onChange={(e) => {
                  setSelectedStateCode(e.target.value);
                  setSelectedCategoryName('All');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-[#07182C] focus:ring-2 focus:ring-[#07182C]"
              >
                <optgroup label="All 28 Indian States">
                  {allIndianStatesList.filter(s => s.type === 'State').map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.approvalCount} Clearances) - {st.zone} India
                    </option>
                  ))}
                </optgroup>
                <optgroup label="8 Union Territories">
                  {allIndianStatesList.filter(s => s.type === 'UT').map((ut) => (
                    <option key={ut.code} value={ut.code}>
                      {ut.name} ({ut.approvalCount} Clearances)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Quick Popular State Destination Pills */}
          <div className="flex flex-wrap gap-2">
            {['KA', 'MH', 'GJ', 'TN', 'TS', 'UP', 'RJ', 'HR', 'DL', 'KL'].map((code) => {
              const st = allIndianStatesList.find(s => s.code === code);
              if (!st) return null;
              return (
                <button
                  key={st.code}
                  onClick={() => {
                    setSelectedStateCode(st.code);
                    setSelectedCategoryName('All');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    selectedStateCode === st.code
                      ? 'bg-[#07182C] text-amber-300 shadow-md ring-2 ring-[#07182C]'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{st.name}</span>
                  <span className="text-[10px] opacity-70 px-1 py-0.2 rounded bg-black/10">{st.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* State Profile Banner */}
        <div className="bg-gradient-to-br from-[#07182C] via-[#0D2F57] to-[#07182C] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentState.integrationStatus}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ease of Doing Business Rank #{currentState.easeOfDoingBusinessRank}
                </span>
              </div>

              <h3 className="text-3xl font-display font-extrabold text-white">
                {currentState.name} Approvals &amp; Clearances
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {currentState.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Nodal Agency</div>
                  <div className="font-bold text-white truncate">{currentState.nodalAgency}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Average SLA Turnaround</div>
                  <div className="font-bold text-emerald-300">{currentState.clearanceDaysAvg} Business Days</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">State Support Helpline</div>
                  <div className="font-bold text-amber-300 flex items-center space-x-1">
                    <PhoneCall className="w-3 h-3" />
                    <span>{currentState.helpline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Industries in State */}
            <div className="lg:col-span-4 bg-white/10 rounded-2xl p-5 border border-white/15 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Key Industrial Hubs &amp; Sectors
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentState.topIndustries.map((ind, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/15 text-slate-200">
                    {ind}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] text-slate-300">
                  Single Window Portal: <strong className="text-white">{currentState.portalName}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* State Approval Categories Grid (Requested: Business Registration, Factory & Labour, Pollution, Fire, Land, Electricity, Construction, Trade, etc.) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-display font-bold text-[#07182C]">
              Statutory Categories in {currentState.name}
            </h4>
            <span className="text-xs text-slate-500">{currentState.categories.length} Clearance Domains</span>
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
                      ? 'border-[#07182C] bg-blue-50/70 shadow-md ring-2 ring-[#07182C]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#07182C] truncate">{cat.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#07182C] text-white">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
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
            <h4 className="text-lg font-display font-bold text-[#07182C]">
              Clearances for {currentState.name}
            </h4>
            <div className="text-xs font-medium text-slate-500">
              Showing statutory forms integrated into SWAGAT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateApprovalsList.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {currentState.name} State
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      SLA: {app.processingDays} Days
                    </span>
                  </div>

                  <h5 className="text-base font-bold text-[#07182C] leading-snug">
                    {app.name}
                  </h5>

                  <div className="text-xs text-slate-500">
                    {app.department}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 font-medium">
                    Fee: <strong className="text-slate-800">{app.statutoryFee}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedApproval(app)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    View Details
                  </button>

                  <button
                    id={`state-apply-${app.id}`}
                    onClick={() => startApplication(app)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-xs transition"
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
