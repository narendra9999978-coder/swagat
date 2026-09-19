import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: () => void;
  variant?: 'glass' | 'subtle';
}

/**
 * BackButton
 * Curated from: https://21st.dev/@ozantekin/components/back-button
 * Apple-inspired fluid motion with sliding arrow physics and dark glassmorphic pill
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  onClick,
  variant = 'glass',
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white hover:scale-[1.02] active:scale-[0.98] ${
        variant === 'glass'
          ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md shadow-xs shadow-black/20'
          : 'bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10'
      } ${className}`}
      {...props}
    >
      <span className="relative flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-1">
        <ArrowLeft className="w-3.5 h-3.5" />
      </span>
      <span className="tracking-tight">{label}</span>
    </button>
  );
};
