/**
 * AppError — a structured, intentional error thrown by the application.
 *
 * Using a custom class lets the centralized error handler distinguish
 * known operational errors (e.g. 400 Bad Request, 404 Not Found) from
 * unexpected programming errors (e.g. TypeError) and respond differently.
 */
export class AppError extends Error {
  /**
   * @param {string} message   - Human-readable error message sent to the client.
   * @param {number} status    - HTTP status code (4xx or 5xx).
   * @param {Object} [details] - Optional field-level validation errors.
   */
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details; // e.g. { title: 'Title is required' }
  }
}
