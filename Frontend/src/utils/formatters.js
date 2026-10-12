/**
 * formatters.js — Shared display helpers.
 * Keep presentation transformations here, out of components.
 */

// ── Date formatting ───────────────────────────────────────────────────────────

/**
 * Format an ISO timestamp string for display (e.g. "Oct 12, 2026, 10:30 PM").
 * Returns '—' for null/undefined values.
 * @param {string|null|undefined} isoString
 * @returns {string}
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};

/**
 * Format a YYYY-MM-DD date string for display (e.g. "Dec 31, 2026").
 * Returns '—' for null/undefined values.
 * @param {string|null|undefined} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  // Parse as local date (append T00:00 to avoid UTC offset shifting the day)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dateString}T00:00`));
};

/**
 * Return true if the given YYYY-MM-DD date is in the past.
 * @param {string|null|undefined} dateString
 * @returns {boolean}
 */
export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${dateString}T00:00`) < today;
};

// ── Label helpers ─────────────────────────────────────────────────────────────

/** Human-readable label for a task status value. */
export const statusLabel = (status) => {
  const map = {
    pending:     'Pending',
    in_progress: 'In Progress',
    completed:   'Completed',
  };
  return map[status] ?? status;
};

/** Human-readable label for a task priority value. */
export const priorityLabel = (priority) => {
  const map = { low: 'Low', medium: 'Medium', high: 'High' };
  return map[priority] ?? priority;
};
