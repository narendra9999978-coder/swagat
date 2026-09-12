import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Mail, User, Phone,
  ArrowRight, Building2, Eye, EyeOff, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { SwagatLogo } from './SwagatLogo';
import { signInWithGoogleOAuth } from '../lib/supabaseClient';

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
  const roleBg = isAdminMode
    ? 'from-[#07182C] via-[#0B2545] to-[#07182C]'
    : 'from-emerald-800 via-emerald-700 to-teal-800';
  const roleAccent = isAdminMode ? 'text-amber-400' : 'text-emerald-300';
  const roleRing = isAdminMode ? 'focus:ring-amber-500' : 'focus:ring-emerald-500';
  const roleBtnBg = isAdminMode
    ? 'bg-gradient-to-r from-[#07182C] to-[#0B2545] hover:from-[#0B2545]'
    : 'bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
        <div className="w-full max-w-md my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Gradient header strip */}
        <div className={`bg-gradient-to-r ${roleBg} rounded-t-3xl p-6 text-white relative`}>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute right-5 top-5 p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <SwagatLogo size="sm" showWordmark={false} theme="light" />
            <div>
              <div className="text-xs font-bold tracking-widest uppercase opacity-70">Single Window System</div>
              <div className={`text-sm font-bold ${roleAccent}`}>{roleLabel}</div>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight">
            {isAdminMode
              ? 'ADMIN LOGIN'
              : formMode === 'signup'
              ? 'Sign Up'
              : 'Login'}
          </h2>
          <p className="text-white/70 text-xs mt-1">
            {isAdminMode
              ? 'Access Administrator Dashboard & Governance Controls'
              : formMode === 'signup'
              ? 'Create a new Business User account'
              : 'Sign in to access your business applications'}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-6 relative">

          {/* Tab switcher — only for USER mode */}
          {!isAdminMode && (
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-5">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${formMode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${formMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* User Sign Up fields */}
            {!isAdminMode && formMode === 'signup' && (
              <>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
                  />
                </div>

                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Company / Organization Name (e.g. ABC Electronics Pvt Ltd)"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
                  />
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={isAdminMode ? 'admin@domain.com' : 'name@company.in'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
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
                className={`w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 ${roleRing} text-sm font-medium`}
                />
              </div>
            )}

            {/* Account Type Selector (only on Sign Up) */}
            {!isAdminMode && formMode === 'signup' && (
              <div className="pt-1 pb-1">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Account Type</label>
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center space-x-2.5 text-xs text-emerald-950 font-bold">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    ●
                  </div>
                  <span>{accountType}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 ${roleBtnBg} text-white text-sm font-bold rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer`}
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
                      : 'Login'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Google Sign In option - available for both User and Admin */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{isAdminMode ? 'Continue as Admin with Google' : 'Continue with Google'}</span>
            </button>
          </form>

          {/* Database Notice */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Role Enforcement:</span>
              <span className="text-emerald-700 font-mono text-[10px]">Strict 1 Email = 1 Role Binding</span>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">
              Role Protection
            </span>
          </div>
        </div>
      </div>
    </div>

      {/* Google Account Picker Modal */}
      {showGoogleAccountPicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-bold text-sm text-slate-800">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleAccountPicker(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
              <p className="text-xs font-bold text-blue-950">
                Target Portal: <span className="underline">{roleLabel}</span>
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Role Binding: Whichever portal (Business or Admin) you sign into first with this Google account will permanently bind its role.
              </p>
            </div>

            {/* Custom Google account input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or use another Google email</p>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              />
              <button
                disabled={!customGoogleEmail.includes('@')}
                onClick={() => handleSelectGoogleAccount(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0])}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm cursor-pointer"
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
