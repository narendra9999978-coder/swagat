import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  AlertCircle, 
  Lock, 
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export const JourneyDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { 
    currentScenario, 
    activeStepIndex, 
    setActiveStepIndex, 
    checkedDocIds, 
    toggleDocCheck, 
    importDigiLockerDocs,
    completedStepIds,
    toggleStepComplete,
    triggerConfetti,
    openAskModal
  } = useJourney();

  const [activeTab, setActiveTab] = useState<'milestones' | 'documents' | 'portals'>('milestones');

  const totalSteps = currentScenario.journeySteps.length;
  const completedCount = completedStepIds.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  const activeStep = currentScenario.journeySteps[activeStepIndex] || currentScenario.journeySteps[0];

  return (
    <section id="my-journey" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#0B2545] text-xs font-bold uppercase tracking-wider mb-2">
              <span>{t('dashboard_badge')}</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B2545]">
              {t('dashboard_heading')}
            </h2>
            <div className="flex items-center space-x-3 mt-2 text-sm text-slate-600 font-medium">
              <span className="text-[#0B2545] font-bold">{currentScenario.title}</span>
              <span>•</span>
              <span className="text-slate-500">{currentScenario.state}</span>
              <span>•</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">Active Session</span>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-gov-sm flex items-center space-x-4 min-w-[260px]">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#E2E8F0"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#E05A10"
                  strokeWidth="5"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * progressPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute font-display font-black text-sm text-[#0B2545]">
                {progressPercentage}%
              </span>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('dashboard_progress')}
              </div>
              <div className="text-sm font-bold text-slate-800">
                {completedCount} of {totalSteps} Milestones Complete
              </div>
            </div>
          </div>
        </div>

        {/* PROMINENT "NEXT BEST ACTION" CARD */}
        <div className="mb-10 bg-gradient-to-r from-amber-500 via-[#E05A10] to-[#C2410C] text-white rounded-3xl p-6 sm:p-7 shadow-gov-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white/5 skew-x-12 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('dashboard_next_best')}</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white">
                {currentScenario.nextBestAction.title}
              </h3>

              <p className="text-sm text-orange-50 leading-relaxed">
                {currentScenario.nextBestAction.description}
              </p>

              <div className="flex items-center space-x-2 text-xs font-medium text-amber-200 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentScenario.nextBestAction.estimatedTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="next-best-action-cta-btn"
                onClick={() => {
                  setActiveTab('documents');
                  triggerConfetti();
                }}
                className="px-6 py-3.5 rounded-2xl bg-white text-[#0B2545] font-bold text-sm hover:bg-orange-50 shadow-md hover:shadow-gov-lg transition active:scale-95 flex items-center space-x-2"
              >
                <span>{currentScenario.nextBestAction.ctaText}</span>
              </button>

              <button
                onClick={() => openAskModal(`How do I complete: ${currentScenario.nextBestAction.title}?`)}
                className="px-4 py-3.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-semibold text-xs transition border border-white/20"
              >
                Ask SWAGAT for Help
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content Area */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-gov-xl p-6 sm:p-8">
          
          {/* Tab Navigation Bar */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'milestones'
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1. {t('dashboard_active_steps')} ({totalSteps})
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'documents'
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. {t('dashboard_documents')} ({currentScenario.requiredDocs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('portals')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'portals'
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              3. Official Portal Deep Links ({currentScenario.officialPortals.length})
            </button>
          </div>

          {/* TAB 1: MILESTONES ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Timeline Step List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select a milestone to inspect details:
                </div>

                {currentScenario.journeySteps.map((step, idx) => {
                  const isCompleted = completedStepIds.includes(step.id);
                  const isSelected = activeStepIndex === idx;

                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50/70 border-[#0B2545] shadow-gov-sm ring-1 ring-[#0B2545]'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStepComplete(step.id);
                            }}
                            className="mt-0.5"
                            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                            )}
                          </button>

                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Milestone 0{step.stepNumber}
                            </div>
                            <div className={`text-sm font-bold leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {step.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{step.department}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSelected
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isCompleted ? 'Completed' : step.estimatedDays}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Step Inspection & Action Box */}
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                  <div>
                    <span className="text-[11px] font-bold text-[#E05A10] uppercase tracking-wider">
                      Milestone 0{activeStep.stepNumber} Details
                    </span>
                    <h3 className="font-display font-bold text-xl text-[#0B2545] mt-0.5">
                      {activeStep.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleStepComplete(activeStep.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      completedStepIds.includes(activeStep.id)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#0B2545] text-white hover:bg-[#134074]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedStepIds.includes(activeStep.id) ? 'Completed ✓' : 'Mark Milestone Done'}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-5">
                  {activeStep.description}
                </p>

                {/* Instructions Box */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Step Instructions &amp; Action Checklist:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activeStep.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0B2545] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-0.5">Official Portal:</span>
                    <span className="font-bold text-[#0B2545]">{activeStep.portalName}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-0.5">Estimated Duration:</span>
                    <span className="font-bold text-emerald-700">{activeStep.estimatedDays}</span>
                  </div>
                </div>

                {/* Portal Launcher Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    Direct handoff to authenticated official government desk.
                  </span>

                  <a
                    href={activeStep.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#134074] text-white text-xs font-bold hover:shadow-md transition"
                  >
                    <span>Launch {activeStep.portalName.split('/')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REQUIRED DOCUMENTS LOCKER */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                <div>
                  <h4 className="font-bold text-sm text-[#0B2545]">
                    DigiLocker Integration Assistant
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pre-validate and link your digital identity documents to prevent portal rejection.
                  </p>
                </div>

                <button
                  id="import-digilocker-btn"
                  onClick={importDigiLockerDocs}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>1-Click DigiLocker Auto-Sync</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScenario.requiredDocs.map((doc) => {
                  const isChecked = checkedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isChecked 
                          ? 'bg-emerald-50/50 border-emerald-300' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDocCheck(doc.id)}
                            className="w-4 h-4 mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">{doc.name}</span>
                            <span className="text-xs text-slate-500">{doc.issuingAuthority}</span>
                          </div>
                        </label>

                        {doc.digiLockerFetchable && (
                          <span className="text-[10px] font-bold bg-blue-100 text-[#0B2545] px-2 py-0.5 rounded-full shrink-0">
                            DigiLocker
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100 mt-2">
                        <strong className="text-slate-800 font-semibold block mb-0.5">Why needed:</strong>
                        {doc.whyNeeded}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL PORTALS */}
          {activeTab === 'portals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentScenario.officialPortals.map((portal, i) => (
                <a
                  key={i}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {portal.acronym}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0B2545] transition" />
                    </div>
                    <h4 className="font-bold text-base text-[#0B2545] group-hover:text-blue-700">
                      {portal.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {portal.role}
                    </p>
                  </div>

                  <div className="text-[11px] text-[#E05A10] font-semibold mt-4 flex items-center space-x-1">
                    <span>Open Official Gov Gateway</span>
                    <span>→</span>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
