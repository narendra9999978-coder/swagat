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
  Layers,
  BookOpen
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { SwagatLogo } from './SwagatLogo';
import { allIndianStatesList } from '../data/indiaStatesData';

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
      {/* Top Single Window Assurance Bar */}
      <div className="bg-[#07182C] text-slate-300 text-[11px] font-medium py-1 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden md:block select-none">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">SWAGAT</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Digital Single-Window for Business &amp; Industrial Approvals in India</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="text-amber-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Single Window Approval Gateway</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">1,400+ Central &amp; State Approvals</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — Fixed & High Z-Index */}
      <header className="sticky top-0 z-[1000] swagat-navbar-header bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="swagat-header-grid h-20 w-full">
            
            {/* ─────────────────────────────────────────────────────────────
                COLUMN 1: SWAGAT Brand Logo (swagat-brand)
                ───────────────────────────────────────────────────────────── */}
            <div className="swagat-brand">
              <button
                id="swagat-brand-home-btn"
                onClick={handleLogoClick}
                className="focus:outline-hidden text-left cursor-pointer shrink-0"
                title="SWAGAT Portal (Click 5 times for Super Admin)"
              >
                <SwagatLogo size="md" showWordmark={true} showTagline={false} theme="light" />
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                COLUMN 2: Primary Navigation Links (swagat-primary-nav)
                - Strictly bounded between Column 1 and Column 3
                - >= 1400px: Shows all links (Home, Approvals, Sectors, KYA, State Approvals, Resources, Help)
                - 1200px - 1399px: Shows Home, Approvals, Sectors, KYA, State Approvals; Resources & Help in More ▾
                - 901px - 1199px: Shows Home, Approvals, Sectors, KYA; State Approvals, Resources & Help in More ▾
                - <= 900px: Hidden (handled by Hamburger panel)
                ───────────────────────────────────────────────────────────── */}
            <nav className="swagat-primary-nav hidden min-[901px]:flex items-center justify-center font-medium text-xs min-[1400px]:text-sm text-slate-700 whitespace-nowrap">
              
              {/* 1. Home (Priority 1) */}
              <button
                id="nav-link-home"
                onClick={() => handleNavClick('home')}
                className={`px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  currentView === 'home' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                }`}
              >
                {t('nav_home')}
              </button>

              {/* 2. Approvals (Priority 1) */}
              <button
                id="nav-link-approvals"
                onClick={() => handleNavClick('home', 'section-approvals')}
                className={`px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  currentView === 'approvals' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                }`}
              >
                {t('nav_approvals')}
              </button>

              {/* 3. Sectors (Priority 1) */}
              <button
                id="nav-link-schemes"
                onClick={() => handleNavClick('home', 'section-schemes')}
                className={`px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  currentView === 'schemes' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                }`}
              >
                Sectors
              </button>

              {/* 4. Know Your Approvals (Priority 1, Highlighted) */}
              <button
                id="nav-link-kya"
                onClick={() => handleNavClick('home', 'section-kya')}
                className="px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg text-amber-700 font-semibold hover:bg-amber-50/80 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 min-[1400px]:w-4 min-[1400px]:h-4 text-amber-600 shrink-0" />
                <span>{t('nav_kya')}</span>
              </button>

              {/* 5. State Approvals (Visible on >= 1200px, in More on 901px-1199px) */}
              <button
                id="nav-link-states"
                onClick={() => handleNavClick('home', 'section-states')}
                className="hidden min-[1200px]:inline-block px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              >
                {t('state_approvals')}
              </button>

              {/* 6. Resources (Visible on >= 1400px, in More on 901px-1399px) */}
              <button
                id="nav-link-about"
                onClick={() => handleNavClick('home', 'section-about')}
                className="hidden min-[1400px]:inline-block px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              >
                Resources
              </button>

              {/* 7. Help (Visible on >= 1400px, in More on 901px-1399px) */}
              <button
                id="nav-link-help"
                onClick={() => handleNavClick('home', 'section-help')}
                className="hidden min-[1400px]:inline-block px-2 min-[1200px]:px-2.5 min-[1400px]:px-3 py-1.5 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              >
                {t('nav_help')}
              </button>

              {/* Responsive "More ▾" dropdown menu (Visible on 901px to 1399px) */}
              <div className="relative min-[1400px]:hidden shrink-0" ref={moreRef}>
                <button
                  id="nav-link-more"
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors font-medium text-xs text-slate-700 cursor-pointer ${
                    isMoreDropdownOpen ? 'bg-slate-100 font-bold text-[#07182C]' : 'hover:text-[#07182C] hover:bg-slate-50'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-[1050] animate-in fade-in slide-in-from-top-1">
                    <button
                      onClick={() => handleNavClick('home', 'section-states')}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#07182C] transition-colors flex items-center space-x-2 min-[1200px]:hidden"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('state_approvals')}</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('home', 'section-about')}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#07182C] transition-colors flex items-center space-x-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Resources</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('home', 'section-help')}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#07182C] transition-colors flex items-center space-x-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('nav_help')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Logged in Dashboard link */}
              {userProfile && (
                <button
                  id="nav-link-dashboard"
                  onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                  className={`px-2 min-[1200px]:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    currentView === 'dashboard' || currentView === 'admin-dashboard'
                      ? 'bg-[#07182C] text-white shadow-xs' 
                      : 'bg-blue-50 text-[#0B2545] border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden min-[1300px]:inline">{t('nav_dashboard')}</span>
                </button>
              )}
            </nav>

            {/* ─────────────────────────────────────────────────────────────
                COLUMN 3: Action Controls & Three-Dot Menu (swagat-actions)
                ───────────────────────────────────────────────────────────── */}
            <div className="swagat-actions">
              
              {/* Global Search Button */}
              <button
                id="global-search-btn"
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 min-[1200px]:py-2 min-[1200px]:px-2.5 min-[1400px]:px-3 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/90 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-medium shrink-0 cursor-pointer w-auto min-[1200px]:w-[130px] min-[1400px]:w-[160px]"
                title="Search Approvals, Schemes, Departments (Ctrl+K or /)"
              >
                <Search className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="hidden min-[1200px]:inline text-slate-500 truncate">Search...</span>
                <kbd className="hidden min-[1400px]:inline px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-300 text-slate-400 font-mono shrink-0 ml-auto">/</kbd>
              </button>

              {/* State Selector Dropdown (Visible on >= 901px) */}
              <div className="relative shrink-0 hidden min-[901px]:block" ref={stateRef}>
                <button
                  id="navbar-state-selector-toggle"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/70 shrink-0 cursor-pointer"
                  title="Select State / Union Territory"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="hidden min-[1200px]:inline max-w-[95px] min-[1400px]:max-w-[120px] truncate">
                    {selectedStateFilter !== 'All' ? selectedStateFilter : 'All India'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                </button>

                {isStateDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-[1050] animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100">
                      <span>Select State / Territory</span>
                      <span className="text-emerald-700 font-extrabold">36 Regions</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStateFilter('All');
                        setIsStateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedStateFilter === 'All' ? 'bg-amber-50 text-[#07182C] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>All India / Central Approvals</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
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
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          selectedStateFilter === st.name ? 'bg-emerald-50 text-[#07182C] font-bold' : 'text-slate-700'
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
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          selectedStateFilter === ut.name ? 'bg-emerald-50 text-[#07182C] font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{ut.name}</span>
                        <span className="text-[10px] text-slate-400">{ut.approvalCount}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector Dropdown (Visible on >= 901px) */}
              <div className="relative shrink-0 hidden min-[901px]:block" ref={langRef}>
                <button
                  id="language-selector-toggle"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 min-[1200px]:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/70 shrink-0 cursor-pointer"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-[1050] animate-in fade-in slide-in-from-top-1">
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
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          language === lang.code ? 'bg-blue-50 text-[#07182C] font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-[11px] text-slate-400">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile Badge (if logged in on >= 901px) */}
              {userProfile ? (
                <button
                  id="header-user-badge"
                  onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                  className="hidden min-[901px]:flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 rounded-xl transition-colors text-left shrink-0 cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0 ${
                    userProfile.role === 'ADMIN' ? 'bg-[#07182C]' : 'bg-emerald-700'
                  }`}>
                    {userProfile.avatarInitials}
                  </div>
                  <div className="leading-tight hidden min-[1200px]:block">
                    <div className="text-xs font-bold text-emerald-950 truncate max-w-[100px]">{userProfile.name}</div>
                    <div className="text-[10px] text-emerald-700 font-medium capitalize">
                      {userProfile.role === 'ADMIN' ? 'Admin Portal' : 'Business User'}
                    </div>
                  </div>
                </button>
              ) : (
                /* Login Dropdown Button (shown when not logged in on >= 901px) */
                <div className="relative shrink-0 hidden min-[901px]:block" ref={loginDropdownRef}>
                  <button
                    id="login-dropdown-btn"
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-[1050] animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                        Select Portal
                      </div>

                      <button
                        id="login-as-user-btn"
                        onClick={() => openAuthWithMode('signin-user')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Business User Login</div>
                            <div className="text-[10px] text-slate-500">Investor / Entrepreneur</div>
                          </div>
                        </div>
                      </button>

                      <button
                        id="login-as-admin-btn"
                        onClick={() => openAuthWithMode('signin-admin')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition group border-t border-slate-100 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Admin Login</div>
                            <div className="text-[10px] text-slate-500">Ministry / Dept Administrator</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* THREE-DOT VERTICAL MENU (Login, Sign Up, Admin Login, Help, Contact) */}
              <div className="relative shrink-0" ref={threeDotRef}>
                <button
                  id="three-dot-menu-btn"
                  onClick={() => setIsThreeDotOpen(!isThreeDotOpen)}
                  className="p-2 sm:p-2.5 text-slate-700 hover:text-[#07182C] bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Account and Access Menu"
                  title="Menu & Access"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </button>

                {isThreeDotOpen && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-20px)] bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-[1050] animate-in fade-in slide-in-from-top-2 divide-y divide-slate-100">
                    
                    {/* User Profile Header if Logged In */}
                    {userProfile ? (
                      <div className="px-4 py-3 bg-slate-50/80">
                        <div className="text-xs font-bold text-[#07182C]">{userProfile.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{userProfile.companyName}</div>
                        <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#0B2545]" />
                            <span>My SWAGAT Dashboard</span>
                          </button>
                          <button
                            id="menu-my-applications"
                            onClick={() => {
                              handleNavClick('dashboard');
                              setDashboardActiveTab('applications');
                              setIsThreeDotOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <FileCheck2 className="w-4 h-4 text-slate-500" />
                            <span>My Applications &amp; Tracking</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id="menu-action-login"
                            onClick={() => openAuthWithMode('signin-user')}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#07182C] hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <LogIn className="w-4 h-4 text-emerald-600" />
                            <span>Login</span>
                          </button>

                          <button
                            id="menu-action-signup"
                            onClick={() => openAuthWithMode('signup-user')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4 text-blue-600" />
                            <span>Sign Up</span>
                          </button>

                          <button
                            id="menu-action-admin-login"
                            onClick={() => openAuthWithMode('signin-admin')}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 flex items-center space-x-2.5 border-t border-slate-100 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>Admin Login</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Section 2: Role Labels */}
                    {userProfile && (
                      <div className="py-1">
                        <div className="px-4 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          Current Role
                        </div>
                        <div className="px-4 py-2 text-xs text-slate-700 flex items-center space-x-2">
                          {userProfile.role === 'ADMIN'
                            ? <ShieldCheck className="w-4 h-4 text-amber-600" />
                            : <Building2 className="w-4 h-4 text-emerald-600" />}
                          <span className="font-semibold">{userProfile.role === 'ADMIN' ? 'System Administrator' : 'Business User'}</span>
                        </div>
                      </div>
                    )}

                    {/* Section 3: Help & Contact */}
                    <div className="py-1">
                      <button
                        id="menu-help-support"
                        onClick={() => {
                          handleNavClick('home', 'section-help');
                          setIsThreeDotOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span>Help</span>
                      </button>

                      <button
                        id="menu-contact"
                        onClick={() => {
                          handleNavClick('home', 'section-help');
                          setIsThreeDotOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5 cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>Contact</span>
                      </button>
                    </div>

                    {/* Section 4: Logout if logged in */}
                    {userProfile && (
                      <div className="py-1">
                        <button
                          id="menu-action-logout"
                          onClick={() => {
                            logout();
                            setIsThreeDotOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{t('menu_logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Toggle Button (Visible on screens <= 900px) */}
              <button
                id="mobile-menu-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl min-[901px]:hidden shrink-0 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 4: Mobile Navigation Panel (Clean, Full, Scrollable)
            Visible on screens <= 900px
            ───────────────────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="min-[901px]:hidden fixed inset-x-0 top-[80px] bg-white border-t border-slate-200 shadow-2xl z-[1050] max-h-[calc(100vh-80px)] overflow-y-auto px-4 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2">
            
            {/* Primary Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1 font-medium text-sm text-slate-800">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>{t('nav_home')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-approvals')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>{t('nav_approvals')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-schemes')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>Sectors</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-kya')}
                className="text-left px-3.5 py-2.5 rounded-xl text-amber-800 font-bold bg-amber-50/80 border border-amber-200/60 transition flex items-center space-x-2.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t('nav_kya')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-states')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>{t('state_approvals')}</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-about')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>Resources</span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'section-help')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-3 cursor-pointer"
              >
                <span>{t('nav_help')}</span>
              </button>
            </nav>

            {/* Mobile Auth & Account Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2.5">
              {userProfile ? (
                <>
                  <button
                    onClick={() => handleNavClick(userProfile.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-[#07182C] rounded-xl shadow-md cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>My Dashboard ({userProfile.role === 'ADMIN' ? 'Admin' : 'Business'})</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider px-1">
                    Account Access
                  </div>

                  <button
                    onClick={() => openAuthWithMode('signin-user')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-md transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => openAuthWithMode('signup-user')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Sign Up</span>
                  </button>

                  <button
                    onClick={() => openAuthWithMode('signin-admin')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Login</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile State & Language Quick Switcher */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">State / Territory</span>
                <span className="font-semibold text-emerald-800 truncate">
                  {selectedStateFilter !== 'All' ? selectedStateFilter : 'All India (36)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Language</span>
                <span className="font-semibold text-blue-900">
                  {currentLangObj.native}
                </span>
              </div>
            </div>

          </div>
        )}
      </header>
    </>
  );
};
