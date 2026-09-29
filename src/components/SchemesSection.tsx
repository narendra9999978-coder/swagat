import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Calendar, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { Scheme } from '../types/swagat';
import { GlassTabs, TabItem } from './ui/GlassTabs';
import { GlassSelect, GlassSelectOption } from './ui/GlassSelect';

/**
 * SchemesSection
 * Curated with Watermelon Tabs 11/14 & Dark Glassmorphism Scheme Cards
 */
export const SchemesSection: React.FC = () => {
  const { schemes, setSelectedScheme, showToast, theme } = useSwagat();
  const isDark = theme === 'dark';
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectorOptions: GlassSelectOption[] = useMemo(() => [
    { value: 'All', label: 'All Sectors' },
    { value: 'Automobile', label: 'Automobile & EV' },
    { value: 'Electronics', label: 'Electronics & Semiconductor' },
    { value: 'Textile', label: 'Textiles & Garments' },
    { value: 'Food Processing', label: 'Food Processing' },
    { value: 'Renewable Energy', label: 'Renewable Energy' },
    { value: 'IT & BPM', label: 'IT & Startups' }
  ], []);

  const filterTabs: TabItem[] = [
    { id: 'All', label: 'All Schemes' },
    { id: 'Startup', label: 'Startup' },
    { id: 'MSME', label: 'MSME' },
    { id: 'Manufacturing', label: 'Manufacturing' },
    { id: 'Investment', label: 'Investment' },
    { id: 'Renewable Energy', label: 'Clean Energy' },
    { id: 'Export', label: 'Export' },
    { id: 'Technology', label: 'Technology' }
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter((sch) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        sch.name.toLowerCase().includes(q) ||
        sch.department.toLowerCase().includes(q) ||
        sch.benefits.toLowerCase().includes(q) ||
        sch.tags.some(t => t.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (selectedType !== 'All') {
        if (!sch.businessType.includes(selectedType as any)) return false;
      }

      if (selectedSector !== 'All') {
        if (sch.sector !== selectedSector && sch.sector !== 'Cross-Sectoral') return false;
      }

      return true;
    });
  }, [schemes, searchQuery, selectedType, selectedSector]);

  const handleApplyScheme = (sch: Scheme) => {
    showToast(`Eligibility verified for "${sch.name}". Proceeding to application documentation.`);
    setSelectedScheme(sch);
  };

  return (
    <section id="section-schemes" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/20 text-[#E05A10] dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Award className="w-4 h-4 text-[#E05A10] dark:text-orange-400" />
            <span>Subsidies, Grants &amp; Production Incentives</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Government Schemes &amp; Subsidies
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Access Central PLI schemes, MSME capital subsidies, interest subvention, and state industrial package benefits.
          </p>
        </div>

        {/* Filter Bar with Watermelon Tabs 11/14 */}
        <div className={`rounded-3xl p-5 shadow-2xl border backdrop-blur-2xl mb-10 space-y-4 transition-colors ${
          isDark 
            ? 'bg-slate-950/60 border-white/10' 
            : 'bg-white/90 border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="Search schemes by keyword, ministry, PLI, grant or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 transition ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sector Filter */}
            <div className="md:col-span-4">
              <GlassSelect
                id="schemes-sector-selector"
                value={selectedSector}
                onChange={(sec) => setSelectedSector(sec || 'All')}
                options={sectorOptions}
                placeholder="All Sectors"
                searchable={false}
              />
            </div>

          </div>

          {/* Watermelon Animated Sliding Tabs */}
          <div className={`pt-2 border-t overflow-x-auto ${
            isDark ? 'border-white/5' : 'border-slate-100'
          }`}>
            <GlassTabs
              tabs={filterTabs}
              activeTab={selectedType}
              onChange={(id) => setSelectedType(id)}
              layoutId="scheme-profile-tab"
              size="sm"
              theme={theme}
            />
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((sch) => (
            <div
              key={sch.id}
              className={`swagat-card rounded-3xl border transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between space-y-5 group ${
                isDark 
                  ? 'bg-slate-950/70 border-white/10 hover:border-white/20 text-white' 
                  : 'bg-white/90 border-slate-200 text-[#102A43]'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                    isDark
                      ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {sch.level} Incentive • {sch.sector}
                  </span>

                  {sch.deadline && (
                    <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{sch.deadline}</span>
                    </span>
                  )}
                </div>

                {/* Scheme Title */}
                <h3 className={`text-lg font-bold transition-colors leading-snug ${
                  isDark ? 'text-white group-hover:text-orange-300' : 'text-slate-900 group-hover:text-orange-600'
                }`}>
                  {sch.name}
                </h3>

                {/* Department */}
                <div className={`text-xs font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {sch.department}
                </div>

                {/* Financial Support Badge */}
                <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900/80 border-emerald-500/20 text-white' 
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
                }`}>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>Financial Support &amp; Outlay</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${
                    isDark ? 'text-white' : 'text-emerald-900'
                  }`}>{sch.maxFinancialSupport}</div>
                </div>

                {/* Benefits Summary */}
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {sch.benefits}
                </p>

                {/* Eligibility bullet */}
                <div className={`text-[11px] p-3 rounded-xl border space-y-1 ${
                  isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className={`font-bold uppercase text-[10px] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>Key Eligibility Benchmark:</div>
                  <div className={`line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {sch.eligibility[0]}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Scheme, Apply */}
              <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <button
                  id={`btn-view-scheme-${sch.id}`}
                  onClick={() => setSelectedScheme(sch)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  View Scheme Details
                </button>

                <button
                  id={`btn-apply-scheme-${sch.id}`}
                  onClick={() => handleApplyScheme(sch)}
                  className="px-5 py-2 text-xs font-extrabold !text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1 cursor-pointer"
                >
                  <span className="!text-white font-extrabold">Apply / Verify</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 !text-white shrink-0" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
