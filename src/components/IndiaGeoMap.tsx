/**
 * IndiaGeoMap.tsx
 *
 * Geographically accurate interactive SVG map of India.
 * Uses a simple equirectangular (cylindrical) projection with simplified
 * but geographically proportional state/UT boundaries.
 *
 * All 28 States + 8 Union Territories are represented in their
 * correct geographic positions. Northeastern states are correctly placed
 * via the Siliguri Corridor. Nepal/Bhutan gaps are empty (correct).
 */
import React, { useState, useCallback, useMemo } from 'react';
import { allIndianStatesList } from '../data/indiaStatesData';

// ─── PROJECTION ───────────────────────────────────────────────────────────────
// Equirectangular projection — well-suited for India (8°–38°N, 67.5°–97.5°E)
const SCALE = 23.8;           // pixels per geographic degree
const LNG_ORIGIN = 67.5;       // western boundary + buffer
const LAT_TOP    = 38.0;       // northern boundary + buffer

const px = (lng: number) => (lng - LNG_ORIGIN) * SCALE;
const py = (lat: number) => (LAT_TOP - lat) * SCALE;

type Coord = [number, number]; // [longitude°E, latitude°N]

/** Convert an array of [lon, lat] coords to an SVG path string (closed polygon). */
const toPath = (coords: Coord[]): string =>
  coords
    .map(([lng, lat], i) => `${i === 0 ? 'M' : 'L'}${px(lng).toFixed(1)},${py(lat).toFixed(1)}`)
    .join(' ') + ' Z';

