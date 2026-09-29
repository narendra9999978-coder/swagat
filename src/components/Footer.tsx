import React from 'react';
import { 
  Shield, 
  ArrowUp, 
  ExternalLink, 
  Sparkles 
} from 'lucide-react';
import { SwagatLogo } from './SwagatLogo';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusMark } from './ui/StatusMark';

/**
 * Footer
 * Curated from: https://ui.watermelon.sh/block/footer-16
 * Dual-Theme Glassmorphism Footer with Live System Status & Micro-Borders
 */
export const Footer: React.FC = () => {
  const { setCurrentView, theme } = useSwagat();
  const isDark = theme === 'dark';
  const { language, setLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`relative border-t backdrop-blur-2xl transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950/80 text-slate-400 border-white/10' 
        : 'bg-white/95 text-slate-600 border-slate-200/90 shadow-inner'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          
          {/* Col 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <SwagatLogo size="lg" showWordmark={true} showTagline={true} theme={theme} />

            <p className={`text-[13px] leading-relaxed max-w-sm mt-3 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              India’s intelligent single-window platform engineered to streamline business approval discovery, unified application filing, and real-time statutory tracking across Central Ministries and State Single Window Portals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 text-[11px] text-amber-500 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>National Innovation Prototype • NSWS Reference Flow</span>
              </div>
              <StatusMark status="active" label="All 1,400+ Gateways Operational" size="sm" />
            </div>
          </div>

          {/* Col 2: Core Navigation */}
          <div className="lg:col-span-3 space-y-3.5 text-left">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Single Window Portals
            </div>
            <ul className="space-y-2.5 text-left">
              <li>
                <button 
                  onClick={() => scrollTo('section-kya')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Know Your Approvals (KYA)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-approvals')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Central Approvals Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-states')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  State Single Window Portals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-schemes')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Government Schemes &amp; Subsidies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-tracking')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Real-Time Application Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Help */}
          <div className="lg:col-span-3 space-y-3.5 text-left">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Resources &amp; Support
            </div>
            <ul className="space-y-2.5 text-left">
              <li>
                <button 
                  onClick={() => scrollTo('section-about')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  About SWAGAT
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-help')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Step-by-Step User Guides
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-help')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-help')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Lodge Query / Grievance
                </button>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-[13.5px] font-medium text-slate-400 dark:text-slate-500 py-0.5">
                  <span>API Documentation</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                    Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Legal */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <div className={`font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Governance &amp; Trust
            </div>
            <ul className="space-y-2.5 text-left">
              <li>
                <button 
                  onClick={() => scrollTo('section-about')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-about')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-about')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-about')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Digital Data Protection (DPDP)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('section-kya')} 
                  className={`text-left block w-full text-[13.5px] leading-snug font-medium transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Sitemap
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className={`mt-8 p-4 rounded-2xl border backdrop-blur-md text-[11px] leading-relaxed ${
          isDark 
            ? 'bg-white/5 border-white/10 text-slate-300' 
            : 'bg-slate-100/80 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className={`font-bold block mb-0.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Platform Disclaimer &amp; Notice:</strong>
              SWAGAT is a digital single-window platform concept engineered for discovering, understanding, applying for and tracking business/government approvals in India. Functional architecture is referenced from the National Single Window System (NSWS) for demonstration and educational purposes. This platform does not imply official government ownership, government certification or statutory affiliation unless formally deployed and certified by respective Central/State authorities.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <div>
            © 2026 SWAGAT • INNOVATE | BUILD | SERVE • All Rights Reserved.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className={`group flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
