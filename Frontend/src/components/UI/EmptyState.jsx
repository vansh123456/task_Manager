import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

/**
 * EmptyState component displays empty notifications when no tasks exist or none match filter criteria.
 */
function EmptyState({ isFiltered = false, onResetFilters }) {
  if (isFiltered) {
    return (
      <div className={`${styles.container} animate-fadeIn`}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className={styles.title}>No tasks matched your filters</h3>
        <p className={styles.description}>
          Try adjusting your search query, status, or priority filters to find what you are looking for.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.secondaryBtn}
            id="empty-state-reset-filters-btn"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <div className={styles.iconWrapper} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className={styles.title}>No tasks yet</h3>
      <p className={styles.description}>
        Your task board is looking clean! Get started by organizing and tracking your first task now.
      </p>
      <Link to="/tasks/new" className={styles.primaryBtn} id="empty-state-new-task-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Create your first task</span>
      </Link>
    </div>
  );
}

export default EmptyState;
