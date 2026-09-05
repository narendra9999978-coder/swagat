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
  { code: 'LA', name: 'Ladakh', x: 400, y: 110, approvals: 65, hubName: 'Leh', region: 'North' },
  { code: 'JK', name: 'Jammu and Kashmir', x: 330, y: 135, approvals: 110, hubName: 'Srinagar / Jammu', region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', x: 360, y: 185, approvals: 104, hubName: 'Shimla / Baddi', region: 'North' },
  { code: 'PB', name: 'Punjab', x: 305, y: 215, approvals: 124, hubName: 'Ludhiana / Mohali', region: 'North' },
  { code: 'CH', name: 'Chandigarh', x: 335, y: 210, approvals: 92, hubName: 'IT Park', region: 'North' },
  { code: 'UK', name: 'Uttarakhand', x: 405, y: 215, approvals: 108, hubName: 'Dehradun / Pantnagar', region: 'North' },
  { code: 'HR', name: 'Haryana', x: 330, y: 255, approvals: 138, hubName: 'Gurugram / Manesar', region: 'North' },
  { code: 'DL', name: 'Delhi', x: 355, y: 265, approvals: 135, hubName: 'NCR Hub', region: 'North' },
  { code: 'UP', name: 'Uttar Pradesh', x: 440, y: 295, approvals: 152, hubName: 'Noida / Lucknow', region: 'North' },
  { code: 'RJ', name: 'Rajasthan', x: 260, y: 315, approvals: 132, hubName: 'Jaipur / Bhiwadi', region: 'North' },

  // West
  { code: 'GJ', name: 'Gujarat', x: 195, y: 435, approvals: 146, hubName: 'Ahmedabad / GIFT City', region: 'West' },
  { code: 'MP', name: 'Madhya Pradesh', x: 375, y: 405, approvals: 130, hubName: 'Indore / Pithampur', region: 'Central' },
  { code: 'MH', name: 'Maharashtra', x: 295, y: 525, approvals: 148, hubName: 'Mumbai / Pune', region: 'West' },
  { code: 'GA', name: 'Goa', x: 265, y: 625, approvals: 96, hubName: 'Panaji / Verna', region: 'West' },

  // South
  { code: 'KA', name: 'Karnataka', x: 315, y: 645, approvals: 142, hubName: 'Bengaluru / Electronic City', region: 'South' },
  { code: 'TS', name: 'Telangana', x: 385, y: 545, approvals: 139, hubName: 'Hyderabad / Genome Valley', region: 'South' },
  { code: 'AP', name: 'Andhra Pradesh', x: 415, y: 635, approvals: 134, hubName: 'Visakhapatnam / Sri City', region: 'South' },
  { code: 'TN', name: 'Tamil Nadu', x: 365, y: 740, approvals: 145, hubName: 'Chennai / Sriperumbudur', region: 'South' },
  { code: 'KL', name: 'Kerala', x: 320, y: 765, approvals: 118, hubName: 'Kochi / Technopark', region: 'South' },
  { code: 'PY', name: 'Puducherry', x: 395, y: 725, approvals: 89, hubName: 'Puducherry Hub', region: 'South' },

  // East & Central
  { code: 'BR', name: 'Bihar', x: 535, y: 335, approvals: 118, hubName: 'Patna / Bihta', region: 'East' },
  { code: 'JH', name: 'Jharkhand', x: 530, y: 395, approvals: 116, hubName: 'Ranchi / Jamshedpur', region: 'East' },
  { code: 'OD', name: 'Odisha', x: 505, y: 485, approvals: 126, hubName: 'Bhubaneswar / Paradip', region: 'East' },
  { code: 'CG', name: 'Chhattisgarh', x: 445, y: 470, approvals: 122, hubName: 'Raipur / Bhilai', region: 'Central' },
  { code: 'WB', name: 'West Bengal', x: 585, y: 420, approvals: 128, hubName: 'Kolkata / Haldia', region: 'East' },

  // North-East
  { code: 'SK', name: 'Sikkim', x: 595, y: 275, approvals: 84, hubName: 'Gangtok', region: 'NorthEast' },
  { code: 'AS', name: 'Assam', x: 680, y: 330, approvals: 112, hubName: 'Guwahati / Numaligarh', region: 'NorthEast' },
  { code: 'AR', name: 'Arunachal Pradesh', x: 745, y: 265, approvals: 88, hubName: 'Itanagar', region: 'NorthEast' },
  { code: 'ML', name: 'Meghalaya', x: 660, y: 355, approvals: 86, hubName: 'Shillong', region: 'NorthEast' },
  { code: 'TR', name: 'Tripura', x: 680, y: 405, approvals: 85, hubName: 'Agartala', region: 'NorthEast' },
  { code: 'MN', name: 'Manipur', x: 745, y: 375, approvals: 82, hubName: 'Imphal', region: 'NorthEast' },
  { code: 'NL', name: 'Nagaland', x: 755, y: 335, approvals: 78, hubName: 'Kohima', region: 'NorthEast' },
  { code: 'MZ', name: 'Mizoram', x: 720, y: 430, approvals: 80, hubName: 'Aizawl', region: 'NorthEast' },
  { code: 'AN', name: 'Andaman & Nicobar', x: 746, y: 730, approvals: 58, hubName: 'Port Blair', region: 'South' },
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
        viewBox="0 0 850 920"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mapOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#0284C7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#138808" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.7" />
          </linearGradient>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Geographic Sovereign India Boundary (Accurate Official Survey of India Contour) */}
        <path
          d="
            M 350 48
            C 375 42, 410 52, 432 78
            C 450 98, 458 130, 442 162
            C 428 185, 435 208, 422 228
            C 440 238, 462 258, 452 272
            C 482 278, 520 300, 562 318
            C 572 308, 582 268, 595 264
            C 608 264, 616 280, 612 305
            C 632 304, 660 308, 676 298
            C 700 282, 735 244, 770 248
            C 802 256, 816 282, 796 312
            C 786 332, 772 352, 766 376
            C 762 392, 756 414, 746 438
            C 736 462, 722 485, 712 474
            C 704 452, 706 426, 694 416
            C 684 416, 674 436, 664 422
            C 672 394, 684 382, 672 368
            C 652 374, 622 374, 602 362
            C 594 378, 598 416, 618 440
            C 614 466, 594 476, 578 472
            C 564 478, 546 500, 526 524
            C 498 564, 478 600, 458 636
            C 438 672, 418 708, 404 732
            C 394 766, 384 796, 372 812
            C 362 828, 352 840, 344 848
            C 336 842, 326 816, 316 778
            C 304 732, 294 698, 284 658
            C 274 632, 264 612, 258 568
            C 248 522, 244 478, 238 458
            C 228 454, 214 466, 194 476
            C 168 472, 154 446, 158 420
            C 184 410, 194 404, 168 398
            C 138 392, 134 372, 154 362
            C 178 358, 208 352, 224 342
            C 218 328, 204 312, 218 282
            C 244 258, 264 238, 288 218
            C 304 192, 298 172, 288 148
            C 298 122, 308 96, 328 72
            C 338 56, 346 50, 350 48 Z
          "
          stroke="url(#mapOutlineGrad)"
          strokeWidth={isHeroBackground ? '2.5' : '3'}
          fill={isHeroBackground ? 'rgba(7, 24, 44, 0.45)' : '#07182C'}
          className="transition-colors duration-500"
        />

        {/* Andaman & Nicobar Islands (Accurate Archipelagos) */}
        <g stroke="url(#mapOutlineGrad)" strokeWidth="2" fill={isHeroBackground ? 'rgba(7, 24, 44, 0.5)' : '#07182C'}>
          {/* North & Middle Andaman */}
          <path d="M 742 660 C 746 655, 752 660, 750 680 C 748 695, 742 710, 740 705 C 738 690, 740 670, 742 660 Z" />
          {/* South Andaman */}
          <path d="M 740 720 C 744 716, 748 722, 746 738 C 744 750, 738 752, 736 742 C 735 730, 738 722, 740 720 Z" />
          {/* Little Andaman */}
          <path d="M 738 765 C 742 762, 745 768, 743 778 C 741 784, 736 784, 735 776 C 734 770, 736 766, 738 765 Z" />
          {/* Nicobar Islands */}
          <path d="M 748 805 C 753 800, 758 808, 755 822 C 752 836, 745 842, 742 830 C 740 818, 744 808, 748 805 Z" />
          <path d="M 752 855 C 756 850, 762 858, 759 872 C 756 882, 750 885, 747 876 C 745 866, 749 858, 752 855 Z" />
        </g>

        {/* Lakshadweep Islands */}
        <g stroke="url(#mapOutlineGrad)" strokeWidth="2" fill={isHeroBackground ? 'rgba(7, 24, 44, 0.5)' : '#07182C'}>
          <path d="M 235 735 C 238 732, 242 736, 240 746 C 238 752, 234 752, 233 746 C 232 740, 234 736, 235 735 Z" />
          <path d="M 230 760 C 233 757, 237 761, 235 770 C 233 775, 229 775, 228 770 C 227 764, 229 761, 230 760 Z" />
          <path d="M 228 785 C 231 782, 235 786, 233 795 C 231 800, 227 800, 226 795 C 225 790, 227 786, 228 785 Z" />
          <path d="M 240 830 C 243 827, 247 831, 245 840 C 243 845, 239 845, 238 840 C 237 835, 239 831, 240 830 Z" />
        </g>

        {/* Digital Circuit Lines Connecting Key Industrial Hubs */}
        <g stroke="url(#circuitGrad)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse">
          {/* North Corridor */}
          <line x1="355" y1="265" x2="305" y2="215" />
          <line x1="355" y1="265" x2="440" y2="295" />
          <line x1="355" y1="265" x2="260" y2="315" />
          <line x1="355" y1="265" x2="360" y2="185" />
          <line x1="360" y1="185" x2="330" y2="135" />
          <line x1="330" y1="135" x2="400" y2="110" />

          {/* West Corridor: Delhi - Rajasthan - Gujarat - Maharashtra */}
          <line x1="260" y1="315" x2="195" y2="435" />
          <line x1="195" y1="435" x2="295" y2="525" />
          <line x1="355" y1="265" x2="375" y2="405" />
          <line x1="375" y1="405" x2="295" y2="525" />

          {/* Central-East Corridor: UP to Bihar, Bengal & Northeast */}
          <line x1="440" y1="295" x2="535" y2="335" />
          <line x1="535" y1="335" x2="585" y2="420" />
          <line x1="585" y1="420" x2="505" y2="485" />
          <line x1="585" y1="420" x2="680" y2="330" />
          <line x1="680" y1="330" x2="745" y2="265" />
          <line x1="680" y1="330" x2="755" y2="335" />
          <line x1="680" y1="330" x2="660" y2="355" />
          <line x1="660" y1="355" x2="680" y2="405" />

          {/* South Corridor: Maharashtra - Hyderabad - Bengaluru - Chennai - Kerala */}
          <line x1="295" y1="525" x2="385" y2="545" />
          <line x1="295" y1="525" x2="315" y2="645" />
          <line x1="385" y1="545" x2="315" y2="645" />
          <line x1="385" y1="545" x2="415" y2="635" />
          <line x1="315" y1="645" x2="365" y2="740" />
          <line x1="315" y1="645" x2="320" y2="765" />
          <line x1="365" y1="740" x2="320" y2="765" />
          <line x1="315" y1="645" x2="265" y2="625" />
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
