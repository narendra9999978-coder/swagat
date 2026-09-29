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
    showToast,
    theme
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
      theme === 'light' ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-black/80 backdrop-blur-2xl'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border backdrop-blur-2xl relative my-8 overflow-hidden ${
          theme === 'light'
            ? 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_20px_50px_rgba(20,40,60,0.18)]'
            : 'bg-slate-950/90 border-white/15 text-white'
        }`}
      >
        
        {/* Close Button */}
        {step !== 5 && (
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className={`absolute right-5 top-5 p-2 rounded-full transition ${
              theme === 'light'
                ? 'text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className={`border-b pb-4 mb-6 ${theme === 'light' ? 'border-[#D8E2EC]' : 'border-white/10'}`}>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Common Application Form (CAF) Wizard</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-display font-extrabold ${theme === 'light' ? 'text-[#172B4D]' : 'text-white'}`}>
            Apply for: {pendingApprovalToApply.name}
          </h3>
          <p className={`text-xs mt-1 ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>
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
                    ? theme === 'light'
                      ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                      : 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-bold'
                    : step > s.num
                    ? theme === 'light'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                    : theme === 'light'
                    ? 'bg-slate-50 text-slate-400 border-slate-200'
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
            <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-2.5 backdrop-blur-md ${
              theme === 'light'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-sky-500/10 border-sky-500/20 text-sky-200'
            }`}>
              <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <strong className={`block font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Auto-Populated from DigiLocker &amp; MCA:</strong>
                Enterprise identity verified via PAN {userProfile?.pan || 'AABCA9082F'} and GSTIN {userProfile?.gstNumber || '27AABCA9082F1ZG'}.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Company / Enterprise Name
                </label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.companyName || 'Apex Precision Engineering Pvt Ltd'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D]'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Authorized Applicant
                </label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.name || 'Rajesh Sharma'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D]'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Corporate CIN / LLPIN
                </label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.cin || 'U29253MH2021PTC368940'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D]'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Registered Address
                </label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.address || 'Plot C-45, MIDC Chakan Phase II, Pune'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D]'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
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
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Project / Plant Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D] focus:bg-white focus:border-sky-500'
                      : 'border-white/10 bg-white/5 text-white focus:border-sky-400'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Location State
                </label>
                <input
                  type="text"
                  disabled
                  value={kyaState.state || 'Maharashtra'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D]'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Industrial District / Zone
                </label>
                <input
                  type="text"
                  value={projectDistrict}
                  onChange={(e) => setProjectDistrict(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D] focus:bg-white focus:border-sky-500'
                      : 'border-white/10 bg-white/5 text-white focus:border-sky-400'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Proposed Capital Outlay
                </label>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D] focus:bg-white focus:border-sky-500'
                      : 'border-white/10 bg-white/5 text-white focus:border-sky-400'
                  }`}
                />
              </div>

              <div>
                <label className={`font-bold uppercase block mb-1 ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-300'}`}>
                  Anticipated Commissioning Date
                </label>
                <input
                  type="date"
                  defaultValue="2027-03-31"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'light'
                      ? 'border-[#D8E2EC] bg-slate-50 text-[#172B4D] focus:bg-white focus:border-sky-500'
                      : 'border-white/10 bg-white/5 text-white focus:border-sky-400'
                  }`}
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
            <div className={`text-xs ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-300'}`}>
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
                        ? theme === 'light'
                          ? 'border-sky-400 bg-sky-50 font-semibold text-[#172B4D]'
                          : 'border-sky-400 bg-sky-500/15 font-semibold text-white'
                        : theme === 'light'
                        ? 'border-[#D8E2EC] bg-slate-50 hover:bg-slate-100 text-[#172B4D]'
                        : 'border-white/10 bg-white/5 hover:bg-white/8 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked 
                          ? 'bg-sky-500 border-sky-400 text-white' 
                          : theme === 'light' ? 'border-slate-300' : 'border-white/20'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="truncate">
                        <div className={`font-bold truncate ${theme === 'light' ? 'text-[#172B4D]' : 'text-white'}`}>{doc.name}</div>
                        <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>{doc.category} • {doc.documentNumber}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ Verified</span>
                  </div>
                );
              })}
            </div>

            {/* Watermelon File-Upload-1 Integration */}
            <div className="pt-2">
              <span className={`block text-[11px] font-bold uppercase mb-1.5 ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>
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
            <div className={`p-4 rounded-2xl border text-xs space-y-2 backdrop-blur-md ${
              theme === 'light' ? 'bg-slate-50 border-[#D8E2EC] text-[#64748B]' : 'bg-white/5 border-white/10 text-slate-300'
            }`}>
              <div className="flex justify-between">
                <span>Statutory Department Fee ({pendingApprovalToApply.department}):</span>
                <span className={`font-bold ${theme === 'light' ? 'text-[#172B4D]' : 'text-white'}`}>{pendingApprovalToApply.statutoryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>SWAGAT Single-Window Platform Fee:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 (Free Public Infrastructure)</span>
              </div>
              <div className={`pt-2 border-t flex justify-between text-sm font-extrabold ${
                theme === 'light' ? 'border-[#D8E2EC] text-[#172B4D]' : 'border-white/10 text-white'
              }`}>
                <span>Total Payable Amount:</span>
                <span className={theme === 'light' ? 'text-amber-600' : 'text-amber-300'}>{pendingApprovalToApply.statutoryFee}</span>
              </div>
            </div>

            {/* Statutory Undertaking */}
            <label className={`flex items-start space-x-2 text-xs cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
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
              <h3 className={`text-2xl font-display font-extrabold ${theme === 'light' ? 'text-[#172B4D]' : 'text-white'}`}>
                Application Successfully Submitted!
              </h3>
              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>
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
