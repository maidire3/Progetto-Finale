import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { getTaskSubjectOptions } from '../data/studyData';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function buildEmptyNote(subjectOptions) {
  return {
    title: '',
    subject: subjectOptions[0]?.name || 'Generale',
    content: ''
  };
}

function formatNoteDate(value) {
  if (!value) {
    return 'Non ancora salvato';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Non disponibile';
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function NoteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    addNote,
    getNote,
    isNotesLoading,
    notes,
    subjects,
    updateNote
  } = useStudyData();
  const subjectOptions = useMemo(() => getTaskSubjectOptions(subjects), [subjects]);
  const [formValues, setFormValues] = useState(buildEmptyNote(subjectOptions));
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreating = id === 'new';

  const currentNote = useMemo(
    () => notes.find((note) => note.id === id) || null,
    [id, notes]
  );

  useEffect(() => {
    if (isCreating) {
      setFormValues(buildEmptyNote(subjectOptions));
      return;
    }

    if (currentNote) {
      setFormValues({
        title: currentNote.title,
        subject: currentNote.subject || 'Generale',
        content: currentNote.content || ''
      });
      return;
    }

    async function loadNote() {
      const result = await getNote(id);

      if (!result.success) {
        setFeedbackMessage(result.message);
      }
    }

    loadNote();
  }, [currentNote, getNote, id, isCreating, subjectOptions]);

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

    if (!trimmedTitle) {
      setFeedbackMessage('Il titolo e obbligatorio.');
      return;
    }

    const payload = {
      title: trimmedTitle,
      subject: formValues.subject || 'Generale',
      content: formValues.content.trim()
    };

    setIsSubmitting(true);

    const result = isCreating
      ? await addNote(payload)
      : await updateNote(id, payload);

    setIsSubmitting(false);

    if (!result.success) {
      setFeedbackMessage(result.message);
      return;
    }

    setFeedbackMessage(result.message);

    if (isCreating && result.note?.id) {
      navigate(`/notes/${result.note.id}`, { replace: true });
    }
  }

  return (
    <DashboardSectionLayout
      title={isCreating ? 'Nuovo appunto' : 'Dettaglio appunto'}
      eyebrow="Study"
    >
      <section className="section-page">
        <div className="note-detail-page">
          <div className="note-detail-page__topbar">
            <Link className="note-detail-page__back" to="/notes">
              Torna agli appunti
            </Link>
            <p className="note-detail-page__updated">
              {isCreating ? 'Nuovo appunto' : `Ultima modifica: ${formatNoteDate(currentNote?.updatedAt)}`}
            </p>
          </div>

          {!isCreating && isNotesLoading && !currentNote ? (
            <div className="section-empty-state">
              <p>Caricamento appunto in corso...</p>
            </div>
          ) : null}

          {!isCreating && !isNotesLoading && !currentNote && feedbackMessage ? (
            <div className="section-empty-state">
              <p>{feedbackMessage}</p>
            </div>
          ) : null}

          {isCreating || currentNote ? (
            <form className="note-detail-card" onSubmit={handleSubmit}>
              <div className="note-detail-card__header">
                <div>
                  <p className="section-card__label">Appunto</p>
                  <h2>{isCreating ? 'Crea una nuova nota' : currentNote.title}</h2>
                </div>
                <button className="section-page__primary-action" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvataggio...' : 'Salva modifiche'}
                </button>
              </div>

              <div className="note-detail-form">
                <div className="entity-form__group">
                  <label htmlFor="note-title">Titolo</label>
                  <input
                    id="note-title"
                    name="title"
                    type="text"
                    value={formValues.title}
                    onChange={handleFieldChange}
                    placeholder="Es. Teoremi principali di Analisi 1"
                  />
                </div>

                <div className="entity-form__group">
                  <label htmlFor="note-subject">Materia</label>
                  <select
                    id="note-subject"
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

                <div className="entity-form__group">
                  <label htmlFor="note-content">Contenuto</label>
                  <textarea
                    id="note-content"
                    name="content"
                    rows="18"
                    value={formValues.content}
                    onChange={handleFieldChange}
                    placeholder="Scrivi qui il contenuto dell'appunto..."
                  />
                </div>

                {feedbackMessage ? (
                  <p className="entity-form__message">{feedbackMessage}</p>
                ) : null}
              </div>
            </form>
          ) : null}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default NoteDetailPage;