// ─── STATE POLYGONS ───────────────────────────────────────────────────────────
// Simplified but geographically proportional boundaries.
// Each polygon: array of [longitude°E, latitude°N] pairs going clockwise.
// Derived from approximate official India administrative boundaries.
const POLYGONS: Record<string, Coord[]> = {
  // ━━ JAMMU & KASHMIR (UT) — Kashmir valley + Jammu region ━━━━━━━━━━━━━━━━━
  JK: [[73.5,37.5],[76.5,37.5],[77.5,36.5],[77.5,35.2],[77.5,33.8],[76.5,32.5],[74.5,32.5],[73.5,33.5]],

  // ━━ LADAKH (UT) — high-altitude eastern UT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LA: [[77.5,37.5],[81.0,37.5],[81.0,31.8],[78.0,31.5],[77.5,33.8],[77.5,35.2],[77.5,36.5]],

  // ━━ HIMACHAL PRADESH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HP: [[75.5,33.5],[76.5,32.5],[77.5,33.8],[78.0,31.5],[79.0,31.2],[78.5,30.5],[77.5,30.5],[76.5,30.5],[75.5,31.5]],

  // ━━ PUNJAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PB: [[73.8,32.5],[75.5,33.5],[75.5,31.5],[76.5,30.5],[75.5,29.5],[74.5,29.5],[73.8,30.0]],

  // ━━ CHANDIGARH (UT) — tiny city territory ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CH: [[76.63,30.88],[76.88,30.88],[76.88,30.60],[76.63,30.60]],

  // ━━ UTTARAKHAND — Himalayan state ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  UK: [[77.5,30.5],[78.5,30.5],[79.0,31.2],[80.5,31.0],[81.0,30.2],[80.5,29.0],[79.0,29.0],[78.5,29.5]],

  // ━━ HARYANA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HR: [[73.8,30.0],[74.5,29.5],[75.5,29.5],[76.5,30.5],[77.5,30.5],[78.5,29.5],[78.0,28.2],[77.0,27.5],[75.0,27.5],[74.0,28.0]],

  // ━━ DELHI (UT) — National Capital Territory ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DL: [[76.90,28.90],[77.35,28.90],[77.35,28.40],[76.90,28.40]],

  // ━━ UTTAR PRADESH — largest state by population ━━━━━━━━━━━━━━━━━━━━━━━━━━
  UP: [[77.0,27.5],[77.5,28.2],[78.5,29.5],[80.5,29.0],[81.0,30.2],[84.5,28.5],[84.0,27.0],[84.0,24.5],[82.0,23.5],[80.0,23.5],[78.5,24.0],[77.5,26.0]],

  // ━━ RAJASTHAN — largest state by area (Thar Desert) ━━━━━━━━━━━━━━━━━━━━━━
  RJ: [[68.0,27.0],[69.5,29.5],[73.8,30.0],[74.0,28.0],[75.0,27.5],[77.0,27.5],[76.5,24.0],[74.0,23.0],[71.0,23.0],[69.5,22.5],[68.5,24.0]],

  // ━━ GUJARAT — west coast with Saurashtra peninsula ━━━━━━━━━━━━━━━━━━━━━━
  GJ: [[68.5,24.5],[69.5,22.5],[71.0,23.0],[74.0,23.0],[76.5,24.0],[74.5,22.0],[73.5,22.5],[73.0,21.5],[72.0,21.5],[70.5,21.5],[70.0,22.5],[69.0,23.0]],

  // ━━ MADHYA PRADESH — geographic centre of India ━━━━━━━━━━━━━━━━━━━━━━━━━
  MP: [[74.0,23.5],[76.5,24.0],[77.0,27.5],[78.0,26.0],[80.0,23.5],[82.0,23.5],[82.5,22.5],[81.0,21.5],[79.0,21.0],[77.5,21.0],[76.0,21.0],[74.5,21.5]],

  // ━━ MAHARASHTRA — Deccan plateau + Mumbai coast ━━━━━━━━━━━━━━━━━━━━━━━━━
  MH: [[72.5,21.5],[73.5,22.5],[74.5,22.0],[76.5,24.0],[77.5,21.0],[79.0,21.0],[81.0,21.5],[82.5,22.5],[82.0,19.0],[79.5,18.0],[78.5,17.5],[77.5,17.5],[76.5,16.5],[75.5,16.5],[74.5,17.5],[73.5,17.5],[72.5,18.5]],

  // ━━ CHHATTISGARH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CG: [[80.0,23.5],[82.0,23.5],[82.5,22.5],[84.5,24.5],[84.5,22.5],[83.0,17.5],[82.0,18.0],[80.5,18.5]],

  // ━━ GOA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GA: [[73.7,15.8],[74.35,15.8],[74.35,14.9],[73.7,14.9]],

  // ━━ DADRA & NAGAR HAVELI AND DAMAN & DIU (UT) ━━━━━━━━━━━━━━━━━━━━━━━━━━
  DN: [[73.0,20.4],[73.35,20.4],[73.35,20.1],[73.0,20.1]],

  // ━━ JHARKHAND — eastern plateau ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  JH: [[83.5,25.5],[84.5,24.5],[86.5,24.5],[87.0,22.5],[86.5,21.5],[84.0,21.5],[82.5,22.5]],

  // ━━ BIHAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BR: [[83.5,27.5],[84.5,28.5],[87.5,27.5],[88.0,27.0],[88.0,24.5],[86.5,24.5],[84.5,24.5],[83.5,25.5]],

  // ━━ WEST BENGAL (includes Siliguri Corridor, the "chicken neck") ━━━━━━━━━
  // The narrow northern strip (88–89.5°E, 26–27.2°N) connects to Northeast India
  WB: [[86.0,22.0],[87.0,22.5],[87.0,24.0],[88.0,24.5],[88.0,27.0],[88.5,27.2],[89.5,27.2],[89.5,26.0],[88.5,25.5],[88.5,22.5],[87.5,21.5]],

  // ━━ SIKKIM — tiny mountain state (sits atop WB's Siliguri Corridor) ━━━━━
  SK: [[88.1,28.1],[88.9,28.1],[88.9,27.2],[88.5,27.2],[88.1,27.2]],

  // ━━ ODISHA — east coast state on Bay of Bengal ━━━━━━━━━━━━━━━━━━━━━━━━━
  OD: [[81.0,22.0],[82.5,22.5],[84.0,21.5],[86.5,21.5],[87.0,22.0],[87.5,21.0],[86.0,19.0],[85.0,18.5],[84.0,17.5],[83.0,17.5],[82.0,18.0],[80.5,18.5]],

  // ━━ KARNATAKA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KA: [[74.5,17.5],[76.5,16.5],[77.5,17.5],[78.5,17.5],[78.5,14.5],[77.5,12.5],[76.5,11.5],[75.5,11.5],[74.5,12.5],[74.2,14.5]],

  // ━━ TELANGANA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TS: [[77.5,19.5],[80.0,20.0],[82.0,19.0],[81.5,18.0],[80.5,17.5],[79.0,17.0],[77.5,17.5]],

  // ━━ ANDHRA PRADESH — east coast Deccan state ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AP: [[80.0,20.0],[82.0,19.0],[84.5,18.5],[85.0,17.5],[84.0,15.5],[80.5,13.5],[79.5,13.0],[78.5,14.5],[78.5,17.5],[79.0,17.0],[80.5,17.5],[81.5,18.0]],

  // ━━ TAMIL NADU — southernmost mainland state ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TN: [[78.5,13.5],[79.5,13.0],[80.5,13.5],[80.4,11.5],[79.5,9.0],[78.5,8.5],[77.0,8.5],[76.5,9.5],[76.5,11.5],[77.5,12.5]],

  // ━━ KERALA — narrow western coastal state ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KL: [[74.5,12.5],[75.5,11.5],[76.5,11.5],[76.5,9.5],[77.0,8.5],[76.5,8.5],[75.5,9.5],[74.8,11.5]],

  // ━━ PUDUCHERRY (UT) — main enclave near Tamil Nadu coast ━━━━━━━━━━━━━━━━
  PY: [[79.62,12.05],[79.95,12.05],[79.95,11.80],[79.62,11.80]],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NORTHEASTERN STATES — connected to mainland via Siliguri Corridor in WB
  // (Nepal: 80–88°E, 26.5–30°N and Bhutan: 88.8–92°E, 26.7–28.2°N are gaps)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ASSAM — Brahmaputra valley, the gateway to Northeast India
  AS: [[89.5,27.2],[91.0,27.5],[94.0,27.5],[96.1,27.0],[95.5,26.0],[96.0,25.0],[95.0,24.5],[92.5,24.0],[90.0,24.5],[89.5,25.5]],

  // ARUNACHAL PRADESH — largest NE state (borders China/Bhutan to north)
  AR: [[91.5,29.5],[97.0,29.5],[97.0,27.5],[95.0,27.5],[94.0,27.5],[91.0,27.5]],

  // MEGHALAYA — Khasi/Garo Hills plateau south of Assam
  ML: [[89.8,26.5],[92.8,26.5],[92.5,25.0],[90.0,25.0],[89.5,25.5]],

  // TRIPURA — surrounded by Bangladesh on three sides
  TR: [[91.1,24.5],[92.3,24.5],[92.3,22.9],[91.1,22.9]],

  // MIZORAM — southern NE state
  MZ: [[92.3,24.5],[93.5,24.5],[93.5,22.0],[92.3,22.0],[92.3,22.9]],

  // MANIPUR — eastern NE state
  MN: [[93.0,25.5],[94.5,25.5],[94.7,24.0],[94.0,23.5],[93.0,23.5]],

  // NAGALAND — eastern NE state, south of AR
  NL: [[93.5,27.5],[95.5,27.5],[95.5,25.5],[93.5,25.5]],
};

