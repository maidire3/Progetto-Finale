import React from 'react';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../assets/icons8-delete-48.png';
import settingsIcon from '../assets/icons8-settings-50.png';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function formatNoteDate(value) {
  if (!value) {
    return 'Data non disponibile';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data non disponibile';
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function getPreview(content) {
  const trimmedContent = (content || '').trim();

  if (!trimmedContent) {
    return 'Nessun contenuto ancora scritto. Apri l appunto per iniziare.';
  }

  return trimmedContent;
}

function NotesPage() {
  const navigate = useNavigate();
  const { deleteNote, isNotesLoading, notes } = useStudyData();

  function handleCreateNote() {
    navigate('/notes/new');
  }

  function handleOpenNote(noteId) {
    navigate(`/notes/${noteId}`);
  }

  async function handleDeleteNote(event, noteId) {
    event.stopPropagation();

    const noteToDelete = notes.find((note) => note.id === noteId);

    if (!noteToDelete) {
      return;
    }

    if (!window.confirm(`Vuoi eliminare l'appunto "${noteToDelete.title}"?`)) {
      return;
    }

    const result = await deleteNote(noteId);

    if (!result.success) {
      window.alert(result.message);
    }
  }

  return (
    <DashboardSectionLayout title="Appunti" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>I tuoi appunti</h2>
            <p>
              Salva note reali collegate alle materie e riaprile in una pagina
              dedicata comoda da aggiornare.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="button"
            onClick={handleCreateNote}
          >
            + Nuova nota
          </button>
        </div>

        {isNotesLoading ? (
          <div className="section-empty-state">
            <p>Caricamento appunti in corso...</p>
          </div>
        ) : null}

        {!isNotesLoading && notes.length === 0 ? (
          <div className="section-empty-state">
            <p>Nessun appunto ancora creato. Inizia dalla tua prima nota di studio.</p>
          </div>
        ) : null}

        {!isNotesLoading && notes.length > 0 ? (
          <div className="section-grid">
            {notes.map((note) => (
              <article
                className="section-card section-card--note section-card--clickable"
                key={note.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenNote(note.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleOpenNote(note.id);
                  }
                }}
              >
                <p className="section-card__label">Appunto</p>
                <h3>{note.title}</h3>
                <p className="section-card__meta section-card__meta--subject">{note.subject}</p>
                <p className="section-card__preview">{getPreview(note.content)}</p>
                <p className="section-card__meta">Ultima modifica: {formatNoteDate(note.updatedAt)}</p>
                <div className="section-card__actions">
                  <button
                    className="entity-action-button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenNote(note.id);
                    }}
                    aria-label={`Apri ${note.title}`}
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
                    onClick={(event) => handleDeleteNote(event, note.id)}
                    aria-label={`Elimina ${note.title}`}
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
    </DashboardSectionLayout>
  );
}

export default NotesPage;
