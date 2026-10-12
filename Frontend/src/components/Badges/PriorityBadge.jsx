import { priorityLabel } from '../../utils/formatters';
import styles from './PriorityBadge.module.css';

/**
 * PriorityBadge component displays a pill badge representing task priority.
 * Supports: 'low', 'medium', 'high'
 */
function PriorityBadge({ priority = 'low' }) {
  const normalized = (priority || 'low').toLowerCase();
  const variantClass = styles[normalized] || styles.low;

  // Visual arrow/indicator for priority level
  const renderIndicator = () => {
    if (normalized === 'high') {
      return (
        <svg className={styles.icon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      );
    }
    if (normalized === 'medium') {
      return (
        <svg className={styles.icon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    }
    return (
      <svg className={styles.icon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  };

  return (
    <span className={`${styles.badge} ${variantClass}`} data-testid={`priority-badge-${normalized}`}>
      {renderIndicator()}
      <span>{priorityLabel(normalized)}</span>
    </span>
  );
}

export default PriorityBadge;
