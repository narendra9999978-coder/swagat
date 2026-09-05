import React from 'react';
import { 
  X, 
  Award, 
  Coins, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  FileText, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const SchemeDetailModal: React.FC = () => {
  const { selectedScheme, setSelectedScheme, showToast } = useSwagat();

  if (!selectedScheme) return null;

  const handleApply = () => {
    showToast(`Registered application for ${selectedScheme.name}. Financial claim docket created.`);
    setSelectedScheme(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedScheme(null)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
            {selectedScheme.level} Government Scheme
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {selectedScheme.sector}
          </span>
          {selectedScheme.deadline && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
              {selectedScheme.deadline}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#07182C]">
          {selectedScheme.name}
        </h3>
        <div className="text-xs text-slate-500 font-medium mt-1">
          {selectedScheme.department} • {selectedScheme.ministry}
        </div>

        {/* Financial Outlay Box */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#07182C] to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Scheme Outlay / Max Grant</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{selectedScheme.maxFinancialSupport}</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Active Window
          </span>
        </div>

        {/* Details Content */}
        <div className="space-y-5 text-xs text-slate-700">
          
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-1.5">
              Financial Incentives &amp; Subsidies
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedScheme.benefits}
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-2">
              Eligibility &amp; Qualification Criteria:
            </h4>
            <ul className="space-y-2">
              {selectedScheme.eligibility.map((el, i) => (
                <li key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{el}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-2">
              Required Attachment Dossiers:
            </h4>
            <ul className="space-y-1.5">
              {selectedScheme.documents.map((doc, i) => (
                <li key={i} className="text-slate-600 flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedScheme(null)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Close
          </button>

          <button
            id="btn-scheme-modal-apply"
            onClick={handleApply}
            className="px-6 py-2.5 bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#07182C] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <span>Proceed to Claim Incentive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
