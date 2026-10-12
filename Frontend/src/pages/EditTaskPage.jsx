import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as taskApi from '../services/taskApi';
import TaskForm from '../components/TaskForm/TaskForm';
import ErrorAlert from '../components/UI/ErrorAlert';

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadTask = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await taskApi.getTaskById(id);
        if (isMounted) setTask(data);
      } catch (err) {
        if (isMounted) {
          setFetchError(
            err.status === 404
              ? 'Task not found. It may have been deleted.'
              : err.message || 'Failed to load task for editing'
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTask();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setGeneralError(null);
    setServerFieldErrors({});

    try {
      await taskApi.updateTask(id, formData);
      navigate('/', {
        replace: true,
        state: { notification: `Task "${formData.title}" was updated successfully!` },
      });
    } catch (err) {
      if (err.errors) {
        setServerFieldErrors(err.errors);
      }
      setGeneralError(err.message || 'Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '680px', margin: '40px auto' }} className="animate-fadeIn">
        <div style={{ background: 'var(--bg-surface)', padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div style={{ maxWidth: '680px', margin: '40px auto' }} className="animate-fadeIn">
        <ErrorAlert
          title="Cannot edit task"
          message={fetchError || 'Task not found.'}
        />
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              padding: '8px 18px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {generalError && (
        <div style={{ maxWidth: '680px', margin: '0 auto 16px auto' }}>
          <ErrorAlert
            title="Unable to save changes"
            message={generalError}
          />
        </div>
      )}

      <TaskForm
        pageTitle="Edit Task"
        subtitle={`Editing task: "${task.title}"`}
        submitLabel="Save Changes"
        initialValues={{
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate || '',
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        serverFieldErrors={serverFieldErrors}
        backTo="/"
      />
    </div>
  );
}

export default EditTaskPage;
