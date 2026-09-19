import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';

/**
 * DocumentPreviewModal
 * Curated from: https://ui.watermelon.sh/components/dialog (Dialog 6: PDF Download Trigger & Dialog)
 * Dark Glassmorphism verified statutory preview with progress bar & cryptographic seal
 */
export const DocumentPreviewModal: React.FC = () => {
  const { previewDocument, setPreviewDocument, showToast } = useSwagat();
  const [downloading, setDownloading] = useState(false);

  if (!previewDocument) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast(`Downloaded certified copy of ${previewDocument.name} (SHA-256 DigiLocker Authenticated).`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-950/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/15 backdrop-blur-2xl relative my-8 text-white"
      >
        {/* Close Button */}
        <button
          onClick={() => setPreviewDocument(null)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>DigiLocker Verified Statutory Dossier</span>
        </div>

        <h3 className="text-xl font-display font-extrabold text-white">
          {previewDocument.name}
        </h3>

        {/* Metadata Grid */}
        <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2.5 backdrop-blur-md">
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Category:</span>
            <span className="font-bold text-sky-300">{previewDocument.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Document / License ID:</span>
            <span className="font-mono font-bold text-amber-300">{previewDocument.documentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Verification Body:</span>
            <span className="font-bold text-emerald-300">{previewDocument.verificationAgency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Uploaded Date:</span>
            <span className="text-slate-300 font-medium">{previewDocument.uploadedAt}</span>
          </div>
          {previewDocument.expiryDate && (
            <div className="flex justify-between">
              <span className="text-slate-400 uppercase text-[10px] font-bold">Statutory Expiry:</span>
              <span className="font-bold text-amber-300">{previewDocument.expiryDate}</span>
            </div>
          )}
        </div>

        {/* Mock Document Preview Canvas with Watermelon Dialog 6 visual feedback */}
        <div className="relative overflow-hidden h-44 rounded-2xl bg-[#071322] text-white flex flex-col items-center justify-center p-4 text-center border border-white/10 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-400 mb-2 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-white">{previewDocument.name}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Digitally Sealed with SHA-256 Checksum by DigiLocker Authority</span>
          </div>

          {downloading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-emerald-400 animate-shimmer" />
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPreviewDocument(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition"
          >
            Close
          </button>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Certified Copy…</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Certified PDF</span>
              </>
            )}
          </button>
        </div>

      </motion.div>
    </div>
  );
};
