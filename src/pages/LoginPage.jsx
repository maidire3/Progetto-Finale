import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

function LoginPage() {
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

        <form className="auth-form">
          <div className="auth-form__group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nome@universita.it"
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Inserisci la password"
            />
          </div>

          <div className="auth-form__error" role="alert" aria-live="polite">
            Nessun errore al momento.
          </div>

          <button className="auth-form__submit" type="submit">
            Login
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
