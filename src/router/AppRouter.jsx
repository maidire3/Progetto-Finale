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
import NoteDetailPage from '../pages/NoteDetailPage';
import SettingsPage from '../pages/SettingsPage';
import { ProtectedRoute, PublicOnlyRoute } from './RouteGuards';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
