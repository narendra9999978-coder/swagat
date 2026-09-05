import React, { useState, useEffect } from 'react';
import {
  ChevronRight, CheckCircle2, Circle, ArrowLeft, ArrowRight,
  Upload, FileText, ShieldCheck, Loader2, X, AlertCircle,
  Clock, Building2, Leaf, Send, RefreshCw, ExternalLink
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { applicantApi, ChecklistDocumentAPI, ApplicationStatusResponseAPI } from '../services/api';
import { TreeNodeAPI } from '../services/api';
import { WizardStep } from '../types/swagat';

const WIZARD_STEPS: { key: WizardStep; label: string; short: string }[] = [
  { key: 'business_registration', label: 'Business Registration', short: 'Registration' },
  { key: 'business_activity', label: 'Business Activity Details', short: 'Activity' },
  { key: 'foreign_investment', label: 'Foreign Investment Details', short: 'Investment' },
  { key: 'project_land', label: 'Project Land Details', short: 'Land' },
];

type WizardPhase = 'questionnaire' | 'checklist' | 'sla';

export const SectorWizard: React.FC = () => {
  const { wizardSession, setWizardSession, closeWizard, userProfile, showToast } = useSwagat();

  const [phase, setPhase] = useState<WizardPhase>('questionnaire');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Per-step state
  const [stepNodes, setStepNodes] = useState<TreeNodeAPI[]>([]);
  const [stepPath, setStepPath] = useState<TreeNodeAPI[]>([]);
  const [leafReached, setLeafReached] = useState(false);
  const [leafNodeId, setLeafNodeId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [loadingNodes, setLoadingNodes] = useState(false);

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistDocumentAPI[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // SLA state
  const [slaData, setSlaData] = useState<ApplicationStatusResponseAPI | null>(null);
  const [slaPolling, setSlaPolling] = useState<NodeJS.Timeout | null>(null);

  const activeStep = WIZARD_STEPS[activeStepIndex];

  // Load root nodes when step changes
  useEffect(() => {
    if (phase !== 'questionnaire' || !wizardSession) return;
    loadRootNodes();
  }, [activeStepIndex, phase]);

  const loadRootNodes = async () => {
    if (!wizardSession) return;
    setLoadingNodes(true);
    setStepNodes([]);
    setStepPath([]);
    setLeafReached(false);
    setLeafNodeId(null);
    try {
      const nodes = await applicantApi.getRootNodes(wizardSession.businessType.id, activeStep.key);
      setStepNodes(nodes);
    } finally {
      setLoadingNodes(false);
    }
  };

  const handleOptionSelect = async (node: TreeNodeAPI) => {
    const newPath = [...stepPath, node];
    setStepPath(newPath);

    if (node.is_leaf) {
      setLeafReached(true);
      setLeafNodeId(node.id);
      setStepNodes([]);
      return;
    }

    // Load children
    setLoadingNodes(true);
    try {
      const children = await applicantApi.getNodeChildren(node.id, activeStep.key);
      setStepNodes(children);
    } finally {
      setLoadingNodes(false);
    }
  };

  const handleNextStep = () => {
    if (!leafReached) return;
    setCompletedSteps(prev => new Set([...prev, activeStep.key]));

    if (activeStepIndex < WIZARD_STEPS.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      // All 4 steps done — create draft & load checklist
      handleAllStepsComplete();
    }
  };

  const handleAllStepsComplete = async () => {
    if (!wizardSession) return;
    setSubmitting(true);
    try {
      const draft = await applicantApi.createDraft(wizardSession.businessType.id);
      setApplicationId(draft.id);
      const docs = await applicantApi.getChecklist(draft.id);
      setChecklist(docs);
      setPhase('checklist');
      showToast('Questionnaire complete! Review your document checklist.');
    } catch (e) {
      showToast('Error loading checklist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (docId: string, file: File) => {
    setUploadingDoc(docId);
    try {
      await applicantApi.uploadDocument(docId, file);
      setUploadedDocs(prev => ({ ...prev, [docId]: file }));
      setChecklist(prev => prev.map(d =>
        d.id === docId ? { ...d, status: 'pending_review' as const, file_url: URL.createObjectURL(file) } : d
      ));
      showToast(`"${file.name}" uploaded successfully.`);
    } catch {
      showToast('Upload failed. Please try again.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationId) return;
    const mandatoryUnuploaded = checklist.filter(
      d => d.is_mandatory && !d.reused_from_vault && !uploadedDocs[d.id] && !d.file_url
    );
    if (mandatoryUnuploaded.length > 0) {
      showToast(`Please upload all mandatory documents first (${mandatoryUnuploaded.length} remaining).`);
      return;
    }
    setSubmitting(true);
    try {
      await applicantApi.submitApplication(applicationId);
      const status = await applicantApi.getStatus(applicationId);
      setSlaData(status);
      setPhase('sla');
      showToast('Application submitted! Parallel processing initiated.');
      // Poll every 30 seconds
      const interval = setInterval(async () => {
        const updated = await applicantApi.getStatus(applicationId!);
        setSlaData(updated);
      }, 30000);
      setSlaPolling(interval);
    } catch {
      showToast('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => { if (slaPolling) clearInterval(slaPolling); };
  }, [slaPolling]);

  if (!wizardSession) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Header */}
      <div className="bg-[#07182C] text-white py-3 px-4 sm:px-8 border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeWizard}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-sm font-bold text-amber-400">
              {wizardSession.businessType.name} — Application Wizard
            </span>
          </div>
          <button onClick={closeWizard} className="p-1.5 text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      {phase === 'questionnaire' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-1">
              {WIZARD_STEPS.map((step, idx) => {
                const isDone = completedSteps.has(step.key);
                const isActive = idx === activeStepIndex;
                return (
                  <React.Fragment key={step.key}>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition ${
                      isActive ? 'bg-emerald-50 border border-emerald-200' :
                      isDone ? 'bg-slate-50' : 'opacity-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDone ? 'bg-emerald-500 text-white' :
                        isActive ? 'bg-[#07182C] text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-[#07182C]' : 'text-slate-500'}`}>
                        {step.short}
                      </span>
                    </div>
                    {idx < WIZARD_STEPS.length - 1 && (
                      <ChevronRight className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-slate-300'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">

        {/* ── QUESTIONNAIRE PHASE ─────────────────────────────────────── */}
        {phase === 'questionnaire' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#07182C]">Step {activeStepIndex + 1}: {activeStep.label}</h2>
              <p className="text-sm text-slate-500 mt-1">Answer the questions below to determine your applicable requirements.</p>
            </div>

            {/* Breadcrumb path */}
            {stepPath.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="text-slate-400">Your answers:</span>
                {stepPath.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium border border-emerald-200">
                      {node.label}
                    </span>
                    {i < stepPath.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Question / Leaf display */}
            {leafReached ? (
              /* Leaf reached */
              <div className="border-2 border-dashed border-emerald-500 bg-emerald-50 rounded-3xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Step Complete!</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  Your classification for <strong>{activeStep.label}</strong> has been determined.
                </p>
                <div className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-600 inline-block">
                  <strong>Selected:</strong> {stepPath[stepPath.length - 1]?.label}
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleNextStep}
                    disabled={submitting}
                    className="px-8 py-3 bg-[#07182C] hover:bg-[#0B2545] text-white font-bold rounded-2xl shadow-lg transition flex items-center space-x-2 mx-auto disabled:opacity-60"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></>
                    ) : (
                      <>{activeStepIndex < 3 ? <><span>Next Step</span><ArrowRight className="w-4 h-4" /></> : <><span>View Checklist</span><CheckCircle2 className="w-4 h-4" /></>}</>
                    )}
                  </button>
                </div>
              </div>
            ) : loadingNodes ? (
              /* Loading */
              <div className="border-2 border-dashed border-slate-300 bg-white rounded-3xl p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                <p className="text-sm text-slate-500 mt-3">Loading questions…</p>
              </div>
            ) : stepNodes.length > 0 ? (
              /* Question container — green dotted border */
              <div className="border-2 border-dashed border-emerald-500 bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-start space-x-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">
                    Q
                  </div>
                  <h3 className="text-base font-bold text-[#07182C] leading-snug">
                    {/* Show the question label from the last question node in path, or the first node if path is empty */}
                    {stepPath.length > 0
                      ? stepNodes[0]?.label // This is the question after the previous option
                      : stepNodes[0]?.label}
                  </h3>
                </div>

                <div className="space-y-2 pl-11">
                  {stepNodes
                    .filter(n => n.node_type === 'option')
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left px-5 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-sm font-medium text-slate-800 flex items-center justify-between group"
                      >
                        <span>{option.label}</span>
                        <div className="flex items-center space-x-2">
                          {option.is_leaf && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Terminal</span>}
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition" />
                        </div>
                      </button>
                    ))}
                </div>

                {stepPath.length > 0 && (
                  <button
                    onClick={loadRootNodes}
                    className="mt-4 ml-11 text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restart this step</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 bg-white rounded-3xl p-12 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm text-slate-500 mt-3">No questions available for this step.</p>
                <button onClick={loadRootNodes} className="mt-3 text-xs text-blue-600 hover:underline">Retry</button>
              </div>
            )}
          </div>
        )}

        {/* ── CHECKLIST PHASE ─────────────────────────────────────────── */}
        {phase === 'checklist' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#07182C]">Document Checklist</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload the required documents below. Previously verified documents are auto-reused from your vault.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Documents', val: checklist.length, color: 'text-slate-900' },
                { label: 'Auto-Reused', val: checklist.filter(d => d.reused_from_vault).length, color: 'text-emerald-600' },
                { label: 'Need Upload', val: checklist.filter(d => !d.reused_from_vault).length, color: 'text-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                  <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Document list */}
            <div className="space-y-3">
              {checklist.map((doc) => (
                <div
                  key={doc.id}
                  className={`bg-white rounded-2xl p-4 border-2 transition ${
                    doc.reused_from_vault ? 'border-emerald-200 bg-emerald-50/40' :
                    uploadedDocs[doc.id] ? 'border-blue-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.reused_from_vault ? 'bg-emerald-100' :
                        uploadedDocs[doc.id] ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        {doc.reused_from_vault ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        ) : uploadedDocs[doc.id] ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 flex items-center space-x-2 flex-wrap gap-1">
                          <span>{doc.document_type_name}</span>
                          {doc.is_mandatory && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Mandatory</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{doc.department_name}</div>

                        {doc.reused_from_vault ? (
                          <div className="mt-2 flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✅ Already verified — reused from vault</span>
                          </div>
                        ) : uploadedDocs[doc.id] ? (
                          <div className="mt-2 flex items-center space-x-2 text-xs text-blue-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Uploaded: {uploadedDocs[doc.id].name}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Upload button for non-vault docs */}
                    {!doc.reused_from_vault && (
                      <div className="shrink-0">
                        <label
                          htmlFor={`upload-${doc.id}`}
                          className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            uploadedDocs[doc.id]
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-[#07182C] text-white hover:bg-[#0B2545]'
                          }`}
                        >
                          {uploadingDoc === doc.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{uploadedDocs[doc.id] ? 'Re-upload' : 'Upload'}</span>
                        </label>
                        <input
                          id={`upload-${doc.id}`}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setPhase('questionnaire')}
                className="flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Questionnaire</span>
              </button>

              <button
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold rounded-2xl shadow-lg transition disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting…</span></>
                ) : (
                  <><Send className="w-4 h-4" /><span>Submit Application</span></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── SLA DASHBOARD PHASE ─────────────────────────────────────── */}
        {phase === 'sla' && slaData && (
          <SLADashboard data={slaData} onClose={closeWizard} />
        )}
      </div>
    </div>
  );
};

// ── SLA Dashboard sub-component ───────────────────────────────────────────────

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

  const getProgress = (dispatched?: string, deadline?: string): number => {
    if (!dispatched || !deadline) return 0;
    const total = new Date(deadline).getTime() - new Date(dispatched).getTime();
    const elapsed = now - new Date(dispatched).getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string; ring: string }> = {
    pending:         { label: 'Pending', color: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-300' },
    in_review:       { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50', ring: 'ring-blue-300' },
    approved:        { label: 'Approved ✓', color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-400' },
    deemed_approved: { label: 'Deemed Approved', color: 'text-teal-700', bg: 'bg-teal-50', ring: 'ring-teal-400' },
    breached:        { label: 'SLA Breached!', color: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#07182C] to-[#0B2545] rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Live SLA Dashboard</div>
            <h2 className="text-xl font-extrabold">Application #{data.application.id.substring(0, 12)}…</h2>
            <p className="text-sm text-white/70 mt-1">
              Submitted {data.application.submitted_at ? new Date(data.application.submitted_at).toLocaleString('en-IN') : '—'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60 mb-1">Overall Status</div>
            <div className="px-3 py-1 bg-amber-500 rounded-xl text-xs font-bold capitalize">
              {data.application.status.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Dept. Processing', val: data.bundles.length },
            { label: 'Approved', val: data.bundles.filter(b => b.status === 'approved').length, color: 'text-emerald-400' },
            { label: 'In Review', val: data.bundles.filter(b => b.status === 'in_review').length, color: 'text-blue-400' },
            { label: 'SLA Breached', val: data.bundles.filter(b => b.status === 'breached').length, color: 'text-rose-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <div className={`text-2xl font-extrabold ${stat.color || 'text-white'}`}>{stat.val}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-department cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.bundles.map((bundle) => {
          const cfg = statusConfig[bundle.status] || statusConfig.pending;
          const countdown = formatCountdown(bundle.sla_deadline);
          const progress = getProgress(bundle.dispatched_at, bundle.sla_deadline);
          const isBreached = bundle.status === 'breached' || countdown === 'BREACHED';

          return (
            <div
              key={bundle.id}
              className={`bg-white rounded-3xl border-2 p-5 shadow-sm ring-2 ${cfg.ring} transition-all`}
            >
              {/* Department header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                    <Building2 className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{bundle.department_name}</div>
                    <div className={`text-xs font-semibold ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-full mt-1 inline-block`}>
                      {cfg.label}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">SLA</div>
                  <div className="text-xs font-bold text-slate-700">{bundle.sla_hours}h</div>
                </div>
              </div>

              {/* Countdown timer */}
              <div className={`rounded-2xl p-4 text-center mb-3 ${isBreached ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50'}`}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Time Remaining</span>
                </div>
                <div className={`text-2xl font-mono font-extrabold tracking-wider ${
                  isBreached ? 'text-rose-600' :
                  countdown.split(':')[0] && parseInt(countdown.split(':')[0]) < 2 ? 'text-amber-600' :
                  'text-[#07182C]'
                }`}>
                  {bundle.status === 'approved' || bundle.status === 'deemed_approved' ? '✓ DONE' : countdown}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    isBreached ? 'bg-rose-500' :
                    bundle.status === 'approved' ? 'bg-emerald-500' :
                    progress > 75 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${bundle.status === 'approved' ? 100 : progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Dispatched</span>
                <span className="font-mono">{Math.round(progress)}% elapsed</span>
                <span>SLA Deadline</span>
              </div>

              {bundle.reassigned_count > 0 && (
                <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  ⚠️ Reassigned {bundle.reassigned_count}× due to SLA breach
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#07182C] text-white font-bold rounded-2xl shadow-lg hover:bg-[#0B2545] transition"
        >
          Back to Dashboard
        </button>
        <p className="text-xs text-slate-400 mt-2">SLA timers update live. Refreshes automatically every 30 seconds.</p>
      </div>
    </div>
  );
};
