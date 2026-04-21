import React, { useMemo, useState } from 'react';
import deleteIcon from '../assets/icons8-delete-48.png';
import settingsIcon from '../assets/icons8-settings-50.png';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { getExamSubjectOptions } from '../data/studyData';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function getEmptyExamForm(subjectOptions) {
  return {
    id: '',
    subject: subjectOptions[0]?.name || 'Generale',
    date: '',
    location: ''
  };
}

function ExamsPage() {
  const {
    addExam,
    deleteExam,
    exams,
    isExamsLoading,
    subjects,
    updateExam
  } = useStudyData();
  const subjectOptions = getExamSubjectOptions(subjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [formValues, setFormValues] = useState(getEmptyExamForm(subjectOptions));
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingExam = useMemo(
    () => exams.find((exam) => exam.id === editingExamId) || null,
    [editingExamId, exams]
  );

  function openCreateModal() {
    setEditingExamId(null);
    setFormValues(getEmptyExamForm(subjectOptions));
    setFeedbackMessage('');
    setIsModalOpen(true);
  }

  function openEditModal(exam) {
    setEditingExamId(exam.id);
    setFormValues(exam);
    setFeedbackMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingExamId(null);
    setFormValues(getEmptyExamForm(subjectOptions));
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

    if (!formValues.subject || !formValues.date) {
      setFeedbackMessage('Materia e data sono obbligatorie.');
      return;
    }

    const payload = {
      subject: formValues.subject,
      date: formValues.date,
      location: formValues.location.trim() || 'Da definire'
    };

    setIsSubmitting(true);

    const result = editingExam
      ? await updateExam(editingExam.id, payload)
      : await addExam(payload);

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMessage(result.message);
      return;
    }

    closeModal();
  }

  async function handleDeleteExam(examId) {
    const examToDelete = exams.find((exam) => exam.id === examId);

    if (!examToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare l'esame di "${examToDelete.subject}"?`)) {
      return;
    }

    const result = await deleteExam(examId);

    if (!result.success) {
      window.alert(result.message);
    }
  }

  return (
    <DashboardSectionLayout title="Esami" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>Prossimi esami</h2>
            <p>
              Tieni sotto controllo le date piu importanti del semestre con una
              vista semplice e ordinata.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="button"
            onClick={openCreateModal}
          >
            + Nuovo esame
          </button>
        </div>

        {isExamsLoading ? (
          <div className="section-empty-state">
            <p>Caricamento esami in corso...</p>
          </div>
        ) : null}

        {!isExamsLoading && exams.length === 0 ? (
          <div className="section-empty-state">
            <p>Nessun esame ancora creato. Aggiungi il primo appello del semestre.</p>
          </div>
        ) : null}

        {!isExamsLoading && exams.length > 0 ? (
          <div className="section-list">
            {exams.map((exam) => (
              <article className="section-list__item section-list__item--rich" key={exam.id}>
                <div>
                  <h3>{exam.subject}</h3>
                  <p>{exam.location}</p>
                  <p className="section-list__meta">Data: {exam.date}</p>
                </div>

                <div className="section-list__actions">
                  <span className="section-status section-status--date">{exam.date}</span>
                  <button
                    className="entity-action-button"
                    type="button"
                    onClick={() => openEditModal(exam)}
                    aria-label={`Modifica esame ${exam.subject}`}
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
                    onClick={() => handleDeleteExam(exam.id)}
                    aria-label={`Elimina esame ${exam.subject}`}
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

      {isModalOpen ? (
        <div className="entity-modal-backdrop" role="presentation">
          <div className="entity-modal" role="dialog" aria-modal="true">
            <div className="entity-modal__header">
              <div>
                <p className="section-card__label">
                  {editingExam ? 'Modifica esame' : 'Nuovo esame'}
                </p>
                <h3>{editingExam ? 'Aggiorna esame' : 'Crea un nuovo esame'}</h3>
              </div>

              <button className="entity-modal__close" type="button" onClick={closeModal}>
                Chiudi
              </button>
            </div>

            <form className="entity-form" onSubmit={handleSubmit}>
              <div className="entity-form__group">
                <label htmlFor="exam-subject">Materia</label>
                <select
                  id="exam-subject"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleFieldChange}
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject.id || subject.name} value={subject.name || subject}>
                      {subject.name || subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="entity-form__row">
                <div className="entity-form__group">
                  <label htmlFor="exam-date">Data</label>
                  <input
                    id="exam-date"
                    name="date"
                    type="date"
                    value={formValues.date}
                    onChange={handleFieldChange}
                  />
                </div>

                <div className="entity-form__group">
                  <label htmlFor="exam-location">Luogo</label>
                  <input
                    id="exam-location"
                    name="location"
                    type="text"
                    value={formValues.location}
                    onChange={handleFieldChange}
                    placeholder="Es. Aula A2"
                  />
                </div>
              </div>

              {feedbackMessage ? (
                <p className="entity-form__message">{feedbackMessage}</p>
              ) : null}

              <div className="entity-form__actions">
                <button
                  className="entity-form__button entity-form__button--secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Annulla
                </button>
                <button className="entity-form__button" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Salvataggio...'
                    : editingExam
                      ? 'Salva modifiche'
                      : 'Aggiungi esame'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardSectionLayout>
  );
}

export default ExamsPage;
