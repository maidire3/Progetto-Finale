import React from 'react';

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__logo" href="/">
        Study Tracker
      </a>

      <nav className="navbar__actions" aria-label="Navigazione principale">
        <a className="button button--ghost" href="/login">
          Login
        </a>
        <a className="button button--primary" href="/register">
          Register
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
