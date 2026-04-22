import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import sidebarLogo from '../../assets/Logo.png';

function Sidebar({ sections, isOpen = false, onClose }) {
  return (
    <>
      <div
        className={`sidebar__overlay ${isOpen ? 'sidebar__overlay--visible' : ''}`}
        role="presentation"
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <Link className="sidebar__brand" to="/dashboard">
        <img
          className="sidebar__brand-mark"
          src={sidebarLogo}
          alt="Study Tracker logo"
        />
        <div>
          <p className="sidebar__brand-name">Study Tracker</p>
          <p className="sidebar__brand-caption">Dashboard</p>
        </div>
      </Link>

      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        {sections.map((section) => (
          <div className="sidebar__section" key={section.title}>
            <p className="sidebar__section-title">{section.title}</p>

            <ul className="sidebar__list">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive }) =>
                      `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                    }
                    to={item.path}
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      </aside>
    </>
  );
}

export default Sidebar;
