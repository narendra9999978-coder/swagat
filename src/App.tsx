import React, { useState } from 'react';
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
import { DeptAdminDashboard } from './components/DeptAdminDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SectorWizard } from './components/SectorWizard';
import { AuthModal } from './components/AuthModal';
import { ApplyModal } from './components/ApplyModal';
import { ApprovalDetailModal } from './components/ApprovalDetailModal';
import { StateDetailModal } from './components/StateDetailModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QueryModal } from './components/QueryModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { currentView, toastMessage, userProfile, wizardSession } = useSwagat();

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  // ── Role-based dashboard routing ────────────────────────────────────────────

  const renderDashboard = () => {
    if (!userProfile) return null;
    switch (userProfile.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'officer':
        return <DeptAdminDashboard />;
      case 'investor':
      default:
        // If wizard session is active, show wizard instead of dashboard
        if (currentView === 'wizard' && wizardSession) {
          return <SectorWizard />;
        }
        return <DashboardView />;
    }
  };

  const isInDashboard = currentView === 'dashboard' || currentView === 'wizard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#07182C] flex flex-col font-sans selection:bg-amber-400/30 selection:text-[#07182C]">
      
      {/* Splash */}
      {showSplash && (
        <SplashAnimation onComplete={handleSplashComplete} />
      )}

      {/* Main App Layout */}
      {isInDashboard && userProfile ? (
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-md">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/20 text-xs font-semibold flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
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
