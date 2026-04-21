import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_EXAMS,
  INITIAL_SUBJECTS,
  INITIAL_TASKS
} from '../data/studyData';
import {
  API_BASE_URL,
  clearAuthSession,
  getAuthHeaders,
  getStoredThemePreference,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
  saveThemePreference
} from '../utils/auth';

const StudyDataContext = createContext(null);

const DEFAULT_SETTINGS = {
  firstName: '',
  lastName: '',
  school: '',
  courseOfStudy: '',
  language: 'it',
  theme: 'Scuro',
  weekStart: 'monday',
  plannerStartHour: '06:00',
  plannerEndHour: '22:00'
};

function buildSettingsFromUser(user, theme = getStoredThemePreference()) {
  return {
    ...DEFAULT_SETTINGS,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    school: user?.school || '',
    courseOfStudy: user?.courseOfStudy || '',
    language: user?.language || 'it',
    weekStart: user?.weekStart || 'monday',
    plannerStartHour: user?.plannerStartHour || '06:00',
    plannerEndHour: user?.plannerEndHour || '22:00',
    theme
  };
}

function resolveThemeValue(theme) {
  if (theme === 'Scuro') {
    return 'dark';
  }

  if (theme === 'Sistema' && typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

function normalizeTask(task, fallbackId) {
  const normalizedDate = task.dueDate?.trim() || '';
  const normalizedStartHour = Number.isFinite(task.startHour) ? task.startHour : null;
  const normalizedEndHour = Number.isFinite(task.endHour) ? task.endHour : null;

  return {
    id: task.id || fallbackId,
    title: task.title.trim(),
    status: task.status || 'Da fare',
    subject: task.subject,
    notes: task.notes?.trim() || '',
    dueDate: normalizedDate,
    dayOffset: Number.isFinite(task.dayOffset) ? task.dayOffset : 0,
    startHour: normalizedDate ? normalizedStartHour : null,
    endHour: normalizedDate ? normalizedEndHour : null
  };
}

export function StudyDataProvider({ children }) {
  const [subjects] = useState(INITIAL_SUBJECTS);
  const [exams] = useState(INITIAL_EXAMS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [settings, setSettings] = useState(() => buildSettingsFromUser(getStoredUser()));
  const [isUserLoading, setIsUserLoading] = useState(Boolean(getStoredToken()));

  function addTask(task) {
    const nextTask = normalizeTask(task, `task-${Date.now()}`);
    setTasks((currentTasks) => [...currentTasks, nextTask]);
  }

  function updateTask(taskId, updates) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? normalizeTask({ ...task, ...updates, id: taskId }, taskId)
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  async function refreshCurrentUser() {
    const token = getStoredToken();

    if (!token) {
      setCurrentUser(null);
      setSettings((currentSettings) => ({
        ...DEFAULT_SETTINGS,
        theme: currentSettings.theme
      }));
      setIsUserLoading(false);
      return;
    }

    try {
      setIsUserLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Impossibile recuperare il profilo utente.');
      }

      saveAuthSession({
        token,
        user: data.user
      });
      setCurrentUser(data.user);
      setSettings(buildSettingsFromUser(data.user));
    } catch (error) {
      clearAuthSession();
      setCurrentUser(null);
      setSettings((currentSettings) => ({
        ...DEFAULT_SETTINGS,
        theme: currentSettings.theme
      }));
    } finally {
      setIsUserLoading(false);
    }
  }

  async function updateSettings(nextSettings) {
    const nextTheme = nextSettings.theme || 'Scuro';

    saveThemePreference(nextTheme);
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...nextSettings,
      theme: nextTheme
    }));

    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    const payload = {
      firstName: nextSettings.firstName.trim(),
      lastName: nextSettings.lastName.trim(),
      school: nextSettings.school.trim(),
      courseOfStudy: nextSettings.courseOfStudy.trim(),
      language: nextSettings.language,
      weekStart: nextSettings.weekStart,
      plannerStartHour: nextSettings.plannerStartHour,
      plannerEndHour: nextSettings.plannerEndHour
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Salvataggio impostazioni non riuscito.');
      }

      saveAuthSession({
        token,
        user: data.user
      });
      setCurrentUser(data.user);
      setSettings(buildSettingsFromUser(data.user, nextTheme));

      return {
        success: true,
        message: data.message || 'Impostazioni salvate con successo.'
      };
    } catch (error) {
      setSettings(buildSettingsFromUser(currentUser, nextTheme));

      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante il salvataggio.'
      };
    }
  }

  useEffect(() => {
    refreshCurrentUser();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const applyTheme = () => {
      const nextTheme = resolveThemeValue(settings.theme);
      document.body.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
    };

    applyTheme();

    if (settings.theme !== 'Sistema' || typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [settings.theme]);

  const value = useMemo(
    () => ({
      subjects,
      exams,
      tasks,
      currentUser,
      isUserLoading,
      settings,
      addTask,
      updateTask,
      deleteTask,
      refreshCurrentUser,
      updateSettings
    }),
    [currentUser, exams, isUserLoading, settings, subjects, tasks]
  );

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export function useStudyData() {
  const context = useContext(StudyDataContext);

  if (!context) {
    throw new Error('useStudyData must be used inside StudyDataProvider');
  }

  return context;
}
