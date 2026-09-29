import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { useSwagat } from '../context/SwagatContext';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  User, 
  Building2, 
  GraduationCap, 
  FileCheck2, 
  Award, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const LiveDemoSection: React.FC = () => {
  const { t } = useLanguage();
  const { currentScenario, selectScenario, openAskModal } = useJourney();
  const { theme } = useSwagat();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<string>(currentScenario.id);

  const scenarioTabs = [
    { id: 'small-business', label: 'Food Business', query: 'I want to start a small restaurant in Maharashtra.', icon: Building2 },
    { id: 'child-scholarship', label: 'Higher Education', query: 'I need a scholarship for my child.', icon: GraduationCap },
    { id: 'scheme-discovery', label: 'Welfare Schemes', query: 'Which government schemes am I eligible for?', icon: Award },
    { id: 'government-certificate', label: 'Certificates', query: 'I need a government certificate.', icon: FileCheck2 },
  ];

  const handleScenarioChange = (id: string) => {
    setActiveTab(id);
    selectScenario(id);
  };

  const handleBuildJourney = () => {
    // Scroll to dashboard and trigger ask modal or dashboard focus
    const dashboardElem = document.getElementById('my-journey');
    if (dashboardElem) {
      dashboardElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="live-demo" className={`py-16 sm:py-24 border-b transition-colors ${
      isDark
        ? 'bg-transparent border-white/8'
        : 'bg-gradient-to-b from-[#F8FAFC] to-white border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark
              ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>{t('demo_badge')}</span>
          </div>
          <h2 className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B2545]'
          }`}>
            {t('demo_heading')}
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t('demo_subheading')}
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {scenarioTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`demo-scenario-${tab.id}`}
                onClick={() => handleScenarioChange(tab.id)}
                className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? isDark
                      ? 'bg-sky-500/20 text-white shadow-lg ring-2 ring-sky-400/30 scale-105 border border-sky-400/30'
                      : 'bg-[#0B2545] text-white shadow-gov-md ring-2 ring-[#0B2545]/20 scale-105'
                    : isDark
                      ? 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] border border-white/10'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : isDark ? 'text-amber-400' : 'text-[#E05A10]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Simulator Container */}
        <div className={`max-w-4xl mx-auto rounded-3xl shadow-gov-xl overflow-hidden border ${
          isDark
            ? 'bg-slate-950/80 border-white/10'
            : 'bg-white border-slate-200/90'
        }`}>
          
          {/* Top Window Bar */}
          <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono text-[11px] text-slate-400">swagat.gov.in/journey-engine</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-300">AI Synthesizer Active</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* User Query Message Bubble */}
            <div className="flex items-start space-x-3.5 max-w-2xl">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 font-bold text-sm ${
                isDark
                  ? 'bg-white/10 border-white/10 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {currentScenario.persona.avatar}
              </div>
              <div className={`rounded-2xl rounded-tl-none p-4 border shadow-sm ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-slate-100 border-slate-200/80 text-slate-900'
              }`}>
                <div className={`text-[11px] font-bold mb-1 flex items-center space-x-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{currentScenario.persona.name} ({currentScenario.persona.location})</span>
                  <span>•</span>
                  <span>Goal Statement</span>
                </div>
                <div className={`text-sm sm:text-base font-semibold italic ${
                  isDark ? 'text-white' : 'text-[#0B2545]'
                }`}>
                  "{currentScenario.query}"
                </div>
              </div>
            </div>

            {/* SWAGAT Response Interface */}
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#134074] text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>

              <div className={`flex-1 rounded-2xl rounded-tl-none p-5 sm:p-6 border shadow-sm space-y-6 ${
                isDark
                  ? 'bg-gradient-to-b from-blue-500/10 to-slate-900/60 border-blue-400/20'
                  : 'bg-gradient-to-b from-blue-50/50 to-white border-blue-100'
              }`}>
                
                {/* AI Header Response */}
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E05A10]">
                      SWAGAT Journey Assistant
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDark
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Verified Jurisdictional Match
                    </span>
                  </div>
                  <p className={`text-sm sm:text-base font-bold ${
                    isDark ? 'text-white' : 'text-[#0B2545]'
                  }`}>
                    {currentScenario.summary}
                  </p>
                </div>

                {/* We can help you explore (Checklist Grid) */}
                <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-slate-200'
                }`}>
                  <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>{t('demo_help_explore')}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentScenario.relevantServices.map((srv, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-start space-x-2.5 p-2 rounded-lg border text-xs ${
                          isDark
                            ? 'bg-white/[0.03] border-white/5'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>✓</span>
                        <div>
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{srv.name}</div>
                          <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {srv.department} • <span className={`font-medium ${isDark ? 'text-sky-300' : 'text-blue-700'}`}>{srv.portal}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalized Journey Roadmap Preview */}
                <div>
                  <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t('demo_personalized_roadmap')}
                  </h4>

                  <div className="space-y-2">
                    {currentScenario.journeySteps.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs shadow-sm transition ${
                          isDark
                            ? 'bg-white/[0.04] border-white/10 hover:border-sky-400/30'
                            : 'bg-white border-slate-200/90 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            step.status === 'completed'
                              ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                              : step.status === 'current'
                              ? isDark ? 'bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30' : 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                              : isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</span>
                            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{step.department}</div>
                          </div>
                        </div>

                        <span className={`text-[11px] font-semibold shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {step.estimatedDays}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA: "Build My Journey ->" */}
                <div className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t ${
                  isDark ? 'border-white/10' : 'border-blue-100'
                }`}>
                  <div className={`flex items-center space-x-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>Cross-referenced with State &amp; Central portals</span>
                  </div>

                  <button
                    id="build-journey-demo-btn"
                    onClick={handleBuildJourney}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0B2545] to-[#134074] hover:from-[#134074] hover:to-[#0B2545] shadow-gov-md hover:shadow-gov-lg transition active:scale-95"
                  >
                    <span>{t('demo_build_btn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
