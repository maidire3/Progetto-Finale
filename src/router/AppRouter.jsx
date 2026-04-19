import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import SearchPage from '../pages/SearchPage';
import SubjectsPage from '../pages/SubjectsPage';
import TasksPage from '../pages/TasksPage';
import ExamsPage from '../pages/ExamsPage';
import NotesPage from '../pages/NotesPage';
import SettingsPage from '../pages/SettingsPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
