import React, { useMemo, useState } from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const NOTE_FOLDER_OPTIONS = ['Analisi 2', 'Statistica', 'Database', 'Generale'];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Cartella Analisi 2',
    folder: 'Analisi 2',
    summary: 'Formule, appunti lezione e esercizi svolti.'
  },
  {
    id: 'note-2',
    title: 'Riassunti di Statistica',
    folder: 'Statistica',
    summary: 'Schemi rapidi per distribuzioni e test.'
  },
  {
    id: 'note-3',
    title: 'Laboratorio Database',
    folder: 'Database',
    summary: 'Query utili, esempi di join e normalizzazione.'
  }
];

const EMPTY_NOTE_FORM = {
  id: '',
  title: '',
  folder: 'Generale',
  summary: ''
};

function NotesPage() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_NOTE_FORM);

  const editingNote = useMemo(
    () => notes.find((note) => note.id === editingNoteId) || null,
    [editingNoteId, notes]
  );

  function openCreateModal() {
    setEditingNoteId(null);
    setFormValues(EMPTY_NOTE_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(note) {
    setEditingNoteId(note.id);
    setFormValues(note);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingNoteId(null);
    setFormValues(EMPTY_NOTE_FORM);
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
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      title: trimmedTitle,
      folder: formValues.folder,
      summary: formValues.summary.trim() || 'Nota rapida creata nella dashboard.'
    };

    if (editingNote) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNote.id ? { ...note, ...payload } : note
        )
      );
    } else {
      setNotes((currentNotes) => [...currentNotes, payload]);
    }

    closeModal();
  }

  function handleDeleteNote(noteId) {
    const noteToDelete = notes.find((note) => note.id === noteId);

    if (!noteToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare la nota "${noteToDelete.title}"?`)) {
      return;
    }

    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
  }

  return (
    <DashboardSectionLayout title="Appunti" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>Appunti e cartelle</h2>
            <p>
              Organizza note, riassunti e materiali in una struttura leggera ma
              utile per lo studio quotidiano.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="button"
            onClick={openCreateModal}
          >
            + Nuova nota
          </button>
        </div>

        <div className="section-grid">
          {notes.map((note) => (
            <article className="section-card section-card--note" key={note.id}>
              <p className="section-card__label">Cartella</p>
              <h3>{note.title}</h3>
              <p>{note.summary}</p>
              <p className="section-card__meta">{note.folder}</p>
              <div className="section-card__actions">
                <button
                  className="entity-action-button"
                  type="button"
                  onClick={() => openEditModal(note)}
                >
                  Modifica
                </button>
                <button
                  className="entity-action-button entity-action-button--danger"
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
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
                  {editingNote ? 'Modifica nota' : 'Nuova nota'}
                </p>
                <h3>{editingNote ? 'Aggiorna nota' : 'Crea una nuova nota'}</h3>
              </div>

              <button className="entity-modal__close" type="button" onClick={closeModal}>
                Chiudi
              </button>
            </div>

            <form className="entity-form" onSubmit={handleSubmit}>
              <div className="entity-form__group">
                <label htmlFor="note-title">Titolo</label>
                <input
                  id="note-title"
                  name="title"
                  type="text"
                  value={formValues.title}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className="entity-form__group">
                <label htmlFor="note-folder">Cartella</label>
                <select
                  id="note-folder"
                  name="folder"
                  value={formValues.folder}
                  onChange={handleFieldChange}
                >
                  {NOTE_FOLDER_OPTIONS.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              </div>

              <div className="entity-form__group">
                <label htmlFor="note-summary">Riepilogo</label>
                <textarea
                  id="note-summary"
                  name="summary"
                  rows="4"
                  value={formValues.summary}
                  onChange={handleFieldChange}
                  placeholder="Breve descrizione della nota o della cartella."
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
                  {editingNote ? 'Salva modifiche' : 'Aggiungi nota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardSectionLayout>
  );
}

export default NotesPage;
