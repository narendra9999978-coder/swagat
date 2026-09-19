import React, { useState } from 'react';
import { QrCode, Copy, Check, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  subtitle?: string;
  trackingNumber?: string;
  onDownloadSlip?: () => void;
  className?: string;
}

/**
 * QRCodeDisplay
 * Curated from: https://ui.watermelon.sh/animated-components/show-qr
 * Animated Flip & Scan QR verification card with dark glassmorphism
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  title = 'Application Verification QR',
  subtitle = 'Scan to view live statutory certificate',
  trackingNumber,
  onDownloadSlip,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG QR Code generator for crisp standalone rendering
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    value
  )}&bgcolor=0A1628&color=38BDF8&margin=4`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden rounded-3xl p-6 bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl text-center max-w-sm mx-auto ${className}`}
    >
      {/* Ambient glow behind card */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Statutory Cryptographic Seal</span>
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 mb-4">{subtitle}</p>

      {/* QR Code Canvas with Scanning Beam Effect */}
      <div className="relative inline-block p-3 rounded-2xl bg-[#071322] border border-white/10 shadow-inner group">
        <img
          src={qrSvgUrl}
          alt="QR Code"
          className="w-36 h-36 rounded-xl mx-auto block"
          loading="lazy"
        />

        {/* Animated laser scan beam */}
        <motion.div
          animate={{
            y: [0, 130, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_#38bdf8] pointer-events-none"
        />
      </div>

      {trackingNumber && (
        <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="text-left">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">URN Code</span>
            <span className="font-mono text-xs font-bold text-amber-300">{trackingNumber}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {onDownloadSlip && (
          <button
            type="button"
            onClick={onDownloadSlip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Slip</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
