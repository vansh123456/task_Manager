/**
 * taskApi.js — Frontend API service layer.
 *
 * All HTTP requests to the backend go through this module.
 * Components and hooks never call fetch() directly.
 *
 * On success: returns the parsed response data.
 * On failure: throws an Error with a human-readable message from the server,
 *             or a generic network message if the server is unreachable.
 *
 * Response envelope expected from the backend:
 *   { success: true,  data: T }
 *   { success: false, message: string, errors?: Record<string, string> }
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Central fetch wrapper.
 * @param {string} path   - Path relative to BASE_URL (e.g. '/tasks')
 * @param {RequestInit} [options]
 * @returns {Promise<any>} The `data` field from the response envelope.
 * @throws {Error} with `.message` and optional `.errors` field.
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });
  } catch {
    // Network error — server unreachable, CORS blocked, etc.
    throw new Error('Unable to reach the server. Check that the backend is running.');
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const err = new Error(
      json?.message || `Request failed with status ${response.status}`,
    );
    err.status = response.status;
    if (json?.errors) err.errors = json.errors; // field-level validation errors
    throw err;
  }

  return json?.data;
};

// ── Public API functions ──────────────────────────────────────────────────────

/**
 * Fetch all tasks.
 * @returns {Promise<Task[]>}
 */
export const getAllTasks = () => request('/tasks');

/**
 * Fetch a single task by id.
 * @param {string} id
 * @returns {Promise<Task>}
 */
export const getTaskById = (id) => request(`/tasks/${id}`);

/**
 * Create a new task.
 * @param {{ title: string, description: string, status?: string, priority?: string, dueDate?: string|null }} data
 * @returns {Promise<Task>}
 */
export const createTask = (data) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Update an existing task.
 * @param {string} id
 * @param {Partial<Task>} data
 * @returns {Promise<Task>}
 */
export const updateTask = (id, data) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * Delete a task by id.
 * @param {string} id
 * @returns {Promise<Task>} The deleted task.
 */
export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' });

/**
 * @typedef {Object} Task
 * @property {string}      id
 * @property {string}      title
 * @property {string}      description
 * @property {string}      status      - 'pending' | 'in_progress' | 'completed'
 * @property {string}      priority    - 'low' | 'medium' | 'high'
 * @property {string|null} dueDate     - 'YYYY-MM-DD' or null
 * @property {string}      createdAt
 * @property {string}      updatedAt
 */
