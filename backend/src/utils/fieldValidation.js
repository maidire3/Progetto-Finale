const ALLOWED_TASK_STATUSES = ['Da fare', 'In corso', 'Completato'];
const ALLOWED_LANGUAGES = ['it'];
const ALLOWED_WEEK_STARTS = ['monday', 'sunday'];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidTimeValue(value) {
  return typeof value === 'string' && TIME_PATTERN.test(value.trim());
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function isValidTaskStatus(value) {
  return ALLOWED_TASK_STATUSES.includes(value);
}

function isValidLanguage(value) {
  return ALLOWED_LANGUAGES.includes(value);
}

function isValidWeekStart(value) {
  return ALLOWED_WEEK_STARTS.includes(value);
}

function normalizeHourValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return NaN;
  }

  return numericValue;
}

export {
  ALLOWED_LANGUAGES,
  ALLOWED_TASK_STATUSES,
  ALLOWED_WEEK_STARTS,
  TIME_PATTERN,
  isValidLanguage,
  isValidTaskStatus,
  isValidTimeValue,
  isValidWeekStart,
  normalizeHourValue,
  timeToMinutes
};
