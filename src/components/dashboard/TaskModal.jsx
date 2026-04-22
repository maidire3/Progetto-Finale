import React from 'react';
import { TASK_STATUS_OPTIONS } from '../../data/studyData';

function TaskModal({
  isOpen,
  editingTask,
  feedbackMessage = '',
  formValues,
  isSubmitting = false,
  isDeleting = false,
  onClose,
  onDelete,
  onFieldChange,
  onSubmit,
  subjectOptions
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="entity-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="entity-modal weekly-calendar__modal"
        role="dialog"
        aria-modal="true"
        aria-label={editingTask ? 'Modifica task' : 'Nuova task'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="entity-modal__header">
          <div>
            <p className="section-card__label">
              {editingTask ? 'Modifica task' : 'Nuova task'}
            </p>
            <h3>{editingTask ? 'Aggiorna task' : 'Crea una nuova task'}</h3>
          </div>

          <button className="entity-modal__close" type="button" onClick={onClose}>
            Chiudi
          </button>
        </div>

        <form className="entity-form" onSubmit={onSubmit}>
          <div className="entity-form__group">
            <label htmlFor="task-title">Titolo task</label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={onFieldChange}
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
                onChange={onFieldChange}
              >
                {subjectOptions.map((subject) => (
                  <option
                    key={subject.id || subject.name}
                    value={subject.name || subject}
                  >
                    {subject.name || subject}
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
                onChange={onFieldChange}
              >
                {TASK_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="entity-form__row">
            <div className="entity-form__group">
              <label htmlFor="task-date">Data</label>
              <input
                id="task-date"
                name="dueDate"
                type="date"
                value={formValues.dueDate}
                onChange={onFieldChange}
              />
            </div>

            <div className="entity-form__group">
              <label htmlFor="task-start-time">Ora inizio</label>
              <input
                id="task-start-time"
                name="startTime"
                type="time"
                value={formValues.startTime}
                onChange={onFieldChange}
              />
            </div>
          </div>

          <div className="entity-form__row">
            <div className="entity-form__group">
              <label htmlFor="task-end-time">Ora fine</label>
              <input
                id="task-end-time"
                name="endTime"
                type="time"
                value={formValues.endTime}
                onChange={onFieldChange}
              />
            </div>

            <div className="entity-form__group">
              <label htmlFor="task-notes">Note</label>
              <textarea
                id="task-notes"
                name="notes"
                placeholder="Appunti rapidi facoltativi"
                value={formValues.notes}
                onChange={onFieldChange}
              />
            </div>
          </div>

          {feedbackMessage ? (
            <p className="entity-form__message">{feedbackMessage}</p>
          ) : null}

          <div className="entity-form__actions">
            <div className="entity-form__actions-left">
              {editingTask ? (
                <button
                  className="entity-form__button entity-form__button--danger"
                  type="button"
                  onClick={onDelete}
                  disabled={isSubmitting || isDeleting}
                >
                  {isDeleting ? 'Eliminazione...' : 'Elimina'}
                </button>
              ) : null}
            </div>

            <div className="entity-form__actions-right">
              <button
                className="entity-form__button entity-form__button--secondary"
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Annulla
              </button>
              <button
                className="entity-form__button"
                type="submit"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting
                  ? 'Salvataggio...'
                  : editingTask
                    ? 'Salva modifiche'
                    : 'Aggiungi task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
