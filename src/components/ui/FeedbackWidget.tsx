import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../../context/SwagatContext';

interface FeedbackWidgetProps {
  onSubmitFeedback?: (rating: number, category: string, comment: string) => void;
  className?: string;
}

/**
 * FeedbackWidget
 * Clean GovTech User Experience Feedback component with high contrast & theme support
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  onSubmitFeedback,
  className = '',
}) => {
  const { theme } = useSwagat();
  const isDark = theme === 'dark';

  const [selectedRating, setSelectedRating] = useState<number | null>(4);
  const [category, setCategory] = useState<string>('Single-Window CAF Experience');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emojis = [
    { rating: 1, emoji: '😞', label: 'Difficult' },
    { rating: 2, emoji: '😐', label: 'Neutral' },
    { rating: 3, emoji: '🙂', label: 'Good' },
    { rating: 4, emoji: '😊', label: 'Smooth' },
    { rating: 5, emoji: '🤩', label: 'Outstanding' },
  ];

  const categories = [
    'Single-Window CAF Experience',
    'KYA Recommendation Accuracy',
    'DigiLocker Verification',
    'Department SLA & Speed',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    setIsSubmitted(true);
    if (onSubmitFeedback) {
      onSubmitFeedback(selectedRating, category, comment);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border shadow-xl max-w-lg mx-auto transition-colors ${
        isDark
          ? 'bg-[#07182C] border-white/15 text-white shadow-black/50'
          : 'bg-white border-[#D8E2EE] text-[#102A43] shadow-[0_12px_36px_rgba(0,0,0,0.06)]'
      } ${className}`}
    >
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${
        isDark ? 'text-sky-400' : 'text-[#0284C7]'
      }`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>User Experience Feedback</span>
      </div>

      <h4 className={`text-base sm:text-lg font-bold mb-1 ${
        isDark ? 'text-white' : 'text-[#102A43]'
      }`}>
        Help us optimize the Indian single-window ecosystem
      </h4>
      <p className={`text-xs mb-5 ${
        isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
      }`}>
        Your feedback directly informs national Ease of Doing Business reform benchmarks.
      </p>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-3"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border-emerald-300 text-emerald-600'
            }`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#102A43]'}`}>
              Thank You for Your Feedback!
            </h5>
            <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'}`}>
              Your responses have been recorded and forwarded to the DPIIT Quality Improvement cell.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emojis Rating Selector */}
            <div className={`flex items-center justify-between gap-1 p-2 rounded-2xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-[#F8FAFC] border-[#D8E2EE]'
            }`}>
              {emojis.map((item) => {
                const isSelected = selectedRating === item.rating;
                return (
                  <motion.button
                    key={item.rating}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRating(item.rating)}
                    className={`flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-sky-500/25 border border-sky-400/50 shadow-xs'
                          : 'bg-[#EEF7FA] border border-[#0284C7] shadow-xs ring-1 ring-sky-400/20'
                        : isDark
                          ? 'hover:bg-white/10 border border-transparent'
                          : 'hover:bg-white border border-transparent'
                    }`}
                  >
                    <span className="text-xl block">{item.emoji}</span>
                    <span
                      className={`text-[9px] font-bold block mt-0.5 ${
                        isSelected
                          ? isDark ? 'text-sky-300' : 'text-[#102A43]'
                          : isDark ? 'text-[#AFC4D8]' : 'text-[#64748B]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Category Pills */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-bold ${isDark ? 'text-[#AFC4D8]' : 'text-[#52657A]'}`}>
                Feedback Focus Area:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                      category === cat
                        ? isDark
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-bold'
                          : 'bg-[#EEF7FA] text-[#102A43] border-[#0284C7] font-bold shadow-xs'
                        : isDark
                          ? 'bg-white/5 text-[#AFC4D8] hover:text-white border-white/10'
                          : 'bg-[#F8FAFC] text-[#52657A] hover:bg-[#F1F5F9] border-[#CBD5E1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked well, or where did you encounter statutory bottlenecks? (Optional)"
                className={`w-full p-3 rounded-xl text-xs focus:outline-none resize-none transition border ${
                  isDark
                    ? 'bg-slate-900/90 border-white/15 text-white placeholder-slate-400 focus:border-sky-400'
                    : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#102A43] placeholder-[#64748B] focus:border-[#0284C7] focus:bg-white'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Portal Feedback</span>
            </button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};
