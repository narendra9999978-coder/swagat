import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { BackButton } from './ui/BackButton';
import { FileUploadZone } from './ui/FileUploadZone';
import { SlideCommit } from './ui/SlideCommit';
import { QRCodeDisplay } from './ui/QRCodeDisplay';

/**
 * ApplyModal
 * Curated from:
 * - Watermelon Dialog 4 (Container)
 * - Watermelon File-Upload-1 (Step 3)
 * - Reactbits Slide-Commit (Step 4 Submit Action)
 * - Watermelon Show-QR (Step 5 Confirmation)
 */
export const ApplyModal: React.FC = () => {
  const { 
    isApplyModalOpen, 
    setIsApplyModalOpen, 
    pendingApprovalToApply, 
    userProfile, 
    kyaState, 
    documents,
    submitNewApplication,
    setCurrentView,
    setDashboardActiveTab,
    showToast
  } = useSwagat();

  const [step, setStep] = useState<number>(1);
  const [projectTitle, setProjectTitle] = useState(`${kyaState.sector} Unit (${kyaState.state || 'Maharashtra'})`);
  const [projectDistrict, setProjectDistrict] = useState('Pune (MIDC Chakan)');
  const [investmentAmount, setInvestmentAmount] = useState(kyaState.investmentSize || '₹24.50 Crores');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(documents.slice(0, 3).map(d => d.id));
  const [declarationAccepted, setDeclarationAccepted] = useState(true);
  const [submittedAppTracking, setSubmittedAppTracking] = useState<string | null>(null);

  if (!isApplyModalOpen || !pendingApprovalToApply) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const doSubmit = () => {
    const newApp = submitNewApplication({
      approvalName: pendingApprovalToApply.name,
      department: pendingApprovalToApply.department,
      ministry: pendingApprovalToApply.ministry,
      projectTitle,
      projectDistrict,
      investmentAmount
    });
    setSubmittedAppTracking(newApp.trackingNumber);
    setStep(5);
  };

  const toggleDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(d => d !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="bg-slate-950/90 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/15 backdrop-blur-2xl relative my-8 text-white overflow-hidden"
      >
        
        {/* Close Button */}
        {step !== 5 && (
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Common Application Form (CAF) Wizard</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Apply for: {pendingApprovalToApply.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {pendingApprovalToApply.department} • Statutory SLA: {pendingApprovalToApply.processingDays} Days
          </p>
        </div>

        {/* Progress Stepper (Steps 1 to 4) */}
        {step <= 4 && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { num: 1, title: 'Applicant Profile' },
              { num: 2, title: 'Project Specs' },
              { num: 3, title: 'Documents' },
              { num: 4, title: 'Payment & Submit' }
            ].map((s) => (
              <div
                key={s.num}
                className={`p-2 rounded-xl text-center border transition-all ${
                  step === s.num
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-bold'
                    : step > s.num
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                    : 'bg-white/5 text-slate-500 border-white/5'
                }`}
              >
                <div className="text-[10px] uppercase font-mono">Step {s.num}</div>
                <div className="text-xs truncate">{s.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Applicant Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start space-x-2.5 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white">Auto-Populated from DigiLocker &amp; MCA:</strong>
                Enterprise identity verified via PAN {userProfile?.pan || 'AABCA9082F'} and GSTIN {userProfile?.gstNumber || '27AABCA9082F1ZG'}.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.companyName || 'Apex Precision Engineering Pvt Ltd'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 font-medium text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Authorized Applicant</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.name || 'Rajesh Sharma'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 font-medium text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Corporate CIN / LLPIN</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.cin || 'U29253MH2021PTC368940'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 font-mono text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Registered Address</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.address || 'Plot C-45, MIDC Chakan Phase II, Pune'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 font-medium text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="btn-apply-next-1"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Project Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Project Specifications */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 uppercase block mb-1">Project / Plant Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Location State</label>
                <input
                  type="text"
                  disabled
                  value={kyaState.state || 'Maharashtra'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Industrial District / Zone</label>
                <input
                  type="text"
                  value={projectDistrict}
                  onChange={(e) => setProjectDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Proposed Capital Outlay</label>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">Anticipated Commissioning Date</label>
                <input
                  type="date"
                  defaultValue="2027-03-31"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium focus:outline-none focus:border-sky-400"
                />
              </div>

            </div>

            <div className="pt-4 flex justify-between items-center">
              <BackButton onClick={handleBack} />
              <button
                id="btn-apply-next-2"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Document Attachments</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Document Attachments (with FileUploadZone) */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300">
              Select verified documents from your <strong>My Documents Locker</strong> or upload supplementary dossiers:
            </div>

            {/* Document Locker Selectors */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isChecked = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      isChecked
                        ? 'border-sky-400 bg-sky-500/15 font-semibold text-white'
                        : 'border-white/10 bg-white/5 hover:bg-white/8 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-sky-500 border-sky-400 text-slate-950' : 'border-white/20'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.category} • {doc.documentNumber}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold shrink-0">✓ Verified</span>
                  </div>
                );
              })}
            </div>

            {/* Watermelon File-Upload-1 Integration */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                Supplementary Clearance Dossier Upload
              </span>
              <FileUploadZone
                onFileSelect={(files) => {
                  showToast(`Uploaded ${files.length} supplementary file(s) for verification.`);
                }}
              />
            </div>

            <div className="pt-4 flex justify-between items-center">
              <BackButton onClick={handleBack} />
              <button
                id="btn-apply-next-3"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Payment &amp; Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Payment Submission (with SlideCommit) */}
        {step === 4 && (
          <div className="space-y-5">
            
            {/* Fee Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 backdrop-blur-md">
              <div className="flex justify-between text-slate-300">
                <span>Statutory Department Fee ({pendingApprovalToApply.department}):</span>
                <span className="font-bold text-white">{pendingApprovalToApply.statutoryFee}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>SWAGAT Single-Window Platform Fee:</span>
                <span className="font-bold text-emerald-400">₹0 (Free Public Infrastructure)</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
                <span>Total Payable Amount:</span>
                <span className="text-amber-300">{pendingApprovalToApply.statutoryFee}</span>
              </div>
            </div>

            {/* Statutory Undertaking */}
            <label className="flex items-start space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 rounded text-sky-500"
              />
              <span className="leading-relaxed">
                I hereby declare that all particulars submitted in this application and accompanying drawings are true and comply with statutory laws under {pendingApprovalToApply.ministry}.
              </span>
            </label>

            {/* Reactbits Slide-Commit Integration */}
            <div className="pt-2">
              <SlideCommit
                disabled={!declarationAccepted}
                label="Slide to Commit &amp; Submit CAF Application"
                committedLabel="Statutory Application Submitted!"
                onCommit={doSubmit}
              />
            </div>

            <div className="pt-2 flex justify-start">
              <BackButton onClick={handleBack} />
            </div>
          </div>
        )}

        {/* STEP 5: Submission Success Confirmation (with QRCodeDisplay) */}
        {step === 5 && (
          <div className="text-center py-4 space-y-6">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-white">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your statutory application has been registered with {pendingApprovalToApply.department}.
              </p>
            </div>

            {/* Watermelon Show-QR Component */}
            {submittedAppTracking && (
              <QRCodeDisplay
                value={`https://swagat.gov.in/verify?urn=${submittedAppTracking}`}
                trackingNumber={submittedAppTracking}
                title="DigiLocker URN Certificate"
                subtitle="Scan on mobile to track real-time statutory clearance"
                onDownloadSlip={() => {
                  showToast(`Downloaded Official Acknowledgement Slip for ${submittedAppTracking}`);
                }}
              />
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                id="btn-goto-dashboard-tracking"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setCurrentView('dashboard');
                  setDashboardActiveTab('applications');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>View in Dashboard Tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
