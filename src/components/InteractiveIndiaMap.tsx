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

// Major hub coordinates scaled on a 800x900 coordinate space of India
const stateHubNodes: StateNode[] = [
  // North
  { code: 'JK', name: 'Jammu and Kashmir', x: 330, y: 140, approvals: 110, hubName: 'Srinagar / Jammu', region: 'North' },
  { code: 'LA', name: 'Ladakh', x: 420, y: 120, approvals: 65, hubName: 'Leh', region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', x: 360, y: 190, approvals: 104, hubName: 'Shimla / Baddi', region: 'North' },
  { code: 'PB', name: 'Punjab', x: 320, y: 220, approvals: 124, hubName: 'Ludhiana / Mohali', region: 'North' },
  { code: 'CH', name: 'Chandigarh', x: 345, y: 220, approvals: 92, hubName: 'IT Park', region: 'North' },
  { code: 'UK', name: 'Uttarakhand', x: 420, y: 220, approvals: 108, hubName: 'Dehradun / Pantnagar', region: 'North' },
  { code: 'HR', name: 'Haryana', x: 340, y: 260, approvals: 138, hubName: 'Gurugram / Manesar', region: 'North' },
  { code: 'DL', name: 'Delhi', x: 365, y: 275, approvals: 135, hubName: 'NCR Hub', region: 'North' },
  { code: 'UP', name: 'Uttar Pradesh', x: 460, y: 310, approvals: 152, hubName: 'Noida / Lucknow', region: 'North' },
  { code: 'RJ', name: 'Rajasthan', x: 260, y: 320, approvals: 132, hubName: 'Jaipur / Bhiwadi', region: 'North' },

  // West
  { code: 'GJ', name: 'Gujarat', x: 200, y: 410, approvals: 146, hubName: 'Ahmedabad / GIFT City', region: 'West' },
  { code: 'MP', name: 'Madhya Pradesh', x: 390, y: 420, approvals: 130, hubName: 'Indore / Pithampur', region: 'Central' },
  { code: 'MH', name: 'Maharashtra', x: 280, y: 520, approvals: 148, hubName: 'Mumbai / Pune', region: 'West' },
  { code: 'GA', name: 'Goa', x: 255, y: 645, approvals: 96, hubName: 'Panaji / Verna', region: 'West' },

  // South
  { code: 'KA', name: 'Karnataka', x: 310, y: 650, approvals: 142, hubName: 'Bengaluru / Electronic City', region: 'South' },
  { code: 'TS', name: 'Telangana', x: 390, y: 550, approvals: 139, hubName: 'Hyderabad / Genome Valley', region: 'South' },
  { code: 'AP', name: 'Andhra Pradesh', x: 410, y: 630, approvals: 134, hubName: 'Visakhapatnam / Sri City', region: 'South' },
  { code: 'TN', name: 'Tamil Nadu', x: 360, y: 740, approvals: 145, hubName: 'Chennai / Sriperumbudur', region: 'South' },
  { code: 'KL', name: 'Kerala', x: 310, y: 770, approvals: 118, hubName: 'Kochi / Technopark', region: 'South' },
  { code: 'PY', name: 'Puducherry', x: 400, y: 740, approvals: 89, hubName: 'Puducherry Hub', region: 'South' },

  // East & Central
  { code: 'BR', name: 'Bihar', x: 570, y: 340, approvals: 118, hubName: 'Patna / Bihta', region: 'East' },
  { code: 'JH', name: 'Jharkhand', x: 560, y: 400, approvals: 116, hubName: 'Ranchi / Jamshedpur', region: 'East' },
  { code: 'OD', name: 'Odisha', x: 530, y: 480, approvals: 126, hubName: 'Bhubaneswar / Paradip', region: 'East' },
  { code: 'CG', name: 'Chhattisgarh', x: 460, y: 460, approvals: 122, hubName: 'Raipur / Bhilai', region: 'Central' },
  { code: 'WB', name: 'West Bengal', x: 620, y: 410, approvals: 128, hubName: 'Kolkata / Haldia', region: 'East' },

  // North-East
  { code: 'SK', name: 'Sikkim', x: 630, y: 295, approvals: 84, hubName: 'Gangtok', region: 'NorthEast' },
  { code: 'AS', name: 'Assam', x: 700, y: 320, approvals: 112, hubName: 'Guwahati / Numaligarh', region: 'NorthEast' },
  { code: 'AR', name: 'Arunachal Pradesh', x: 745, y: 275, approvals: 88, hubName: 'Itanagar', region: 'NorthEast' },
  { code: 'ML', name: 'Meghalaya', x: 685, y: 350, approvals: 86, hubName: 'Shillong', region: 'NorthEast' },
  { code: 'TR', name: 'Tripura', x: 685, y: 390, approvals: 85, hubName: 'Agartala', region: 'NorthEast' },
  { code: 'MN', name: 'Manipur', x: 740, y: 360, approvals: 82, hubName: 'Imphal', region: 'NorthEast' },
  { code: 'NL', name: 'Nagaland', x: 755, y: 330, approvals: 78, hubName: 'Kohima', region: 'NorthEast' },
  { code: 'MZ', name: 'Mizoram', x: 720, y: 410, approvals: 80, hubName: 'Aizawl', region: 'NorthEast' }
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
        viewBox="0 0 850 920"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mapOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#138808" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.6" />
          </linearGradient>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Geographic India Boundary (Smooth Accurate Geometric Contour) */}
        <path
          d="
            M 340 70 
            C 380 90, 430 110, 420 145 
            C 400 170, 430 190, 450 215 
            C 470 230, 520 260, 540 280 
            C 560 300, 610 270, 635 285 
            C 660 300, 710 260, 750 260 
            C 780 270, 765 320, 755 350 
            C 740 380, 735 420, 715 435 
            C 695 450, 675 390, 650 395 
            C 630 400, 620 445, 605 450 
            C 580 460, 560 520, 530 550 
            C 500 580, 470 630, 430 680 
            C 400 730, 390 790, 370 850 
            C 355 855, 340 810, 325 765 
            C 300 700, 275 640, 260 580 
            C 240 510, 220 470, 185 450 
            C 160 435, 175 390, 210 380 
            C 240 370, 235 320, 240 280 
            C 245 240, 270 210, 305 170 
            C 320 130, 310 90, 340 70 Z
          "
          stroke="url(#mapOutlineGrad)"
          strokeWidth={isHeroBackground ? '2.5' : '3'}
          fill={isHeroBackground ? 'rgba(7, 24, 44, 0.4)' : '#07182C'}
          className="transition-colors duration-500"
        />

        {/* Digital Circuit Lines Connecting Key Industrial Hubs */}
        <g stroke="url(#circuitGrad)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse">
          {/* North Corridor: Delhi to Punjab & UP */}
          <line x1="365" y1="275" x2="320" y2="220" />
          <line x1="365" y1="275" x2="460" y2="310" />
          <line x1="365" y1="275" x2="260" y2="320" />

          {/* West Corridor: Delhi - Rajasthan - Gujarat - Maharashtra */}
          <line x1="260" y1="320" x2="200" y2="410" />
          <line x1="200" y1="410" x2="280" y2="520" />
          <line x1="365" y1="275" x2="390" y2="420" />
          <line x1="390" y1="420" x2="280" y2="520" />

          {/* Central-East Corridor: UP to Bihar, Bengal & Odisha */}
          <line x1="460" y1="310" x2="570" y2="340" />
          <line x1="570" y1="340" x2="620" y2="410" />
          <line x1="620" y1="410" x2="530" y2="480" />
          <line x1="620" y1="410" x2="700" y2="320" />

          {/* South Corridor: Maharashtra - Hyderabad - Bengaluru - Chennai */}
          <line x1="280" y1="520" x2="390" y2="550" />
          <line x1="280" y1="520" x2="310" y2="650" />
          <line x1="390" y1="550" x2="310" y2="650" />
          <line x1="390" y1="550" x2="410" y2="630" />
          <line x1="310" y1="650" x2="360" y2="740" />
          <line x1="310" y1="650" x2="310" y2="770" />
          <line x1="360" y1="740" x2="310" y2="770" />
        </g>

        {/* Central Geometric Ashoka Chakra Ambient Watermark */}
        <g opacity={isHeroBackground ? 0.08 : 0.12} transform="translate(420, 480)">
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
