import React, { useMemo, useState } from 'react';
import DayColumn from './DayColumn';
import {
  CALENDAR_SLOT_HEIGHT,
  CALENDAR_TASK_INSET_BOTTOM,
  CALENDAR_TASK_INSET_SIDE,
  CALENDAR_TASK_INSET_TOP
} from './calendarLayout';
import TaskModal from './TaskModal';
import TimeColumn from './TimeColumn';
import { useStudyData } from '../../context/StudyDataContext';
import {
  getSubjectStyle,
  getTaskSubjectOptions,
  INITIAL_TASKS
} from '../../data/studyData';
const DAY_FORMATTER = new Intl.DateTimeFormat('it-IT', { weekday: 'short' });
const RANGE_FORMATTER = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short'
});

function parseDateString(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function parseHourValue(value, fallbackHour) {
  const hour = Number(value?.split(':')[0]);

  if (!Number.isFinite(hour)) {
    return fallbackHour;
  }

  return hour;
}

function parseTimeValue(value, fallbackHour, shouldRoundUp = false) {
  if (!value) {
    return fallbackHour;
  }

  const [hourPart, minutePart] = value.split(':').map(Number);

  if (!Number.isFinite(hourPart) || !Number.isFinite(minutePart)) {
    return fallbackHour;
  }

  if (shouldRoundUp && minutePart > 0) {
    return Math.min(hourPart + 1, 24);
  }

  return hourPart;
}

function createHours(startHour, endHour) {
  const hours = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    hours.push(hour);
  }

  return hours;
}

