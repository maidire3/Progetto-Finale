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
          task.endHour <= plannerEndHour;

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
  const { settings } = useStudyData();
  const [weekOffset, setWeekOffset] = useState(0);
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

  function handlePreviousWeek() {
    setWeekOffset((currentValue) => currentValue - 1);
  }

  function handleNextWeek() {
    setWeekOffset((currentValue) => currentValue + 1);
  }

  function handleGoToToday() {
    setWeekOffset(0);
  }

  return (
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
          />
        ))}
      </div>
    </section>
  );
}

export default WeeklyCalendar;
