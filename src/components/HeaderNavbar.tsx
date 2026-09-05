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
  MapPin
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const threeDotRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

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
      if (threeDotRef.current && !threeDotRef.current.contains(event.target as Node)) {
        setIsThreeDotOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: typeof currentView, hashTarget?: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    if (hashTarget && view === 'home') {
      const el = document.getElementById(hashTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  const openAuthWithMode = (mode: 'signin-investor' | 'signup-investor' | 'signin-officer' | 'signup-officer' | 'signin-super') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsThreeDotOpen(false);
    setIsLoginDropdownOpen(false);
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
      <div className="bg-[#07182C] text-slate-300 text-[11px] font-medium py-1 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden md:block">
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
              <span>National Single Window Architecture</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">1,400+ Central &amp; State Approvals</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            
            {/* Left: SWAGAT Brand Logo & Navigation Links */}
            <div className="flex items-center space-x-3 xl:space-x-6 min-w-0">
              <button
                id="swagat-brand-home-btn"
                onClick={handleLogoClick}
                className="focus:outline-hidden text-left cursor-pointer shrink-0"
                title="SWAGAT Portal (Click 5 times for Super Admin)"
              >
                <SwagatLogo size="md" showWordmark={true} showTagline={false} theme="light" />
              </button>

              {/* Main Navigation Links moved to left next to logo */}
              <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 font-medium text-xs xl:text-sm text-slate-700 whitespace-nowrap">
                <button
                  id="nav-link-home"
                  onClick={() => handleNavClick('home')}
                  className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg transition-colors ${
                    currentView === 'home' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                  }`}
                >
                  {t('nav_home')}
                </button>

                <button
                  id="nav-link-kya"
                  onClick={() => handleNavClick('home', 'section-kya')}
                  className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg text-amber-700 font-semibold hover:bg-amber-50/80 transition-colors flex items-center space-x-1"
                >
                  <Compass className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-600 shrink-0" />
                  <span>{t('nav_kya')}</span>
                </button>

                <button
                  id="nav-link-approvals"
                  onClick={() => handleNavClick('home', 'section-approvals')}
                  className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg transition-colors ${
                    currentView === 'approvals' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                  }`}
                >
                  {t('nav_approvals')}
                </button>

                <button
                  id="nav-link-schemes"
                  onClick={() => handleNavClick('home', 'section-schemes')}
                  className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg transition-colors ${
                    currentView === 'schemes' ? 'text-[#07182C] font-bold bg-slate-100' : 'hover:text-[#07182C] hover:bg-slate-50'
                  }`}
                >
                  {t('nav_schemes')}
                </button>

                <button
                  id="nav-link-states"
                  onClick={() => handleNavClick('home', 'section-states')}
                  className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors"
                >
                  {t('state_approvals')}
                </button>

                <button
                  id="nav-link-about"
                  onClick={() => handleNavClick('home', 'section-about')}
                  className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors"
                >
                  {t('nav_about')}
                </button>

                <button
                  id="nav-link-help"
                  onClick={() => handleNavClick('home', 'section-help')}
                  className="px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:text-[#07182C] hover:bg-slate-50 transition-colors"
                >
                  {t('nav_help')}
                </button>

                {userProfile && (
                  <button
                    id="nav-link-dashboard"
                    onClick={() => handleNavClick('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      currentView === 'dashboard' 
                        ? 'bg-[#07182C] text-white shadow-xs' 
                        : 'bg-blue-50 text-[#0B2545] border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{t('nav_dashboard')}</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Right: Search, Language Selector & THREE-DOT MENU */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              
              {/* Global Search Button */}
              <button
                id="global-search-btn"
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/90 rounded-xl transition-colors flex items-center space-x-2 text-xs font-medium"
                title="Search Approvals, Schemes, Departments (Ctrl+K or /)"
              >
                <Search className="w-4 h-4 text-slate-700" />
                <span className="hidden xl:inline text-slate-500">Quick Search...</span>
                <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-300 text-slate-400 font-mono">/</kbd>
              </button>

              {/* Pan-India State Selector Dropdown */}
              <div className="relative" ref={stateRef}>
                <button
                  id="navbar-state-selector-toggle"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/70"
                  title="Select State / Union Territory"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {selectedStateFilter !== 'All' ? selectedStateFilter : 'All India (36)'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isStateDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100">
                      <span>Select State / Territory</span>
                      <span className="text-emerald-700 font-extrabold">36 Regions</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStateFilter('All');
                        setIsStateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
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
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
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
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
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

              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  id="language-selector-toggle"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/70"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#0B2545]" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
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
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
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

              {/* User Profile Badge (if logged in) */}
              {userProfile ? (
                <button
                  id="header-user-badge"
                  onClick={() => handleNavClick('dashboard')}
                  className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 rounded-xl transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold shadow-2xs ${
                    userProfile.role === 'super_admin' ? 'bg-purple-700' :
                    userProfile.role === 'officer' ? 'bg-[#07182C]' : 'bg-emerald-700'
                  }`}>
                    {userProfile.avatarInitials}
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-emerald-950 truncate max-w-[110px]">{userProfile.name}</div>
                    <div className="text-[10px] text-emerald-700 font-medium capitalize">
                      {userProfile.role === 'super_admin' ? 'Super Admin' : userProfile.role === 'officer' ? 'Officer Portal' : 'Business User'}
                    </div>
                  </div>
                </button>
              ) : (
                /* Login Dropdown Button — shown only when not logged in */
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    id="login-dropdown-btn"
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#07182C] hover:bg-[#0B2545] text-white text-sm font-bold rounded-xl transition-all shadow-md"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                        Select Portal
                      </div>

                      <button
                        id="login-as-investor-btn"
                        onClick={() => openAuthWithMode('signin-investor')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition group"
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
                        id="login-as-officer-btn"
                        onClick={() => openAuthWithMode('signin-officer')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition">
                            <ShieldCheck className="w-4 h-4 text-[#07182C]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Ministry Officer Login</div>
                            <div className="text-[10px] text-slate-500">Department Admin</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* THREE-DOT VERTICAL MENU (Requested specifically) */}
              <div className="relative" ref={threeDotRef}>
                <button
                  id="three-dot-menu-btn"
                  onClick={() => setIsThreeDotOpen(!isThreeDotOpen)}
                  className="p-2.5 text-slate-700 hover:text-[#07182C] bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 flex items-center justify-center"
                  aria-label="Account and Access Menu"
                  title="Menu & Access"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {isThreeDotOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 divide-y divide-slate-100">
                    
                    {/* User Profile Header if Logged In */}
                    {userProfile ? (
                      <div className="px-4 py-3 bg-slate-50/80">
                        <div className="text-xs font-bold text-[#07182C]">{userProfile.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{userProfile.companyName}</div>
                        <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{userProfile.role === 'investor' ? 'Investor / Business Portal' : 'Ministry Officer Portal'}</span>
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
                              handleNavClick('dashboard');
                              setIsThreeDotOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center space-x-2.5"
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
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5"
                          >
                            <FileCheck2 className="w-4 h-4 text-slate-500" />
                            <span>My Applications &amp; Tracking</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            id="menu-action-login-investor"
                            onClick={() => openAuthWithMode('signin-investor')}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#07182C] hover:bg-slate-100 flex items-center space-x-2.5"
                          >
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span>Business User Login</span>
                          </button>

                          <button
                            id="menu-action-login-officer"
                            onClick={() => openAuthWithMode('signin-officer')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5"
                          >
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Ministry Officer Login</span>
                          </button>

                          <button
                            id="menu-action-signup-investor"
                            onClick={() => openAuthWithMode('signup-investor')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 flex items-center space-x-2.5"
                          >
                            <UserPlus className="w-4 h-4 text-slate-400" />
                            <span>New Business Account</span>
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
                          {userProfile.role === 'super_admin' ? <ShieldCheck className="w-4 h-4 text-purple-600" /> :
                           userProfile.role === 'officer' ? <ShieldCheck className="w-4 h-4 text-[#0B2545]" /> :
                           <Building2 className="w-4 h-4 text-emerald-600" />}
                          <span className="font-semibold">{userProfile.role === 'super_admin' ? 'Super Administrator' : userProfile.role === 'officer' ? 'Ministry / Dept Officer' : 'Business / Investor'}</span>
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
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span>{t('menu_help')}</span>
                      </button>

                      <button
                        id="menu-contact"
                        onClick={() => {
                          handleNavClick('home', 'section-help');
                          setIsThreeDotOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center space-x-2.5"
                      >
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{t('menu_contact')}</span>
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
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{t('menu_logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                id="mobile-menu-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-1">
            <nav className="flex flex-col space-y-1 font-medium text-sm text-slate-800">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('nav_home')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-kya')}
                className="text-left px-3 py-2.5 rounded-lg text-amber-700 font-bold bg-amber-50/60"
              >
                {t('nav_kya')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-approvals')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('nav_approvals')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-schemes')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('nav_schemes')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-states')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('state_approvals')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-about')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('nav_about')}
              </button>
              <button
                onClick={() => handleNavClick('home', 'section-help')}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
              >
                {t('nav_help')}
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              {userProfile ? (
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-[#07182C] rounded-xl shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Go to My Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthWithMode('signin-investor')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#07182C] to-[#0B2545] rounded-xl shadow-md"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
