import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

interface StatItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentDark: string;
  accentLight: string;
  badge: string;
  targetSectionId: string;
}

export const QuickStatsSection: React.FC = () => {
  const { setCurrentView, theme } = useSwagat();
  const isDark = theme === 'dark';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats: StatItem[] = [
    {
      id: 'stat-states',
      value: '36',
      label: 'States & UTs',
      sublabel: 'Integrated single window clearance portals',
      icon: MapPin,
      accentDark: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      accentLight: 'text-amber-700 bg-amber-100 border-amber-300',
      badge: 'Pan-India Coverage',
      targetSectionId: 'section-explore-india'
    },
    {
      id: 'stat-central',
      value: '1,400+',
      label: 'Central Approvals',
      sublabel: 'Across 40+ Central Ministries & Statutory Boards',
      icon: ShieldCheck,
      accentDark: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
      accentLight: 'text-sky-700 bg-sky-100 border-sky-300',
      badge: 'Central Portal',
      targetSectionId: 'section-approvals'
    },
    {
      id: 'stat-state-clearances',
      value: '2,800+',
      label: 'State Clearances',
      sublabel: 'Across 28 States & 8 Union Territories',
      icon: Building2,
      accentDark: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      accentLight: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      badge: 'All States & UTs',
      targetSectionId: 'section-explore-india'
    },
    {
      id: 'stat-sectors',
      value: '24',
      label: 'Industry Sectors',
      sublabel: 'Sector-specific approval pathways & curated checklists',
      icon: Sparkles,
      accentDark: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      accentLight: 'text-purple-700 bg-purple-100 border-purple-300',
      badge: 'Sector Wizards',
      targetSectionId: 'section-sectors'
    },
    {
      id: 'stat-sla',
      value: '18 Days',
      label: 'Avg. Turnaround',
      sublabel: 'SLA-backed clearance timeline guarantee',
      icon: Clock,
      accentDark: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      accentLight: 'text-rose-700 bg-rose-100 border-rose-300',
      badge: 'Guaranteed SLA',
      targetSectionId: 'section-tracking'
    }
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden border transition-colors duration-500 ${
        isDark
          ? 'bg-[#07182C] border-white/15'
          : 'bg-white/90 border-slate-200 shadow-slate-200/60'
      }`}>
        
        {/* Ambient Tricolour Background Glow */}
        <div className={`absolute -top-16 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-[#FF9933]/10' : 'bg-[#FF9933]/8'}`} />
        <div className={`absolute -bottom-16 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-[#138808]/10' : 'bg-[#138808]/8'}`} />

        {/* Top Header Row with Status Pulse */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <h3 className={`font-bold text-base sm:text-lg flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>National Clearance System Real-Time Telemetry</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}>
                  Live
                </span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Connecting Indian businesses to statutory government authorities without administrative hurdles.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              National SLA Compliance:
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center space-x-1 ${
              isDark
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                : 'text-emerald-700 bg-emerald-50 border-emerald-300'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>94.8% on-time</span>
            </span>
          </div>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
          {stats.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => scrollTo(item.targetSectionId)}
                className={`cursor-pointer group relative border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-white/25'
                    : 'bg-white border-[#D9E3EE]'
                }`}
              >
                <div className="flex items-center justify-between gap-2.5 mb-3 min-h-[36px]">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${isDark ? item.accentDark : item.accentLight}`}>
                    <IconComponent className="w-4 h-4 shrink-0" />
                  </div>
                  <span className={`flex-1 min-w-0 text-right text-[10px] font-bold uppercase tracking-wider flex items-center justify-end transition-colors ${
                    isDark ? 'text-slate-400 group-hover:text-amber-300' : 'text-slate-500 group-hover:text-amber-600'
                  }`}>
                    <span className="truncate">{item.badge}</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>

                <div className={`text-2xl sm:text-3xl font-display font-black tracking-tight transition-colors ${
                  isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-600'
                }`}>
                  {item.value}
                </div>

                <div className={`text-sm font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.label}
                </div>

                <div className={`text-[11px] leading-snug mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.sublabel}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

