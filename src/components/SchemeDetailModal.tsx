import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { BackButton } from './ui/BackButton';

/**
 * SchemeDetailModal
 * Curated from: https://ui.watermelon.sh/components/dialog (Dialog 4: Scrollable Dialog)
 * Deep dark glassmorphism scrollable sheet with sticky header & footer
 */
export const SchemeDetailModal: React.FC = () => {
  const { selectedScheme, setSelectedScheme, showToast } = useSwagat();

  if (!selectedScheme) return null;

  const handleApply = () => {
    showToast(`Registered application for ${selectedScheme.name}. Financial claim docket created.`);
    setSelectedScheme(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="bg-slate-950/90 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/15 backdrop-blur-2xl relative my-8 max-h-[90vh] flex flex-col overflow-hidden text-white"
      >
        {/* Sticky Glass Header */}
        <div className="sticky top-0 z-20 p-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton onClick={() => setSelectedScheme(null)} label="Close" />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {selectedScheme.level} Scheme
            </span>
          </div>

          <button
            onClick={() => setSelectedScheme(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                {selectedScheme.sector}
              </span>
              {selectedScheme.deadline && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  {selectedScheme.deadline}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {selectedScheme.name}
            </h3>
            <div className="text-xs text-slate-400 font-medium mt-1">
              {selectedScheme.department} • {selectedScheme.ministry}
            </div>
          </div>

          {/* Financial Outlay Glass Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-emerald-950/60 border border-emerald-500/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Scheme Outlay / Max Grant</div>
              <div className="text-2xl font-extrabold text-white mt-0.5">{selectedScheme.maxFinancialSupport}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Application Window</span>
            </span>
          </div>

          {/* Details Content */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2">
                Financial Incentives &amp; Subsidies
              </h4>
              <p className="leading-relaxed text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                {selectedScheme.benefits}
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2">
                Eligibility &amp; Qualification Criteria
              </h4>
              <ul className="space-y-2">
                {selectedScheme.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-200">{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2">
                Required Attachment Dossiers
              </h4>
              <ul className="space-y-1.5">
                {selectedScheme.documents.map((doc, i) => (
                  <li key={i} className="text-slate-300 flex items-center space-x-2 bg-white/5 p-2 rounded-xl border border-white/5">
                    <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Glass Footer */}
        <div className="sticky bottom-0 z-20 p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedScheme(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition"
          >
            Back to Directory
          </button>

          <button
            id="btn-scheme-modal-apply"
            onClick={handleApply}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 cursor-pointer"
          >
            <span>Proceed to Claim Incentive</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
