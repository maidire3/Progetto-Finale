import React, { useMemo, useState } from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { EXAM_SUBJECT_OPTIONS, INITIAL_EXAMS } from '../data/studyData';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const EMPTY_EXAM_FORM = {
  id: '',
  subject: 'Analisi 2',
  date: '2026-05-30',
  location: ''
};

function ExamsPage() {
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_EXAM_FORM);

  const editingExam = useMemo(
    () => exams.find((exam) => exam.id === editingExamId) || null,
    [editingExamId, exams]
  );

  function openCreateModal() {
    setEditingExamId(null);
    setFormValues(EMPTY_EXAM_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(exam) {
    setEditingExamId(exam.id);
    setFormValues(exam);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingExamId(null);
    setFormValues(EMPTY_EXAM_FORM);
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

    const payload = {
      id: editingExam ? editingExam.id : `exam-${Date.now()}`,
      subject: formValues.subject,
      date: formValues.date,
      location: formValues.location.trim() || 'Da definire'
    };

    if (editingExam) {
      setExams((currentExams) =>
        currentExams.map((exam) =>
          exam.id === editingExam.id ? { ...exam, ...payload } : exam
        )
      );
    } else {
      setExams((currentExams) => [...currentExams, payload]);
    }

    closeModal();
  }

  function handleDeleteExam(examId) {
    const examToDelete = exams.find((exam) => exam.id === examId);

    if (!examToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare l'esame di "${examToDelete.subject}"?`)) {
      return;
    }

    setExams((currentExams) => currentExams.filter((exam) => exam.id !== examId));
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
                >
                  Modifica
                </button>
                <button
                  className="entity-action-button entity-action-button--danger"
                  type="button"
                  onClick={() => handleDeleteExam(exam.id)}
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
                  {EXAM_SUBJECT_OPTIONS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
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

              <div className="entity-form__actions">
                <button
                  className="entity-form__button entity-form__button--secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Annulla
                </button>
                <button className="entity-form__button" type="submit">
                  {editingExam ? 'Salva modifiche' : 'Aggiungi esame'}
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
