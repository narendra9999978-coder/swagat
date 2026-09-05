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
  const { currentView, toastMessage } = useSwagat();

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#07182C] flex flex-col font-sans selection:bg-amber-400/30 selection:text-[#07182C]">
      
      {/* 1. Initial Animated Logo Splash Screen */}
      {showSplash && (
        <SplashAnimation onComplete={handleSplashComplete} />
      )}

      {/* Main App Layout */}
      {currentView === 'dashboard' ? (
        /* Post-Login Full Dashboard View */
        <DashboardView />
      ) : (
        /* Comprehensive Homepage Layout in Exact 15-Point Order */
        <>
          {/* 2. Header with logo, pan-India state selector, language selector, search bar, login/register */}
          <HeaderNavbar />

          <main className="flex-grow">
            {/* 3. Hero Section: headline, subhead, State + Sector quick selector, CTA buttons, background India map */}
            <HeroSection />

            {/* 4. Quick statistics banner: 36 States/UTs, 1400+ Approvals, 450+ Schemes, 15-28 Days Avg Clearance */}
            <QuickStatsSection />

            {/* 5. Sector grid: 24 sector cards with vector Lucide icons and approval counts */}
            <SectorGrid />

            {/* 6. Explore India section: interactive India map on left, state list on right */}
            <ExploreIndiaSection />

            {/* 7. Central Approvals directory: tabbed by category, searchable, with 'Apply' buttons */}
            <ApprovalsDirectory />

            {/* 8. State Approvals directory: state selector tabs, category filters */}
            <StateApprovalsSection />

            {/* 9. Government Schemes & Subsidies: PLI, MSME, state incentives */}
            <SchemesSection />

            {/* 10. 'Know Your Approvals' wizard preview / trigger */}
            <KnowYourApprovals />

            {/* 11. Application tracking tool: enter application number, see timeline */}
            <ApplicationTrackingSection />

            {/* 12. Why SWAGAT: single window benefits, SLA enforcement, digital locker integration */}
            <BenefitsSection />
            <AboutSection />

            {/* 13. FAQ / Help section: common questions, nodal officer contacts */}
            <HelpCenterSection />

            {/* 14. Call-to-action banner: 'Ready to start your business in India?' */}
            <CallToActionBanner />
          </main>

          {/* 15. Footer: links, disclaimers, contact info, pan-India coverage note */}
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

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-md">
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
