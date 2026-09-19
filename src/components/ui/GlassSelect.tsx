import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
          isOpen
            ? 'bg-black border-sky-400/80 ring-2 ring-sky-400/25 shadow-xl shadow-black'
            : 'bg-black/90 hover:bg-black border-white/20 hover:border-white/35 shadow-md'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <span className="text-white text-xs font-semibold truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-slate-400 text-xs font-medium truncate">
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
              className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Clear"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Glassmorphism Floating Menu with Pure Black Background */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-[999] rounded-2xl p-2.5 bg-black/95 backdrop-blur-3xl border border-white/20 shadow-2xl shadow-black overflow-hidden ring-1 ring-white/10 min-w-[240px]"
          >
            {/* Search Input */}
            {searchable && options.length > 5 && (
              <div className="relative mb-2 px-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400/80 focus:bg-zinc-900 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Option List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 overscroll-contain scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
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
                          isSelected
                            ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 font-bold'
                            : 'text-slate-200 hover:text-white hover:bg-zinc-900/90'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {opt.badge !== undefined && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-slate-200 border border-white/10">
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-sky-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Grouped items */}
                  {Object.entries(groupedOptions.groups).map(([groupName, groupOpts]) => (
                    <div key={groupName} className="pt-2 first:pt-0">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                        <span>{groupName}</span>
                        <span className="text-slate-500 font-normal">
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
                                isSelected
                                  ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 font-bold'
                                  : 'text-slate-200 hover:text-white hover:bg-zinc-900/90'
                              }`}
                            >
                              <span className="truncate">{opt.label}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {opt.badge !== undefined && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-slate-200 border border-white/10">
                                    {opt.badge}
                                  </span>
                                )}
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-sky-400" />
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
