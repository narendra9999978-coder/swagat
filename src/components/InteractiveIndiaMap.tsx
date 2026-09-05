import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Building2, ShieldCheck, MapPin } from 'lucide-react';
import { allIndianStatesList, getStateDataByCode } from '../data/indiaStatesData';

interface InteractiveIndiaMapProps {
  onSelectState?: (stateName: string, stateCode: string) => void;
  selectedStateName?: string;
  isHeroBackground?: boolean;
}

interface StateNode {
  code: string;
  name: string;
  x: number;
  y: number;
  approvals: number;
  hubName: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'NorthEast';
}

// Major hub coordinates calibrated accurately on India's geographic grid
const stateHubNodes: StateNode[] = [
  // North
  { code: 'LA', name: 'Ladakh', x: 410, y: 130, approvals: 65, hubName: 'Leh', region: 'North' },
  { code: 'JK', name: 'Jammu and Kashmir', x: 320, y: 140, approvals: 110, hubName: 'Srinagar / Jammu', region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', x: 360, y: 195, approvals: 104, hubName: 'Shimla / Baddi', region: 'North' },
  { code: 'PB', name: 'Punjab', x: 310, y: 225, approvals: 124, hubName: 'Ludhiana / Mohali', region: 'North' },
  { code: 'CH', name: 'Chandigarh', x: 335, y: 220, approvals: 92, hubName: 'IT Park', region: 'North' },
  { code: 'UK', name: 'Uttarakhand', x: 420, y: 230, approvals: 108, hubName: 'Dehradun / Pantnagar', region: 'North' },
  { code: 'HR', name: 'Haryana', x: 340, y: 270, approvals: 138, hubName: 'Gurugram / Manesar', region: 'North' },
  { code: 'DL', name: 'Delhi', x: 365, y: 280, approvals: 135, hubName: 'NCR Hub', region: 'North' },
  { code: 'UP', name: 'Uttar Pradesh', x: 460, y: 320, approvals: 152, hubName: 'Noida / Lucknow', region: 'North' },
  { code: 'RJ', name: 'Rajasthan', x: 280, y: 340, approvals: 132, hubName: 'Jaipur / Bhiwadi', region: 'North' },

  // West
  { code: 'GJ', name: 'Gujarat', x: 200, y: 480, approvals: 146, hubName: 'Ahmedabad / GIFT City', region: 'West' },
  { code: 'MP', name: 'Madhya Pradesh', x: 390, y: 430, approvals: 130, hubName: 'Indore / Pithampur', region: 'Central' },
  { code: 'MH', name: 'Maharashtra', x: 310, y: 550, approvals: 148, hubName: 'Mumbai / Pune', region: 'West' },
  { code: 'GA', name: 'Goa', x: 275, y: 660, approvals: 96, hubName: 'Panaji / Verna', region: 'West' },

  // South
  { code: 'KA', name: 'Karnataka', x: 330, y: 680, approvals: 142, hubName: 'Bengaluru / Electronic City', region: 'South' },
  { code: 'TS', name: 'Telangana', x: 410, y: 570, approvals: 139, hubName: 'Hyderabad / Genome Valley', region: 'South' },
  { code: 'AP', name: 'Andhra Pradesh', x: 440, y: 670, approvals: 134, hubName: 'Visakhapatnam / Sri City', region: 'South' },
  { code: 'TN', name: 'Tamil Nadu', x: 390, y: 790, approvals: 145, hubName: 'Chennai / Sriperumbudur', region: 'South' },
  { code: 'KL', name: 'Kerala', x: 340, y: 815, approvals: 118, hubName: 'Kochi / Technopark', region: 'South' },
  { code: 'PY', name: 'Puducherry', x: 420, y: 770, approvals: 89, hubName: 'Puducherry Hub', region: 'South' },

  // East & Central
  { code: 'BR', name: 'Bihar', x: 550, y: 355, approvals: 118, hubName: 'Patna / Bihta', region: 'East' },
  { code: 'JH', name: 'Jharkhand', x: 550, y: 420, approvals: 116, hubName: 'Ranchi / Jamshedpur', region: 'East' },
  { code: 'OD', name: 'Odisha', x: 540, y: 510, approvals: 126, hubName: 'Bhubaneswar / Paradip', region: 'East' },
  { code: 'CG', name: 'Chhattisgarh', x: 470, y: 490, approvals: 122, hubName: 'Raipur / Bhilai', region: 'Central' },
  { code: 'WB', name: 'West Bengal', x: 610, y: 440, approvals: 128, hubName: 'Kolkata / Haldia', region: 'East' },

  // North-East
  { code: 'SK', name: 'Sikkim', x: 690, y: 340, approvals: 84, hubName: 'Gangtok', region: 'NorthEast' },
  { code: 'AS', name: 'Assam', x: 770, y: 370, approvals: 112, hubName: 'Guwahati / Numaligarh', region: 'NorthEast' },
  { code: 'AR', name: 'Arunachal Pradesh', x: 840, y: 295, approvals: 88, hubName: 'Itanagar', region: 'NorthEast' },
  { code: 'ML', name: 'Meghalaya', x: 730, y: 390, approvals: 86, hubName: 'Shillong', region: 'NorthEast' },
  { code: 'TR', name: 'Tripura', x: 790, y: 460, approvals: 85, hubName: 'Agartala', region: 'NorthEast' },
  { code: 'MN', name: 'Manipur', x: 840, y: 410, approvals: 82, hubName: 'Imphal', region: 'NorthEast' },
  { code: 'NL', name: 'Nagaland', x: 850, y: 360, approvals: 78, hubName: 'Kohima', region: 'NorthEast' },
  { code: 'MZ', name: 'Mizoram', x: 825, y: 470, approvals: 80, hubName: 'Aizawl', region: 'NorthEast' },
  { code: 'AN', name: 'Andaman & Nicobar', x: 760, y: 730, approvals: 58, hubName: 'Port Blair', region: 'South' },
  { code: 'LD', name: 'Lakshadweep', x: 232, y: 765, approvals: 45, hubName: 'Kavaratti', region: 'South' }
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  onSelectState,
  selectedStateName,
  isHeroBackground = false
}) => {
  const [hoveredNode, setHoveredNode] = useState<StateNode | null>(null);

  const handleStateClick = (node: StateNode) => {
    if (onSelectState) {
      onSelectState(node.name, node.code);
    }
  };

  return (
    <div className={`relative select-none ${isHeroBackground ? 'w-full h-full' : 'w-full max-w-2xl mx-auto'}`}>
      
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Solid Hero Map Gradient */}
          <linearGradient id="solidHeroMapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#0e2a47" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#071d33" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="mapOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.75" />
          </linearGradient>

          <filter id="solidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="15" stdDeviation="25" floodColor="#0284C7" floodOpacity="0.35" />
          </filter>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Solid Official Silhouette Map */}
        <path
          d="
            M 310 80
            C 285 80, 260 95, 255 110
            C 250 120, 265 125, 280 135
            C 295 145, 290 160, 280 175
            C 275 185, 295 210, 305 215
            C 315 220, 310 235, 300 245
            C 275 270, 260 295, 245 315
            C 230 335, 205 340, 205 355
            C 205 365, 175 385, 180 420
            C 185 440, 210 445, 210 455
            C 210 460, 170 455, 140 465
            C 130 470, 135 510, 160 545
            C 185 570, 220 570, 245 545
            C 255 530, 255 515, 245 515
            C 260 550, 255 595, 260 640
            C 270 680, 295 725, 315 770
            C 335 810, 360 850, 368 895
            C 375 920, 385 938, 395 940
            C 410 940, 420 925, 440 905
            C 455 895, 455 870, 470 870
            C 485 870, 480 830, 485 810
            C 475 780, 475 755, 480 722
            C 490 718, 505 715, 540 700
            C 590 650, 640 590, 665 560
            C 685 525, 715 525, 725 500
            C 730 475, 710 460, 690 425
            C 685 410, 725 410, 770 415
            C 770 440, 775 470, 790 485
            C 800 495, 810 480, 815 445
            C 815 445, 815 480, 825 495
            C 835 505, 845 485, 850 435
            C 855 385, 855 350, 905 330
            C 910 320, 900 310, 875 305
            C 860 270, 835 270, 825 280
            C 800 320, 765 360, 725 360
            C 705 355, 705 320, 695 320
            C 680 320, 680 375, 640 365
            C 560 335, 475 275, 460 255
            C 430 205, 420 175, 445 135
            C 450 115, 440 105, 410 110
            C 380 115, 340 80, 310 80 Z
          "
          stroke="url(#mapOutlineGrad)"
          strokeWidth={isHeroBackground ? '4' : '3.5'}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isHeroBackground ? 'url(#solidHeroMapFill)' : '#07182C'}
          filter={isHeroBackground ? 'url(#solidGlow)' : undefined}
          className="transition-all duration-500"
        />

        {/* In Hero Background: Show only the clean, solid map */}
        {!isHeroBackground && (
          <>
            {/* Digital Circuit Lines Connecting Key Industrial Hubs */}
            <g stroke="url(#circuitGrad)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse">
              {/* North Corridor */}
              <line x1="365" y1="280" x2="310" y2="225" />
              <line x1="365" y1="280" x2="460" y2="320" />
              <line x1="365" y1="280" x2="280" y2="340" />
              <line x1="365" y1="280" x2="360" y2="195" />
              <line x1="360" y1="195" x2="320" y2="140" />
              <line x1="320" y1="140" x2="410" y2="130" />

              {/* West Corridor: Delhi - Rajasthan - Gujarat - Maharashtra */}
              <line x1="280" y1="340" x2="200" y2="480" />
              <line x1="200" y1="480" x2="310" y2="550" />
              <line x1="365" y1="280" x2="390" y2="430" />
              <line x1="390" y1="430" x2="310" y2="550" />

              {/* Central-East Corridor: UP to Bihar, Bengal & Northeast */}
              <line x1="460" y1="320" x2="550" y2="355" />
              <line x1="550" y1="355" x2="610" y2="440" />
              <line x1="610" y1="440" x2="540" y2="510" />
              <line x1="610" y1="440" x2="770" y2="370" />
              <line x1="770" y1="370" x2="840" y2="295" />
              <line x1="770" y1="370" x2="850" y2="360" />
              <line x1="770" y1="370" x2="730" y2="390" />
              <line x1="730" y1="390" x2="790" y2="460" />

              {/* South Corridor: Maharashtra - Hyderabad - Bengaluru - Chennai - Kerala */}
              <line x1="310" y1="550" x2="410" y2="570" />
              <line x1="310" y1="550" x2="330" y2="680" />
              <line x1="410" y1="570" x2="330" y2="680" />
              <line x1="410" y1="570" x2="440" y2="670" />
              <line x1="330" y1="680" x2="390" y2="790" />
              <line x1="330" y1="680" x2="340" y2="815" />
              <line x1="390" y1="790" x2="340" y2="815" />
              <line x1="330" y1="680" x2="275" y2="660" />
            </g>

            {/* Central Geometric Ashoka Chakra Ambient Watermark */}
            <g opacity={0.12} transform="translate(420, 480)">
              <circle r="90" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <circle r="25" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
              {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="25"
                  x2="0"
                  y2="90"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>

            {/* Interactive State Hub Nodes */}
            {stateHubNodes.map((node) => {
              const isSelected = selectedStateName === node.name;
              const isHovered = hoveredNode?.code === node.code;

              return (
                <g
                  key={node.code}
                  className="cursor-pointer transition-transform duration-200 group"
                  onClick={() => handleStateClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Pulsing ring for active or hovered nodes */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill="none"
                      stroke="#FF9933"
                      strokeWidth="2"
                      className="animate-ping origin-center opacity-75"
                    />
                  )}

                  {/* Outer halo */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered || isSelected ? '12' : '8'}
                    fill={
                      isSelected
                        ? '#FF9933'
                        : isHovered
                        ? '#38BDF8'
                        : '#0D2F57'
                    }
                    stroke={isSelected ? '#FFFFFF' : '#38BDF8'}
                    strokeWidth="2"
                    filter={isHovered || isSelected ? 'url(#nodeGlow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Center Dot */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="3.5"
                    fill={isSelected ? '#07182C' : isHovered ? '#FFFFFF' : '#34D399'}
                  />

                  {/* State Abbreviation Badge */}
                  <text
                    x={node.x}
                    y={node.y - 14}
                    textAnchor="middle"
                    className={`text-[11px] font-extrabold select-none transition-all ${
                      isSelected
                        ? 'fill-amber-300 font-black text-[13px]'
                        : isHovered
                        ? 'fill-white font-bold'
                        : 'fill-slate-300 opacity-80 text-[10px]'
                    }`}
                  >
                    {node.code}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* Dynamic Tooltip on Hover */}
        {hoveredNode && !isHeroBackground && (
          <g transform={`translate(${Math.min(hoveredNode.x + 15, 600)}, ${hoveredNode.y - 45})`}>
            <rect
              width="180"
              height="60"
              rx="12"
              fill="#06152B"
              stroke="#38BDF8"
              strokeWidth="1.5"
              filter="url(#nodeGlow)"
            />
            <text x="14" y="24" className="fill-white font-extrabold text-[13px]">
              {hoveredNode.name}
            </text>
            <text x="14" y="44" className="fill-amber-400 font-bold text-[11px]">
              ★ {hoveredNode.approvals} Available Approvals
            </text>
          </g>
        )}
      </svg>

      {/* Floating State Info Drawer if a state is selected and not in hero mode */}
      {!isHeroBackground && hoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-slate-900/90 backdrop-blur-md border border-sky-400/40 rounded-2xl p-4 text-white shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              {hoveredNode.region} Zone • Single Window Hub
            </div>
            <div className="text-base font-extrabold text-white flex items-center space-x-2">
              <span>{hoveredNode.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {hoveredNode.approvals} Approvals
              </span>
            </div>
            <div className="text-xs text-slate-300">
              Key Industrial Hub: <strong>{hoveredNode.hubName}</strong>
            </div>
          </div>

          <button
            onClick={() => handleStateClick(hoveredNode)}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5 shrink-0"
          >
            <span>Explore Clearances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
