import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/landing.css';

const features = [
  {
    title: 'Organizza le materie',
    description:
      'Tieni sotto controllo corsi, esami e obiettivi di studio in un unico spazio semplice da consultare.'
  },
  {
    title: 'Monitora i progressi',
    description:
      'Visualizza a colpo di occhio quanto hai studiato e quanto manca per raggiungere il tuo obiettivo.'
  },
  {
    title: 'Studia con costanza',
    description:
      'Trasforma lo studio in una routine chiara grazie a sessioni pianificate e piccoli traguardi.'
  }
];

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="hero__eyebrow">Study smarter, not harder</p>
            <h1>Study Tracker ti aiuta a organizzare lo studio universitario.</h1>
            <p className="hero__subtitle">
              Una web app semplice per gestire materie, monitorare i progressi e
              restare costante durante il semestre.
            </p>

            <div className="hero__actions">
              <Link className="button button--primary" to="/register">
                Inizia ora
              </Link>
              <Link className="button button--secondary" to="/login">
                Vai al login
              </Link>
            </div>
          </div>

          <div className="hero__panel">
            <div className="hero-card">
              <span className="hero-card__label">Panoramica rapida</span>
              <h2>3 materie attive</h2>
              <p>Avanzamento medio del 68% questa settimana.</p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-heading">
            <p className="section-heading__eyebrow">Funzionalita principali</p>
            <h2>Tutto quello che serve per partire con un MVP chiaro.</h2>
          </div>

          <div className="features__grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
