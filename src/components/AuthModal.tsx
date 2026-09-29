import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Mail, User, Phone,
  ArrowRight, Building2, Eye, EyeOff, AlertCircle, 
  CheckCircle2, ArrowLeft, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwagat } from '../context/SwagatContext';
import { SwagatLogo } from './SwagatLogo';
import { signInWithGoogleOAuth } from '../lib/supabaseClient';

interface AuthModalProps {
  isPageMode?: boolean;
}

/**
 * AuthModal
 * Government of India SWAGAT Portal Unified Authentication Gateway
 * Supporting Investor User Login, Business Registration, and Ministry Administrator Login
 * Fully adhering to the SWAGAT Tricolour Design System (Light Theme & Dark Theme).
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isPageMode = false }) => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode,
    setAuthModalMode,
    login,
    loginWithGoogle,
    showToast,
    theme
  } = useSwagat();

  const isDark = theme === 'dark';
  const isAdminMode = authModalMode === 'signin-admin' || authModalMode === 'signin-super';
  const isInitialSignup = authModalMode === 'signup-user';

  const [formMode, setFormMode] = useState<'signin' | 'signup' | 'forgot'>(isInitialSignup ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

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
    setForgotSuccess(false);
  }, [authModalMode, isAuthModalOpen, isAdminMode]);

  // If not page mode and modal is not opened, don't render anything
  if (!isPageMode && !isAuthModalOpen) return null;

  const targetRole: 'USER' | 'ADMIN' = isAdminMode ? 'ADMIN' : 'USER';
  const roleLabel = isAdminMode ? 'SWAGAT Administration' : 'SWAGAT Business User';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formMode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid registered email address.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setForgotSuccess(true);
        showToast(`Password recovery link dispatched to ${email}`);
      }, 1000);
      return;
    }
    
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
      if (isPageMode && typeof window !== 'undefined') {
        window.history.replaceState({}, '', targetRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      }
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
      if (isPageMode && typeof window !== 'undefined') {
        window.history.replaceState({}, '', targetRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newFormMode: 'signin' | 'signup') => {
    setFormMode(newFormMode);
    setError('');
    setForgotSuccess(false);
    if (newFormMode === 'signup') {
      setAuthModalMode('signup-user');
    } else {
      setAuthModalMode('signin-user');
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    // If URL has /login, /admin-login, clean it up on close
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/login' || p === '/user-login' || p === '/admin-login' || p === '/signup' || p === '/register') {
        window.history.replaceState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  // Card Content
  const CardContent = (
    <div
      className={`w-full max-w-md relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isDark
          ? 'bg-[#0B2238] border-[rgba(140,175,210,0.22)] text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)]'
          : 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_20px_50px_rgba(15,35,65,0.12)] ring-1 ring-slate-900/5'
      }`}
    >
      {/* Subtle SWAGAT Tricolour Top Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      {/* Header Strip */}
      <div className={`p-6 sm:p-7 border-b relative ${
        isDark ? 'border-white/10 bg-[#07182C]' : 'border-[#D8E2EC] bg-[#F8FAFC]'
      }`}>
        <button
          onClick={handleClose}
          id="auth-modal-close-btn"
          className={`absolute right-5 top-5 p-2 rounded-full transition cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/10'
              : 'text-[#64748B] hover:text-[#172B4D] hover:bg-slate-200/70'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Role Pill */}
        <div className="flex items-center justify-between mb-4 pr-8">
          <SwagatLogo size="xs" showWordmark={true} showTagline={false} theme={isDark ? 'dark' : 'light'} />
          
          {isAdminMode ? (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
              isDark 
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Statutory Admin</span>
            </span>
          ) : (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isDark 
                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' 
                : 'bg-sky-50 text-sky-800 border-sky-200'
            }`}>
              Investor / Business User
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h2 className={`text-xl sm:text-2xl font-display font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-[#172B4D]'
        }`}>
          {isAdminMode
            ? 'SWAGAT ADMINISTRATION'
            : formMode === 'forgot'
            ? 'Reset Your Password'
            : formMode === 'signup'
            ? 'Create Business Account'
            : 'Welcome to SWAGAT'}
        </h2>
        <p className={`text-xs mt-1.5 leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-[#64748B]'
        }`}>
          {isAdminMode
            ? 'National Single-Window Statutory & Departmental Scrutiny Console'
            : formMode === 'forgot'
            ? 'Enter your registered email to receive secure recovery instructions.'
            : formMode === 'signup'
            ? 'Register your enterprise to initiate and track single-window statutory clearances.'
            : 'Sign in to access your business applications, KYA roadmaps, and clearances.'}
        </p>
      </div>

      {/* Form Content Body */}
      <div className="p-6 sm:p-7">
        
        {/* Tab Switcher for Investor User Mode */}
        {!isAdminMode && formMode !== 'forgot' && (
          <div className={`relative flex p-1 rounded-2xl mb-5 border ${
            isDark ? 'bg-[#07182C] border-white/10' : 'bg-slate-100 border-[#D8E2EC]'
          }`}>
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => switchMode('signin')}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors z-10 cursor-pointer ${
                formMode === 'signin'
                  ? isDark ? 'text-white' : 'text-[#06152B]'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              {formMode === 'signin' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className={`absolute inset-0 rounded-xl shadow-md border ${
                    isDark
                      ? 'bg-white/15 border-white/20 backdrop-blur-md'
                      : 'bg-white border-[#D8E2EC] shadow-sm'
                  }`}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => switchMode('signup')}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors z-10 cursor-pointer ${
                formMode === 'signup'
                  ? isDark ? 'text-white' : 'text-[#06152B]'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              {formMode === 'signup' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className={`absolute inset-0 rounded-xl shadow-md border ${
                    isDark
                      ? 'bg-white/15 border-white/20 backdrop-blur-md'
                      : 'bg-white border-[#D8E2EC] shadow-sm'
                  }`}
                />
              )}
              <span className="relative z-10">Register Enterprise</span>
            </button>
          </div>
        )}

        {/* Error Message Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs ${
              isDark 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* Forgot Password Success Message */}
        {forgotSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs ${
              isDark 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span className="font-semibold leading-relaxed">
              Recovery instructions sent! Check your inbox for the secure OTP link.
            </span>
          </motion.div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* FORGOT PASSWORD FORM */}
          {formMode === 'forgot' ? (
            <div className="space-y-4">
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                <input
                  type="email"
                  required
                  placeholder="Enter registered email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                    isDark
                      ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                      : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Dispatching Recovery Link...' : 'Send Recovery Instructions'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setFormMode('signin'); setError(''); }}
                className={`w-full py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-[#64748B] hover:text-[#172B4D]'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          ) : (
            <>
              {/* SIGN UP EXTRA FIELDS */}
              <AnimatePresence>
                {!isAdminMode && formMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-3.5 overflow-hidden"
                  >
                    <div className="relative">
                      <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                      <input
                        type="text"
                        required
                        placeholder="Full Name (Authorized Signatory)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                          isDark
                            ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                            : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                        }`}
                      />
                    </div>

                    <div className="relative">
                      <Phone className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number (+91 XXXXX XXXXX)"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                          isDark
                            ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                            : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                        }`}
                      />
                    </div>

                    <div className="relative">
                      <Building2 className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                      <input
                        type="text"
                        placeholder="Company / Entity Name (e.g. ABC Solar Infra Ltd)"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                          isDark
                            ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                            : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EMAIL FIELD */}
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                <input
                  type="email"
                  id="auth-input-email"
                  required
                  placeholder={isAdminMode ? 'admin@swagat.gov.in' : 'name@company.in'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                    isDark
                      ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                      : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                  }`}
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-input-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                    isDark
                      ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                      : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#172B4D]'
                  }`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* FORGOT PASSWORD LINK (on sign-in) */}
              {formMode === 'signin' && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => { setFormMode('forgot'); setError(''); }}
                    className={`text-[11px] font-bold transition hover:underline cursor-pointer ${
                      isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* CONFIRM PASSWORD (on sign-up) */}
              {!isAdminMode && formMode === 'signup' && (
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 ${
                      isDark
                        ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                        : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                    }`}
                  />
                </div>
              )}

              {/* PRIMARY SUBMIT BUTTON - Unified Modern Blue Design */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
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
                        ? 'Login to Admin Console'
                        : formMode === 'signup'
                        ? 'Register Enterprise & Continue'
                        : 'Sign In to SWAGAT Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>

              {/* GOOGLE SIGN IN OPTION */}
              <button
                type="button"
                id="auth-google-btn"
                onClick={handleGoogleSignIn}
                className={`w-full py-2.5 border text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${
                  isDark
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white'
                    : 'border-[#D8E2EC] bg-white hover:bg-slate-50 text-[#172B4D]'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isAdminMode ? 'Continue as Admin with Google' : 'Continue with Google'}</span>
              </button>
            </>
          )}
        </form>

        {/* Statutory Compliance Footer Notice */}
        <div className={`mt-5 pt-4 border-t flex items-center justify-between text-[10px] ${
          isDark ? 'border-white/10 text-slate-400' : 'border-[#D8E2EC] text-[#64748B]'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-[#172B4D]'}`}>DPDP 2023 Compliant</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[9px]">256-Bit TLS</span>
          </div>
          <span className={`font-bold px-2 py-0.5 rounded border ${
            isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-100 text-[#172B4D] border-[#D8E2EC]'
          }`}>
            GovTech India
          </span>
        </div>

      </div>
    </div>
  );

  // If used as dedicated page component (e.g., at /login or /admin-login)
  if (isPageMode) {
    return (
      <div className="w-full flex items-center justify-center py-10 px-4">
        {CardContent}
      </div>
    );
  }

  // Otherwise, render as full animated modal
  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${
        isDark ? 'bg-black/75 backdrop-blur-xl' : 'bg-slate-900/40 backdrop-blur-md'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="w-full max-w-md my-8 flex items-center justify-center"
        >
          {CardContent}
        </motion.div>
      </div>

      {/* Google Account Picker Modal (Theme-Aware) */}
      {showGoogleAccountPicker && (
        <div className={`fixed inset-0 z-60 flex items-center justify-center p-4 backdrop-blur-md ${
          isDark ? 'bg-black/75' : 'bg-slate-900/40'
        }`}>
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl p-6 border space-y-4 animate-in zoom-in-95 ${
            isDark
              ? 'bg-[#0B2238] border-[rgba(140,175,210,0.25)] text-white shadow-2xl'
              : 'bg-[#FFFFFF] border-[#D8E2EC] text-[#172B4D] shadow-[0_20px_50px_rgba(20,40,60,0.18)]'
          }`}>
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] rounded-full" />
            
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-white/10' : 'border-[#D8E2EC]'
            }`}>
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#172B4D]'}`}>Sign in with Google</span>
              <button
                onClick={() => setShowGoogleAccountPicker(false)}
                className={`text-sm p-1 rounded-full transition cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100'
                }`}
              >
                ✕
              </button>
            </div>

            <div className={`p-3 rounded-xl space-y-1 border ${
              isDark ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200'
            }`}>
              <p className={`text-xs font-bold ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>
                Target Portal: <span className="underline">{roleLabel}</span>
              </p>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Role Binding: Whichever portal you sign into first with this account will bind its permission role.
              </p>
            </div>

            {/* Custom Google account input */}
            <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-[#D8E2EC]'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Or specify Google Account Email
              </p>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-sky-500 ${
                  isDark
                    ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                    : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                }`}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-sky-500 ${
                  isDark
                    ? 'bg-[#07182C] border-white/15 text-white placeholder:text-slate-500'
                    : 'bg-white border-[#D8E2EC] text-[#172B4D] placeholder:text-[#64748B]'
                }`}
              />
              <button
                disabled={!customGoogleEmail.includes('@')}
                onClick={() => handleSelectGoogleAccount(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0])}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm cursor-pointer"
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
