import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Building 
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const DocumentPreviewModal: React.FC = () => {
  const { previewDocument, setPreviewDocument, showToast } = useSwagat();

  if (!previewDocument) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setPreviewDocument(null)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>DigiLocker Verified Statutory Dossier</span>
        </div>

        <h3 className="text-xl font-display font-extrabold text-[#07182C]">
          {previewDocument.name}
        </h3>

        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Category:</span>
            <span className="font-bold text-blue-900">{previewDocument.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Document / License ID:</span>
            <span className="font-mono font-bold text-slate-900">{previewDocument.documentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Verification Body:</span>
            <span className="font-bold text-emerald-700">{previewDocument.verificationAgency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Uploaded Date:</span>
            <span className="text-slate-700 font-medium">{previewDocument.uploadedAt}</span>
          </div>
          {previewDocument.expiryDate && (
            <div className="flex justify-between">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Statutory Expiry:</span>
              <span className="font-bold text-amber-800">{previewDocument.expiryDate}</span>
            </div>
          )}
        </div>

        {/* Mock Document Preview Canvas */}
        <div className="h-44 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center border border-slate-800 shadow-inner">
          <FileText className="w-10 h-10 text-amber-400 mb-2" />
          <div className="text-xs font-bold text-slate-200">{previewDocument.name}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Digitally Sealed with SHA-256 Checksum by DigiLocker Authority</div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setPreviewDocument(null)}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
          >
            Close
          </button>

          <button
            onClick={() => showToast(`Downloaded certified copy of ${previewDocument.name}`)}
            className="px-5 py-2.5 bg-[#07182C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
