import React from 'react';

interface SwagatLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  animated?: boolean;
  className?: string;
  useImage?: boolean;
}

export const SwagatLogo: React.FC<SwagatLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  theme = 'dark',
  animated = false,
  className = '',
  useImage = false
}) => {
  // If useImage is true, display the generated master horizontal banner directly
  if (useImage) {
    const imgHeights = {
      sm: 'h-9 sm:h-10',
      md: 'h-12 sm:h-14',
      lg: 'h-16 sm:h-20',
      xl: 'h-24 sm:h-28'
    };
    return (
      <img
        src="/swagat_official_logo.jpg"
        alt="SWAGAT – India’s Single Window Gateway"
        className={`${imgHeights[size]} w-auto object-contain rounded-xl shadow-lg select-none ${className}`}
      />
    );
  }

  // Enhanced, noticeably bigger sizing scale with generous text and icon presence
  const sizeMap = {
    xs: {
      icon: 'w-9 h-9 sm:w-10 sm:h-10',
      text: 'text-lg sm:text-xl',
      tagline: 'text-[9px]',
      divider: 'h-6 sm:h-7',
      gap: 'space-x-2.5'
    },
    sm: {
      icon: 'w-11 h-11 sm:w-12 sm:h-12',
      text: 'text-2xl sm:text-3xl',
      tagline: 'text-[10.5px] sm:text-xs',
      divider: 'h-8 sm:h-9',
      gap: 'space-x-3'
    },
    md: {
      icon: 'w-14 h-14 sm:w-16 sm:h-16',
      text: 'text-3xl sm:text-4xl',
      tagline: 'text-xs sm:text-sm',
      divider: 'h-10 sm:h-12',
      gap: 'space-x-3.5'
    },
    lg: {
      icon: 'w-18 h-18 sm:w-20 sm:h-20',
      text: 'text-4xl sm:text-5xl',
      tagline: 'text-sm sm:text-base',
      divider: 'h-14 sm:h-16',
      gap: 'space-x-4'
    },
    xl: {
      icon: 'w-24 h-24 sm:w-28 sm:h-28',
      text: 'text-5xl sm:text-6xl',
      tagline: 'text-base sm:text-lg',
      divider: 'h-18 sm:h-22',
      gap: 'space-x-5'
    }
  };

  const s = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${s.gap} select-none shrink-0 ${className}`}>
      {/* LEFT EMBLEM: Free-standing circular tricolour emblem (Zero square artifacts) */}
      <div className="relative flex items-center justify-center shrink-0 group">
        {/* Soft, circular ambient tricolour glow behind emblem */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9933]/25 via-sky-400/10 to-[#138808]/25 blur-md pointer-events-none scale-110"></div>

        {/* Clean, tight-cropped, anti-aliased Emblem (100% transparent background) */}
        <img
          src="/swagat-emblem-clean.png"
          alt="SWAGAT Emblem"
          className={`${s.icon} object-contain select-none z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] ${
            animated ? 'animate-[pulse_3s_infinite]' : ''
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/swagat-emblem-transparent.png';
          }}
        />
      </div>

      {/* SLEEK VERTICAL DIVIDER LINE */}
      {showWordmark && (
        <div className={`${s.divider} w-[1.5px] bg-gradient-to-b from-transparent via-sky-400/40 to-transparent shrink-0 mx-0.5`} />
      )}

      {/* RIGHT WORDMARK */}
      {showWordmark && (
        <div className="flex flex-col leading-none min-w-0 shrink-0">
          <div className="flex items-center tracking-wider font-black font-display">
            <span className={`${s.text} ${theme === 'dark' ? 'text-white' : 'text-[#061525]'}`}>
              SWA
            </span>
            {/* The letter 'G' with Indian tricolour gradient */}
            <span
              className={`${s.text} ${
                theme === 'dark'
                  ? 'bg-gradient-to-b from-[#FF9933] via-white to-[#138808]'
                  : 'bg-gradient-to-b from-[#E05A10] via-[#061525] to-[#138808]'
              } bg-clip-text text-transparent font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]`}
            >
              G
            </span>
            <span className={`${s.text} ${theme === 'dark' ? 'text-white' : 'text-[#061525]'}`}>
              AT
            </span>
          </div>

          {/* OFFICIAL TAGLINE */}
          {showTagline && (
            <span
              className={`font-semibold tracking-wide mt-1.5 whitespace-nowrap ${s.tagline} ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              India’s Single Window Gateway
            </span>
          )}
        </div>
      )}
    </div>
  );
};
