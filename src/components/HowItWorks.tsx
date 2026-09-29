import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { useSwagat } from '../context/SwagatContext';
import { 
  MessageSquareQuote, 
  BrainCircuit, 
  Layers, 
  Route, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const { openAskModal } = useJourney();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: t('how_step1_title'),
      desc: t('how_step1_desc'),
      example: '"I want to start a small bakery in Pune, Maharashtra."',
      icon: MessageSquareQuote,
      color: 'bg-blue-600',
      badge: 'Input Phase',
      citizenBenefit: 'No need to know official act names or department numbers.'
    },
    {
      number: '02',
      title: t('how_step2_title'),
      desc: t('how_step2_desc'),
      example: 'SWAGAT clarifies: "Will your annual turnover exceed ₹12 Lakhs? Do you plan to employ more than 10 workers?"',
      icon: BrainCircuit,
      color: 'bg-amber-600',
      badge: 'Intent Extraction',
      citizenBenefit: 'Eliminates 90% of irrelevant legal questions immediately.'
    },
    {
      number: '03',
      title: t('how_step3_title'),
      desc: t('how_step3_desc'),
      example: 'Identified: FSSAI FoSCoS (Food), Udyam MSME (Identity), Aaple Sarkar (Shop Act Gumasta), PMEGP (35% Subsidy).',
      icon: Layers,
      color: 'bg-emerald-600',
      badge: 'Cross-Department Mapping',
      citizenBenefit: 'Bridges Central ministries and State departments into 1 unified list.'
    },
    {
      number: '04',
      title: t('how_step4_title'),
      desc: t('how_step4_desc'),
      example: 'Generated Roadmap: Step 1 (Udyam) → Step 2 (Gumasta) → Step 3 (FSSAI) → Step 4 (PMEGP Grant).',
      icon: Route,
      color: 'bg-purple-600',
      badge: 'Personalized Roadmap',
      citizenBenefit: 'Ensures prerequisite documents are ready before paying official portal fees.'
    },
    {
      number: '05',
      title: t('how_step5_title'),
      desc: t('how_step5_desc'),
      example: 'Next Best Action: "Upload premises rent agreement to generate pre-filled FSSAI submission on FoSCoS portal."',
      icon: Sparkles,
      color: 'bg-[#E05A10]',
      badge: 'Guaranteed Action',
      citizenBenefit: 'Direct handoff to official portals with zero guesswork.'
    }
  ];

  return (
    <section id="how-it-works" className={`py-16 sm:py-24 border-b transition-colors ${
      isDark
        ? 'bg-transparent border-white/8'
        : 'bg-white border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark
              ? 'bg-blue-500/10 border-blue-400/20 text-blue-300'
              : 'bg-blue-50 border-blue-200 text-[#0B2545]'
          }`}>
            <span>{t('how_badge')}</span>
          </div>
          <h2 className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}>
            {t('how_heading')}
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t('how_subheading')}
          </p>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-b from-blue-500/15 to-slate-900/80 border-sky-400/50 shadow-lg ring-2 ring-sky-400/20 scale-[1.02]'
                      : 'bg-gradient-to-b from-blue-50/80 to-white border-[#0B2545] shadow-gov-lg ring-2 ring-[#0B2545]/15 scale-[1.02]'
                    : isDark
                      ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-display font-black text-2xl ${
                      isDark ? 'text-slate-500' : 'text-slate-300'
                    }`}>
                      {step.number}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${step.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-2 ${
                    isDark
                      ? 'text-slate-400 bg-white/5 border-white/10'
                      : 'text-slate-500 bg-white border-slate-200'
                  }`}>
                    {step.badge}
                  </span>

                  <h3 className={`font-bold text-base mb-2 leading-snug ${
                    isDark ? 'text-white' : 'text-[#0B2545]'
                  }`}>
                    {step.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                <div className={`pt-3 border-t text-[11px] font-semibold flex items-center space-x-1 ${
                  isDark ? 'border-white/10 text-emerald-400' : 'border-slate-200/60 text-[#057A55]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.citizenBenefit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Preview Panel */}
        <div className={`rounded-3xl p-6 sm:p-8 shadow-gov-xl border relative overflow-hidden ${
          isDark
            ? 'bg-slate-900 text-white border-slate-800'
            : 'bg-[#0B2545] text-white border-[#0B2545]'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E05A10] text-white text-xs font-bold uppercase">
                  Step {steps[activeStep].number} In Detail
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {steps[activeStep].title}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-amber-300 leading-relaxed">
                {steps[activeStep].example}
              </div>

              <p className="text-xs text-slate-300">
                Click any of the 5 cards above to inspect each phase of the SWAGAT Journey Engine.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => openAskModal()}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E05A10] text-white font-bold text-sm shadow-md hover:shadow-gov-glow transition active:scale-95"
              >
                <span>Ask SWAGAT with Your Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
