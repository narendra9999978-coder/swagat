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

  // Filter approvals matching KYA answers
  const recommendedApprovals = approvals.filter(app => {
    // Check sector applicability
    const sectorMatch = app.sectorApplicability.includes(kyaState.sector) || app.sectorApplicability.includes('Other');
    // Check state applicability if state approval
    const stateMatch = app.centralOrState === 'Central' || app.stateName === kyaState.state || !app.stateName;
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

  return (
    <section id="section-kya" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Smart Compliance Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            {t('kya_heading')}
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            {t('kya_subheading')}
          </p>
        </div>

        {/* 5-Step Progress Stepper Bar */}
        <div className="mb-10 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
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
                      ? 'bg-amber-50 border border-amber-200' 
                      : isDone 
                      ? 'hover:bg-slate-50' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#07182C] text-amber-300 ring-4 ring-amber-100 shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <span className={`text-xs font-bold truncate max-w-full ${isCurrent ? 'text-[#07182C]' : 'text-slate-600'}`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Container Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90 transition-all">
          
          {/* STEP 1: What are you planning? */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 1 of 5</span>
                <h3 className="text-2xl font-display font-bold text-[#07182C] mt-1">
                  {t('kya_step1_title')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Select your primary investment and operational objective in India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planningOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => updateKyaState({ planningType: opt.id })}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start space-x-4 ${
                      kyaState.planningType === opt.id
                        ? 'border-[#07182C] bg-blue-50/40 shadow-md ring-1 ring-[#07182C]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      kyaState.planningType === opt.id ? 'border-[#07182C] bg-[#07182C]' : 'border-slate-300'
                    }`}>
                      {kyaState.planningType === opt.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#07182C]">{opt.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  id="kya-step1-next-btn"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-md transition-all group"
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
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 2 of 5</span>
                <h3 className="text-2xl font-display font-bold text-[#07182C] mt-1">
                  {t('kya_step2_title')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
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
                      className={`p-4 rounded-xl text-left font-semibold text-sm transition-all border-2 flex items-center justify-between ${
                        isSelected
                          ? 'border-[#07182C] bg-[#07182C] text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="truncate">{sec}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-step2-next-btn"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-md transition-all group"
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
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 3 of 5</span>
                <h3 className="text-2xl font-display font-bold text-[#07182C] mt-1">
                  {t('kya_step3_title')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#07182C] text-sm"
                />
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Popular Industrial Hubs Quick Selection */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Top Industrial Destination States:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Rajasthan', 'Haryana'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateKyaState({ state: st })}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        kyaState.state === st
                          ? 'bg-[#07182C] text-amber-300 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                          ? 'border-[#07182C] bg-blue-50 text-[#07182C] font-bold ring-2 ring-[#07182C]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div>{st.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{st.zone} Zone • {st.type}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-step3-next-btn"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-md transition-all group"
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
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 4 of 5</span>
                <h3 className="text-2xl font-display font-bold text-[#07182C] mt-1">
                  {t('kya_step4_title')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Specify investment quantum, workforce, environmental criteria, and utility demands.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Investment Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Capital Investment in Plant &amp; Machinery
                  </label>
                  <select
                    value={kyaState.investmentSize}
                    onChange={(e) => updateKyaState({ investmentSize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    {investmentOptions.map((inv) => (
                      <option key={inv.value} value={inv.value}>{inv.label}</option>
                    ))}
                  </select>
                </div>

                {/* Employee Count */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Anticipated Employee / Worker Strength
                  </label>
                  <select
                    value={kyaState.employeeCount}
                    onChange={(e) => updateKyaState({ employeeCount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    <option value="1 to 9 Workers">1 to 9 Workers (Exempt from Factory License)</option>
                    <option value="10 to 49 Workers">10 to 49 Workers (Factories Act Applicable)</option>
                    <option value="50 to 250 Employees">50 to 250 Workers / Staff</option>
                    <option value="250+ Large Workforce">250+ Large Workforce (Canteen/Creche Mandatory)</option>
                  </select>
                </div>

                {/* Land & Infrastructure Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Land &amp; Premises Arrangement
                  </label>
                  <select
                    value={kyaState.landRequirement}
                    onChange={(e) => updateKyaState({ landRequirement: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    <option value="Required in Industrial Estate (MIDC)">Industrial Development Estate (MIDC/GIDC/SIPCOT)</option>
                    <option value="Private Land (Requires NA Conversion)">Private Non-Agriculture (NA) Land</option>
                    <option value="Leased Commercial Building">Leased Commercial / Tech Park Space</option>
                    <option value="Special Economic Zone (SEZ)">Special Economic Zone (SEZ / EOU)</option>
                  </select>
                </div>

                {/* Power Requirement */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Electricity Power Demand
                  </label>
                  <select
                    value={kyaState.powerRequirement}
                    onChange={(e) => updateKyaState({ powerRequirement: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    <option value="High Tension (HT > 150 kVA)">High Tension (HT &gt; 150 kVA Substation)</option>
                    <option value="Low Tension Commercial (LT < 100 kW)">Low Tension Industrial / Commercial (&lt; 100 kW)</option>
                    <option value="Captive Solar / Green Power">Captive Solar / Green Power Open Access</option>
                  </select>
                </div>

                {/* Hazardous Substances / Effluent */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Chemicals, Solvents or Industrial Effluents
                  </label>
                  <select
                    value={kyaState.hazardousSubstances}
                    onChange={(e) => updateKyaState({ hazardousSubstances: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    <option value="Yes (Standard Industrial Solvents)">Yes (Requires Pollution CTE/CTO + Fire NOC)</option>
                    <option value="Yes (Bulk Petroleum / Explosives > 2500L)">Yes (Requires PESO License + Hazardous Waste)</option>
                    <option value="No (Clean / IT / White Category)">No (Clean / Zero Discharge / Green Category)</option>
                  </select>
                </div>

                {/* Export Orientation */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Cross-Border Export / Import
                  </label>
                  <select
                    value={kyaState.exportOriented}
                    onChange={(e) => updateKyaState({ exportOriented: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm bg-white font-medium"
                  >
                    <option value="Yes (Direct Export Planned)">Yes (Requires DGFT Import Export Code - IEC)</option>
                    <option value="No (Domestic Indian Market Only)">No (Domestic Indian Market Only)</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back</span>
                </button>
                <button
                  id="kya-generate-checklist-btn"
                  onClick={handleFinishQuestionnaire}
                  className="inline-flex items-center px-8 py-3.5 text-sm font-extrabold text-[#07182C] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 rounded-xl shadow-lg transition-all group"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-[#07182C]" />
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
              <div className="bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#07182C] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-center">
                    <div className="text-2xl font-black text-amber-300">{recommendedApprovals.length}</div>
                    <div className="text-[10px] text-slate-300 uppercase font-semibold">Total Approvals</div>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-center">
                    <div className="text-lg font-bold text-sky-300">{centralCount} Central</div>
                    <div className="text-[10px] text-slate-300">{stateCount} State ({kyaState.state})</div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('Exported official SWAGAT Approval Checklist (PDF).');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#07182C] text-xs font-bold shadow-md flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Central vs State Filter Tabs */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'all' 
                      ? 'bg-[#07182C] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Recommended ({recommendedApprovals.length})
                </button>
                <button
                  onClick={() => setActiveTab('central')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'central' 
                      ? 'bg-blue-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Central Ministries ({centralCount})
                </button>
                <button
                  onClick={() => setActiveTab('state')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'state' 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
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
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-slate-300"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          app.centralOrState === 'Central'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {app.centralOrState === 'Central' ? 'Central Clearance' : `${app.stateName || 'State'} Dept`}
                        </span>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          app.mandatory ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.mandatory ? 'Mandatory' : 'Conditional'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#07182C] leading-snug">
                        {app.name}
                      </h4>

                      <div className="text-xs text-slate-500 font-medium">
                        {app.department}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {app.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-100 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>SLA: <strong>{app.processingDays} Days</strong></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Fee: <strong>{app.statutoryFee}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Details, Add to Dashboard, Apply */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedApproval(app)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      >
                        {t('kya_view_details')}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddToDashboard(app)}
                          className="px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition hidden sm:inline"
                          title="Bookmark to My Dashboard"
                        >
                          + Dashboard
                        </button>

                        <button
                          id={`kya-apply-${app.id}`}
                          onClick={() => startApplication(app)}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#07182C] hover:bg-[#0B2545] rounded-xl shadow-xs transition active:scale-95"
                        >
                          {t('kya_apply_now')} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
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
                    className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200/80 rounded-xl transition"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-700" />
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
