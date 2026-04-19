import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const mockExams = [
  { subject: 'Analisi 2', date: '12 Maggio 2026' },
  { subject: 'Statistica', date: '20 Maggio 2026' },
  { subject: 'Basi di dati', date: '03 Giugno 2026' }
];

function ExamsPage() {
  return (
    <DashboardSectionLayout title="Esami" eyebrow="Study">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Prossimi esami</h2>
          <p>
            Un piccolo promemoria con le date piu importanti del tuo piano
            esami.
          </p>
        </div>

        <div className="section-list">
          {mockExams.map((exam) => (
            <article className="section-list__item" key={`${exam.subject}-${exam.date}`}>
              <div>
                <h3>{exam.subject}</h3>
                <p>Data disponibile nel calendario esami</p>
              </div>
              <span className="section-status section-status--date">{exam.date}</span>
            </article>
          ))}
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default ExamsPage;
