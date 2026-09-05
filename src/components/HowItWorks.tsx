import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
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
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: t('how_step1_title'),
      desc: t('how_step1_desc'),
      example: '“I want to start a small bakery in Pune, Maharashtra.”',
      icon: MessageSquareQuote,
      color: 'bg-blue-600',
      badge: 'Input Phase',
      citizenBenefit: 'No need to know official act names or department numbers.'
    },
    {
      number: '02',
      title: t('how_step2_title'),
      desc: t('how_step2_desc'),
      example: 'SWAGAT clarifies: “Will your annual turnover exceed ₹12 Lakhs? Do you plan to employ more than 10 workers?”',
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
      example: 'Next Best Action: “Upload premises rent agreement to generate pre-filled FSSAI submission on FoSCoS portal.”',
      icon: Sparkles,
      color: 'bg-[#E05A10]',
      badge: 'Guaranteed Action',
      citizenBenefit: 'Direct handoff to official portals with zero guesswork.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-3">
            <span>{t('how_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('how_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
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
                    ? 'bg-gradient-to-b from-blue-50/80 to-white border-[#0B2545] shadow-gov-lg ring-2 ring-[#0B2545]/15 scale-[1.02]'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-2xl text-slate-300 group-hover:text-slate-400">
                      {step.number}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${step.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mb-2">
                    {step.badge}
                  </span>

                  <h3 className="font-bold text-base text-[#0B2545] mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 text-[11px] text-[#057A55] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.citizenBenefit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Preview Panel */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-gov-xl border border-slate-800 relative overflow-hidden">
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
