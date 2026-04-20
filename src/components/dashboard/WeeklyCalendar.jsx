import React, { useState } from 'react';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import { getSubjectStyle, INITIAL_SUBJECTS, INITIAL_TASKS } from '../../data/studyData';

const HOURS = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
];
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

function createWeekDays(weekOffset, tasks, subjects) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 1 + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);

    const dayTasks = tasks
      .filter((task) => {
        const taskDate = parseDateString(task.dueDate);
        const hasCalendarTime =
          Number.isFinite(task.startHour) && Number.isFinite(task.endHour);

        return taskDate && hasCalendarTime && task.status !== 'Completato'
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
  const [weekOffset, setWeekOffset] = useState(0);
  const days = createWeekDays(weekOffset, tasks, subjects);
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
        <TimeColumn hours={HOURS} />

        {days.map((day) => (
          <DayColumn day={day} hours={HOURS} key={day.key} />
        ))}
      </div>
    </section>
  );
}

export default WeeklyCalendar;
