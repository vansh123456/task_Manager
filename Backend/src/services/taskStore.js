/**
 * In-memory task store.
 *
 * Intentionally kept as a plain module-level array.
 * All access is through the exported functions so that the
 * service layer never touches the array reference directly —
 * this makes the store easy to replace or reset in tests.
 *
 * Data resets on every server restart (by design — no persistence).
 */

/** @type {Array<import('../services/taskService.js').Task>} */
let tasks = [];

/** Return a shallow copy of all tasks (prevents external mutation of the array). */
export const getAll = () => [...tasks];

/** Return a task by id, or undefined if not found. */
export const findById = (id) => tasks.find((t) => t.id === id);

/** Append a new task object and return it. */
export const insert = (task) => {
  tasks.push(task);
  return task;
};

/**
 * Replace a task in place by id.
 * Returns the updated task, or undefined if no task with that id exists.
 */
export const update = (id, updatedTask) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tasks[index] = updatedTask;
  return tasks[index];
};

/**
 * Remove a task by id.
 * Returns the removed task, or undefined if not found.
 */
export const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  const [removed] = tasks.splice(index, 1);
  return removed;
};

/** Reset the store — used in tests only. */
export const _reset = () => {
  tasks = [];
};
