import React from 'react';
import UserBadge from './UserBadge';

function Topbar({ user, title = 'Dashboard', eyebrow = 'Study Tracker' }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">{eyebrow}</p>
        <h1 className="topbar__title">{title}</h1>
      </div>

      <UserBadge user={user} />
    </header>
  );
}

export default Topbar;
