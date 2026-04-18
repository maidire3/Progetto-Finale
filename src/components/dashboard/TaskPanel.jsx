import React, { useEffect, useRef, useState } from 'react';

const compactTasks = [
  'Ripasso Analisi 2',
  'Terminare appunti di Fisica',
  'Preparare quiz di Statistica'
];

const COMPACT_WIDTH = 148;
const MIN_EXPANDED_WIDTH = 320;
const MAX_EXPANDED_WIDTH = 520;
const DEFAULT_EXPANDED_WIDTH = 400;

function clampWidth(width) {
  return Math.min(MAX_EXPANDED_WIDTH, Math.max(MIN_EXPANDED_WIDTH, width));
}

function TaskPanel({ isExpanded, onToggle, onWidthChange }) {
  const [expandedWidth, setExpandedWidth] = useState(DEFAULT_EXPANDED_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const resizeStateRef = useRef({
    startX: 0,
    startWidth: DEFAULT_EXPANDED_WIDTH
  });

  useEffect(() => {
    if (typeof onWidthChange === 'function') {
      onWidthChange(isExpanded ? expandedWidth : COMPACT_WIDTH);
    }
  }, [expandedWidth, isExpanded, onWidthChange]);

  useEffect(() => {
    if (!isResizing) {
      return undefined;
    }

    function handleMouseMove(event) {
      const deltaX = resizeStateRef.current.startX - event.clientX;
      const nextWidth = clampWidth(resizeStateRef.current.startWidth + deltaX);
      setExpandedWidth(nextWidth);
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  function handleResizeStart(event) {
    if (!isExpanded) {
      return;
    }

    resizeStateRef.current = {
      startX: event.clientX,
      startWidth: expandedWidth
    };

    setIsResizing(true);
  }

  const panelWidth = isExpanded ? expandedWidth : COMPACT_WIDTH;

  return (
    <aside
      ref={panelRef}
      className={`task-panel ${isExpanded ? 'task-panel--expanded' : ''} ${
        isResizing ? 'task-panel--resizing' : ''
      }`}
      aria-label="Task panel"
      style={{
        width: `${panelWidth}px`,
        minWidth: isExpanded ? `${MIN_EXPANDED_WIDTH}px` : `${COMPACT_WIDTH}px`,
        maxWidth: isExpanded ? `${MAX_EXPANDED_WIDTH}px` : `${COMPACT_WIDTH}px`
      }}
    >
      <button
        className={`task-panel__resize-handle ${
          isExpanded ? 'task-panel__resize-handle--active' : ''
        }`}
        type="button"
        aria-label="Ridimensiona task panel"
        onMouseDown={handleResizeStart}
      />

      <div className="task-panel__header">
        <div>
          <p className="task-panel__eyebrow">Focus</p>
          <h2>Task list</h2>
        </div>

        <button className="task-panel__toggle" type="button" onClick={onToggle}>
          {isExpanded ? 'Riduci' : 'Espandi'}
        </button>
      </div>

      {isExpanded ? (
        <div className="task-panel__body">
          <p className="task-panel__description">
            Vista espansa del pannello task. Qui inseriremo task piu leggibili,
            dettagli e stato di avanzamento.
          </p>

          <ul className="task-panel__list">
            {compactTasks.map((task) => (
              <li className="task-panel__item" key={task}>
                <span className="task-panel__dot" aria-hidden="true" />
                <div>
                  <p className="task-panel__item-title">{task}</p>
                  <p className="task-panel__item-meta">Oggi - Priorita media</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export default TaskPanel;