// Draw order: large states first (background), small/enclave states on top
const RENDER_ORDER: string[] = [
  'RJ','MP','UP','GJ','MH','AP','KA','TN','AS','AR','OD','CG','JH','WB','BR',
  'LA','JK','UK','HP','PB','HR','KL','TS','NL','MN','MZ','TR',
  'SK','ML','GA','DN','PY','CH','DL',
];

// Approximate geographic centroids [longitude, latitude] for label placement
const CENTROIDS: Record<string, Coord> = {
  JK:[75.2,35.2], LA:[79.0,34.2], HP:[77.0,31.8], PB:[74.8,31.0],
  CH:[76.76,30.74], UK:[79.5,30.1], HR:[76.0,29.0], DL:[77.12,28.65],
  UP:[81.0,26.5],  RJ:[73.0,26.0], GJ:[71.5,22.5], MP:[78.0,24.0],
  MH:[76.5,19.5],  CG:[82.0,21.0], GA:[74.1,15.4], DN:[73.15,20.25],
  JH:[85.5,23.5],  BR:[85.5,26.0], WB:[87.8,23.0], SK:[88.5,27.6],
  OD:[84.5,20.5],  KA:[76.5,15.0], TS:[79.5,18.5], AP:[81.0,16.0],
  TN:[78.5,11.0],  KL:[76.1,10.5], PY:[79.78,11.9],
  AS:[93.0,26.0],  AR:[94.0,28.5], ML:[91.3,25.8], TR:[91.7,23.7],
  MZ:[92.9,23.3],  MN:[93.8,24.7], NL:[94.5,26.5],
};

