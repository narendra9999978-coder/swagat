import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Target, 
  MessagesSquare, 
  Route, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Differentiation: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      number: '01',
      title: t('diff_card1_title'),
      desc: t('diff_card1_desc'),
      icon: Target,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      tag: 'Citizen-Centric'
    },
    {
      number: '02',
      title: t('diff_card2_title'),
      desc: t('diff_card2_desc'),
      icon: MessagesSquare,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      tag: 'Natural Language'
    },
    {
      number: '03',
      title: t('diff_card3_title'),
      desc: t('diff_card3_desc'),
      icon: Route,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tag: 'Unified Roadmap'
    },
    {
      number: '04',
      title: t('diff_card4_title'),
      desc: t('diff_card4_desc'),
      icon: Sparkles,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      tag: 'Zero Overwhelm'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#E05A10] uppercase tracking-wider mb-3">
            <span>GovTech Differentiation</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('diff_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
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
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-gov-sm hover:shadow-gov-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${pillar.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 text-[11px] font-bold text-[#0B2545] flex items-center space-x-1">
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
