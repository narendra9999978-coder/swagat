import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { ALL_SCHEMES } from '../data/schemes';
import { 
  GraduationCap, 
  Tractor, 
  Briefcase, 
  Users, 
  HeartHandshake, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  ExternalLink,
  Award
} from 'lucide-react';
import { SchemeItem } from '../types';

export const SchemeDiscovery: React.FC = () => {
  const { t, language } = useLanguage();
  const { setSelectedSchemeModal, openAskModal } = useJourney();
  const [selectedPersona, setSelectedPersona] = useState<string>('Student');

  const personas = [
    { id: 'Student', label: 'Student', desc: 'Looking for financial assistance for education', icon: GraduationCap, color: 'bg-blue-600' },
    { id: 'Farmer', label: 'Farmer', desc: 'Looking for agricultural & input support', icon: Tractor, color: 'bg-emerald-600' },
    { id: 'Entrepreneur', label: 'Entrepreneur', desc: 'Looking for business subsidies & credit', icon: Briefcase, color: 'bg-amber-600' },
    { id: 'Job Seeker', label: 'Job Seeker', desc: 'Looking for microcredit & skills', icon: Users, color: 'bg-purple-600' },
    { id: 'Women', label: 'Women', desc: 'Self-Help Group (SHG) & enterprise grants', icon: HeartHandshake, color: 'bg-rose-600' },
    { id: 'Senior Citizen', label: 'Senior Citizen', desc: 'Healthcare cover & social security', icon: UserCheck, color: 'bg-slate-700' },
  ];

  const matchedSchemes = ALL_SCHEMES.filter(
    s => s.targetGroup === selectedPersona || (selectedPersona === 'All' && s.isPopular)
  );

  return (
    <section id="schemes" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-xs font-bold text-[#D97706] uppercase tracking-wider mb-3">
            <span>{t('schemes_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('schemes_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t('schemes_desc')}
          </p>
        </div>

        {/* Profile Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#0B2545] shadow-gov-md ring-2 ring-[#0B2545]/20 scale-105'
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-gov-sm'
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl ${p.color} text-white flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{p.label}</h3>
                  <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{p.desc}</p>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-[#E05A10]">
                    Selected Profile ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Matched Schemes Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {matchedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => setSelectedSchemeModal(scheme)}
              className="cursor-pointer bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-gov-sm hover:shadow-gov-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {scheme.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {scheme.benefitAmount}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#0B2545] group-hover:text-blue-700 transition mb-2">
                  {language === 'hi' ? scheme.titleHi : scheme.title}
                </h3>

                <div className="text-xs text-slate-500 font-medium mb-3">
                  {scheme.ministry}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {scheme.description}
                </p>

                {/* Eligibility Highlights */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Eligibility Criteria:
                  </div>
                  {scheme.eligibility.slice(0, 2).map((el, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Official Portal: <strong>{scheme.applyPortal}</strong></span>
                <span className="font-bold text-[#E05A10] group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Explore Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Official Disclaimer (Prominently Styled) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-gov-sm flex items-start space-x-3.5 max-w-4xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-bold block mb-0.5">Official GovTech Transparency Disclaimer:</strong>
            {t('schemes_disclaimer')}
          </div>
        </div>

      </div>
    </section>
  );
};
