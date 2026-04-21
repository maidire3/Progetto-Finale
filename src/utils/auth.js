const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AUTH_TOKEN_KEY = 'studyTrackerToken';
const AUTH_USER_KEY = 'studyTrackerUser';
const PREFERENCES_KEY = 'studyTrackerPreferences';

function saveAuthSession({ token, user }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function saveStoredUser(user) {
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

function getAuthHeaders() {
  const token = getStoredToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

function getStoredThemePreference() {
  const rawPreferences = localStorage.getItem(PREFERENCES_KEY);

  if (!rawPreferences) {
    return 'Scuro';
  }

  try {
    const parsedPreferences = JSON.parse(rawPreferences);
    return parsedPreferences.theme || 'Scuro';
  } catch (error) {
    localStorage.removeItem(PREFERENCES_KEY);
    return 'Scuro';
  }
}

function saveThemePreference(theme) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ theme }));
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
  PREFERENCES_KEY,
  saveAuthSession,
  saveStoredUser,
  getStoredUser,
  getStoredToken,
  clearAuthSession,
  getAuthHeaders,
  getStoredThemePreference,
  saveThemePreference,
  formatUserForBadge
};
