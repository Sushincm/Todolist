import React from 'react';
import { Calendar, LayoutGrid, Timer, Flame, CheckCircle2, BarChart2, Settings, Smartphone, Sun, LogIn, LogOut } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  streakCount,
  onOpenSettings,
  onOpenRitual,
  isPwaInstallable,
  onInstallPwa,
  user,
  onGoogleSignIn,
  onGoogleSignOut
}) {
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <header class="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 shadow-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Logo & Date */}
          <div class="flex items-center space-x-3">
            <div class="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 class="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 class="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Everyday<span class="text-emerald-600">Focus</span>
                {user && (
                  <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Google Realtime Sync Active" />
                )}
              </h1>
              <p class="text-[11px] text-slate-500 font-medium">{todayDateStr}</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav class="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('planner')}
              class={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'planner'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar class="h-3.5 w-3.5" />
              <span>Daily Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              class={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutGrid class="h-3.5 w-3.5" />
              <span>Eisenhower</span>
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              class={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'timer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Timer class="h-3.5 w-3.5" />
              <span>Focus Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('habits')}
              class={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'habits'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Flame class="h-3.5 w-3.5 text-emerald-500" />
              <span>Habits</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              class={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart2 class="h-3.5 w-3.5" />
              <span>Insights</span>
            </button>
          </nav>

          {/* Right Action Icons & FAR RIGHT END Google Login/Logout */}
          <div class="flex items-center space-x-2">
            {/* Morning Ritual Launcher */}
            <button
              onClick={onOpenRitual}
              class="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold transition"
              title="Guided Morning Planning Ritual"
            >
              <Sun class="h-3.5 w-3.5 text-amber-600" />
              <span>Morning Plan</span>
            </button>

            {/* Streak Counter */}
            <div class="hidden sm:flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold" title="Active Streak">
              <Flame class="h-3.5 w-3.5 text-emerald-600" />
              <span>{streakCount} Day Streak</span>
            </div>

            {isPwaInstallable && (
              <button
                onClick={onInstallPwa}
                class="hidden md:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                title="Install App"
              >
                <Smartphone class="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              class="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200/80"
              title="Settings"
            >
              <Settings class="h-4 w-4" />
            </button>

            {/* FAR RIGHT END: Google Login / Logout Button */}
            {user ? (
              <div class="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 pl-2 pr-1.5 py-1 rounded-xl">
                <div class="flex items-center space-x-1.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} class="h-5 w-5 rounded-full" />
                  ) : (
                    <div class="h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {user.displayName?.[0] || 'G'}
                    </div>
                  )}
                  <span class="text-xs font-bold text-slate-900 max-w-[90px] truncate hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                </div>

                <button
                  onClick={onGoogleSignOut}
                  class="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
                  title="Sign Out of Google"
                >
                  <LogOut class="h-3.5 w-3.5 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-xs border border-slate-900 hover:scale-102"
                title="Sign in with Google Account"
              >
                <LogIn class="h-3.5 w-3.5 text-emerald-400" />
                <span>Google Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('planner')}
          class={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'planner' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar class="h-5 w-5 mb-0.5" />
          <span>Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          class={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'matrix' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutGrid class="h-5 w-5 mb-0.5" />
          <span>Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          class={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'timer' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Timer class="h-5 w-5 mb-0.5" />
          <span>Timer</span>
        </button>

        <button
          onClick={() => setActiveTab('habits')}
          class={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'habits' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Flame class="h-5 w-5 mb-0.5 text-emerald-600" />
          <span>Habits</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          class={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'analytics' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart2 class="h-5 w-5 mb-0.5" />
          <span>Stats</span>
        </button>
      </nav>
    </>
  );
}
