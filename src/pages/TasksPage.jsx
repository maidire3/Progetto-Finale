import React, { useMemo, useState } from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const TASK_STATUS_OPTIONS = ['Da fare', 'In corso', 'Completato'];
const TASK_SUBJECT_OPTIONS = ['Analisi 2', 'Statistica', 'Basi di dati', 'Programmazione'];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Ripasso limiti',
    status: 'In corso',
    subject: 'Analisi 2',
    dueDate: '2026-04-21'
  },
  {
    id: 'task-2',
    title: 'Quiz settimanale',
    status: 'Da fare',
    subject: 'Statistica',
    dueDate: '2026-04-23'
  },
  {
    id: 'task-3',
    title: 'Esercizi SQL',
    status: 'Completato',
    subject: 'Basi di dati',
    dueDate: '2026-04-18'
  }
];

const EMPTY_TASK_FORM = {
  id: '',
  title: '',
  status: 'Da fare',
  subject: 'Analisi 2',
  dueDate: '2026-04-25'
};

function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_TASK_FORM);

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId) || null,
    [editingTaskId, tasks]
  );

  function openCreateModal() {
    setEditingTaskId(null);
    setFormValues(EMPTY_TASK_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTaskId(task.id);
    setFormValues(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingTaskId(null);
    setFormValues(EMPTY_TASK_FORM);
    setIsModalOpen(false);
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

    const payload = {
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title: trimmedTitle,
      status: formValues.status,
      subject: formValues.subject,
      dueDate: formValues.dueDate
    };

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...payload } : task
        )
      );
    } else {
      setTasks((currentTasks) => [...currentTasks, payload]);
    }

    closeModal();
  }

  function handleDeleteTask(taskId) {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare il task "${taskToDelete.title}"?`)) {
      return;
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  return (
    <DashboardSectionLayout title="Task" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>Task di studio</h2>
            <p>
              Gestisci in modo semplice le attivita del semestre con stato,
              materia e scadenza.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="button"
            onClick={openCreateModal}
          >
            + Nuovo task
          </button>
        </div>

        <div className="section-list">
          {tasks.map((task) => (
            <article className="section-list__item section-list__item--rich" key={task.id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.subject}</p>
                <p className="section-list__meta">Scadenza: {task.dueDate}</p>
              </div>

              <div className="section-list__actions">
                <span className="section-status">{task.status}</span>
                <button
                  className="entity-action-button"
                  type="button"
                  onClick={() => openEditModal(task)}
                >
                  Modifica
                </button>
                <button
                  className="entity-action-button entity-action-button--danger"
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Elimina
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isModalOpen ? (
        <div className="entity-modal-backdrop" role="presentation">
          <div className="entity-modal" role="dialog" aria-modal="true">
            <div className="entity-modal__header">
              <div>
                <p className="section-card__label">
                  {editingTask ? 'Modifica task' : 'Nuovo task'}
                </p>
                <h3>{editingTask ? 'Aggiorna task' : 'Crea un nuovo task'}</h3>
              </div>

              <button className="entity-modal__close" type="button" onClick={closeModal}>
                Chiudi
              </button>
            </div>

            <form className="entity-form" onSubmit={handleSubmit}>
              <div className="entity-form__group">
                <label htmlFor="task-title">Titolo</label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  value={formValues.title}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className="entity-form__row">
                <div className="entity-form__group">
                  <label htmlFor="task-subject">Materia</label>
                  <select
                    id="task-subject"
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

                <div className="entity-form__group">
                  <label htmlFor="task-status">Stato</label>
                  <select
                    id="task-status"
                    name="status"
                    value={formValues.status}
                    onChange={handleFieldChange}
                  >
                    {TASK_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="entity-form__group">
                <label htmlFor="task-date">Scadenza</label>
                <input
                  id="task-date"
                  name="dueDate"
                  type="date"
                  value={formValues.dueDate}
                  onChange={handleFieldChange}
                />
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
                  {editingTask ? 'Salva modifiche' : 'Aggiungi task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardSectionLayout>
  );
}

export default TasksPage;
