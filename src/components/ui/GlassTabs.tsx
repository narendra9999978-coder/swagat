import React from 'react';
import { motion } from 'motion/react';
import { useSwagat } from '../../context/SwagatContext';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number | string;
}

interface GlassTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
  size?: 'sm' | 'md';
  theme?: 'light' | 'dark';
}

/**
 * GlassTabs
 * Curated from: https://ui.watermelon.sh/components/tabs (Tabs 11 / 14)
 * Apple-tier sliding active indicator pill with spring physics and full dual-theme support.
 */
export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  layoutId = 'glass-tab-indicator',
  className = '',
  size = 'md',
  theme: propTheme,
}) => {
  let contextTheme: 'light' | 'dark' = 'dark';
  try {
    const swagat = useSwagat();
    if (swagat?.theme) {
      contextTheme = swagat.theme;
    }
  } catch {
    // safe fallback
  }

  const activeTheme = propTheme || contextTheme;
  const isDark = activeTheme === 'dark';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl border backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-white/5 border-white/10 shadow-inner shadow-black/20'
          : 'bg-slate-100/90 border-[#CBD5E1] shadow-inner shadow-slate-200/50'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 rounded-xl transition-colors duration-200 z-10 select-none cursor-pointer ${
              size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
            } ${
              isActive
                ? isDark
                  ? 'text-white font-bold'
                  : 'text-[#0B2545] font-extrabold'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200 font-medium'
                  : 'text-[#334155] hover:text-[#0B2545] font-semibold'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                }}
                className={`absolute inset-0 rounded-xl backdrop-blur-md border ${
                  isDark
                    ? 'bg-gradient-to-b from-white/15 to-white/5 border-white/20 shadow-md shadow-black/30'
                    : 'bg-white border-[#CBD5E1] shadow-md shadow-slate-300/50 ring-1 ring-slate-900/5'
                }`}
              />
            )}
            {Icon && (
              <Icon
                className={`relative z-10 w-4 h-4 shrink-0 ${
                  isActive
                    ? isDark ? 'text-white' : 'text-[#0B2545]'
                    : isDark ? 'text-slate-400' : 'text-[#334155]'
                }`}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none border ${
                  isActive
                    ? isDark
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                    : isDark
                      ? 'bg-white/5 text-slate-400 border-white/10'
                      : 'bg-slate-200/80 text-[#334155] border-slate-300/80 font-medium'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
