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
  BookOpen
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
 * Dark Glassmorphism floating navbar with spring pill transitions and micro status indicators
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
    setSelectedStateFilter
  } = useSwagat();

  const { language, setLanguage, t } = useLanguage();
  const [isThreeDotOpen, setIsThreeDotOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const threeDotRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

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
    <>
      {/* Top Single Window Assurance Bar with Reactbits Status-Mark */}
      <div className="bg-[#030812] text-slate-400 text-[11px] font-medium py-1 px-4 sm:px-6 lg:px-8 border-b border-white/5 hidden md:block select-none">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusMark status="active" size="sm" showPing={true} />
            <span className="font-semibold text-white">SWAGAT</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Digital Single-Window for Business &amp; Industrial Approvals in India</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="text-amber-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Single Window Approval Gateway</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-300">1,400+ Central &amp; State Clearances</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Watermelon Navigation 4 / Navbar 2) */}
      <header className="sticky top-0 z-[1000] bg-[#071322]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl text-white">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="swagat-header-grid h-20 w-full">
            
            {/* COLUMN 1: SWAGAT Brand Logo */}
            <div className="swagat-brand w-[235px] min-w-[235px] max-w-[235px] shrink-0">
              <button
                id="swagat-brand-home-btn"
                onClick={handleLogoClick}
                className="focus:outline-none text-left cursor-pointer shrink-0 max-w-full"
                title="SWAGAT Portal (Click 5 times for Super Admin)"
              >
                <SwagatLogo size="md" showWordmark={true} showTagline={false} theme="dark" />
              </button>
            </div>

            {/* COLUMN 2: Primary Navigation Links */}
            <nav className="swagat-primary-nav hidden min-[901px]:flex items-center justify-center font-medium text-xs min-[1400px]:text-sm text-slate-300 whitespace-nowrap">
              
              {/* Home */}
              <button
                id="nav-link-home"
                onClick={() => handleNavClick('home')}
                className={`relative px-3 py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white shrink-0 cursor-pointer ${
                  currentView === 'home' ? 'text-white font-bold bg-white/10 shadow-xs border border-white/15' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                {t('nav_home')}
              </button>

              {/* Approvals */}
              <button
                id="nav-link-approvals"
                onClick={() => handleNavClick('home', 'section-approvals')}
                className={`relative px-3 py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white shrink-0 cursor-pointer ${
                  currentView === 'approvals' ? 'text-white font-bold bg-white/10 shadow-xs border border-white/15' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                {t('nav_approvals')}
              </button>

              {/* Sectors */}
              <button
                id="nav-link-schemes"
                onClick={() => handleNavClick('home', 'section-schemes')}
                className={`relative px-3 py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white shrink-0 cursor-pointer ${
                  currentView === 'schemes' ? 'text-white font-bold bg-white/10 shadow-xs border border-white/15' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                Sectors
              </button>

              {/* Know Your Approvals (Highlighted) */}
              <button
                id="nav-link-kya"
                onClick={() => handleNavClick('home', 'section-kya')}
                className="px-3 py-1.5 rounded-xl text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-sm shadow-amber-500/10"
              >
                <Compass className="w-3.5 h-3.5 min-[1400px]:w-4 min-[1400px]:h-4 text-amber-400 shrink-0" />
                <span>{t('nav_kya')}</span>
              </button>

              {/* State Approvals */}
              <button
                id="nav-link-states"
                onClick={() => handleNavClick('home', 'section-states')}
                className="hidden min-[1200px]:inline-block px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer text-slate-300"
              >
                {t('state_approvals')}
              </button>

              {/* Resources */}
              <button
                id="nav-link-about"
                onClick={() => handleNavClick('home', 'section-about')}
                className="hidden min-[1350px]:inline-block px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer text-slate-300"
              >
                Resources
              </button>

              {/* Help */}
              <button
                id="nav-link-help"
                onClick={() => handleNavClick('home', 'section-help')}
                className="hidden min-[1400px]:inline-block px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer text-slate-300"
              >
                {t('nav_help')}
              </button>

              {/* Responsive More dropdown */}
              <div className="relative min-[1400px]:hidden shrink-0" ref={moreRef}>
                <button
                  id="nav-link-more"
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl transition-colors font-medium text-xs cursor-pointer ${
                    isMoreDropdownOpen ? 'bg-white/10 font-bold text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
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
                      className="absolute left-0 mt-2 w-48 bg-slate-950/90 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl py-1.5 z-[1050]"
                    >
                      <button
                        onClick={() => handleNavClick('home', 'section-states')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2 min-[1200px]:hidden"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('state_approvals')}</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('home', 'section-about')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2 min-[1350px]:hidden"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Resources</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('home', 'section-help')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
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
            <div className="swagat-actions">
              
              {/* Global Search Button with ⌘K */}
              <button
                id="global-search-btn"
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 min-[1200px]:py-2 min-[1200px]:px-2.5 min-[1400px]:px-3 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-medium shrink-0 cursor-pointer w-auto min-[1200px]:w-[130px] min-[1400px]:w-[160px]"
                title="Search Approvals, Schemes, Departments (Cmd+K or /)"
              >
                <Search className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="hidden min-[1200px]:inline text-slate-400 truncate">Search...</span>
                <kbd className="hidden min-[1400px]:inline px-1.5 py-0.5 text-[9px] bg-white/10 rounded border border-white/15 text-slate-300 font-mono shrink-0 ml-auto">⌘K</kbd>
              </button>

              {/* State Selector Dropdown (Watermelon Dropdown 8/12) */}
              <div className="relative shrink-0 hidden min-[901px]:block" ref={stateRef}>
                <button
                  id="navbar-state-selector-toggle"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-2 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 shrink-0 cursor-pointer"
                  title="Select State / Union Territory"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden min-[1200px]:inline max-w-[95px] min-[1400px]:max-w-[120px] truncate">
                    {selectedStateFilter !== 'All' ? selectedStateFilter : 'All India'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                <AnimatePresence>
                  {isStateDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] max-h-96 overflow-y-auto bg-slate-950/95 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl py-2 z-[1050]"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-white/10">
                        <span>Select State / Territory</span>
                        <span className="text-emerald-400 font-extrabold">36 Regions</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStateFilter('All');
                          setIsStateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                          selectedStateFilter === 'All' ? 'bg-amber-500/15 text-amber-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>All India / Central Approvals</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Pan-India
                        </span>
                      </button>

                      <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
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
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                            selectedStateFilter === st.name ? 'bg-emerald-500/15 text-emerald-300 font-bold' : 'text-slate-300'
                          }`}
                        >
                          <span className="truncate">{st.name}</span>
                          <span className="text-[10px] text-slate-400">{st.approvalCount}</span>
                        </button>
                      ))}

                      <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
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
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                            selectedStateFilter === ut.name ? 'bg-emerald-500/15 text-emerald-300 font-bold' : 'text-slate-300'
                          }`}
                        >
                          <span className="truncate">{ut.name}</span>
                          <span className="text-[10px] text-slate-400">{ut.approvalCount}</span>
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
                  className="flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-2 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 shrink-0 cursor-pointer"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-24px)] bg-slate-950/95 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl py-1.5 z-[1050]"
                    >
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
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                            language === lang.code ? 'bg-sky-500/15 text-sky-300 font-bold' : 'text-slate-300'
                          }`}
                        >
                          <span>{lang.native}</span>
                          <span className="text-[11px] text-slate-400">{lang.label}</span>
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
                  className="hidden min-[901px]:flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors text-left shrink-0 cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-lg text-slate-950 flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                    userProfile.role === 'ADMIN' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}>
                    {userProfile.avatarInitials}
                  </div>
                  <div className="leading-tight hidden min-[1200px]:block">
                    <div className="text-xs font-bold text-white truncate max-w-[100px]">{userProfile.name}</div>
                    <div className="text-[10px] text-emerald-400 font-medium capitalize">
                      {userProfile.role === 'ADMIN' ? 'Admin Portal' : 'Business User'}
                    </div>
                  </div>
                </button>
              ) : (
                /* Login Dropdown Button */
                <div className="relative shrink-0 hidden min-[901px]:block" ref={loginDropdownRef}>
                  <button
                    id="login-dropdown-btn"
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/20 shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isLoginDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] bg-slate-950/95 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl py-2 z-[1050]"
                      >
                        <div className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-white/10">
                          Select Portal
                        </div>

                        <button
                          id="login-as-user-btn"
                          onClick={() => openAuthWithMode('signin-user')}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 transition group cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                              <Building2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Business User Login</div>
                              <div className="text-[10px] text-slate-400">Investor / Entrepreneur</div>
                            </div>
                          </div>
                        </button>

                        <button
                          id="login-as-admin-btn"
                          onClick={() => openAuthWithMode('signin-admin')}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 transition group border-t border-white/5 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition">
                              <ShieldCheck className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Admin Login</div>
                              <div className="text-[10px] text-slate-400">Ministry / Dept Administrator</div>
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
                  className="p-2 sm:p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Account and Access Menu"
                  title="Menu & Access"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </button>

                <AnimatePresence>
                  {isThreeDotOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-20px)] bg-slate-950/95 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl py-2 z-[1050] divide-y divide-white/10"
                    >
                      
                      {/* User Profile Header if Logged In */}
                      {userProfile ? (
                        <div className="px-4 py-3 bg-white/5">
                          <div className="text-xs font-bold text-white">{userProfile.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{userProfile.companyName}</div>
                          <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
                              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white flex items-center space-x-2.5 cursor-pointer"
                            >
                              <LayoutDashboard className="w-4 h-4 text-sky-400" />
                              <span>My SWAGAT Dashboard</span>
                            </button>
                            <button
                              id="menu-my-applications"
                              onClick={() => {
                                handleNavClick('dashboard');
                                setDashboardActiveTab('applications');
                                setIsThreeDotOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white flex items-center space-x-2.5 cursor-pointer"
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
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 flex items-center space-x-2.5 cursor-pointer"
                            >
                              <LogIn className="w-4 h-4 text-emerald-400" />
                              <span>Login</span>
                            </button>

                            <button
                              id="menu-action-signup"
                              onClick={() => openAuthWithMode('signup-user')}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white flex items-center space-x-2.5 cursor-pointer"
                            >
                              <UserPlus className="w-4 h-4 text-sky-400" />
                              <span>Sign Up</span>
                            </button>

                            <button
                              id="menu-action-admin-login"
                              onClick={() => openAuthWithMode('signin-admin')}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 flex items-center space-x-2.5 border-t border-white/5 cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4 text-amber-400" />
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
                          className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white flex items-center space-x-2.5 cursor-pointer"
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
                          className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white flex items-center space-x-2.5 cursor-pointer"
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
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/15 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-400" />
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
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl min-[901px]:hidden shrink-0 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="min-[901px]:hidden bg-slate-950/95 border-t border-white/10 shadow-2xl backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4"
            >
              <nav className="flex flex-col space-y-1 font-medium text-sm text-slate-200">
                <button
                  onClick={() => handleNavClick('home')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>{t('nav_home')}</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-approvals')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>{t('nav_approvals')}</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-schemes')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>Sectors</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-kya')}
                  className="text-left px-3.5 py-2.5 rounded-xl text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('nav_kya')}</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-states')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>{t('state_approvals')}</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-about')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>Resources</span>
                </button>

                <button
                  onClick={() => handleNavClick('home', 'section-help')}
                  className="text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3 cursor-pointer"
                >
                  <span>{t('nav_help')}</span>
                </button>
              </nav>

              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col space-y-2.5">
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
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
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
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-sky-400" />
                      <span>Sign Up</span>
                    </button>

                    <button
                      onClick={() => openAuthWithMode('signin-admin')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin Login</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
