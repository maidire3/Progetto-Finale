import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const mockNotes = [
  'Cartella Analisi 2',
  'Riassunti di Statistica',
  'Laboratorio Database'
];

function NotesPage() {
  return (
    <DashboardSectionLayout title="Appunti" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Appunti e cartelle</h2>
          <p>
            Qui potrai organizzare note, riassunti e materiali di supporto per
            ogni materia.
          </p>
        </div>

        <div className="section-grid">
          {mockNotes.map((note) => (
            <article className="section-card" key={note}>
              <p className="section-card__label">Cartella</p>
              <h3>{note}</h3>
              <p>Contenuto mock per mostrare la struttura iniziale della sezione.</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default NotesPage;
