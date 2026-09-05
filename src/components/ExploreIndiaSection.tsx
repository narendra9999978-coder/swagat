import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  ArrowRight, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { allIndianStatesList, StateItemSimple, getStateDataByCode } from '../data/indiaStatesData';
import { useSwagat } from '../context/SwagatContext';

export const ExploreIndiaSection: React.FC = () => {
  const { openStateDetailModal, setSelectedStateFilter, updateKyaState } = useSwagat();
  const [selectedStateName, setSelectedStateName] = useState<string>('Karnataka');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('KA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeZone, setActiveZone] = useState<string>('All');

  const popularStateCodes = ['KA', 'MH', 'GJ', 'TN', 'TS', 'UP', 'RJ', 'HR', 'DL', 'KL'];

  const zones = [
    { id: 'All', label: 'All (36)' },
    { id: 'North', label: 'North' },
    { id: 'South', label: 'South' },
    { id: 'West', label: 'West' },
    { id: 'East', label: 'East' },
    { id: 'Central', label: 'Central' },
    { id: 'North East', label: 'North East' },
    { id: 'UT', label: 'Union Territories (8)' }
  ];

  const filteredStates = useMemo(() => {
    return allIndianStatesList.filter((st) => {
      // Zone filter
      if (activeZone === 'UT') {
        if (st.type !== 'UT') return false;
      } else if (activeZone !== 'All') {
        if (st.zone !== activeZone || st.type === 'UT') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return st.name.toLowerCase().includes(q) || st.code.toLowerCase().includes(q);
      }

      return true;
    });
  }, [searchQuery, activeZone]);

  const handleMapSelectState = (name: string, code: string) => {
    setSelectedStateName(name);
    setSelectedStateCode(code);
  };

  const handleOpenDetail = (code: string) => {
    openStateDetailModal(code);
  };

  const selectedStateData = useMemo(() => {
    return getStateDataByCode(selectedStateCode);
  }, [selectedStateCode]);

  return (
    <section id="section-explore-india" className="py-20 bg-white border-t border-slate-200 relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-50/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Pan-India Single Window Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            Explore clearance coverage and approval status across India
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Click any State or Union Territory to view available statutory approvals, processing times, and state-specific incentive policies.
          </p>
        </div>

        {/* Main Grid: Left Side Interactive Map, Right Side Searchable State List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE (7 COLS): Interactive SVG India Map */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Interactive Map Wrapper Card */}
            <div className="bg-[#07182C] rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 text-white relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    National Clearance Map
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Hover or click any node
                </span>
              </div>

              {/* Static Map Image */}
              <div className="w-full flex justify-center py-3">
                <img
                  src="/india_states_map.svg"
                  alt="National Clearance Map of India"
                  className="w-full max-h-[460px] object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Bottom Map Active State Bar */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-3.5 rounded-2xl">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-white">
                      {selectedStateData.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {selectedStateData.code}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Rank #{selectedStateData.easeOfDoingBusinessRank} EoDB
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Nodal Agency: <strong className="text-white">{selectedStateData.nodalAgency}</strong> • {selectedStateData.totalApprovals} Clearances
                  </div>
                </div>

                <button
                  onClick={() => handleOpenDetail(selectedStateData.code)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 text-[#07182C] hover:from-amber-300 hover:to-amber-200 text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 shrink-0"
                >
                  <span>View {selectedStateData.name} Clearances</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE (5 COLS): Searchable/Filterable State Directory */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#07182C]">
                  All 28 States &amp; 8 Union Territories
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a state to inspect localized single-window regulations
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {filteredStates.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state or UT (e.g. Karnataka, Gujarat)..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Zone Filter Chips */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    activeZone === zone.id
                      ? 'bg-[#07182C] text-amber-300 shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            {/* Popular Hubs Fast Track Row */}
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Popular Industrial Destinations:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularStateCodes.map((code) => {
                  const item = allIndianStatesList.find(s => s.code === code);
                  if (!item) return null;
                  const isSelected = selectedStateCode === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleMapSelectState(item.name, item.code)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-[#07182C] font-bold ring-1 ring-amber-500'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable State List Items */}
            <div className="overflow-y-auto max-h-[380px] space-y-2 pr-1 pt-2">
              {filteredStates.map((st) => {
                const isSelected = selectedStateCode === st.code;
                const isPopular = popularStateCodes.includes(st.code);
                return (
                  <div
                    key={st.code}
                    onClick={() => handleMapSelectState(st.name, st.code)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#07182C] shadow-md ring-2 ring-[#07182C]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-[#07182C] text-amber-300' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {st.code}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {st.name}
                          </span>
                          {isPopular && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 shrink-0">
                              Hub
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 uppercase shrink-0">
                            {st.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {st.approvalCount} Approvals • {st.zone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(st.code);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-0.5"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })}

              {filteredStates.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No state or territory found matching "{searchQuery}".
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
