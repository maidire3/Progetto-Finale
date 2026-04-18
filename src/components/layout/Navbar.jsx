import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <Link className="navbar__logo" to="/">
        Study Tracker
      </Link>

      <nav className="navbar__actions" aria-label="Navigazione principale">
        <Link className="button button--ghost" to="/login">
          Login
        </Link>
        <Link className="button button--primary" to="/register">
          Register
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
