import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { 
  X, 
  Sparkles, 
  Send, 
  Mic, 
  Building2, 
  GraduationCap, 
  Award, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Download, 
  Printer, 
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const AskSwagatModal: React.FC = () => {
  const { t } = useLanguage();
  const { 
    isAskModalOpen, 
    closeAskModal, 
    askModalInitialQuery, 
    createCustomJourney, 
    selectScenario,
    triggerConfetti 
  } = useJourney();

  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<typeof DEMO_SCENARIOS[0] | null>(null);

  const indianStates = [
    'Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 
    'Gujarat', 'West Bengal', 'Bihar', 'Madhya Pradesh', 'National / All India'
  ];

  const quickPrompts = [
    { title: 'Start a bakery or restaurant', id: 'small-business', query: 'I want to start a bakery in Maharashtra.' },
    { title: 'Higher education scholarship for child', id: 'child-scholarship', query: 'I need a scholarship for my child in college.' },
    { title: 'Welfare schemes & farmer assistance', id: 'scheme-discovery', query: 'Which government schemes am I eligible for as a farmer?' },
    { title: 'Apply for Domicile / Income certificate', id: 'government-certificate', query: 'I need a state domicile and income certificate.' },
  ];

  useEffect(() => {
    if (askModalInitialQuery) {
      setQuery(askModalInitialQuery);
      handleGenerate(askModalInitialQuery);
    } else {
      setQuery('');
      setGeneratedPlan(null);
    }
  }, [askModalInitialQuery, isAskModalOpen]);

  if (!isAskModalOpen) return null;

  const handleGenerate = (queryText: string) => {
    const text = queryText || query;
    if (!text.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Find matching scenario or default
      const lower = text.toLowerCase();
      let matched = DEMO_SCENARIOS[0];

      if (lower.includes('scholar') || lower.includes('child') || lower.includes('college') || lower.includes('school')) {
        matched = DEMO_SCENARIOS[1];
      } else if (lower.includes('scheme') || lower.includes('farmer') || lower.includes('support')) {
        matched = DEMO_SCENARIOS[2];
      } else if (lower.includes('certif') || lower.includes('domicile') || lower.includes('income')) {
        matched = DEMO_SCENARIOS[3];
      }

      setGeneratedPlan({
        ...matched,
        query: text,
        state: selectedState
      });
      setIsProcessing(false);
      triggerConfetti();
    }, 1200);
  };

  const handleApplyToDashboard = () => {
    if (generatedPlan) {
      selectScenario(generatedPlan.id);
      createCustomJourney(generatedPlan.query, selectedState);
      closeAskModal();
      const target = document.getElementById('my-journey');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-gov-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Ask SWAGAT — AI Journey Builder
              </h3>
              <p className="text-xs text-blue-200">
                Transform any citizen goal into a personalized step-by-step roadmap.
              </p>
            </div>
          </div>

          <button
            onClick={closeAskModal}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Query Formulation Input Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              What do you want to achieve?
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate(query)}
                  placeholder="Describe your goal (e.g. I want to open a clinic in Maharashtra, or get solar subsidy)..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:bg-white"
                />
              </div>

              {/* State Selection */}
              <div className="sm:w-48 relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleGenerate(query)}
                disabled={isProcessing || !query.trim()}
                className="px-6 py-3 bg-[#E05A10] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center space-x-2 shrink-0"
              >
                <span>{isProcessing ? 'Synthesizing...' : 'Generate Roadmap'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p.query);
                    handleGenerate(p.query);
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-xl transition"
                >
                  ⚡ {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* AI Processing Animation */}
          {isProcessing && (
            <div className="p-8 text-center bg-blue-50/50 rounded-3xl border border-blue-100 space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-[#0B2545] text-amber-300 flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-6 h-6 animate-spin [animation-duration:4s]" />
              </div>
              <h4 className="font-display font-bold text-base text-[#0B2545]">
                Synthesizing Central &amp; State Regulations...
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Consulting National Single Window System (NSWS), DigiLocker schemas, and state department SLA mandates.
              </p>
            </div>
          )}

          {/* Generated Plan Output */}
          {generatedPlan && !isProcessing && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              
              {/* Summary Banner */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#0B2545] uppercase mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Synthesized Citizen Roadmap • Jurisdiction: {generatedPlan.state}</span>
                </div>
                <h4 className="font-display font-bold text-lg text-[#0B2545]">
                  {generatedPlan.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {generatedPlan.summary}
                </p>
              </div>

              {/* 2-Column Overview: Services & Schemes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Identified Clearances */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0B2545]" />
                    <span>Applicable Government Services &amp; Clearances:</span>
                  </h5>
                  <div className="space-y-1.5">
                    {generatedPlan.relevantServices.map((srv, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block">{srv.name}</strong>
                          <span className="text-[10px] text-slate-500">{srv.department}</span>
                        </div>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {srv.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsidies & Benefits */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Unlocked Government Schemes &amp; Subsidies:</span>
                  </h5>
                  <div className="space-y-1.5">
                    {generatedPlan.applicableSchemes.map((sch, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900">{sch.name}</strong>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {sch.subsidyOrGrant}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{sch.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step Sequence */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Step-by-Step Execution Sequence:
                </h5>
                <div className="space-y-2">
                  {generatedPlan.journeySteps.map((step, idx) => (
                    <div key={step.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-slate-900">{step.title}</strong>
                          <div className="text-[11px] text-slate-500">{step.department} • Official Portal: <span className="text-blue-700 font-semibold">{step.portalName}</span></div>
                        </div>
                      </div>
                      <span className="text-slate-400 font-semibold text-[11px]">{step.estimatedDays}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Official government guidance • Linked to state RTS mandates
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={closeAskModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Close
            </button>

            {generatedPlan && (
              <button
                onClick={handleApplyToDashboard}
                className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
              >
                <span>Save to My Journey Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
