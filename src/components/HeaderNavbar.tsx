import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  MoreVertical, 
  LogIn, 
  UserPlus, 
  Building2, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  FileCheck2,
  Compass,
  MapPin,
  BookOpen,
  Sun,
  Moon,
  Palette,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { SwagatLogo } from './SwagatLogo';
import { allIndianStatesList } from '../data/indiaStatesData';
import { StatusMark } from './ui/StatusMark';

/**
 * HeaderNavbar
 * Curated from: https://ui.watermelon.sh/block/navigation-4
 * & https://21st.dev/@originui/components/navigation-menu-4/navbar2
 * & https://ui.watermelon.sh/components/dropdown-menu (8 / 12)
 * Dual Light & Dark Glassmorphism floating navbar with spring pill transitions and micro status indicators
 */
export const HeaderNavbar: React.FC = () => {
  const { 
    userProfile, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    logout, 
    setIsSearchModalOpen,
    currentView,
    setCurrentView,
    setDashboardActiveTab,
    openStateDetailModal,
    selectedStateFilter,
    setSelectedStateFilter,
    theme,
    setTheme,
    toggleTheme
  } = useSwagat();

  const { language, setLanguage, t } = useLanguage();
  const [isThreeDotOpen, setIsThreeDotOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const threeDotRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (threeDotRef.current && !threeDotRef.current.contains(target)) {
        setIsThreeDotOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(target)) {
        setIsStateDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(target)) {
        setIsLoginDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setIsMoreDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(target)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: typeof currentView, hashTarget?: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
    if (hashTarget && view === 'home') {
      const el = document.getElementById(hashTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openAuthWithMode = (mode: 'signin-user' | 'signup-user' | 'signin-admin' | 'signin-super') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsThreeDotOpen(false);
    setIsLoginDropdownOpen(false);
    setIsMoreDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      const targetUrl = mode === 'signin-admin' || mode === 'signin-super' ? '/admin-login' : mode.includes('signup') ? '/signup' : '/login';
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const logoClicksRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - logoClicksRef.current.lastTime > 2500) {
      logoClicksRef.current = { count: 1, lastTime: now };
    } else {
      logoClicksRef.current.count += 1;
      logoClicksRef.current.lastTime = now;
      if (logoClicksRef.current.count >= 5) {
        logoClicksRef.current = { count: 0, lastTime: 0 };
        openAuthWithMode('signin-super');
        return;
      }
    }
    handleNavClick('home');
  };

  return (
    <div className="fixed top-3 inset-x-0 z-40 flex flex-col items-center px-3 sm:px-5 pointer-events-none transition-all duration-300">
      {/* Floating Pill Dock - Elongated */}
      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto w-[96%] max-w-[1650px] rounded-[34px] backdrop-blur-2xl transition-all duration-300 px-4 sm:px-5 ${
          theme === 'light'
            ? 'bg-white/95 border border-[#D9E3EE] shadow-[0_6px_20px_rgba(15,35,60,0.08)] text-slate-800'
            : 'bg-[rgba(5,20,34,0.92)] border border-[rgba(120,165,195,0.25)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-[#DCE8F2]'
        }`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-[68px] w-full gap-2 sm:gap-4">
            
            {/* COLUMN 1: SWAGAT Brand Logo */}
            <div className="swagat-brand shrink-0 mr-2 sm:mr-4">
              <button
                id="swagat-brand-home-btn"
                onClick={handleLogoClick}
                className="focus:outline-none text-left cursor-pointer shrink-0 max-w-full flex items-center"
                title="SWAGAT Portal (Click 5 times for Super Admin)"
              >
                <SwagatLogo size="xs" showWordmark={true} showTagline={false} theme={theme} />
              </button>
            </div>

            {/* COLUMN 2: Primary Navigation Links */}
            <nav className={`swagat-primary-nav hidden min-[901px]:flex items-center justify-center font-medium text-[13px] whitespace-nowrap flex-1 min-w-0 ${
              theme === 'light' ? 'text-[#29445F]' : 'text-slate-300'
            }`}>
              
              {/* Home */}
              <button
                id="nav-link-home"
                onClick={() => handleNavClick('home')}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 cursor-pointer ${
                  currentView === 'home'
                    ? theme === 'light'
                      ? 'text-[#102A43] font-bold bg-[#EAF4FF] shadow-xs border border-[#B9DDF5]'
                      : 'text-white font-bold bg-white/15 shadow-xs border border-white/20'
                    : theme === 'light'
                      ? 'hover:bg-slate-100/80 text-[#334E68] hover:text-[#102A43]'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {t('nav_home')}
              </button>

              {/* Approvals */}
              <button
                id="nav-link-approvals"
                onClick={() => handleNavClick('home', 'section-approvals')}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 cursor-pointer ${
                  currentView === 'approvals'
                    ? theme === 'light'
                      ? 'text-[#102A43] font-bold bg-[#EAF4FF] shadow-xs border border-[#B9DDF5]'
                      : 'text-white font-bold bg-white/15 shadow-xs border border-white/20'
                    : theme === 'light'
                      ? 'hover:bg-slate-100/80 text-[#334E68] hover:text-[#102A43]'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {t('nav_approvals')}
              </button>

              {/* Sectors */}
              <button
                id="nav-link-schemes"
                onClick={() => handleNavClick('home', 'section-schemes')}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 cursor-pointer ${
                  currentView === 'schemes'
                    ? theme === 'light'
                      ? 'text-[#102A43] font-bold bg-[#EAF4FF] shadow-xs border border-[#B9DDF5]'
                      : 'text-white font-bold bg-white/15 shadow-xs border border-white/20'
                    : theme === 'light'
                      ? 'hover:bg-slate-100/80 text-[#334E68] hover:text-[#102A43]'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Sectors
              </button>

              {/* Know Your Approvals (Highlighted) */}
              <button
                id="nav-link-kya"
                onClick={() => handleNavClick('home', 'section-kya')}
                className={`px-3.5 py-1.5 rounded-full font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all duration-300 ${
                  theme === 'light'
                    ? 'text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 shadow-xs'
                    : 'text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 shadow-sm shadow-amber-500/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5 min-[1400px]:w-4 min-[1400px]:h-4 text-amber-500 shrink-0" />
                <span>{t('nav_kya')}</span>
              </button>

              {/* THEMES (Replacing State Approvals as requested) */}
              <div className="relative shrink-0 hidden min-[1100px]:block" ref={themeRef}>
                <button
                  id="nav-link-themes"
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold cursor-pointer shrink-0 ${
                    theme === 'light'
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 bg-slate-50/80'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 bg-white/5'
                  }`}
                  title="Switch Visual Theme (Light / Dark)"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Themes</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isThemeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2.5 w-52 rounded-2xl shadow-2xl p-2 z-[1050] backdrop-blur-2xl ${
                        theme === 'light'
                          ? 'bg-white border border-slate-200/90 text-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.12)]'
                          : 'bg-[#061525] border border-white/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.8)]'
                      }`}
                    >
                      <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b mb-1 ${
                        theme === 'light' ? 'text-slate-500 border-slate-200/70' : 'text-slate-400 border-white/10'
                      }`}>
                        Select Theme
                      </div>

                      {/* Light Theme Option */}
                      <button
                        id="theme-option-light"
                        onClick={() => {
                          setTheme('light');
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold">Light Theme</span>
                        </div>
                        {theme === 'light' && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                      </button>

                      {/* Dark Theme Option */}
                      <button
                        id="theme-option-dark"
                        onClick={() => {
                          setTheme('dark');
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer mt-1 ${
                          theme === 'dark'
                            ? 'bg-sky-950/60 text-sky-300 font-bold border border-sky-500/30'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Moon className="w-4 h-4 text-sky-400 shrink-0" />
                          <span className="font-bold">Dark Theme</span>
                        </div>
                        {theme === 'dark' && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Responsive More dropdown (for smaller screens) */}
              <div className="relative min-[1100px]:hidden shrink-0" ref={moreRef}>
                <button
                  id="nav-link-more"
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full transition-colors font-medium text-xs cursor-pointer ${
                    isMoreDropdownOpen 
                      ? (theme === 'light' ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-white/15 font-bold text-white')
                      : (theme === 'light' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10')
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMoreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className={`absolute left-0 mt-3 w-48 rounded-2xl shadow-2xl border backdrop-blur-2xl py-1.5 z-[1050] ${
                        theme === 'light'
                          ? 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_12px_30px_rgba(20,40,60,0.12)]'
                          : 'bg-slate-950/95 border-white/15 text-white'
                      }`}
                    >
                      <button
                        onClick={() => handleNavClick('home', 'section-states')}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center space-x-2 cursor-pointer ${
                          theme === 'light' ? 'text-[#172B4D] hover:bg-[#F1F6FA]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('state_approvals')}</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('home', 'section-about')}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center space-x-2 cursor-pointer ${
                          theme === 'light' ? 'text-[#172B4D] hover:bg-[#F1F6FA]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                        <span>Resources</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('home', 'section-help')}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center space-x-2 cursor-pointer ${
                          theme === 'light' ? 'text-[#172B4D] hover:bg-[#F1F6FA]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                        <span>{t('nav_help')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logged in Dashboard link */}
              {userProfile && (
                <button
                  id="nav-link-dashboard"
                  onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    currentView === 'dashboard' || currentView === 'admin-dashboard'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden min-[1300px]:inline">{t('nav_dashboard')}</span>
                </button>
              )}
            </nav>

            {/* COLUMN 3: Action Controls & Menus */}
            <div className="swagat-actions shrink-0 ml-2 sm:ml-4 flex items-center gap-1.5 sm:gap-2 flex-nowrap">
              
              {/* Global Search Button with ⌘K */}
              <button
                id="global-search-btn"
                onClick={() => setIsSearchModalOpen(true)}
                className={`p-1.5 sm:p-2 min-[1200px]:py-1.5 min-[1200px]:px-2.5 min-[1400px]:px-3 rounded-full transition-all flex items-center space-x-1.5 text-xs font-medium shrink-0 cursor-pointer w-auto min-[1200px]:w-[115px] min-[1440px]:w-[140px] ${
                  theme === 'light'
                    ? 'text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 shadow-2xs'
                    : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                title="Search Approvals, Schemes, Departments (Cmd+K or /)"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
                <span className={`hidden min-[1200px]:inline truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Search...</span>
                <kbd className={`hidden min-[1440px]:inline px-1.5 py-0.5 text-[9px] rounded-full border font-mono shrink-0 ml-auto ${
                  theme === 'light' ? 'bg-white text-slate-500 border-slate-200' : 'bg-white/10 border-white/15 text-slate-300'
                }`}>⌘K</kbd>
              </button>

              {/* State Selector Dropdown */}
              <div className="relative shrink-0 hidden min-[901px]:block" ref={stateRef}>
                <button
                  id="navbar-state-selector-toggle"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className={`flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border shrink-0 cursor-pointer ${
                    theme === 'light'
                      ? 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                      : 'text-slate-200 bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                  title="Select State / Union Territory"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="hidden min-[1200px]:inline max-w-[95px] min-[1400px]:max-w-[120px] truncate">
                    {selectedStateFilter !== 'All' ? selectedStateFilter : 'All India'}
                  </span>
                  <ChevronDown className={`w-3 h-3 shrink-0 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                </button>

                <AnimatePresence>
                  {isStateDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className={`absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] max-h-96 overflow-y-auto rounded-2xl border backdrop-blur-2xl py-2 z-[1050] transition-colors ${
                        theme === 'light'
                          ? 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_15px_35px_rgba(20,40,60,0.15)]'
                          : 'bg-slate-950/95 border-white/15 text-white shadow-2xl'
                      }`}
                    >
                      <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between border-b ${
                        theme === 'light' ? 'text-[#52657A] border-[#D8E2EC]' : 'text-slate-400 border-white/10'
                      }`}>
                        <span>Select State / Territory</span>
                        <span className={theme === 'light' ? 'text-emerald-700 font-extrabold' : 'text-emerald-400 font-extrabold'}>36 Regions</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStateFilter('All');
                          setIsStateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          selectedStateFilter === 'All'
                            ? theme === 'light'
                              ? 'bg-[#EAF5FF] text-[#0284C7] font-bold'
                              : 'bg-amber-500/15 text-amber-300 font-bold'
                            : theme === 'light'
                            ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className={theme === 'light' ? 'font-semibold text-[#172B4D]' : ''}>All India / Central Approvals</span>
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          theme === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          Pan-India
                        </span>
                      </button>

                      <div className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'
                      }`}>
                        States (28)
                      </div>
                      {allIndianStatesList.filter(s => s.type === 'State').map((st) => (
                        <button
                          key={st.code}
                          onClick={() => {
                            setSelectedStateFilter(st.name);
                            setIsStateDropdownOpen(false);
                            openStateDetailModal(st.code);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            selectedStateFilter === st.name
                              ? theme === 'light'
                                ? 'bg-[#EAF5FF] text-[#0284C7] font-bold'
                                : 'bg-emerald-500/15 text-emerald-300 font-bold'
                              : theme === 'light'
                              ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{st.name}</span>
                          <span className={`text-[10px] ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>{st.approvalCount}</span>
                        </button>
                      ))}

                      <div className={`px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#52657A]' : 'text-slate-400'
                      }`}>
                        Union Territories (8)
                      </div>
                      {allIndianStatesList.filter(s => s.type === 'UT').map((ut) => (
                        <button
                          key={ut.code}
                          onClick={() => {
                            setSelectedStateFilter(ut.name);
                            setIsStateDropdownOpen(false);
                            openStateDetailModal(ut.code);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            selectedStateFilter === ut.name
                              ? theme === 'light'
                                ? 'bg-[#EAF5FF] text-[#0284C7] font-bold'
                                : 'bg-emerald-500/15 text-emerald-300 font-bold'
                              : theme === 'light'
                              ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{ut.name}</span>
                          <span className={`text-[10px] ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>{ut.approvalCount}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative shrink-0 hidden min-[901px]:block" ref={langRef}>
                <button
                  id="language-selector-toggle"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className={`flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border shrink-0 cursor-pointer ${
                    theme === 'light'
                      ? 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                      : 'text-slate-200 bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className={`w-3 h-3 shrink-0 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className={`absolute right-0 mt-3 w-44 max-w-[calc(100vw-24px)] rounded-2xl border backdrop-blur-2xl py-1.5 z-[1050] transition-colors ${
                        theme === 'light'
                          ? 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_12px_30px_rgba(20,40,60,0.12)]'
                          : 'bg-slate-950/95 border-white/15 text-white shadow-2xl'
                      }`}
                    >
                      <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'
                      }`}>
                        Select Language
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            language === lang.code
                              ? theme === 'light'
                                ? 'bg-[#EAF5FF] text-[#0284C7] font-bold'
                                : 'bg-sky-500/15 text-sky-300 font-bold'
                              : theme === 'light'
                              ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span className={theme === 'light' ? 'font-medium' : ''}>{lang.native}</span>
                          <span className={`text-[11px] ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Badge (if logged in) */}
              {userProfile ? (
                <button
                  id="header-user-badge"
                  onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                  className="hidden min-[901px]:flex items-center space-x-2 px-2.5 sm:px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full transition-colors text-left shrink-0 cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full text-slate-950 flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                    userProfile.role === 'ADMIN' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}>
                    {userProfile.avatarInitials}
                  </div>
                  <div className="leading-tight hidden min-[1200px]:block">
                    <div className="text-xs font-bold text-white truncate max-w-[100px]">{userProfile.name}</div>
                    <div className="text-[10px] text-emerald-400 font-medium capitalize">
                      {userProfile.role === 'ADMIN' ? 'Admin' : 'Business'}
                    </div>
                  </div>
                </button>
              ) : (
                /* Login Dropdown Button */
                <div className="relative shrink-0 hidden min-[901px]:block" ref={loginDropdownRef}>
                  <button
                    id="login-dropdown-btn"
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-full transition-all duration-300 shadow-md shadow-sky-500/20 shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span>Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isLoginDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className={`absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl border backdrop-blur-2xl py-2 z-[1050] ${
                          theme === 'light'
                            ? 'bg-[#FFFFFF] border-[#D8E2EC] shadow-[0_12px_30px_rgba(20,40,60,0.12)]'
                            : 'bg-slate-950/95 border-white/15'
                        }`}
                      >
                        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b ${
                          theme === 'light'
                            ? 'text-[#52657A] border-[#D8E2EC] bg-[#F8FAFC]'
                            : 'text-slate-400 border-white/10'
                        }`}>
                          Select Portal
                        </div>

                        <button
                          id="login-as-user-btn"
                          onClick={() => openAuthWithMode('signin-user')}
                          className={`w-full text-left px-4 py-3 transition group cursor-pointer ${
                            theme === 'light' ? 'hover:bg-[#F1F6FA]' : 'hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <div className={`text-xs font-bold ${
                                theme === 'light' ? 'text-[#172B4D]' : 'text-white'
                              }`}>Business User Login</div>
                              <div className={`text-[10px] ${
                                theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'
                              }`}>Investor / Entrepreneur</div>
                            </div>
                          </div>
                        </button>

                        <button
                          id="login-as-admin-btn"
                          onClick={() => openAuthWithMode('signin-admin')}
                          className={`w-full text-left px-4 py-3 transition group border-t cursor-pointer ${
                            theme === 'light'
                              ? 'hover:bg-[#F1F6FA] border-[#D8E2EC]'
                              : 'hover:bg-white/10 border-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition">
                              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className={`text-xs font-bold ${
                                theme === 'light' ? 'text-[#172B4D]' : 'text-white'
                              }`}>Admin Login</div>
                              <div className={`text-[10px] ${
                                theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'
                              }`}>Ministry / Dept Administrator</div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* THREE-DOT VERTICAL MENU */}
              <div className="relative shrink-0" ref={threeDotRef}>
                <button
                  id="three-dot-menu-btn"
                  onClick={() => setIsThreeDotOpen(!isThreeDotOpen)}
                  className={`p-2 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer border ${
                    theme === 'light'
                      ? 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                      : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  aria-label="Account and Access Menu"
                  title="Menu & Access"
                >
                  <MoreVertical className="w-4 h-4 shrink-0" />
                </button>

                <AnimatePresence>
                  {isThreeDotOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className={`absolute right-0 mt-3 w-64 max-w-[calc(100vw-20px)] rounded-2xl shadow-2xl border backdrop-blur-2xl py-2 z-[1050] divide-y ${
                        theme === 'light'
                          ? 'bg-[#FFFFFF] border-[#D8E2EC] shadow-[0_12px_30px_rgba(20,40,60,0.12)] divide-[#D8E2EC]'
                          : 'bg-slate-950/95 border-white/15 divide-white/10'
                      }`}
                    >
                      
                      {/* User Profile Header if Logged In */}
                      {userProfile ? (
                        <div className={`px-4 py-3 ${theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-white/5'}`}>
                          <div className={`text-xs font-bold ${theme === 'light' ? 'text-[#172B4D]' : 'text-white'}`}>{userProfile.name}</div>
                          <div className={`text-[11px] truncate ${theme === 'light' ? 'text-[#64748B]' : 'text-slate-400'}`}>{userProfile.companyName}</div>
                          <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{userProfile.role === 'ADMIN' ? 'Admin Portal' : 'Business User Portal'}</span>
                          </div>
                        </div>
                      ) : null}

                      {/* Section 1: Dashboard & Auth Options */}
                      <div className="py-1">
                        {userProfile ? (
                          <>
                            <button
                              id="menu-open-dashboard"
                              onClick={() => {
                                handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
                                setIsThreeDotOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center space-x-2.5 cursor-pointer ${
                                theme === 'light'
                                  ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <LayoutDashboard className="w-4 h-4 text-sky-500" />
                              <span>My SWAGAT Dashboard</span>
                            </button>
                            <button
                              id="menu-my-applications"
                              onClick={() => {
                                handleNavClick('dashboard');
                                setDashboardActiveTab('applications');
                                setIsThreeDotOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                                theme === 'light'
                                  ? 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F1F6FA]'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <FileCheck2 className="w-4 h-4 text-slate-400" />
                              <span>My Applications &amp; Tracking</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              id="menu-action-login"
                              onClick={() => openAuthWithMode('signin-user')}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center space-x-2.5 cursor-pointer ${
                                theme === 'light'
                                  ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                                  : 'text-white hover:bg-white/10'
                              }`}
                            >
                              <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span>Login</span>
                            </button>

                            <button
                              id="menu-action-signup"
                              onClick={() => openAuthWithMode('signup-user')}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center space-x-2.5 cursor-pointer ${
                                theme === 'light'
                                  ? 'text-[#172B4D] hover:bg-[#F1F6FA]'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <UserPlus className="w-4 h-4 text-sky-500" />
                              <span>Sign Up</span>
                            </button>

                            <button
                              id="menu-action-admin-login"
                              onClick={() => openAuthWithMode('signin-admin')}
                              className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2.5 border-t cursor-pointer ${
                                theme === 'light'
                                  ? 'text-[#172B4D] hover:bg-[#F1F6FA] border-[#D8E2EC]'
                                  : 'text-white hover:bg-white/10 border-white/5'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>Admin Login</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Section 2: Help & Contact */}
                      <div className="py-1">
                        <button
                          id="menu-help-support"
                          onClick={() => {
                            handleNavClick('home', 'section-help');
                            setIsThreeDotOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                            theme === 'light'
                              ? 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F1F6FA]'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                          <span>Help</span>
                        </button>

                        <button
                          id="menu-contact"
                          onClick={() => {
                            handleNavClick('home', 'section-help');
                            setIsThreeDotOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                            theme === 'light'
                              ? 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F1F6FA]'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>Contact</span>
                        </button>
                      </div>

                      {/* Section 3: Logout if logged in */}
                      {userProfile && (
                        <div className="py-1">
                          <button
                            id="menu-action-logout"
                            onClick={() => {
                              logout();
                              setIsThreeDotOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center space-x-2.5 cursor-pointer`}
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>{t('menu_logout')}</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full border transition-colors min-[901px]:hidden shrink-0 cursor-pointer ${
                  theme === 'light'
                    ? 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                    : 'text-slate-300 hover:text-white bg-white/10 border-white/15'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Floating Card */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className={`pointer-events-auto min-[901px]:hidden w-full max-w-lg shadow-2xl backdrop-blur-2xl rounded-3xl p-4 mt-2 space-y-4 max-h-[80vh] overflow-y-auto border ${
              theme === 'light'
                ? 'bg-white border-slate-200/90 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
                : 'bg-[#071322] border-white/15 text-slate-200'
            }`}
          >
            <nav className={`flex flex-col space-y-1 font-medium text-sm ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-200'
            }`}>
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-3 cursor-pointer ${
                  theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span>{t('nav_home')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-approvals')}
                className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-3 cursor-pointer ${
                  theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span>{t('nav_approvals')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-schemes')}
                className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-3 cursor-pointer ${
                  theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span>Sectors</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-kya')}
                className={`text-left px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-2.5 cursor-pointer ${
                  theme === 'light'
                    ? 'text-amber-800 bg-amber-50 border border-amber-200'
                    : 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{t('nav_kya')}</span>
              </button>

              {/* Mobile Themes Option */}
              <div className={`flex items-center justify-between px-3.5 py-2 rounded-xl my-1 border ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-xs font-semibold flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>Visual Theme</span>
                </span>
                <div className={`flex items-center space-x-1 p-0.5 rounded-lg border ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/10 border-white/10'
                }`}>
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center space-x-1 ${
                      theme === 'light' ? 'bg-sky-50 text-sky-700 shadow-xs font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center space-x-1 ${
                      theme === 'dark' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-sky-200" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNavClick('home', 'section-about')}
                className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-3 cursor-pointer ${
                  theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span>Resources</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-help')}
                className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center space-x-3 cursor-pointer ${
                  theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span>{t('nav_help')}</span>
              </button>
            </nav>

            {/* Mobile Auth Actions */}
            <div className={`pt-4 border-t flex flex-col space-y-2.5 ${
              theme === 'light' ? 'border-slate-200' : 'border-white/10'
            }`}>
              {userProfile ? (
                <>
                  <button
                    onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-md cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-300" />
                    <span>My Dashboard ({userProfile.role === 'ADMIN' ? 'Admin' : 'Business'})</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthWithMode('signin-user')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-md transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-emerald-300" />
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => openAuthWithMode('signup-user')}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition cursor-pointer ${
                      theme === 'light'
                        ? 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                        : 'text-white bg-white/10 hover:bg-white/15 border-white/10'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-sky-500" />
                    <span>Sign Up</span>
                  </button>

                  <button
                    onClick={() => openAuthWithMode('signin-admin')}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      theme === 'light'
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-300'
                        : 'text-amber-300 bg-amber-500/15 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Admin Login</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
