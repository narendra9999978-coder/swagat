import React from 'react';
import { useJourney } from '../context/JourneyContext';
import { 
  X, 
  ExternalLink, 
  Clock, 
  IndianRupee, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Building2
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { selectedServiceModal, setSelectedServiceModal, openAskModal } = useJourney();

  if (!selectedServiceModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-gov-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B2545] text-white px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              {selectedServiceModal.level} Government Service
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-1">
              {selectedServiceModal.title}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              {selectedServiceModal.department}
            </p>
          </div>

          <button
            onClick={() => setSelectedServiceModal(null)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1.5">
              Official Service Summary:
            </h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedServiceModal.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-slate-500 text-xs block mb-0.5">Statutory Processing SLA:</span>
              <strong className="text-[#0B2545] text-sm flex items-center space-x-1">
                <Clock className="w-4 h-4 text-blue-600 inline" />
                <span>{selectedServiceModal.processingTime}</span>
              </strong>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-slate-500 text-xs block mb-0.5">Government Statutory Fee:</span>
              <strong className="text-emerald-800 text-sm flex items-center space-x-1">
                <IndianRupee className="w-4 h-4 text-emerald-600 inline" />
                <span>{selectedServiceModal.fee}</span>
              </strong>
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
              Statutory Eligibility Criteria:
            </h4>
            <p className="text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
              {selectedServiceModal.eligibility}
            </p>
          </div>

          {/* Mandatory Documents */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
              Mandatory Documents Required for Submission:
            </h4>
            <div className="space-y-1.5">
              {selectedServiceModal.mandatoryDocs.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              const q = `How do I apply for ${selectedServiceModal.title}?`;
              setSelectedServiceModal(null);
              openAskModal(q);
            }}
            className="text-xs font-bold text-[#E05A10] hover:underline"
          >
            Build Journey for this Service →
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedServiceModal(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Close
            </button>

            <a
              href={selectedServiceModal.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>Launch {selectedServiceModal.portalName.split('/')[0]}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
