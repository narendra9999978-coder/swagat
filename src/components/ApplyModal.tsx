import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  Sparkles,
  Paperclip,
  Check
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { Approval } from '../types/swagat';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        {step !== 5 && (
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Common Application Form (CAF) Wizard</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#07182C]">
            Apply for: {pendingApprovalToApply.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
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
                    ? 'bg-[#07182C] text-white border-[#07182C] font-bold'
                    : step > s.num
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
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
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Auto-Populated from DigiLocker &amp; MCA:</strong>
                Enterprise identity verified via PAN {userProfile?.pan || 'AABCA9082F'} and GSTIN {userProfile?.gstNumber || '27AABCA9082F1ZG'}.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.companyName || 'Apex Precision Engineering Pvt Ltd'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Authorized Applicant</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.name || 'Rajesh Sharma'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Corporate CIN / LLPIN</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.cin || 'U29253MH2021PTC368940'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Registered Address</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.address || 'Plot C-45, MIDC Chakan Phase II, Pune'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="btn-apply-next-1"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Continue to Project Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Project Specifications */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 uppercase block mb-1">Project / Plant Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Location State</label>
                <input
                  type="text"
                  disabled
                  value={kyaState.state || 'Maharashtra'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Industrial District / Zone</label>
                <input
                  type="text"
                  value={projectDistrict}
                  onChange={(e) => setProjectDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Proposed Capital Outlay</label>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Anticipated Commissioning Date</label>
                <input
                  type="date"
                  defaultValue="2027-03-31"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                id="btn-apply-next-2"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Continue to Document Attachments</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Document Attachments */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xs text-slate-600">
              Select verified documents from your <strong>My Documents Locker</strong> to attach with this statutory application:
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isChecked = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      isChecked ? 'border-[#07182C] bg-blue-50/70 font-semibold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-[#07182C] border-[#07182C] text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{doc.category} • {doc.documentNumber}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold shrink-0">✓ Verified</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                id="btn-apply-next-3"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <span>Continue to Payment &amp; Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Payment Submission */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
            
            {/* Fee Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Statutory Department Fee ({pendingApprovalToApply.department}):</span>
                <span className="font-bold text-slate-900">{pendingApprovalToApply.statutoryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SWAGAT Single-Window Platform Fee:</span>
                <span className="font-bold text-emerald-700">₹0 (Free Public Infrastructure)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-[#07182C]">
                <span>Total Payable Amount:</span>
                <span>{pendingApprovalToApply.statutoryFee}</span>
              </div>
            </div>

            {/* Statutory Undertaking */}
            <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#07182C]"
              />
              <span>
                I hereby declare that all particulars submitted in this application and accompanying drawings are true and comply with statutory laws under {pendingApprovalToApply.ministry}.
              </span>
            </label>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                id="btn-confirm-submit-application"
                className="px-8 py-3 bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#07182C] text-white text-xs font-extrabold rounded-xl shadow-lg transition active:scale-95 flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Pay Fee &amp; Submit Application</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Submission Success Confirmation */}
        {step === 5 && (
          <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-extrabold text-[#07182C]">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your statutory application has been registered with {pendingApprovalToApply.department}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white max-w-sm mx-auto space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Official Tracking Number</div>
              <div className="text-xl font-mono font-black text-amber-300">{submittedAppTracking}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Live Real-Time Status Activated</div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => showToast(`Downloaded Official Acknowledgement Slip for ${submittedAppTracking}`)}
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs hover:bg-slate-50 flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Ack Slip</span>
              </button>

              <button
                id="btn-goto-dashboard-tracking"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setCurrentView('dashboard');
                  setDashboardActiveTab('applications');
                }}
                className="px-6 py-2.5 bg-[#07182C] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[#0B2545] transition flex items-center space-x-1.5"
              >
                <span>View in Dashboard Tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
