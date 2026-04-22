import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TaskPanel from '../dashboard/TaskPanel';

function AppShell({
  sidebarSections,
  user,
  topbarTitle,
  topbarEyebrow,
  isTaskPanelOpen,
  onOpenTaskPanel,
  onCloseTaskPanel,
  children
}) {
  const location = useLocation();
  const showTaskPanel = location.pathname === '/dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
    onCloseTaskPanel();
  }, [location.pathname, onCloseTaskPanel]);

  function handleOpenSidebar() {
    setIsSidebarOpen(true);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="dashboard-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        sections={sidebarSections}
        onClose={handleCloseSidebar}
      />

      <div className="dashboard-shell__workspace">
        <main className="dashboard-shell__main">
          <Topbar
            eyebrow={topbarEyebrow}
            title={topbarTitle}
            user={user}
            showTaskPanelControl={showTaskPanel}
            onOpenSidebar={handleOpenSidebar}
            onOpenTaskPanel={onOpenTaskPanel}
          />
          <div className="dashboard-shell__content">{children}</div>
        </main>

        {showTaskPanel ? (
          <TaskPanel
            isOpen={isTaskPanelOpen}
            onOpen={onOpenTaskPanel}
            onClose={onCloseTaskPanel}
          />
        ) : null}
      </div>
    </div>
  );
}

export default AppShell;
