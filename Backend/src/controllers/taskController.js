/**
 * Task controller — handles HTTP request/response for all task endpoints.
 *
 * Controllers are intentionally thin:
 *  - Extract validated data from req.
 *  - Call the service layer.
 *  - Send a response or pass an AppError to next().
 *
 * All business logic lives in taskService.js.
 * All response shapes use the same envelope: { success, data } or { success, message }.
 */
import * as taskService from '../services/taskService.js';
import { AppError } from '../utils/AppError.js';

// ── GET /api/tasks ────────────────────────────────────────────────────────────

export const getAllTasks = (_req, res) => {
  const tasks = taskService.getAllTasks();
  res.json({ success: true, count: tasks.length, data: tasks });
};

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────

export const getTaskById = (req, res, next) => {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    return next(new AppError(`Task with id '${req.params.id}' not found`, 404));
  }
  res.json({ success: true, data: task });
};

// ── POST /api/tasks ───────────────────────────────────────────────────────────

export const createTask = (req, res) => {
  const task = taskService.createTask(req.body);
  res.status(201).json({ success: true, data: task });
};

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────

export const updateTask = (req, res, next) => {
  const task = taskService.updateTask(req.params.id, req.body);
  if (!task) {
    return next(new AppError(`Task with id '${req.params.id}' not found`, 404));
  }
  res.json({ success: true, data: task });
};

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────

export const deleteTask = (req, res, next) => {
  const deleted = taskService.deleteTask(req.params.id);
  if (!deleted) {
    return next(new AppError(`Task with id '${req.params.id}' not found`, 404));
  }
  res.json({ success: true, message: 'Task deleted successfully', data: deleted });
};
