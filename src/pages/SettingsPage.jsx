import React, { useState } from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const INITIAL_SETTINGS = {
  firstName: 'Davide',
  lastName: 'Rossi',
  university: 'Universita di Bologna',
  degreeCourse: 'Informatica',
  language: 'Italiano',
  theme: 'Chiaro',
  weekStart: 'Lunedi',
  plannerStartHour: '06:00',
  plannerEndHour: '22:00'
};

function SettingsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saveMessage, setSaveMessage] = useState('');

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value
    }));
    setSaveMessage('');
  }

  function handleSave(event) {
    event.preventDefault();
    setSaveMessage('Modifiche salvate localmente.');
  }

  return (
    <DashboardSectionLayout title="Settings" eyebrow="Account">
      <section className="section-page">
        <div className="section-page__header">
          <div className="section-page__intro">
            <h2>Impostazioni account</h2>
            <p>
              Gestisci profilo, preferenze e configurazione del planner in una
              sezione unica, semplice e modificabile.
            </p>
          </div>

          <button
            className="section-page__primary-action"
            type="submit"
            form="settings-form"
          >
            Salva modifiche
          </button>
        </div>

        <form className="settings-form" id="settings-form" onSubmit={handleSave}>
          <article className="settings-card" id="profile">
            <div className="settings-card__header">
              <div>
                <p className="section-card__label">Profilo</p>
                <h3>Informazioni personali</h3>
              </div>
              <p className="settings-card__description">
                Dati base del tuo account universitario.
              </p>
            </div>

            <div className="settings-form__grid">
              <label className="settings-field">
                <span>Nome</span>
                <input
                  name="firstName"
                  type="text"
                  value={settings.firstName}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Cognome</span>
                <input
                  name="lastName"
                  type="text"
                  value={settings.lastName}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Scuola / Universita</span>
                <input
                  name="university"
                  type="text"
                  value={settings.university}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Corso di studi</span>
                <input
                  name="degreeCourse"
                  type="text"
                  value={settings.degreeCourse}
                  onChange={handleFieldChange}
                />
              </label>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card__header">
              <div>
                <p className="section-card__label">Preferenze</p>
                <h3>Esperienza d uso</h3>
              </div>
              <p className="settings-card__description">
                Personalizza lingua, tema e organizzazione della settimana.
              </p>
            </div>

            <div className="settings-form__grid settings-form__grid--compact">
              <label className="settings-field">
                <span>Lingua</span>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleFieldChange}
                >
                  <option value="Italiano">Italiano</option>
                  <option value="English">English</option>
                </select>
              </label>

              <label className="settings-field">
                <span>Tema</span>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleFieldChange}
                >
                  <option value="Chiaro">Chiaro</option>
                  <option value="Scuro">Scuro</option>
                  <option value="Sistema">Sistema</option>
                </select>
              </label>

              <label className="settings-field">
                <span>Primo giorno della settimana</span>
                <select
                  name="weekStart"
                  value={settings.weekStart}
                  onChange={handleFieldChange}
                >
                  <option value="Lunedi">Lunedi</option>
                  <option value="Domenica">Domenica</option>
                </select>
              </label>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card__header">
              <div>
                <p className="section-card__label">Calendario</p>
                <h3>Planner giornaliero</h3>
              </div>
              <p className="settings-card__description">
                Imposta la fascia oraria del planner settimanale.
              </p>
            </div>

            <div className="settings-form__grid settings-form__grid--compact">
              <label className="settings-field">
                <span>Orario iniziale</span>
                <input
                  name="plannerStartHour"
                  type="time"
                  value={settings.plannerStartHour}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Orario finale</span>
                <input
                  name="plannerEndHour"
                  type="time"
                  value={settings.plannerEndHour}
                  onChange={handleFieldChange}
                />
              </label>
            </div>
          </article>

          <div className="settings-form__footer">
            <button className="section-page__primary-action" type="submit">
              Salva modifiche
            </button>
            {saveMessage ? <p className="settings-form__message">{saveMessage}</p> : null}
          </div>
        </form>
      </section>
    </DashboardSectionLayout>
  );
}

export default SettingsPage;
