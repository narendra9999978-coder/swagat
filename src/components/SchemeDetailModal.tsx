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
 * Adaptive light/dark glassmorphic scrollable sheet with sticky header & footer
 */
export const SchemeDetailModal: React.FC = () => {
  const { selectedScheme, setSelectedScheme, showToast, theme } = useSwagat();
  const isDark = theme === 'dark';

  if (!selectedScheme) return null;

  const handleApply = () => {
    showToast(`Registered application for ${selectedScheme.name}. Financial claim docket created.`);
    setSelectedScheme(null);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-2xl ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={`rounded-3xl max-w-2xl w-full shadow-2xl border backdrop-blur-2xl relative my-8 max-h-[90vh] flex flex-col overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#071322]/95 border-white/15 text-white'
            : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl ring-1 ring-slate-900/5'
        }`}
      >
        {/* Sticky Glass Header */}
        <div className={`sticky top-0 z-20 p-6 border-b backdrop-blur-xl flex items-center justify-between ${
          isDark
            ? 'border-white/10 bg-[#071322]/90 text-white'
            : 'border-slate-200 bg-white/90 text-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            <BackButton onClick={() => setSelectedScheme(null)} label="Close" />
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              isDark
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'bg-orange-50 text-orange-800 border border-orange-200'
            }`}>
              {selectedScheme.level} Scheme
            </span>
          </div>

          <button
            onClick={() => setSelectedScheme(null)}
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {selectedScheme.sector}
              </span>
              {selectedScheme.deadline && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}>
                  {selectedScheme.deadline}
                </span>
              )}
            </div>

            <h3 className={`text-xl sm:text-2xl font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedScheme.name}
            </h3>
            <div className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {selectedScheme.department} • {selectedScheme.ministry}
            </div>
          </div>

          {/* Financial Outlay Box */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md backdrop-blur-md ${
            isDark
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-emerald-950/60 border-emerald-500/20 text-white'
              : 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                Total Scheme Outlay / Max Grant
              </div>
              <div className={`text-2xl font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-emerald-900'}`}>
                {selectedScheme.maxFinancialSupport}
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Application Window</span>
            </span>
          </div>

          {/* Details Content */}
          <div className="space-y-4">
            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Financial Incentives &amp; Subsidies
              </h4>
              <p className={`leading-relaxed p-4 rounded-2xl border ${
                isDark ? 'text-slate-300 bg-white/5 border-white/10' : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}>
                {selectedScheme.benefits}
              </p>
            </div>

            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Eligibility &amp; Qualification Criteria
              </h4>
              <ul className="space-y-2">
                {selectedScheme.eligibility.map((el, i) => (
                  <li key={i} className={`flex items-start space-x-2.5 p-3 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Required Attachment Dossiers
              </h4>
              <ul className="space-y-1.5">
                {selectedScheme.documents.map((doc, i) => (
                  <li key={i} className={`flex items-center space-x-2 p-2 rounded-xl border ${
                    isDark ? 'text-slate-300 bg-white/5 border-white/5' : 'text-slate-700 bg-slate-50 border-slate-200'
                  }`}>
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Glass Footer */}
        <div className={`sticky bottom-0 z-20 p-4 border-t backdrop-blur-xl flex items-center justify-between gap-3 ${
          isDark
            ? 'border-white/10 bg-[#071322]/90'
            : 'border-slate-200 bg-white/90'
        }`}>
          <button
            onClick={() => setSelectedScheme(null)}
            className={`px-4 py-2 border text-xs font-bold rounded-xl transition cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
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
