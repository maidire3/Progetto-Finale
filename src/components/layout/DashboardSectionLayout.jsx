import React, { useState } from 'react';
import AppShell from './AppShell';
import sidebarSections from '../../data/mockNavigation';
import { formatUserForBadge, getStoredUser } from '../../utils/auth';

function DashboardSectionLayout({
  title,
  eyebrow = 'Study Tracker',
  children
}) {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const user = formatUserForBadge(getStoredUser());

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
    >
      {children}
    </AppShell>
  );
}

export default DashboardSectionLayout;
