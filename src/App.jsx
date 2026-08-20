import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import QuickCapture from './components/QuickCapture';
import DailyPlanner from './components/DailyPlanner';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import FocusTimer from './components/FocusTimer';
import HabitsTracker from './components/HabitsTracker';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import DailyRitualModal from './components/DailyRitualModal';
import SaasAuthGate from './components/SaasAuthGate';

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
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutFirebase,
  onAuthChange,
  checkRedirectResult,
  pushUserDataToFirebase
} from './firebase';
import { pushUserSyncData, startGoogleRealtimeSync, stopGoogleSync, fetchUserCloudData } from './utils/sync';

export default function App() {
  const [activeTab, setActiveTab] = useState('planner');
  
  // Persistent Auth Session Recovery (Zero logout on reload!)
  const [googleUser, setGoogleUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('everyday_active_user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authErrorMsg, setAuthErrorMsg] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [tasks, setTasks] = useState(() => {
    try {
      const savedUser = localStorage.getItem('everyday_active_user_session');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const cached = localStorage.getItem(`everyday_user_cloud_cache_${u.uid}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.tasks && Array.isArray(parsed.tasks)) return parsed.tasks;
        }
      }
    } catch (e) {}
    return [];
  });

  const [habits, setHabits] = useState(() => {
    try {
      const savedUser = localStorage.getItem('everyday_active_user_session');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const cached = localStorage.getItem(`everyday_user_cloud_cache_${u.uid}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.habits && Array.isArray(parsed.habits)) return parsed.habits;
        }
      }
    } catch (e) {}
    return [];
  });

  const [settings, setSettings] = useState(getStoredSettings);
  const [streakData, setStreakData] = useState(getStreakData);
  const [selectedTaskForFocus, setSelectedTaskForFocus] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRitualOpen, setIsRitualOpen] = useState(false);

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

  // Sync user cloud data helper
  const loadUserData = async (user) => {
    if (!user) return;
    try {
      // 1. Fetch remote cloud data from Firestore / RTDB
      const cloudData = await fetchUserCloudData(user.uid);
      if (cloudData) {
        if (cloudData.tasks && Array.isArray(cloudData.tasks)) {
          setTasks(cloudData.tasks);
          saveTasks(cloudData.tasks);
        } else if (tasks.length === 0) {
          const defaultTasks = getStoredTasks();
          setTasks(defaultTasks);
          // Initial push
          pushUserDataToFirebase(user.uid, { tasks: defaultTasks, habits, settings, streakData });
        }

        if (cloudData.habits && Array.isArray(cloudData.habits)) {
          setHabits(cloudData.habits);
          saveHabits(cloudData.habits);
        } else if (habits.length === 0) {
          setHabits(getStoredHabits());
        }

        if (cloudData.streakData) {
          setStreakData(cloudData.streakData);
        }
      } else {
        // First-time user on this account: seed initial tasks and push to cloud
        const initialTasks = tasks.length > 0 ? tasks : getStoredTasks();
        const initialHabits = habits.length > 0 ? habits : getStoredHabits();
        setTasks(initialTasks);
        setHabits(initialHabits);
        await pushUserDataToFirebase(user.uid, { tasks: initialTasks, habits: initialHabits, settings, streakData });
      }

      setIsDataLoaded(true);

      // 2. Start Realtime Cloud Listener for instant cross-device updates
      startGoogleRealtimeSync(user.uid, (remoteData) => {
        if (remoteData?.tasks && Array.isArray(remoteData.tasks)) {
          setTasks(remoteData.tasks);
          saveTasks(remoteData.tasks);
        }
        if (remoteData?.habits && Array.isArray(remoteData.habits)) {
          setHabits(remoteData.habits);
          saveHabits(remoteData.habits);
        }
        if (remoteData?.streakData) {
          setStreakData(remoteData.streakData);
        }
      });
    } catch (e) {
      console.warn('User cloud loading notice:', e);
      setIsDataLoaded(true);
    }
  };

  // Firebase Auth State Listener & Redirect Result
  useEffect(() => {
    checkRedirectResult().catch(err => console.warn('Redirect result notice:', err));

    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL
        };
        setGoogleUser(serializableUser);
        localStorage.setItem('everyday_active_user_session', JSON.stringify(serializableUser));
        setAuthErrorMsg('');
        await loadUserData(user);
      } else {
        stopGoogleSync();
        setGoogleUser(null);
        localStorage.removeItem('everyday_active_user_session');
        setTasks([]);
        setHabits([]);
        setIsDataLoaded(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Registration
  const handleEmailSignUp = async (name, email, password) => {
    setAuthErrorMsg('');
    const user = await registerWithEmail(name, email, password);
    const serializableUser = {
      uid: user.uid,
      email: user.email,
      displayName: name.trim() || user.email.split('@')[0],
      photoURL: null
    };
    setGoogleUser(serializableUser);
    localStorage.setItem('everyday_active_user_session', JSON.stringify(serializableUser));
    await loadUserData(user);
  };

  // Email & Password Login
  const handleEmailSignIn = async (email, password) => {
    setAuthErrorMsg('');
    const user = await loginWithEmail(email, password);
    const serializableUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    };
    setGoogleUser(serializableUser);
    localStorage.setItem('everyday_active_user_session', JSON.stringify(serializableUser));
    await loadUserData(user);
  };

  // Google 1-Click Sign-In
  const handleGoogleSignIn = async () => {
    setAuthErrorMsg('');
    try {
      const user = await loginWithGoogle();
      if (user) {
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL
        };
        setGoogleUser(serializableUser);
        localStorage.setItem('everyday_active_user_session', JSON.stringify(serializableUser));
        await loadUserData(user);
      }
    } catch (e) {
      console.error('Google Sign-In Error:', e);
      if (e.code === 'auth/unauthorized-domain') {
        setAuthErrorMsg(`Netlify Domain Alert: "${window.location.hostname}" is not listed in Firebase Authorized Domains yet.`);
      } else if (e.code === 'auth/configuration-not-found' || e.code === 'auth/operation-not-allowed') {
        setAuthErrorMsg('Google Sign-In is not enabled in Firebase Console yet. You can also use Email & Password Sign Up!');
      } else {
        setAuthErrorMsg(`Sign-In note: ${e.message || 'Please check browser settings or connection.'}`);
      }
    }
  };

  // Sign Out
  const handleGoogleSignOut = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    setGoogleUser(null);
    localStorage.removeItem('everyday_active_user_session');
    setTasks([]);
    setHabits([]);
    setIsDataLoaded(false);
    setAuthErrorMsg('');
  };

  // Auto-push updates to Firebase when user modifies state (only after initial load!)
  useEffect(() => {
    if (googleUser?.uid && isDataLoaded) {
      saveTasks(tasks);
      pushUserDataToFirebase(googleUser.uid, { tasks, habits, settings, streakData });
    }
  }, [tasks, isDataLoaded]);

  useEffect(() => {
    if (googleUser?.uid && isDataLoaded) {
      saveHabits(habits);
      pushUserDataToFirebase(googleUser.uid, { tasks, habits, settings, streakData });
    }
  }, [habits, isDataLoaded]);

  useEffect(() => {
    saveSettings(settings);
    document.body.className = 'bg-[#FAF9F6] text-slate-900 min-h-screen antialiased';
  }, [settings]);

  // Global Keyboard Shortcuts (Ctrl+K)
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
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          const updatedStreak = updateStreakOnTaskComplete();
          setStreakData(updatedStreak);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(s =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    });
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleDecomposeTask = (taskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const generatedSteps = decomposeTask(t.title, t.category);
        return { ...t, subtasks: generatedSteps };
      }
      return t;
    });
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleUpdateQuadrant = (taskId, newQuadrant) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, matrixQuadrant: newQuadrant } : t);
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleStartFocusTask = (task) => {
    setSelectedTaskForFocus(task);
    setActiveTab('timer');
  };

  const handleSetFrogTask = (frogTaskId) => {
    const updatedTasks = tasks.map(t => ({
      ...t,
      isFrog: t.id === frogTaskId
    }));
    setTasks(updatedTasks);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks: updatedTasks, habits, settings, streakData });
    }
  };

  const handleToggleHabit = (habitId) => {
    const updatedHabits = habits.map(h => {
      if (h.id === habitId) {
        const nextVal = !h.completedToday;
        return {
          ...h,
          completedToday: nextVal,
          streak: nextVal ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    });
    setHabits(updatedHabits);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks, habits: updatedHabits, settings, streakData });
    }
  };

  const handleAddHabit = (newHabit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    if (googleUser?.uid) {
      pushUserDataToFirebase(googleUser.uid, { tasks, habits: updatedHabits, settings, streakData });
    }
  };

  const handleReloadDataFromStorage = () => {
    setTasks(getStoredTasks());
    setHabits(getStoredHabits());
    setSettings(getStoredSettings());
    setStreakData(getStreakData());
  };

  // Loading State (only if no cached session)
  if (isAuthLoading && !googleUser) {
    return (
      <div class="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4">
        <div class="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p class="text-xs font-bold text-slate-700">Loading Everyday Focus Workspace...</p>
      </div>
    );
  }

  // SaaS Auth Gate: If logged out, render full Auth Gate
  if (!googleUser) {
    return (
      <SaasAuthGate
        onGoogleSignIn={handleGoogleSignIn}
        onEmailSignIn={handleEmailSignIn}
        onEmailSignUp={handleEmailSignUp}
        errorMsg={authErrorMsg}
      />
    );
  }

  // SaaS Authenticated Dashboard Workspace
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
            user={googleUser}
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
