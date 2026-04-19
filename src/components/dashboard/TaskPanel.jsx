import React from 'react';

const focusTasks = [
  {
    id: 'focus-1',
    title: 'Ripasso Analisi 2',
    meta: 'Oggi, 10:00 - Priorita media'
  },
  {
    id: 'focus-2',
    title: 'Terminare appunti di Fisica',
    meta: 'Domani, 08:30 - Priorita alta'
  },
  {
    id: 'focus-3',
    title: 'Preparare quiz di Statistica',
    meta: 'Venerdi, 14:00 - Priorita media'
  }
];

function TaskPanel({ isOpen, onOpen, onClose }) {
  return (
    <>
      <button
        className={`task-panel-trigger ${isOpen ? 'task-panel-trigger--hidden' : ''}`}
        type="button"
        aria-label="Apri task panel"
        onClick={onOpen}
      >
        <span className="task-panel-trigger__icon" aria-hidden="true">
          +
        </span>
        <span className="task-panel-trigger__eyebrow">Focus</span>
        <span className="task-panel-trigger__title">Task</span>
      </button>

      <div
        className={`task-panel-overlay ${isOpen ? 'task-panel-overlay--visible' : ''}`}
        role="presentation"
        onClick={onClose}
      />

      <aside
        className={`task-sidebar ${isOpen ? 'task-sidebar--open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Task panel"
      >
        <div className="task-sidebar__header">
          <div>
            <p className="task-sidebar__eyebrow">Focus</p>
            <h2>Task List</h2>
          </div>

          <button className="task-sidebar__close" type="button" onClick={onClose}>
            Chiudi
          </button>
        </div>

        <p className="task-sidebar__description">
          Una vista rapida delle task piu importanti della settimana, sempre a
          portata di click senza occupare spazio fisso nella dashboard.
        </p>

        <ul className="task-sidebar__list">
          {focusTasks.map((task) => (
            <li className="task-sidebar__item" key={task.id}>
              <span className="task-sidebar__dot" aria-hidden="true" />
              <div>
                <p className="task-sidebar__item-title">{task.title}</p>
                <p className="task-sidebar__item-meta">{task.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default TaskPanel;
