/**
 * Request validation middleware for task routes.
 *
 * Each exported function is an Express middleware factory that validates
 * req.body and calls next(AppError) on failure or next() on success.
 *
 * Validation rules:
 *  - title       : required on create; non-empty string if provided on update
 *  - description : required on create; non-empty string if provided on update
 *  - status      : optional; must be an allowed value if provided
 *  - priority    : optional; must be an allowed value if provided
 *  - dueDate     : optional; must parse as a valid date if provided
 */
import { AppError } from '../utils/AppError.js';
import { ALLOWED_STATUSES, ALLOWED_PRIORITIES } from '../utils/constants.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Return an error message if the value is not a valid date string,
 * or null if it is acceptable (empty/null values are allowed — dueDate is optional).
 */
const validateDueDate = (value) => {
  if (value === null || value === undefined || value === '') return null; // allowed: cleared
  if (isNaN(Date.parse(value))) return 'dueDate must be a valid date (e.g. YYYY-MM-DD)';
  return null;
};

/**
 * Throw an AppError carrying all field-level messages if the errors map is non-empty.
 */
const rejectIfErrors = (errors) => {
  const keys = Object.keys(errors);
  if (keys.length > 0) {
    throw new AppError('Validation failed', 400, errors);
  }
};

// ── Middleware ─────────────────────────────────────────────────────────────────

/**
 * Validate the body of POST /api/tasks.
 * title and description are required.
 */
export const validateCreate = (req, _res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body ?? {};
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title is required and must be a non-empty string';
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      errors.description = 'Description is required and must be a non-empty string';
    }

    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      errors.status = `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    }

    if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
      errors.priority = `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}`;
    }

    const dueDateError = validateDueDate(dueDate);
    if (dueDateError) errors.dueDate = dueDateError;

    rejectIfErrors(errors);
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Validate the body of PUT /api/tasks/:id.
 * At least one recognised field must be present.
 * All fields are optional but must be valid if supplied.
 */
export const validateUpdate = (req, _res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body ?? {};
    const errors = {};

    const knownFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    const providedFields = knownFields.filter((f) => req.body && f in req.body);

    if (providedFields.length === 0) {
      throw new AppError(
        `Request body must include at least one field to update: ${knownFields.join(', ')}`,
        400,
      );
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      errors.title = 'Title must be a non-empty string';
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
      errors.description = 'Description must be a non-empty string';
    }

    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      errors.status = `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    }

    if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
      errors.priority = `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}`;
    }

    const dueDateError = validateDueDate(dueDate);
    if (dueDateError) errors.dueDate = dueDateError;

    rejectIfErrors(errors);
    next();
  } catch (err) {
    next(err);
  }
};
