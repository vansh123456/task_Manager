import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TaskForm.module.css';

const TITLE_MAX = 100;
const DESC_MAX = 1000;

/**
 * TaskForm — reusable form component for creating and editing tasks.
 */
function TaskForm({
  title: pageTitle = 'Create Task',
  subtitle = 'Fill in the details below to track your task.',
  submitLabel = 'Create Task',
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  serverFieldErrors = {},
  backTo = '/',
}) {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    status: initialValues.status || 'pending',
    priority: initialValues.priority || 'low',
    dueDate: initialValues.dueDate || '',
  });

  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Sync if initialValues changes (e.g. after edit fetch)
  useEffect(() => {
    setFormData({
      title: initialValues.title || '',
      description: initialValues.description || '',
      status: initialValues.status || 'pending',
      priority: initialValues.priority || 'low',
      dueDate: initialValues.dueDate || '',
    });
  }, [initialValues]);

  // Validate a single field
  const validateField = (field, value) => {
    switch (field) {
      case 'title': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'Title is required';
        if (trimmed.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer`;
        return null;
      }
      case 'description': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'Description is required';
        if (trimmed.length > DESC_MAX) return `Description must be ${DESC_MAX} characters or fewer`;
        return null;
      }
      case 'dueDate': {
        if (!value) return null; // Optional
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) return 'Please enter a valid date';
        return null;
      }
      default:
        return null;
    }
  };

  // Validate all fields
  const validateAll = () => {
    const errors = {};
    const titleErr = validateField('title', formData.title);
    if (titleErr) errors.title = titleErr;

    const descErr = validateField('description', formData.description);
    if (descErr) errors.description = descErr;

    const dueErr = validateField('dueDate', formData.dueDate);
    if (dueErr) errors.dueDate = dueErr;

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate if touched
    if (touched[name]) {
      const err = validateField(name, value);
      setClientErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setClientErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all as touched
    setTouched({
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
    });

    const isValid = validateAll();
    if (!isValid) return;

    // Sanitize payload before submitting
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? formData.dueDate : null,
    };

    onSubmit(payload);
  };

  // Determine active error per field (server takes priority over client if untouched)
  const getFieldError = (field) => {
    if (serverFieldErrors[field]) return serverFieldErrors[field];
    if (touched[field] && clientErrors[field]) return clientErrors[field];
    return null;
  };

  const titleError = getFieldError('title');
  const descError = getFieldError('description');
  const dueError = getFieldError('dueDate');

  return (
    <div className={`${styles.formWrapper} animate-fadeIn`}>
      <Link to={backTo} className={styles.backLink} id="task-form-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Title Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="task-title-input" className={styles.label}>
                <span>Title</span>
                <span className={styles.requiredAsterisk} aria-hidden="true">*</span>
              </label>
              <span className={`${styles.charCount} ${formData.title.length > TITLE_MAX ? styles.limit : ''}`}>
                {formData.title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              type="text"
              id="task-title-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Design wireframes for onboarding flow"
              maxLength={TITLE_MAX + 10}
              disabled={isSubmitting}
              className={titleError ? styles.inputError : ''}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'task-title-error' : undefined}
            />
            {titleError && (
              <div id="task-title-error" className={styles.errorMessage} role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{titleError}</span>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="task-description-input" className={styles.label}>
                <span>Description</span>
                <span className={styles.requiredAsterisk} aria-hidden="true">*</span>
              </label>
              <span className={`${styles.charCount} ${formData.description.length > DESC_MAX ? styles.limit : ''}`}>
                {formData.description.length}/{DESC_MAX}
              </span>
            </div>
            <textarea
              id="task-description-input"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Provide context, acceptance criteria, or relevant links..."
              rows={4}
              maxLength={DESC_MAX + 20}
              disabled={isSubmitting}
              className={descError ? styles.inputError : ''}
              aria-invalid={Boolean(descError)}
              aria-describedby={descError ? 'task-description-error' : undefined}
            />
            {descError && (
              <div id="task-description-error" className={styles.errorMessage} role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{descError}</span>
              </div>
            )}
          </div>

          {/* Two column row: Status and Priority */}
          <div className={styles.twoColumnRow}>
            {/* Status Select */}
            <div className={styles.fieldGroup}>
              <label htmlFor="task-status-select" className={styles.label}>
                <span>Status</span>
              </label>
              <select
                id="task-status-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className={styles.fieldGroup}>
              <label htmlFor="task-priority-select" className={styles.label}>
                <span>Priority</span>
              </label>
              <select
                id="task-priority-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="task-duedate-input" className={styles.label}>
                <span>Due Date</span>
                <span className={styles.helperText}>(optional)</span>
              </label>
              {formData.dueDate && (
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, dueDate: '' }))}
                  className={styles.charCount}
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Clear date
                </button>
              )}
            </div>
            <input
              type="date"
              id="task-duedate-input"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={dueError ? styles.inputError : ''}
              aria-invalid={Boolean(dueError)}
              aria-describedby={dueError ? 'task-duedate-error' : undefined}
            />
            {dueError && (
              <div id="task-duedate-error" className={styles.errorMessage} role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{dueError}</span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <Link
              to={backTo}
              className={styles.cancelBtn}
              id="task-form-cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
              id="task-form-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{submitLabel}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
