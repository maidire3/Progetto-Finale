import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const mockSubjects = [
  {
    name: 'Analisi 2',
    description: 'Limiti, derivate e esercizi di riepilogo.',
    taskCount: 4
  },
  {
    name: 'Basi di dati',
    description: 'Query SQL, modelli relazionali e laboratorio.',
    taskCount: 3
  },
  {
    name: 'Statistica',
    description: 'Formule principali e simulazioni d esame.',
    taskCount: 5
  }
];

function SubjectsPage() {
  return (
    <DashboardSectionLayout title="Materie" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Le tue materie attive</h2>
          <p>
            Una panoramica semplice delle materie da seguire durante il
            semestre.
          </p>
        </div>

        <div className="section-grid">
          {mockSubjects.map((subject) => (
            <article className="section-card" key={subject.name}>
              <p className="section-card__label">Materia</p>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
              <p className="section-card__meta">{subject.taskCount} task attive</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default SubjectsPage;
