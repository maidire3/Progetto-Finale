import React, { useState } from 'react';
import { useStudyData } from '../../context/StudyDataContext';
import AppShell from './AppShell';
import sidebarSections from '../../data/mockNavigation';
import { formatUserForBadge } from '../../utils/auth';

function DashboardSectionLayout({
  title,
  eyebrow = 'Study Tracker',
  children
}) {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const { currentUser } = useStudyData();
  const user = formatUserForBadge(currentUser);

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
