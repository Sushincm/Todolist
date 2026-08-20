import React from 'react';
import { AlertCircle, Calendar, Users, Trash, CheckCircle2, Circle, Play } from 'lucide-react';

export default function EisenhowerMatrix({ tasks, onUpdateQuadrant, onToggleTask, onStartFocusTask }) {
  const quadrants = [
    {
      id: 'do-first',
      title: 'Do First (Urgent & Important)',
      subtitle: 'Crises, pressing deadlines, core frogs',
      borderColor: 'border-slate-300',
      bgColor: 'bg-slate-50/80',
      badgeColor: 'bg-slate-900 text-white font-bold',
      icon: AlertCircle,
    },
    {
      id: 'schedule',
      title: 'Schedule (Important, Not Urgent)',
      subtitle: 'Planning, deep work, self-improvement',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/40',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold',
      icon: Calendar,
    },
    {
      id: 'delegate',
      title: 'Delegate / Quick (Urgent, Not Important)',
      subtitle: 'Interrupts, emails, quick favors',
      borderColor: 'border-slate-200',
      bgColor: 'bg-white',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200 font-bold',
      icon: Users,
    },
    {
      id: 'eliminate',
      title: 'Eliminate / Low (Neither)',
      subtitle: 'Time wasters, busywork, distractions',
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-50/50',
      badgeColor: 'bg-slate-100 text-slate-500 border border-slate-200',
      icon: Trash,
    },
  ];

  return (
    <div class="space-y-4">
      <div class="glass-card rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Eisenhower Priority Matrix</h2>
          <p class="text-xs text-slate-500">Categorize tasks by Urgency and Importance.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quad) => {
          const QuadIcon = quad.icon;
          const quadTasks = tasks.filter(t => t.matrixQuadrant === quad.id);

          return (
            <div
              key={quad.id}
              class={`glass-card rounded-2xl p-4 border ${quad.borderColor} ${quad.bgColor} space-y-3 min-h-[220px] flex flex-col`}
            >
              <div class="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div class="flex items-center space-x-2">
                  <QuadIcon class="h-4 w-4 text-slate-700" />
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">{quad.title}</h3>
                    <p class="text-[11px] text-slate-500">{quad.subtitle}</p>
                  </div>
                </div>
                <span class={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${quad.badgeColor}`}>
                  {quadTasks.length}
                </span>
              </div>

              <div class="flex-1 space-y-2 overflow-y-auto max-h-64 pr-1">
                {quadTasks.length === 0 ? (
                  <div class="h-full flex items-center justify-center text-xs text-slate-400 py-6 italic font-medium">
                    No tasks in this quadrant
                  </div>
                ) : (
                  quadTasks.map((t) => (
                    <div
                      key={t.id}
                      class={`bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-2 shadow-xs ${
                        t.completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div class="flex items-center space-x-2.5 min-w-0">
                        <button
                          onClick={() => onToggleTask(t.id)}
                          class="text-slate-400 hover:text-emerald-600"
                        >
                          {t.completed ? (
                            <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Circle class="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        <span class={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {t.title}
                        </span>
                      </div>

                      <div class="flex items-center space-x-1">
                        {!t.completed && (
                          <button
                            onClick={() => onStartFocusTask(t)}
                            class="p-1 text-slate-700 hover:bg-slate-100 rounded-md transition"
                            title="Start Focus Session"
                          >
                            <Play class="h-3.5 w-3.5 fill-current" />
                          </button>
                        )}

                        <select
                          value={t.matrixQuadrant}
                          onChange={(e) => onUpdateQuadrant(t.id, e.target.value)}
                          class="bg-slate-50 text-[10px] text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-200 focus:outline-none"
                          title="Move to another quadrant"
                        >
                          <option value="do-first">Do First</option>
                          <option value="schedule">Schedule</option>
                          <option value="delegate">Delegate</option>
                          <option value="eliminate">Eliminate</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
