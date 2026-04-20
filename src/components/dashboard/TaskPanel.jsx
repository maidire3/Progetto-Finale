import React, { useMemo, useState } from 'react';
import { TASK_SUBJECT_OPTIONS } from '../../data/studyData';
import { useStudyData } from '../../context/StudyDataContext';

function TaskPanel({ isOpen, onOpen, onClose }) {
  const { addTask, deleteTask, tasks, updateTask } = useStudyData();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    subject: TASK_SUBJECT_OPTIONS[0],
    dueDate: '',
    startTime: ''
  });

  const openTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'Completato'),
    [tasks]
  );
  const panelTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((firstTask, secondTask) => {
      if (firstTask.status === secondTask.status) {
        return firstTask.title.localeCompare(secondTask.title, 'it');
      }

      return firstTask.status === 'Completato' ? 1 : -1;
    });

    return sortedTasks.map((task) => ({
      ...task,
      meta: task.dueDate
        ? `${task.subject} - ${task.dueDate}${
            Number.isFinite(task.startHour)
              ? ` alle ${String(task.startHour).padStart(2, '0')}:00`
              : ''
          }`
        : `${task.subject} - Da pianificare`
    }));
  }, [tasks]);

  function toggleForm() {
    setIsFormVisible((currentValue) => !currentValue);
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

    addTask({
      title: trimmedTitle,
      subject: formValues.subject,
      dueDate: formValues.dueDate,
      status: 'Da fare',
      dayOffset: 0,
      startHour:
        formValues.dueDate && formValues.startTime
          ? Number(formValues.startTime.split(':')[0])
          : null,
      endHour:
        formValues.dueDate && formValues.startTime
          ? Math.min(Number(formValues.startTime.split(':')[0]) + 1, 24)
          : null
    });

    setFormValues({
      title: '',
      subject: TASK_SUBJECT_OPTIONS[0],
      dueDate: '',
      startTime: ''
    });
    setIsFormVisible(false);
  }

  function handleToggleComplete(task) {
    if (task.status === 'Completato') {
      updateTask(task.id, { status: 'Da fare' });
      return;
    }

    updateTask(task.id, { status: 'Completato' });
  }

  function handleDeleteTask(taskId) {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare il task "${taskToDelete.title}"?`)) {
      return;
    }

    deleteTask(taskId);
  }

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

        <div className="task-sidebar__actions">
          <button className="task-sidebar__primary-button" type="button" onClick={toggleForm}>
            {isFormVisible ? 'Chiudi form' : '+ Nuovo task'}
          </button>
          <span className="task-sidebar__count">{openTasks.length} task aperte</span>
        </div>

        {isFormVisible ? (
          <form className="task-sidebar__form" onSubmit={handleSubmit}>
            <div className="task-sidebar__form-group">
              <label htmlFor="task-panel-title">Titolo</label>
              <input
                id="task-panel-title"
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleFieldChange}
                required
              />
            </div>

            <div className="task-sidebar__form-row">
              <div className="task-sidebar__form-group">
                <label htmlFor="task-panel-subject">Materia</label>
                <select
                  id="task-panel-subject"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleFieldChange}
                >
                  {TASK_SUBJECT_OPTIONS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-sidebar__form-group">
                <label htmlFor="task-panel-date">Scadenza</label>
                <input
                  id="task-panel-date"
                  name="dueDate"
                  type="date"
                  value={formValues.dueDate}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div className="task-sidebar__form-group">
              <label htmlFor="task-panel-time">Orario calendario facoltativo</label>
              <input
                id="task-panel-time"
                name="startTime"
                type="time"
                value={formValues.startTime}
                onChange={handleFieldChange}
              />
            </div>

            <button className="task-sidebar__submit" type="submit">
              Aggiungi task
            </button>
          </form>
        ) : null}

        <ul className="task-sidebar__list">
          {panelTasks.map((task) => (
            <li
              className={`task-sidebar__item ${
                task.status === 'Completato' ? 'task-sidebar__item--completed' : ''
              }`}
              key={task.id}
            >
              <span className="task-sidebar__dot" aria-hidden="true" />
              <div className="task-sidebar__item-content">
                <p className="task-sidebar__item-title">{task.title}</p>
                <p className="task-sidebar__item-meta">{task.meta}</p>
              </div>

              <div className="task-sidebar__item-actions">
                <button
                  className={`task-sidebar__action-button ${
                    task.status === 'Completato'
                      ? 'task-sidebar__action-button--secondary'
                      : 'task-sidebar__action-button--success'
                  }`}
                  type="button"
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.status === 'Completato' ? 'Ripristina' : 'Completa'}
                </button>
                <button
                  className="task-sidebar__action-button task-sidebar__action-button--danger"
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default TaskPanel;
