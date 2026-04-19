import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function SearchPage() {
  return (
    <DashboardSectionLayout title="Search" eyebrow="Workspace">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Cerca rapidamente tra materie, task ed esami</h2>
          <p>
            Qui potremo aggiungere una ricerca globale. Per ora e una sezione
            placeholder utile per la navigazione.
          </p>
        </div>

        <div className="section-card">
          <p className="section-card__label">Mock content</p>
          <h3>Search placeholder</h3>
          <p>
            Risultati recenti, filtri e scorciatoie di ricerca arriveranno nei
            prossimi step.
          </p>
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default SearchPage;
