/**
 * Shared constants for task fields.
 * Single source of truth — used by the service layer, validators, and controllers.
 */

export const TASK_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

export const TASK_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

/** Ordered for comparison (low < medium < high) */
export const PRIORITY_ORDER = Object.freeze({
  [TASK_PRIORITY.LOW]: 1,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.HIGH]: 3,
});

export const ALLOWED_STATUSES = Object.values(TASK_STATUS);
export const ALLOWED_PRIORITIES = Object.values(TASK_PRIORITY);

export const DEFAULT_STATUS = TASK_STATUS.PENDING;
export const DEFAULT_PRIORITY = TASK_PRIORITY.LOW;
