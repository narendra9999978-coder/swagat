import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSwagat } from '../context/SwagatContext';
import { 
  Target, 
  MessagesSquare, 
  Route, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Differentiation: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const pillars = [
    {
      number: '01',
      title: t('diff_card1_title'),
      desc: t('diff_card1_desc'),
      icon: Target,
      colorDark: 'bg-blue-500/15 text-blue-400 border-blue-400/20',
      colorLight: 'bg-blue-50 text-blue-700 border-blue-200',
      tag: 'Citizen-Centric'
    },
    {
      number: '02',
      title: t('diff_card2_title'),
      desc: t('diff_card2_desc'),
      icon: MessagesSquare,
      colorDark: 'bg-amber-500/15 text-amber-400 border-amber-400/20',
      colorLight: 'bg-amber-50 text-amber-700 border-amber-200',
      tag: 'Natural Language'
    },
    {
      number: '03',
      title: t('diff_card3_title'),
      desc: t('diff_card3_desc'),
      icon: Route,
      colorDark: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/20',
      colorLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tag: 'Unified Roadmap'
    },
    {
      number: '04',
      title: t('diff_card4_title'),
      desc: t('diff_card4_desc'),
      icon: Sparkles,
      colorDark: 'bg-orange-500/15 text-orange-400 border-orange-400/20',
      colorLight: 'bg-orange-50 text-orange-700 border-orange-200',
      tag: 'Zero Overwhelm'
    }
  ];

  return (
    <section className={`py-16 sm:py-24 border-b transition-colors ${
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
            <span>GovTech Differentiation</span>
          </div>
          <h2 className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}>
            {t('diff_heading')}
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Engineered to bridge the gap between citizen intent and official public administration.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl'
                    : 'bg-white border-slate-200/90 shadow-gov-sm hover:shadow-gov-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDark ? pillar.colorDark : pillar.colorLight}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isDark
                        ? 'bg-white/5 text-slate-400 border border-white/10'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className={`font-display font-bold text-lg mb-2.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {pillar.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {pillar.desc}
                  </p>
                </div>

                <div className={`pt-5 mt-5 border-t text-[11px] font-bold flex items-center space-x-1 ${
                  isDark
                    ? 'border-white/10 text-sky-300'
                    : 'border-slate-100 text-[#0B2545]'
                }`}>
                  <span>SWAGAT Core Pillar</span>
                  <ArrowRight className="w-3 h-3 text-[#E05A10]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
