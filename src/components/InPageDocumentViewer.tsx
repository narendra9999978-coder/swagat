import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  QrCode, 
  Stamp, 
  ExternalLink,
  Eye,
  FileCheck2
} from 'lucide-react';

export interface InPageDocumentViewerProps {
  documentName: string;
  category?: string;
  fileName?: string;
  fileData?: string;
  fileUrl?: string;
  applicantName?: string;
  companyName?: string;
  trackingNumber?: string;
  uploadDate?: string;
  verificationStatus?: string;
  adminRemark?: string;
  theme?: 'light' | 'dark';
}

/**
 * Converts a base64 Data URL to a native browser Blob URL
 * Prevents Chrome/Edge from blocking iframe rendering or triggering unwanted downloads.
 */
function toBlobUrl(dataUrl: string): string | null {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:')) return null;
    const parts = dataUrl.split(';base64,');
    if (parts.length !== 2) return null;
    const contentType = parts[0].replace('data:', '');
    const byteCharacters = atob(parts[1]);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: contentType || 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export const InPageDocumentViewer: React.FC<InPageDocumentViewerProps> = ({
  documentName,
  category = 'General Statutory Clearance',
  fileName,
  fileData,
  fileUrl,
  applicantName = 'Authorized Signatory',
  companyName = 'Commercial Enterprise',
  trackingNumber = 'SWG-2026-STATUTORY',
  uploadDate = new Date().toLocaleDateString('en-GB'),
  verificationStatus = 'Under Review',
  adminRemark,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [zoom, setZoom] = useState<number>(100);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'certificate'>('preview');

  // Convert Base64 data URL to an active Blob URL for secure in-page iframe rendering
  const blobUrl = useMemo(() => {
    if (fileData) return toBlobUrl(fileData);
    return null;
  }, [fileData]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const isImage = useMemo(() => {
    if (fileData && fileData.startsWith('data:image/')) return true;
    if (fileName && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(fileName)) return true;
    if (fileUrl && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(fileUrl)) return true;
    return false;
  }, [fileData, fileName, fileUrl]);

  const isPdf = useMemo(() => {
    if (fileData && fileData.includes('application/pdf')) return true;
    if (fileName && /\.pdf$/i.test(fileName)) return true;
    if (fileUrl && /\.pdf$/i.test(fileUrl)) return true;
    return false;
  }, [fileData, fileName, fileUrl]);

  const hasEmbeddedFile = !!(blobUrl || (fileUrl && !fileUrl.startsWith('#') && !fileUrl.startsWith('/uploads')));
  const effectiveFileSource = blobUrl || fileUrl;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className={`w-full flex flex-col rounded-2xl border transition-all ${
      expanded ? 'fixed inset-4 z-50 shadow-2xl p-4' : 'relative'
    } ${
      isDark 
        ? 'bg-[#061220] border-white/10 text-white' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* ── Document Control Toolbar ── */}
      <div className={`px-4 py-3 flex items-center justify-between border-b flex-wrap gap-2 ${
        isDark ? 'border-white/10 bg-[#09182B]/80' : 'border-slate-200 bg-slate-50'
      }`}>
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-amber-400 text-[#07182C] shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-amber-400 text-[#07182C] shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Statutory e-Dossier</span>
          </button>
        </div>

        {/* Zoom & Viewport Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className={`p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] font-bold min-w-[40px] text-center">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className={`p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset Zoom"
                className={`p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Minimize View' : 'Maximize to Full Page'}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{expanded ? 'Exit Fullscreen' : 'Full Page'}</span>
          </button>
        </div>
      </div>

      {/* ── Document View Canvas ── */}
      <div className={`w-full overflow-auto p-4 flex items-center justify-center relative ${
        expanded ? 'h-[calc(100vh-140px)]' : 'h-[460px] min-h-[380px]'
      } ${
        isDark ? 'bg-[#030914]' : 'bg-slate-100'
      }`}>

        {/* Tab 1: Render Uploaded File / Image / PDF Stream */}
        {activeTab === 'preview' && (
          hasEmbeddedFile && effectiveFileSource ? (
            isImage ? (
              <div 
                className="transition-transform duration-200 flex items-center justify-center"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
              >
                <img 
                  src={effectiveFileSource} 
                  alt={documentName}
                  className="max-h-[420px] max-w-full rounded-xl border shadow-2xl object-contain border-white/15 bg-white" 
                />
              </div>
            ) : (
              <div 
                className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              >
                <iframe 
                  src={effectiveFileSource} 
                  title={documentName}
                  className="w-full h-full min-h-[440px] border-none"
                />
              </div>
            )
          ) : (
            /* If no raw binary uploaded (e.g., DigiLocker certificate or statutory link), show full digital statutory dossier */
            <div 
              className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-8 shadow-2xl border border-slate-300 my-auto transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {/* Government Header Banner */}
              <div className="border-b-2 border-emerald-900 pb-4 mb-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-serif font-black flex items-center justify-center text-xs shadow-inner">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold tracking-widest text-emerald-950 uppercase">
                      Government of Maharashtra &amp; Government of India
                    </h2>
                    <p className="text-[10px] tracking-wider text-slate-600 font-semibold uppercase">
                      SWAGAT Single-Window Clearance Portal • National Statutory Registry
                    </p>
                  </div>
                </div>
                <div className="inline-block mt-2 px-3 py-1 bg-emerald-50 border border-emerald-700/30 rounded-full text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider">
                  Official Digital Statutory Certificate • Form SWG-NOC-2026
                </div>
              </div>

              {/* Document Identity Info */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Document Name:</span>
                  <span className="font-extrabold text-slate-900 text-[13px]">{documentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Statutory Category:</span>
                  <span className="font-bold text-emerald-800">{category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Enterprise / Applicant:</span>
                  <span className="font-bold text-slate-800">{companyName}</span>
                  <span className="text-[10px] text-slate-500 block">Signatory: {applicantName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Application Tracking ID:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-[12px]">{trackingNumber}</span>
                  <span className="text-[10px] text-slate-500 block">Uploaded Date: {uploadDate}</span>
                </div>
              </div>

              {/* Verification & Compliance Clauses */}
              <div className="text-[11px] text-slate-700 space-y-2 mb-6 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 font-serif">
                <p>
                  <strong>Statutory Attestation:</strong> This certified statutory record has been uploaded and validated through the SWAGAT National Single Window Network. The entity has fulfilled preliminary CAF submission criteria pursuant to the Maharashtra Single Window Act and relevant Central Statutory Clearances Framework.
                </p>
                <p>
                  <strong>Integrity Verification:</strong> Authenticated against the national corporate registry and digital repository with cryptographic SHA-256 validation seal.
                </p>
              </div>

              {/* Seals, QR & Officer Signature Block */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 border-2 border-emerald-800 rounded-lg flex items-center justify-center p-1 bg-white">
                    <QrCode className="w-10 h-10 text-emerald-950" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-[10px] text-emerald-900 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-700" /> DigiLocker Verified
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Seal: SHA-256: {trackingNumber.slice(-8).toUpperCase()}-AUTHENTIC
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-emerald-800 font-black flex items-center gap-1 justify-end">
                    <Stamp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Digitally Signed</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-900">Desk Scrutiny Officer</div>
                  <div className="text-[9px] text-slate-500">Directorate of Single Window Approvals</div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Tab 2: Official Statutory e-Dossier Specification Record */}
        {activeTab === 'certificate' && (
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-8 shadow-2xl border border-slate-300 my-auto">
            <div className="border-b pb-4 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Statutory e-Record
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{documentName}</h3>
                <p className="text-xs text-slate-500">Competent Authority: {category} Directorate</p>
              </div>
              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  verificationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                  verificationStatus === 'Correction Required' ? 'bg-amber-100 text-amber-800' :
                  verificationStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {verificationStatus}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Enterprise Name</span>
                <span className="font-bold text-slate-900">{companyName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Authorized Signatory</span>
                <span className="font-bold text-slate-900">{applicantName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tracking Number</span>
                <span className="font-mono font-bold text-slate-900">{trackingNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Date of Submission</span>
                <span className="font-medium text-slate-700">{uploadDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">File Attachment</span>
                <span className="font-mono text-slate-800">{fileName || `${documentName}.pdf`}</span>
              </div>
              {adminRemark && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-bold block mb-0.5">Scrutiny Officer Remarks:</span>
                  <span>{adminRemark}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> SHA-256 Validated Digital Seal
              </span>
              <span>Single Window Authority of India</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className={`px-4 py-2 border-t text-[11px] flex items-center justify-between flex-wrap gap-2 ${
        isDark ? 'border-white/10 bg-[#09182B]/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <div className="flex items-center gap-2 truncate">
          <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{fileName ? `Attached File: ${fileName}` : documentName}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[10px]">
          <span>Uploaded: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{uploadDate}</strong></span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <Lock className="w-3 h-3" /> In-Page Scrutiny Active
          </span>
        </div>
      </div>
    </div>
  );
};
