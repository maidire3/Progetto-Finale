import React from 'react';
import { MoreVertical } from 'lucide-react';
import UserBadge from './UserBadge';

function Topbar({
  user,
  title = 'Dashboard',
  eyebrow = 'Study Tracker',
  showTaskPanelControl = false,
  onOpenSidebar,
  onOpenTaskPanel
}) {
  return (
    <header className="topbar">
      <div className="topbar__mobile-left">
        <button
          className="topbar__icon-button topbar__icon-button--menu"
          type="button"
          aria-label="Apri navigazione"
          onClick={onOpenSidebar}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="topbar__title-group">
          <p className="topbar__eyebrow">{eyebrow}</p>
          <h1 className="topbar__title">{title}</h1>
        </div>
      </div>

      <div className="topbar__actions">
        <UserBadge user={user} />

        {showTaskPanelControl ? (
          <button
            className="topbar__icon-button topbar__icon-button--task"
            type="button"
            aria-label="Apri task panel"
            onClick={onOpenTaskPanel}
          >
            <MoreVertical aria-hidden="true" className="topbar__icon-svg" size={18} />
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default Topbar;
