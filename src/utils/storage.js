// LocalStorage & Data State Manager for Everyday Focus

const STORAGE_KEYS = {
  TASKS: 'everyday_focus_tasks',
  HABITS: 'everyday_focus_habits',
  SETTINGS: 'everyday_focus_settings',
  STREAK: 'everyday_focus_streak',
};

const DEFAULT_SETTINGS = {
  theme: 'minimal-light', // 'minimal-light' (Pure Minimalist Off-White) | 'dark-slate'
  soundEnabled: true,
  pomodoroWorkMins: 25,
  pomodoroBreakMins: 5,
  dailyGoalCount: 5,
};

const SEED_TASKS = [
  {
    id: 'seed-frog-1',
    title: '🚀 Complete Priority Work Block (Eat the Frog!)',
    description: 'Focus on your most critical non-negotiable task first thing today.',
    isFrog: true,
    completed: false,
    priority: 'p1', // p1 (Urgent+Important), p2 (Important), p3 (Urgent), p4 (Low)
    matrixQuadrant: 'do-first',
    estimatedMins: 45,
    actualMinsSpent: 0,
    category: 'Work',
    date: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1', title: 'Outline key steps & remove distractions', completed: false },
      { id: 'sub-2', title: 'Set 25-minute Pomodoro focus timer', completed: false },
      { id: 'sub-3', title: 'Finish initial draft without pausing', completed: false },
    ],
    createdAt: Date.now(),
  },
  {
    id: 'seed-task-2',
    title: '💧 Hydrate & Take 10-Min Walk Break',
    description: 'Reset mental energy and keep focus fresh.',
    isFrog: false,
    completed: false,
    priority: 'p2',
    matrixQuadrant: 'schedule',
    estimatedMins: 15,
    actualMinsSpent: 0,
    category: 'Health',
    date: new Date().toISOString().split('T')[0],
    subtasks: [],
    createdAt: Date.now() - 10000,
  },
  {
    id: 'seed-task-3',
    title: '📥 Clean Inbox & Daily Plan Review',
    description: 'Quickly organize incoming requests and update daily goals.',
    isFrog: false,
    completed: false,
    priority: 'p3',
    matrixQuadrant: 'delegate',
    estimatedMins: 20,
    actualMinsSpent: 0,
    category: 'Planning',
    date: new Date().toISOString().split('T')[0],
    subtasks: [],
    createdAt: Date.now() - 20000,
  }
];

const SEED_HABITS = [
  { id: 'habit-1', title: '🌅 Morning Planning Routine', streak: 4, completedToday: true, icon: 'sun' },
  { id: 'habit-2', title: '🍅 Complete 3 Pomodoros', streak: 2, completedToday: false, icon: 'timer' },
  { id: 'habit-3', title: '📵 No Phone 30m Before Bed', streak: 7, completedToday: false, icon: 'moon' },
];

export function getStoredTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
      return SEED_TASKS;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load tasks:', e);
    return SEED_TASKS;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

export function getStoredHabits() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(SEED_HABITS));
      return SEED_HABITS;
    }
    return JSON.parse(stored);
  } catch (e) {
    return SEED_HABITS;
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits:', e);
  }
}

export function getStoredSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getStreakData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
    const today = new Date().toISOString().split('T')[0];
    if (!stored) {
      const initial = { count: 3, lastActiveDate: today };
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(stored);
    
    // Check if yesterday or today
    const lastDate = new Date(data.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      // Streak reset
      data.count = 1;
      data.lastActiveDate = today;
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data));
    }
    return data;
  } catch (e) {
    return { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
  }
}

export function updateStreakOnTaskComplete() {
  const streak = getStreakData();
  const today = new Date().toISOString().split('T')[0];
  if (streak.lastActiveDate !== today) {
    streak.count += 1;
    streak.lastActiveDate = today;
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  }
  return streak;
}

export function exportBackupJSON() {
  const backup = {
    tasks: getStoredTasks(),
    habits: getStoredHabits(),
    settings: getStoredSettings(),
    streak: getStreakData(),
    exportDate: new Date().toISOString(),
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `everyday_focus_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importBackupJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveTasks(data.tasks);
    if (data.habits) saveHabits(data.habits);
    if (data.settings) saveSettings(data.settings);
    if (data.streak) localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data.streak));
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}
