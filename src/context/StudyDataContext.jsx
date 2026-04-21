import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
import { INITIAL_NOTES } from '../data/studyData';

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

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title,
    subject: task.subject,
    status: task.status || 'Da fare',
    notes: task.notes || '',
    dueDate: task.dueDate || '',
    startHour: Number.isFinite(task.startHour) ? task.startHour : null,
    endHour: Number.isFinite(task.endHour) ? task.endHour : null
  };
}

function normalizeExam(exam) {
  return {
    id: exam.id,
    subject: exam.subject,
    date: exam.date,
    location: exam.location || 'Da definire'
  };
}

function normalizeNote(note) {
  return {
    id: note.id,
    title: note.title,
    folder: note.folder || 'Generale',
    summary: note.summary || ''
  };
}

export function StudyDataProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState(() => INITIAL_NOTES.map(normalizeNote));
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [settings, setSettings] = useState(() => buildSettingsFromUser(getStoredUser()));
  const [isUserLoading, setIsUserLoading] = useState(Boolean(getStoredToken()));
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(Boolean(getStoredToken()));
  const [isTasksLoading, setIsTasksLoading] = useState(Boolean(getStoredToken()));
  const [isExamsLoading, setIsExamsLoading] = useState(Boolean(getStoredToken()));

  async function refreshSubjects() {
    const token = getStoredToken();

    if (!token) {
      setSubjects([]);
      setIsSubjectsLoading(false);
      return;
    }

    try {
      setIsSubjectsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/subjects`, {
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Impossibile recuperare le materie.');
      }

      setSubjects(data.subjects || []);
    } catch (error) {
      setSubjects([]);
    } finally {
      setIsSubjectsLoading(false);
    }
  }

  async function refreshTasks() {
    const token = getStoredToken();

    if (!token) {
      setTasks([]);
      setIsTasksLoading(false);
      return;
    }

    try {
      setIsTasksLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Impossibile recuperare le task.');
      }

      setTasks((data.tasks || []).map(normalizeTask));
    } catch (error) {
      setTasks([]);
    } finally {
      setIsTasksLoading(false);
    }
  }

  async function refreshExams() {
    const token = getStoredToken();

    if (!token) {
      setExams([]);
      setIsExamsLoading(false);
      return;
    }

    try {
      setIsExamsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/exams`, {
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Impossibile recuperare gli esami.');
      }

      setExams((data.exams || []).map(normalizeExam));
    } catch (error) {
      setExams([]);
    } finally {
      setIsExamsLoading(false);
    }
  }

  async function addSubject(subjectData) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(subjectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Creazione materia non riuscita.');
      }

      setSubjects((currentSubjects) => [...currentSubjects, data.subject]);

      return {
        success: true,
        message: data.message || 'Materia creata con successo.',
        subject: data.subject
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante la creazione.'
      };
    }
  }

  async function updateSubject(subjectId, subjectData) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(subjectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Aggiornamento materia non riuscito.');
      }

      setSubjects((currentSubjects) =>
        currentSubjects.map((subject) =>
          subject.id === subjectId ? data.subject : subject
        )
      );

      return {
        success: true,
        message: data.message || 'Materia aggiornata con successo.',
        subject: data.subject
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante il salvataggio.'
      };
    }
  }

  async function deleteSubject(subjectId) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eliminazione materia non riuscita.');
      }

      setSubjects((currentSubjects) =>
        currentSubjects.filter((subject) => subject.id !== subjectId)
      );

      return {
        success: true,
        message: data.message || 'Materia eliminata con successo.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante l eliminazione.'
      };
    }
  }

  async function addTask(taskData) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Creazione task non riuscita.');
      }

      setTasks((currentTasks) => [...currentTasks, normalizeTask(data.task)]);

      return {
        success: true,
        message: data.message || 'Task creata con successo.',
        task: normalizeTask(data.task)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante la creazione.'
      };
    }
  }

  async function updateTask(taskId, updates) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    const existingTask = tasks.find((task) => task.id === taskId);

    if (!existingTask) {
      return {
        success: false,
        message: 'Task non trovata.'
      };
    }

    const payload = {
      ...existingTask,
      ...updates
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Aggiornamento task non riuscito.');
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? normalizeTask(data.task) : task
        )
      );

      return {
        success: true,
        message: data.message || 'Task aggiornata con successo.',
        task: normalizeTask(data.task)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante il salvataggio.'
      };
    }
  }

  async function deleteTask(taskId) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eliminazione task non riuscita.');
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

      return {
        success: true,
        message: data.message || 'Task eliminata con successo.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante l eliminazione.'
      };
    }
  }

  async function addExam(examData) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(examData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Creazione esame non riuscita.');
      }

      setExams((currentExams) => [...currentExams, normalizeExam(data.exam)]);

      return {
        success: true,
        message: data.message || 'Esame creato con successo.',
        exam: normalizeExam(data.exam)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante la creazione.'
      };
    }
  }

  async function updateExam(examId, examData) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(examData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Aggiornamento esame non riuscito.');
      }

      setExams((currentExams) =>
        currentExams.map((exam) =>
          exam.id === examId ? normalizeExam(data.exam) : exam
        )
      );

      return {
        success: true,
        message: data.message || 'Esame aggiornato con successo.',
        exam: normalizeExam(data.exam)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante il salvataggio.'
      };
    }
  }

  async function deleteExam(examId) {
    const token = getStoredToken();

    if (!token) {
      return {
        success: false,
        message: 'Nessun utente autenticato.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eliminazione esame non riuscita.');
      }

      setExams((currentExams) => currentExams.filter((exam) => exam.id !== examId));

      return {
        success: true,
        message: data.message || 'Esame eliminato con successo.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Si e verificato un errore durante l eliminazione.'
      };
    }
  }

  function addNote(noteData) {
    const normalizedNote = normalizeNote({
      id: noteData.id || `note-${Date.now()}`,
      ...noteData
    });

    setNotes((currentNotes) => [...currentNotes, normalizedNote]);

    return {
      success: true,
      message: 'Nota creata con successo.',
      note: normalizedNote
    };
  }

  function updateNote(noteId, updates) {
    const existingNote = notes.find((note) => note.id === noteId);

    if (!existingNote) {
      return {
        success: false,
        message: 'Nota non trovata.'
      };
    }

    const normalizedNote = normalizeNote({
      ...existingNote,
      ...updates
    });

    setNotes((currentNotes) =>
      currentNotes.map((note) => (note.id === noteId ? normalizedNote : note))
    );

    return {
      success: true,
      message: 'Nota aggiornata con successo.',
      note: normalizedNote
    };
  }

  function deleteNote(noteId) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));

    return {
      success: true,
      message: 'Nota eliminata con successo.'
    };
  }

  async function refreshCurrentUser() {
    const token = getStoredToken();

    if (!token) {
      setCurrentUser(null);
      setSubjects([]);
      setTasks([]);
      setExams([]);
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
      await Promise.all([refreshSubjects(), refreshTasks(), refreshExams()]);
    } catch (error) {
      clearAuthSession();
      setCurrentUser(null);
      setSubjects([]);
      setTasks([]);
      setExams([]);
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
      notes,
      currentUser,
      isUserLoading,
      isSubjectsLoading,
      isTasksLoading,
      isExamsLoading,
      settings,
      addSubject,
      updateSubject,
      deleteSubject,
      addTask,
      updateTask,
      deleteTask,
      addExam,
      updateExam,
      deleteExam,
      addNote,
      updateNote,
      deleteNote,
      refreshCurrentUser,
      refreshSubjects,
      refreshTasks,
      refreshExams,
      updateSettings
    }),
    [
      currentUser,
      exams,
      isExamsLoading,
      isSubjectsLoading,
      isTasksLoading,
      isUserLoading,
      settings,
      subjects,
      tasks,
      notes
    ]
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
