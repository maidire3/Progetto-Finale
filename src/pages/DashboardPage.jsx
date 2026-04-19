import React from 'react';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import DashboardSectionLayout from '../components/layout/DashboardSectionLayout';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

function DashboardPage() {
  return (
    <DashboardSectionLayout title="Dashboard" eyebrow="Study Tracker">
      <section className="dashboard-placeholder">
        <div className="dashboard-placeholder__intro">
          <p className="dashboard-placeholder__eyebrow">Weekly planner</p>
          <h2>Weekly Calendar</h2>
          <p>
            Una vista settimanale semplice per organizzare sessioni di studio,
            task e blocchi di revisione.
          </p>
        </div>

        <WeeklyCalendar />
      </section>
    </DashboardSectionLayout>
  );
}

export default DashboardPage;
