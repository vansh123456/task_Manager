import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as taskApi from '../services/taskApi';
import StatusBadge from '../components/Badges/StatusBadge';
import PriorityBadge from '../components/Badges/PriorityBadge';
import ConfirmModal from '../components/UI/ConfirmModal';
import ErrorAlert from '../components/UI/ErrorAlert';
import { formatDate, formatDateTime, isOverdue } from '../utils/formatters';
import styles from './TaskDetailPage.module.css';

function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Quick status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // ID copy feedback
  const [isCopied, setIsCopied] = useState(false);

  // ── Load task ─────────────────────────────────────────────────────────────
  const loadTask = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await taskApi.getTaskById(id);
      setTask(data);
    } catch (err) {
      setFetchError(
        err.status === 404
          ? 'Task not found. The task may have been removed or does not exist.'
          : err.message || 'Failed to load task details'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  // ── Quick status change ───────────────────────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    if (!task || newStatus === task.status || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    setActionError(null);
    try {
      const updated = await taskApi.updateTask(task.id, { status: newStatus });
      setTask(updated);
    } catch (err) {
      setActionError(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ── Delete handling ───────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!task) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await taskApi.deleteTask(task.id);
      navigate('/', {
        replace: true,
        state: { notification: `Task "${task.title}" was deleted.` },
      });
    } catch (err) {
      setActionError(err.message || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  // ── Copy ID to clipboard ──────────────────────────────────────────────────
  const handleCopyId = async () => {
    if (!task?.id) return;
    try {
      await navigator.clipboard.writeText(task.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`${styles.container} animate-fadeIn`}>
        <div style={{ background: 'var(--bg-surface)', padding: '48px 32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading task details...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (fetchError || !task) {
    return (
      <div className={`${styles.container} animate-fadeIn`}>
        <ErrorAlert
          title="Cannot load task"
          message={fetchError || 'Task not found.'}
          onRetry={loadTask}
        />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              padding: '10px 20px',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      {/* Back Link */}
      <Link to="/" className={styles.backLink} id="task-detail-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      {/* Action Error if any */}
      {actionError && (
        <div style={{ marginBottom: '16px' }}>
          <ErrorAlert message={actionError} />
        </div>
      )}

      {/* Main Details Card */}
      <article className={styles.card}>
        <header className={styles.header}>
          {/* Badges + Quick Status Selector */}
          <div className={styles.topBar}>
            <div className={styles.badgesGroup}>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>

            <div className={styles.statusDropdownWrapper}>
              <label htmlFor="quick-status-select">Status:</label>
              <select
                id="quick-status-select"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className={styles.statusSelect}
                aria-label="Change task status"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Title Area */}
          <div className={styles.titleArea}>
            <h1 className={styles.title}>{task.title}</h1>
          </div>

          {/* Action Toolbar */}
          <div className={styles.actionsToolbar}>
            <Link
              to={`/tasks/${task.id}/edit`}
              className={styles.editBtn}
              id="task-detail-edit-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Task</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className={styles.deleteBtn}
              id="task-detail-delete-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* Description Section */}
        <section className={styles.section} aria-label="Task description">
          <span className={styles.sectionLabel}>Description</span>
          <div className={styles.descriptionBox}>{task.description}</div>
        </section>

        {/* Metadata Grid */}
        <section className={styles.metaGrid} aria-label="Task details and timestamps">
          {/* Due Date */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Due Date</span>
            </span>
            <span className={`${styles.metaValue} ${isTaskOverdue ? styles.overdueHighlight : ''}`}>
              {task.dueDate ? (
                <>
                  <span>{formatDate(task.dueDate)}</span>
                  {isTaskOverdue && <span>(Overdue)</span>}
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No due date specified</span>
              )}
            </span>
          </div>

          {/* Task ID */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Task ID</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <code className={styles.idCode} title={task.id}>{task.id}</code>
              <button
                type="button"
                onClick={handleCopyId}
                className={styles.copyBtn}
                title="Copy Task ID"
                aria-label="Copy Task ID"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Created At */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Created At</span>
            </span>
            <span className={styles.metaValue}>{formatDateTime(task.createdAt)}</span>
          </div>

          {/* Last Updated At */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6" />
                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Last Updated</span>
            </span>
            <span className={styles.metaValue}>{formatDateTime(task.updatedAt)}</span>
          </div>
        </section>
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Task"
        taskTitle={task.title}
        message="Are you sure you want to permanently delete this task? This cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

export default TaskDetailPage;