function getWeekStartDate(referenceDate, weekStart) {
  const startDate = new Date(referenceDate);
  const currentDay = startDate.getDay();
  const firstDayIndex = weekStart === 'Domenica' || weekStart === 'sunday' ? 0 : 1;
  const offset = (currentDay - firstDayIndex + 7) % 7;

  startDate.setDate(startDate.getDate() - offset);
  return startDate;
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatTimeValue(hour, minute = 0) {
  const normalizedHour = Math.max(0, Math.min(hour, 23));
  return `${String(normalizedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getDefaultEndTime(startHour) {
  if (startHour >= 23) {
    return '23:59';
  }

  return formatTimeValue(startHour + 1);
}

function createWeekDays(weekOffset, tasks, subjects, weekStart, plannerStartHour, plannerEndHour) {
  const today = new Date();
  const startDate = getWeekStartDate(today, weekStart);
  startDate.setDate(startDate.getDate() + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);

    const dayTasks = tasks
      .filter((task) => {
        const taskDate = parseDateString(task.dueDate);
        const hasCalendarTime =
          Number.isFinite(task.startHour) && Number.isFinite(task.endHour);
        const isWithinPlannerRange =
          hasCalendarTime &&
          task.startHour >= plannerStartHour &&
          task.endHour <= plannerEndHour + 1;

        return taskDate && isWithinPlannerRange && task.status !== 'Completato'
          ? isSameDay(taskDate, currentDate)
          : false;
      })
      .sort((firstTask, secondTask) => firstTask.startHour - secondTask.startHour)
      .map((task) => ({
        ...task,
        colorStyle: getSubjectStyle(task.subject, subjects)
      }));

    return {
      key: currentDate.toISOString(),
      dateValue: formatDateValue(currentDate),
      label: DAY_FORMATTER.format(currentDate).replace('.', ''),
      dayNumber: currentDate.getDate(),
      isToday: isSameDay(currentDate, today),
      tasks: dayTasks
    };
  });
}

function getWeekLabel(days) {
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  return `${RANGE_FORMATTER.format(new Date(firstDay.key))} - ${RANGE_FORMATTER.format(
    new Date(lastDay.key)
  )}`;
}

function WeeklyCalendar({
  tasks = INITIAL_TASKS,
  subjects = []
}) {
  const { addTask, settings, updateTask } = useStudyData();
  const [weekOffset, setWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    status: 'Da fare',
    subject: subjects[0]?.name || '',
    dueDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const plannerStartHour = useMemo(
    () => parseHourValue(settings.plannerStartHour, 6),
    [settings.plannerStartHour]
  );
  const plannerEndHour = useMemo(
    () => {
      const parsedEndHour = parseHourValue(settings.plannerEndHour, 22);
      return parsedEndHour > plannerStartHour ? parsedEndHour : plannerStartHour + 1;
    },
    [plannerStartHour, settings.plannerEndHour]
  );
  const hours = useMemo(
    () => createHours(plannerStartHour, plannerEndHour),
    [plannerEndHour, plannerStartHour]
  );
  const days = createWeekDays(
    weekOffset,
    tasks,
    subjects,
    settings.weekStart,
    plannerStartHour,
    plannerEndHour
  );
  const weekLabel = getWeekLabel(days);
  const subjectOptions = getTaskSubjectOptions(subjects);

  function openCreateModal(dateValue, hour) {
    setEditingTaskId(null);
    setFormValues({
      title: '',
      status: 'Da fare',
      subject: subjectOptions[0]?.name || '',
      dueDate: dateValue,
      startTime: formatTimeValue(hour),
      endTime: getDefaultEndTime(hour),
      notes: ''
    });
    setIsModalOpen(true);
    setFeedbackMessage('');
  }

  function openEditModal(task) {
    setEditingTaskId(task.id);
    setFormValues({
      title: task.title,
      status: task.status || 'Da fare',
      subject: task.subject,
      dueDate: task.dueDate || '',
      startTime: Number.isFinite(task.startHour) ? formatTimeValue(task.startHour) : '',
      endTime: Number.isFinite(task.endHour)
        ? task.endHour >= 24
          ? '23:59'
          : formatTimeValue(task.endHour)
        : '',
      notes: task.notes || ''
    });
    setIsModalOpen(true);
    setFeedbackMessage('');
  }

  function closeModal() {
    setEditingTaskId(null);
    setIsModalOpen(false);
    setFormValues({
      title: '',
      status: 'Da fare',
      subject: subjectOptions[0]?.name || '',
      dueDate: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setFeedbackMessage('');
  }

  function handlePreviousWeek() {
    setWeekOffset((currentValue) => currentValue - 1);
  }

  function handleNextWeek() {
    setWeekOffset((currentValue) => currentValue + 1);
  }

  function handleGoToToday() {
    setWeekOffset(0);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = formValues.title.trim();

    if (!trimmedTitle) {
      setFeedbackMessage('Il titolo task e obbligatorio.');
      return;
    }

    const hasCalendarPlacement = Boolean(
      formValues.dueDate && formValues.startTime && formValues.endTime
    );
    const startHour = hasCalendarPlacement
      ? parseTimeValue(formValues.startTime, plannerStartHour)
      : null;
    const endHour = hasCalendarPlacement
      ? parseTimeValue(formValues.endTime, startHour + 1, true)
      : null;
    const normalizedEndHour = hasCalendarPlacement
      ? endHour > startHour
        ? endHour
        : startHour + 1
      : null;
    const payload = {
      title: trimmedTitle,
      status: formValues.status,
      subject: formValues.subject,
      notes: formValues.notes,
      dueDate: formValues.dueDate,
      startHour,
      endHour: normalizedEndHour
    };

    setIsSubmitting(true);

    const result = editingTaskId
      ? await updateTask(editingTaskId, payload)
      : await addTask(payload);

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMessage(result.message);
      return;
    }

    closeModal();
  }

  return (
    <>
      <section
        className="weekly-calendar"
        style={{
          '--calendar-slot-height': `${CALENDAR_SLOT_HEIGHT}px`,
          '--calendar-task-inset-top': `${CALENDAR_TASK_INSET_TOP}px`,
          '--calendar-task-inset-side': `${CALENDAR_TASK_INSET_SIDE}px`,
          '--calendar-task-inset-bottom': `${CALENDAR_TASK_INSET_BOTTOM}px`
        }}
      >
        <div className="weekly-calendar__toolbar">
          <div className="weekly-calendar__toolbar-nav">
            <button type="button" onClick={handlePreviousWeek}>
              {'<'}
            </button>
            <p>{weekLabel}</p>
            <button type="button" onClick={handleNextWeek}>
              {'>'}
            </button>
          </div>

          <button
            className="weekly-calendar__today-button"
            type="button"
            onClick={handleGoToToday}
          >
            Today
          </button>
        </div>

        <div className="weekly-calendar__grid">
          <TimeColumn hours={hours} />

          {days.map((day) => (
            <DayColumn
              calendarStartHour={plannerStartHour}
              day={day}
              hours={hours}
              key={day.key}
              onSlotClick={openCreateModal}
              onTaskClick={openEditModal}
            />
          ))}
        </div>
      </section>

      <TaskModal
        editingTask={editingTaskId}
        feedbackMessage={feedbackMessage}
        formValues={formValues}
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        subjectOptions={subjectOptions}
      />
    </>
  );
}

export default WeeklyCalendar;
