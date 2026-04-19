import React from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function SettingsPage() {
  return (
    <DashboardSectionLayout title="Settings" eyebrow="Account">
      <section className="section-page">
        <div className="section-page__intro">
          <h2>Impostazioni workspace</h2>
          <p>
            Una sezione base per preferenze, profilo e opzioni generali
            dell applicazione.
          </p>
        </div>

        <div className="section-card">
          <p className="section-card__label">Preferences</p>
          <h3>Settings placeholder</h3>
          <p>
            Tema, notifiche e personalizzazioni verranno aggiunti nei prossimi
            step.
          </p>
        </div>
      </section>
    </DashboardSectionLayout>
  );
}

export default SettingsPage;
