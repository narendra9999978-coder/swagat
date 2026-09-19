import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Factory, 
  Layers, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  Download,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { useLanguage } from '../context/LanguageContext';
import { allIndianStatesList } from '../data/indiaStatesData';
import { Approval } from '../types/swagat';
import { generateApprovalRoadmapPdf } from '../lib/pdfGenerator';

export const KnowYourApprovals: React.FC = () => {
  const { 
    kyaState, 
    updateKyaState, 
    approvals, 
    setSelectedApproval, 
    startApplication, 
    showToast,
    userProfile,
    setCurrentView,
    setDashboardActiveTab
  } = useSwagat();

  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stateSearch, setStateSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'central' | 'state'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const planningOptions = [
    { id: 'Start a new business', label: 'Start a new business', desc: 'Incorporate an enterprise and obtain all pre-establishment statutory permits' },
    { id: 'Expand existing business', label: 'Expand existing business', desc: 'Add new manufacturing lines, augment power load, or expand built-up capacity' },
    { id: 'Set up a manufacturing unit', label: 'Set up a manufacturing unit', desc: 'Factory setup, environmental CTE/CTO, boilers, and industrial land allotment' },
    { id: 'Open a service business', label: 'Open a service business', desc: 'IT/BPM, consulting, retail, hospitality, logistics, and commercial offices' },
    { id: 'Invest in India (FDI)', label: 'Invest in India (FDI)', desc: 'Foreign direct investment, joint ventures, and multinational subsidiary setup' },
    { id: 'Other Enterprise Project', label: 'Other Enterprise Project', desc: 'R&D labs, renewable energy farms, warehousing & logistics parks' }
  ];

  const sectorOptions = [
    'Manufacturing',
    'IT & BPM',
    'Healthcare',
    'Pharmaceuticals',
    'Food Processing',
    'Textile',
    'Automobile',
    'Electronics',
    'Construction',
    'Tourism & Hospitality',
    'Renewable Energy',
    'Chemicals',
    'Mining',
    'Retail & E-commerce',
    'Oil & Gas',
    'Aviation',
    'Other'
  ];

  const investmentOptions = [
    { label: 'Micro Enterprise (< ₹1 Crore)', value: 'Micro (< ₹1 Cr)' },
    { label: 'Small Enterprise (₹1 Crore to ₹10 Crores)', value: 'Small (₹1 - ₹10 Cr)' },
    { label: 'Medium Enterprise (₹10 Crores to ₹50 Crores)', value: 'Medium (₹10 - ₹50 Cr)' },
    { label: 'Large / Mega Project (> ₹50 Crores)', value: 'Large (> ₹50 Cr)' }
  ];

  const filteredStates = allIndianStatesList.filter(s => 
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Normalize sector labels to match approval catalog
  const getNormalizedSectorVariants = (sec: string) => {
    if (sec === 'IT & BPM') return ['IT & BPM', 'IT & Technology', 'Telecom & IT'];
    if (sec === 'Textile') return ['Textile', 'Textiles'];
    if (sec === 'Electronics') return ['Electronics', 'Electronics & Semiconductors'];
    if (sec === 'Construction') return ['Construction', 'Construction & Infrastructure'];
    return [sec];
  };

  // Filter approvals matching KYA answers
  const recommendedApprovals = approvals.filter(app => {
    const variants = getNormalizedSectorVariants(kyaState.sector);
    const sectorMatch = app.sectorApplicability.some(s => variants.includes(s) || s === 'Other' || s === 'All');
    const stateMatch = 
      app.centralOrState === 'Central' || 
      !kyaState.state ||
      app.state === 'All States' ||
      (app.statesApplicable && app.statesApplicable.includes(kyaState.state)) ||
      app.stateName === kyaState.state || 
      !app.stateName;

    return sectorMatch && stateMatch;
  });

  const centralCount = recommendedApprovals.filter(a => a.centralOrState === 'Central').length;
  const stateCount = recommendedApprovals.filter(a => a.centralOrState === 'State').length;

  const displayedApprovals = recommendedApprovals.filter(a => {
    if (activeTab === 'central') return a.centralOrState === 'Central';
    if (activeTab === 'state') return a.centralOrState === 'State';
    return true;
  });

  const handleFinishQuestionnaire = () => {
    updateKyaState({ completed: true });
    setCurrentStep(5);
    showToast(`Identified ${recommendedApprovals.length} tailored statutory approvals for ${kyaState.sector} in ${kyaState.state}!`);
  };

  const handleAddToDashboard = (approval: Approval) => {
    showToast(`Added "${approval.name}" to your dashboard checklist.`);
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      showToast('Generating official SWAGAT Approval Roadmap PDF...');
      await generateApprovalRoadmapPdf({
        projectDetails: {
          sector: kyaState.sector,
          state: kyaState.state,
          investmentSize: kyaState.investmentSize,
          planningStage: kyaState.planningType,
          businessType: kyaState.planningType
        },
        approvals: recommendedApprovals
      });
      showToast(`Downloaded SWAGAT_${kyaState.state}_${kyaState.sector}_Approval_Roadmap.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section id="section-kya" className="py-20 bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Smart Compliance Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {t('kya_heading')}
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            {t('kya_subheading')}
          </p>
        </div>

        {/* 5-Step Progress Stepper Bar */}
        <div className="mb-10 rounded-2xl p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
            {[
              { num: 1, title: 'Objective', label: '1. Intent' },
              { num: 2, title: 'Sector', label: '2. Industry' },
              { num: 3, title: 'Location', label: '3. State' },
              { num: 4, title: 'Scale & Specs', label: '4. Parameters' },
              { num: 5, title: 'Roadmap', label: '5. Approvals' },
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => {
                    if (isDone || step.num <= currentStep) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-sm' 
                      : isDone 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold mb-1 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 ring-4 ring-amber-400/20 shadow-md'
                        : 'bg-white/10 text-slate-300 border border-white/15'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <span className={`text-xs font-bold truncate max-w-full ${
                    isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Container Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all">
          
          {/* STEP 1: What are you planning? */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 1 of 5</span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  {t('kya_step1_title')}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Select your primary investment and operational objective in India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planningOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => updateKyaState({ planningType: opt.id })}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                      kyaState.planningType === opt.id
                        ? 'border-sky-400 bg-sky-500/15 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/50'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      kyaState.planningType === opt.id ? 'border-sky-400 bg-sky-500' : 'border-white/30 bg-white/5'
                    }`}>
                      {kyaState.planningType === opt.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{opt.label}</div>
                      <div className="text-xs text-slate-300 mt-1 leading-relaxed">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  id="kya-step1-next-btn"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <span>Continue to Sector</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select business sector */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 2 of 5</span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  {t('kya_step2_title')}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Choose the specific industry vertical of your proposed project.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {sectorOptions.map((sec) => {
                  const isSelected = kyaState.sector === sec;
                  return (
                    <button
                      key={sec}
                      onClick={() => updateKyaState({ sector: sec })}
                      className={`p-4 rounded-xl text-left font-semibold text-sm transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 text-white shadow-md shadow-sky-500/10 ring-1 ring-sky-400/40'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.08] text-slate-200'
                      }`}
                    >
                      <span className="truncate">{sec}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/20 shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-step2-next-btn"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select location/state */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 3 of 5</span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  {t('kya_step3_title')}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Select the Indian State or Union Territory where your unit will be located.
                </p>
              </div>

              {/* State Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter State / UT (e.g. Maharashtra, Gujarat, Karnataka, Tamil Nadu)..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:border-sky-400 text-sm text-white placeholder-slate-400"
                />
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Popular Industrial Hubs Quick Selection */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Top Industrial Destination States:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Rajasthan', 'Haryana'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateKyaState({ state: st })}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        kyaState.state === st
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-2">
                {filteredStates.map((st) => {
                  const isSelected = kyaState.state === st.name;
                  return (
                    <button
                      key={st.code}
                      onClick={() => updateKyaState({ state: st.name })}
                      className={`p-3.5 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 text-white font-bold ring-1 ring-sky-400/50'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.08] text-slate-200'
                      }`}
                    >
                      <div className="truncate">
                        <div>{st.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{st.zone} Zone • {st.type}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-step3-next-btn"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <span>Continue to Parameters</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Business details */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 4 of 5</span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  {t('kya_step4_title')}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Specify investment quantum, workforce, environmental criteria, and utility demands.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Investment Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Capital Investment in Plant &amp; Machinery
                  </label>
                  <select
                    value={kyaState.investmentSize}
                    onChange={(e) => updateKyaState({ investmentSize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    {investmentOptions.map((inv) => (
                      <option key={inv.value} value={inv.value} className="bg-slate-900 text-white">{inv.label}</option>
                    ))}
                  </select>
                </div>

                {/* Employee Count */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Anticipated Employee / Worker Strength
                  </label>
                  <select
                    value={kyaState.employeeCount}
                    onChange={(e) => updateKyaState({ employeeCount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    <option value="1 to 9 Workers" className="bg-slate-900 text-white">1 to 9 Workers (Exempt from Factory License)</option>
                    <option value="10 to 49 Workers" className="bg-slate-900 text-white">10 to 49 Workers (Factories Act Applicable)</option>
                    <option value="50 to 250 Employees" className="bg-slate-900 text-white">50 to 250 Workers / Staff</option>
                    <option value="250+ Large Workforce" className="bg-slate-900 text-white">250+ Large Workforce (Canteen/Creche Mandatory)</option>
                  </select>
                </div>

                {/* Land & Infrastructure Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Land &amp; Premises Arrangement
                  </label>
                  <select
                    value={kyaState.landRequirement}
                    onChange={(e) => updateKyaState({ landRequirement: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    <option value="Required in Industrial Estate (MIDC)" className="bg-slate-900 text-white">Industrial Development Estate (MIDC/GIDC/SIPCOT)</option>
                    <option value="Private Land (Requires NA Conversion)" className="bg-slate-900 text-white">Private Non-Agriculture (NA) Land</option>
                    <option value="Leased Commercial Building" className="bg-slate-900 text-white">Leased Commercial / Tech Park Space</option>
                    <option value="Special Economic Zone (SEZ)" className="bg-slate-900 text-white">Special Economic Zone (SEZ / EOU)</option>
                  </select>
                </div>

                {/* Power Requirement */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Electricity Power Demand
                  </label>
                  <select
                    value={kyaState.powerRequirement}
                    onChange={(e) => updateKyaState({ powerRequirement: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    <option value="High Tension (HT > 150 kVA)" className="bg-slate-900 text-white">High Tension (HT &gt; 150 kVA Substation)</option>
                    <option value="Low Tension Commercial (LT < 100 kW)" className="bg-slate-900 text-white">Low Tension Industrial / Commercial (&lt; 100 kW)</option>
                    <option value="Captive Solar / Green Power" className="bg-slate-900 text-white">Captive Solar / Green Power Open Access</option>
                  </select>
                </div>

                {/* Hazardous Substances / Effluent */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Chemicals, Solvents or Industrial Effluents
                  </label>
                  <select
                    value={kyaState.hazardousSubstances}
                    onChange={(e) => updateKyaState({ hazardousSubstances: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    <option value="Yes (Standard Industrial Solvents)" className="bg-slate-900 text-white">Yes (Requires Pollution CTE/CTO + Fire NOC)</option>
                    <option value="Yes (Bulk Petroleum / Explosives > 2500L)" className="bg-slate-900 text-white">Yes (Requires PESO License + Hazardous Waste)</option>
                    <option value="No (Clean / IT / White Category)" className="bg-slate-900 text-white">No (Clean / Zero Discharge / Green Category)</option>
                  </select>
                </div>

                {/* Export Orientation */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Cross-Border Export / Import
                  </label>
                  <select
                    value={kyaState.exportOriented}
                    onChange={(e) => updateKyaState({ exportOriented: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-sky-400 text-sm bg-slate-800/90 text-white font-medium"
                  >
                    <option value="Yes (Direct Export Planned)" className="bg-slate-900 text-white">Yes (Requires DGFT Import Export Code - IEC)</option>
                    <option value="No (Domestic Indian Market Only)" className="bg-slate-900 text-white">No (Domestic Indian Market Only)</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-generate-checklist-btn"
                  onClick={handleFinishQuestionnaire}
                  className="inline-flex items-center px-8 py-3.5 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
                  <span>{t('kya_generate_btn')}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Results Page - Personalized Approval Checklist */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              
              {/* Results Top Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Roadmap Generated</span>
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    {t('kya_step5_title')}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Project: <span className="text-amber-300 font-bold">{kyaState.sector}</span> in <span className="text-emerald-300 font-bold">{kyaState.state}</span> • Investment: <span className="text-white font-semibold">{kyaState.investmentSize}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-black text-amber-300">{recommendedApprovals.length}</div>
                    <div className="text-[10px] text-slate-300 uppercase font-semibold">Total Approvals</div>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="text-lg font-bold text-sky-300">{centralCount} Central</div>
                    <div className="text-[10px] text-slate-300">{stateCount} State ({kyaState.state})</div>
                  </div>

                  <button
                    id="kya-download-pdf-btn"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download className={`w-3.5 h-3.5 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Central vs State Filter Tabs */}
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'all' 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                      : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  All Recommended ({recommendedApprovals.length})
                </button>
                <button
                  onClick={() => setActiveTab('central')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'central' 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                      : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Central Ministries ({centralCount})
                </button>
                <button
                  onClick={() => setActiveTab('state')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'state' 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                      : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {kyaState.state} State ({stateCount})
                </button>
              </div>

              {/* List of Approval Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedApprovals.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 hover:border-sky-400/30"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          app.centralOrState === 'Central'
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {app.centralOrState === 'Central' ? 'Central Clearance' : `${app.stateName || 'State'} Dept`}
                        </span>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          app.mandatory ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}>
                          {app.mandatory ? 'Mandatory' : 'Conditional'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white leading-snug">
                        {app.name}
                      </h4>

                      <div className="text-xs text-sky-400 font-medium">
                        {app.department}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">
                        {app.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-white/10 text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>SLA: <strong className="text-white">{app.processingDays} Days</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Fee: <strong className="text-white">{app.statutoryFee}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Details, Add to Dashboard, Apply */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedApproval(app)}
                        className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer"
                      >
                        {t('kya_view_details')}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddToDashboard(app)}
                          className="px-3 py-2 text-xs font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition hidden sm:inline cursor-pointer"
                          title="Bookmark to My Dashboard"
                        >
                          + Dashboard
                        </button>

                        <button
                          id={`kya-apply-${app.id}`}
                          onClick={() => startApplication(app)}
                          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-md shadow-sky-500/20 transition active:scale-95 cursor-pointer"
                        >
                          {t('kya_apply_now')} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Modify Parameters</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      if (userProfile) {
                        setCurrentView('dashboard');
                        setDashboardActiveTab('kya');
                      } else {
                        showToast('Please sign in to save your comprehensive KYA profile.');
                      }
                    }}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-slate-950" />
                    <span>Save Roadmap to Profile</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
