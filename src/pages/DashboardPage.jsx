import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
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
          <h2>Calendar Area</h2>
          <p>
            Qui costruiremo il calendario settimanale con topbar, giorni,
            colonna oraria e task mock.
          </p>
        </div>

        <div className="dashboard-placeholder__canvas">
          <div className="dashboard-placeholder__toolbar">
            <span>Calendar toolbar</span>
            <span>Week range</span>
            <span>Today</span>
          </div>

          <div className="dashboard-placeholder__grid">
            <div className="dashboard-placeholder__column dashboard-placeholder__column--time">
              Time
            </div>
            <div className="dashboard-placeholder__column">Day 1</div>
            <div className="dashboard-placeholder__column">Day 2</div>
            <div className="dashboard-placeholder__column">Day 3</div>
            <div className="dashboard-placeholder__column">Day 4</div>
            <div className="dashboard-placeholder__column">Day 5</div>
            <div className="dashboard-placeholder__column">Day 6</div>
            <div className="dashboard-placeholder__column">Day 7</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default DashboardPage;
