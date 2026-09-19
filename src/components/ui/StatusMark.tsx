import React from 'react';

export type StatusVariant = 'active' | 'pending' | 'success' | 'warning' | 'danger';

interface StatusMarkProps {
  status?: StatusVariant;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPing?: boolean;
  className?: string;
}

/**
 * StatusMark
 * Curated from: https://reactbits.dev/c/micro/status-mark
 * Micro radar pulse ring with dark glassmorphic badge styling
 */
export const StatusMark: React.FC<StatusMarkProps> = ({
  status = 'active',
  label,
  size = 'md',
  showPing = true,
  className = '',
}) => {
  const colorMap: Record<StatusVariant, { dot: string; ping: string; text: string; bg: string; border: string }> = {
    active: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-400/50',
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30'
    },
    success: {
      dot: 'bg-teal-400',
      ping: 'bg-teal-400/50',
      text: 'text-teal-300',
      bg: 'bg-teal-950/40',
      border: 'border-teal-500/30'
    },
    pending: {
      dot: 'bg-blue-400',
      ping: 'bg-blue-400/50',
      text: 'text-blue-300',
      bg: 'bg-blue-950/40',
      border: 'border-blue-500/30'
    },
    warning: {
      dot: 'bg-amber-400',
      ping: 'bg-amber-400/50',
      text: 'text-amber-300',
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30'
    },
    danger: {
      dot: 'bg-rose-400',
      ping: 'bg-rose-400/50',
      text: 'text-rose-300',
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/30'
    }
  };

  const current = colorMap[status] || colorMap.active;

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  if (!label) {
    return (
      <span className={`relative inline-flex items-center justify-center ${className}`}>
        {showPing && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${current.ping} animate-ping opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${current.dot}`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md shadow-xs ${current.bg} ${current.border} ${current.text} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {showPing && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.ping} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      <span>{label}</span>
    </span>
  );
};
