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
  const { setSelectedSectorFilter, updateKyaState, setCurrentView } = useSwagat();
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
    <section id="section-sectors" className="py-20 bg-transparent border-t border-white/10 relative overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Pan-India Sector Approvals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Explore Approvals by Business Sector
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Comprehensive statutory clearances, registrations, and regulatory licenses mapped across <strong>all 24 major Indian industrial sectors</strong>.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 rounded-2xl p-4 sm:p-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sectors, clearances (e.g. 'CTE', 'Solar', 'Factory', 'STPI')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:border-sky-400 text-sm text-white placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Sectors Count Badge */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-400 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-bold">
                Showing {filteredSectors.length} of {sectorsData.length} Sectors
              </span>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
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
                className="group cursor-pointer bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 relative flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top border gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top row: Icon & Approval Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:text-sky-300 border border-white/10 transition-all duration-300 shadow-inner group-hover:scale-110">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/25 group-hover:bg-sky-500/20 group-hover:border-sky-400/40 transition-all">
                      {sector.approvalCount} Approvals
                    </span>
                  </div>

                  {/* Sector Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {sector.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                    {sector.description}
                  </p>

                  {/* Key Clearances Pills */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Clearances:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sector.keyClearances.slice(0, 3).map((clr, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 font-medium group-hover:bg-white/10 transition-colors line-clamp-1"
                        >
                          {clr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-sky-300 transition-colors">
                  <span>Explore Approvals</span>
                  <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-sky-500/20 flex items-center justify-center group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state if search has no results */}
        {filteredSectors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-slate-700 font-bold text-base">No sectors match "{searchQuery}"</h4>
            <p className="text-slate-400 text-xs mt-1">Try searching for keywords like 'manufacturing', 'energy', 'health', or 'trade'.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-4 px-4 py-2 bg-[#07182C] text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
