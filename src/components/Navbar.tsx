import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Compass, 
  Layers, 
  Cpu
} from 'lucide-react';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { 
    openAskModal, 
    setIsAuthModalOpen, 
    userProfile, 
    setIsArchitectureModalOpen 
  } = useJourney();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      {/* Top GovTech Banner */}
      <div className="bg-[#07182C] text-white text-[11px] font-medium tracking-wide py-1 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">National GovTech Service Journey Assistant • Official Innovation Prototype</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-slate-300 text-xs">
            <button 
              onClick={() => setIsArchitectureModalOpen(true)}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>GovTech Architecture Stack</span>
            </button>
            <span>•</span>
            <span className="text-slate-300">Complementing NSWS, UMANG, MyScheme & DigiLocker</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-gov-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* SWAGAT Brand Logo */}
            <a href="#home" className="flex items-center space-x-3.5 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0B2545] text-white shadow-md group-hover:shadow-gov-glow transition-all duration-300">
                {/* Ashoka Chakra geometric motif */}
                <div className="w-7 h-7 rounded-full border-2 border-amber-400/90 flex items-center justify-center relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div className="absolute inset-0 border border-white/40 rounded-full animate-spin [animation-duration:18s]"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E05A10] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-extrabold text-2xl tracking-tight text-[#0B2545]">
                    SWAGAT
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gradient-to-r from-orange-100 to-amber-100 text-[#E05A10] rounded-full border border-orange-200">
                    AI Journey Engine
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Smart Government Assistance &amp; Guidance Technology
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
              <a 
                href="#home" 
                className="px-3.5 py-2 rounded-lg text-slate-900 hover:text-[#0B2545] hover:bg-slate-100/80 transition"
              >
                {t('nav_home')}
              </a>
              <a 
                href="#how-it-works" 
                className="px-3.5 py-2 rounded-lg hover:text-[#0B2545] hover:bg-slate-100/80 transition"
              >
                {t('nav_howItWorks')}
              </a>
              <a 
                href="#services" 
                className="px-3.5 py-2 rounded-lg hover:text-[#0B2545] hover:bg-slate-100/80 transition"
              >
                {t('nav_services')}
              </a>
              <a 
                href="#schemes" 
                className="px-3.5 py-2 rounded-lg hover:text-[#0B2545] hover:bg-slate-100/80 transition"
              >
                {t('nav_schemes')}
              </a>
              <a 
                href="#my-journey" 
                className="px-3.5 py-2 rounded-lg hover:text-[#0B2545] hover:bg-slate-100/80 transition flex items-center space-x-1"
              >
                <Compass className="w-4 h-4 text-[#E05A10]" />
                <span>{t('nav_myJourney')}</span>
              </a>
              <a 
                href="#about" 
                className="px-3.5 py-2 rounded-lg hover:text-[#0B2545] hover:bg-slate-100/80 transition"
              >
                {t('nav_about')}
              </a>
            </nav>

            {/* Right Action Tools: Language, Auth & Ask SWAGAT */}
            <div className="hidden sm:flex items-center space-x-3">
              
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  id="language-selector-btn"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/90 rounded-lg border border-slate-200 transition"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#134074]" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-gov-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                          language === lang.code ? 'bg-blue-50 text-[#0B2545] font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-[11px] text-slate-400">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Login / Aadhaar Profile Button */}
              {userProfile ? (
                <button
                  id="user-profile-badge"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-emerald-900 leading-none">{userProfile.name}</div>
                    <div className="text-[9px] text-emerald-700">DigiLocker Verified</div>
                  </div>
                </button>
              ) : (
                <button
                  id="login-auth-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('nav_login')}</span>
                </button>
              )}

              {/* Primary Action Button: "Ask SWAGAT" */}
              <button
                id="ask-swagat-nav-btn"
                onClick={() => openAskModal()}
                className="relative inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] hover:from-[#134074] hover:to-[#0B2545] rounded-xl shadow-md hover:shadow-gov-lg transition-all duration-200 group active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300 animate-spin [animation-duration:8s]" />
                <span>{t('nav_askSwagat')}</span>
                <span className="ml-1 text-[#E05A10] group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100"
                title="Language"
              >
                <Globe className="w-4 h-4 text-[#134074]" />
              </button>
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-gov-xl">
            <nav className="flex flex-col space-y-1 font-medium text-sm text-slate-800">
              <a 
                href="#home" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_home')}
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_howItWorks')}
              </a>
              <a 
                href="#services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_services')}
              </a>
              <a 
                href="#schemes" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_schemes')}
              </a>
              <a 
                href="#my-journey" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_myJourney')}
              </a>
              <a 
                href="#about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav_about')}
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsArchitectureModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                <Layers className="w-4 h-4 text-[#0B2545]" />
                <span>View GovTech System Architecture</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAskModal();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-[#0B2545] rounded-xl shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t('nav_askSwagat')}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
