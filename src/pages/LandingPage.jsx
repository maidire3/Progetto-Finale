import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/landing.css';

function SubjectsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 6.5C5 5.67 5.67 5 6.5 5h11C18.33 5 19 5.67 19 6.5v11c0 .83-.67 1.5-1.5 1.5h-11C5.67 19 5 18.33 5 17.5v-11Z" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
      <path d="M8 15h6" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 17V11" />
      <path d="M12 17V7" />
      <path d="M18 17v-4" />
      <path d="M4.5 19h15" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4v2.5" />
      <path d="M12 17.5V20" />
      <path d="M4 12h2.5" />
      <path d="M17.5 12H20" />
    </svg>
  );
}

const features = [
  {
    icon: <SubjectsIcon />,
    title: 'Organizza le materie',
    description:
      'Tieni sotto controllo corsi, esami e obiettivi di studio in un unico spazio semplice da consultare.'
  },
  {
    icon: <ProgressIcon />,
    title: 'Monitora i progressi',
    description:
      'Visualizza a colpo di occhio quanto hai studiato e quanto manca per raggiungere il tuo obiettivo.'
  },
  {
    icon: <FocusIcon />,
    title: 'Studia con costanza',
    description:
      'Trasforma lo studio in una routine chiara grazie a sessioni pianificate e piccoli traguardi.'
  }
];

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page__glow landing-page__glow--one" />
      <div className="landing-page__glow landing-page__glow--two" />
      <div className="landing-page__grid" />

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
              <div className="hero-card__top">
                <span className="hero-card__label">Planner preview</span>
                <span className="hero-card__status">Oggi attivo</span>
              </div>

              <h2>Una dashboard che ti fa capire subito cosa fare.</h2>
              <p>
                Materie, task ed esami restano nello stesso flusso, con una vista
                semplice da consultare ogni giorno.
              </p>

              <div className="hero-card__stats">
                <div className="hero-card__stat">
                  <strong>3</strong>
                  <span>materie attive</span>
                </div>
                <div className="hero-card__stat">
                  <strong>68%</strong>
                  <span>avanzamento medio</span>
                </div>
              </div>

              <div className="hero-card__schedule">
                <div className="hero-card__schedule-item">
                  <span className="hero-card__schedule-time">09:00</span>
                  <div>
                    <p>Analisi 2</p>
                    <small>Ripasso limiti</small>
                  </div>
                </div>

                <div className="hero-card__schedule-item hero-card__schedule-item--secondary">
                  <span className="hero-card__schedule-time">15:00</span>
                  <div>
                    <p>Statistica</p>
                    <small>Quiz settimanale</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <p className="section-heading__eyebrow">Funzionalita principali</p>
            <h2>Tutto quello che serve per partire con un MVP chiaro.</h2>
          </div>

          <div className="features__grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <div className="cta-banner__content">
            <p className="section-heading__eyebrow">Pronto a partire</p>
            <h2>Inizia a costruire una routine di studio piu chiara e sostenibile.</h2>
            <p>
              Study Tracker nasce per aiutare studenti universitari a trasformare
              il caos del semestre in un piano semplice da seguire.
            </p>
          </div>

          <div className="cta-banner__actions">
            <Link className="button button--primary" to="/register">
              Crea il tuo account
            </Link>
            <Link className="button button--secondary" to="/login">
              Accedi alla dashboard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
