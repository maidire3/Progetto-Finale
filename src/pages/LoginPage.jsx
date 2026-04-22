import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useStudyData } from '../context/StudyDataContext';
import { API_BASE_URL, saveAuthSession } from '../utils/auth';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCurrentUser } = useStudyData();
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
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

    if (!formValues.email || !formValues.password) {
      setFeedbackMessage('Inserisci email e password per continuare.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formValues.email.trim(),
          password: formValues.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login non riuscito.');
      }

      saveAuthSession({
        token: data.token,
        user: data.user
      });

      await refreshCurrentUser();
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (error) {
      setFeedbackMessage(error.message || 'Si e verificato un errore durante il login.');
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
          <h1>Accedi al tuo account</h1>
          <p>
            Inserisci email e password per entrare nella tua dashboard di
            studio.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Inserisci la password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form__error" role="alert" aria-live="polite">
            {feedbackMessage || 'Inserisci le credenziali del tuo account.'}
          </div>

          <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Accesso in corso...' : 'Login'}
          </button>
        </form>

        <p className="auth-card__footer">
          Non hai ancora un account? <Link to="/register">Registrati</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
