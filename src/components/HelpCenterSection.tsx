import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  FileQuestion, 
  Headphones, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const HelpCenterSection: React.FC = () => {
  const { showToast } = useSwagat();
  const [searchFaq, setSearchFaq] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [queryName, setQueryName] = useState('');
  const [queryEmail, setQueryEmail] = useState('');
  const [queryMessage, setQueryMessage] = useState('');

  const faqs = [
    {
      q: 'How does SWAGAT differ from individual ministry websites?',
      a: 'SWAGAT consolidates all 1,400+ Central and State approvals into a single Common Application Form (CAF). Instead of registering on 20 different portals, you log in once, upload verified DigiLocker documents once, and track all approvals on a single dashboard.'
    },
    {
      q: 'What is Know Your Approvals (KYA) and how accurate is it?',
      a: 'KYA is an intelligent questionnaire mapping your industry sector, location, investment size, workforce, and utility needs to pinpoint the exact mandatory and conditional clearances required before construction and operations.'
    },
    {
      q: 'If I am unauthenticated and fill the KYA form, will my work be saved?',
      a: 'Yes! SWAGAT preserves your selected sector, state, parameters, and recommended approvals during your active session. When you click Apply and log in or register, you return directly to your pre-filled application wizard.'
    },
    {
      q: 'How do I respond to a departmental query raised on my application?',
      a: 'Navigate to your SWAGAT Dashboard or tracking section. If a department raises a query (e.g. asking for revised factory drawings), click "Respond to Query", enter your explanation, attach supplementary PDFs, and submit with full digital audit logging.'
    },
    {
      q: 'Can foreign investors (FDI) apply through SWAGAT?',
      a: 'Yes. Foreign direct investors can incorporate entities via SPICe+ (MCA), obtain RBI FDI reporting clearances, DPIIT startup recognitions, and state industrial clearances through the SWAGAT international investor portal.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
    f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryMessage.trim()) return;
    showToast('Your query has been lodged with SWAGAT Helpdesk (Ticket #SWG-HD-9041). Response within 24 hours.');
    setQueryName('');
    setQueryEmail('');
    setQueryMessage('');
  };

  return (
    <section id="section-help" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#07182C] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-[#07182C]" />
            <span>Support &amp; Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#07182C] tracking-tight">
            Resources &amp; Help Center
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Access step-by-step user manuals, compliance guides, video tutorials, and 24/7 technical grievance resolution.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="relative">
            <input
              type="text"
              placeholder="Search how to start your business, approval rules, FAQs..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 shadow-sm text-sm font-medium focus:ring-2 focus:ring-[#07182C]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 4 Quick Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#07182C] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#07182C]">Step-by-Step Guides</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comprehensive manuals on SPICe+ incorporation, SPCB consent, and industrial electricity connections.
            </p>
            <button 
              onClick={() => showToast('Opening SWAGAT User Handbook PDF')}
              className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center"
            >
              <span>Download Manual</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#07182C]">Video Walkthroughs</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive video tutorials showing how to complete the KYA journey and link DigiLocker KYC documents.
            </p>
            <button 
              onClick={() => showToast('Playing SWAGAT Platform Video Tour')}
              className="text-xs font-bold text-amber-700 hover:underline inline-flex items-center"
            >
              <span>Watch Video Tour (4 mins)</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#07182C]">Approval Guides</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Master checklist of statutory checklists, document formats, stability certificates, and fees.
            </p>
            <button 
              onClick={() => showToast('Viewing Statutory Checklists Directory')}
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center"
            >
              <span>View Checklist</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#07182C]">24/7 National Helpdesk</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toll-Free helpline 1800-11-8005 and dedicated single-window facilitators in every state capital.
            </p>
            <div className="text-xs font-bold text-purple-800">
              Toll Free: 1800-11-8005
            </div>
          </div>

        </div>

        {/* FAQs & Grievance Lodging Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: FAQs */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-display font-bold text-[#07182C] mb-4">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-sm text-[#07182C] hover:bg-slate-50"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Grievance / Query Submission */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Direct Support Ticket</span>
            </div>
            <h3 className="text-xl font-display font-bold text-[#07182C] mb-2">
              Lodge Query / Grievance
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our single-window nodal facilitation officers respond within 24 business hours.
            </p>

            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narendra Singh"
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#07182C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Email / Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. contact@company.in"
                  value={queryEmail}
                  onChange={(e) => setQueryEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#07182C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Query / Assistance Needed</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your approval or application question..."
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#07182C]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#07182C] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
