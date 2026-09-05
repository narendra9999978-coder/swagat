import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Coins, 
  Building2, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Leaf,
  Cpu,
  Car,
  Utensils,
  Shirt,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { Scheme } from '../types/swagat';

export const SchemesSection: React.FC = () => {
  const { schemes, setSelectedScheme, showToast } = useSwagat();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const filterTypes = [
    'All',
    'Startup',
    'MSME',
    'Manufacturing',
    'Investment',
    'Renewable Energy',
    'Export',
    'Technology'
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
    <section id="section-schemes" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-300 text-purple-950 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-purple-700" />
            <span>Subsidies, Grants &amp; Production Incentives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            Government Schemes &amp; Subsidies
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Access Central PLI schemes, MSME capital subsidies, interest subvention, and state industrial package benefits.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                placeholder="Search schemes by keyword, ministry, PLI, grant or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#07182C]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#07182C]"
              >
                {filterTypes.map((type) => (
                  <option key={type} value={type}>Category: {type}</option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#07182C]"
              >
                <option value="All">All Sectors</option>
                <option value="Automobile">Automobile &amp; EV</option>
                <option value="Electronics">Electronics &amp; Semiconductor</option>
                <option value="Textile">Textiles &amp; Garments</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="IT & BPM">IT &amp; Startups</option>
              </select>
            </div>

          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 mr-2">Filter by Profile:</span>
            {filterTypes.slice(1).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(selectedType === t ? 'All' : t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === t
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3.5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                    {sch.level} Incentive • {sch.sector}
                  </span>

                  {sch.deadline && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{sch.deadline}</span>
                    </span>
                  )}
                </div>

                {/* Scheme Title */}
                <h3 className="text-lg font-bold text-[#07182C] group-hover:text-purple-950 transition-colors leading-snug">
                  {sch.name}
                </h3>

                {/* Department */}
                <div className="text-xs text-slate-500 font-medium">
                  {sch.department}
                </div>

                {/* Financial Support Badge */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Financial Support &amp; Outlay</div>
                  <div className="text-sm font-extrabold text-emerald-900 mt-0.5">{sch.maxFinancialSupport}</div>
                </div>

                {/* Benefits Summary */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sch.benefits}
                </p>

                {/* Eligibility bullet */}
                <div className="text-[11px] bg-slate-50 p-3 rounded-xl space-y-1">
                  <div className="font-bold text-slate-700 uppercase text-[10px]">Eligibility Criteria:</div>
                  <div className="text-slate-600 line-clamp-2">
                    {sch.eligibility[0]}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Scheme, Apply */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-view-scheme-${sch.id}`}
                  onClick={() => setSelectedScheme(sch)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  View Scheme Details
                </button>

                <button
                  id={`btn-apply-scheme-${sch.id}`}
                  onClick={() => handleApplyScheme(sch)}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#07182C] to-[#0B2545] hover:to-[#07182C] rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-1"
                >
                  <span>Apply / Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
