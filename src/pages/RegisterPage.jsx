import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { API_BASE_URL, saveAuthSession } from '../utils/auth';

function RegisterPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedbackMessage('');

    if (!formValues.firstName || !formValues.lastName || !formValues.email || !formValues.password) {
      setFeedbackMessage('Nome, cognome, email e password sono obbligatori.');
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setFeedbackMessage('Le password non coincidono.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          email: formValues.email.trim(),
          password: formValues.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrazione non riuscita.');
      }

      saveAuthSession({
        token: data.token,
        user: data.user
      });

      navigate('/dashboard');
    } catch (error) {
      setFeedbackMessage(error.message || 'Si e verificato un errore durante la registrazione.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <Link className="auth-card__back" to="/">
            Study Tracker
          </Link>
          <h1>Crea il tuo account</h1>
          <p>
            Inserisci i tuoi dati per iniziare a organizzare lo studio in modo
            piu semplice.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label htmlFor="firstName">Nome</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Inserisci il tuo nome"
              value={formValues.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="lastName">Cognome</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Inserisci il tuo cognome"
              value={formValues.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nome@universita.it"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Crea una password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="confirmPassword">Conferma password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Ripeti la password"
              value={formValues.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__error" role="alert" aria-live="polite">
            {feedbackMessage || 'Crea il tuo account Study Tracker.'}
          </div>

          <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>

        <p className="auth-card__footer">
          Hai gia un account? <Link to="/login">Accedi</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
