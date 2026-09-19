import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Layers, 
  Award, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { indiaStatesData } from '../data/indiaStatesData';

/**
 * GlobalSearchModal
 * Curated from: https://ui.watermelon.sh/animated-components/licence-key (Search / Key input)
 * Apple Command-K palette with animated glowing border beam and dark glassmorphic styling
 */
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-xl p-4 pt-16 sm:pt-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-slate-950/85 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/15 backdrop-blur-2xl overflow-hidden"
      >
        {/* Animated glowing border beam header */}
        <div className="relative border-b border-white/10 p-4 sm:p-5 flex items-center space-x-3 bg-white/5">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search approvals, schemes, departments, states (e.g. Pollution, Factory, PLI, Gujarat)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium focus:outline-none bg-transparent text-white placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 text-[10px] font-bold text-slate-300 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-6">
          
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-amber-400" />
              <div className="text-slate-200 font-semibold">Search across 1,400+ Central clearances, 28 State portals, and PLI schemes.</div>
              <div className="text-[11px] text-slate-400 flex flex-wrap justify-center gap-2 pt-1">
                <span>Try:</span>
                <span className="text-sky-400 hover:underline cursor-pointer" onClick={() => setQuery('Pollution')}>"Pollution"</span>
                <span>•</span>
                <span className="text-amber-400 hover:underline cursor-pointer" onClick={() => setQuery('PLI')}>"PLI"</span>
                <span>•</span>
                <span className="text-emerald-400 hover:underline cursor-pointer" onClick={() => setQuery('Maharashtra')}>"Maharashtra"</span>
              </div>
            </div>
          )}

          {/* Approvals Results */}
          {results.approvals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
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
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer flex items-center justify-between text-xs transition group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-300 transition-colors">{app.name}</div>
                      <div className="text-[11px] text-slate-400">{app.department} • {app.centralOrState}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schemes Results */}
          {results.schemes.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
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
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer flex items-center justify-between text-xs transition group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-purple-300 transition-colors">{sch.name}</div>
                      <div className="text-[11px] text-slate-400">{sch.maxFinancialSupport} • {sch.sector}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* States Results */}
          {results.states.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
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
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer flex items-center justify-between text-xs transition group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">{st.name} ({st.portalName})</div>
                      <div className="text-[11px] text-slate-400">{st.nodalAgency} • SLA: {st.clearanceDaysAvg} Days</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-white/5 px-5 py-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Single-Window Search Index across Central &amp; State government portals</span>
          <span className="font-mono text-amber-300">SWAGAT Quick Search</span>
        </div>

      </motion.div>
    </div>
  );
};
