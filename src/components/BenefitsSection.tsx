import React from 'react';
import { 
  Layers, 
  Activity, 
  FolderLock, 
  RefreshCw, 
  MessageSquareDiff, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSwagat } from '../context/SwagatContext';

export const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const benefits = [
    {
      icon: Layers,
      titleKey: 'b1_title',
      descKey: 'b1_desc',
      color: 'from-blue-600 to-indigo-700',
      badge: 'Single Sign-On',
      points: ['Central & State unified form', 'Common Application Form (CAF)', 'Direct API integration with 40+ portals']
    },
    {
      icon: Activity,
      titleKey: 'b2_title',
      descKey: 'b2_desc',
      color: 'from-amber-500 to-orange-600',
      badge: 'Statutory Timelines',
      points: ['Unified tracking ID across departments', 'Real-time status stage progression', 'Automated SMS & WhatsApp alerts']
    },
    {
      icon: FolderLock,
      titleKey: 'b3_title',
      descKey: 'b3_desc',
      color: 'from-emerald-600 to-teal-700',
      badge: 'DigiLocker Integrated',
      points: ['Upload corporate documents once', 'Pre-verified PAN, GST, and CIN', 'Zero redundant physical paper submissions']
    },
    {
      icon: RefreshCw,
      titleKey: 'b4_title',
      descKey: 'b4_desc',
      color: 'from-sky-500 to-cyan-700',
      badge: 'Never Expire',
      points: ['60-day advance expiry warnings', '1-click renewal fee payment', 'Auto-drafted compliance declarations']
    },
    {
      icon: MessageSquareDiff,
      titleKey: 'b5_title',
      descKey: 'b5_desc',
      color: 'from-rose-500 to-pink-700',
      badge: 'Transparent Audit',
      points: ['Clarify departmental queries online', 'Attach supplementary drawings easily', 'Time-bound grievance escalation desk']
    },
    {
      icon: Sparkles,
      titleKey: 'b6_title',
      descKey: 'b6_desc',
      color: 'from-purple-600 to-indigo-800',
      badge: 'AI Smart Engine',
      points: ['Tailored statutory checklist in 2 mins', 'Sector & scale specific criteria mapping', 'Overlapping compliance deduplication']
    }
  ];

  return (
    <section className={`py-20 bg-transparent border-t relative ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md border ${
            isDark ? 'bg-blue-500/10 border-blue-400/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>GovTech Value Proposition</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#102A43]'
          }`}>
            {t('benefits_heading')}
          </h2>
          <p className={`mt-3 text-base ${
            isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'
          }`}>
            {t('benefits_subheading')}
          </p>
        </div>

        {/* 6 Benefits Cards Grid — Option A Clean Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`swagat-card group relative rounded-3xl p-7 border shadow-sm hover:shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#07182C] border-white/15 text-white shadow-black/40'
                    : 'bg-white border-[#D8E2EE] text-[#102A43] shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      isDark 
                        ? 'bg-white/10 text-[#AFC4D8] border-white/10' 
                        : 'bg-[#F1F5F9] text-[#334E68] border-[#CBD5E1]'
                    }`}>
                      {b.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-display font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-[#102A43]'
                  }`}>
                    {t(b.titleKey)}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'
                  }`}>
                    {t(b.descKey)}
                  </p>

                  <ul className={`space-y-2 pt-2 border-t text-xs ${
                    isDark ? 'border-white/10 text-[#D9E7F5]' : 'border-[#D8E2EE] text-[#334E68]'
                  }`}>
                    {b.points.map((pt, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`mt-6 pt-3 flex items-center text-xs font-bold transition-colors ${
                  isDark 
                    ? 'text-sky-300 group-hover:text-sky-200' 
                    : 'text-[#0284C7] group-hover:text-[#0369A1]'
                }`}>
                  <span>Learn workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
