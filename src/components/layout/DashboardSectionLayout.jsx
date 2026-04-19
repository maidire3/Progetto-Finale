import React, { useState } from 'react';
import AppShell from './AppShell';
import sidebarSections from '../../data/mockNavigation';

const user = {
  name: 'Davide',
  initial: 'D'
};

const COMPACT_PANEL_WIDTH = 148;

function DashboardSectionLayout({ title, eyebrow = 'Study Tracker', children }) {
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false);
  const [taskPanelWidth, setTaskPanelWidth] = useState(COMPACT_PANEL_WIDTH);

  function handleToggleTaskPanel() {
    setIsTaskPanelExpanded((currentValue) => !currentValue);
  }

  return (
    <AppShell
      sidebarSections={sidebarSections}
      user={user}
      topbarTitle={title}
      topbarEyebrow={eyebrow}
      isTaskPanelExpanded={isTaskPanelExpanded}
      onToggleTaskPanel={handleToggleTaskPanel}
      taskPanelWidth={taskPanelWidth}
      onTaskPanelWidthChange={setTaskPanelWidth}
    >
      {children}
    </AppShell>
  );
}

export default DashboardSectionLayout;
