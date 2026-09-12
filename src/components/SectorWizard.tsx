import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, CheckCircle2, Circle, ArrowLeft, ArrowRight,
  Upload, FileText, ShieldCheck, Loader2, X, AlertCircle,
  Clock, Building2, Leaf, Send, RefreshCw, ExternalLink,
  HelpCircle, Check, Award, Sparkles, FileCheck, Layers
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import {
  getSectorRootQuestion,
  getSectorQuestionById,
  getSectorChecklist,
  normalizeSectorCode,
  TreeQuestion,
  TreeOption,
  SectorChecklistDocument
} from '../data/sectorDecisionTrees';
import { WizardStep, Application, ApplicationDocumentItem, ApplicationApprovalItem } from '../types/swagat';
import { loadAllApplications, saveAllApplications } from '../lib/applicationStore';
import { ApplicationStatusResponseAPI } from '../services/api';

const WIZARD_STEPS: { key: WizardStep; label: string; short: string; description: string }[] = [
  { key: 'business_registration', label: 'Business Registration & Constitution', short: 'Registration', description: 'Determine corporate structure, MCA SPICe+, and foundational filings' },
  { key: 'business_activity', label: 'Sector-Specific Operational Scale', short: 'Activity', description: 'Classify manufacturing capacity, service scale, and operational risk category' },
  { key: 'foreign_investment', label: 'Foreign Investment & Capital Structure', short: 'Investment', description: 'Validate FDI limits, RBI FEMA compliance, and ECB requirements' },
  { key: 'project_land', label: 'Site, Land Records & Environmental Zoning', short: 'Land', description: 'Assess industrial zoning, non-agricultural conversion, and environmental sensitivity' },
];

type WizardPhase = 'questionnaire' | 'checklist' | 'sla';

interface StepAnswerRecord {
  questionId: string;
  questionText: string;
  optionId: string;
  optionLabel: string;
  recommendations: string[];
  requiredDocs: string[];
}

