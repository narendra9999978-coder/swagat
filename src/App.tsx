import React, { useState, useEffect } from 'react';
import { SwagatProvider, useSwagat } from './context/SwagatContext';
import { LanguageProvider } from './context/LanguageContext';
import { SplashAnimation } from './components/SplashAnimation';
import { HeaderNavbar } from './components/HeaderNavbar';
import { HeroSection } from './components/HeroSection';
import { QuickStatsSection } from './components/QuickStatsSection';
import { SectorGrid } from './components/SectorGrid';
import { ExploreIndiaSection } from './components/ExploreIndiaSection';
import { ApprovalsDirectory } from './components/ApprovalsDirectory';
import { StateApprovalsSection } from './components/StateApprovalsSection';
import { SchemesSection } from './components/SchemesSection';
import { KnowYourApprovals } from './components/KnowYourApprovals';
import { ApplicationTrackingSection } from './components/ApplicationTrackingSection';
import { BenefitsSection } from './components/BenefitsSection';
import { AboutSection } from './components/AboutSection';
import { HelpCenterSection } from './components/HelpCenterSection';
import { CallToActionBanner } from './components/CallToActionBanner';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { AdminDashboard } from './components/AdminDashboard';
import { SectorWizard } from './components/SectorWizard';
import { AuthModal } from './components/AuthModal';
import { ApplyModal } from './components/ApplyModal';
import { ApprovalDetailModal } from './components/ApprovalDetailModal';
import { StateDetailModal } from './components/StateDetailModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QueryModal } from './components/QueryModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { AmbientBackground } from './components/AmbientBackground';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { currentView, setCurrentView, toastMessage, userProfile, wizardSession, showToast } = useSwagat();

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  // ── Protected Route Guarding & URL Synchronization ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do NOT run redirect or access-denied ejection while OAuth hash tokens or auth codes are being exchanged
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('access_token') || hash.includes('id_token') || hash.includes('refresh_token') || search.includes('code=')) {
      return;
    }

    const path = window.location.pathname;

    if (path === '/admin/dashboard' || currentView === 'admin-dashboard') {
      if (!userProfile) {
        showToast("Access Denied — You don't have administrator permissions.");
        setCurrentView('home');
        window.history.replaceState({}, '', '/');
      } else if (userProfile.role !== 'ADMIN') {
        showToast("Access Denied — You don't have administrator permissions.");
        setCurrentView('dashboard');
        window.history.replaceState({}, '', '/dashboard');
      }
    } else if (path === '/dashboard' || currentView === 'dashboard') {
      if (!userProfile) {
        setCurrentView('home');
        window.history.replaceState({}, '', '/');
      } else if (userProfile.role === 'ADMIN') {
        setCurrentView('admin-dashboard');
        window.history.replaceState({}, '', '/admin/dashboard');
      }
    }
  }, [currentView, userProfile]);

  // If returning from Google OAuth redirect, show authenticating screen while onAuthStateChange resolves
  const isOAuthRedirectInFlight = typeof window !== 'undefined' &&
    (window.location.hash.includes('access_token') || window.location.hash.includes('id_token')) &&
    !userProfile;

  if (isOAuthRedirectInFlight) {
    return (
      <div className="min-h-screen bg-[#07182C] text-white flex flex-col items-center justify-center space-y-4 font-sans selection:bg-amber-400/30">
        <div className="w-12 h-12 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold tracking-tight">Authenticating with Google</h2>
        <p className="text-sm text-slate-400">Verifying authorized credentials and portal permissions...</p>
      </div>
    );
  }

  // ── Role-based dashboard routing ────────────────────────────────────────────

  const renderDashboard = () => {
    if (!userProfile) return null;

    if (userProfile.role === 'ADMIN') {
      return <AdminDashboard />;
    }

    if (userProfile.role === 'USER') {
      if (currentView === 'wizard' && wizardSession) {
        return <SectorWizard />;
      }
      return <DashboardView />;
    }

    // Default fallback
    return <DashboardView />;
  };

  const isInDashboard = (currentView === 'dashboard' || currentView === 'admin-dashboard' || currentView === 'wizard') && userProfile !== null;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-amber-400/30 selection:text-white relative">
      {/* Reactbits Beams & Dot-Field Ambient Background */}
      <AmbientBackground />
      
      {/* Splash */}
      {showSplash && (
        <SplashAnimation onComplete={handleSplashComplete} />
      )}

      {/* Main App Layout */}
      {isInDashboard ? (
        renderDashboard()
      ) : (
        <>
          <HeaderNavbar />

          <main className="flex-grow">
            <HeroSection />
            <QuickStatsSection />
            <SectorGrid />
            <ExploreIndiaSection />
            <ApprovalsDirectory />
            <StateApprovalsSection />
            <SchemesSection />
            <KnowYourApprovals />
            <ApplicationTrackingSection />
            <BenefitsSection />
            <AboutSection />
            <HelpCenterSection />
            <CallToActionBanner />
          </main>

          <Footer />
        </>
      )}

      {/* Interactive Modals */}
      <AuthModal />
      <ApplyModal />
      <ApprovalDetailModal />
      <StateDetailModal />
      <SchemeDetailModal />
      <GlobalSearchModal />
      <QueryModal />
      <DocumentPreviewModal />

      {/* Watermelon Notification-3 Glass Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-md">
          <div className="relative overflow-hidden p-4 rounded-2xl bg-slate-950/85 text-white shadow-2xl border border-white/15 backdrop-blur-2xl text-xs font-semibold flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <span className="leading-snug pr-2 text-slate-200">{toastMessage}</span>
            {/* Watermelon Toast Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 animate-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <SwagatProvider>
        <AppContent />
      </SwagatProvider>
    </LanguageProvider>
  );
}
