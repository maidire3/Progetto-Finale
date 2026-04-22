import React from 'react';
import {
  CALENDAR_SLOT_HEIGHT,
  CALENDAR_TASK_INSET_BOTTOM,
  CALENDAR_TASK_INSET_TOP
} from './calendarLayout';

function TaskBlock({ task, calendarStartHour, onClick }) {
  const top = (task.startHour - calendarStartHour) * CALENDAR_SLOT_HEIGHT;
  const height = Math.max(
    (task.endHour - task.startHour) * CALENDAR_SLOT_HEIGHT -
      (CALENDAR_TASK_INSET_TOP + CALENDAR_TASK_INSET_BOTTOM),
    44
  );

  return (
    <button
      className="calendar-task-block"
      type="button"
      onClick={() => onClick(task)}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        background: task.colorStyle?.soft,
        borderColor: `${task.colorStyle?.accent}24`,
        boxShadow: `inset 3px 0 0 ${task.colorStyle?.accent}`
      }}
    >
      <h4>{task.title}</h4>
      <p className="calendar-task-block__subject">{task.subject}</p>
      <p className="calendar-task-block__time">
        {`${String(task.startHour).padStart(2, '0')}:00 - ${String(
          task.endHour
        ).padStart(2, '0')}:00`}
      </p>
    </button>
  );
}

export default TaskBlock;
