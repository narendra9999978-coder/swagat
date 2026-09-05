import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Globe2, 
  BookX, 
  Compass, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Workflow
} from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const { t } = useLanguage();

  const problems = [
    {
      id: 'portals',
      icon: Globe2,
      title: t('problem_card1_title'),
      desc: t('problem_card1_desc'),
      stat: '50+ Portals',
      statLabel: 'per citizen lifecycle',
      color: 'from-rose-500/10 to-red-500/10',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-200'
    },
    {
      id: 'language',
      icon: BookX,
      title: t('problem_card2_title'),
      desc: t('problem_card2_desc'),
      stat: '74% Citizens',
      statLabel: 'struggle with official terms',
      color: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      id: 'start',
      icon: Compass,
      title: t('problem_card3_title'),
      desc: t('problem_card3_desc'),
      stat: '1st Step Barrier',
      statLabel: 'which ministry applies?',
      color: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'overload',
      icon: Layers,
      title: t('problem_card4_title'),
      desc: t('problem_card4_desc'),
      stat: '3,000+ Schemes',
      statLabel: 'scattered across sites',
      color: 'from-purple-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#E05A10] uppercase tracking-wider mb-3">
            <span>{t('problem_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('problem_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t('problem_subheading')}
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov-sm hover:shadow-gov-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prob.color} flex items-center justify-center ${prob.iconColor} mb-5 border ${prob.borderColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2.5">
                    {prob.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prob.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-900">{prob.stat}</span>
                  <span className="text-slate-400 font-medium">{prob.statLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolution Banner */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#07182C] text-white rounded-3xl p-6 sm:p-8 shadow-gov-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                {t('problem_resolution')}
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                From an intimidating labyrinth of portals to a personalized, step-by-step digital pathway.
              </p>
            </div>
          </div>

          <a
            href="#live-demo"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-[#0B2545] font-bold text-sm hover:bg-amber-50 shadow-md transition shrink-0"
          >
            <span>See SWAGAT in Action</span>
            <ArrowRight className="w-4 h-4 text-[#E05A10]" />
          </a>
        </div>

      </div>
    </section>
  );
};
