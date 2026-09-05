import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { 
  ShieldCheck, 
  Eye, 
  FileLock2, 
  AlertTriangle,
  Cpu,
  ArrowRight
} from 'lucide-react';

export const TrustTransparency: React.FC = () => {
  const { t } = useLanguage();
  const { setIsArchitectureModalOpen } = useJourney();

  const trustCards = [
    {
      title: t('trust_card1_title'),
      desc: t('trust_card1_desc'),
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: t('trust_card2_title'),
      desc: t('trust_card2_desc'),
      icon: Eye,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: t('trust_card3_title'),
      desc: t('trust_card3_desc'),
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: t('trust_card4_title'),
      desc: t('trust_card4_desc'),
      icon: FileLock2,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
            <span>{t('trust_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('trust_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Engineered with strict ethical boundaries, official source attribution, and zero-compromise citizen privacy.
          </p>
        </div>

        {/* 4 Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-gov-sm flex items-start space-x-4"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Architecture Presentation Trigger Box */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#134074] text-white rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-gov-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                GovTech Backend &amp; Integration Architecture
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                Explore the technical blueprint: React/Flutter Touchpoints, Go/Gin Core, NATS Queue, and IndiaStack Connectors.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-white text-[#0B2545] font-bold text-xs hover:bg-amber-50 transition shadow-sm shrink-0 flex items-center space-x-2"
          >
            <span>View Architecture Schema</span>
            <ArrowRight className="w-4 h-4 text-[#E05A10]" />
          </button>
        </div>

      </div>
    </section>
  );
};
