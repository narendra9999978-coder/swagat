import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { Approval, ApprovalCategory, BusinessStage } from '../types/swagat';
import { allIndianStatesList } from '../data/indiaStatesData';

export const ApprovalsDirectory: React.FC = () => {
  const { 
    approvals, 
    setSelectedApproval, 
    startApplication, 
    showToast,
    selectedSectorFilter,
    setSelectedSectorFilter,
    selectedStateFilter,
    setSelectedStateFilter
  } = useSwagat();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>(selectedSectorFilter !== 'All' ? selectedSectorFilter : 'All');
  const [selectedState, setSelectedState] = useState<string>(selectedStateFilter !== 'All' ? selectedStateFilter : 'All');
  const [sortBy, setSortBy] = useState<'relevant' | 'az' | 'timeline'>('relevant');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync with global context filters when changed from other sections
  React.useEffect(() => {
    if (selectedSectorFilter && selectedSectorFilter !== 'All') {
      setSelectedSector(selectedSectorFilter);
    }
  }, [selectedSectorFilter]);

  React.useEffect(() => {
    if (selectedStateFilter && selectedStateFilter !== 'All') {
      setSelectedState(selectedStateFilter);
    }
  }, [selectedStateFilter]);

  const categories: ApprovalCategory[] = [
    'Business Registration',
    'Factory & Labour',
    'Pollution & Environment',
    'Fire Safety',
    'Land & Infrastructure',
    'Electricity & Utilities',
    'Trade & Export',
    'Health & Food Safety',
    'Mining & Explosives',
    'Telecom & IT'
  ];

  const sectors = [
    'All Sectors',
    'Manufacturing',
    'IT & BPM',
    'Pharmaceuticals',
    'Food Processing',
    'Automobile',
    'Electronics',
    'Textile',
    'Chemicals'
  ];

  const filteredApprovals = useMemo(() => {
    return approvals.filter((app) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(q) ||
        app.department.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.some(tag => tag.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Level
      if (selectedLevel !== 'All' && app.centralOrState !== selectedLevel) {
        return false;
      }

      // State
      if (selectedState !== 'All') {
        if (app.centralOrState === 'State') {
          const matchDirect = app.stateName && app.stateName.toLowerCase() === selectedState.toLowerCase();
          const matchApplicable = app.statesApplicable && app.statesApplicable.some(s => s.toLowerCase() === selectedState.toLowerCase());
          if (!matchDirect && !matchApplicable) {
            return false;
          }
        }
      }

      // Category
      if (selectedCategory !== 'All' && app.category !== selectedCategory) {
        return false;
      }

      // Stage
      if (selectedStage !== 'All' && app.stage !== selectedStage) {
        return false;
      }

      // Sector
      if (selectedSector !== 'All' && selectedSector !== 'All Sectors') {
        if (!app.sectorApplicability.some(s => s.toLowerCase().includes(selectedSector.toLowerCase())) && !app.sectorApplicability.includes('Other')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'timeline') return a.processingDays - b.processingDays;
      return 0; // default relevant
    });
  }, [approvals, searchQuery, selectedLevel, selectedCategory, selectedStage, selectedSector, selectedState, sortBy]);

  const handleAddToDashboard = (app: Approval) => {
    showToast(`Added "${app.name}" to your workspace dashboard.`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedCategory('All');
    setSelectedStage('All');
    setSelectedSector('All');
    setSortBy('relevant');
  };

  return (
    <section id="section-approvals" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-[#07182C] text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-[#07182C]" />
              <span>National Clearance Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
              All Business Approvals &amp; Clearances
            </h2>
            <p className="mt-1 text-slate-600 text-sm">
              Discover and initiate pre-establishment, operating licenses, and periodic NOCs across Central and State ministries.
            </p>
          </div>

          {/* Level Tabs: All / Central / State */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
            {(['All', 'Central', 'State'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === level
                    ? 'bg-[#07182C] text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {level === 'All' ? 'All Approvals' : level === 'Central' ? 'Central Approvals (Pan-India)' : 'State & UT Clearances'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Search by approval name, ministry, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#07182C] text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#07182C]"
              >
                <option value="All">All States / Central</option>
                {allIndianStatesList.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name} ({st.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#07182C]"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-[#07182C]"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Tags & Results Counter */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <div>
              Showing <strong className="text-slate-900">{filteredApprovals.length}</strong> statutory approvals matching criteria
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedSector !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Approvals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApprovals.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  {app.centralOrState === 'Central' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-sky-700 shrink-0" />
                      <span>Central Approval • Pan-India</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{app.stateName ? `${app.stateName} Clearance` : 'State / UT Clearance'}</span>
                    </span>
                  )}

                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                    {app.stage}
                  </span>
                </div>

                {/* Approval Title */}
                <h3 className="text-base font-bold text-[#07182C] group-hover:text-blue-900 transition-colors leading-snug">
                  {app.name}
                </h3>

                {/* Ministry / Department */}
                <div className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{app.centralOrState === 'Central' ? app.ministry : app.department}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {app.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>SLA: <strong>{app.processingDays} Days</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Fee: <strong>{app.statutoryFee}</strong></span>
                  </div>
                </div>

                {/* Required Documents Pill Summary */}
                <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-700 text-[10px] uppercase">Key Documents:</div>
                  <div className="truncate text-slate-500">
                    {app.requiredDocuments.slice(0, 2).join(' • ')} + {app.requiredDocuments.length - 2} more
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details, Add to Dashboard, Apply */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-details-${app.id}`}
                  onClick={() => setSelectedApproval(app)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  {t('view_details')}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToDashboard(app)}
                    className="p-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-xl transition"
                    title="Add to My Dashboard"
                  >
                    + Dashboard
                  </button>

                  <button
                    id={`btn-apply-${app.id}`}
                    onClick={() => startApplication(app)}
                    className="px-4 py-2 text-xs font-extrabold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-1"
                  >
                    <span>{t('apply')}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
