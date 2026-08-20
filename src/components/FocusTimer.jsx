import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Maximize2, Minimize2, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTickSound, playTimerFinishSound } from '../utils/sound';
import { notifyFocusComplete, notifyBreakComplete, requestNotificationPermission, getNotificationPermission } from '../utils/notifications';

export default function FocusTimer({ tasks, selectedTaskForFocus, onToggleTask, onToggleSubtask, settings }) {
  const defaultWorkSecs = (settings?.pomodoroWorkMins || 25) * 60;
  const defaultBreakSecs = (settings?.pomodoroBreakMins || 5) * 60;

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(defaultWorkSecs);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState(selectedTaskForFocus || tasks.find(t => !t.completed) || null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [notificationStatus, setNotificationStatus] = useState(getNotificationPermission());

  useEffect(() => {
    if (selectedTaskForFocus) {
      setActiveTask(selectedTaskForFocus);
    }
  }, [selectedTaskForFocus]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimerFinish();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerFinish = () => {
    setIsRunning(false);
    playTimerFinishSound();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#0F172A', '#10B981', '#64748B']
    });

    if (mode === 'focus') {
      setCompletedSessionsCount(prev => prev + 1);
      notifyFocusComplete(activeTask?.title);
      setMode('break');
      setTimeLeft(defaultBreakSecs);
    } else {
      notifyBreakComplete();
      setMode('focus');
      setTimeLeft(defaultWorkSecs);
    }
  };

  const handleEnableNotifications = () => {
    requestNotificationPermission().then((status) => {
      setNotificationStatus(status);
    });
  };

  const toggleTimer = () => {
    playTickSound();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? defaultWorkSecs : defaultBreakSecs);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? defaultWorkSecs : defaultBreakSecs);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSecs = mode === 'focus' ? defaultWorkSecs : defaultBreakSecs;
  const progressPercent = ((totalSecs - timeLeft) / totalSecs) * 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <div class={`transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-[#FAF9F6] p-6 flex flex-col justify-center items-center' : 'space-y-6'}`}>
      <div class="glass-card rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            onClick={() => switchMode('focus')}
            class={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              mode === 'focus'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Focus (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            class={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              mode === 'break'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            ☕ Rest (5m)
          </button>
        </div>

        <div class="flex items-center space-x-2">
          {notificationStatus !== 'granted' && (
            <button
              onClick={handleEnableNotifications}
              class="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1"
              title="Enable Desktop/Lock-screen Notifications"
            >
              <Bell class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Enable Alerts</span>
            </button>
          )}

          <span class="text-xs text-slate-600 font-semibold">
            Sessions Today: <strong class="text-emerald-700">{completedSessionsCount}</strong>
          </span>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            class="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition border border-slate-200"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
          >
            {isFullscreen ? <Minimize2 class="h-4 w-4" /> : <Maximize2 class="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div class="glass-card rounded-3xl p-6 md:p-10 border border-slate-200/80 text-center space-y-6 max-w-xl mx-auto shadow-sm">
        <div class="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              stroke-width="8"
              class="text-slate-100"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              stroke-width="8"
              stroke-linecap="round"
              class={mode === 'focus' ? 'text-emerald-500' : 'text-slate-700'}
              fill="transparent"
              stroke-dasharray="440"
              stroke-dashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-mono">
              {formatTime(timeLeft)}
            </span>
            <span class={`text-xs font-semibold uppercase tracking-wider mt-2 px-3 py-1 rounded-full ${
              mode === 'focus' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {mode === 'focus' ? 'Focus Session' : 'Rest Break'}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center space-x-4">
          <button
            onClick={resetTimer}
            class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition"
            title="Reset Timer"
          >
            <RotateCcw class="h-5 w-5" />
          </button>

          <button
            onClick={toggleTimer}
            class="px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base md:text-lg flex items-center space-x-2 transition shadow-sm"
          >
            {isRunning ? <Pause class="h-5 w-5 fill-current text-white" /> : <Play class="h-5 w-5 fill-current text-emerald-400" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-slate-100 text-left space-y-3">
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Focusing On Task:
          </label>

          <select
            value={activeTask?.id || ''}
            onChange={(e) => {
              const selected = tasks.find(t => t.id === e.target.value);
              setActiveTask(selected || null);
            }}
            class="w-full bg-slate-50 text-slate-900 py-2.5 px-3.5 rounded-xl border border-slate-200 focus:outline-none text-sm font-semibold"
          >
            <option value="">-- Select a task to link timer --</option>
            {tasks.filter(t => !t.completed).map((t) => (
              <option key={t.id} value={t.id}>
                {t.isFrog ? '🐸 ' : ''}{t.title} ({t.category})
              </option>
            ))}
          </select>

          {activeTask && activeTask.subtasks?.length > 0 && (
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span class="text-xs font-semibold text-slate-800">Micro-Steps Checklist:</span>
              <div class="space-y-1.5">
                {activeTask.subtasks.map((sub) => (
                  <div key={sub.id} class="flex items-center space-x-2 text-xs font-medium">
                    <button
                      onClick={() => onToggleSubtask(activeTask.id, sub.id)}
                      class="text-slate-400 hover:text-emerald-600"
                    >
                      {sub.completed ? (
                        <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle class="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <span class={sub.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
