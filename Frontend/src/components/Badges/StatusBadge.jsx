import { statusLabel } from '../../utils/formatters';
import styles from './StatusBadge.module.css';

/**
 * StatusBadge component displays a pill badge representing task status.
 * Supports: 'pending', 'in_progress', 'completed'
 */
function StatusBadge({ status = 'pending' }) {
  const normalized = (status || 'pending').toLowerCase();
  const variantClass = styles[normalized] || styles.pending;

  return (
    <span className={`${styles.badge} ${variantClass}`} data-testid={`status-badge-${normalized}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{statusLabel(normalized)}</span>
    </span>
  );
}

export default StatusBadge;
