import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSwagat } from '../context/SwagatContext';
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
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const problems = [
    {
      id: 'portals',
      icon: Globe2,
      title: t('problem_card1_title'),
      desc: t('problem_card1_desc'),
      stat: '50+ Portals',
      statLabel: 'per citizen lifecycle',
      colorDark: 'from-rose-500/15 to-red-500/15',
      colorLight: 'from-rose-500/10 to-red-500/10',
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
      colorDark: 'from-amber-500/15 to-orange-500/15',
      colorLight: 'from-amber-500/10 to-orange-500/10',
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
      colorDark: 'from-blue-500/15 to-indigo-500/15',
      colorLight: 'from-blue-500/10 to-indigo-500/10',
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
      colorDark: 'from-purple-500/15 to-violet-500/15',
      colorLight: 'from-purple-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section className={`py-16 sm:py-24 border-b relative transition-colors ${
      isDark
        ? 'bg-transparent border-white/8'
        : 'bg-[#F8FAFC] border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark
              ? 'bg-orange-500/10 border-orange-400/20 text-orange-400'
              : 'bg-orange-50 border-orange-200 text-[#E05A10]'
          }`}>
            <span>{t('problem_badge')}</span>
          </div>
          <h2 className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}>
            {t('problem_heading')}
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
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
                className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl'
                    : 'bg-white border-slate-200 shadow-gov-sm hover:shadow-gov-md'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isDark ? prob.colorDark : prob.colorLight} flex items-center justify-center ${prob.iconColor} mb-5 border ${isDark ? 'border-white/10' : prob.borderColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className={`font-display font-bold text-lg mb-2.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {prob.title}
                  </h3>

                  <p className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {prob.desc}
                  </p>
                </div>

                <div className={`pt-6 mt-6 border-t flex items-baseline justify-between text-xs ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{prob.stat}</span>
                  <span className={`font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{prob.statLabel}</span>
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
