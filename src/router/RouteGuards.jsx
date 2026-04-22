import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStudyData } from '../context/StudyDataContext';
import { getStoredToken } from '../utils/auth';
import '../styles/auth.css';

function RouteLoadingScreen() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <h1>Caricamento sessione</h1>
          <p>Stiamo verificando il tuo account prima di entrare nell'app.</p>
        </div>
      </section>
    </main>
  );
}

function ProtectedRoute() {
  const { currentUser, isUserLoading } = useStudyData();
  const location = useLocation();
  const token = getStoredToken();

  if (isUserLoading && token) {
    return <RouteLoadingScreen />;
  }

  if (!token || !currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { currentUser, isUserLoading } = useStudyData();
  const token = getStoredToken();

  if (isUserLoading && token) {
    return <RouteLoadingScreen />;
  }

  if (token && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute, PublicOnlyRoute };
