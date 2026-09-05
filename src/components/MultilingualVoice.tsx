import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { 
  Mic, 
  Volume2, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';
import { Language } from '../types';

export const MultilingualVoice: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { openAskModal } = useJourney();
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [selectedVoiceSnippet, setSelectedVoiceSnippet] = useState(0);

  const voiceSnippets = [
    {
      lang: 'Hindi',
      code: 'hi',
      phrase: '“मुझे अपने बच्चे के लिए कॉलेज स्कॉलरशिप चाहिए।”',
      intent: 'Identified: Higher Education Scholarship • Mapping National Scholarship Portal (NSP-OTR)',
      category: 'Education'
    },
    {
      lang: 'Marathi',
      code: 'mr',
      phrase: '“मला पुण्यात नवीन बेकरी आणि रेस्टॉरंट सुरू करायचे आहे.”',
      intent: 'Identified: Food Business in Maharashtra • Mapping FSSAI, Udyam & Gumasta License',
      category: 'Business'
    },
    {
      lang: 'Tamil',
      code: 'ta',
      phrase: '“எனது நிலத்திற்கு PM கிசான் உதவித்தொகை பெற வேண்டும்.”',
      intent: 'Identified: PM Kisan Agricultural Assistance • Direct DBT & Land Record Linking',
      category: 'Agriculture'
    },
    {
      lang: 'Telugu',
      code: 'te',
      phrase: '“నాకు ఆదాయ ధృవీకరణ పత్రం మరియు రేషన్ కార్డు కావాలి.”',
      intent: 'Identified: Revenue Income Certificate & NFSA Ration Card Seva',
      category: 'Certificates'
    },
    {
      lang: 'Bengali',
      code: 'bn',
      phrase: '“আমি ক্ষুদ্র ব্যবসা শুরু করার জন্য সরকারি ঋণ চাই।”',
      intent: 'Identified: Micro Enterprise Credit • Mapping PMEGP & Mudra Loan Schemes',
      category: 'Finance'
    },
    {
      lang: 'English',
      code: 'en',
      phrase: '“I want to register an MSME firm and get an export code.”',
      intent: 'Identified: Central MSME Udyam Registration & DGFT Import Export Code',
      category: 'Business'
    }
  ];

  const handlePlayVoice = (idx: number) => {
    setSelectedVoiceSnippet(idx);
    setIsPlayingDemo(true);
    setTimeout(() => {
      setIsPlayingDemo(false);
    }, 3000);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
            <span>{t('voice_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('voice_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t('voice_subheading')}
          </p>
        </div>

        {/* Voice Card Interactive Sandbox */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-gov-xl">
          
          {/* Language Selection Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {voiceSnippets.map((snippet, idx) => (
              <button
                key={snippet.lang}
                onClick={() => handlePlayVoice(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  selectedVoiceSnippet === idx
                    ? 'bg-[#0B2545] text-white shadow-md ring-2 ring-[#0B2545]/20 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{snippet.lang}</span>
              </button>
            ))}
          </div>

          {/* Voice Wave Visualizer Card */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#07182C] text-white rounded-2xl p-6 sm:p-8 shadow-gov-lg mb-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Voice Recognition Sample • {voiceSnippets[selectedVoiceSnippet].lang}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  {voiceSnippets[selectedVoiceSnippet].phrase}
                </h3>

                <p className="text-xs text-slate-300">
                  {voiceSnippets[selectedVoiceSnippet].intent}
                </p>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center space-x-1.5 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
                <div className={`w-1.5 bg-amber-400 rounded-full ${isPlayingDemo ? 'voice-bar-1' : 'h-3'}`}></div>
                <div className={`w-1.5 bg-amber-300 rounded-full ${isPlayingDemo ? 'voice-bar-2' : 'h-6'}`}></div>
                <div className={`w-1.5 bg-white rounded-full ${isPlayingDemo ? 'voice-bar-3' : 'h-8'}`}></div>
                <div className={`w-1.5 bg-emerald-400 rounded-full ${isPlayingDemo ? 'voice-bar-4' : 'h-5'}`}></div>
                <div className={`w-1.5 bg-amber-400 rounded-full ${isPlayingDemo ? 'voice-bar-5' : 'h-3'}`}></div>

                <button
                  onClick={() => handlePlayVoice(selectedVoiceSnippet)}
                  className="ml-3 p-2 bg-[#E05A10] hover:bg-orange-600 rounded-xl text-white shadow transition"
                  title="Replay Voice Query"
                >
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>

            </div>
          </div>

          {/* AI Response Breakdown */}
          <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-amber-300 flex items-center justify-center shrink-0 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0B2545]">
                  {t('voice_ai_response')}
                </h4>
                <p className="text-xs text-slate-600">
                  Transcribes regional accents and connects citizen goals directly to official service workflows.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAskModal(voiceSnippets[selectedVoiceSnippet].phrase)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
            >
              <span>Test This Voice Goal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
