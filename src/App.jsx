import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QuickCapture from './components/QuickCapture';
import DailyPlanner from './components/DailyPlanner';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import FocusTimer from './components/FocusTimer';
import HabitsTracker from './components/HabitsTracker';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import DailyRitualModal from './components/DailyRitualModal';

import {
  getStoredTasks,
  saveTasks,
  getStoredHabits,
  saveHabits,
  getStoredSettings,
  saveSettings,
  getStreakData,
  updateStreakOnTaskComplete
} from './utils/storage';

import { decomposeTask } from './utils/decomposer';
import { loginWithGoogle, logoutFirebase, onAuthChange } from './firebase';
import { pushUserSyncData, startGoogleRealtimeSync, stopGoogleSync } from './utils/sync';

export default function App() {
  const [activeTab, setActiveTab] = useState('planner');
  const [tasks, setTasks] = useState(getStoredTasks);
  const [habits, setHabits] = useState(getStoredHabits);
  const [settings, setSettings] = useState(getStoredSettings);
  const [streakData, setStreakData] = useState(getStreakData);
  const [selectedTaskForFocus, setSelectedTaskForFocus] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  
  // Google Auth User State
  const [googleUser, setGoogleUser] = useState(null);

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredInstallPrompt(null);
        }
      });
    }
  };

  // Google Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setGoogleUser(user);
      if (user) {
        startGoogleRealtimeSync(user.uid, (remoteData) => {
          if (remoteData.tasks) {
            setTasks(remoteData.tasks);
            saveTasks(remoteData.tasks);
          }
          if (remoteData.habits) {
            setHabits(remoteData.habits);
            saveHabits(remoteData.habits);
          }
          if (remoteData.streakData) {
            setStreakData(remoteData.streakData);
          }
        });
      } else {
        stopGoogleSync();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error('Google Sign-In Notice:', e);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutFirebase();
      setGoogleUser(null);
    } catch (e) {
      console.error('Google Sign-Out Notice:', e);
    }
  };

  // Auto-push updates to Firebase when user is logged in
  useEffect(() => {
    saveTasks(tasks);
    if (googleUser) {
      pushUserSyncData({ tasks, habits, settings, streakData });
    }
  }, [tasks]);

  useEffect(() => {
    saveHabits(habits);
    if (googleUser) {
      pushUserSyncData({ tasks, habits, settings, streakData });
    }
  }, [habits]);

  useEffect(() => {
    saveSettings(settings);
    document.body.className = 'bg-[#FAF9F6] text-slate-900 min-h-screen antialiased';
  }, [settings]);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('planner');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Handlers
  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            const updatedStreak = updateStreakOnTaskComplete();
            setStreakData(updatedStreak);
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = (t.subtasks || []).map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleDecomposeTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const generatedSteps = decomposeTask(t.title, t.category);
          return { ...t, subtasks: generatedSteps };
        }
        return t;
      })
    );
  };

  const handleUpdateQuadrant = (taskId, newQuadrant) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, matrixQuadrant: newQuadrant } : t)
    );
  };

  const handleStartFocusTask = (task) => {
    setSelectedTaskForFocus(task);
    setActiveTab('timer');
  };

  const handleSetFrogTask = (frogTaskId) => {
    setTasks(prev =>
      prev.map(t => ({
        ...t,
        isFrog: t.id === frogTaskId
      }))
    );
  };

  const handleToggleHabit = (habitId) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const nextVal = !h.completedToday;
          return {
            ...h,
            completedToday: nextVal,
            streak: nextVal ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (newHabit) => {
    setHabits(prev => [...prev, newHabit]);
  };

  const handleReloadDataFromStorage = () => {
    setTasks(getStoredTasks());
    setHabits(getStoredHabits());
    setSettings(getStoredSettings());
    setStreakData(getStreakData());
  };

  return (
    <div class="min-h-screen pb-20 md:pb-12">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakData?.count || 1}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRitual={() => setIsRitualOpen(true)}
        isPwaInstallable={!!deferredInstallPrompt}
        onInstallPwa={handleInstallPwa}
        user={googleUser}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
      />

      <main class="max-w-4xl mx-auto px-4 py-6 md:px-6">
        {(activeTab === 'planner' || activeTab === 'matrix') && (
          <QuickCapture onAddTask={handleAddTask} />
        )}

        {activeTab === 'planner' && (
          <DailyPlanner
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            onDecomposeTask={handleDecomposeTask}
            onStartFocusTask={handleStartFocusTask}
          />
        )}

        {activeTab === 'matrix' && (
          <EisenhowerMatrix
            tasks={tasks}
            onUpdateQuadrant={handleUpdateQuadrant}
            onToggleTask={handleToggleTask}
            onStartFocusTask={handleStartFocusTask}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimer
            tasks={tasks}
            selectedTaskForFocus={selectedTaskForFocus}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            settings={settings}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsTracker
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            streakData={streakData}
            habits={habits}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onReloadData={handleReloadDataFromStorage}
        user={googleUser}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
      />

      <DailyRitualModal
        isOpen={isRitualOpen}
        onClose={() => setIsRitualOpen(false)}
        tasks={tasks}
        onSetFrogTask={handleSetFrogTask}
      />
    </div>
  );
}
