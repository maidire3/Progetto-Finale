import React, { useMemo, useState } from 'react';
import deleteIcon from '../assets/icons8-delete-48.png';
import settingsIcon from '../assets/icons8-settings-50.png';
import TaskModal from '../components/dashboard/TaskModal';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { INITIAL_SUBJECTS } from '../data/studyData';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const EMPTY_TASK_FORM = {
  id: '',
  title: '',
  status: 'Da fare',
  subject: 'Analisi 2',
  dueDate: '',
  startTime: '',
  endTime: '',
  notes: ''
};

function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useStudyData();
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
    setFormValues({
      ...task,
      status: task.status || 'Da fare',
      dueDate: task.dueDate || '',
      startTime: Number.isFinite(task.startHour)
        ? `${String(task.startHour).padStart(2, '0')}:00`
        : '',
      endTime: Number.isFinite(task.endHour)
        ? task.endHour >= 24
          ? '23:59'
          : `${String(task.endHour).padStart(2, '0')}:00`
        : '',
      notes: task.notes || ''
    });
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
      notes: formValues.notes,
      dueDate: formValues.dueDate,
      startHour:
        formValues.dueDate && formValues.startTime && formValues.endTime
          ? Number(formValues.startTime.split(':')[0])
          : null,
      endHour:
        formValues.dueDate && formValues.startTime && formValues.endTime
          ? Math.max(
              Number(formValues.endTime.split(':')[0]),
              Number(formValues.startTime.split(':')[0]) + 1
            )
          : null
    };

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask({
        ...payload,
        dayOffset: 0
      });
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

    deleteTask(taskId);
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
                <p className="section-list__meta">
                  {task.dueDate
                    ? `Scadenza: ${task.dueDate}${
                        Number.isFinite(task.startHour)
                          ? ` alle ${String(task.startHour).padStart(2, '0')}:00`
                          : ''
                      }`
                    : 'Nessuna pianificazione in calendario'}
                </p>
              </div>

              <div className="section-list__actions">
                <span className="section-status">{task.status}</span>
                <button
                  className="entity-action-button"
                  type="button"
                  onClick={() => openEditModal(task)}
                  aria-label={`Modifica ${task.title}`}
                >
                  <img
                    alt=""
                    className="entity-action-button__icon"
                    src={settingsIcon}
                  />
                </button>
                <button
                  className="entity-action-button entity-action-button--danger"
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label={`Elimina ${task.title}`}
                >
                  <img
                    alt=""
                    className="entity-action-button__icon"
                    src={deleteIcon}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TaskModal
        editingTask={editingTask}
        formValues={formValues}
        isOpen={isModalOpen}
        onClose={closeModal}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        subjectOptions={INITIAL_SUBJECTS}
      />
    </DashboardSectionLayout>
  );
}

export default TasksPage;
