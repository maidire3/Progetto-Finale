import React, { useEffect, useState } from 'react';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import { useStudyData } from '../context/StudyDataContext';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function SettingsPage() {
  const { isUserLoading, settings, updateSettings } = useStudyData();
  const [draftSettings, setDraftSettings] = useState(settings);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setDraftSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value
    }));
    setSaveMessage('');
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);

    const result = await updateSettings(draftSettings);
    setSaveMessage(result.message);
    setIsSaving(false);
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
            disabled={isSaving || isUserLoading}
          >
            {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
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
                  value={draftSettings.firstName}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Cognome</span>
                <input
                  name="lastName"
                  type="text"
                  value={draftSettings.lastName}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Scuola / Universita</span>
                <input
                  name="school"
                  type="text"
                  value={draftSettings.school}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Corso di studi</span>
                <input
                  name="courseOfStudy"
                  type="text"
                  value={draftSettings.courseOfStudy}
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
                  value={draftSettings.language}
                  onChange={handleFieldChange}
                >
                  <option value="it">Italiano</option>
                </select>
              </label>

              <label className="settings-field">
                <span>Tema</span>
                <select
                  name="theme"
                  value={draftSettings.theme}
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
                  value={draftSettings.weekStart}
                  onChange={handleFieldChange}
                >
                  <option value="monday">Lunedi</option>
                  <option value="sunday">Domenica</option>
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
                  value={draftSettings.plannerStartHour}
                  onChange={handleFieldChange}
                />
              </label>

              <label className="settings-field">
                <span>Orario finale</span>
                <input
                  name="plannerEndHour"
                  type="time"
                  value={draftSettings.plannerEndHour}
                  onChange={handleFieldChange}
                />
              </label>
            </div>
          </article>

          <div className="settings-form__footer">
            <button
              className="section-page__primary-action"
              type="submit"
              disabled={isSaving || isUserLoading}
            >
              {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
            {saveMessage ? <p className="settings-form__message">{saveMessage}</p> : null}
          </div>
        </form>
      </section>
    </DashboardSectionLayout>
  );
}

export default SettingsPage;
