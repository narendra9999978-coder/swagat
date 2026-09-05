import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SplashAnimationProps {
  onComplete: () => void;
}

export const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const finishSplash = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 300);
  };

  useEffect(() => {
    // Stage 1: Particles and glowing circuit grid emerge (150ms)
    const t1 = setTimeout(() => setStage(1), 150);
    // Stage 2: S Emblem and tricolour ribbons converge (500ms)
    const t2 = setTimeout(() => setStage(2), 500);
    // Stage 3: Ashoka Chakra rotates and center hub lights up (900ms)
    const t3 = setTimeout(() => setStage(3), 900);
    // Stage 4: SWAGAT wordmark & Tagline "INNOVATE | BUILD | SERVE" reveal (1300ms)
    const t4 = setTimeout(() => setStage(4), 1300);
    // Stage 5: Smooth exit (2200ms)
    const t5 = setTimeout(() => {
      finishSplash();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    finishSplash();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07182C] text-white transition-opacity duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Digital Circuit Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-35 animate-pulse"></div>

      {/* Subtle Glow Halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none transition-all duration-1000"></div>
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none transition-all duration-1000"></div>

      {/* Tricolour Particle Streams */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/4 left-10 md:left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#FF9933] to-transparent animate-[pulse_2s_infinite]"></div>
        <div className="absolute bottom-1/4 right-10 md:right-1/4 w-40 h-0.5 bg-gradient-to-r from-transparent via-[#138808] to-transparent animate-[pulse_2s_infinite_0.5s]"></div>
        <div className="absolute top-1/2 left-8 md:left-1/5 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent animate-[pulse_2s_infinite_1s]"></div>
      </div>

      {/* Center Animated Logo Construct */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Emblem Box */}
        <div
          className={`relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#10335D] to-[#07182C] border border-white/20 shadow-2xl flex items-center justify-center p-3 transition-all duration-700 ${
            stage >= 2 ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 -rotate-12'
          }`}
        >
          {/* Subtle Outer Rotating Ring */}
          <div className="absolute -inset-2 rounded-3xl border border-dashed border-sky-400/40 animate-spin [animation-duration:24s] pointer-events-none"></div>

          {/* S Emblem SVG */}
          <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="splashSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#FF6600" />
              </linearGradient>
              <linearGradient id="splashGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#19A745" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
              <linearGradient id="splashChakra" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>

            {/* Top Saffron Flow */}
            <path
              d="M 68 18 C 52 14, 26 22, 26 40 C 26 54, 52 50, 52 64 C 52 74, 38 78, 28 72"
              stroke="url(#splashSaffron)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className={`transition-all duration-1000 ${stage >= 2 ? 'stroke-dashoffset-0 opacity-100' : 'opacity-20'}`}
            />

            {/* Bottom Green Flow */}
            <path
              d="M 32 82 C 48 86, 74 78, 74 60 C 74 46, 48 50, 48 36 C 48 26, 62 22, 72 28"
              stroke="url(#splashGreen)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className={`transition-all duration-1000 ${stage >= 2 ? 'stroke-dashoffset-0 opacity-100' : 'opacity-20'}`}
            />

            {/* Ashoka Chakra in Center Hub */}
            <g className={`transition-all duration-700 ${stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} origin-center`}>
              <circle cx="50" cy="50" r="14" stroke="url(#splashChakra)" strokeWidth="2.5" fill="#07182C" />
              <circle cx="50" cy="50" r="4" fill="#38BDF8" />
              <g className="animate-spin origin-center [animation-duration:16s]">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="39"
                    x2="50"
                    y2="42"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
              </g>
            </g>

            {/* High Tech Connection Nodes */}
            <circle cx="70" cy="18" r="4" fill="#FF9933" className={stage >= 2 ? 'animate-ping' : ''} />
            <circle cx="30" cy="82" r="4" fill="#19A745" className={stage >= 2 ? 'animate-ping' : ''} />
          </svg>
        </div>

        {/* Wordmark & Tagline */}
        <div className={`mt-6 transition-all duration-700 ${stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white flex items-center justify-center space-x-2">
            <span>SWAGAT</span>
          </h1>

          {/* Tagline */}
          <p className="mt-2 text-xs md:text-sm font-semibold tracking-[0.25em] text-amber-400 uppercase">
            INNOVATE | BUILD | SERVE
          </p>

          <p className="mt-2 text-xs text-slate-400 font-medium max-w-xs mx-auto">
            India’s Single Window for Business Approvals
          </p>

          {/* Progress Indicator */}
          <div className="mt-6 w-48 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-[shimmer_1.5s_infinite] w-full"></div>
          </div>
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all duration-200 group"
      >
        <span>{t('skip_intro')}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Bottom Subtitle */}
      <div className="absolute bottom-8 left-8 hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>Unified Single-Window GovTech Architecture</span>
      </div>
    </div>
  );
};
