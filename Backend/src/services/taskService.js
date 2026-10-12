/**
 * Task service — all business logic for task CRUD operations.
 *
 * This layer is the only place that knows about the task data model.
 * Controllers call these functions and handle HTTP concerns separately.
 * The store is the only persistence mechanism (in-memory, resets on restart).
 *
 * @typedef {Object} Task
 * @property {string}      id          - UUID v4
 * @property {string}      title       - Non-empty string
 * @property {string}      description - Non-empty string
 * @property {string}      status      - 'pending' | 'in_progress' | 'completed'
 * @property {string}      priority    - 'low' | 'medium' | 'high'
 * @property {string|null} dueDate     - ISO 8601 date string, or null
 * @property {string}      createdAt   - ISO 8601 timestamp (set on creation, never changed)
 * @property {string}      updatedAt   - ISO 8601 timestamp (updated on every mutation)
 */

import * as store from './taskStore.js';
import { randomUUID } from 'node:crypto';
import {
  DEFAULT_STATUS,
  DEFAULT_PRIORITY,
  ALLOWED_STATUSES,
  ALLOWED_PRIORITIES,
} from '../utils/constants.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse and normalise a raw dueDate value.
 * Accepts an ISO date string or anything that produces a valid Date.
 * Returns a normalised ISO string (date-only: YYYY-MM-DD) or null.
 *
 * @param {*} raw
 * @returns {string|null}
 */
const normaliseDueDate = (raw) => {
  if (raw === undefined || raw === null || raw === '') return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  // Store as YYYY-MM-DD for consistency; time zone is caller's responsibility.
  return d.toISOString().split('T')[0];
};

// ── Public service functions ──────────────────────────────────────────────────

/**
 * Return all tasks.
 * @returns {Task[]}
 */
export const getAllTasks = () => store.getAll();

/**
 * Return a single task by id, or null if not found.
 * @param {string} id
 * @returns {Task|null}
 */
export const getTaskById = (id) => store.findById(id) ?? null;

/**
 * Create a new task.
 *
 * Applies defaults for status and priority when not supplied.
 * Sets createdAt and updatedAt to the current UTC time.
 *
 * @param {Object} data - Raw input (expected to be pre-validated by middleware).
 * @param {string}       data.title
 * @param {string}       data.description
 * @param {string}       [data.status]
 * @param {string}       [data.priority]
 * @param {string|null}  [data.dueDate]
 * @returns {Task}
 */
export const createTask = (data) => {
  const now = new Date().toISOString();

  /** @type {Task} */
  const task = {
    id: randomUUID(),
    title: data.title.trim(),
    description: data.description.trim(),
    status: ALLOWED_STATUSES.includes(data.status) ? data.status : DEFAULT_STATUS,
    priority: ALLOWED_PRIORITIES.includes(data.priority) ? data.priority : DEFAULT_PRIORITY,
    dueDate: normaliseDueDate(data.dueDate),
    createdAt: now,
    updatedAt: now,
  };

  return store.insert(task);
};

/**
 * Update an existing task by id.
 *
 * Only the fields supplied in `data` are changed.
 * `id`, `createdAt` are never modified.
 * `updatedAt` is always refreshed.
 *
 * @param {string} id
 * @param {Object} data - Partial task fields to update.
 * @returns {Task|null} The updated task, or null if not found.
 */
export const updateTask = (id, data) => {
  const existing = store.findById(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    // Only overwrite fields that were explicitly provided
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.description !== undefined && { description: data.description.trim() }),
    ...(data.status !== undefined &&
      ALLOWED_STATUSES.includes(data.status) && { status: data.status }),
    ...(data.priority !== undefined &&
      ALLOWED_PRIORITIES.includes(data.priority) && { priority: data.priority }),
    ...(data.dueDate !== undefined && { dueDate: normaliseDueDate(data.dueDate) }),
    updatedAt: new Date().toISOString(),
  };

  return store.update(id, updated);
};

/**
 * Delete a task by id.
 *
 * @param {string} id
 * @returns {Task|null} The deleted task, or null if not found.
 */
export const deleteTask = (id) => store.remove(id) ?? null;