// States large enough to render a text label
const LABELED_STATES = new Set(['RJ','MP','UP','GJ','MH','AP','KA','TN','AS','AR','OD','CG','JH','WB','BR','KL','TS']);

// ─── REGION ZONE MAPPING ──────────────────────────────────────────────────────
const STATE_ZONE: Record<string, string> = {
  JK:'North', LA:'North', HP:'North', PB:'North', CH:'North',
  UK:'North', HR:'North', DL:'North', UP:'North', RJ:'North',
  GJ:'West',  GA:'West',  DN:'West',  MH:'West',
  MP:'Central', CG:'Central',
  JH:'East',  BR:'East',  WB:'East',  OD:'East',
  SK:'North East', AS:'North East', AR:'North East', ML:'North East',
  TR:'North East', MZ:'North East', MN:'North East', NL:'North East',
  KA:'South', TS:'South', AP:'South', TN:'South', KL:'South', PY:'South',
};

// ─── COLOR THEME (monitoring dashboard aesthetic) ─────────────────────────────
const ZONE_COLORS: Record<string, { base: string; hover: string; stroke: string; label: string }> = {
  'North':      { base:'#152645', hover:'#1e3d6e', stroke:'#2d5a9e', label:'#7eb8f7' },
  'West':       { base:'#142a1c', hover:'#1c4428', stroke:'#2a6640', label:'#6ee7b7' },
  'Central':    { base:'#1e1240', hover:'#2e1a62', stroke:'#4a2e9e', label:'#a78bfa' },
  'South':      { base:'#0a2535', hover:'#133d55', stroke:'#1d6a8a', label:'#38bdf8' },
  'East':       { base:'#221808', hover:'#3a2a0a', stroke:'#6a4a10', label:'#fcd34d' },
  'North East': { base:'#220812', hover:'#421018', stroke:'#8a1828', label:'#fca5a5' },
};

const SELECTED_FILL   = '#7c3e00';
const SELECTED_STROKE = '#f59e0b';
const HOVER_FILTER    = 'brightness(1.35)';
const SEL_FILTER      = 'brightness(1.1) drop-shadow(0 0 5px rgba(245,158,11,0.6))';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
interface IndiaGeoMapProps {
  onSelectState?: (stateName: string, stateCode: string) => void;
  selectedStateName?: string;
}

interface TooltipState {
  x: number;
  y: number;
  code: string;
}

