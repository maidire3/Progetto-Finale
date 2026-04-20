import React from 'react';
import AppRouter from './router/AppRouter';
import { StudyDataProvider } from './context/StudyDataContext';

function App() {
  return (
    <StudyDataProvider>
      <AppRouter />
    </StudyDataProvider>
  );
}

export default App;
