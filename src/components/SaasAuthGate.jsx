import React from 'react';
import { CheckCircle2, LogIn, Sparkles, Shield, Wifi, Zap, Flame, Timer, LayoutGrid } from 'lucide-react';

export default function SaasAuthGate({ onGoogleSignIn, errorMsg }) {
  return (
    <div class="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-4 py-12">
      <div class="max-w-md w-full space-y-8 text-center">
        {/* App Logo & Header */}
        <div class="space-y-3">
          <div class="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 class="h-9 w-9 text-emerald-400" />
          </div>

          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
            Everyday<span class="text-emerald-600">Focus</span>
          </h1>

          <p class="text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            The ultra-minimalist everyday planner built to beat procrastination and keep your tasks synced across all your devices.
          </p>
        </div>

        {/* Error Alert (If any) */}
        {errorMsg && (
          <div class="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold rounded-2xl text-left shadow-xs">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Auth CTA Card */}
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div class="space-y-1">
            <h2 class="text-base font-bold text-slate-900">Sign In to Your Workspace</h2>
            <p class="text-xs text-slate-500 font-medium">Access your personal tasks, daily frogs & focus streaks.</p>
          </div>

          <button
            onClick={onGoogleSignIn}
            class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 transition shadow-md hover:scale-[1.01]"
          >
            <LogIn class="h-4 w-4 text-emerald-400" />
            <span>Continue with Google</span>
          </button>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-center space-x-4 text-[11px] text-slate-500 font-medium">
            <span class="flex items-center gap-1">
              <Shield class="h-3.5 w-3.5 text-emerald-600" /> 100% Free
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <Wifi class="h-3.5 w-3.5 text-emerald-600" /> Instant Cloud Sync
            </span>
          </div>
        </div>

        {/* Feature Grid Highlights */}
        <div class="grid grid-cols-2 gap-3 text-left">
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <span class="text-base">🐸</span>
              <span>Eat the Frog</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Focus on your #1 priority first thing every morning.</p>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Zap class="h-4 w-4 text-amber-500" />
              <span>Micro-Tasking</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">1-click AI breakdown for intimidating tasks.</p>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <LayoutGrid class="h-4 w-4 text-slate-700" />
              <span>Eisenhower</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">4-quadrant decision matrix for clear priorities.</p>
          </div>

          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
              <Timer class="h-4 w-4 text-emerald-600" />
              <span>Focus Timer</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">25m sprints with native system alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
