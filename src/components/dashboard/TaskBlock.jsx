import React from 'react';

const START_HOUR = 6;
const HOUR_HEIGHT = 64;

function TaskBlock({ task }) {
  const top = (task.startHour - START_HOUR) * HOUR_HEIGHT + 8;
  const height = Math.max((task.endHour - task.startHour) * HOUR_HEIGHT - 12, 44);

  return (
    <article
      className="calendar-task-block"
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
    </article>
  );
}

export default TaskBlock;
