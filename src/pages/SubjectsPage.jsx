import React, { useMemo, useState } from 'react';
import deleteIcon from '../assets/icons8-delete-48.png';
import settingsIcon from '../assets/icons8-settings-50.png';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { useStudyData } from '../context/StudyDataContext';
import {
  COLOR_OPTIONS,
  WEEK_DAYS,
  formatSubjectSchedule
} from '../data/studyData';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const EMPTY_FORM = {
  id: '',
  name: '',
  color: 'sage',
  scheduleEnabled: false,
  scheduleDays: [],
  startTime: '09:00',
  endTime: '11:00'
};

function SubjectsPage() {
  const {
    addSubject,
    deleteSubject,
    isSubjectsLoading,
    subjects,
    tasks,
    updateSubject
  } = useStudyData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingSubject = useMemo(
    () => subjects.find((subject) => subject.id === editingSubjectId) || null,
    [editingSubjectId, subjects]
  );

  function openCreateModal() {
    setEditingSubjectId(null);
    setFormValues(EMPTY_FORM);
    setFeedbackMessage('');
    setIsModalOpen(true);
  }

  function openEditModal(subject) {
    setEditingSubjectId(subject.id);
    setFormValues({
      id: subject.id,
      name: subject.name,
      color: subject.color,
      scheduleEnabled: subject.scheduleEnabled,
      scheduleDays: subject.scheduleDays,
      startTime: subject.startTime,
      endTime: subject.endTime
    });
    setFeedbackMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingSubjectId(null);
    setFormValues(EMPTY_FORM);
    setFeedbackMessage('');
  }

  function handleNameChange(event) {
    setFormValues((currentValues) => ({
      ...currentValues,
      name: event.target.value
    }));
  }

  function handleColorChange(event) {
    setFormValues((currentValues) => ({
      ...currentValues,
      color: event.target.value
    }));
  }

  function handleScheduleToggle() {
    setFormValues((currentValues) => ({
      ...currentValues,
      scheduleEnabled: !currentValues.scheduleEnabled
    }));
  }

  function handleTimeChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  }

  function handleDayToggle(dayValue) {
    setFormValues((currentValues) => {
      const isSelected = currentValues.scheduleDays.includes(dayValue);

      return {
        ...currentValues,
        scheduleDays: isSelected
          ? currentValues.scheduleDays.filter((day) => day !== dayValue)
          : [...currentValues.scheduleDays, dayValue]
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = formValues.name.trim();

    if (!trimmedName) {
      setFeedbackMessage('Il nome materia e obbligatorio.');
      return;
    }

    const subjectPayload = {
      name: trimmedName,
      color: formValues.color,
      scheduleEnabled: formValues.scheduleEnabled,
      scheduleDays: formValues.scheduleEnabled ? formValues.scheduleDays : [],
      startTime: formValues.startTime,
      endTime: formValues.endTime
    };

    setIsSubmitting(true);

    const result = editingSubject
      ? await updateSubject(editingSubject.id, subjectPayload)
      : await addSubject(subjectPayload);

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMessage(result.message);
      return;
    }

    if (editingSubject) {
      setFeedbackMessage('Materia aggiornata con successo.');
    }

    closeModal();
  }

  async function handleDeleteSubject(subjectId) {
    const subjectToDelete = subjects.find((subject) => subject.id === subjectId);

    if (!subjectToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Vuoi eliminare la materia "${subjectToDelete.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const result = await deleteSubject(subjectId);

    if (!result.success) {
      window.alert(result.message);
    }
  }

  return (
    <DashboardSectionLayout title="Materie" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>Le tue materie attive</h2>
            <p>
              Organizza le materie del semestre con un riepilogo semplice di
              task, colore e programmazione settimanale.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="button"
            onClick={openCreateModal}
          >
            + Nuova materia
          </button>
        </div>

        {isSubjectsLoading ? (
          <div className="section-empty-state">
            <p>Caricamento materie in corso...</p>
          </div>
        ) : null}

        {!isSubjectsLoading && subjects.length === 0 ? (
          <div className="section-empty-state">
            <p>Nessuna materia ancora creata. Inizia con la prima materia del semestre.</p>
          </div>
        ) : null}

        {!isSubjectsLoading && subjects.length > 0 ? (
        <div className="section-grid section-grid--subjects">
          {subjects.map((subject) => (
            <article
              className={`subject-card subject-card--${subject.color}`}
              key={subject.id}
            >
              <div className="subject-card__top">
                <div>
                  <p className="section-card__label">Materia</p>
                  <h3>{subject.name}</h3>
                </div>

                <div className="subject-card__actions">
                  <button
                    aria-label={`Modifica ${subject.name}`}
                    className="subject-card__icon-button"
                    type="button"
                    onClick={() => openEditModal(subject)}
                  >
                    <img
                      alt=""
                      className="entity-action-button__icon"
                      src={settingsIcon}
                    />
                  </button>
                  <button
                    aria-label={`Elimina ${subject.name}`}
                    className="subject-card__text-button"
                    type="button"
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    <img
                      alt=""
                      className="entity-action-button__icon"
                      src={deleteIcon}
                    />
                  </button>
                </div>
              </div>

              <p className="subject-card__description">{subject.description}</p>

              <div className="subject-card__meta-row">
                <span className="subject-card__pill">
                  {tasks.filter((task) => task.subject === subject.name).length} task attive
                </span>
                <span className="subject-card__pill subject-card__pill--secondary">
                  {COLOR_OPTIONS.find((option) => option.value === subject.color)?.label}
                </span>
              </div>

              <div className="subject-card__schedule">
                <p className="subject-card__schedule-label">Programmazione</p>
                <p className="subject-card__schedule-value">
                  {formatSubjectSchedule(subject)}
                </p>
              </div>
            </article>
          ))}
        </div>
        ) : null}
      </section>

      {isModalOpen ? (
        <div className="subject-modal-backdrop" role="presentation">
          <div
            aria-labelledby="subject-modal-title"
            aria-modal="true"
            className="subject-modal"
            role="dialog"
          >
            <div className="subject-modal__header">
              <div>
                <p className="section-card__label">
                  {editingSubject ? 'Modifica materia' : 'Nuova materia'}
                </p>
                <h3 id="subject-modal-title">
                  {editingSubject ? 'Aggiorna materia' : 'Crea una nuova materia'}
                </h3>
              </div>

              <button
                className="subject-modal__close"
                type="button"
                onClick={closeModal}
              >
                Chiudi
              </button>
            </div>

            <form className="subject-form" onSubmit={handleSubmit}>
              <div className="subject-form__group">
                <label htmlFor="subject-name">Nome materia</label>
                <input
                  id="subject-name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleNameChange}
                  placeholder="Es. Analisi 2"
                  required
                />
              </div>

              <div className="subject-form__group">
                <label htmlFor="subject-color">Colore background</label>
                <select
                  id="subject-color"
                  name="color"
                  value={formValues.color}
                  onChange={handleColorChange}
                >
                  {COLOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="subject-form__schedule-toggle">
                <label htmlFor="schedule-toggle">Programmazione settimanale</label>
                <input
                  checked={formValues.scheduleEnabled}
                  id="schedule-toggle"
                  type="checkbox"
                  onChange={handleScheduleToggle}
                />
              </div>

              {formValues.scheduleEnabled ? (
                <div className="subject-form__schedule-fields">
                  <div className="subject-form__group">
                    <p className="subject-form__days-label">Giorni</p>
                    <div className="subject-form__days">
                      {WEEK_DAYS.map((day) => (
                        <label className="subject-form__day-option" key={day.value}>
                          <input
                            checked={formValues.scheduleDays.includes(day.value)}
                            type="checkbox"
                            onChange={() => handleDayToggle(day.value)}
                          />
                          <span>{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="subject-form__time-row">
                    <div className="subject-form__group">
                      <label htmlFor="start-time">Inizio</label>
                      <input
                        id="start-time"
                        name="startTime"
                        type="time"
                        value={formValues.startTime}
                        onChange={handleTimeChange}
                      />
                    </div>

                    <div className="subject-form__group">
                      <label htmlFor="end-time">Fine</label>
                      <input
                        id="end-time"
                        name="endTime"
                        type="time"
                        value={formValues.endTime}
                        onChange={handleTimeChange}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {feedbackMessage ? (
                <p className="entity-form__message">{feedbackMessage}</p>
              ) : null}

              <div className="subject-form__actions">
                <button
                  className="subject-form__button subject-form__button--secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Annulla
                </button>
                <button className="subject-form__button" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Salvataggio...'
                    : editingSubject
                      ? 'Salva modifiche'
                      : 'Aggiungi materia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardSectionLayout>
  );
}

export default SubjectsPage;
