import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Users2, 
  Zap,
  Globe2,
  Lock,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSwagat } from '../context/SwagatContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  return (
    <section id="section-about" className={`py-20 bg-transparent relative overflow-hidden border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
      
      {/* Subtle Background Halos */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Digital Infrastructure Concept</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            About SWAGAT
          </h2>
          <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Smart Window for Approvals, Governance &amp; Actionable Technology — Transforming how enterprises launch and scale across India.
          </p>
        </div>

        {/* 3 Pillars Grid: What, Why, How */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          <div className={`swagat-card p-8 rounded-3xl border space-y-4 transition-all ${
            isDark 
              ? 'bg-slate-950/70 border-white/10 hover:border-amber-400/40 text-white shadow-xl' 
              : 'bg-white/90 border-slate-200 text-[#102A43]'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-[#07182C] flex items-center justify-center font-bold shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-display font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>What is SWAGAT?</h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              SWAGAT is an intelligent single-window platform unifying compliance discovery, unified Common Application Forms (CAF), and statutory tracking across 40+ Central Ministries and 28 State Single Window Systems.
            </p>
          </div>

          <div className={`swagat-card p-8 rounded-3xl border space-y-4 transition-all ${
            isDark 
              ? 'bg-slate-950/70 border-white/10 hover:border-sky-400/40 text-white shadow-xl' 
              : 'bg-white/90 border-slate-200 text-[#102A43]'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-display font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Why SWAGAT Exists</h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Indian businesses historically navigated dozens of disjointed departmental websites, redundant paperwork, and opaque scrutiny stages. SWAGAT eliminates friction to accelerate Ease of Doing Business.
            </p>
          </div>

          <div className={`swagat-card p-8 rounded-3xl border space-y-4 transition-all ${
            isDark 
              ? 'bg-slate-950/70 border-white/10 hover:border-emerald-400/40 text-white shadow-xl' 
              : 'bg-white/90 border-slate-200 text-[#102A43]'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-bold shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-display font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Digital-First Journey</h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              By combining AI-driven compliance discovery with DigiLocker document repositories and real-time query resolution, SWAGAT cuts approval lead time from months to predictable statutory SLAs.
            </p>
          </div>

        </div>

        {/* Integration Architecture Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] p-8 sm:p-12 border border-sky-900/30 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Cooperative Federalism</span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Seamless Central &amp; State System Harmonization
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                SWAGAT connects directly into state engines like Maharashtra’s MAITRI, Gujarat’s IFP, Uttar Pradesh’s Nivesh Mitra, Karnataka’s eBiz, and Tamil Nadu’s Guidance SWP 2.0 alongside central ministries (DPIIT, MCA, MoEFCC, FSSAI, DGFT, PESO).
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-amber-300">1,400+</div>
                <div className="text-slate-200 text-[11px]">Integrated Approvals</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-emerald-300">36 States/UTs</div>
                <div className="text-slate-200 text-[11px]">Covered Pan-India</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-sky-300">100% Digital</div>
                <div className="text-slate-200 text-[11px]">Paperless Workflow</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="text-2xl font-black text-purple-300">24/7 SLA</div>
                <div className="text-slate-200 text-[11px]">Grievance Escalation</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
