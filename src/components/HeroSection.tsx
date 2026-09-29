import React, { useState, useMemo } from 'react';
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
import { GlassSelect, GlassSelectOption } from './ui/GlassSelect';
import { HeritageLandmarksSketch } from './HeritageLandmarksSketch';

export const HeroSection: React.FC = () => {
  const { 
    updateKyaState, 
    setSelectedSectorFilter, 
    setSelectedStateFilter, 
    openStateDetailModal,
    theme
  } = useSwagat();
  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

  const stateOptions: GlassSelectOption[] = useMemo(() => {
    return [
      { value: 'All', label: 'All India / Central Approvals', badge: '1,400+' },
      ...allIndianStatesList
        .filter((s) => s.type === 'State')
        .map((s) => ({
          value: s.name,
          label: s.name,
          badge: `${s.approvalCount} Approvals`,
          group: 'States (28)',
        })),
      ...allIndianStatesList
        .filter((s) => s.type === 'UT')
        .map((u) => ({
          value: u.name,
          label: u.name,
          badge: `${u.approvalCount} Approvals`,
          group: 'Union Territories (8)',
        })),
    ];
  }, []);

  const sectorOptions: GlassSelectOption[] = useMemo(() => {
    return sectorsData.map((sec) => ({
      value: sec.name,
      label: sec.name,
      badge: `${sec.approvalCount} Approvals`,
      group: 'Industrial Sectors (24)',
    }));
  }, []);

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
    <section className={`relative overflow-hidden pt-24 sm:pt-28 pb-20 lg:pt-36 lg:pb-28 transition-colors duration-500 ${
      theme === 'light' ? 'text-slate-900' : 'text-white'
    }`}>
      {/* Background Subtle Ambience if dark */}
      {theme === 'dark' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Innovation Pill */}
        <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold mb-6 shadow-xs border ${
          theme === 'light' ? 'bg-white/90 border-slate-200/90 text-slate-700' : 'bg-white/10 border-white/15 text-slate-200'
        }`}>
          <span className="text-amber-500 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px]">Next-Gen GovTech</span>
          <span className="text-slate-400">|</span>
          <span>Unified Pan-India Single Window Platform</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.1]">
              <span className={theme === 'light' ? 'text-[#102A43]' : 'text-white'}>
                India’s Single Window for{' '}
              </span>
              <span className="inline-block">
                <span className={theme === 'light' ? 'text-[#E05A10]' : 'text-amber-400'}>Business </span>
                <span className={theme === 'light' ? 'text-[#138808]' : 'text-emerald-400'}>Approvals</span>
              </span>
            </h1>

            <p className={`text-base sm:text-lg font-normal leading-relaxed max-w-2xl ${
              theme === 'light' ? 'text-[#52657A]' : 'text-slate-200'
            }`}>
              Discover, apply for and track the approvals your business needs — across India, from one intelligent platform.
            </p>

            {/* Quick State + Sector Selection Card */}
            <div className={`p-4 sm:p-5 rounded-2xl shadow-xl space-y-3 max-w-2xl relative z-30 border backdrop-blur-2xl ${
              theme === 'light'
                ? 'bg-white border-[#D8E2EE] shadow-[0_12px_36px_rgba(0,0,0,0.06)] text-[#102A43]'
                : 'bg-black/90 border-white/20 shadow-2xl ring-1 ring-white/15 text-white'
            }`}>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Approvals Finder (State + Sector)</span>
              </div>

              <form onSubmit={handleFindApprovals} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Dropdown 1: State / UT */}
                <div className="sm:col-span-5 relative">
                  <GlassSelect
                    id="hero-state-selector"
                    value={selectedState}
                    onChange={setSelectedState}
                    options={stateOptions}
                    placeholder="Select a State / Union Territory"
                    searchable={true}
                  />
                </div>

                {/* Dropdown 2: Sector */}
                <div className="sm:col-span-4 relative">
                  <GlassSelect
                    id="hero-sector-selector"
                    value={selectedSector}
                    onChange={setSelectedSector}
                    options={sectorOptions}
                    placeholder="Select Sector"
                    searchable={true}
                  />
                </div>

                {/* CTA Submit Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    id="hero-find-approvals-btn"
                    className="btn-tricolour w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-1.5 cursor-pointer"
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
                className="btn-tricolour inline-flex items-center justify-center px-5 py-3 text-xs font-extrabold text-[#07182C] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg transition-all group cursor-pointer"
              >
                <Compass className="w-4 h-4 mr-2 text-[#07182C]" />
                <span>{t('hero_cta_kya')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA: Central Approvals */}
              <button
                id="hero-secondary-approvals-btn"
                onClick={() => scrollTo('section-approvals')}
                className={`inline-flex items-center justify-center px-4 py-3 text-xs font-bold rounded-xl backdrop-blur-sm transition-all cursor-pointer hover:shadow-[0_4px_18px_-4px_rgba(14,165,233,0.35),0_2px_12px_-4px_rgba(19,136,8,0.25)] hover:-translate-y-0.5 ${
                  theme === 'light'
                    ? 'text-slate-800 bg-white/90 hover:bg-white border border-slate-300/80 shadow-md hover:border-sky-300'
                    : 'text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-sky-400/40'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 mr-2 ${theme === 'light' ? 'text-sky-600' : 'text-sky-400'}`} />
                <span>Central Approvals</span>
              </button>

              {/* Tertiary CTA: State / UT Clearances */}
              <button
                id="hero-tertiary-states-btn"
                onClick={() => scrollTo('section-explore-india')}
                className={`inline-flex items-center justify-center px-4 py-3 text-xs font-bold rounded-xl backdrop-blur-sm transition-all cursor-pointer hover:shadow-[0_4px_18px_-4px_rgba(19,136,8,0.3)] hover:-translate-y-0.5 ${
                  theme === 'light'
                    ? 'text-emerald-900 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300 shadow-sm'
                    : 'text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30'
                }`}
              >
                <MapPin className={`w-4 h-4 mr-2 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span>State &amp; UT Clearances</span>
              </button>
            </div>

            {/* Quick Sector Launch Pills */}
            <div className={`pt-2 border-t ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
              <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
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
                    className="industry-chit px-2.5 py-1 rounded-lg text-[11px] font-medium"
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
            <div className={`swagat-card relative rounded-2xl backdrop-blur-xl p-6 shadow-xl space-y-4 transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white border border-[#D8E2EE] shadow-[0_12px_36px_rgba(0,0,0,0.06)]'
                : 'bg-gradient-to-b from-white/15 to-white/5 border border-white/20'
            }`}>
              
              <div className={`flex items-center justify-between border-b pb-4 ${theme === 'light' ? 'border-[#D8E2EE]' : 'border-white/10'}`}>
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    theme === 'light' ? 'bg-amber-100 text-amber-900' : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${theme === 'light' ? 'text-[#102A43]' : 'text-white'}`}>
                      SWAGAT Gateway
                    </div>
                    <div className={`text-[11px] ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-300'}`}>
                      Live Clearance Infrastructure
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  theme === 'light'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  99.9% Uptime
                </span>
              </div>

              {/* 4 Floating UI Badges */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. Central Approvals Badge */}
                <div 
                  onClick={() => scrollTo('section-approvals')}
                  className={`swagat-card cursor-pointer p-3.5 rounded-xl border transition-all group ${
                    theme === 'light'
                      ? 'bg-[#F8FAFC] hover:bg-white border-[#D8E2EE] shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'}`}>
                      National Level
                    </span>
                    <ShieldCheck className={`w-4 h-4 group-hover:scale-110 transition-transform ${theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'}`} />
                  </div>
                  <div className={`mt-1 text-sm font-bold ${theme === 'light' ? 'text-[#102A43]' : 'text-white'}`}>
                    Central Approvals
                  </div>
                  <div className={`text-[11px] ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'}`}>
                    40+ Ministries Integrated
                  </div>
                </div>

                {/* 2. State Approvals Badge */}
                <div 
                  onClick={() => scrollTo('section-explore-india')}
                  className={`swagat-card cursor-pointer p-3.5 rounded-xl border transition-all group ${
                    theme === 'light'
                      ? 'bg-[#F8FAFC] hover:bg-white border-[#D8E2EE] shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      State Portals
                    </span>
                    <MapPin className={`w-4 h-4 group-hover:scale-110 transition-transform ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  </div>
                  <div className={`mt-1 text-sm font-bold ${theme === 'light' ? 'text-[#102A43]' : 'text-white'}`}>
                    State / UT Clearances
                  </div>
                  <div className={`text-[11px] ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'}`}>
                    28 States &amp; 8 UTs
                  </div>
                </div>

                {/* 3. Application Tracking Badge */}
                <div 
                  onClick={() => scrollTo('section-tracking')}
                  className={`swagat-card cursor-pointer p-3.5 rounded-xl border transition-all group ${
                    theme === 'light'
                      ? 'bg-[#F8FAFC] hover:bg-white border-[#D8E2EE] shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>
                      Real-Time
                    </span>
                    <Activity className={`w-4 h-4 group-hover:scale-110 transition-transform ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  </div>
                  <div className={`mt-1 text-sm font-bold ${theme === 'light' ? 'text-[#102A43]' : 'text-white'}`}>
                    Unified Tracking
                  </div>
                  <div className={`text-[11px] ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'}`}>
                    Single Tracking Number
                  </div>
                </div>

                {/* 4. Government Schemes Badge */}
                <div 
                  onClick={() => scrollTo('section-schemes')}
                  className={`swagat-card cursor-pointer p-3.5 rounded-xl border transition-all group ${
                    theme === 'light'
                      ? 'bg-[#F8FAFC] hover:bg-white border-[#D8E2EE] shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                      Subsidies
                    </span>
                    <Award className={`w-4 h-4 group-hover:scale-110 transition-transform ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                  </div>
                  <div className={`mt-1 text-sm font-bold ${theme === 'light' ? 'text-[#102A43]' : 'text-white'}`}>
                    Schemes &amp; Grants
                  </div>
                  <div className={`text-[11px] ${theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'}`}>
                    PLI, MSME &amp; State Policy
                  </div>
                </div>
              </div>

              {/* Live Status Ticker Banner */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                theme === 'light'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-emerald-950/40 border-emerald-500/20'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span className={`text-[11px] ${theme === 'light' ? 'text-emerald-900' : 'text-slate-200'}`}>
                    Average clearance turnaround reduced to <strong>18 business days</strong>
                  </span>
                </div>
                <span className={`font-bold text-[10px] shrink-0 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  SLA Enforced
                </span>
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
