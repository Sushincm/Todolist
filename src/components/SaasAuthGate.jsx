import React, { useState } from 'react';
import { CheckCircle2, LogIn, UserPlus, Sparkles, Shield, Wifi, Zap, Flame, Timer, LayoutGrid, AlertCircle, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function SaasAuthGate({ onGoogleSignIn, onEmailSignIn, onEmailSignUp, errorMsg }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      try {
        await onEmailSignUp(name, email, password);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        await onEmailSignIn(email, password);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAuthError = (err) => {
    console.warn('Auth submission error:', err);
    if (!err || !err.code) {
      setLocalError(err?.message || 'Authentication failed. Please check your credentials.');
      return;
    }

    switch (err.code) {
      case 'auth/email-already-in-use':
        setLocalError('An account with this email already exists. Please sign in instead.');
        break;
      case 'auth/invalid-email':
        setLocalError('Please enter a valid email address.');
        break;
      case 'auth/weak-password':
        setLocalError('Password is too weak. Please use at least 6 characters.');
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        setLocalError('Invalid email or password. Please try again.');
        break;
      case 'auth/unauthorized-domain':
        setLocalError(`Domain "${window.location.hostname}" is not authorized in Firebase Console yet.`);
        break;
      case 'auth/popup-blocked':
        setLocalError('Google Sign-In popup was blocked by browser. Please allow popups or use email sign-in.');
        break;
      default:
        setLocalError(err.message || 'Authentication error occurred.');
    }
  };

  const displayError = localError || errorMsg;

  return (
    <div class="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-4 py-8 md:py-12">
      <div class="max-w-md w-full space-y-6 text-center">
        {/* App Branding */}
        <div class="space-y-2">
          <div class="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 class="h-8 w-8 text-emerald-400" />
          </div>

          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Everyday<span class="text-emerald-600">Focus</span>
          </h1>

          <p class="text-xs md:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            The ultra-minimalist SaaS planner built to beat procrastination and keep tasks synchronized across all devices.
          </p>
        </div>

        {/* Error Alert Box */}
        {displayError && (
          <div class="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl text-left flex items-start space-x-2 animate-in fade-in duration-200">
            <AlertCircle class="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
            <p class="leading-relaxed">{displayError}</p>
          </div>
        )}

        {/* Auth Box */}
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-left">
          {/* Mode Switcher Tabs */}
          <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLocalError(''); }}
              class={`py-2 rounded-lg transition-all text-center ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setLocalError(''); }}
              class={`py-2 rounded-lg transition-all text-center ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div class="relative">
                  <User class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sushin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div class="relative">
                  <Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              class="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-xs mt-2"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : authMode === 'signup' ? (
                <>
                  <UserPlus class="h-4 w-4 text-emerald-400" />
                  <span>Create Account & Start</span>
                </>
              ) : (
                <>
                  <LogIn class="h-4 w-4 text-emerald-400" />
                  <span>Sign In to Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div class="relative flex items-center justify-center my-2">
            <div class="border-t border-slate-200 w-full" />
            <span class="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Or continue with
            </span>
            <div class="border-t border-slate-200 w-full" />
          </div>

          {/* 1-Click Google Login Button */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            class="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition border border-slate-200 shadow-2xs"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Google Account</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div class="flex items-center justify-center space-x-6 text-[11px] text-slate-500 font-medium pt-2">
          <span class="flex items-center gap-1.5">
            <Shield class="h-3.5 w-3.5 text-emerald-600" /> Free Cloud Sync
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5">
            <Wifi class="h-3.5 w-3.5 text-emerald-600" /> Multi-Device
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5">
            <Flame class="h-3.5 w-3.5 text-amber-500" /> Streak Tracking
          </span>
        </div>
      </div>
    </div>
  );
}
