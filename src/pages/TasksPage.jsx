import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const mockTasks = [
  { title: 'Ripasso limiti', status: 'In corso', subject: 'Analisi 2' },
  { title: 'Quiz settimanale', status: 'Da fare', subject: 'Statistica' },
  { title: 'Esercizi SQL', status: 'Completato', subject: 'Basi di dati' }
];

function TasksPage() {
  return (
    <DashboardSectionLayout title="Task" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Task di studio</h2>
          <p>
            Un elenco rapido delle attivita da completare nelle prossime
            giornate.
          </p>
        </div>

        <div className="section-list">
          {mockTasks.map((task) => (
            <article className="section-list__item" key={`${task.title}-${task.subject}`}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.subject}</p>
              </div>
              <span className="section-status">{task.status}</span>
            </article>
          ))}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default TasksPage;
