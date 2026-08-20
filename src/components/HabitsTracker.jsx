import React, { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTaskCompleteSound } from '../utils/sound';

export default function HabitsTracker({ habits, onToggleHabit, onAddHabit }) {
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const handleCheck = (habit) => {
    onToggleHabit(habit.id);
    if (!habit.completedToday) {
      playTaskCompleteSound();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0F172A', '#10B981', '#64748B']
      });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle.trim(),
      streak: 1,
      completedToday: false,
      icon: 'star'
    };

    onAddHabit(newHabit);
    setNewHabitTitle('');
  };

  return (
    <div class="space-y-6">
      <div class="glass-card rounded-2xl p-5 border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame class="h-5 w-5 text-emerald-600" />
            Everyday Habits & Momentum
          </h2>
          <p class="text-xs text-slate-500">Small daily wins build long-term consistency.</p>
        </div>
      </div>

      <form onSubmit={handleAddSubmit} class="glass-card rounded-2xl p-3 border border-slate-200/80 flex items-center space-x-2">
        <input
          type="text"
          value={newHabitTitle}
          onChange={(e) => setNewHabitTitle(e.target.value)}
          placeholder="Add a new daily habit (e.g. 10m morning meditation)..."
          class="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs md:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
        />
        <button
          type="submit"
          disabled={!newHabitTitle.trim()}
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition"
        >
          + Add Habit
        </button>
      </form>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            class={`glass-card rounded-2xl p-4 border transition-all ${
              habit.completedToday
                ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-slate-900">{habit.title}</h3>
                <div class="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                  <Flame class="h-4 w-4 text-emerald-600" />
                  <span>{habit.streak} Day Streak</span>
                </div>
              </div>

              <button
                onClick={() => handleCheck(habit)}
                class={`p-3 rounded-xl transition ${
                  habit.completedToday
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-200'
                }`}
                title={habit.completedToday ? "Done for today!" : "Check in today"}
              >
                <CheckCircle2 class="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
