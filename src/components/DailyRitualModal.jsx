import React, { useState } from 'react';
import { Sun, Moon, CheckCircle2, Sparkles, X, ArrowRight, Flame } from 'lucide-react';

export default function DailyRitualModal({ isOpen, onClose, tasks, onSetFrogTask }) {
  if (!isOpen) return null;

  const [step, setStep] = useState('morning'); // 'morning' | 'complete'
  const [selectedFrogId, setSelectedFrogId] = useState(tasks.find(t => t.isFrog)?.id || '');

  const handleFinishMorning = () => {
    if (selectedFrogId) {
      onSetFrogTask(selectedFrogId);
    }
    setStep('complete');
  };

  return (
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 border border-slate-200 max-w-lg w-full space-y-5 shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2">
            <Sun class="h-5 w-5 text-amber-500" />
            <h2 class="text-base font-bold text-slate-900">
              {step === 'morning' ? 'Guided Morning Planning Ritual' : 'Morning Focus Locked!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            class="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        {step === 'morning' ? (
          <div class="space-y-4">
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Take 60 seconds to lock in your single most critical non-negotiable task today. Doing your hardest task first eliminates procrastination for the rest of the day.
            </p>

            <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Today's #1 Frog Priority:
              </label>

              {tasks.filter(t => !t.completed).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedFrogId(t.id)}
                  class={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedFrogId === t.id
                      ? 'border-emerald-600 bg-emerald-50 text-slate-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span class="text-xs">{t.title}</span>
                  {selectedFrogId === t.id && <CheckCircle2 class="h-4 w-4 text-emerald-600" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinishMorning}
              disabled={!selectedFrogId}
              class="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <span>Lock In Today's Frog 🐸</span>
              <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div class="text-center space-y-4 py-2">
            <Sparkles class="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 class="text-lg font-bold text-slate-900">Your Focus Plan is Ready!</h3>
            <p class="text-xs text-slate-600 max-w-sm mx-auto">
              Your Frog task is pinned to the top of your planner. Open your focus timer when ready to start your first 25-minute sprint.
            </p>

            <button
              onClick={onClose}
              class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition shadow-xs"
            >
              Start My Day 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
