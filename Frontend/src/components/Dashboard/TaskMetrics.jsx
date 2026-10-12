import styles from './TaskMetrics.module.css';

/**
 * TaskMetrics — presents statistical counters for tasks:
 * Total, Pending, In Progress, Completed.
 * Clicking a card toggles filtering by that status!
 */
function TaskMetrics({ tasks = [], activeFilter = 'all', onSelectFilter }) {
  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const items = [
    {
      id: 'all',
      label: 'Total Tasks',
      value: counts.total,
      iconClass: styles.totalIcon,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      id: 'pending',
      label: 'Pending',
      value: counts.pending,
      iconClass: styles.pendingIcon,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: counts.in_progress,
      iconClass: styles.progressIcon,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      ),
    },
    {
      id: 'completed',
      label: 'Completed',
      value: counts.completed,
      iconClass: styles.completedIcon,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.metricsGrid} aria-label="Task statistics">
      {items.map((item) => {
        const isActive = activeFilter === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.metricCard} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectFilter(item.id)}
            id={`metric-filter-${item.id}`}
            aria-pressed={isActive}
          >
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>{item.label}</span>
              <span className={styles.metricValue}>{item.value}</span>
            </div>
            <div className={`${styles.metricIcon} ${item.iconClass}`}>
              {item.icon}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default TaskMetrics;
