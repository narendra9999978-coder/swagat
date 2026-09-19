import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubscribe?: (email: string) => void;
  className?: string;
}

/**
 * NewsletterSubscribe
 * Curated from: https://ui.watermelon.sh/block/newsletter-2
 * Deep dark glassmorphic newsletter subscribe block with glowing button & micro-animations
 */
export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  title = 'Stay Updated on Statutory Amendments',
  description = 'Receive immediate notifications on new gazette notifications, PLI windows, and compliance deadline extensions.',
  placeholder = 'Enter your corporate email address...',
  buttonText = 'Subscribe to Updates',
  onSubscribe,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      if (onSubscribe) onSubscribe(email);
    }, 800);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-slate-950/60 border border-white/10 backdrop-blur-2xl shadow-xl ${className}`}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Government Gazette &amp; Policy Bulletin</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {description}
        </p>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Subscribed! You will receive verified policy briefings directly to your inbox.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 backdrop-blur-md transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
