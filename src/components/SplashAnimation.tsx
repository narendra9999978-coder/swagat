import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HeritageLandmarksSketch } from './HeritageLandmarksSketch';
import { useSwagat } from '../context/SwagatContext';

interface SplashAnimationProps {
  onComplete: () => void;
}

/**
 * SplashAnimation
 *
 * Exact restoration of the user's authentic SWAGAT Tricolour Splash Screen:
 * - Immediate frame 0 tricolour atmospheric watercolor canvas (no dark flash, no delay)
 * - Authentic smoky watercolor clouds (/tricolour-cloud-bg.jpg) + soft saffron and green glows
 * - India Gate & Taj Mahal line art emerging from bottom-left corner
 * - Centered SWAGAT emblem pod with rotating Ashoka Blue dotted ring
 * - Bold SWAGAT wordmark with tricolour gradient 'G'
 * - "India’s Single Window Approval Gateway" tagline
 * - HIGH CONTRAST & CLEARLY READABLE "National Digital Infrastructure Portal" badge
 * - Shimmering Indian tricolour loading ribbon
 * - Seamless transition to main website
 */
export const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const [stage, setStage] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const cleanupSplashLock = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('splash-active');
      const initStyle = document.getElementById('splash-init-style');
      if (initStyle) initStyle.remove();
    }
  };

  const finishSplash = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);
    cleanupSplashLock();
    setTimeout(() => {
      onCompleteRef.current();
    }, 450);
  };

  useEffect(() => {
    // Stage 1: Heritage sketch emerges from bottom-left (120ms)
    const t1 = setTimeout(() => setStage(1), 120);
    // Stage 2: SWAGAT center emblem pod and Ashoka ring expand (450ms)
    const t2 = setTimeout(() => setStage(2), 450);
    // Stage 3: SWAGAT wordmark, high-contrast subtitle & tricolour ribbon fade in (850ms)
    const t3 = setTimeout(() => setStage(3), 850);
    // Stage 4: Smooth transition to main website (2800ms)
    const t4 = setTimeout(() => finishSplash(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cleanupSplashLock();
    };
  }, []);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    finishSplash();
  };

  return (
    <div
      className={`fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-500 ${
        isDark ? 'bg-[#071A2D] text-white' : 'bg-white text-slate-900'
      } ${
        isFadingOut ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ── 1. FULL-SCREEN 16:9 TRICOLOUR ATMOSPHERIC CANVAS ── */}
      {/* Base Background Image: Authentic Smoky Tricolour Watercolor Clouds (visible immediately from frame 0) */}
      {!isDark && (
        <img
          src="/tricolour-cloud-bg.jpg"
          alt="Indian Tricolour Cloud Atmosphere"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-95 transition-opacity duration-700"
        />
      )}

      {/* Saffron Glow Enhance - Top-Left (immediate, no black flash) */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 20% 20%, rgba(255,153,51,0.18) 0%, rgba(255,153,51,0.05) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(255,140,0,0.28) 0%, rgba(255,153,51,0.12) 40%, transparent 70%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Indian Green Glow Enhance - Bottom-Right (immediate, no black flash) */}
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[55%] h-[55%] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 80% 80%, rgba(19,136,8,0.18) 0%, rgba(34,197,94,0.05) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at 80% 80%, rgba(19,136,8,0.25) 0%, rgba(34,197,94,0.10) 40%, transparent 70%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Pure White Central Clean Zone (behind logo for maximum focus & contrast) */}
      {!isDark && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[55%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.70) 50%, transparent 80%)',
            filter: 'blur(45px)',
          }}
        />
      )}

      {/* Subtle Ashoka Blue (#000080) Aura Accent around the logo */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 rounded-full pointer-events-none transition-all duration-1000 ${
          stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(91,175,214,0.12) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,0,128,0.06) 0%, rgba(56,189,248,0.03) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── 2. INDIA HERITAGE ARTWORK (Bottom-Left Corner) ── */}
      {/* India Gate and Taj Mahal line art emerging and dissolving into the tricolour mist */}
      <div
        className={`absolute -bottom-4 left-0 sm:left-4 lg:left-8 w-[380px] sm:w-[500px] lg:w-[640px] h-[240px] sm:h-[310px] lg:h-[390px] pointer-events-none select-none z-10 transition-all duration-1000 ease-out ${
          stage >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <HeritageLandmarksSketch theme={isDark ? 'dark' : 'light'} className="w-full h-full" />
      </div>

      {/* ── 3. CENTERED SWAGAT LOGO & TAGLINE CONSTRUCT ── */}
      <div className="relative z-20 flex flex-col items-center max-w-lg px-6 text-center">
        {/* Emblem Pod */}
        <div
          className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            stage >= 2 ? 'scale-100 opacity-100' : 'scale-70 opacity-0'
          }`}
        >
          {/* Subtle outer tricolour halo glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF9933]/25 via-sky-500/10 to-[#138808]/25 blur-xl pointer-events-none animate-pulse" />

          {/* Smooth Circular Outer Rotating Ashoka Blue Dotted Ring */}
          <div
            className="absolute -inset-3 rounded-full border border-dashed animate-spin [animation-duration:35s] pointer-events-none"
            style={{ borderColor: isDark ? 'rgba(91,175,214,0.30)' : 'rgba(0,0,128,0.15)' }}
          />
          <div
            className="absolute -inset-1 rounded-full border pointer-events-none"
            style={{ borderColor: isDark ? 'rgba(140,175,210,0.20)' : 'rgba(226,232,240,0.80)' }}
          />

          {/* Clean Emblem Core Pod with soft elevation shadow */}
          <div
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center p-3 overflow-hidden backdrop-blur-md"
            style={{
              background: isDark ? 'rgba(11,34,56,0.95)' : 'rgba(255,255,255,0.95)',
              border: isDark ? '1px solid rgba(140,175,210,0.25)' : '1px solid rgba(226,232,240,0.90)',
              boxShadow: isDark
                ? '0 12px 36px -6px rgba(0,0,0,0.50), 0 4px 16px -2px rgba(255,153,51,0.12)'
                : '0 12px 36px -6px rgba(0,0,128,0.10), 0 4px 16px -2px rgba(255,153,51,0.12)',
            }}
          >
            <img
              src="/swagat-emblem-clean.png"
              alt="SWAGAT Official Emblem"
              className={`w-26 h-26 md:w-32 md:h-32 object-contain select-none z-10 transition-all duration-700 drop-shadow-[0_4px_16px_rgba(0,0,0,0.15)] ${
                stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/swagat-emblem-transparent.png';
              }}
            />
          </div>
        </div>

        {/* SWAGAT Wordmark, Tagline, High-Contrast Subtitle & Tricolour Ribbon */}
        <div
          className={`mt-6 transition-all duration-700 ease-out ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {/* SWAGAT Wordmark: Bold, executive GovTech typography */}
          <div
            className="flex items-center justify-center font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight drop-shadow-xs"
            style={{ color: isDark ? '#F1F6FA' : '#061525' }}
          >
            <span>SWA</span>
            <span className="bg-gradient-to-b from-[#FF9933] via-amber-500 to-[#138808] bg-clip-text text-transparent px-0.5">
              G
            </span>
            <span>AT</span>
          </div>

          {/* Official Tagline: "India’s Single Window Approval Gateway" */}
          <p
            className="mt-2 text-base sm:text-lg md:text-xl font-bold tracking-wide"
            style={{ color: isDark ? '#C2D1DF' : '#1E293B' }}
          >
            India’s Single Window Approval Gateway
          </p>

          {/* ── HIGH-CONTRAST SUBTITLE BADGE: "NATIONAL DIGITAL INFRASTRUCTURE PORTAL" ── */}
          <div
            className="mt-2.5 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm border transition-colors"
            style={{
              background: isDark ? 'rgba(11,34,56,0.90)' : 'rgba(255,255,255,0.96)',
              borderColor: isDark ? 'rgba(140,175,210,0.35)' : 'rgba(35,64,92,0.28)',
              color: isDark ? '#D7E4EE' : '#102A43',
            }}
          >
            <Shield className="w-3.5 h-3.5 text-[#138808] shrink-0" />
            <span
              className="font-extrabold tracking-widest"
              style={{ color: isDark ? '#D7E4EE' : '#0D2B4D' }}
            >
              National Digital Infrastructure Portal
            </span>
          </div>

          {/* Elegant Tricolour Loading Ribbon */}
          <div
            className="mt-5 w-52 sm:w-64 h-1.5 rounded-full mx-auto overflow-hidden border shadow-inner"
            style={{
              background: isDark ? '#0B2238' : '#F1F5F9',
              borderColor: isDark ? 'rgba(140,175,210,0.20)' : 'rgba(203,213,225,0.60)',
            }}
          >
            <div className="h-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-[shimmer_1.8s_infinite] w-full" />
          </div>
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-30 flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer hover:scale-105 active:scale-95"
        style={{
          background: isDark ? 'rgba(11,34,56,0.85)' : 'rgba(255,255,255,0.85)',
          borderColor: isDark ? 'rgba(140,175,210,0.25)' : 'rgba(203,213,225,0.90)',
          color: isDark ? '#C2D1DF' : '#334E68',
        }}
      >
        <span>{t('skip_intro')}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Bottom Subtitle Indicator */}
      <div
        className="absolute bottom-8 left-8 hidden sm:flex items-center space-x-2 text-[11px] z-30"
        style={{ color: isDark ? '#8FA6B8' : '#64748B' }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Government of India • Unified Single Window Architecture</span>
      </div>
    </div>
  );
};
