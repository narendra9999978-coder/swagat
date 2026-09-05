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
  accentColor: string;
  badge: string;
  targetSectionId: string;
}

export const QuickStatsSection: React.FC = () => {
  const { setCurrentView } = useSwagat();

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
      accentColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      badge: 'Pan-India Coverage',
      targetSectionId: 'section-explore-india'
    },
    {
      id: 'stat-central',
      value: '1,400+',
      label: 'Central Approvals',
      sublabel: 'Across 40+ Central Ministries & Statutory Boards',
      icon: ShieldCheck,
      accentColor: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
      badge: 'Federal Single Window',
      targetSectionId: 'section-approvals'
    },
    {
      id: 'stat-state-clearances',
      value: '2,800+',
      label: 'State Clearances',
      sublabel: 'Industrial, municipal, land & utility sanctions',
      icon: Building2,
      accentColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      badge: 'State Systems API',
      targetSectionId: 'section-states'
    },
    {
      id: 'stat-schemes',
      value: '450+',
      label: 'Schemes & Subsidies',
      sublabel: 'PLI, MSME capital grants & fiscal incentives',
      icon: Award,
      accentColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      badge: 'Incentive Discovery',
      targetSectionId: 'section-schemes'
    },
    {
      id: 'stat-sla',
      value: '15-28',
      label: 'Days Avg Clearance',
      sublabel: 'Legally enforced SLA turnaround timeframe',
      icon: Clock,
      accentColor: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
      badge: 'Guaranteed SLA',
      targetSectionId: 'section-tracking'
    }
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#07182C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Ambient Tricolour Background Glow */}
        <div className="absolute -top-16 left-1/4 w-72 h-72 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-72 h-72 bg-[#138808]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Status Pulse */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center space-x-2">
                <span>National Clearance System Real-Time Telemetry</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Live
                </span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Connecting Indian businesses to statutory government authorities without administrative hurdles.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <span className="text-xs text-slate-300 font-medium">
              National SLA Compliance:
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1">
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
                className="cursor-pointer group relative bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.accentColor} transition-transform group-hover:scale-110`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors flex items-center">
                    <span>{item.badge}</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  {item.value}
                </div>

                <div className="text-sm font-bold text-slate-200 mt-1">
                  {item.label}
                </div>

                <div className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
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
