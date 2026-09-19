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
  const { schemes, setSelectedScheme, showToast } = useSwagat();
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Award className="w-4 h-4" />
            <span>Subsidies, Grants &amp; Production Incentives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Government Schemes &amp; Subsidies
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Access Central PLI schemes, MSME capital subsidies, interest subvention, and state industrial package benefits.
          </p>
        </div>

        {/* Filter Bar with Watermelon Tabs 11/14 */}
        <div className="bg-slate-950/60 rounded-3xl p-5 shadow-2xl border border-white/10 backdrop-blur-2xl mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="Search schemes by keyword, ministry, PLI, grant or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
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
          <div className="pt-2 border-t border-white/5 overflow-x-auto">
            <GlassTabs
              tabs={filterTabs}
              activeTab={selectedType}
              onChange={(id) => setSelectedType(id)}
              layoutId="scheme-profile-tab"
              size="sm"
            />
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((sch) => (
            <div
              key={sch.id}
              className="bg-slate-950/70 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] p-6 sm:p-7 flex flex-col justify-between space-y-5 group text-white"
            >
              <div className="space-y-3.5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {sch.level} Incentive • {sch.sector}
                  </span>

                  {sch.deadline && (
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{sch.deadline}</span>
                    </span>
                  )}
                </div>

                {/* Scheme Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {sch.name}
                </h3>

                {/* Department */}
                <div className="text-xs text-slate-400 font-medium">
                  {sch.department}
                </div>

                {/* Financial Support Badge */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900/80 border border-emerald-500/20 text-white backdrop-blur-md">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Financial Support &amp; Outlay</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{sch.maxFinancialSupport}</div>
                </div>

                {/* Benefits Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sch.benefits}
                </p>

                {/* Eligibility bullet */}
                <div className="text-[11px] bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="font-bold text-slate-300 uppercase text-[10px]">Key Eligibility Benchmark:</div>
                  <div className="text-slate-400 line-clamp-2">
                    {sch.eligibility[0]}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Scheme, Apply */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  id={`btn-view-scheme-${sch.id}`}
                  onClick={() => setSelectedScheme(sch)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  View Scheme Details
                </button>

                <button
                  id={`btn-apply-scheme-${sch.id}`}
                  onClick={() => handleApplyScheme(sch)}
                  className="px-5 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-300 hover:to-indigo-300 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1 cursor-pointer"
                >
                  <span>Apply / Verify</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-950" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