export const IndiaGeoMap: React.FC<IndiaGeoMapProps> = ({
  onSelectState,
  selectedStateName,
}) => {
  const [hoveredCode, setHoveredCode]   = useState<string | null>(null);
  const [tooltip, setTooltip]           = useState<TooltipState | null>(null);

  // Map selected state name → code
  const selectedCode = useMemo(() => {
    if (!selectedStateName) return null;
    return allIndianStatesList.find(s => s.name === selectedStateName)?.code ?? null;
  }, [selectedStateName]);

  const handleClick = useCallback((code: string) => {
    const st = allIndianStatesList.find(s => s.code === code);
    if (st) onSelectState?.(st.name, st.code);
  }, [onSelectState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!hoveredCode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  }, [hoveredCode]);

  const handleStateEnter = useCallback((e: React.MouseEvent<SVGPathElement>, code: string) => {
    setHoveredCode(code);
    const rect = e.currentTarget.closest('svg')!.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, code });
  }, []);

  const handleStateLeave = useCallback(() => {
    setHoveredCode(null);
    setTooltip(null);
  }, []);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 730 760"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleStateLeave}
        aria-label="Interactive map of India showing all states and union territories"
      >
        <defs>
          {/* Map background radial gradient */}
          <radialGradient id="geoMapBg" cx="40%" cy="45%" r="65%">
            <stop offset="0%"   stopColor="#0f2340" />
            <stop offset="100%" stopColor="#060d1a" />
          </radialGradient>
          {/* Glow filter for selected/hovered */}
          <filter id="geoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Subtle clip path */}
          <clipPath id="mapClip">
            <rect x="0" y="0" width="730" height="760" rx="12" />
          </clipPath>
        </defs>

        {/* ── BACKGROUND ─────────────────────────────────────────────────── */}
        <rect width="730" height="760" fill="url(#geoMapBg)" rx="12" />

        {/* Subtle geographic grid */}
        <g opacity="0.04" stroke="#ffffff" strokeWidth="0.4">
          {[70,75,80,85,90,95].map(lng => (
            <line key={`v${lng}`} x1={px(lng)} y1={0} x2={px(lng)} y2={760} />
          ))}
          {[10,15,20,25,30,35].map(lat => (
            <line key={`h${lat}`} x1={0} y1={py(lat)} x2={730} y2={py(lat)} />
          ))}
        </g>

        {/* ── STATE PATHS ─────────────────────────────────────────────────── */}
        <g clipPath="url(#mapClip)">
          {RENDER_ORDER.map(code => {
            const coords = POLYGONS[code];
            if (!coords) return null;

            const isHov = hoveredCode === code;
            const isSel = selectedCode === code;
            const zone  = STATE_ZONE[code] ?? 'Central';
            const color = ZONE_COLORS[zone];

            const fillColor   = isSel ? SELECTED_FILL   : color.base;
            const strokeColor = isSel ? SELECTED_STROKE : isHov ? color.stroke : '#0d1e35';
            const strokeW     = isSel ? 1.8 : isHov ? 1.2 : 0.6;

            return (
              <path
                key={code}
                d={toPath(coords)}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeLinejoin="round"
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.12s ease, stroke 0.12s ease',
                  filter: isSel
                    ? SEL_FILTER
                    : isHov
                    ? HOVER_FILTER
                    : undefined,
                }}
                onMouseEnter={e => handleStateEnter(e, code)}
                onClick={() => handleClick(code)}
              />
            );
          })}
        </g>

        {/* ── STATE CODE LABELS (larger states only) ─────────────────────── */}
        {Object.entries(CENTROIDS).map(([code, [lng, lat]]) => {
          if (!LABELED_STATES.has(code)) return null;
          const isHov = hoveredCode === code;
          const isSel = selectedCode === code;
          const zone  = STATE_ZONE[code] ?? 'Central';
          const color = ZONE_COLORS[zone];
          return (
            <text
              key={`lbl-${code}`}
              x={px(lng)}
              y={py(lat)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isSel || isHov ? 7.5 : 6.5}
              fontWeight={isSel ? '700' : '500'}
              fill={isSel ? '#fbbf24' : isHov ? '#ffffff' : color.label}
              opacity={isSel || isHov ? 1 : 0.75}
              style={{ pointerEvents: 'none', userSelect: 'none', fontFamily: 'Inter, sans-serif' }}
            >
              {code}
            </text>
          );
        })}

        {/* ── ANDAMAN & NICOBAR ISLANDS INSET ────────────────────────────── */}
        <g transform="translate(598, 500)">
          <rect width="78" height="130" rx="5"
            fill="#0a1c2e" stroke="#1a2f4f" strokeWidth="0.6" opacity="0.9" />
          <text x="39" y="11" textAnchor="middle" fontSize="5" fill="#64748b"
            fontFamily="Inter, sans-serif" fontWeight="500">A&N Islands</text>
          {/* Andaman island simplified shape */}
          <ellipse cx="39" cy="50" rx="9" ry="24"
            fill={selectedCode === 'AN' ? SELECTED_FILL : ZONE_COLORS['South'].base}
            stroke={selectedCode === 'AN' ? SELECTED_STROKE : '#1d6a8a'}
            strokeWidth="0.8"
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick('AN')}
          />
          {/* Nicobar island group */}
          <ellipse cx="39" cy="98" rx="5" ry="12"
            fill={selectedCode === 'AN' ? SELECTED_FILL : ZONE_COLORS['South'].base}
            stroke={selectedCode === 'AN' ? SELECTED_STROKE : '#1d6a8a'}
            strokeWidth="0.8"
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick('AN')}
          />
          <text x="39" y="122" textAnchor="middle" fontSize="4.5" fill="#475569"
            fontFamily="Inter, sans-serif">AN</text>
        </g>

        {/* ── LAKSHADWEEP INSET ───────────────────────────────────────────── */}
        <g transform="translate(14, 548)">
          <rect width="66" height="70" rx="5"
            fill="#0a1c2e" stroke="#1a2f4f" strokeWidth="0.6" opacity="0.9" />
          <text x="33" y="11" textAnchor="middle" fontSize="5" fill="#64748b"
            fontFamily="Inter, sans-serif" fontWeight="500">Lakshadweep</text>
          <circle cx="33" cy="37" r="6"
            fill={selectedCode === 'LD' ? SELECTED_FILL : ZONE_COLORS['South'].base}
            stroke={selectedCode === 'LD' ? SELECTED_STROKE : '#1d6a8a'}
            strokeWidth="0.8"
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick('LD')}
          />
          <circle cx="20" cy="50" r="3.5"
            fill={ZONE_COLORS['South'].base} stroke="#1d6a8a" strokeWidth="0.6" />
          <circle cx="46" cy="52" r="2.5"
            fill={ZONE_COLORS['South'].base} stroke="#1d6a8a" strokeWidth="0.6" />
          <text x="33" y="64" textAnchor="middle" fontSize="4.5" fill="#475569"
            fontFamily="Inter, sans-serif">LD</text>
        </g>

        {/* ── ZONE LEGEND ─────────────────────────────────────────────────── */}
        <g transform="translate(14, 14)">
          {Object.entries(ZONE_COLORS).map(([zone, c], i) => (
            <g key={zone} transform={`translate(0, ${i * 16})`}>
              <rect width="10" height="10" rx="2" fill={c.base} stroke={c.stroke} strokeWidth="0.6" />
              <text x="14" y="8" fontSize="6.5" fill="#64748b"
                fontFamily="Inter, sans-serif">{zone}</text>
            </g>
          ))}
        </g>

        {/* ── SCALE INDICATOR ─────────────────────────────────────────────── */}
        <g transform="translate(580, 740)">
          <line x1="0" y1="0" x2={SCALE * 5} y2="0" stroke="#334155" strokeWidth="1" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#334155" strokeWidth="0.8" />
          <line x1={SCALE * 5} y1="-3" x2={SCALE * 5} y2="3" stroke="#334155" strokeWidth="0.8" />
          <text x={SCALE * 2.5} y="-5" textAnchor="middle" fontSize="5" fill="#475569"
            fontFamily="Inter, sans-serif">≈ 5° / ~550 km</text>
        </g>
      </svg>

      {/* ── HOVER TOOLTIP ──────────────────────────────────────────────────── */}
      {tooltip && (() => {
        const st = allIndianStatesList.find(s => s.code === tooltip.code);
        if (!st) return null;
        const zone = STATE_ZONE[tooltip.code] ?? 'Central';
        const color = ZONE_COLORS[zone];
        return (
          <div
            style={{
              position: 'absolute',
              left: Math.min(tooltip.x + 14, 560),
              top: Math.max(tooltip.y - 48, 4),
              pointerEvents: 'none',
              zIndex: 30,
            }}
            className="bg-slate-900/95 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: color.stroke }}
              />
              <span className="text-xs font-bold text-white leading-tight">{st.name}</span>
              <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {st.code}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-amber-400 font-semibold">
                {st.approvalCount} Clearances
              </span>
              <span className="text-slate-500">{st.type}</span>
              <span className="text-slate-500">{st.zone}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
