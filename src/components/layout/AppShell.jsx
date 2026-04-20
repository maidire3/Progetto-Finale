import React from 'react';
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
  taskPanelItems,
  children
}) {
  const location = useLocation();
  const showTaskPanel = location.pathname === '/dashboard';

  return (
    <div className="dashboard-shell">
      <Sidebar sections={sidebarSections} />

      <div className="dashboard-shell__workspace">
        <main className="dashboard-shell__main">
          <Topbar user={user} title={topbarTitle} eyebrow={topbarEyebrow} />
          <div className="dashboard-shell__content">{children}</div>
        </main>

        {showTaskPanel ? (
          <TaskPanel
            isOpen={isTaskPanelOpen}
            onOpen={onOpenTaskPanel}
            onClose={onCloseTaskPanel}
            items={taskPanelItems}
          />
        ) : null}
      </div>
    </div>
  );
}

export default AppShell;
