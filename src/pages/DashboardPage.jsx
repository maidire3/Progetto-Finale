import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import sidebarSections from '../data/mockNavigation';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/topbar.css';
import '../styles/task-panel.css';

const user = {
  name: 'Davide',
  initial: 'D'
};

const COMPACT_PANEL_WIDTH = 148;

function DashboardPage() {
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false);
  const [taskPanelWidth, setTaskPanelWidth] = useState(COMPACT_PANEL_WIDTH);

  function handleToggleTaskPanel() {
    setIsTaskPanelExpanded((currentValue) => !currentValue);
  }

  return (
    <AppShell
      sidebarSections={sidebarSections}
      user={user}
      isTaskPanelExpanded={isTaskPanelExpanded}
      onToggleTaskPanel={handleToggleTaskPanel}
      taskPanelWidth={taskPanelWidth}
      onTaskPanelWidthChange={setTaskPanelWidth}
    >
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
    </AppShell>
  );
}

export default DashboardPage;
