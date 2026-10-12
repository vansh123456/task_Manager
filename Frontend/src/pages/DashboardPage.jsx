import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as taskApi from '../services/taskApi';
import TaskCard from '../components/TaskCard/TaskCard';
import TaskMetrics from '../components/Dashboard/TaskMetrics';
import TaskFilters from '../components/Dashboard/TaskFilters';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import EmptyState from '../components/UI/EmptyState';
import ErrorAlert from '../components/UI/ErrorAlert';
import ConfirmModal from '../components/UI/ConfirmModal';
import styles from './DashboardPage.module.css';

/**
 * Priority rank weights for sorting
 */
const PRIORITY_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1,
};

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Deletion modal state
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const location = useLocation();

  // Pick up notification from navigation (e.g. redirected after create/edit)
  useEffect(() => {
    if (location.state?.notification) {
      setFeedbackMessage(location.state.notification);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ── Fetch tasks ───────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAllTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-dismiss feedback message after 4s
  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => setFeedbackMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  // ── Delete handling ───────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setFeedbackMessage(`Task "${deletingTask.title}" was successfully deleted.`);
      setDeletingTask(null);
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Filter reset ──────────────────────────────────────────────────────────
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('createdAt-desc');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'createdAt-desc';

  // Quick filter toggle from metric cards
  const handleMetricFilterSelect = (filterId) => {
    setStatusFilter(statusFilter === filterId ? 'all' : filterId);
  };

  // ── Computed filtered and sorted task list ─────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'createdAt-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'dueDate-asc': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case 'priority-desc': {
          const weightA = PRIORITY_WEIGHT[a.priority] || 0;
          const weightB = PRIORITY_WEIGHT[b.priority] || 0;
          return weightB - weightA;
        }
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Task Dashboard</h1>
          <p className={styles.subtitle}>
            Organize, track progress, and prioritize your daily deliverables.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={fetchTasks}
            disabled={isLoading}
            className={styles.refreshBtn}
            id="dashboard-refresh-btn"
            title="Refresh tasks"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Refresh</span>
          </button>

          <Link to="/tasks/new" className={styles.createBtn} id="dashboard-new-task-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Task</span>
          </Link>
        </div>
      </header>

      {/* Success / Feedback Toast */}
      {feedbackMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          <span>{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className={styles.toastClose}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchTasks}
        />
      )}

      {/* Metrics Overview Cards */}
      <TaskMetrics
        tasks={tasks}
        activeFilter={statusFilter}
        onSelectFilter={handleMetricFilterSelect}
      />

      {/* Filters and Search Bar */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content Rendering: Loading, Empty, or Grid */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : tasks.length === 0 ? (
        <EmptyState isFiltered={false} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState isFiltered={true} onResetFilters={handleResetFilters} />
      ) : (
        <>
          <div className={styles.resultsMeta}>
            <span>
              Showing {filteredTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <main className={styles.taskGrid} aria-label="Tasks list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={(t) => setDeletingTask(t)}
              />
            ))}
          </main>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Delete Task"
        taskTitle={deletingTask?.title}
        message="Are you sure you want to permanently delete this task?"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}

export default DashboardPage;
