import React from 'react';

function UserBadge({ user }) {
  return (
    <button className="user-badge" type="button">
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
  );
}

export default UserBadge;
