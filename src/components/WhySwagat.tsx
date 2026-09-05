import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const WhySwagat: React.FC = () => {
  const { t } = useLanguage();

  const comparisonRows = [
    {
      aspect: 'Citizen Starting Point',
      traditional: 'Forced to find a specific department or portal URL first',
      swagat: 'Goal-First: Tell SWAGAT what you want in simple words'
    },
    {
      aspect: 'Language & Terminology',
      traditional: 'Dense administrative jargon, acts, and complex forms',
      swagat: 'Conversational plain language with 6+ Indian languages'
    },
    {
      aspect: 'Cross-Department Maze',
      traditional: 'Citizen must discover and coordinate 5+ separate portals',
      swagat: 'Synthesized end-to-end roadmap across Central & State systems'
    },
    {
      aspect: 'Document Preparation',
      traditional: 'Rejection after submission due to missing formats/affidavits',
      swagat: 'Pre-application readiness, "Why needed?" & 1-click DigiLocker sync'
    },
    {
      aspect: 'Action Guidance',
      traditional: 'Overwhelming directory of 50+ unranked portal links',
      swagat: 'Focused "Next Best Action" with Right to Public Services SLA tracking'
    }
  ];

  const govPlatforms = [
    { name: 'NSWS', role: 'National Single Window System for business clearances' },
    { name: 'UMANG', role: 'Unified Mobile App for 1,200+ Central/State services' },
    { name: 'MyScheme', role: 'National welfare scheme discovery database' },
    { name: 'DigiLocker', role: 'Legally recognized paperless document repository' },
    { name: 'CPGRAMS', role: 'Centralized citizen grievance redressal platform' }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-3">
            <span>{t('why_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('why_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A fundamental paradigm shift — moving from confusing portal search to seamless journey guidance.
          </p>
        </div>

        {/* Side-by-side Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          
          {/* Traditional Flow Card */}
          <div className="bg-rose-50/40 rounded-3xl p-6 sm:p-7 border border-rose-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-4">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Traditional Citizen Experience</span>
              </div>

              <div className="space-y-3 font-medium text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Search on Google for vague keywords</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Navigate 4-5 different state &amp; central portals</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Struggle with legal definitions &amp; circulars</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>Unaware of prerequisite documents until rejection</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200 text-xs font-semibold text-rose-700">
              Result: High friction, delays, and abandoned applications.
            </div>
          </div>

          {/* SWAGAT Flow Card */}
          <div className="bg-gradient-to-b from-blue-50/70 to-emerald-50/50 rounded-3xl p-6 sm:p-7 border border-[#0B2545]/30 shadow-gov-md flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[#0B2545] font-bold text-xs uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SWAGAT Guided Journey</span>
              </div>

              <div className="space-y-3 font-medium text-xs sm:text-sm text-slate-900">
                <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center space-x-2 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Tell SWAGAT what you want to achieve</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center space-x-2 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>AI identifies all relevant services, schemes &amp; acts</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center space-x-2 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Personalized roadmap with DigiLocker document sync</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center space-x-2 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-[#E05A10] text-white flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>Clear Next Best Action directly into official portal</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200 text-xs font-bold text-emerald-800">
              Result: Clarity, confidence, and 100% official completion.
            </div>
          </div>

        </div>

        {/* Comparative Matrix Table */}
        <div className="max-w-5xl mx-auto bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200 mb-12">
          <h3 className="font-display font-bold text-lg text-[#0B2545] mb-4 text-center">
            Detailed Dimension Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3">Dimension</th>
                  <th className="pb-3 text-rose-700">Traditional Experience</th>
                  <th className="pb-3 text-[#0B2545]">SWAGAT Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/80 transition">
                    <td className="py-3.5 font-bold text-slate-800 pr-3">{row.aspect}</td>
                    <td className="py-3.5 text-slate-600 pr-3">{row.traditional}</td>
                    <td className="py-3.5 text-emerald-800 font-semibold flex items-center space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{row.swagat}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ecosystem Synergy Banner (Crucial Requirement!) */}
        <div className="max-w-5xl mx-auto bg-[#07182C] text-white rounded-3xl p-6 sm:p-8 shadow-gov-xl border border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Complementary GovTech Ecosystem
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1">
              {t('why_statement')}
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              SWAGAT connects citizens seamlessly into India’s foundational digital public infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {govPlatforms.map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="font-extrabold text-sm text-amber-300 mb-0.5">{p.name}</div>
                <div className="text-[10px] text-slate-300 leading-tight">{p.role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
