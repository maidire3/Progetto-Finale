import React from 'react';
import TaskBlock from './TaskBlock';

function DayColumn({
  day,
  hours,
  calendarStartHour,
  onSlotClick,
  onTaskClick,
  slotHeight
}) {
  return (
    <div
      className={`weekly-calendar__day-column ${
        day.isToday ? 'weekly-calendar__day-column--today' : ''
      }`}
    >
      <header className="weekly-calendar__day-header">
        <div className="weekly-calendar__day-header-main">
          <p className="weekly-calendar__day-name">{day.label}</p>
          <p className="weekly-calendar__day-number">{day.dayNumber}</p>
        </div>

        {day.isToday ? (
          <span className="weekly-calendar__today-label">Today</span>
        ) : null}
      </header>

      <div className="weekly-calendar__day-body">
        {hours.map((hour) => (
          <button
            aria-label={`Nuova task per ${day.label} alle ${String(hour).padStart(2, '0')}:00`}
            className="weekly-calendar__hour-row"
            key={`${day.key}-${hour}`}
            type="button"
            onClick={() => onSlotClick(day.dateValue, hour)}
          />
        ))}

        <div className="weekly-calendar__task-layer">
          {day.tasks.map((task) => (
            <TaskBlock
              calendarStartHour={calendarStartHour}
              key={task.id}
              onClick={onTaskClick}
              slotHeight={slotHeight}
              task={task}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DayColumn;
