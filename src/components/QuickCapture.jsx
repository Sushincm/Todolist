import React, { useState } from 'react';
import { Plus, ListPlus } from 'lucide-react';

export default function QuickCapture({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFrog, setIsFrog] = useState(false);
  const [priority, setPriority] = useState('p1');
  const [category, setCategory] = useState('Work');
  const [estimatedMins, setEstimatedMins] = useState(25);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = ['Work', 'Personal', 'Health', 'Study', 'Planning'];

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { id: `sub-${Date.now()}-${Math.random()}`, title: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let quadrant = 'do-first';
    if (priority === 'p2') quadrant = 'schedule';
    if (priority === 'p3') quadrant = 'delegate';
    if (priority === 'p4') quadrant = 'eliminate';

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      isFrog,
      completed: false,
      priority,
      matrixQuadrant: quadrant,
      estimatedMins: Number(estimatedMins) || 25,
      actualMinsSpent: 0,
      category,
      date: new Date().toISOString().split('T')[0],
      subtasks,
      createdAt: Date.now(),
    };

    onAddTask(newTask);

    setTitle('');
    setDescription('');
    setIsFrog(false);
    setSubtasks([]);
    setNewSubtaskText('');
    setIsExpanded(false);
  };

  return (
    <div class="glass-card rounded-2xl p-4 md:p-5 border border-slate-200/80 mb-6">
      <form onSubmit={handleSubmit}>
        <div class="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsFrog(!isFrog)}
            class={`p-2.5 rounded-xl transition flex items-center justify-center ${
              isFrog 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200'
            }`}
            title={isFrog ? "Marked as Today's Frog" : "Click to mark as Frog 🐸"}
          >
            <span class="text-lg leading-none">🐸</span>
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task... (e.g. Write project report draft)"
            class="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm md:text-base px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition"
            onFocus={() => setIsExpanded(true)}
          />

          <button
            type="submit"
            disabled={!title.trim()}
            class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold rounded-xl text-sm flex items-center space-x-1.5 transition shadow-xs"
          >
            <Plus class="h-4 w-4 stroke-[2.5]" />
            <span class="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {isExpanded && (
          <div class="mt-4 pt-4 border-t border-slate-100 space-y-4">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes or context..."
              class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs md:text-sm px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
            />

            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <ListPlus class="h-3.5 w-3.5 text-slate-600" />
                  Micro-Steps Breakdown
                </span>
                <span class="text-[10px] text-slate-500">{subtasks.length} subtasks</span>
              </div>

              {subtasks.length > 0 && (
                <div class="space-y-1.5 mb-2 max-h-32 overflow-y-auto pr-1">
                  {subtasks.map((st) => (
                    <div key={st.id} class="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-200">
                      <span class="text-slate-800 font-medium">{st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        class="text-slate-400 hover:text-slate-700 font-bold ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="e.g. Step 1: Open document & write 1st paragraph..."
                  class="flex-1 bg-white text-xs text-slate-900 placeholder-slate-400 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800 rounded-lg transition"
                >
                  + Add Step
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label class="block text-slate-500 text-[11px] mb-1 font-semibold">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  class="w-full bg-slate-50 text-slate-900 py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                >
                  <option value="p1">P1 - Do First</option>
                  <option value="p2">P2 - Schedule</option>
                  <option value="p3">P3 - Delegate</option>
                  <option value="p4">P4 - Low</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-500 text-[11px] mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  class="w-full bg-slate-50 text-slate-900 py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label class="block text-slate-500 text-[11px] mb-1 font-semibold">Focus Time</label>
                <select
                  value={estimatedMins}
                  onChange={(e) => setEstimatedMins(e.target.value)}
                  class="w-full bg-slate-50 text-slate-900 py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                >
                  <option value={15}>15 Mins</option>
                  <option value={25}>25 Mins</option>
                  <option value={45}>45 Mins</option>
                  <option value={60}>60 Mins</option>
                </select>
              </div>

              <div class="flex items-end">
                <button
                  type="button"
                  onClick={() => setIsFrog(!isFrog)}
                  class={`w-full py-1.5 px-2.5 rounded-lg font-semibold border flex items-center justify-center space-x-1.5 transition ${
                    isFrog
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>🐸</span>
                  <span>{isFrog ? 'Today\'s Frog' : 'Mark Frog'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
