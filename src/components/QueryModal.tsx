import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Paperclip, 
  ShieldAlert, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';

export const QueryModal: React.FC = () => {
  const { selectedQueryApp, setSelectedQueryApp, respondToQuery } = useSwagat();
  const [responseText, setResponseText] = useState('We have revised the secondary emergency staircase clear width to 2.2 meters in Bay 2 drawings to strictly satisfy Rule 71 of Maharashtra Factory Rules. Revised blueprint attached.');
  const [attachmentName, setAttachmentName] = useState('Revised_Emergency_Stairway_Schematic_V2.pdf');

  if (!selectedQueryApp) return null;

  const { application, query } = selectedQueryApp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    respondToQuery(application.id, query.id, responseText, [attachmentName]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedQueryApp(null)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Official Scrutiny Query Reply</span>
          </div>
          <h3 className="text-xl font-display font-extrabold text-[#07182C]">
            Respond to Department Query
          </h3>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            App ID: {application.trackingNumber} • {application.approvalName}
          </div>
        </div>

        {/* Officer's Query Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-2 mb-4">
          <div className="font-bold text-amber-950 uppercase text-[10px] flex items-center justify-between">
            <span>Query Raised by {query.raisedByOfficer} ({query.department})</span>
            <span className="text-amber-800 font-mono">{query.dateRaised}</span>
          </div>
          <p className="text-amber-900 leading-relaxed font-medium">
            "{query.queryText}"
          </p>
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 uppercase block mb-1">
              Applicant Official Written Explanation
            </label>
            <textarea
              rows={4}
              required
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#07182C]"
              placeholder="Enter comprehensive clarification addressing all points raised by scrutiny officer..."
            ></textarea>
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase block mb-1">
              Supplementary Document / Drawing Attachment
            </label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-mono text-xs text-slate-800 truncate">{attachmentName}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setSelectedQueryApp(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#07182C] hover:bg-[#0B2545] text-white font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Clarification</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
