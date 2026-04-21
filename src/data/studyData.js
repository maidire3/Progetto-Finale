export const COLOR_OPTIONS = [
  { value: 'red', label: 'Rosso', swatch: '#d93025' },
  { value: 'orange', label: 'Arancione', swatch: '#f97316' },
  { value: 'amber', label: 'Ambra', swatch: '#fbbf24' },
  { value: 'green', label: 'Verde', swatch: '#34a853' },
  { value: 'emerald', label: 'Smeraldo', swatch: '#059669' },
  { value: 'blue', label: 'Blu', swatch: '#1a73e8' },
  { value: 'indigo', label: 'Indaco', swatch: '#4f46e5' },
  { value: 'purple', label: 'Viola', swatch: '#9333ea' }
];

export const WEEK_DAYS = [
  { value: 'mon', label: 'Lun' },
  { value: 'tue', label: 'Mar' },
  { value: 'wed', label: 'Mer' },
  { value: 'thu', label: 'Gio' },
  { value: 'fri', label: 'Ven' },
  { value: 'sat', label: 'Sab' },
  { value: 'sun', label: 'Dom' }
];

export const SUBJECT_COLOR_STYLES = {
  red: {
    accent: '#d93025',
    soft: 'rgba(253, 236, 234, 0.95)'
  },
  orange: {
    accent: '#f97316',
    soft: 'rgba(255, 237, 213, 0.95)'
  },
  amber: {
    accent: '#d97706',
    soft: 'rgba(254, 243, 199, 0.95)'
  },
  green: {
    accent: '#34a853',
    soft: 'rgba(230, 244, 234, 0.95)'
  },
  emerald: {
    accent: '#059669',
    soft: 'rgba(220, 252, 231, 0.95)'
  },
  blue: {
    accent: '#1a73e8',
    soft: 'rgba(232, 240, 254, 0.96)'
  },
  indigo: {
    accent: '#4f46e5',
    soft: 'rgba(238, 242, 255, 0.96)'
  },
  purple: {
    accent: '#9333ea',
    soft: 'rgba(245, 243, 255, 0.96)'
  },
  gray: {
    accent: '#6b7280',
    soft: 'rgba(243, 244, 246, 0.96)'
  }
};

export const INITIAL_SUBJECTS = [
  {
    id: 'analisi-2',
    name: 'Analisi 2',
    description: 'Ripasso formule e sessioni esercizi in aula studio.',
    color: 'green',
    taskCount: 2,
    scheduleEnabled: true,
    scheduleDays: ['mon', 'wed'],
    startTime: '09:00',
    endTime: '11:00'
  },
  {
    id: 'basi-di-dati',
    name: 'Basi di dati',
    description: 'Laboratorio SQL e progettazione relazionale.',
    color: 'blue',
    taskCount: 1,
    scheduleEnabled: true,
    scheduleDays: ['tue'],
    startTime: '14:00',
    endTime: '16:00'
  },
  {
    id: 'statistica',
    name: 'Statistica',
    description: 'Esercizi guidati e simulazioni in vista dell esame.',
    color: 'amber',
    taskCount: 1,
    scheduleEnabled: true,
    scheduleDays: ['thu'],
    startTime: '10:00',
    endTime: '12:00'
  }
];

export const TASK_STATUS_OPTIONS = ['Da fare', 'In corso', 'Completato'];
export const GENERAL_SUBJECT_OPTION = {
  id: 'general',
  name: 'Generale',
  color: 'gray'
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Ripasso limiti',
    status: 'In corso',
    subject: 'Analisi 2',
    dueDate: '2026-04-21',
    dayOffset: 0,
    startHour: 9,
    endHour: 10
  },
  {
    id: 'task-2',
    title: 'Quiz settimanale',
    status: 'Da fare',
    subject: 'Statistica',
    dueDate: '2026-04-23',
    dayOffset: 1,
    startHour: 15,
    endHour: 16
  },
  {
    id: 'task-3',
    title: 'Esercizi SQL',
    status: 'Completato',
    subject: 'Basi di dati',
    dueDate: '2026-04-22',
    dayOffset: 2,
    startHour: 10,
    endHour: 12
  },
  {
    id: 'task-4',
    title: 'Schemi formula chiave',
    status: 'Da fare',
    subject: 'Analisi 2',
    dueDate: '2026-04-24',
    dayOffset: 3,
    startHour: 11,
    endHour: 12
  }
];

export const INITIAL_EXAMS = [
  { id: 'exam-1', subject: 'Analisi 2', date: '2026-05-12', location: 'Aula A2' },
  { id: 'exam-2', subject: 'Statistica', date: '2026-05-20', location: 'Laboratorio 3' },
  { id: 'exam-3', subject: 'Basi di dati', date: '2026-06-03', location: 'Aula Magna' }
];

export const NOTE_FOLDER_OPTIONS = ['Analisi 2', 'Statistica', 'Database', 'Generale'];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Cartella Analisi 2',
    folder: 'Analisi 2',
    summary: 'Formule, appunti lezione e esercizi svolti.'
  },
  {
    id: 'note-2',
    title: 'Riassunti di Statistica',
    folder: 'Statistica',
    summary: 'Schemi rapidi per distribuzioni e test.'
  },
  {
    id: 'note-3',
    title: 'Laboratorio Database',
    folder: 'Database',
    summary: 'Query utili, esempi di join e normalizzazione.'
  }
];

export const TASK_SUBJECT_OPTIONS = [
  GENERAL_SUBJECT_OPTION.name,
  ...INITIAL_SUBJECTS.map((subject) => subject.name)
];
export const EXAM_SUBJECT_OPTIONS = INITIAL_SUBJECTS.map((subject) => subject.name);

export function getTaskSubjectOptions(subjects = []) {
  const normalizedSubjects = subjects.filter(
    (subject) => subject?.name && subject.name !== GENERAL_SUBJECT_OPTION.name
  );

  return [GENERAL_SUBJECT_OPTION, ...normalizedSubjects];
}

export function getExamSubjectOptions(subjects = []) {
  const normalizedSubjects = subjects.filter((subject) => subject?.name);

  if (normalizedSubjects.length === 0) {
    return [GENERAL_SUBJECT_OPTION];
  }

  return normalizedSubjects;
}

export function formatSubjectSchedule(subject) {
  if (!subject.scheduleEnabled || subject.scheduleDays.length === 0) {
    return 'Nessuna programmazione settimanale';
  }

  const labels = WEEK_DAYS.filter((day) =>
    subject.scheduleDays.includes(day.value)
  ).map((day) => day.label);

  return `${labels.join(', ')} - ${subject.startTime} - ${subject.endTime}`;
}

export function getSubjectStyle(subjectName, subjects = INITIAL_SUBJECTS) {
  if (subjectName === GENERAL_SUBJECT_OPTION.name) {
    return SUBJECT_COLOR_STYLES.gray;
  }

  const subject = subjects.find((item) => item.name === subjectName);
  const colorKey = subject?.color || 'green';

  return SUBJECT_COLOR_STYLES[colorKey] || SUBJECT_COLOR_STYLES.green;
}
