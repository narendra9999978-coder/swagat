import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const CallToActionBanner: React.FC = () => {
  const { kyaState, updateKyaState } = useSwagat();

  const handleLaunch = () => {
    const el = document.getElementById('section-kya');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#07182C] text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Accelerate Your Business Launch</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight max-w-3xl mx-auto">
          Ready to Discover All Your Required Indian Business Approvals?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of enterprises, startups, and manufacturers navigating compliance with transparent statutory timelines, zero paperwork, and unified tracking.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            id="cta-bottom-kya-btn"
            onClick={handleLaunch}
            className="inline-flex items-center px-8 py-4 text-sm font-extrabold text-[#07182C] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <Compass className="w-4 h-4 mr-2 text-[#07182C]" />
            <span>Launch Know Your Approvals (KYA)</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Free Public Platform</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Covers Central &amp; All 28 States</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SLA Backed Clearances</span>
          </div>
        </div>

      </div>
    </section>
  );
};
