import { Link } from 'react-router-dom';
import StatusBadge from '../Badges/StatusBadge';
import PriorityBadge from '../Badges/PriorityBadge';
import { formatDate, isOverdue } from '../../utils/formatters';
import styles from './TaskCard.module.css';

/**
 * TaskCard — renders a single task card in the dashboard grid.
 */
function TaskCard({ task, onDelete }) {
  const { id, title, description, status, priority, dueDate, createdAt } = task;
  const isTaskOverdue = dueDate && isOverdue(dueDate) && status !== 'completed';

  return (
    <article className={`${styles.card} animate-fadeIn`} data-testid={`task-card-${id}`}>
      {/* Top Header: Status & Priority Badges */}
      <div className={styles.cardTop}>
        <div className={styles.badgesGroup}>
          <StatusBadge status={status} />
          <PriorityBadge priority={priority} />
        </div>
      </div>

      {/* Task Title */}
      <h3 className={styles.cardTitle}>
        <Link to={`/tasks/${id}`} className={styles.cardTitleLink} title={title}>
          {title}
        </Link>
      </h3>

      {/* Task Description snippet */}
      <p className={styles.cardDescription} title={description}>
        {description}
      </p>

      {/* Meta: Due Date & Created Date */}
      <div className={styles.metaGroup}>
        {dueDate ? (
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Due:</span>
            </span>
            <span className={isTaskOverdue ? styles.overdueTag : undefined}>
              {formatDate(dueDate)}
              {isTaskOverdue && ' (Overdue)'}
            </span>
          </div>
        ) : (
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span>No due date</span>
            </span>
          </div>
        )}

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <span>Created:</span>
          </span>
          <span>{formatDate(createdAt?.split('T')[0])}</span>
        </div>
      </div>

      {/* Actions footer */}
      <footer className={styles.actions}>
        <div className={styles.primaryActions}>
          <Link
            to={`/tasks/${id}`}
            className={styles.actionBtn}
            id={`task-view-btn-${id}`}
            aria-label={`View details for ${title}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>View</span>
          </Link>

          <Link
            to={`/tasks/${id}/edit`}
            className={styles.actionBtn}
            id={`task-edit-btn-${id}`}
            aria-label={`Edit ${title}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className={styles.deleteBtn}
          id={`task-delete-btn-${id}`}
          aria-label={`Delete task ${title}`}
          title="Delete task"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </footer>
    </article>
  );
}

export default TaskCard;
