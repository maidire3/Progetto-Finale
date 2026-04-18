import React from 'react';
import UserBadge from './UserBadge';

function Topbar({ user }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Study Tracker</p>
        <h1 className="topbar__title">Dashboard</h1>
      </div>

      <UserBadge user={user} />
    </header>
  );
}

export default Topbar;
