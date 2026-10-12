import { useEffect } from 'react';
import styles from './ConfirmModal.module.css';

/**
 * ConfirmModal — confirmation dialog for destructive actions such as task deletion.
 */
function ConfirmModal({
  isOpen,
  title = 'Delete Task',
  taskTitle = '',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmLabel = 'Delete Task',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconWrapper} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 id="confirm-modal-title" className={styles.title}>{title}</h2>
        </div>

        <p className={styles.message}>
          {message}
          {taskTitle && (
            <>
              <br />
              <span className={styles.taskHighlight}>&ldquo;{taskTitle}&rdquo;</span>
            </>
          )}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={styles.cancelBtn}
            id="confirm-modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={styles.confirmBtn}
            id="confirm-modal-action-btn"
          >
            {isLoading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
