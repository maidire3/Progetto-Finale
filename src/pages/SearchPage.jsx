import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function normalizeValue(value) {
  return (value || '').toLowerCase().trim();
}

function includesQuery(query, ...values) {
  return values.some((value) => normalizeValue(value).includes(query));
}

function SearchPage() {
  const navigate = useNavigate();
  const { exams, notes, subjects, tasks } = useStudyData();
  const [query, setQuery] = useState('');

  const trimmedQuery = normalizeValue(query);

  const results = useMemo(() => {
    if (!trimmedQuery) {
      return {
        subjects: [],
        tasks: [],
        exams: [],
        notes: []
      };
    }

    return {
      subjects: subjects.filter((subject) => includesQuery(trimmedQuery, subject.name)),
      tasks: tasks.filter((task) =>
        includesQuery(trimmedQuery, task.title, task.subject, task.notes)
      ),
      exams: exams.filter((exam) =>
        includesQuery(trimmedQuery, exam.subject, exam.location, exam.date)
      ),
      notes: notes.filter((note) =>
        includesQuery(trimmedQuery, note.title, note.folder, note.summary)
      )
    };
  }, [exams, notes, subjects, tasks, trimmedQuery]);

  const groupedResults = useMemo(
    () => [
      {
        key: 'subjects',
        title: 'Materie',
        items: results.subjects,
        getLabel: (subject) => subject.name,
        getMeta: () => 'Vai al riepilogo task della materia',
        onSelect: (subject) =>
          navigate('/subjects', {
            state: {
              openResource: {
                type: 'subject',
                targetId: subject.id,
                action: 'open-tasks-summary'
              }
            }
          })
      },
      {
        key: 'tasks',
        title: 'Task',
        items: results.tasks,
        getLabel: (task) => task.title,
        getMeta: (task) => task.subject || 'Generale',
        onSelect: (task) =>
          navigate('/tasks', {
            state: {
              openResource: {
                type: 'task',
                targetId: task.id,
                action: 'edit'
              }
            }
          })
      },
      {
        key: 'exams',
        title: 'Esami',
        items: results.exams,
        getLabel: (exam) => exam.subject,
        getMeta: (exam) => `${exam.date} - ${exam.location}`,
        onSelect: (exam) =>
          navigate('/exams', {
            state: {
              openResource: {
                type: 'exam',
                targetId: exam.id,
                action: 'edit'
              }
            }
          })
      },
      {
        key: 'notes',
        title: 'Appunti',
        items: results.notes,
        getLabel: (note) => note.title,
        getMeta: (note) => note.folder,
        onSelect: (note) =>
          navigate('/notes', {
            state: {
              openResource: {
                type: 'note',
                targetId: note.id,
                action: 'edit'
              }
            }
          })
      }
    ],
    [navigate, results.exams, results.notes, results.subjects, results.tasks]
  );

  const hasResults = groupedResults.some((group) => group.items.length > 0);

  return (
    <DashboardSectionLayout title="Search" eyebrow="Workspace">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Ricerca rapida</h2>
          <p>
            Cerca in tempo reale tra materie, task, esami e appunti per aprire
            subito la risorsa corretta.
          </p>
        </div>

        <div className="search-page">
          <div className="search-page__input-wrapper">
            <input
              className="search-page__input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca una materia, una task, un esame o un appunto..."
            />
          </div>

          {!trimmedQuery ? (
            <div className="search-page__empty">
              <p>Inizia a scrivere per vedere risultati live da tutta l'app.</p>
            </div>
          ) : null}

          {trimmedQuery && !hasResults ? (
            <div className="search-page__empty">
              <p>Nessun risultato trovato per "{query}".</p>
            </div>
          ) : null}

          {trimmedQuery && hasResults ? (
            <div className="search-results">
              {groupedResults.map((group) =>
                group.items.length > 0 ? (
                  <section className="search-results__group" key={group.key}>
                    <div className="search-results__group-header">
                      <p className="section-card__label">{group.title}</p>
                      <span className="search-results__count">
                        {group.items.length} risultati
                      </span>
                    </div>

                    <div className="search-results__list">
                      {group.items.map((item) => (
                        <button
                          className="search-result-card"
                          key={item.id}
                          type="button"
                          onClick={() => group.onSelect(item)}
                        >
                          <div>
                            <p className="search-result-card__title">
                              {group.getLabel(item)}
                            </p>
                            <p className="search-result-card__meta">{group.getMeta(item)}</p>
                          </div>
                          <span className="search-result-card__type">{group.title}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null
              )}
            </div>
          ) : null}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default SearchPage;
