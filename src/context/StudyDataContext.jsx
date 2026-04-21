import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_EXAMS,
  INITIAL_SUBJECTS,
  INITIAL_TASKS
} from '../data/studyData';

const StudyDataContext = createContext(null);
const SETTINGS_STORAGE_KEY = 'study-tracker-settings';

const INITIAL_SETTINGS = {
  firstName: 'Davide',
  lastName: 'Rossi',
  university: 'Universita di Bologna',
  degreeCourse: 'Informatica',
  language: 'Italiano',
  theme: 'Chiaro',
  weekStart: 'Lunedi',
  plannerStartHour: '06:00',
  plannerEndHour: '22:00'
};

function getStoredSettings() {
  if (typeof window === 'undefined') {
    return INITIAL_SETTINGS;
  }

  try {
    const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!rawSettings) {
      return INITIAL_SETTINGS;
    }

    const parsedSettings = JSON.parse(rawSettings);

    return {
      ...INITIAL_SETTINGS,
      ...parsedSettings
    };
  } catch (error) {
    return INITIAL_SETTINGS;
  }
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
  const [settings, setSettings] = useState(getStoredSettings);

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

  function updateSettings(nextSettings) {
    setSettings(nextSettings);
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

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
      settings,
      addTask,
      updateTask,
      deleteTask,
      updateSettings
    }),
    [exams, settings, subjects, tasks]
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
