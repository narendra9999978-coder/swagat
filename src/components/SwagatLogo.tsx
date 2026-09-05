import React from 'react';

interface SwagatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  animated?: boolean;
  className?: string;
}

export const SwagatLogo: React.FC<SwagatLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  theme = 'light',
  animated = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-lg', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-24 h-24', icon: 'w-14 h-14', text: 'text-4xl', sub: 'text-sm' }
  };

  const s = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Emblem */}
      <div className={`relative flex items-center justify-center ${s.box} rounded-2xl bg-gradient-to-br from-[#06152B] via-[#0D284E] to-[#06152B] text-white shadow-md border border-white/15 overflow-hidden group`}>
        {/* Glow behind */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,153,51,0.25),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(19,136,8,0.25),transparent_60%)]"></div>

        {/* SVG Emblem: Circular S with Ashoka Chakra and Tricolour accents */}
        <svg
          viewBox="0 0 100 100"
          className={`${s.icon} z-10 transition-transform duration-500 group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="swagatSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#FF6600" />
            </linearGradient>
            <linearGradient id="swagatGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#19A745" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
            <linearGradient id="swagatChakra" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Outer S Ribbon Top Arc (Saffron) */}
          <path
            d="M 68 18 C 52 14, 26 22, 26 40 C 26 54, 52 50, 52 64 C 52 74, 38 78, 28 72"
            stroke="url(#swagatSaffron)"
            strokeWidth="8.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Outer S Ribbon Bottom Arc (India Green) */}
          <path
            d="M 32 82 C 48 86, 74 78, 74 60 C 74 46, 48 50, 48 36 C 48 26, 62 22, 72 28"
            stroke="url(#swagatGreen)"
            strokeWidth="8.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Center Ashoka Chakra Hub */}
          <circle cx="50" cy="50" r="13" stroke="url(#swagatChakra)" strokeWidth="2.5" fill="#06152B" />
          <circle cx="50" cy="50" r="4" fill="#38BDF8" />

          {/* Ashoka Chakra Spokes (24 geometric rays stylized) */}
          <g className={animated ? 'animate-spin origin-center [animation-duration:20s]' : ''}>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="40"
                x2="50"
                y2="43"
                stroke="#38BDF8"
                strokeWidth="1.5"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </g>

          {/* High-tech node dots */}
          <circle cx="70" cy="18" r="3.5" fill="#FF9933" />
          <circle cx="30" cy="82" r="3.5" fill="#19A745" />
        </svg>

        {/* Dynamic corner light reflection */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white/10 rounded-bl-full pointer-events-none"></div>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-display font-extrabold tracking-tight ${s.text} ${
              theme === 'dark' ? 'text-white' : 'text-[#07182C]'
            }`}
          >
            SWAGAT
          </span>

          {showTagline ? (
            <span
              className={`font-semibold tracking-widest uppercase ${s.sub} ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              INNOVATE | BUILD | SERVE
            </span>
          ) : (
            <span
              className={`text-[10px] font-medium leading-none whitespace-nowrap hidden sm:inline ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              India’s Single Window for Business Approvals
            </span>
          )}
        </div>
      )}
    </div>
  );
};
