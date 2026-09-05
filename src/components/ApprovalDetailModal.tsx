import React from 'react';
import { 
  X, 
  Clock, 
  FileText, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Scale, 
  Download,
  AlertCircle
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const ApprovalDetailModal: React.FC = () => {
  const { selectedApproval, setSelectedApproval, startApplication } = useSwagat();

  if (!selectedApproval) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedApproval(null)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            selectedApproval.centralOrState === 'Central'
              ? 'bg-blue-100 text-blue-900 border border-blue-200'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}>
            {selectedApproval.centralOrState === 'Central' ? 'Central Approval' : `${selectedApproval.stateName || 'State'} Government`}
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {selectedApproval.category}
          </span>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            selectedApproval.mandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {selectedApproval.mandatory ? 'Mandatory Clearance' : 'Conditional Approval'}
          </span>
        </div>

        {/* Title & Department */}
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#07182C]">
          {selectedApproval.name}
        </h3>
        <div className="text-xs text-slate-500 font-medium mt-1">
          {selectedApproval.department} • {selectedApproval.ministry}
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory SLA</span>
            <span className="font-extrabold text-amber-700 text-sm">{selectedApproval.processingDays} Business Days</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory Fee</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{selectedApproval.statutoryFee}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">License Validity</span>
            <span className="font-bold text-slate-900 text-xs block">{selectedApproval.validityYears}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stage</span>
            <span className="font-bold text-blue-900 text-xs block">{selectedApproval.stage}</span>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-5 text-xs text-slate-700">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-1.5">
              Statutory Description &amp; Scope
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedApproval.longDescription || selectedApproval.description}
            </p>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-2 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Mandatory Checklist of Documents Required:</span>
            </h4>
            <ul className="space-y-2">
              {selectedApproval.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] mb-2 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              <span>Eligibility &amp; Applicability Norms:</span>
            </h4>
            <ul className="space-y-1.5">
              {selectedApproval.eligibility.map((el, i) => (
                <li key={i} className="text-slate-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5"></span>
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedApproval(null)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Close
          </button>

          <button
            id="modal-detail-apply-btn"
            onClick={() => {
              const app = selectedApproval;
              setSelectedApproval(null);
              startApplication(app);
            }}
            className="px-6 py-2.5 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <span>Initiate Application Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
