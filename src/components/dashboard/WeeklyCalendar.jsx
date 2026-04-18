import React, { useState } from 'react';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import mockCalendarTasks from '../../data/mockCalendarData';

const HOURS = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
];
const DAY_FORMATTER = new Intl.DateTimeFormat('it-IT', { weekday: 'short' });
const RANGE_FORMATTER = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short'
});

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function createWeekDays(weekOffset) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 1 + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);

    const dayTasks =
      mockCalendarTasks.find((entry) => entry.dayOffset === index)?.tasks || [];

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

function WeeklyCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = createWeekDays(weekOffset);
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
