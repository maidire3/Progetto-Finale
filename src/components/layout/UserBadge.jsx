import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function UserBadge({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!badgeRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleToggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="user-badge-wrapper" ref={badgeRef}>
      <button
        aria-expanded={isMenuOpen}
        className={`user-badge ${isMenuOpen ? 'user-badge--open' : ''}`}
        type="button"
        onClick={handleToggleMenu}
      >
        <span className="user-badge__avatar" aria-hidden="true">
          {user.initial}
        </span>

        <span className="user-badge__info">
          <span className="user-badge__name">{user.name}</span>
          <span className="user-badge__role">Studente</span>
        </span>

        <span className="user-badge__chevron" aria-hidden="true">
          v
        </span>
      </button>

      {isMenuOpen ? (
        <div className="user-menu" role="menu">
          <Link
            className="user-menu__item"
            role="menuitem"
            to="/settings#profile"
            onClick={handleCloseMenu}
          >
            Profilo
          </Link>
          <Link
            className="user-menu__item"
            role="menuitem"
            to="/settings"
            onClick={handleCloseMenu}
          >
            Impostazioni
          </Link>
          <Link
            className="user-menu__item user-menu__item--danger"
            role="menuitem"
            to="/login"
            onClick={handleCloseMenu}
          >
            Logout
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default UserBadge;
