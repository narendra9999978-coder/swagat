import React from 'react';

interface IndiaGateIllustrationProps {
  className?: string;
  theme?: 'dark' | 'light';
  opacity?: number;
}

export const IndiaGateIllustration: React.FC<IndiaGateIllustrationProps> = ({
  className = 'w-48 h-56 sm:w-64 sm:h-72',
  theme = 'light',
  opacity = 0.35,
}) => {
  const isDark = theme === 'dark';

  // In light theme: warm sandstone, gold, and slate tones
  // In dark theme: luminous amber, cyan, and glowing sovereign lines
  const primaryStroke = isDark ? '#F59E0B' : '#B45309';
  const secondaryStroke = isDark ? '#38BDF8' : '#94A3B8';
  const fillTint = isDark ? 'rgba(245, 158, 11, 0.05)' : 'rgba(217, 119, 6, 0.04)';
  const archShadow = isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 280"
      className={className}
      style={{ opacity }}
      fill="none"
    >
      <defs>
        <linearGradient id="gateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryStroke} stopOpacity="0.8" />
          <stop offset="60%" stopColor={primaryStroke} stopOpacity="0.5" />
          <stop offset="100%" stopColor={secondaryStroke} stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="gateArchFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryStroke} stopOpacity="0.12" />
          <stop offset="100%" stopColor={archShadow} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* ── BASE PLINTH & STEPS ── */}
      <rect x="20" y="260" width="200" height="6" rx="1.5" stroke={secondaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="28" y="254" width="184" height="6" rx="1.2" stroke={secondaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="36" y="248" width="168" height="6" rx="1" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />

      {/* ── MAIN TWIN PYLONS (LEFT & RIGHT PILLARS) ── */}
      {/* Left Main Pylon */}
      <rect x="42" y="112" width="46" height="136" rx="1" stroke="url(#gateGrad)" strokeWidth="1.5" fill={fillTint} />
      {/* Left Fluting / Vertical Architectural Grooves */}
      <line x1="52" y1="120" x2="52" y2="240" stroke={secondaryStroke} strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="65" y1="120" x2="65" y2="240" stroke={primaryStroke} strokeWidth="0.8" />
      <line x1="78" y1="120" x2="78" y2="240" stroke={secondaryStroke} strokeWidth="0.8" strokeDasharray="3 2" />
      {/* Left Base & Capital Moldings */}
      <rect x="40" y="240" width="50" height="8" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="40" y="112" width="50" height="6" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />

      {/* Right Main Pylon */}
      <rect x="152" y="112" width="46" height="136" rx="1" stroke="url(#gateGrad)" strokeWidth="1.5" fill={fillTint} />
      {/* Right Fluting / Vertical Architectural Grooves */}
      <line x1="162" y1="120" x2="162" y2="240" stroke={secondaryStroke} strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="175" y1="120" x2="175" y2="240" stroke={primaryStroke} strokeWidth="0.8" />
      <line x1="188" y1="120" x2="188" y2="240" stroke={secondaryStroke} strokeWidth="0.8" strokeDasharray="3 2" />
      {/* Right Base & Capital Moldings */}
      <rect x="150" y="240" width="50" height="8" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="150" y="112" width="50" height="6" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />

      {/* ── GRAND CENTRAL ARCHWAY ── */}
      {/* Arch Outline and Inner Fill */}
      <path
        d="M 88,248 L 88,165 C 88,128 152,128 152,165 L 152,248 Z"
        stroke={primaryStroke}
        strokeWidth="1.8"
        fill="url(#gateArchFill)"
      />
      {/* Inner Concentric Arch Trim */}
      <path
        d="M 94,248 L 94,168 C 94,136 146,136 146,168 L 146,248"
        stroke={secondaryStroke}
        strokeWidth="1"
        strokeDasharray="2 1.5"
      />
      {/* Keystone at top of arch */}
      <polygon points="116,130 124,130 122,142 118,142" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />

      {/* ── LOWER ENTABLATURE & CORNICE ── */}
      <rect x="36" y="104" width="168" height="8" rx="1" stroke={primaryStroke} strokeWidth="1.4" fill={fillTint} />
      <line x1="36" y1="108" x2="204" y2="108" stroke={secondaryStroke} strokeWidth="0.8" />

      {/* Dentils / Classical Teeth along Cornice */}
      {[46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190].map((dx) => (
        <rect key={dx} x={dx} y="105" width="4" height="6" stroke={primaryStroke} strokeWidth="0.6" fill={fillTint} />
      ))}

      {/* ── ATTIC / UPPER SECTION WITH INSCRIPTION PANEL ── */}
      <rect x="44" y="68" width="152" height="36" rx="1" stroke="url(#gateGrad)" strokeWidth="1.4" fill={fillTint} />
      
      {/* Inscription Horizontal Grooves */}
      <line x1="56" y1="78" x2="184" y2="78" stroke={primaryStroke} strokeWidth="0.9" />
      <line x1="68" y1="86" x2="172" y2="86" stroke={secondaryStroke} strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="60" y1="94" x2="180" y2="94" stroke={primaryStroke} strokeWidth="0.9" />

      {/* ── STEPPED ATTIC CROWN ── */}
      <rect x="52" y="60" width="136" height="8" rx="1" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="62" y="52" width="116" height="8" rx="1" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="74" y="44" width="92" height="8" rx="1" stroke={primaryStroke} strokeWidth="1.2" fill={fillTint} />
      <rect x="88" y="38" width="64" height="6" rx="1" stroke={secondaryStroke} strokeWidth="1.2" fill={fillTint} />

      {/* ── TOP CROWNING DOME / BOWL (CHHATRI PEDESTAL) ── */}
      <path
        d="M 96,38 C 96,28 144,28 144,38 Z"
        stroke={primaryStroke}
        strokeWidth="1.4"
        fill={fillTint}
      />
      {/* Center Finial */}
      <line x1="120" y1="20" x2="120" y2="28" stroke={primaryStroke} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="120" cy="18" r="2.5" stroke={primaryStroke} strokeWidth="1" fill={isDark ? '#F59E0B' : '#E05A10'} />

      {/* Amar Jawan Jyoti Eternal Flame Glow in Arch */}
      <circle cx="120" cy="235" r="5" fill={isDark ? '#F59E0B' : '#E05A10'} opacity={isDark ? 0.7 : 0.5} />
      <circle cx="120" cy="235" r="14" fill={isDark ? '#F59E0B' : '#E05A10'} opacity={0.15} />
      <path d="M 120,227 Q 123,233 120,237 Q 117,233 120,227 Z" fill="#FFB703" />
    </svg>
  );
};
