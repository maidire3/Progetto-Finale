import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Sidebar({ sections }) {
  return (
    <aside className="sidebar">
      <Link className="sidebar__brand" to="/dashboard">
        <span className="sidebar__brand-mark">S</span>
        <div>
          <p className="sidebar__brand-name">Study Tracker</p>
          <p className="sidebar__brand-caption">Desktop dashboard</p>
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
  );
}

export default Sidebar;
