import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Award, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Activity,
  FileText,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { allIndianStatesList } from '../data/indiaStatesData';
import { sectorsData } from '../data/sectorsData';
import { InteractiveIndiaMap } from './InteractiveIndiaMap';
import { IndiaBackgroundMap } from './IndiaBackgroundMap';

export const HeroSection: React.FC = () => {
  const { 
    updateKyaState, 
    setSelectedSectorFilter, 
    setSelectedStateFilter, 
    openStateDetailModal 
  } = useSwagat();
  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

  const handleFindApprovals = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedState) {
      updateKyaState({ state: selectedState });
      setSelectedStateFilter(selectedState);
    }
    if (selectedSector) {
      updateKyaState({ sector: selectedSector });
      setSelectedSectorFilter(selectedSector);
    }

    // Scroll directly to KYA wizard
    const el = document.getElementById('section-kya');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickSectorSelect = (sector: string) => {
    setSelectedSector(sector);
    updateKyaState({ sector });
    setSelectedSectorFilter(sector);
    const el = document.getElementById('section-kya');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07182C] via-[#0B2545] to-[#0D2F57] text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
      
      {/* Background Subtle Digital Map of India & Circuit Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        
        {/* Digital Grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>

        {/* Clean, Accurate Geographical Outline Map of India */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-3/5 h-[95%] opacity-40 lg:opacity-55 flex items-center justify-center pointer-events-none transition-opacity duration-700">
          <IndiaBackgroundMap outlineColor="tricolor" strokeWidth={1.4} className="w-full h-full object-contain" />
        </div>

        {/* Tricolour Accent Glows */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-slate-200 mb-6 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">Next-Gen GovTech</span>
          <span className="text-slate-400">|</span>
          <span>Unified Pan-India Single Window Platform</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
              India’s Single Window for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-emerald-300">
                Business Approvals
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              Discover, apply for and track the approvals your business needs — across India, from one intelligent platform.
            </p>

            {/* Quick State + Sector Selection Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3 max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Approvals Finder (State + Sector)</span>
              </div>

              <form onSubmit={handleFindApprovals} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Dropdown 1: State / UT */}
                <div className="sm:col-span-5 relative">
                  <select
                    id="hero-state-selector"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 text-white border border-white/20 text-xs font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="">Select a State / Union Territory</option>
                    <option value="All">All India / Central Approvals</option>
                    <optgroup label="States (28)">
                      {allIndianStatesList.filter(s => s.type === 'State').map(s => (
                        <option key={s.code} value={s.name}>
                          {s.name} ({s.approvalCount} Approvals)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Union Territories (8)">
                      {allIndianStatesList.filter(s => s.type === 'UT').map(u => (
                        <option key={u.code} value={u.name}>
                          {u.name} ({u.approvalCount} Approvals)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Dropdown 2: Sector */}
                <div className="sm:col-span-4 relative">
                  <select
                    id="hero-sector-selector"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 text-white border border-white/20 text-xs font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="">Select Sector</option>
                    {sectorsData.map(sec => (
                      <option key={sec.id} value={sec.name}>
                        {sec.name} ({sec.approvalCount})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* CTA Submit Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    id="hero-find-approvals-btn"
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-[#07182C] font-extrabold text-xs rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-1"
                  >
                    <span>Find My Approvals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            </div>

            {/* 3 Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              
              {/* Primary CTA: Know Your Approvals */}
              <button
                id="hero-primary-kya-btn"
                onClick={() => scrollTo('section-kya')}
                className="inline-flex items-center justify-center px-5 py-3 text-xs font-extrabold text-[#07182C] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg transition-all group"
              >
                <Compass className="w-4 h-4 mr-2 text-[#07182C]" />
                <span>{t('hero_cta_kya')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA: Central Approvals */}
              <button
                id="hero-secondary-approvals-btn"
                onClick={() => scrollTo('section-approvals')}
                className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl backdrop-blur-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-sky-400" />
                <span>Central Approvals</span>
              </button>

              {/* Tertiary CTA: State / UT Clearances */}
              <button
                id="hero-tertiary-states-btn"
                onClick={() => scrollTo('section-explore-india')}
                className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 rounded-xl backdrop-blur-sm transition-all"
              >
                <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                <span>State &amp; UT Clearances</span>
              </button>
            </div>

            {/* Quick Sector Launch Pills */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Popular Sectors for Immediate Registration:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Manufacturing',
                  'IT & Technology',
                  'Food Processing & Agro Industries',
                  'Pharmaceuticals & Biotechnology',
                  'Electronics System Design & Manufacturing (ESDM)',
                  'Renewable Energy (Solar/Wind/Green Hydrogen)',
                  'Automobile & Auto Components'
                ].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleQuickSectorSelect(sec)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                  >
                    + {sec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards: Floating UI Elements */}
          <div className="lg:col-span-5 relative">
            
            {/* Interactive Single-Window Preview Hub */}
            <div className="relative rounded-2xl bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">SWAGAT Gateway</div>
                    <div className="text-[11px] text-slate-300">Live Clearance Infrastructure</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  99.9% Uptime
                </span>
              </div>

              {/* 4 Floating UI Badges */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. Central Approvals Badge */}
                <div 
                  onClick={() => scrollTo('section-approvals')}
                  className="cursor-pointer p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-sky-400 uppercase">National Level</span>
                    <ShieldCheck className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">Central Approvals</div>
                  <div className="text-[11px] text-slate-400">40+ Ministries Integrated</div>
                </div>

                {/* 2. State Approvals Badge */}
                <div 
                  onClick={() => scrollTo('section-explore-india')}
                  className="cursor-pointer p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase">State Portals</span>
                    <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">State / UT Clearances</div>
                  <div className="text-[11px] text-slate-400">28 States &amp; 8 UTs</div>
                </div>

                {/* 3. Application Tracking Badge */}
                <div 
                  onClick={() => scrollTo('section-tracking')}
                  className="cursor-pointer p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase">Real-Time</span>
                    <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">Unified Tracking</div>
                  <div className="text-[11px] text-slate-400">Single Tracking Number</div>
                </div>

                {/* 4. Government Schemes Badge */}
                <div 
                  onClick={() => scrollTo('section-schemes')}
                  className="cursor-pointer p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-purple-400 uppercase">Subsidies</span>
                    <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">Schemes &amp; Grants</div>
                  <div className="text-[11px] text-slate-400">PLI, MSME &amp; State Policy</div>
                </div>
              </div>

              {/* Live Status Ticker Banner */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 text-[11px]">Average clearance turnaround reduced to <strong>18 business days</strong></span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px] shrink-0">SLA Enforced</span>
              </div>
            </div>

            {/* Floating Top Mini Card */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-white text-[#07182C] shadow-xl border border-slate-200 text-xs font-bold animate-bounce [animation-duration:4s]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>DigiLocker Integration</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
