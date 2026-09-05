import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  Building2, 
  User, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { useSwagat } from '../context/SwagatContext';
import { SwagatLogo } from './SwagatLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    pendingApprovalToApply,
    showToast
  } = useSwagat();

  const [identifier, setIdentifier] = useState('rajesh.sharma@apexind.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [isOfficerMode, setIsOfficerMode] = useState(authModalMode === 'officer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = isOfficerMode || authModalMode === 'officer' ? 'officer' : 'investor';
    login(role, {
      email: identifier.includes('@') ? identifier : `${identifier}@swagat.gov`,
      phone: !identifier.includes('@') ? identifier : '+91 98201 45678',
      name: identifier.includes('@') ? identifier.split('@')[0] : 'User',
      password: password && password !== '••••••••••••' ? password : 'pass123'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <SwagatLogo size="md" showWordmark={true} theme="light" />
          </div>
          
          <h3 className="text-2xl font-display font-extrabold text-[#07182C]">
            {authModalMode === 'signup' 
              ? 'Create SWAGAT Account' 
              : isOfficerMode 
              ? 'Ministry / Government Officer Portal' 
              : 'Sign in to SWAGAT'}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Single-sign-on access to all 1,400+ Central and State clearance services.
          </p>
        </div>

        {/* Process Continuity Alert if user was in middle of applying */}
        {pendingApprovalToApply && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Application Context Preserved:</span>
              You are applying for <strong>{pendingApprovalToApply.name}</strong>. Signing in will immediately resume your application with pre-filled company details.
            </div>
          </div>
        )}

        {/* Persona Selector Tabs: Investor / Business vs Ministry Officer */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setIsOfficerMode(false)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              !isOfficerMode 
                ? 'bg-white text-[#07182C] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Investor / Business</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOfficerMode(true)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              isOfficerMode 
                ? 'bg-[#07182C] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry / Officer</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1.5">
              {isOfficerMode ? 'Government Employee ID / Email' : 'Email Address / Mobile Number'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isOfficerMode ? 'officer.id@nic.in' : 'name@company.in or +91 98201...'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px]">Password / Security PIN</label>
              <button type="button" className="text-[11px] font-semibold text-blue-700 hover:underline">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#07182C] text-sm font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* DigiLocker One-Click Auth Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fingerprint className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] text-slate-700 font-semibold">DigiLocker / Aadhaar e-KYC Ready</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700">Instant Verification</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="auth-modal-submit-btn"
            className="w-full py-3.5 bg-gradient-to-r from-[#07182C] via-[#0B2545] to-[#07182C] hover:from-[#0B2545] hover:to-[#07182C] text-white text-sm font-bold rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center space-x-2"
          >
            <span>{authModalMode === 'signup' ? 'Create Account & Continue' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <div className="text-[11px] text-slate-500 mb-2">Instant Demo Quick-Sign-In:</div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                login('investor');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs"
            >
              Investor Demo (Rajesh Sharma)
            </button>
            <button
              onClick={() => {
                login('officer', { name: 'Dr. Suresh Patil', companyName: 'Maharashtra Pollution Control Board (MPCB)' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
            >
              Officer Demo (MPCB)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
