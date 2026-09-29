import React from 'react';
import { useSwagat } from '../../context/SwagatContext';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface GlassDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * GlassDataTable
 * Curated from: https://ui.watermelon.sh/components/table (Table 1)
 * Glassmorphic data table with translucent borders and spring row highlights
 */
export function GlassDataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found matching criteria.',
  className = '',
}: GlassDataTableProps<T>) {
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  return (
    <div
      className={`overflow-hidden rounded-2xl backdrop-blur-2xl transition-colors duration-300 ${
        isDark
          ? 'border border-white/10 bg-slate-950/60 shadow-xl'
          : 'border border-slate-200 bg-white/90 shadow-md'
      } ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className={`border-b ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider select-none ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  } ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`text-xs ${isDark ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}`}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className={`px-4 py-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
                    <span>Loading statutory records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`px-4 py-10 text-center font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors duration-150 ease-out group ${
                    onRowClick 
                      ? isDark ? 'cursor-pointer hover:bg-white/8' : 'cursor-pointer hover:bg-slate-50' 
                      : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 ${
                        isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                      } ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
