/**
 * Centralized error-handling middleware.
 *
 * Must be the LAST middleware registered in app.js (Express detects
 * error handlers by their 4-argument signature).
 *
 * Behaviour:
 *  - AppError (known operational errors): use its status + message.
 *  - Express body-parser SyntaxError: return 400 with a clear message.
 *  - Unexpected errors: return 500 and hide internal details in production.
 */
import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // ── Known operational error ───────────────────────────────────────────────
  if (err instanceof AppError) {
    const body = {
      success: false,
      message: err.message,
    };
    if (err.details) body.errors = err.details;
    return res.status(err.status).json(body);
  }

  // ── JSON body parse error (malformed request body) ────────────────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }

  // ── Unexpected / programming error ────────────────────────────────────────
  // Never expose stack traces or internal details to clients in production.
  console.error('[error]', err);

  return res.status(500).json({
    success: false,
    message: isDev
      ? err.message || 'Internal server error'
      : 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
