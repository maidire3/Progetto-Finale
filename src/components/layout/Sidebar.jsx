import React from 'react';

function Sidebar({ sections }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">S</span>
        <div>
          <p className="sidebar__brand-name">Study Tracker</p>
          <p className="sidebar__brand-caption">Desktop dashboard</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        {sections.map((section) => (
          <div className="sidebar__section" key={section.title}>
            <p className="sidebar__section-title">{section.title}</p>

            <ul className="sidebar__list">
              {section.items.map((item) => (
                <li key={item}>
                  <button
                    className={`sidebar__item ${
                      item === 'Dashboard' ? 'sidebar__item--active' : ''
                    }`}
                    type="button"
                  >
                    {item}
                  </button>
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
