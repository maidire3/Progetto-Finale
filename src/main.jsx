import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/theme.css';

function resolveInitialTheme() {
  try {
    const rawSettings = window.localStorage.getItem('study-tracker-settings');

    if (!rawSettings) {
      return 'light';
    }

    const parsedSettings = JSON.parse(rawSettings);

    if (parsedSettings.theme === 'Scuro') {
      return 'dark';
    }

    if (parsedSettings.theme === 'Sistema' && window.matchMedia) {
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
