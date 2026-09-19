import React from 'react';
import { motion } from 'motion/react';

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
}

/**
 * GlassTabs
 * Curated from: https://ui.watermelon.sh/components/tabs (Tabs 11 / 14)
 * Apple-tier sliding active indicator pill with spring physics and dark glassmorphic styling
 */
export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  layoutId = 'glass-tab-indicator',
  className = '',
  size = 'md',
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner shadow-black/20 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 rounded-xl font-medium transition-colors duration-200 z-10 select-none ${
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
            } ${isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                }}
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-md shadow-black/30 backdrop-blur-md"
              />
            )}
            {Icon && <Icon className="relative z-10 w-4 h-4 shrink-0" />}
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-white/5 text-slate-400'
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
