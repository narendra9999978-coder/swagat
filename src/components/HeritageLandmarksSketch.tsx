import React from 'react';

interface HeritageLandmarksSketchProps {
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * HeritageLandmarksSketch
 * Elegant minimal monochrome architectural line-art sketches of India Gate and Taj Mahal.
 * Positioned together as a subtle Indian heritage silhouette with India Gate prominent in foreground
 * and Taj Mahal gracefully nested beside/behind it.
 * Uses an SVG gradient mask so their base dissolves seamlessly into the ambient tricolour lighting.
 */
export const HeritageLandmarksSketch: React.FC<HeritageLandmarksSketchProps> = ({
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  // Architectural stroke & glow tokens
  const strokeColor = isDark ? '#5BAFD6' : '#A86C2D';
  const strokeOpacity = isDark ? 0.35 : 0.62;
  const secondaryStrokeOpacity = isDark ? 0.18 : 0.40;
  const fillOpacity = isDark ? 0.03 : 0.05;

  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 720 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        preserveAspectRatio="xMinYMax meet"
      >
        <defs>
          {/* Vertical Dissolve Mask — fades bottom portion smoothly into the tricolour background */}
          <linearGradient id="heritageDissolveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="88%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="96%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Horizontal Edge Fade — prevents harsh left/right cutoffs */}
          <linearGradient id="heritageHorizFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          <mask id="heritageDissolveMask">
            <rect x="0" y="0" width="720" height="420" fill="url(#heritageDissolveGrad)" />
          </mask>
          
          <mask id="heritageHorizMask">
            <rect x="0" y="0" width="720" height="420" fill="url(#heritageHorizFade)" />
          </mask>

          {/* Faint saffron/blue atmospheric backlight for the landmarks */}
          <radialGradient id="heritageAura" cx="30%" cy="60%" r="50%">
            <stop offset="0%" stopColor={isDark ? '#FF9933' : '#FF9933'} stopOpacity={isDark ? 0.08 : 0.06} />
            <stop offset="50%" stopColor={isDark ? '#000080' : '#000080'} stopOpacity={isDark ? 0.04 : 0.02} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient aura behind landmark silhouettes */}
        <circle cx="280" cy="260" r="220" fill="url(#heritageAura)" />

        {/* Masked Line-Art Group */}
        <g mask="url(#heritageDissolveMask)">
          <g mask="url(#heritageHorizMask)">
          {/* ═════════════════════════════════════════════════════════════════════════
              1. TAJ MAHAL (Positioned beside & behind India Gate, center-right)
              X: 250 to 680, Height: 70 to 390
              ═════════════════════════════════════════════════════════════════════════ */}
          <g
            stroke={strokeColor}
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={secondaryStrokeOpacity}
            fill={strokeColor}
            fillOpacity={fillOpacity}
          >
            {/* Left Far Minaret (X: ~280) */}
            <path d="M 276 390 L 279 125 L 285 125 L 288 390" />
            <path d="M 274 310 L 290 310" strokeWidth="1" />
            <path d="M 276 220 L 288 220" strokeWidth="1" />
            <path d="M 277 145 L 287 145" strokeWidth="1" />
            {/* Left Minaret Chhatri & Dome */}
            <path d="M 276 125 L 276 112 Q 282 102 288 112 L 288 125" />
            <line x1="282" y1="102" x2="282" y2="92" strokeWidth="0.75" />

            {/* Right Far Minaret (X: ~640) */}
            <path d="M 632 390 L 635 125 L 641 125 L 644 390" />
            <path d="M 630 310 L 646 310" strokeWidth="1" />
            <path d="M 632 220 L 644 220" strokeWidth="1" />
            <path d="M 633 145 L 643 145" strokeWidth="1" />
            {/* Right Minaret Chhatri & Dome */}
            <path d="M 632 125 L 632 112 Q 638 102 644 112 L 644 125" />
            <line x1="638" y1="102" x2="638" y2="92" strokeWidth="0.75" />

            {/* Main Taj Mahal Plinth Platform */}
            <rect x="300" y="360" width="320" height="25" rx="1" />
            <line x1="290" y1="385" x2="630" y2="385" strokeWidth="1" />

            {/* Main Monument Structure Block */}
            <path d="M 345 360 L 345 200 L 575 200 L 575 360" />
            <line x1="335" y1="200" x2="585" y2="200" strokeWidth="1.2" />

            {/* Central Grand Iwan Portal (Pishtaq) */}
            <path d="M 405 360 L 405 185 L 515 185 L 515 360" strokeWidth="1.2" />
            {/* Pointed Arch Curve */}
            <path d="M 420 360 L 420 250 Q 420 210 460 195 Q 500 210 500 250 L 500 360" strokeWidth="1.2" />
            <path d="M 432 360 L 432 265 Q 432 235 460 220 Q 488 235 488 265 L 488 360" strokeWidth="0.75" />
            {/* Inner Portal Doorway */}
            <path d="M 445 360 L 445 315 Q 445 300 460 292 Q 475 300 475 315 L 475 360" strokeWidth="0.75" />

            {/* Left Wing Niches (2 tiers) */}
            <rect x="358" y="215" width="34" height="60" rx="1" />
            <path d="M 362 275 L 362 235 Q 375 222 388 235 L 388 275" strokeWidth="0.7" />
            <rect x="358" y="290" width="34" height="60" rx="1" />
            <path d="M 362 350 L 362 310 Q 375 297 388 310 L 388 350" strokeWidth="0.7" />

            {/* Right Wing Niches (2 tiers) */}
            <rect x="528" y="215" width="34" height="60" rx="1" />
            <path d="M 532 275 L 532 235 Q 545 222 558 235 L 558 275" strokeWidth="0.7" />
            <rect x="528" y="290" width="34" height="60" rx="1" />
            <path d="M 532 350 L 532 310 Q 545 297 558 310 L 558 350" strokeWidth="0.7" />

            {/* Left Chhatri flanking dome */}
            <path d="M 388 198 L 388 170 Q 398 152 408 170 L 408 198" />
            <line x1="398" y1="152" x2="398" y2="140" strokeWidth="0.8" />
            <line x1="392" y1="198" x2="392" y2="175" strokeWidth="0.6" />
            <line x1="404" y1="198" x2="404" y2="175" strokeWidth="0.6" />

            {/* Right Chhatri flanking dome */}
            <path d="M 512 198 L 512 170 Q 522 152 532 170 L 532 198" />
            <line x1="522" y1="152" x2="522" y2="140" strokeWidth="0.8" />
            <line x1="516" y1="198" x2="516" y2="175" strokeWidth="0.6" />
            <line x1="528" y1="198" x2="528" y2="175" strokeWidth="0.6" />

            {/* Taj Mahal Central Dome Drum */}
            <rect x="424" y="160" width="72" height="38" rx="1" />
            <line x1="420" y1="160" x2="500" y2="160" strokeWidth="1" />

            {/* Iconic Onion Bulb Dome */}
            <path
              d="M 426 160 C 416 135, 420 95, 460 76 C 500 95, 504 135, 494 160 Z"
              strokeWidth="1.2"
            />
            {/* Dome Spire / Finial (Kalash) */}
            <line x1="460" y1="76" x2="460" y2="48" strokeWidth="1.2" />
            <circle cx="460" cy="56" r="2.5" />
            <circle cx="460" cy="48" r="1.5" />
          </g>

          {/* ═════════════════════════════════════════════════════════════════════════
              2. INDIA GATE (Foreground landmark, prominent and clear)
              X: 20 to 290, Height: 75 to 400
              ═════════════════════════════════════════════════════════════════════════ */}
          <g
            stroke={strokeColor}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={strokeOpacity}
            fill={strokeColor}
            fillOpacity={fillOpacity}
          >
            {/* Stepped Pedestal Base */}
            <line x1="20" y1="390" x2="280" y2="390" strokeWidth="1.6" />
            <rect x="35" y="375" width="230" height="15" rx="1" />
            <rect x="45" y="362" width="210" height="13" rx="1" strokeWidth="1.2" />

            {/* Left Massive Pylon */}
            <path d="M 52 362 L 54 165 L 108 165 L 110 362" strokeWidth="1.2" />
            {/* Left Pylon Vertical Recess Lines for architectural depth */}
            <line x1="64" y1="362" x2="65" y2="165" strokeWidth="0.65" strokeOpacity={secondaryStrokeOpacity} />
            <line x1="97" y1="362" x2="98" y2="165" strokeWidth="0.65" strokeOpacity={secondaryStrokeOpacity} />

            {/* Right Massive Pylon */}
            <path d="M 190 362 L 192 165 L 246 165 L 248 362" strokeWidth="1.2" />
            {/* Right Pylon Vertical Recess Lines */}
            <line x1="202" y1="362" x2="203" y2="165" strokeWidth="0.65" strokeOpacity={secondaryStrokeOpacity} />
            <line x1="235" y1="362" x2="236" y2="165" strokeWidth="0.65" strokeOpacity={secondaryStrokeOpacity} />

            {/* Grand Center Roman Arch */}
            {/* Arch Springing line */}
            <line x1="108" y1="230" x2="192" y2="230" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity={secondaryStrokeOpacity} />
            {/* Outer Arch Molding */}
            <path
              d="M 110 362 L 110 230 C 110 182, 190 182, 190 230 L 190 362"
              strokeWidth="1.5"
            />
            {/* Inner Arch Reveal */}
            <path
              d="M 118 362 L 118 235 C 118 194, 182 194, 182 235 L 182 362"
              strokeWidth="0.9"
            />
            {/* Arch Keystone accent */}
            <polygon points="146,182 154,182 152,192 148,192" strokeWidth="0.8" />

            {/* Main Arch Entablature & Cornice */}
            <rect x="42" y="152" width="216" height="13" rx="1" strokeWidth="1.3" />
            <line x1="38" y1="152" x2="262" y2="152" strokeWidth="1.5" />
            <rect x="48" y="138" width="204" height="14" rx="1" strokeWidth="1" />

            {/* Inscription Frieze ("INDIA") */}
            <line x1="56" y1="145" x2="244" y2="145" strokeWidth="0.65" strokeOpacity={secondaryStrokeOpacity} />
            {/* Subtle stylized "I N D I A" geometric inscription lines */}
            <path
              d="M 125 142 L 125 148 M 133 148 L 133 142 L 140 148 L 140 142 M 147 142 L 147 148 Q 155 145 147 142 M 161 142 L 161 148 M 168 148 L 173 142 L 178 148"
              strokeWidth="0.75"
              strokeOpacity={strokeOpacity * 1.2}
            />

            {/* Upper Cornice */}
            <line x1="44" y1="138" x2="256" y2="138" strokeWidth="1.4" />

            {/* Attic Story */}
            <rect x="62" y="108" width="176" height="30" rx="1" strokeWidth="1.2" />
            {/* Attic stepped tiers */}
            <rect x="74" y="98" width="152" height="10" rx="1" strokeWidth="1" />
            <rect x="88" y="90" width="124" height="8" rx="1" strokeWidth="0.9" />

            {/* Top Shallow Ceremonial Urn / Crown Bowl (Chhatri / Cenotaph top) */}
            <path
              d="M 124 90 Q 150 78 176 90 Z"
              strokeWidth="1.1"
            />
            <line x1="142" y1="83" x2="158" y2="83" strokeWidth="0.9" />
          </g>
        </g>
        </g>
      </svg>
    </div>
  );
};
