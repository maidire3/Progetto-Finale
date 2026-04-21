import React, { useMemo, useState } from 'react';
import deleteIcon from '../assets/icons8-delete-48.png';
import settingsIcon from '../assets/icons8-settings-50.png';
import TaskModal from '../components/dashboard/TaskModal';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { getTaskSubjectOptions } from '../data/studyData';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function getEmptyTaskForm(subjectOptions) {
  return {
    id: '',
    title: '',
    status: 'Da fare',
    subject: subjectOptions[0]?.name || '',
    dueDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  };
}

function TasksPage() {
  const {
    subjects,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isTasksLoading
  } = useStudyData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const subjectOptions = getTaskSubjectOptions(subjects);
  const [formValues, setFormValues] = useState(getEmptyTaskForm(subjectOptions));
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId) || null,
    [editingTaskId, tasks]
  );

  function openCreateModal() {
    setEditingTaskId(null);
    setFormValues(getEmptyTaskForm(subjectOptions));
    setFeedbackMessage('');
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
    setFeedbackMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingTaskId(null);
    setFormValues(getEmptyTaskForm(subjectOptions));
    setFeedbackMessage('');
    setIsModalOpen(false);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
    setFeedbackMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = formValues.title.trim();

    if (!trimmedTitle || !formValues.subject) {
      setFeedbackMessage('Titolo e materia sono obbligatori.');
      return;
    }

    const payload = {
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

    setIsSubmitting(true);

    const result = editingTask
      ? await updateTask(editingTask.id, payload)
      : await addTask(payload);

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMessage(result.message);
      return;
    }

    closeModal();
  }

  async function handleDeleteTask(taskId) {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare il task "${taskToDelete.title}"?`)) {
      return;
    }

    const result = await deleteTask(taskId);

    if (!result.success) {
      window.alert(result.message);
    }
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

        {isTasksLoading ? (
          <div className="section-empty-state">
            <p>Caricamento task in corso...</p>
          </div>
        ) : null}

        {!isTasksLoading && tasks.length === 0 ? (
          <div className="section-empty-state">
            <p>Nessuna task ancora creata. Aggiungi la prima attivita di studio.</p>
          </div>
        ) : null}

        {!isTasksLoading && tasks.length > 0 ? (
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
        ) : null}
      </section>

      <TaskModal
        editingTask={editingTask}
        feedbackMessage={feedbackMessage}
        formValues={formValues}
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        subjectOptions={subjectOptions}
      />
    </DashboardSectionLayout>
  );
}

export default TasksPage;
