import React from 'react';
import { IndiaBackgroundMap } from './IndiaBackgroundMap';
import { HeritageLandmarksSketch } from './HeritageLandmarksSketch';

interface TricolourHeritageBackgroundProps {
  theme?: 'dark' | 'light';
}

/**
 * TricolourHeritageBackground
 * Exact reproduction of the SWAGAT Government of India UI background:
 * - Crisp white canvas with high readability
 * - Top-left: Flowing 3D Indian tricolour ribbon wave (Saffron / White / Green)
 * - Bottom-right: Flowing 3D Indian tricolour ribbon wave (Green / White / Saffron)
 * - Right-center: Subtle cyan/blue India outline map behind the dashboard card
 * - Bottom-right: Ashoka Chakra watermark
 * - Bottom-left: Architectural India Gate silhouette
 *
 * DARK THEME: Deep navy base with soft atmospheric tricolour lighting.
 *   No hard diagonal bands. Subtle ambient glows only.
 * LIGHT THEME: Unchanged — crisp white with full tricolour ribbon waves.
 */
export const TricolourHeritageBackground: React.FC<TricolourHeritageBackgroundProps> = ({
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  /* ════════════════════════════════════════════════════════════════════
     DARK THEME — Premium deep-navy, subtle tricolour atmosphere
     ════════════════════════════════════════════════════════════════════ */
  if (isDark) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none transition-colors duration-700">
        {/* ── 1. BASE CANVAS: deep navy radial gradient ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 22% 18%, #12375A 0%, #0B243D 30%, #071A2D 65%, #04111F 100%)',
          }}
        />

        {/* Subtle dot-grid texture for premium depth */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(100,160,200,0.10) 0.5px, transparent 0.5px)',
            backgroundSize: '30px 30px',
            opacity: 0.35,
          }}
        />

        {/* ── 2. ATMOSPHERIC TRICOLOUR AMBIENT LIGHTING ── */}
        {/* Saffron — soft upper-left glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-8%',
            left: '-5%',
            width: '55%',
            height: '50%',
            background: 'radial-gradient(ellipse at 20% 20%, rgba(255,153,51,0.13) 0%, rgba(255,153,51,0.05) 45%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* White — soft center-left diffuse glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%',
            left: '5%',
            width: '45%',
            height: '40%',
            background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.07) 0%, transparent 65%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Green — soft lower-right glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-8%',
            right: '-5%',
            width: '55%',
            height: '50%',
            background: 'radial-gradient(ellipse at 78% 80%, rgba(19,136,8,0.12) 0%, rgba(19,136,8,0.05) 45%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Saffron secondary — upper-right accent */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-5%',
            right: '5%',
            width: '35%',
            height: '35%',
            background: 'radial-gradient(ellipse at 70% 15%, rgba(255,190,69,0.08) 0%, transparent 60%)',
            filter: 'blur(70px)',
          }}
        />

        {/* ── 3. ASHOKA CHAKRA — reduced 40%, low opacity, bottom-right edge ── */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            bottom: '-60px',
            right: '-60px',
            width: '260px',
            height: '260px',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full animate-spin [animation-duration:180s]"
            fill="none"
            stroke="#1E40AF"
            strokeOpacity={0.35}
          >
            <circle cx="100" cy="100" r="92" strokeWidth="1.6" />
            <circle cx="100" cy="100" r="86" strokeWidth="0.75" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="22" strokeWidth="1.6" />
            <circle cx="100" cy="100" r="5" fill="#1E40AF" fillOpacity={0.35} />
            {[0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345].map((deg) => (
              <line
                key={deg}
                x1="100" y1="100" x2="100" y2="12"
                strokeWidth="1.1" strokeLinecap="round"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>
        </div>

        {/* ── 4. INDIA MAP — muted navy-blue, low opacity ── */}
        <div
          className="absolute right-0 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 w-full lg:w-3/5 h-[85%] flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.30 }}
        >
          <IndiaBackgroundMap
            outlineColor="rgba(43,113,156,0.85)"
            strokeWidth={1.2}
            className="w-full h-full object-contain"
          />
        </div>

        {/* ── 5. HERITAGE MONUMENTS — thin muted cyan line art ── */}
        <div
          className="absolute -bottom-2 left-0 sm:left-4 lg:left-8 w-[260px] sm:w-[360px] lg:w-[460px] h-[160px] sm:h-[210px] lg:h-[270px] pointer-events-none select-none z-0"
          style={{ opacity: 0.20 }}
        >
          <HeritageLandmarksSketch theme="dark" className="w-full h-full" />
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════
     LIGHT THEME — Unchanged from original design
     ════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none transition-colors duration-700 bg-[#FFFFFF]"
    >
      {/* ── 1. BASE CANVAS ── */}
      <div className="absolute inset-0 bg-[#FFFFFF]" />
      {/* Subtle micro dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.18)_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-10" />

      {/* ── 2. TOP-LEFT: FLOWING 3D INDIAN TRICOLOUR RIBBON WAVE ── */}
      <div className="absolute -top-4 -left-4 w-[400px] sm:w-[520px] lg:w-[680px] h-[260px] sm:h-[350px] lg:h-[450px] pointer-events-none">
        <svg viewBox="0 0 680 450" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveSaffronTL" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FF7700" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FF9933" stopOpacity="0.90" />
              <stop offset="70%" stopColor="#FFA64D" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveWhiteTL" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.92" />
              <stop offset="75%" stopColor="#F8FAFC" stopOpacity="0.70" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveGreenTL" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#117A07" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#138808" stopOpacity="0.90" />
              <stop offset="70%" stopColor="#22C55E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#138808" stopOpacity="0.0" />
            </linearGradient>
            <filter id="ribbonShadowTL" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>
          <g filter="url(#ribbonShadowTL)">
            <path d="M 0,0 C 190,25 360,110 510,245 C 440,215 290,110 0,55 Z" fill="url(#waveSaffronTL)" />
            <path d="M 0,50 C 290,105 440,210 510,242 C 450,255 280,150 0,102 Z" fill="url(#waveWhiteTL)" />
            <path d="M 0,98 C 280,145 450,252 510,240 C 420,325 230,215 0,158 Z" fill="url(#waveGreenTL)" />
          </g>
        </svg>
      </div>

      {/* Saffron Ambient Light Glow - Top-Left */}
      <div
        className="absolute -top-[10%] -left-[6%] w-[50%] h-[45%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 25% 25%, rgba(255,153,51,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── 3. BOTTOM-RIGHT: FLOWING 3D INDIAN TRICOLOUR RIBBON WAVE ── */}
      <div className="absolute -bottom-4 -right-4 w-[400px] sm:w-[520px] lg:w-[700px] h-[260px] sm:h-[360px] lg:h-[460px] pointer-events-none">
        <svg viewBox="0 0 700 460" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGreenBR" x1="100%" y1="100%" x2="0%" y2="20%">
              <stop offset="0%" stopColor="#117A07" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#138808" stopOpacity="0.90" />
              <stop offset="70%" stopColor="#22C55E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#138808" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveWhiteBR" x1="100%" y1="100%" x2="0%" y2="20%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.92" />
              <stop offset="75%" stopColor="#F8FAFC" stopOpacity="0.70" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveSaffronBR" x1="100%" y1="100%" x2="0%" y2="20%">
              <stop offset="0%" stopColor="#FF7700" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FF9933" stopOpacity="0.90" />
              <stop offset="70%" stopColor="#FFA64D" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0.0" />
            </linearGradient>
            <filter id="ribbonShadowBR" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="-2" dy="-4" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>
          <g filter="url(#ribbonShadowBR)">
            <path d="M 700,460 C 510,435 340,350 190,210 C 260,240 410,350 700,405 Z" fill="url(#waveGreenBR)" />
            <path d="M 700,410 C 410,355 260,250 190,215 C 250,200 420,310 700,358 Z" fill="url(#waveWhiteBR)" />
            <path d="M 700,362 C 420,315 250,205 190,220 C 280,130 470,245 700,302 Z" fill="url(#waveSaffronBR)" />
          </g>
        </svg>
      </div>

      {/* Indian Green Ambient Light Glow - Bottom-Right */}
      <div
        className="absolute -bottom-[10%] -right-[6%] w-[50%] h-[45%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 75% 75%, rgba(19,136,8,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── 4. ASHOKA CHAKRA WATERMARK (Bottom-Right Area) ── */}
      <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] pointer-events-none z-0">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-spin [animation-duration:180s] opacity-[0.20] text-[#000080]"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="100" cy="100" r="92" strokeWidth="1.8" />
          <circle cx="100" cy="100" r="86" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="22" strokeWidth="1.8" />
          <circle cx="100" cy="100" r="5" fill="currentColor" />
          {[0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345].map((deg) => (
            <line
              key={deg}
              x1="100" y1="100" x2="100" y2="12"
              strokeWidth="1.1" strokeLinecap="round"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* ── 5. INDIA MAP OUTLINE (Center-Right behind SWAGAT card) ── */}
      <div className="absolute right-0 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 w-full lg:w-3/5 h-[85%] flex items-center justify-center pointer-events-none transition-opacity duration-500">
        <IndiaBackgroundMap
          outlineColor="rgba(2,132,199,0.38)"
          strokeWidth={1.4}
          className="w-full h-full object-contain"
        />
      </div>

      {/* ── 6. BOTTOM-LEFT: INDIA GATE HERITAGE MONUMENT ── */}
      <div className="absolute -bottom-2 left-0 sm:left-4 lg:left-8 w-[320px] sm:w-[440px] lg:w-[560px] h-[200px] sm:h-[260px] lg:h-[330px] pointer-events-none select-none z-0">
        <HeritageLandmarksSketch theme="light" className="w-full h-full" />
      </div>
    </div>
  );
};
