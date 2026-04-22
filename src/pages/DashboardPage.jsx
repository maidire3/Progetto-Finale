import React, { useMemo } from 'react';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { formatSubjectSchedule } from '../data/studyData';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function DashboardPage() {
  const { exams, subjects, tasks } = useStudyData();
  const openTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'Completato'),
    [tasks]
  );
  const nextExam = useMemo(
    () => {
      if (exams.length === 0) {
        return null;
      }

      return [...exams].sort(
        (firstExam, secondExam) => new Date(firstExam.date) - new Date(secondExam.date)
      )[0];
    },
    [exams]
  );
  return (
    <DashboardSectionLayout title="Dashboard" eyebrow="Study Tracker">
      <section className="dashboard-placeholder">
        <div className="dashboard-placeholder__intro">
          <p className="dashboard-placeholder__eyebrow">Weekly planner</p>
          <h2>Weekly Calendar</h2>
          <p>
            Una vista settimanale semplice per organizzare sessioni di studio,
            task e blocchi di revisione.
          </p>
        </div>

        <div className="dashboard-summary-grid">
            <article className="dashboard-summary-card">
              <p className="dashboard-summary-card__label">Materie attive</p>
              <h3>{subjects.length}</h3>
              <p>Tutte organizzate con colori e programmazione settimanale.</p>
            </article>

          <article className="dashboard-summary-card">
            <p className="dashboard-summary-card__label">Task aperte</p>
            <h3>{openTasks.length}</h3>
            <p>
              {openTasks.filter((task) => task.status === 'Da fare').length} da fare e{' '}
              {openTasks.filter((task) => task.status === 'In corso').length} in corso.
            </p>
          </article>

          <article className="dashboard-summary-card">
            <p className="dashboard-summary-card__label">Prossimo esame</p>
            <h3>{nextExam ? nextExam.subject : 'Nessuno'}</h3>
            <p>{nextExam ? `${nextExam.date} - ${nextExam.location}` : 'Nessun esame pianificato.'}</p>
          </article>
        </div>

        <div className="dashboard-placeholder__canvas">
          <WeeklyCalendar tasks={tasks} subjects={subjects} />

          <div className="dashboard-linked-grid">
            <article className="dashboard-linked-card">
              <div className="dashboard-linked-card__header">
                <div>
                  <p className="dashboard-linked-card__label">Materie</p>
                  <h3>Programmazione settimanale</h3>
                </div>
                <span className="dashboard-linked-card__badge">
                  {subjects.length} attive
                </span>
              </div>

              <div className="dashboard-linked-list">
                {subjects.map((subject) => (
                  <div className="dashboard-linked-item" key={subject.id}>
                    <div className="dashboard-linked-item__content">
                      <p className="dashboard-linked-item__title" title={subject.name}>
                        {subject.name}
                      </p>
                      <p className="dashboard-linked-item__meta">
                        {formatSubjectSchedule(subject)}
                      </p>
                    </div>
                    <span className="dashboard-linked-item__pill">
                      {tasks.filter((task) => task.subject === subject.name).length} task
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-linked-card">
              <div className="dashboard-linked-card__header">
                <div>
                  <p className="dashboard-linked-card__label">In arrivo</p>
                  <h3>Task ed esami da monitorare</h3>
                </div>
              </div>

              <div className="dashboard-linked-list">
                {openTasks.slice(0, 3).map((task) => (
                  <div className="dashboard-linked-item" key={task.id}>
                    <div className="dashboard-linked-item__content">
                      <p className="dashboard-linked-item__title" title={task.title}>
                        {task.title}
                      </p>
                      <p className="dashboard-linked-item__meta">
                        {task.dueDate
                          ? `${task.subject} - Scadenza ${task.dueDate}${
                              Number.isFinite(task.startHour)
                                ? ` alle ${String(task.startHour).padStart(2, '0')}:00`
                                : ''
                            }`
                          : `${task.subject} - Da pianificare`}
                      </p>
                    </div>
                    <span className="dashboard-linked-item__pill">{task.status}</span>
                  </div>
                ))}

                {nextExam ? (
                  <div className="dashboard-linked-item dashboard-linked-item--exam">
                    <div className="dashboard-linked-item__content">
                      <p className="dashboard-linked-item__title" title={nextExam.subject}>
                        {nextExam.subject}
                      </p>
                      <p className="dashboard-linked-item__meta">
                        {nextExam.date} - {nextExam.location}
                      </p>
                    </div>
                    <span className="dashboard-linked-item__pill">Esame</span>
                  </div>
                ) : (
                  <div className="dashboard-linked-item dashboard-linked-item--exam">
                    <div className="dashboard-linked-item__content">
                      <p
                        className="dashboard-linked-item__title"
                        title="Nessun esame in programma"
                      >
                        Nessun esame in programma
                      </p>
                      <p className="dashboard-linked-item__meta">
                        Aggiungi un esame per vederlo qui in dashboard.
                      </p>
                    </div>
                    <span className="dashboard-linked-item__pill">Vuoto</span>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default DashboardPage;
