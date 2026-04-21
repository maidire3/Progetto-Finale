import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <p className="footer__title">Study Tracker</p>
        <p className="footer__description">
          Una web app frontend pensata per aiutare gli studenti universitari a
          organizzare studio, task ed esami in modo piu chiaro.
        </p>
      </div>

      <div className="footer__links">
        <p className="footer__label">Link rapidi</p>
        <nav aria-label="Link rapidi footer">
          <Link to="/#features">Features</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>

      <div className="footer__note">
        <p className="footer__label">Project note</p>
        <p>Progetto frontend React per studenti universitari, costruito come final project.</p>
      </div>
    </footer>
  );
}

export default Footer;
