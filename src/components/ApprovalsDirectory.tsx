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
  } = useSwagat();
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
          <span className="font-bold text-white block">{app.name}</span>
          <span className="text-[11px] text-slate-400">{app.department}</span>
        </div>
      ),
    },
    {
      key: 'centralOrState',
      header: 'Jurisdiction',
      render: (app) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          app.centralOrState === 'Central'
            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
        }`}>
          {app.centralOrState === 'Central' ? 'Central Pan-India' : app.stateName || 'State'}
        </span>
      ),
    },
    {
      key: 'processingDays',
      header: 'Statutory SLA',
      render: (app) => <span className="font-bold text-amber-300">{app.processingDays} Days</span>,
    },
    {
      key: 'statutoryFee',
      header: 'Statutory Fee',
      render: (app) => <span className="text-slate-300">{app.statutoryFee}</span>,
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
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold transition"
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
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
              <Layers className="w-4 h-4" />
              <span>National Clearance Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              All Business Approvals &amp; Clearances
            </h2>
            <p className="mt-1 text-slate-300 text-sm">
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
            />

            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'grid' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'table' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View (Watermelon Table 1)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-950/60 rounded-3xl p-5 shadow-2xl border border-white/10 backdrop-blur-2xl mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Search by clearance name, ministry, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-sky-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-xs font-medium bg-[#0A1424] text-white focus:outline-none focus:border-sky-400"
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
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-xs font-medium bg-[#0A1424] text-white focus:outline-none focus:border-sky-400"
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
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-xs font-medium bg-[#0A1424] text-white focus:outline-none focus:border-sky-400"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Tags & Results Counter */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-white/5 text-slate-400">
            <div>
              Showing <strong className="text-white">{filteredApprovals.length}</strong> statutory clearances matching criteria
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedSector !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
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
                className="bg-slate-950/70 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.01] p-6 flex flex-col justify-between space-y-4 group text-white"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    {app.centralOrState === 'Central' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                        <span>Central Approval • Pan-India</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{app.stateName ? `${app.stateName} Clearance` : 'State / UT Clearance'}</span>
                      </span>
                    )}

                    <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md shrink-0">
                      {app.stage}
                    </span>
                  </div>

                  {/* Approval Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {app.name}
                  </h3>

                  {/* Ministry / Department */}
                  <div className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{app.centralOrState === 'Central' ? app.ministry : app.department}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-[11px] text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>SLA: <strong className="text-white">{app.processingDays} Days</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">Fee: <strong className="text-white">{app.statutoryFee}</strong></span>
                    </div>
                  </div>

                  {/* Required Documents Pill Summary */}
                  <div className="text-[11px] bg-white/5 p-2.5 rounded-xl border border-white/5 text-slate-300 space-y-1">
                    <div className="font-semibold text-slate-400 text-[10px] uppercase">Key Documents:</div>
                    <div className="truncate text-slate-300">
                      {app.requiredDocuments.slice(0, 2).join(' • ')} + {app.requiredDocuments.length - 2} more
                    </div>
                  </div>
                </div>

                {/* Action Buttons: View Details, Add to Dashboard, Apply */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    id={`btn-details-${app.id}`}
                    onClick={() => setSelectedApproval(app)}
                    className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                  >
                    {t('view_details')}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAddToDashboard(app)}
                      className="p-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/15 rounded-xl transition"
                      title="Add to My Dashboard"
                    >
                      + Dashboard
                    </button>

                    <button
                      id={`btn-apply-${app.id}`}
                      onClick={() => startApplication(app)}
                      className="px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 rounded-xl shadow-lg shadow-sky-500/20 transition active:scale-95 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{t('apply')}</span>
                      <ArrowRight className="w-3 h-3 ml-1 text-slate-950" />
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
