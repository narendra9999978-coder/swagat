import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSwagat } from '../context/SwagatContext';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const WhySwagat: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

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
    <section className={`py-16 sm:py-24 bg-transparent border-b ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark
              ? 'bg-blue-500/10 border-blue-400/20 text-blue-300'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <span>{t('why_badge')}</span>
          </div>
          <h2 className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t('why_heading')}
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            A fundamental paradigm shift — moving from confusing portal search to seamless journey guidance.
          </p>
        </div>

        {/* Side-by-side Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          
          {/* Traditional Flow Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-6 sm:p-7 border flex flex-col justify-between ${
            isDark
              ? 'bg-rose-500/8 border-rose-400/20'
              : 'bg-rose-50/80 border-rose-200'
          }`}>
            <div>
              <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-4 ${
                isDark ? 'text-rose-400' : 'text-rose-600'
              }`}>
                <XCircle className={`w-4 h-4 ${isDark ? 'text-rose-500' : 'text-rose-500'}`} />
                <span>Traditional Citizen Experience</span>
              </div>

              <div className={`space-y-3 font-medium text-xs sm:text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {[
                  'Search on Google for vague keywords',
                  'Navigate 4-5 different state & central portals',
                  'Struggle with legal definitions & circulars',
                  'Unaware of prerequisite documents until rejection'
                ].map((text, i) => (
                  <div key={i} className={`p-3 backdrop-blur-md rounded-xl border flex items-center space-x-2 ${
                    isDark
                      ? 'bg-white/5 border-rose-400/15'
                      : 'bg-white/70 border-rose-200/60'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isDark
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-rose-100 text-rose-600'
                    }`}>{i + 1}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t text-xs font-semibold ${
              isDark ? 'border-rose-400/20 text-rose-400' : 'border-rose-200 text-rose-600'
            }`}>
              Result: High friction, delays, and abandoned applications.
            </div>
          </div>

          {/* SWAGAT Flow Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-6 sm:p-7 border flex flex-col justify-between ${
            isDark
              ? 'bg-gradient-to-b from-blue-500/10 to-emerald-500/8 border-emerald-400/25'
              : 'bg-gradient-to-b from-blue-50/80 to-emerald-50/80 border-emerald-200'
          }`}>
            <div>
              <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-4 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <span>SWAGAT Guided Journey</span>
              </div>

              <div className={`space-y-3 font-medium text-xs sm:text-sm ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                {[
                  { text: 'Tell SWAGAT what you want to achieve', numColor: isDark ? 'bg-sky-500/30 text-sky-300' : 'bg-sky-100 text-sky-700' },
                  { text: 'AI identifies all relevant services, schemes & acts', numColor: isDark ? 'bg-sky-500/30 text-sky-300' : 'bg-sky-100 text-sky-700' },
                  { text: 'Personalized roadmap with DigiLocker document sync', numColor: isDark ? 'bg-sky-500/30 text-sky-300' : 'bg-sky-100 text-sky-700' },
                  { text: 'Clear Next Best Action directly into official portal', numColor: isDark ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-100 text-amber-700' }
                ].map((item, i) => (
                  <div key={i} className={`p-3 backdrop-blur-md rounded-xl border flex items-center space-x-2 ${
                    isDark
                      ? 'bg-white/5 border-blue-400/20'
                      : 'bg-white/70 border-blue-200/60'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${item.numColor}`}>{i + 1}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t text-xs font-bold ${
              isDark ? 'border-emerald-400/20 text-emerald-400' : 'border-emerald-200 text-emerald-700'
            }`}>
              Result: Clarity, confidence, and 100% official completion.
            </div>
          </div>

        </div>

        {/* Comparative Matrix Table */}
        <div className={`max-w-5xl mx-auto backdrop-blur-xl rounded-3xl p-6 sm:p-8 border mb-12 ${
          isDark
            ? 'bg-white/4 border-white/10'
            : 'bg-white/90 border-slate-200 shadow-lg shadow-slate-200/50'
        }`}>
          <h3 className={`font-display font-bold text-lg mb-4 text-center ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Detailed Dimension Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className={`border-b font-bold uppercase text-[11px] ${
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="pb-3">Dimension</th>
                  <th className={`pb-3 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Traditional Experience</th>
                  <th className={`pb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>SWAGAT Experience</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/6' : 'divide-slate-100'}`}>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={`transition ${isDark ? 'hover:bg-white/4' : 'hover:bg-slate-50'}`}>
                    <td className={`py-3.5 font-bold pr-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{row.aspect}</td>
                    <td className={`py-3.5 pr-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{row.traditional}</td>
                    <td className={`py-3.5 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <span className="flex items-center space-x-1.5">
                        <span className={`font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>✓</span>
                        <span>{row.swagat}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ecosystem Synergy Banner */}
        <div className={`max-w-5xl mx-auto backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border ${
          isDark
            ? 'bg-white/5 border-white/12 text-white'
            : 'bg-gradient-to-r from-slate-50 to-white border-slate-200 text-slate-900 shadow-lg shadow-slate-200/50'
        }`}>
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`}>
              Complementary GovTech Ecosystem
            </span>
            <h3 className={`font-display font-extrabold text-xl sm:text-2xl mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t('why_statement')}
            </h3>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              SWAGAT connects citizens seamlessly into India's foundational digital public infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {govPlatforms.map((p, i) => (
              <div key={i} className={`p-3 rounded-xl border text-center transition ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/8'
                  : 'bg-white/80 border-slate-200 hover:bg-white shadow-sm'
              }`}>
                <div className={`font-extrabold text-sm mb-0.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{p.name}</div>
                <div className={`text-[10px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
