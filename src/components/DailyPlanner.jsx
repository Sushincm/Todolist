import React, { useState } from 'react';
import { CheckCircle2, Circle, Play, Trash2, CheckSquare, Sparkles, ChevronRight, ChevronDown, Wand2, Zap, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTaskCompleteSound } from '../utils/sound';

export default function DailyPlanner({ tasks, onToggleTask, onToggleSubtask, onDeleteTask, onDecomposeTask, onStartFocusTask }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLowEnergyOnly, setIsLowEnergyOnly] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState({});

  const filteredTasks = tasks.filter(t => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (isLowEnergyOnly && (t.estimatedMins > 15)) return false;
    return true;
  });

  const frogTask = tasks.find(t => t.isFrog && !t.completed) || tasks.find(t => t.isFrog);

  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleTaskCheck = (task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      playTaskCompleteSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0F172A', '#10B981', '#64748B']
      });
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTaskIds(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const categories = ['All', 'Work', 'Personal', 'Health', 'Study', 'Planning'];

  return (
    <div class="space-y-6">
      {/* 🐸 EAT THE FROG HERO BANNER */}
      {frogTask ? (
        <div class={`rounded-2xl p-5 md:p-6 transition-all border shadow-xs ${
          frogTask.completed
            ? 'bg-slate-50 border-slate-200 text-slate-500'
            : 'bg-white border-emerald-300 text-slate-900 shadow-sm'
        }`}>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span>🐸</span> TODAY'S FROG (TOP FOCUS)
                </span>
                {frogTask.completed && (
                  <span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                    Completed
                  </span>
                )}
              </div>
              <h2 class={`text-lg md:text-xl font-bold tracking-tight ${frogTask.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                {frogTask.title}
              </h2>
              {frogTask.description && (
                <p class="text-xs md:text-sm text-slate-600">{frogTask.description}</p>
              )}
            </div>

            <div class="flex items-center space-x-2.5 self-start sm:self-center">
              {!frogTask.completed && (
                <button
                  onClick={() => onStartFocusTask(frogTask)}
                  class="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs md:text-sm transition shadow-xs"
                >
                  <Play class="h-4 w-4 fill-current text-emerald-400" />
                  <span>Start Focus Session</span>
                </button>
              )}
              <button
                onClick={() => handleTaskCheck(frogTask)}
                class={`p-2.5 rounded-xl border transition ${
                  frogTask.completed
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={frogTask.completed ? "Mark incomplete" : "Complete Frog Task"}
              >
                <CheckCircle2 class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div class="bg-white rounded-2xl p-4 border border-dashed border-slate-300 text-center">
          <p class="text-xs text-slate-600 font-medium flex items-center justify-center gap-1.5">
            <span>🐸</span> No "Frog" set for today. Mark your most crucial task as the Frog to start focusing.
          </p>
        </div>
      )}

      {/* Progress & Special Filters Bar */}
      <div class="glass-card rounded-2xl p-4 border border-slate-200/80 space-y-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1 space-y-1.5">
            <div class="flex justify-between items-center text-xs font-semibold">
              <span class="text-slate-700">Daily Completion Progress</span>
              <span class="text-emerald-700 font-bold">{completedCount} of {totalTasks} Tasks ({completionPercentage}%)</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Win Filter Toggle */}
          <button
            onClick={() => setIsLowEnergyOnly(!isLowEnergyOnly)}
            class={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
              isLowEnergyOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Filter tasks under 15 minutes for quick win momentum"
          >
            <Zap class="h-3.5 w-3.5 text-amber-500" />
            <span>⚡ Low Energy Filter (Sub-15Mins)</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              class={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div class="space-y-3">
        {filteredTasks.length === 0 ? (
          <div class="glass-card rounded-2xl p-8 text-center border border-slate-200/80 space-y-2">
            <Sparkles class="h-7 w-7 text-emerald-600 mx-auto" />
            <h3 class="text-base font-semibold text-slate-900">No tasks match this filter</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Add a quick task above or switch off the Low Energy filter to see all tasks.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskIds[task.id];
            const subtaskCount = task.subtasks?.length || 0;
            const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;

            return (
              <div
                key={task.id}
                class={`glass-card rounded-2xl p-4 border transition-all ${
                  task.completed
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div class="flex items-start justify-between gap-3">
                  <button
                    onClick={() => handleTaskCheck(task)}
                    class="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 class="h-5 w-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle class="h-5 w-5 hover:stroke-slate-900" />
                    )}
                  </button>

                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                      {task.isFrog && <span class="text-xs" title="Today's Frog">🐸</span>}
                      <h3 class={`text-sm md:text-base font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h3>
                      
                      <span class={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        task.priority === 'p1' ? 'bg-slate-900 text-white' :
                        task.priority === 'p2' ? 'bg-slate-200 text-slate-800' :
                        task.priority === 'p3' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>

                      <span class="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        {task.estimatedMins || 25} Mins
                      </span>
                    </div>

                    {task.description && (
                      <p class="text-xs text-slate-500 leading-relaxed font-normal">{task.description}</p>
                    )}

                    {subtaskCount > 0 && (
                      <div class="flex items-center space-x-3 pt-1">
                        <button
                          onClick={() => toggleTaskExpand(task.id)}
                          class="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
                        >
                          <CheckSquare class="h-3.5 w-3.5 text-slate-500" />
                          <span>{completedSubtasks}/{subtaskCount} Sub-steps</span>
                          {isExpanded ? <ChevronDown class="h-3 w-3" /> : <ChevronRight class="h-3 w-3" />}
                        </button>

                        <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            class="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(completedSubtasks / subtaskCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div class="flex items-center space-x-1.5 self-start">
                    {/* Smart Micro-Task Decomposer Button */}
                    {!task.completed && subtaskCount === 0 && (
                      <button
                        onClick={() => onDecomposeTask(task.id)}
                        class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition border border-slate-200"
                        title="Auto-break down into 5-minute micro-steps"
                      >
                        <Wand2 class="h-3 w-3 text-emerald-600" />
                        <span class="hidden sm:inline">Break Down</span>
                      </button>
                    )}

                    {!task.completed && (
                      <button
                        onClick={() => onStartFocusTask(task)}
                        class="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
                        title="Start Focus Session"
                      >
                        <Play class="h-3 w-3 fill-current text-slate-900" />
                        <span class="hidden sm:inline">Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                      title="Delete task"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && subtaskCount > 0 && (
                  <div class="mt-3 pt-3 border-t border-slate-100 space-y-1.5 pl-6">
                    {task.subtasks.map((sub) => (
                      <div key={sub.id} class="flex items-center space-x-2 text-xs font-medium">
                        <button
                          onClick={() => onToggleSubtask(task.id, sub.id)}
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
