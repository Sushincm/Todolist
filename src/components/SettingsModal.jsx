import React from 'react';
import { X, Settings as SettingsIcon, Download, Upload, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReloadData,
  user,
  onGoogleSignIn,
  onGoogleSignOut
}) {
  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = importBackupJSON(evt.target.result);
      if (success) {
        alert('Data successfully imported!');
        onReloadData();
        onClose();
      } else {
        alert('Failed to import backup file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 border border-slate-200 max-w-md w-full space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon class="h-5 w-5 text-slate-700" />
            Settings & Options
          </h2>
          <button
            onClick={onClose}
            class="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        {/* 1-Click Google Account Cross-Device Sync */}
        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Google Account Real-Time Device Sync
          </label>

          <p class="text-xs text-slate-500 leading-relaxed font-medium">
            Sign in with your Google account on any phone, tablet, or PC to automatically sync tasks, habits, and focus minutes in real time.
          </p>

          {user ? (
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} class="h-7 w-7 rounded-full" />
                  ) : (
                    <div class="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {user.displayName?.[0] || 'G'}
                    </div>
                  )}
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">{user.displayName || 'Google Account'}</h4>
                    <p class="text-[11px] text-slate-500 font-medium">{user.email}</p>
                  </div>
                </div>

                <span class="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 class="h-3 w-3" />
                  <span>Synced</span>
                </span>
              </div>

              <button
                onClick={onGoogleSignOut}
                class="w-full mt-2 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <LogOut class="h-3.5 w-3.5" />
                <span>Sign Out of Google</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <LogIn class="h-4 w-4 text-emerald-400" />
              <span>1-Click Sign In with Google</span>
            </button>
          )}
        </div>

        {/* Pomodoro Durations */}
        <div class="space-y-3 border-t border-slate-100 pt-4">
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Focus Timer Durations
          </label>
          <div class="grid grid-cols-2 gap-3 text-xs font-semibold">
            <div>
              <label class="block text-slate-600 mb-1">Focus Mins</label>
              <input
                type="number"
                value={settings.pomodoroWorkMins}
                onChange={(e) => onUpdateSettings({ ...settings, pomodoroWorkMins: Number(e.target.value) || 25 })}
                class="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label class="block text-slate-600 mb-1">Break Mins</label>
              <input
                type="number"
                value={settings.pomodoroBreakMins}
                onChange={(e) => onUpdateSettings({ ...settings, pomodoroBreakMins: Number(e.target.value) || 5 })}
                class="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Manual Backup File */}
        <div class="space-y-3 border-t border-slate-100 pt-4">
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manual Backup File
          </label>
          <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={exportBackupJSON}
              class="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-900 flex items-center justify-center space-x-1.5 transition shadow-xs"
            >
              <Download class="h-4 w-4 text-emerald-400" />
              <span>Export JSON</span>
            </button>

            <label class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5 cursor-pointer transition">
              <Upload class="h-4 w-4 text-slate-600" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} class="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
