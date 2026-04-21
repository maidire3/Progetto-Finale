const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AUTH_TOKEN_KEY = 'studyTrackerToken';
const AUTH_USER_KEY = 'studyTrackerUser';

function saveAuthSession({ token, user }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function getStoredUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function formatUserForBadge(user) {
  if (!user) {
    return {
      name: 'Guest',
      initial: 'G'
    };
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return {
    name: fullName || user.email || 'Utente',
    initial: (user.firstName || user.email || 'U').charAt(0).toUpperCase()
  };
}

export {
  API_BASE_URL,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  saveAuthSession,
  getStoredUser,
  getStoredToken,
  clearAuthSession,
  formatUserForBadge
};
