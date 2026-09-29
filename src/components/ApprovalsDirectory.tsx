import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowRight, 
  MapPin, 
  X,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { Approval, ApprovalCategory } from '../types/swagat';
import { allIndianStatesList } from '../data/indiaStatesData';
import { GlassTabs, TabItem } from './ui/GlassTabs';
import { GlassDataTable, Column } from './ui/GlassDataTable';
import { StatusMark } from './ui/StatusMark';

/**
 * ApprovalsDirectory
 * Curated with Watermelon Table 1 (Table view) & Dark Glassmorphism Card Grid
 */
export const ApprovalsDirectory: React.FC = () => {
  const { 
    approvals, 
    setSelectedApproval, 
    startApplication, 
    showToast,
    selectedSectorFilter,
    selectedStateFilter,
    theme,
  } = useSwagat();
  const isDark = theme === 'dark';
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>(selectedSectorFilter !== 'All' ? selectedSectorFilter : 'All');
  const [selectedState, setSelectedState] = useState<string>(selectedStateFilter !== 'All' ? selectedStateFilter : 'All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

  const levelTabs: TabItem[] = [
    { id: 'All', label: 'All Clearances' },
    { id: 'Central', label: 'Central (Pan-India)' },
    { id: 'State', label: 'State & UT Clearances' }
  ];

  const filteredApprovals = useMemo(() => {
    return approvals.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(q) ||
        app.department.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.some(tag => tag.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedLevel !== 'All' && app.centralOrState !== selectedLevel) {
        return false;
      }

      if (selectedCategory !== 'All' && app.category !== selectedCategory) {
        return false;
      }

      if (selectedStage !== 'All' && app.stage !== selectedStage) {
        return false;
      }

      if (selectedSector !== 'All' && selectedSector !== 'All Sectors') {
        const matchesSector = (app.sectorApplicability && (app.sectorApplicability.includes(selectedSector) || app.sectorApplicability.includes('All Sectors'))) || app.sector === selectedSector;
        if (!matchesSector) return false;
      }

      if (selectedState !== 'All') {
        if (app.centralOrState === 'Central') return true;
        if (app.stateName && !app.stateName.toLowerCase().includes(selectedState.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [approvals, searchQuery, selectedLevel, selectedCategory, selectedStage, selectedSector, selectedState]);

  const handleAddToDashboard = (app: Approval) => {
    showToast(`Added "${app.name}" to your workspace dashboard.`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedCategory('All');
    setSelectedStage('All');
    setSelectedSector('All');
  };

  // Watermelon Table 1 configuration
  const tableColumns: Column<Approval>[] = [
    {
      key: 'name',
      header: 'Statutory Approval',
      render: (app) => (
        <div>
          <span className={`font-bold block ${isDark ? 'text-white' : 'text-[#102A43]'}`}>{app.name}</span>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#52657A]'}`}>{app.department}</span>
        </div>
      ),
    },
    {
      key: 'centralOrState',
      header: 'Jurisdiction',
      render: (app) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          app.centralOrState === 'Central'
            ? isDark ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' : 'bg-sky-50 text-sky-800 border border-sky-200'
            : isDark ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {app.centralOrState === 'Central' ? 'Central Pan-India' : app.stateName || 'State'}
        </span>
      ),
    },
    {
      key: 'processingDays',
      header: 'Statutory SLA',
      render: (app) => <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{app.processingDays} Days</span>,
    },
    {
      key: 'statutoryFee',
      header: 'Statutory Fee',
      render: (app) => <span className={isDark ? 'text-slate-300' : 'text-[#52657A]'}>{app.statutoryFee}</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (app) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedApproval(app);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              isDark 
                ? 'bg-white/10 hover:bg-white/15 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-[#102A43] border border-slate-200'
            }`}
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startApplication(app);
            }}
            className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-extrabold transition"
          >
            Apply
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="section-approvals" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
              <Layers className="w-4 h-4" />
              <span>National Clearance Directory</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              All Business Approvals &amp; Clearances
            </h2>
            <p className={`mt-1 text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Discover and initiate pre-establishment, operating licenses, and periodic NOCs across Central and State ministries.
            </p>
          </div>

          {/* Level Tabs (Watermelon Tabs 11/14) & View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <GlassTabs
              tabs={levelTabs}
              activeTab={selectedLevel}
              onChange={(id) => setSelectedLevel(id as any)}
              layoutId="directory-level-tab"
              size="sm"
              theme={theme}
            />

            <div className={`flex items-center p-1 rounded-2xl border backdrop-blur-xl ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'grid' 
                    ? isDark ? 'bg-white/15 text-white shadow-xs' : 'bg-slate-100 text-slate-900 shadow-xs' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'table' 
                    ? isDark ? 'bg-white/15 text-white shadow-xs' : 'bg-slate-100 text-slate-900 shadow-xs' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View (Watermelon Table 1)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={`rounded-3xl p-5 shadow-2xl border backdrop-blur-2xl mb-8 space-y-4 transition-colors ${
          isDark 
            ? 'bg-slate-950/60 border-white/10' 
            : 'bg-white/90 border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Search by clearance name, ministry, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-sky-400 transition ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:${isDark ? 'text-white' : 'text-slate-700'}`}
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
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-sky-400 transition ${
                  isDark 
                    ? 'bg-[#0A1424] text-white border-white/10' 
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
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
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-sky-400 transition ${
                  isDark 
                    ? 'bg-[#0A1424] text-white border-white/10' 
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
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
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-sky-400 transition ${
                  isDark 
                    ? 'bg-[#0A1424] text-white border-white/10' 
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Tags & Results Counter */}
          <div className={`flex flex-wrap items-center justify-between text-xs pt-2 border-t ${
            isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div>
              Showing <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredApprovals.length}</strong> statutory clearances matching criteria
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedSector !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-400 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Watermelon Table 1 OR Card Grid */}
        {viewMode === 'table' ? (
          <GlassDataTable
            columns={tableColumns}
            data={filteredApprovals}
            keyExtractor={(app) => app.id}
            onRowClick={(app) => setSelectedApproval(app)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApprovals.map((app) => (
              <div
                key={app.id}
                className={`swagat-card rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group ${
                  isDark
                    ? 'bg-slate-950/70 border-white/10 text-white backdrop-blur-2xl shadow-xl'
                    : 'text-[#102A43]'
                }`}
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    {app.centralOrState === 'Central' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                        <span>Central Approval • Pan-India</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{app.stateName ? `${app.stateName} Clearance` : 'State / UT Clearance'}</span>
                      </span>
                    )}

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                      isDark ? 'text-slate-400 bg-white/5 border-white/10' : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      {app.stage}
                    </span>
                  </div>

                  {/* Approval Title */}
                  <h3 className={`text-base font-bold transition-colors leading-snug ${
                    isDark ? 'text-white group-hover:text-sky-300' : 'text-slate-900 group-hover:text-sky-600'
                  }`}>
                    {app.name}
                  </h3>

                  {/* Ministry / Department */}
                  <div className={`text-xs font-medium flex items-center space-x-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{app.centralOrState === 'Central' ? app.ministry : app.department}</span>
                  </div>

                  {/* Description */}
                  <p className={`text-xs line-clamp-3 leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {app.description}
                  </p>

                  {/* Key Metrics */}
                  <div className={`grid grid-cols-2 gap-2 pt-3 border-t text-[11px] ${
                    isDark ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>SLA: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{app.processingDays} Days</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">Fee: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{app.statutoryFee}</strong></span>
                    </div>
                  </div>

                  {/* Required Documents Pill Summary */}
                  <div className={`text-[11px] p-2.5 rounded-xl border space-y-1 ${
                    isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className={`font-semibold text-[10px] uppercase ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Key Documents:</div>
                    <div className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {app.requiredDocuments.slice(0, 2).join(' • ')} + {app.requiredDocuments.length - 2} more
                    </div>
                  </div>
                </div>

                {/* Action Buttons: View Details, Add to Dashboard, Apply */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <button
                    id={`btn-details-${app.id}`}
                    onClick={() => setSelectedApproval(app)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
                      isDark 
                        ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {t('view_details')}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAddToDashboard(app)}
                      className={`p-2 text-xs font-semibold rounded-xl transition ${
                        isDark ? 'text-sky-300 hover:bg-sky-500/15' : 'text-sky-600 hover:bg-sky-50'
                      }`}
                      title="Add to My Dashboard"
                    >
                      + Dashboard
                    </button>

                    <button
                      id={`btn-apply-${app.id}`}
                      onClick={() => startApplication(app)}
                      className="px-4 py-2 text-xs font-extrabold !text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-lg shadow-sky-500/20 transition active:scale-95 flex items-center space-x-1 cursor-pointer"
                    >
                      <span className="!text-white font-extrabold">{t('apply')}</span>
                      <ArrowRight className="w-3 h-3 ml-1 !text-white shrink-0" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
