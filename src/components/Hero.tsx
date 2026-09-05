import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  HelpCircle,
  Building2,
  GraduationCap,
  Award,
  FileCheck2,
  Layers
} from 'lucide-react';
import { JourneyEngineVisual } from './JourneyEngineVisual';

export const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const { openAskModal, selectScenario, createCustomJourney } = useJourney();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const exampleChips = [
    { text: 'I want to start a small business.', id: 'small-business', icon: Building2 },
    { text: 'I need a scholarship for my child.', id: 'child-scholarship', icon: GraduationCap },
    { text: 'I want to know which schemes I qualify for.', id: 'scheme-discovery', icon: Award },
    { text: 'I need a government certificate.', id: 'government-certificate', icon: FileCheck2 },
  ];

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate realistic voice speech recognition
      const phrases = [
        'I want to open a small bakery in Pune...',
        'मुझे अपने बच्चे के लिए स्कॉलरशिप चाहिए...',
        'मला नवीन व्यवसाय सुरू करायचा आहे...'
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setTimeout(() => {
        setSearchQuery(randomPhrase);
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      createCustomJourney(searchQuery);
      openAskModal(searchQuery);
    } else {
      openAskModal('I want to start a small business.');
    }
  };

  const handleChipClick = (chip: typeof exampleChips[0]) => {
    selectScenario(chip.id);
    setSearchQuery(chip.text);
    // Smooth scroll down to interactive live demo / dashboard
    const target = document.getElementById('live-demo');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 gov-hero-mesh overflow-hidden border-b border-slate-200/80">
      
      {/* Background Subtle Gov Accent Orbs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges & Official Positioning */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#E05A10]"></span>
            <span>Indian GovTech Service Journey Assistant</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#0B2545]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Intelligent Front Door to Public Services</span>
          </div>
        </div>

        {/* Main Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#0B2545] leading-[1.15]">
            {t('hero_headline')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            {t('hero_subheadline')}
          </p>
        </div>

        {/* Hero AI Journey Input Box (Prominent & High Polish) */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-gov-xl border border-slate-200/90 relative group hover:border-slate-300 transition-all">
            
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              
              {/* Input field with voice mic */}
              <div className="relative flex-1 flex items-center bg-slate-50/80 hover:bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200/70 focus-within:border-[#0B2545] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B2545]/15 transition">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                
                <input
                  id="hero-goal-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isListening ? 'Listening to your voice...' : t('hero_placeholder')}
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />

                {/* Voice Input Button */}
                <button
                  type="button"
                  id="hero-voice-mic-btn"
                  onClick={handleVoiceToggle}
                  className={`p-2 rounded-xl transition-all ml-1 ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md' 
                      : 'text-slate-500 hover:text-[#E05A10] hover:bg-orange-50'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak your goal in your language'}
                >
                  {isListening ? (
                    <div className="flex items-center space-x-1 px-1">
                      <span className="w-1 h-3 bg-white rounded-full voice-bar-1"></span>
                      <span className="w-1 h-5 bg-white rounded-full voice-bar-2"></span>
                      <span className="w-1 h-4 bg-white rounded-full voice-bar-3"></span>
                    </div>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                id="hero-start-journey-btn"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] hover:from-[#134074] hover:to-[#0B2545] shadow-gov-md hover:shadow-gov-lg active:scale-95 transition-all duration-200 group shrink-0"
              >
                <span>{t('hero_cta')}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Voice Listening indicator banner */}
            {isListening && (
              <div className="mt-2.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Audio Speech Recognition active • Listening in Hindi, Marathi, or English...</span>
                </div>
                <button onClick={() => setIsListening(false)} className="text-rose-500 hover:underline text-[11px]">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Prompt Example Chips */}
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-semibold mb-2.5 flex items-center justify-center space-x-1.5">
              <span>{t('hero_or_try')}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              {exampleChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    id={`hero-chip-${chip.id}`}
                    onClick={() => handleChipClick(chip)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-gov-sm hover:border-slate-300 hover:text-[#0B2545] transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#E05A10]" />
                    <span>“{chip.text}”</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Statement */}
          <div className="mt-5 text-center flex items-center justify-center space-x-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('hero_trust')}</span>
          </div>
        </div>

        {/* Hero Visual Section: Interactive 7-Stage Journey Engine */}
        <div className="mt-8">
          <JourneyEngineVisual />
        </div>

      </div>
    </section>
  );
};
