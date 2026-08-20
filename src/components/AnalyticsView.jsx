import React from 'react';
import { BarChart2, CheckCircle2, Flame, Timer, Lightbulb, Zap, Target } from 'lucide-react';

export default function AnalyticsView({ tasks, streakData, habits }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const frogCompleted = tasks.filter(t => t.isFrog && t.completed).length;
  const totalEstMins = tasks.reduce((sum, t) => sum + (t.estimatedMins || 25), 0);
  const completedEstMins = tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.estimatedMins || 25), 0);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div class="space-y-6">
      <div class="glass-card rounded-2xl p-5 border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 class="h-5 w-5 text-emerald-600" />
            Productivity & Focus Insights
          </h2>
          <p class="text-xs text-slate-500">Track task momentum and completion metrics.</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-1">
          <div class="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
            <Flame class="h-4 w-4 text-emerald-600" />
            <span>Active Streak</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900">{streakData?.count || 1} Days</p>
          <p class="text-[11px] text-slate-500">Consistency score</p>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-1">
          <div class="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold">
            <CheckCircle2 class="h-4 w-4 text-slate-900" />
            <span>Task Completion</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900">{completionRate}%</p>
          <p class="text-[11px] text-slate-500">{completedTasks} of {totalTasks} finished</p>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-1">
          <div class="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold">
            <Timer class="h-4 w-4 text-slate-900" />
            <span>Focus Time</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900">{completedEstMins} Mins</p>
          <p class="text-[11px] text-slate-500">Of {totalEstMins} estimated mins</p>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-1">
          <div class="flex items-center space-x-1.5 text-xs text-emerald-800 font-semibold">
            <span>🐸</span>
            <span>Frogs Eaten</span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900">{frogCompleted}</p>
          <p class="text-[11px] text-slate-500">Top priorities crushed</p>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb class="h-4 w-4 text-emerald-600" />
          The Science of Productivity
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div class="flex items-center space-x-2 text-slate-900 font-bold">
              <Zap class="h-4 w-4 text-emerald-600" />
              <span>1. Lower Activation Energy</span>
            </div>
            <p class="text-slate-600 leading-relaxed font-normal">
              Procrastination happens when starting feels overwhelming. Always decompose big tasks into 5-minute sub-steps.
            </p>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div class="flex items-center space-x-2 text-slate-900 font-bold">
              <span>🐸</span>
              <span>2. Eat the Frog First</span>
            </div>
            <p class="text-slate-600 leading-relaxed font-normal">
              Do your hardest, most crucial task first thing. Your willpower drops exponentially throughout the day.
            </p>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div class="flex items-center space-x-2 text-slate-900 font-bold">
              <Target class="h-4 w-4 text-emerald-600" />
              <span>3. The 2-Minute Rule</span>
            </div>
            <p class="text-slate-600 leading-relaxed font-normal">
              If a micro-step takes under 2 minutes, do it immediately. Don't queue or delay it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
