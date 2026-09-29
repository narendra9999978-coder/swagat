import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../../context/SwagatContext';

export interface GlassSelectOption {
  value: string;
  label: string;
  badge?: string | number;
  group?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface GlassSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchable = true,
  className = '',
  disabled = false,
}) => {
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.group && opt.group.toLowerCase().includes(query))
    );
  }, [options, searchQuery]);

  // Group filtered options
  const groupedOptions = useMemo(() => {
    const groups: { [key: string]: GlassSelectOption[] } = {};
    const ungrouped: GlassSelectOption[] = [];

    filteredOptions.forEach((opt) => {
      if (opt.group) {
        if (!groups[opt.group]) groups[opt.group] = [];
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });

    return { ungrouped, groups };
  }, [filteredOptions]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-3 rounded-xl transition-all duration-200 text-left flex items-center justify-between gap-2 border cursor-pointer ${
          isDark
            ? isOpen
              ? 'bg-[#0B2038] border-sky-400 ring-2 ring-sky-400/25 shadow-xl text-white'
              : 'bg-[#07182C] hover:bg-[#0D2644] border-white/15 hover:border-white/30 text-white shadow-md'
            : isOpen
              ? 'bg-[#FFFFFF] border-[#0284C7] ring-2 ring-sky-500/20 shadow-md text-[#102A43]'
              : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8] text-[#102A43] shadow-xs'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#102A43]'}`}>
              {selectedOption.label}
            </span>
          ) : (
            <span className={`text-xs font-medium truncate ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedOption && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className={`p-0.5 rounded-full transition ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title="Clear"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isDark
                ? isOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'
                : isOpen ? 'rotate-180 text-sky-600' : 'text-slate-500'
            }`}
          />
        </div>
      </button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-0 right-0 top-full mt-2 z-[999] rounded-2xl p-2.5 overflow-hidden shadow-2xl min-w-[260px] border ${
              isDark
                ? 'bg-[#07182C] border-white/15 text-white shadow-black/80 ring-1 ring-white/10'
                : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#102A43] shadow-[0_16px_40px_rgba(0,0,0,0.12)]'
            }`}
          >
            {/* Search Input */}
            {searchable && options.length > 5 && (
              <div className="relative mb-2 px-1">
                <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDark ? 'text-slate-400' : 'text-[#64748B]'
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search state or region..."
                  className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs focus:outline-none transition border ${
                    isDark
                      ? 'bg-slate-900 border-white/15 text-white placeholder-slate-400 focus:border-sky-400'
                      : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#102A43] placeholder-[#64748B] focus:border-[#0284C7] focus:bg-white'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Option List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className={`py-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  No matching options found
                </div>
              ) : (
                <>
                  {/* Ungrouped items */}
                  {groupedOptions.ungrouped.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isDark
                            ? isSelected
                              ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 font-bold'
                              : 'text-slate-200 hover:text-white hover:bg-white/10'
                            : isSelected
                              ? 'bg-[#EEF7FA] text-[#102A43] border border-[#0284C7]/40 font-bold'
                              : 'text-[#334E68] hover:text-[#102A43] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {opt.badge !== undefined && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isDark
                                ? 'bg-slate-800 text-slate-200 border-white/10'
                                : 'bg-[#E8EEF5] text-[#334E68] border-[#CBD5E1]/50'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-[#0284C7]'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Grouped items */}
                  {Object.entries(groupedOptions.groups).map(([groupName, groupOpts]) => (
                    <div key={groupName} className="pt-2 first:pt-0">
                      <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                        isDark ? 'text-amber-400' : 'text-[#0B2545]'
                      }`}>
                        <span>{groupName}</span>
                        <span className={`font-normal ${isDark ? 'text-slate-500' : 'text-[#64748B]'}`}>
                          {groupOpts.length}
                        </span>
                      </div>
                      <div className="space-y-0.5 mt-0.5">
                        {groupOpts.map((opt) => {
                          const isSelected = opt.value === value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelect(opt.value)}
                              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isDark
                                  ? isSelected
                                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 font-bold'
                                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                                  : isSelected
                                    ? 'bg-[#EEF7FA] text-[#102A43] border border-[#0284C7]/40 font-bold'
                                    : 'text-[#334E68] hover:text-[#102A43] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <span className="truncate">{opt.label}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {opt.badge !== undefined && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    isDark
                                      ? 'bg-slate-800 text-slate-200 border-white/10'
                                      : 'bg-[#E8EEF5] text-[#334E68] border-[#CBD5E1]/50'
                                  }`}>
                                    {opt.badge}
                                  </span>
                                )}
                                {isSelected && (
                                  <Check className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-[#0284C7]'}`} />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
