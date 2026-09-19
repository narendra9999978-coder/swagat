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
 * Curated from: https://ui.watermelon.sh/components/dialog (Dialog 4: Scrollable Dialog)
 * Dark glassmorphism scrollable sheet with sticky header & footer
 */
export const ApprovalDetailModal: React.FC = () => {
  const { selectedApproval, setSelectedApproval, startApplication } = useSwagat();

  if (!selectedApproval) return null;

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
            <BackButton onClick={() => setSelectedApproval(null)} label="Close" />
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              selectedApproval.centralOrState === 'Central'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {selectedApproval.centralOrState === 'Central' ? 'Central Approval' : `${selectedApproval.stateName || 'State'} Clearance`}
            </span>
          </div>

          <button
            onClick={() => setSelectedApproval(null)}
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
                {selectedApproval.category}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                selectedApproval.mandatory 
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' 
                  : 'bg-white/5 border border-white/10 text-slate-300'
              }`}>
                {selectedApproval.mandatory ? 'Mandatory Clearance' : 'Conditional Approval'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {selectedApproval.name}
            </h3>
            <div className="text-xs text-slate-400 font-medium mt-1">
              {selectedApproval.department} • {selectedApproval.ministry}
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory SLA</span>
              <span className="font-extrabold text-amber-400 text-sm">{selectedApproval.processingDays} Days</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory Fee</span>
              <span className="font-bold text-white text-xs truncate block">{selectedApproval.statutoryFee}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">License Validity</span>
              <span className="font-bold text-white text-xs block">{selectedApproval.validityYears}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stage</span>
              <span className="font-bold text-sky-300 text-xs block">{selectedApproval.stage}</span>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2">
                Statutory Description &amp; Scope
              </h4>
              <p className="leading-relaxed text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                {selectedApproval.longDescription || selectedApproval.description}
              </p>
            </div>

            {/* Required Documents */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Mandatory Checklist of Documents Required:</span>
              </h4>
              <ul className="space-y-2">
                {selectedApproval.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-200">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-300 text-[11px] mb-2 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Eligibility &amp; Applicability Norms:</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedApproval.eligibility.map((el, i) => (
                  <li key={i} className="text-slate-300 flex items-start space-x-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Glass Footer */}
        <div className="sticky bottom-0 z-20 p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedApproval(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition"
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
