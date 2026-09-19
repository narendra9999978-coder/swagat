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
 * Deep Dark Glassmorphism Footer with Live System Status & Micro-Borders
 */
export const Footer: React.FC = () => {
  const { setCurrentView } = useSwagat();
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
    <footer className="relative bg-slate-950/80 text-slate-400 text-xs border-t border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <SwagatLogo size="lg" showWordmark={true} showTagline={true} theme="dark" />

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-3">
              India’s intelligent single-window platform engineered to streamline business approval discovery, unified application filing, and real-time statutory tracking across Central Ministries and State Single Window Portals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>National Innovation Prototype • NSWS Reference Flow</span>
              </div>
              <StatusMark status="active" label="All 1,400+ Gateways Operational" size="sm" />
            </div>
          </div>

          {/* Col 3: Core Navigation */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">
              Single Window Portals
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo('section-kya')} className="hover:text-white transition">
                  Know Your Approvals (KYA)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-approvals')} className="hover:text-white transition">
                  Central Approvals Directory
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-states')} className="hover:text-white transition">
                  State Single Window Portals
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-schemes')} className="hover:text-white transition">
                  Government Schemes &amp; Subsidies
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-tracking')} className="hover:text-white transition">
                  Real-Time Application Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Help */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">
              Resources &amp; Support
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo('section-about')} className="hover:text-white transition">
                  About SWAGAT
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-help')} className="hover:text-white transition">
                  Step-by-Step User Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-help')} className="hover:text-white transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('section-help')} className="hover:text-white transition">
                  Lodge Query / Grievance
                </button>
              </li>
              <li>
                <span className="text-slate-500">API Documentation (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Compliance & Legal */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">
              Governance &amp; Trust
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Use</span></li>
              <li><span className="hover:text-white cursor-pointer">Accessibility Statement</span></li>
              <li><span className="hover:text-white cursor-pointer">Digital Data Protection (DPDP)</span></li>
              <li><span className="hover:text-white cursor-pointer">Sitemap</span></li>
            </ul>
          </div>

        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-[11px] leading-relaxed">
          <div className="flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Platform Disclaimer &amp; Notice:</strong>
              SWAGAT is a digital single-window platform concept engineered for discovering, understanding, applying for and tracking business/government approvals in India. Functional architecture is referenced from the National Single Window System (NSWS) for demonstration and educational purposes. This platform does not imply official government ownership, government certification or statutory affiliation unless formally deployed and certified by respective Central/State authorities.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 SWAGAT • INNOVATE | BUILD | SERVE • All Rights Reserved.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98]"
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
