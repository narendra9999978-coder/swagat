import React, { useState, useEffect } from 'react';
import { 
  Target, 
  BrainCircuit, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Send, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface StageNode {
  id: string;
  step: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  details: {
    swagatRole: string;
    output: string;
    integrations: string;
    govMetric: string;
  };
}

export const JourneyEngineVisual: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('understand');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const stages: StageNode[] = [
    {
      id: 'goal',
      step: 1,
      label: "User's Goal",
      sublabel: 'Natural statement',
      icon: Target,
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      details: {
        swagatRole: 'Accepts unstructured citizen query via Voice or Text in 6+ Indian languages without requiring bureaucratic jargon.',
        output: 'Structured intent graph with geographic jurisdiction & domain classification.',
        integrations: 'Natural Language Processing + Multilingual Whisper Speech Engine',
        govMetric: '< 250ms intent extraction latency'
      }
    },
    {
      id: 'understand',
      step: 2,
      label: 'Understand',
      sublabel: 'Clarify intent',
      icon: BrainCircuit,
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      details: {
        swagatRole: 'Synthesizes state-specific rules and asks 1 or 2 targeted questions (e.g. business scale, turnover, category) instead of lengthy forms.',
        output: 'Verified citizen profile context (Location, Tier, Investment Scale).',
        integrations: 'Dynamic Rule Matrices across 28 States & UTs',
        govMetric: 'Eliminates 80% redundant questionnaire friction'
      }
    },
    {
      id: 'services',
      step: 3,
      label: 'Find Services',
      sublabel: 'Central & State match',
      icon: Layers,
      color: 'from-emerald-600 to-teal-700',
      borderColor: 'border-emerald-300',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      details: {
        swagatRole: 'Cross-maps statutory clearances across Central Ministries and State Line Departments into a consolidated list.',
        output: 'Unified Service Stack (FSSAI, Udyam, Shop Act, Fire NOC, GSTIN).',
        integrations: 'National Single Window System (NSWS) & State Portals',
        govMetric: 'Prevents missed compliance penalties & delays'
      }
    },
    {
      id: 'eligibility',
      step: 4,
      label: 'Check Eligibility',
      sublabel: 'Filter grants & quotas',
      icon: CheckCircle2,
      color: 'from-cyan-600 to-blue-700',
      borderColor: 'border-cyan-300',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      details: {
        swagatRole: 'Evaluates citizen entitlement parameters against Central & State subsidy databases to uncover financial assistance.',
        output: 'Applicable subsidies: PMEGP 35% margin grant, MUDRA loan, State CMEGP.',
        integrations: 'MyScheme India + DBT Bharat Knowledge Engine',
        govMetric: 'Unlocks thousands in unclaimed citizen subsidies'
      }
    },
    {
      id: 'documents',
      step: 5,
      label: 'Prepare Documents',
      sublabel: 'Locker validation',
      icon: FileText,
      color: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      details: {
        swagatRole: 'Compiles unified document checklist, explains statutory necessity ("Why needed?"), and enables 1-click DigiLocker import.',
        output: 'Pre-validated document dossier ready for upload.',
        integrations: 'DigiLocker API + e-Sign + UIDAI eKYC',
        govMetric: 'Reduces application rejection rates by 68%'
      }
    },
    {
      id: 'apply',
      step: 6,
      label: 'Apply',
      sublabel: 'Official gateway',
      icon: Send,
      color: 'from-rose-600 to-orange-600',
      borderColor: 'border-rose-300',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      details: {
        swagatRole: 'Hands over citizen directly to verified official government portals (FoSCoS, Udyam, Aaple Sarkar) with pre-filled fields.',
        output: 'Direct launch deep-link into official submission desk.',
        integrations: 'Direct Portal Deep-linking + SSO Auth tokens',
        govMetric: '100% official security — Zero intermediary markups'
      }
    },
    {
      id: 'track',
      step: 7,
      label: 'Track & Next Step',
      sublabel: 'SLA Clock & Action',
      icon: Activity,
      color: 'from-emerald-700 to-[#0B2545]',
      borderColor: 'border-emerald-300',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      details: {
        swagatRole: 'Monitors statutory SLA timelines under Right to Public Services Acts and dynamically triggers the single "Next Best Action".',
        output: 'Real-time bottleneck alerts, SLA clock timer, escalation route.',
        integrations: 'CPGRAMS Citizen Escalation & State SLA Monitors',
        govMetric: 'Guaranteed citizen peace of mind until certificate delivery'
      }
    }
  ];

  // Auto cycle active stage every 4 seconds unless user clicked
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveStageId(current => {
        const idx = stages.findIndex(s => s.id === current);
        const nextIdx = (idx + 1) % stages.length;
        return stages[nextIdx].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, stages.length]);

  const activeStage = stages.find(s => s.id === activeStageId) || stages[0];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-gov-xl border border-slate-200/90 relative overflow-hidden">
      
      {/* Decorative top accent line with Indian Tri-color hint */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E05A10] via-[#0B2545] to-[#057A55]"></div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E05A10] animate-ping"></span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-[#0B2545]">
              SWAGAT Journey Engine
            </h3>
            <span className="text-[11px] font-semibold bg-blue-50 text-[#134074] px-2.5 py-0.5 rounded-full border border-blue-200">
              Interactive Flow Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end guidance orchestration — transforming vague citizen intent into guaranteed government action.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium text-slate-400">Auto-demonstration:</span>
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
              autoRotate ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {autoRotate ? 'Active ⚡' : 'Paused'}
          </button>
        </div>
      </div>

      {/* 7-Stage Flow Visual Pipeline (Interactive Horizontal / Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStageId;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setAutoRotate(false);
                setActiveStageId(stage.id);
              }}
              className={`relative text-left p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isActive 
                  ? 'bg-gradient-to-b from-white to-blue-50/50 border-[#0B2545] shadow-gov-md ring-2 ring-[#0B2545]/20 scale-[1.03] z-10' 
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-[#0B2545] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  0{stage.step}
                </span>

                {idx < stages.length - 1 && (
                  <ChevronRight className="hidden lg:block w-3.5 h-3.5 text-slate-300 -mr-1" />
                )}
              </div>

              {/* Icon & Label */}
              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stage.bgColor} ${stage.textColor} mb-1.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-snug">
                  {stage.label}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {stage.sublabel}
                </div>
              </div>

              {/* Active Bottom Glow */}
              {isActive && (
                <div className="absolute -bottom-1 left-3 right-3 h-1 bg-[#E05A10] rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Card */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B2545] to-[#07182C] text-white rounded-2xl p-5 sm:p-6 shadow-gov-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Stage 0{activeStage.step} Inspection</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                {activeStage.label}
              </h4>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {activeStage.details.swagatRole}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[11px] mb-0.5">Engine Output:</div>
                <div className="text-emerald-300 font-semibold">{activeStage.details.output}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <div className="text-slate-400 font-medium text-[11px] mb-0.5">GovTech Integration:</div>
                <div className="text-blue-200 font-semibold">{activeStage.details.integrations}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 lg:w-64 flex flex-col justify-center text-center space-y-1">
            <span className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">Citizen Metric</span>
            <div className="text-sm font-extrabold text-white">
              {activeStage.details.govMetric}
            </div>
            <div className="text-[10px] text-slate-300 pt-1">
              Active in SWAGAT Core v2.4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
