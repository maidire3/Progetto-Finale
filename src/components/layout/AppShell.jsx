import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TaskPanel from '../dashboard/TaskPanel';

function AppShell({
  sidebarSections,
  user,
  topbarTitle,
  topbarEyebrow,
  isTaskPanelExpanded,
  onToggleTaskPanel,
  taskPanelWidth,
  onTaskPanelWidthChange,
  children
}) {
  return (
    <div
      className="dashboard-shell"
      style={{ '--task-panel-width': `${taskPanelWidth}px` }}
    >
      <Sidebar sections={sidebarSections} />

      <div className="dashboard-shell__workspace">
        <main className="dashboard-shell__main">
          <Topbar user={user} title={topbarTitle} eyebrow={topbarEyebrow} />
          <div className="dashboard-shell__content">{children}</div>
        </main>

        <TaskPanel
          isExpanded={isTaskPanelExpanded}
          onToggle={onToggleTaskPanel}
          onWidthChange={onTaskPanelWidthChange}
        />
      </div>
    </div>
  );
}

export default AppShell;
