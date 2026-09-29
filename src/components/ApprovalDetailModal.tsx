import React from 'react';
import { 
  X, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { BackButton } from './ui/BackButton';

/**
 * ApprovalDetailModal
 * Adaptive light/dark glassmorphic scrollable sheet with sticky header & footer
 */
export const ApprovalDetailModal: React.FC = () => {
  const { selectedApproval, setSelectedApproval, startApplication, theme } = useSwagat();
  const isDark = theme === 'dark';

  if (!selectedApproval) return null;

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
            <BackButton onClick={() => setSelectedApproval(null)} label="Close" />
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
              selectedApproval.centralOrState === 'Central'
                ? isDark ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-800 border-sky-200'
                : isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {selectedApproval.centralOrState === 'Central' ? 'Central Approval' : `${selectedApproval.stateName || 'State'} Clearance`}
            </span>
          </div>

          <button
            onClick={() => setSelectedApproval(null)}
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
                {selectedApproval.category}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                selectedApproval.mandatory 
                  ? isDark ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                  : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {selectedApproval.mandatory ? 'Mandatory Clearance' : 'Conditional Approval'}
              </span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedApproval.name}
            </h3>
            <div className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {selectedApproval.department} • {selectedApproval.ministry}
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border text-xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Statutory SLA
              </span>
              <span className="font-extrabold text-amber-500 text-sm">{selectedApproval.processingDays} Days</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Statutory Fee
              </span>
              <span className={`font-bold text-xs truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedApproval.statutoryFee}
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                License Validity
              </span>
              <span className={`font-bold text-xs block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedApproval.validityYears}
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Stage
              </span>
              <span className={`font-bold text-xs block ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                {selectedApproval.stage}
              </span>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-4">
            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Statutory Description &amp; Scope
              </h4>
              <p className={`leading-relaxed p-4 rounded-2xl border ${
                isDark ? 'text-slate-300 bg-white/5 border-white/10' : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}>
                {selectedApproval.longDescription || selectedApproval.description}
              </p>
            </div>

            {/* Required Documents */}
            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                <span>Mandatory Checklist of Documents Required:</span>
              </h4>
              <ul className="space-y-2">
                {selectedApproval.requiredDocuments.map((doc, i) => (
                  <li key={i} className={`flex items-start space-x-2.5 p-3 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Scale className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <span>Eligibility &amp; Applicability Norms:</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedApproval.eligibility.map((el, i) => (
                  <li key={i} className={`flex items-start space-x-2 p-2.5 rounded-xl border ${
                    isDark ? 'text-slate-300 bg-white/5 border-white/5' : 'text-slate-700 bg-slate-50 border-slate-200'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{el}</span>
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
            onClick={() => setSelectedApproval(null)}
            className={`px-4 py-2 border text-xs font-bold rounded-xl transition cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            Back to Directory
          </button>

          <button
            id="modal-detail-apply-btn"
            onClick={() => {
              const app = selectedApproval;
              setSelectedApproval(null);
              startApplication(app);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 cursor-pointer"
          >
            <span>Initiate Application Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
