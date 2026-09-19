import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackWidgetProps {
  onSubmitFeedback?: (rating: number, category: string, comment: string) => void;
  className?: string;
}

/**
 * FeedbackWidget
 * Curated from: https://ui.watermelon.sh/animated-components/feedback
 * Dark Glassmorphic Interactive Feedback Card with Animated Emojis
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  onSubmitFeedback,
  className = '',
}) => {
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
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-slate-950/70 border border-white/10 backdrop-blur-2xl shadow-xl max-w-lg mx-auto ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>User Experience Feedback</span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-white mb-1">
        Help us optimize the Indian single-window ecosystem
      </h4>
      <p className="text-xs text-slate-400 mb-5">
        Your feedback directly informs national Ease of Doing Business reform benchmarks.
      </p>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-white">Thank You for Your Feedback!</h5>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your responses have been recorded and forwarded to the DPIIT Quality Improvement cell.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emojis Rating Selector */}
            <div className="flex items-center justify-between gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
              {emojis.map((item) => {
                const isSelected = selectedRating === item.rating;
                return (
                  <motion.button
                    key={item.rating}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRating(item.rating)}
                    className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 border border-sky-400/40 shadow-xs'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-xl block">{item.emoji}</span>
                    <span
                      className={`text-[9px] font-semibold block mt-0.5 ${
                        isSelected ? 'text-sky-300' : 'text-slate-400'
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
              <label className="text-[11px] font-medium text-slate-400">Feedback Focus Area:</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                      category === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
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
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 resize-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
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
