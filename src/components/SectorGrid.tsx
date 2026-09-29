import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Filter, 
  CheckCircle2, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { sectorsData, SectorItem } from '../data/sectorsData';
import { useSwagat } from '../context/SwagatContext';

export const SectorGrid: React.FC = () => {
  const { setSelectedSectorFilter, updateKyaState, setCurrentView, theme } = useSwagat();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Industry' | 'Tech' | 'Energy' | 'Services' | 'AgroHealth'>('All');

  const categories = [
    { id: 'All', label: 'All Sectors (24)' },
    { id: 'Industry', label: 'Manufacturing & Heavy' },
    { id: 'Tech', label: 'IT, Electronics & Telecom' },
    { id: 'Energy', label: 'Clean Energy & Power' },
    { id: 'AgroHealth', label: 'Pharma, Healthcare & Agro' },
    { id: 'Services', label: 'Services, Retail & Logistics' }
  ];

  const categoryMap: Record<string, string[]> = {
    Industry: [
      'manufacturing', 
      'automobile', 
      'textiles', 
      'construction', 
      'aerospace-defence', 
      'chemicals', 
      'mining', 
      'ports-maritime'
    ],
    Tech: [
      'it-technology', 
      'electronics-esdm', 
      'telecommunications', 
      'financial-services'
    ],
    Energy: [
      'renewable-energy', 
      'power-energy', 
      'oil-gas', 
      'environmental-services'
    ],
    AgroHealth: [
      'pharmaceuticals', 
      'healthcare', 
      'food-processing', 
      'agriculture'
    ],
    Services: [
      'tourism-hospitality', 
      'logistics-warehousing', 
      'retail-ecommerce', 
      'education'
    ]
  };

  const filteredSectors = useMemo(() => {
    return sectorsData.filter((sector) => {
      // Category filter
      if (activeCategory !== 'All') {
        const allowedIds = categoryMap[activeCategory] || [];
        if (!allowedIds.includes(sector.id)) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sector.name.toLowerCase().includes(query);
        const matchesDesc = sector.description.toLowerCase().includes(query);
        const matchesClearances = sector.keyClearances.some(c => c.toLowerCase().includes(query));
        const matchesStates = sector.popularStates.some(s => s.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesClearances || matchesStates;
      }

      return true;
    });
  }, [searchQuery, activeCategory]);

  const handleSelectSector = (sector: SectorItem) => {
    setSelectedSectorFilter(sector.name);
    updateKyaState({ sector: sector.name });
    
    // Smooth scroll to Approvals section or KYA
    const el = document.getElementById('section-approvals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="section-sectors" className={`py-20 relative overflow-hidden border-t transition-colors duration-500 ${
      isDark ? 'border-white/10' : 'border-slate-200'
    }`}>
      
      {/* Background Decorative Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]' : 'bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)]'} [background-size:24px_24px]`} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md border ${
            isDark ? 'bg-sky-500/10 border-sky-400/20 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-800'
          }`}>
            <Layers className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            <span>Pan-India Sector Approvals</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#102A43]'
          }`}>
            Explore Approvals by Business Sector
          </h2>
          <p className={`mt-3 text-base ${isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'}`}>
            Comprehensive statutory clearances, registrations, and regulatory licenses mapped across <strong>all 24 major Indian industrial sectors</strong>.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className={`mb-10 rounded-2xl p-4 sm:p-5 border shadow-xl ${
          isDark ? 'bg-[#07182C] border-white/15' : 'bg-white border-[#D8E2EE] shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sectors, clearances (e.g. 'CTE', 'Solar', 'Factory', 'STPI')..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none text-sm transition ${
                  isDark
                    ? 'border-white/15 bg-slate-900 focus:border-sky-400 text-white placeholder-slate-400'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#102A43] placeholder-[#64748B] focus:border-[#0284C7] focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Sectors Count Badge */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold shrink-0">
              <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                isDark ? 'bg-white/10 border-white/10 text-slate-200' : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#334E68]'
              }`}>
                Showing {filteredSectors.length} of {sectorsData.length} Sectors
              </span>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-[#D8E2EE]'}`}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  activeCategory === cat.id
                    ? isDark
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 border-sky-400 font-bold'
                      : 'bg-[#EEF7FA] text-[#102A43] border-[#0284C7] font-bold shadow-xs'
                    : isDark
                      ? 'bg-white/5 text-[#AFC4D8] hover:bg-white/10 hover:text-white border-white/10'
                      : 'bg-[#F8FAFC] text-[#52657A] hover:bg-[#F1F5F9] hover:text-[#102A43] border-[#CBD5E1]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 24 Sector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <div
                key={sector.id}
                onClick={() => handleSelectSector(sector)}
                className={`swagat-card group cursor-pointer rounded-2xl p-5 border shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
                  isDark
                    ? 'bg-[#07182C] border-white/15 hover:border-sky-400/50 text-white'
                    : 'bg-white border-[#D8E2EE] hover:border-[#FF9933]/70 text-[#102A43] shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                }`}
              >
                <div>
                  {/* Top row: Icon & Approval Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-inner group-hover:scale-105 ${
                      isDark
                        ? 'bg-white/5 group-hover:bg-sky-500/20 text-sky-400 group-hover:text-sky-300 border-white/10'
                        : 'bg-sky-50 group-hover:bg-sky-100 text-[#0284C7] group-hover:text-[#0369A1] border-sky-200'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isDark
                        ? 'bg-sky-500/10 text-sky-300 border-sky-500/25 group-hover:bg-sky-500/20 group-hover:border-sky-400/40'
                        : 'bg-[#E8EEF5] text-[#334E68] border-[#CBD5E1] group-hover:bg-sky-50 group-hover:text-[#0284C7]'
                    }`}>
                      {sector.approvalCount} Approvals
                    </span>
                  </div>

                  {/* Sector Title */}
                  <h3 className={`text-base font-bold transition-colors line-clamp-1 ${
                    isDark ? 'text-white group-hover:text-sky-300' : 'text-[#102A43] group-hover:text-[#0284C7]'
                  }`}>
                    {sector.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                    isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'
                  }`}>
                    {sector.description}
                  </p>

                  {/* Key Clearances Pills */}
                  <div className="mt-4 space-y-1.5">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                    }`}>
                      Key Clearances:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sector.keyClearances.slice(0, 3).map((clr, idx) => (
                        <span
                          key={idx}
                          className="industry-chit-badge text-[10px] px-2 py-0.5 rounded-md font-medium line-clamp-1"
                        >
                          {clr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${
                  isDark
                    ? 'border-white/10 text-[#D9E7F5] group-hover:text-sky-300'
                    : 'border-[#D8E2EE] text-[#52657A] group-hover:text-[#0284C7]'
                }`}>
                  <span>Explore Approvals</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-all ${
                    isDark
                      ? 'bg-white/5 group-hover:bg-sky-500/20'
                      : 'bg-slate-100 group-hover:bg-sky-100'
                  }`}>
                    <ChevronRight className={`w-3.5 h-3.5 ${
                      isDark ? 'text-[#AFC4D8] group-hover:text-sky-300' : 'text-[#64748B] group-hover:text-[#0284C7]'
                    }`} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