export const SectorWizard: React.FC = () => {
  const { wizardSession, closeWizard, userProfile, showToast } = useSwagat();

  const [phase, setPhase] = useState<WizardPhase>('questionnaire');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Active step & sector code
  const activeStep = WIZARD_STEPS[activeStepIndex];
  const sectorCode = useMemo(() => {
    if (!wizardSession) return 'HOTEL';
    return normalizeSectorCode(
      wizardSession.businessType.code ||
      wizardSession.businessType.id ||
      wizardSession.businessType.name
    );
  }, [wizardSession]);

  // Tree traversal state for the current step
  const [currentQuestion, setCurrentQuestion] = useState<TreeQuestion | null>(null);
  const [stepPath, setStepPath] = useState<{ question: TreeQuestion; chosenOption: TreeOption }[]>([]);
  const [leafReached, setLeafReached] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  // Accumulated answers across all steps
  const [answersByStep, setAnswersByStep] = useState<Record<WizardStep, StepAnswerRecord[]>>({
    business_registration: [],
    business_activity: [],
    foreign_investment: [],
    project_land: [],
  });

  // Checklist state
  const [checklist, setChecklist] = useState<SectorChecklistDocument[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { file: File; name: string; uploadedAt: string }>>({});
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // SLA submission state
  const [slaData, setSlaData] = useState<ApplicationStatusResponseAPI | null>(null);

  // Load root question when step changes
  useEffect(() => {
    if (phase !== 'questionnaire' || !wizardSession) return;
    initStepQuestion();
  }, [activeStepIndex, phase, sectorCode]);

  const initStepQuestion = () => {
    const rootQ = getSectorRootQuestion(sectorCode, activeStep.key);
    setCurrentQuestion(rootQ || null);
    setStepPath([]);
    setLeafReached(false);
  };

  const handleOptionSelect = (option: TreeOption) => {
    if (!currentQuestion) return;

    const newPath = [...stepPath, { question: currentQuestion, chosenOption: option }];
    setStepPath(newPath);

    if (option.isLeaf || !option.nextQuestionId) {
      // Step complete!
      setLeafReached(true);
      setCurrentQuestion(null);

      // Save answer history for this step
      const stepRecords: StepAnswerRecord[] = newPath.map(p => ({
        questionId: p.question.id,
        questionText: p.question.question,
        optionId: p.chosenOption.id,
        optionLabel: p.chosenOption.label,
        recommendations: p.chosenOption.recommendations || [],
        requiredDocs: p.chosenOption.requiredDocs || [],
      }));

      setAnswersByStep(prev => ({
        ...prev,
        [activeStep.key]: stepRecords,
      }));
    } else {
      // Advance to next child question in this sector's tree
      const nextQ = getSectorQuestionById(sectorCode, activeStep.key, option.nextQuestionId);
      if (nextQ) {
        setCurrentQuestion(nextQ);
      } else {
        // Fallback to leaf if next question wasn't found
        setLeafReached(true);
        setCurrentQuestion(null);
      }
    }
  };

  const handleBackQuestion = () => {
    if (stepPath.length === 0) return;
    const prevPath = [...stepPath];
    const lastItem = prevPath.pop()!;
    setStepPath(prevPath);
    setLeafReached(false);
    setCurrentQuestion(lastItem.question);
  };

  const handleNextStep = () => {
    if (!leafReached) return;
    setCompletedSteps(prev => new Set([...prev, activeStep.key]));

    if (activeStepIndex < WIZARD_STEPS.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      // All 4 steps done — generate customized sector checklist
      generateChecklist();
    }
  };

  // Compile full tailored checklist based on sector and applicant choices
  const generateChecklist = () => {
    const rawAnswers: Record<string, string> = {};
    Object.values(answersByStep).flat().forEach(a => {
      rawAnswers[a.questionId] = a.optionId;
    });

    const sectorDocs = getSectorChecklist(sectorCode, rawAnswers);
    setChecklist(sectorDocs);
    setPhase('checklist');
    showToast('Decision tree completed! Your tailored statutory checklist is ready.');
  };

  const handleFileUpload = (docId: string, file: File) => {
    setUploadingDocId(docId);
    setTimeout(() => {
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          file,
          name: file.name,
          uploadedAt: new Date().toLocaleDateString('en-GB'),
        },
      }));
      setChecklist(prev => prev.map(d =>
        d.id === docId ? { ...d, status: 'pending_review' as const } : d
      ));
      setUploadingDocId(null);
      showToast(`Uploaded "${file.name}" successfully.`);
    }, 400);
  };

  // Submit application and register to applicationStore
  const handleSubmitApplication = () => {
    const unuploadedMandatory = checklist.filter(
      d => d.isMandatory && !d.reusedFromVault && !uploadedDocs[d.id]
    );

    if (unuploadedMandatory.length > 0) {
      showToast(`Please upload all mandatory documents (${unuploadedMandatory.length} remaining) before submitting.`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const stateCode = 'MH';
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const trackingNumber = `SWG-2026-${stateCode}-${randNum}`;
      const appId = `app-${sectorCode.toLowerCase()}-${Date.now()}`;
      const today = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      // Gather all recommendations
      const allRecs = Array.from(
        new Set(Object.values(answersByStep).flatMap(stepList => stepList.flatMap(a => a.recommendations)))
      );

      // Build document items for application store
      const docItems: ApplicationDocumentItem[] = checklist.map((c, i) => ({
        id: `doc-${appId}-${i}`,
        documentName: c.documentName,
        category: c.department,
        uploadDate: today,
        verificationStatus: c.reusedFromVault ? 'Approved' : 'Under Review',
        adminRemark: c.reusedFromVault ? 'Pre-verified via Corporate DigiLocker Vault' : 'Awaiting departmental scrutiny',
        fileUrl: c.reusedFromVault ? '#vault' : uploadedDocs[c.id] ? URL.createObjectURL(uploadedDocs[c.id].file) : undefined,
      }));

      // Unique departments from checklist
      const uniqueDepts = Array.from(new Set(checklist.map(c => c.department)));
      const approvalItems: ApplicationApprovalItem[] = (allRecs.length > 0 ? allRecs : ['Statutory Sectoral NOC', 'Consent to Establish', 'Fire Safety Certificate']).map((rec, i) => ({
        id: `appr-${appId}-${i + 1}`,
        approvalName: rec,
        department: uniqueDepts[i % Math.max(1, uniqueDepts.length)] || 'Single Window Authority',
        centralOrState: rec.includes('Central') || rec.includes('PESO') || rec.includes('CDSCO') || rec.includes('DGMS') ? 'Central' : 'State',
        status: 'Under Review',
        submittedDate: today,
        lastUpdated: today,
        remarks: 'Automated parallel dispatch initiated. SLA countdown active.',
      }));

      const newApp: Application = {
        id: appId,
        trackingNumber,
        userId: userProfile?.id || 'usr-registered',
        applicantName: userProfile?.name || 'Authorized Signatory',
        applicantEmail: userProfile?.email || 'investor@swagat.gov.in',
        companyName: userProfile?.companyName || `${wizardSession?.businessType.name} Enterprises Ltd`,
        businessType: wizardSession?.businessType.name || sectorCode,
        approvalId: `appr-sec-${sectorCode}`,
        approvalName: `${wizardSession?.businessType.name} Single Window Clearance Package`,
        department: uniqueDepts[0] || 'State Single Window Clearances Directorate',
        ministry: 'Ministry of Commerce and Industry',
        centralOrState: 'State',
        stateName: userProfile?.state || 'Maharashtra',
        submissionDate: today,
        lastUpdated: 'Just now',
        currentStatus: 'Under Review',
        nextAction: 'Parallel departmental scrutiny underway (SLA countdown active)',
        estimatedCompletionDays: 14,
        statutoryFeePaid: '₹15,000',
        panNumber: userProfile?.pan || 'AAACH5421F',
        gstNumber: userProfile?.gstNumber || '27AAACH5421F1Z5',
        cinNumber: userProfile?.cin || 'U55101MH2026PTC392811',
        projectTitle: `${wizardSession?.businessType.name} Project Facility (${userProfile?.state || 'Maharashtra'})`,
        projectState: userProfile?.state || 'Maharashtra',
        projectDistrict: 'Industrial Zone',
        investmentAmount: '₹25.0 Crore',
        timeline: [
          { title: 'Decision Tree Questionnaire Completed', date: today, description: 'Statutory requirements mapped via dynamic tree', completed: true, current: false },
          { title: 'Application Submitted & Dispatched', date: today, description: 'Parallel scrutiny packages sent to statutory authorities', completed: true, current: false },
          { title: 'Departmental SLA Scrutiny', date: 'In Progress', description: 'Live SLA countdown active across all clearance bodies', completed: false, current: true },
          { title: 'Deemed Approval / Final Composite NOC', date: 'Expected in 14 days', description: 'Digital Composite Clearance Certificate generation', completed: false, current: false },
        ],
        documentsAttached: docItems.map(d => ({ name: d.documentName, category: d.category, verified: d.verificationStatus === 'Approved' })),
        documentsList: docItems,
        approvalsList: approvalItems,
        queries: [],
      };

      // Save to shared store so both User & Admin see it instantly
      const existing = loadAllApplications();
      saveAllApplications([newApp, ...existing]);

      // Build mock SLA response for the SLA view
      const mockSla: ApplicationStatusResponseAPI = {
        application: {
          id: trackingNumber,
          status: 'dispatched',
          business_type_name: wizardSession?.businessType.name,
          created_at: now.toISOString(),
          submitted_at: now.toISOString(),
        },
        bundles: uniqueDepts.slice(0, 5).map((dept, i) => ({
          id: `bnd-${appId}-${i}`,
          department_id: `dept-${i}`,
          department_name: dept,
          status: 'in_review',
          dispatched_at: now.toISOString(),
          sla_deadline: new Date(now.getTime() + (48 + i * 24) * 3600000).toISOString(),
          sla_hours: 48 + i * 24,
          reassigned_count: 0,
          documents: [],
        })),
      };

      setSlaData(mockSla);
      setSubmitting(false);
      setPhase('sla');
      showToast(`Application ${trackingNumber} submitted successfully! Parallel clearance initiated.`);
    }, 600);
  };

  if (!wizardSession) return null;

  // Active step answers summary
  const currentStepAnswers = answersByStep[activeStep.key] || [];
  const currentRecommendations = Array.from(new Set(currentStepAnswers.flatMap(a => a.recommendations)));
  const currentRequiredDocs = Array.from(new Set(currentStepAnswers.flatMap(a => a.requiredDocs)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-[#07182C] text-white py-3.5 px-4 sm:px-8 border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeWizard}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-400">
                {wizardSession.businessType.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sector: {sectorCode}
              </span>
            </div>
          </div>
          <button
            onClick={closeWizard}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Close Wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step Progress Bar (During Questionnaire) */}
      {phase === 'questionnaire' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {WIZARD_STEPS.map((step, idx) => {
                const isDone = completedSteps.has(step.key);
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={step.key}
                    onClick={() => {
                      if (isDone || idx <= activeStepIndex) {
                        setActiveStepIndex(idx);
                      }
                    }}
                    disabled={!isDone && idx > activeStepIndex}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left transition cursor-pointer disabled:cursor-not-allowed ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                        : isDone
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        : 'bg-white border-slate-100 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-[#07182C] text-white ring-2 ring-emerald-500'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Step {idx + 1}
                      </div>
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-[#07182C]' : 'text-slate-700'}`}>
                        {step.short}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">

        {/* ── PHASE 1: QUESTIONNAIRE ─────────────────────────────────── */}
        {phase === 'questionnaire' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Step Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Statutory Decision Tree</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#07182C]">
                    Step {activeStepIndex + 1}: {activeStep.label}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeStep.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-400">Step Progress</span>
                  <div className="text-sm font-extrabold text-emerald-600">
                    {leafReached ? 'Classification Ready' : `${stepPath.length} Question Answered`}
                  </div>
                </div>
              </div>

              {/* Answers Breadcrumb */}
              {stepPath.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-400">Selected Path:</span>
                  {stepPath.map((item, idx) => (
                    <React.Fragment key={item.chosenOption.id}>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                        {item.chosenOption.label}
                      </span>
                      {idx < stepPath.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </React.Fragment>
                  ))}
                  {!leafReached && (
                    <button
                      onClick={handleBackQuestion}
                      className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Change Last Selection
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tree Question & Options View */}
            {!leafReached && currentQuestion ? (
              <div className="border-2 border-emerald-500/80 bg-white rounded-3xl p-6 sm:p-8 shadow-md">
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-extrabold text-base shadow-sm">
                    Q
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#07182C] leading-snug">
                      {currentQuestion.question}
                    </h3>
                    {currentQuestion.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        {currentQuestion.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 sm:pl-14">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt)}
                      className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-150 group flex items-center justify-between gap-4 cursor-pointer bg-white"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800 group-hover:text-emerald-900">
                            {opt.label}
                          </span>
                          {opt.isLeaf ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Completes Step
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                              Branch Question
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                        {opt.recommendations && opt.recommendations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {opt.recommendations.slice(0, 2).map((r, i) => (
                              <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                📋 {r}
                              </span>
                            ))}
                            {opt.recommendations.length > 2 && (
                              <span className="text-[10px] font-medium text-slate-400">
                                +{opt.recommendations.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="mt-6 sm:pl-14 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span>Please choose an applicable option to branch through statutory requirements.</span>
                  {stepPath.length > 0 && (
                    <button
                      onClick={initStepQuestion}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Step
                    </button>
                  )}
                </div>
              </div>
            ) : leafReached ? (
              /* Step Complete Leaf Banner */
              <div className="border-2 border-dashed border-emerald-500 bg-emerald-50/70 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                      <Leaf className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Classification Ready
                      </span>
                      <h3 className="text-xl font-extrabold text-emerald-950">
                        Step {activeStepIndex + 1} Complete: {activeStep.label}
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Statutory rules and required documentation for this sector step have been determined.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={initStepQuestion}
                      className="px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
                    >
                      Edit Answers
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{activeStepIndex < WIZARD_STEPS.length - 1 ? 'Proceed to Next Step' : 'Generate Full Checklist'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Clearances & Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Identified Statutory Clearances */}
                  <div className="bg-white rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#07182C] mb-2.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Identified Statutory Approvals ({currentRecommendations.length})</span>
                    </div>
                    {currentRecommendations.length > 0 ? (
                      <div className="space-y-1.5">
                        {currentRecommendations.map((rec, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/70 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-semibold">{rec}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Standard statutory clearances apply.</p>
                    )}
                  </div>

                  {/* Documents Identified */}
                  <div className="bg-white rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#07182C] mb-2.5">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                      <span>Requisite Documents ({currentRequiredDocs.length})</span>
                    </div>
                    {currentRequiredDocs.length > 0 ? (
                      <div className="space-y-1.5">
                        {currentRequiredDocs.map((doc, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/70 flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Standard entity proof documents required.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 bg-white rounded-3xl p-12 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm text-slate-600 mt-2 font-semibold">No questions available</p>
                <button
                  onClick={initStepQuestion}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reload Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 2: CHECKLIST ──────────────────────────────────────── */}
        {phase === 'checklist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Customized for {wizardSession.businessType.name}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#07182C]">
                  Tailored Statutory Document Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  All documents below were determined based on your answers in the 4-step decision tree.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPhase('questionnaire')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Tree
                </button>
              </div>
            </div>

            {/* Checklist Overview Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-extrabold text-[#07182C]">{checklist.length}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Total Required</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-extrabold text-emerald-600">
                  {checklist.filter(d => d.reusedFromVault).length}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Auto-Reused Vault</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-extrabold text-amber-500">
                  {checklist.filter(d => !d.reusedFromVault && !uploadedDocs[d.id]).length}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending Upload</p>
              </div>
            </div>

            {/* Document Cards */}
            <div className="space-y-3">
              {checklist.map((doc) => {
                const isUploaded = !!uploadedDocs[doc.id];
                const isVault = doc.reusedFromVault;

                return (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                      isVault
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : isUploaded
                        ? 'border-sky-200 bg-sky-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isVault
                              ? 'bg-emerald-100 text-emerald-700'
                              : isUploaded
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isVault ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : isUploaded ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">
                              {doc.documentName}
                            </h4>
                            {doc.isMandatory && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                Mandatory
                              </span>
                            )}
                            {isVault && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> DigiLocker Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Responsible Dept: <strong className="text-slate-700">{doc.department}</strong>
                          </p>

                          {isUploaded && (
                            <p className="text-xs text-sky-700 font-semibold mt-1">
                              ✓ Attached file: {uploadedDocs[doc.id].name} ({uploadedDocs[doc.id].uploadedAt})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Upload button */}
                      {!isVault && (
                        <div className="shrink-0 sm:self-center">
                          <label
                            htmlFor={`file-${doc.id}`}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              isUploaded
                                ? 'bg-sky-50 text-sky-700 border border-sky-300 hover:bg-sky-100'
                                : 'bg-[#07182C] text-white hover:bg-[#0B2545]'
                            }`}
                          >
                            {uploadingDocId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            <span>{isUploaded ? 'Replace Document' : 'Upload Document'}</span>
                          </label>
                          <input
                            id={`file-${doc.id}`}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload(doc.id, f);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Section */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">
                  Ready to initiate Single Window parallel processing?
                </p>
                <p className="text-sm font-bold text-[#07182C] mt-0.5">
                  Submitting will automatically notify competent state authorities and trigger live SLA countdowns.
                </p>
              </div>
              <button
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating Statutory Dispatch...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application for Statutory Clearances</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 3: SLA DASHBOARD ──────────────────────────────────── */}
        {phase === 'sla' && slaData && (
          <SLADashboard data={slaData} onClose={closeWizard} />
        )}
      </div>
    </div>
  );
};

// ── SLA Dashboard Component ──────────────────────────────────────────────────

const SLADashboard: React.FC<{ data: ApplicationStatusResponseAPI; onClose: () => void }> = ({ data, onClose }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (deadline?: string): string => {
    if (!deadline) return 'N/A';
    const diff = new Date(deadline).getTime() - now;
    if (diff <= 0) return 'BREACHED';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#133E70] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Statutory SLA Monitor</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Application Tracking ID: {data.application.id}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Sector: <strong>{data.application.business_type_name}</strong> | Submitted on {new Date(data.application.submitted_at || Date.now()).toLocaleDateString('en-GB')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-300 block mb-1">Status</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-[#07182C] font-extrabold text-xs inline-block">
              Under Active Parallel Scrutiny
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-3.5 text-center">
            <p className="text-xl font-extrabold text-white">{data.bundles.length}</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">Departments Dispatched</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 text-center">
            <p className="text-xl font-extrabold text-emerald-400">100%</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">SLA Compliance</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 text-center">
            <p className="text-xl font-extrabold text-sky-400">48-72h</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">Statutory Clock</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 text-center">
            <p className="text-xl font-extrabold text-amber-300">Active</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">Deemed Approval Protection</p>
          </div>
        </div>
      </div>

      {/* Per Department Dispatch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.bundles.map((bundle) => {
          const countdown = formatCountdown(bundle.sla_deadline);
          return (
            <div key={bundle.id} className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#07182C] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{bundle.department_name}</h4>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Statutory Authority
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400">SLA Window</span>
                  <p className="text-xs font-extrabold text-slate-700">{bundle.sla_hours} Hours</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center my-3 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Time Remaining Before Deemed Approval
                </span>
                <p className="text-2xl font-mono font-extrabold text-[#07182C] mt-1">
                  {countdown}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Parallel Scrutiny Active</span>
                <span className="font-semibold text-emerald-600">✓ On Schedule</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#07182C] hover:bg-[#0B2545] text-white font-bold rounded-2xl shadow-lg transition cursor-pointer"
        >
          Return to User Dashboard
        </button>
      </div>
    </div>
  );
};
