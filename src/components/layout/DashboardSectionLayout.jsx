import React, { useState } from 'react';
import AppShell from './AppShell';
import sidebarSections from '../../data/mockNavigation';

const user = {
  name: 'Davide',
  initial: 'D'
};

function DashboardSectionLayout({
  title,
  eyebrow = 'Study Tracker',
  taskPanelItems = [],
  children
}) {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  function handleOpenTaskPanel() {
    setIsTaskPanelOpen(true);
  }

  function handleCloseTaskPanel() {
    setIsTaskPanelOpen(false);
  }

  return (
    <AppShell
      sidebarSections={sidebarSections}
      user={user}
      topbarTitle={title}
      topbarEyebrow={eyebrow}
      isTaskPanelOpen={isTaskPanelOpen}
      onOpenTaskPanel={handleOpenTaskPanel}
      onCloseTaskPanel={handleCloseTaskPanel}
      taskPanelItems={taskPanelItems}
    >
      {children}
    </AppShell>
  );
}

export default DashboardSectionLayout;
