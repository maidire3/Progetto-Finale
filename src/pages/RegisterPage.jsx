import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

function RegisterPage() {
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

        <form className="auth-form">
          <div className="auth-form__group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Inserisci il tuo nome"
            />
          </div>

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
              placeholder="Crea una password"
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="confirmPassword">Conferma password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Ripeti la password"
            />
          </div>

          <div className="auth-form__error" role="alert" aria-live="polite">
            Nessun messaggio al momento.
          </div>

          <button className="auth-form__submit" type="submit">
            Registrati
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
