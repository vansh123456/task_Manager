import styles from './ErrorAlert.module.css';

/**
 * ErrorAlert component displays operational failure messages with an optional retry callback.
 */
function ErrorAlert({ title = 'Something went wrong', message, onRetry }) {
  if (!message) return null;

  return (
    <div className={`${styles.banner} animate-fadeIn`} role="alert" aria-live="polite">
      <div className={styles.content}>
        <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.message}>{message}</div>
        </div>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retryBtn} id="error-retry-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
