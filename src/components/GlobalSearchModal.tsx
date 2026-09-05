import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Layers, 
  Award, 
  MapPin, 
  Building2, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Command
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { indiaStatesData } from '../data/indiaStatesData';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    approvals, 
    schemes, 
    setSelectedApproval, 
    setSelectedScheme,
    setCurrentView
  } = useSwagat();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'approvals' | 'schemes' | 'states'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { approvals: [], schemes: [], states: [] };
    const q = query.toLowerCase();

    const matchedApprovals = approvals.filter(a => 
      a.name.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedSchemes = schemes.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedStates = indiaStatesData.filter(st => 
      st.name.toLowerCase().includes(q) ||
      st.nodalAgency.toLowerCase().includes(q) ||
      st.topIndustries.some(ind => ind.toLowerCase().includes(q))
    ).slice(0, 3);

    return { approvals: matchedApprovals, schemes: matchedSchemes, states: matchedStates };
  }, [query, approvals, schemes]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 backdrop-blur-sm p-4 pt-16 sm:pt-24 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Search Input Top */}
        <div className="relative border-b border-slate-200 p-4 sm:p-5 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search approvals, schemes, departments, states, FAQs (e.g. Pollution CTE, Factory, PLI, Maharashtra)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-6">
          
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-amber-500" />
              <div>Search across 1,400+ Central clearances, 28 State portals, and PLI schemes.</div>
              <div className="text-[11px] text-slate-500">
                Try searching: <span className="text-slate-700 font-semibold cursor-pointer underline" onClick={() => setQuery('Pollution')}>"Pollution"</span>, <span className="text-slate-700 font-semibold cursor-pointer underline" onClick={() => setQuery('PLI')}>"PLI"</span>, <span className="text-slate-700 font-semibold cursor-pointer underline" onClick={() => setQuery('Maharashtra')}>"Maharashtra"</span>
              </div>
            </div>
          )}

          {/* Approvals Results */}
          {results.approvals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Statutory Approvals &amp; Clearances</span>
              </div>
              <div className="space-y-1.5">
                {results.approvals.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedApproval(app);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{app.name}</div>
                      <div className="text-[11px] text-slate-500">{app.department} • {app.centralOrState}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schemes Results */}
          {results.schemes.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Government Schemes &amp; Subsidies</span>
              </div>
              <div className="space-y-1.5">
                {results.schemes.map((sch) => (
                  <div
                    key={sch.id}
                    onClick={() => {
                      setSelectedScheme(sch);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{sch.name}</div>
                      <div className="text-[11px] text-slate-500">{sch.maxFinancialSupport} • {sch.sector}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* States Results */}
          {results.states.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>State Single Window Portals</span>
              </div>
              <div className="space-y-1.5">
                {results.states.map((st) => (
                  <div
                    key={st.code}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setCurrentView('home');
                      const el = document.getElementById('section-states');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{st.name} ({st.portalName})</div>
                      <div className="text-[11px] text-slate-500">{st.nodalAgency} • SLA: {st.clearanceDaysAvg} Days</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Search unified across Central &amp; State government portals</span>
          <span className="font-mono">SWAGAT Quick Search</span>
        </div>

      </div>
    </div>
  );
};
