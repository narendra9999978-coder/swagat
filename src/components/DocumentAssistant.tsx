import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { COMMON_DOCUMENTS } from '../data/documents';
import { 
  FileCheck2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DocumentAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const { triggerConfetti, openAskModal } = useJourney();
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({
    'doc-aadhaar': true,
    'doc-pan': true,
  });
  const [expandedDocId, setExpandedDocId] = useState<string | null>('doc-aadhaar');

  const toggleCheck = (id: string) => {
    setCheckedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedDocId(prev => prev === id ? null : id);
  };

  const handleSyncDigiLocker = () => {
    const newChecked: Record<string, boolean> = { ...checkedMap };
    COMMON_DOCUMENTS.forEach(doc => {
      if (doc.isDigiLockerAvailable) {
        newChecked[doc.id] = true;
      }
    });
    setCheckedMap(newChecked);
    triggerConfetti();
  };

  const completedCount = Object.values(checkedMap).filter(Boolean).length;
  const totalCount = COMMON_DOCUMENTS.length;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-xs font-bold text-purple-900 uppercase tracking-wider mb-3">
            <span>{t('docs_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('docs_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t('docs_subheading')}
          </p>
        </div>

        {/* Document Checklist Container */}
        <div className="max-w-4xl mx-auto bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-gov-xl">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-[#0B2545]" />
                <h3 className="font-display font-bold text-lg text-[#0B2545]">
                  Universal Pre-Application Document Checklist
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {completedCount} of {totalCount} standard documents ready for application submission.
              </p>
            </div>

            <button
              onClick={handleSyncDigiLocker}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>1-Click DigiLocker Fetch</span>
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3 mb-8">
            {COMMON_DOCUMENTS.map((doc) => {
              const isChecked = Boolean(checkedMap[doc.id]);
              const isExpanded = expandedDocId === doc.id;
              const docName = language === 'hi' ? doc.nameHi : doc.name;
              const whyText = language === 'hi' ? doc.whyNeededHi : doc.whyNeeded;

              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isChecked 
                      ? 'bg-white border-emerald-300 shadow-sm' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="p-4 flex items-center justify-between">
                    <label className="flex items-center space-x-3.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(doc.id)}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-sm ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                            {docName}
                          </span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Issued by: {doc.issuingAuthority}
                        </div>
                      </div>
                    </label>

                    <div className="flex items-center space-x-2">
                      {doc.isDigiLockerAvailable && (
                        <span className="hidden sm:inline-block text-[10px] font-bold bg-blue-50 text-[#0B2545] px-2 py-0.5 rounded border border-blue-200">
                          DigiLocker {doc.digiLockerDocType}
                        </span>
                      )}

                      <button
                        onClick={() => toggleExpand(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center space-x-1"
                        title="Why is this needed?"
                      >
                        <span className="hidden sm:inline text-[11px]">{t('docs_why')}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Explanation Details */}
                  {isExpanded && (
                    <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3 text-xs">
                      <div>
                        <strong className="text-slate-900 font-bold block mb-1">
                          Why is this document required by government authorities?
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {whyText}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-1">Accepted Formats:</span>
                          <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                            {doc.acceptedFormats.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-amber-200">
                          <span className="font-bold text-amber-900 block mb-1">Common Rejection Reasons:</span>
                          <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                            {doc.commonMistakes.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SWAGAT provides guidance on document readiness; official verification is completed by the issuing portal.</span>
            </div>

            <button
              onClick={() => openAskModal('Check documents for my goal')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
            >
              <span>{t('docs_cta')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
