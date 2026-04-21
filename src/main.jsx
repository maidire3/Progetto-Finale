import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getStoredThemePreference } from './utils/auth';
import './styles/globals.css';
import './styles/theme.css';

function resolveInitialTheme() {
  try {
    const storedTheme = getStoredThemePreference();

    if (storedTheme === 'Scuro') {
      return 'dark';
    }

    if (storedTheme === 'Sistema' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (error) {
    return 'light';
  }

  return 'light';
}

document.body.dataset.theme = resolveInitialTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
