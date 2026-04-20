import React, { useMemo, useState } from 'react';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import { useStudyData } from '../../context/StudyDataContext';
import { getSubjectStyle, INITIAL_SUBJECTS, INITIAL_TASKS } from '../../data/studyData';
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
  const firstDayIndex = weekStart === 'Domenica' ? 0 : 1;
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
  subjects = INITIAL_SUBJECTS
}) {
  const { addTask, settings, updateTask } = useStudyData();
  const [weekOffset, setWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    subject: subjects[0]?.name || '',
    dueDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
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
  const subjectOptions = subjects.length > 0 ? subjects : INITIAL_SUBJECTS;

  function openCreateModal(dateValue, hour) {
    setEditingTaskId(null);
    setFormValues({
      title: '',
      subject: subjectOptions[0]?.name || '',
      dueDate: dateValue,
      startTime: formatTimeValue(hour),
      endTime: getDefaultEndTime(hour),
      notes: ''
    });
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTaskId(task.id);
    setFormValues({
      title: task.title,
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
  }

  function closeModal() {
    setEditingTaskId(null);
    setIsModalOpen(false);
    setFormValues({
      title: '',
      subject: subjectOptions[0]?.name || '',
      dueDate: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
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

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = formValues.title.trim();

    if (!trimmedTitle) {
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
      subject: formValues.subject,
      notes: formValues.notes,
      dueDate: formValues.dueDate,
      startHour,
      endHour: normalizedEndHour
    };

    if (editingTaskId) {
      updateTask(editingTaskId, payload);
    } else {
      addTask({
        ...payload,
        status: 'Da fare',
        dayOffset: 0
      });
    }

    closeModal();
  }

  return (
    <>
      <section className="weekly-calendar">
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

      {isModalOpen ? (
        <div
          className="entity-modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="entity-modal weekly-calendar__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Nuova task"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="entity-modal__header">
              <div>
                <p className="section-card__label">
                  {editingTaskId ? 'Modifica task' : 'Nuova task'}
                </p>
                <h3>{editingTaskId ? 'Aggiorna task del planner' : 'Aggiungi task al planner'}</h3>
              </div>

              <button className="entity-modal__close" type="button" onClick={closeModal}>
                Chiudi
              </button>
            </div>

            <form className="entity-form" onSubmit={handleSubmit}>
              <div className="entity-form__group">
                <label htmlFor="calendar-task-title">Titolo task</label>
                <input
                  id="calendar-task-title"
                  name="title"
                  type="text"
                  value={formValues.title}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className="entity-form__group">
                <label htmlFor="calendar-task-subject">Materia</label>
                <select
                  id="calendar-task-subject"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleFieldChange}
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject.id || subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="entity-form__row">
                <div className="entity-form__group">
                  <label htmlFor="calendar-task-date">Data</label>
                  <input
                    id="calendar-task-date"
                    name="dueDate"
                    type="date"
                    value={formValues.dueDate}
                    onChange={handleFieldChange}
                  />
                </div>

                <div className="entity-form__group">
                  <label htmlFor="calendar-task-start-time">Ora inizio</label>
                  <input
                    id="calendar-task-start-time"
                    name="startTime"
                    type="time"
                    value={formValues.startTime}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="entity-form__row">
                <div className="entity-form__group">
                  <label htmlFor="calendar-task-end-time">Ora fine</label>
                  <input
                    id="calendar-task-end-time"
                    name="endTime"
                    type="time"
                    value={formValues.endTime}
                    onChange={handleFieldChange}
                  />
                </div>

                <div className="entity-form__group">
                  <label htmlFor="calendar-task-notes">Note</label>
                  <textarea
                    id="calendar-task-notes"
                    name="notes"
                    placeholder="Appunti rapidi facoltativi"
                    value={formValues.notes}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="entity-form__actions">
                <button
                  className="entity-form__button entity-form__button--secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Annulla
                </button>
                <button className="entity-form__button" type="submit">
                  {editingTaskId ? 'Salva modifiche' : 'Aggiungi task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default WeeklyCalendar;
