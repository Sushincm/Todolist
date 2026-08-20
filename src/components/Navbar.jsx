import React from 'react';
import { Calendar, LayoutGrid, Timer, Flame, CheckCircle2, BarChart2, Settings, Smartphone, Sun, LogIn, LogOut, User } from 'lucide-react';

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

  const displayName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 shadow-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo & App Title */}
          <div class="flex items-center space-x-2.5 sm:space-x-3">
            <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 class="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
            <div>
              <h1 class="text-sm sm:text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Everyday<span class="text-emerald-600">Focus</span>
                {user && (
                  <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Cloud Realtime Sync Active" />
                )}
              </h1>
              <p class="text-[10px] sm:text-[11px] text-slate-500 font-medium">{todayDateStr}</p>
            </div>
          </div>

          {/* Center: Desktop Nav Links */}
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

          {/* Right: Actions, Streak & FAR RIGHT User Profile + Logout */}
          <div class="flex items-center space-x-1.5 sm:space-x-2">
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
            <div class="flex items-center space-x-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-semibold" title="Active Streak">
              <Flame class="h-3.5 w-3.5 text-emerald-600" />
              <span class="text-[11px] font-bold">{streakCount}d</span>
            </div>

            {isPwaInstallable && (
              <button
                onClick={onInstallPwa}
                class="hidden md:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition"
                title="Install App"
              >
                <Smartphone class="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              class="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200/80"
              title="Settings"
            >
              <Settings class="h-4 w-4" />
            </button>

            {/* FAR RIGHT: User Profile & Logout Button */}
            {user ? (
              <div class="flex items-center space-x-1.5 bg-slate-100/90 border border-slate-200 pl-1.5 sm:pl-2 pr-1 py-1 rounded-xl shadow-2xs">
                {/* User Avatar */}
                <div class="flex items-center space-x-1.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={displayName} class="h-6 w-6 rounded-full border border-white shadow-2xs" />
                  ) : (
                    <div class="h-6 w-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                      {displayName[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span class="text-xs font-bold text-slate-900 max-w-[85px] sm:max-w-[110px] truncate">
                    {displayName}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onGoogleSignOut}
                  class="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
                  title="Log Out of Workspace"
                >
                  <LogOut class="h-3 w-3 text-rose-600" />
                  <span class="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-xs"
              >
                <LogIn class="h-3.5 w-3.5 text-emerald-400" />
                <span>Sign In</span>
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
