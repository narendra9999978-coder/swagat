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

export const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();

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
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#07182C] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-[#07182C]" />
            <span>GovTech Value Proposition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            {t('benefits_heading')}
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            {t('benefits_subheading')}
          </p>
        </div>

        {/* 6 Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-7 bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-2xs">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-[#07182C] mb-2">
                    {t(b.titleKey)}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {t(b.descKey)}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                    {b.points.map((pt, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 flex items-center text-xs font-bold text-[#07182C] group-hover:text-blue-700 transition-colors">
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
