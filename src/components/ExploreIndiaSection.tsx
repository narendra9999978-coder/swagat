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
import { IndiaVectorMap } from './IndiaVectorMap';

export const ExploreIndiaSection: React.FC = () => {
  const { openStateDetailModal, setSelectedStateFilter, updateKyaState, theme } = useSwagat();
  const isDark = theme === 'dark';
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
    <section id="section-explore-india" className={`py-20 relative overflow-hidden border-t transition-colors duration-500 ${
      isDark ? 'border-white/10' : 'border-slate-200'
    }`}>
      
      {/* Background Decorative Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]' : 'bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)]'} [background-size:24px_24px]`} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md border ${
            isDark ? 'bg-sky-500/10 border-sky-400/20 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-800'
          }`}>
            <MapPin className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            <span>Pan-India Single Window Coverage</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#102A43]'
          }`}>
            Explore clearance coverage and approval status across India
          </h2>
          <p className={`mt-3 text-base ${isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'}`}>
            Click any State or Union Territory to view available statutory approvals, processing times, and state-specific incentive policies.
          </p>
        </div>

        {/* Main Grid: Left Side Interactive Map, Right Side Searchable State List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE (7 COLS): Interactive SVG India Map */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Interactive Map Wrapper Card */}
            <div className={`rounded-3xl p-6 sm:p-7 shadow-xl border relative transition-colors duration-300 ${
              isDark ? 'bg-[#07182C] border-white/15 text-white' : 'bg-white border-[#D8E2EE] text-[#102A43] shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-[#102A43]'}`}>
                    National Clearance Map
                  </span>
                </div>
                <span className={`text-[11px] ${isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'}`}>
                  Hover or click any node
                </span>
              </div>

              {/* Clickable India Vector Map Component */}
              <div className="w-full flex justify-center py-2">
                <IndiaVectorMap
                  onSelectState={handleMapSelectState}
                  selectedStateCode={selectedStateCode}
                  selectedStateName={selectedStateName}
                />
              </div>

              {/* Bottom Map Active State Bar */}
              <div className={`mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl ${
                isDark ? 'border-white/10 bg-white/5' : 'border-[#D8E2EE] bg-[#F8FAFC]'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#102A43]'}`}>
                      {selectedStateData.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isDark ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {selectedStateData.code}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Rank #{selectedStateData.easeOfDoingBusinessRank} EoDB
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#D9E7F5]' : 'text-[#52657A]'}`}>
                    Nodal Agency: <strong className={isDark ? 'text-white' : 'text-[#102A43]'}>{selectedStateData.nodalAgency}</strong> • {selectedStateData.totalApprovals} Clearances
                  </div>
                </div>

                <button
                  onClick={() => handleOpenDetail(selectedStateData.code)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 text-[#07182C] hover:from-amber-300 hover:to-amber-200 text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <span>View {selectedStateData.name} Clearances</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE (5 COLS): Searchable/Filterable State Directory */}
          <div className={`lg:col-span-5 flex flex-col rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 transition-colors duration-300 ${
            isDark ? 'bg-[#07182C] border-white/15 text-white' : 'bg-white border-[#D8E2EE] text-[#102A43] shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
          }`}>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#102A43]'}`}>
                  All 28 States &amp; 8 Union Territories
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'}`}>
                  Select a state to inspect localized single-window regulations
                </p>
              </div>
            </div>

            {/* Search Input Filter */}
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state name or code..."
                className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border focus:outline-none transition ${
                  isDark
                    ? 'border-white/15 bg-slate-900 text-white placeholder-slate-400 focus:border-sky-400'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#102A43] placeholder-[#64748B] focus:border-[#0284C7] focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                    activeZone === zone.id
                      ? isDark
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-[#EEF7FA] text-[#102A43] font-bold border-[#0284C7]'
                      : isDark
                      ? 'bg-white/5 text-[#AFC4D8] hover:bg-white/10 border-white/10'
                      : 'bg-[#F8FAFC] text-[#52657A] hover:bg-slate-100 border-[#CBD5E1]'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            {/* Popular Hubs Fast Track Row */}
            <div className={`pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#D8E2EE]'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'}`}>
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
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-400 text-[#07182C] font-bold border-amber-400'
                            : 'bg-[#EEF7FA] text-[#102A43] font-bold border-[#0284C7]'
                          : isDark
                          ? 'bg-white/5 text-[#AFC4D8] hover:bg-white/10 border-white/10'
                          : 'bg-[#F8FAFC] text-[#334E68] hover:bg-slate-100 border-[#CBD5E1]'
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
                        ? isDark
                          ? 'bg-white/10 border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-[#EEF7FA] border-[#0284C7] shadow-xs ring-1 ring-sky-500/20'
                        : isDark
                        ? 'bg-[#07182C] border-white/10 hover:border-white/20 hover:bg-[#0D223D] text-slate-200'
                        : 'bg-white border-[#D8E2EE] hover:border-slate-300 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? isDark
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                          : isDark
                          ? 'bg-white/10 text-slate-300'
                          : 'bg-[#F1F5F9] text-[#334E68] border border-[#CBD5E1]'
                      }`}>
                        {st.code}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#102A43]'}`}>
                            {st.name}
                          </span>
                          {isPopular && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 shrink-0 border border-amber-300">
                              Hub
                            </span>
                          )}
                          <span className={`text-[9px] uppercase shrink-0 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                            {st.type}
                          </span>
                        </div>
                        <div className={`text-[11px] ${isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'}`}>
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
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-0.5 cursor-pointer border ${
                          isDark
                            ? 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                            : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#102A43] border-[#CBD5E1]'
                        }`}
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })}

              {filteredStates.length === 0 && (
                <div className={`text-center py-8 text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
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
