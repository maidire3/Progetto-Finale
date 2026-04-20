export const COLOR_OPTIONS = [
  { value: 'sage', label: 'Salvia' },
  { value: 'sky', label: 'Azzurro' },
  { value: 'sand', label: 'Sabbia' },
  { value: 'rose', label: 'Rosa' }
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
  sage: {
    accent: '#2f855a',
    soft: 'rgba(226, 243, 232, 0.92)'
  },
  sky: {
    accent: '#2b6cb0',
    soft: 'rgba(230, 240, 250, 0.94)'
  },
  sand: {
    accent: '#b7791f',
    soft: 'rgba(250, 241, 225, 0.94)'
  },
  rose: {
    accent: '#b83280',
    soft: 'rgba(251, 235, 241, 0.94)'
  }
};

export const INITIAL_SUBJECTS = [
  {
    id: 'analisi-2',
    name: 'Analisi 2',
    description: 'Ripasso formule e sessioni esercizi in aula studio.',
    color: 'sage',
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
    color: 'sky',
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
    color: 'sand',
    taskCount: 1,
    scheduleEnabled: true,
    scheduleDays: ['thu'],
    startTime: '10:00',
    endTime: '12:00'
  }
];

export const TASK_STATUS_OPTIONS = ['Da fare', 'In corso', 'Completato'];

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

export const TASK_SUBJECT_OPTIONS = INITIAL_SUBJECTS.map((subject) => subject.name);
export const EXAM_SUBJECT_OPTIONS = INITIAL_SUBJECTS.map((subject) => subject.name);

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
  const subject = subjects.find((item) => item.name === subjectName);
  const colorKey = subject?.color || 'sage';

  return SUBJECT_COLOR_STYLES[colorKey] || SUBJECT_COLOR_STYLES.sage;
}
