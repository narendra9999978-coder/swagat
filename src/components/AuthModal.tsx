import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Mail, User, Phone,
  ArrowRight, Building2, Eye, EyeOff, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { SwagatLogo } from './SwagatLogo';
import { signInWithGoogleOAuth } from '../lib/supabaseClient';

/**
 * AuthModal
 * Curated from: https://ui.watermelon.sh/animated-components/swap-form
 * Dark Glassmorphic Swap-Form with 3D Spring Motion and strict role preservation
 */
export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode,
    setAuthModalMode,
    login,
    loginWithGoogle,
    showToast,
  } = useSwagat();

  const isAdminMode = authModalMode === 'signin-admin' || authModalMode === 'signin-super';
  const isInitialSignup = authModalMode === 'signup-user';

  const [formMode, setFormMode] = useState<'signin' | 'signup'>(isInitialSignup ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType] = useState<'Business User'>('Business User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Keep form mode in sync with modal mode prop when modal opens
  useEffect(() => {
    if (isAdminMode) {
      setFormMode('signin');
    } else if (authModalMode.includes('signup')) {
      setFormMode('signup');
    } else {
      setFormMode('signin');
    }
    setError('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const targetRole: 'USER' | 'ADMIN' = isAdminMode ? 'ADMIN' : 'USER';
  const roleLabel = isAdminMode ? 'SWAGAT ADMIN' : 'SWAGAT Business User';
  const roleAccent = isAdminMode ? 'text-amber-400' : 'text-sky-300';
  const roleRing = isAdminMode ? 'focus:ring-amber-500 focus:border-amber-400' : 'focus:ring-sky-500 focus:border-sky-400';
  const roleBtnBg = isAdminMode
    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-500/20'
    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white shadow-sky-500/20';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formMode === 'signup') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (!mobile.trim()) { setError('Please enter your mobile number.'); return; }
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      if (!password.trim()) { setError('Please enter your password.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    } else {
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      if (!password.trim()) { setError('Please enter your password.'); return; }
    }

    setLoading(true);
    try {
      await login(formMode, targetRole, { email, password, name, mobile, companyName });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithGoogleOAuth(targetRole);
      if (!res) {
        setShowGoogleAccountPicker(true);
      }
    } catch (err: any) {
      console.warn('Google OAuth redirected or requires account selection', err);
      setShowGoogleAccountPicker(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (gEmail: string, gName: string) => {
    setShowGoogleAccountPicker(false);
    setLoading(true);
    try {
      await loginWithGoogle(gEmail, gName, targetRole);
      showToast(`Signed in with Google as ${gName} (${gEmail})`);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newFormMode: 'signin' | 'signup') => {
    setFormMode(newFormMode);
    setError('');
    if (newFormMode === 'signup') {
      setAuthModalMode('signup-user');
    } else {
      setAuthModalMode('signin-user');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-full max-w-md my-8 relative overflow-hidden rounded-3xl bg-slate-950/90 border border-white/15 backdrop-blur-2xl shadow-2xl text-white"
        >
          {/* Header Strip */}
          <div className="p-6 border-b border-white/10 relative bg-white/5">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-3">
              <SwagatLogo size="sm" showWordmark={false} theme="dark" />
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Single Window System</div>
                <div className={`text-xs font-bold ${roleAccent}`}>{roleLabel}</div>
              </div>
            </div>

            <h2 className="text-2xl font-display font-extrabold tracking-tight">
              {isAdminMode
                ? 'Admin Access Portal'
                : formMode === 'signup'
                ? 'Create Business Account'
                : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isAdminMode
                ? 'Access Administrator Dashboard & Governance Controls'
                : formMode === 'signup'
                ? 'Register to file and track single-window statutory clearances'
                : 'Sign in to access your business applications'}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6">
            {/* Watermelon Swap Form Tab Switcher (USER mode only) */}
            {!isAdminMode && (
              <div className="relative flex p-1 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors z-10 ${
                    formMode === 'signin' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {formMode === 'signin' && (
                    <motion.div
                      layoutId="auth-tab-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md"
                    />
                  )}
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors z-10 ${
                    formMode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {formMode === 'signup' && (
                    <motion.div
                      layoutId="auth-tab-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md"
                    />
                  )}
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="font-medium leading-relaxed">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* User Sign Up fields with spring reveal */}
              <AnimatePresence>
                {!isAdminMode && formMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3.5 overflow-hidden"
                  >
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                      />
                    </div>

                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number (+91 XXXXX XXXXX)"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                      />
                    </div>

                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Company Name (e.g. ABC Electronics Pvt Ltd)"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={isAdminMode ? 'admin@domain.com' : 'name@company.in'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password (only on Sign Up) */}
              {!isAdminMode && formMode === 'signup' && (
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 ${roleRing}`}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${roleBtnBg} text-xs font-extrabold rounded-xl shadow-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer`}
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials…</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isAdminMode
                        ? 'Login to Admin Dashboard'
                        : formMode === 'signup'
                        ? 'Sign Up & Continue'
                        : 'Sign In'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Google Sign In option */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isAdminMode ? 'Continue as Admin with Google' : 'Continue with Google'}</span>
              </button>
            </form>

            {/* Database Notice */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-300">Role Enforcement:</span>
                <span className="text-emerald-300 font-mono text-[9px]">1 Email = 1 Role</span>
              </div>
              <span className="bg-white/5 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-white/10">
                Statutory Auth
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleAccountPicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-slate-950 rounded-2xl shadow-2xl p-6 border border-white/20 text-white space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleAccountPicker(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl space-y-1">
              <p className="text-xs font-bold text-sky-300">
                Target Portal: <span className="underline">{roleLabel}</span>
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Role Binding: Whichever portal you sign into first with this account will permanently bind its permission role.
              </p>
            </div>

            {/* Custom Google account input */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or use another Google email</p>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-400"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-400"
              />
              <button
                disabled={!customGoogleEmail.includes('@')}
                onClick={() => handleSelectGoogleAccount(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0])}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Continue with this Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
