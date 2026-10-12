import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as taskApi from '../services/taskApi';
import TaskForm from '../components/TaskForm/TaskForm';
import ErrorAlert from '../components/UI/ErrorAlert';

function CreateTaskPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setGeneralError(null);
    setServerFieldErrors({});

    try {
      await taskApi.createTask(formData);
      // Navigate to dashboard on success with state message
      navigate('/', {
        replace: true,
        state: { notification: `Task "${formData.title}" created successfully!` },
      });
    } catch (err) {
      if (err.errors) {
        setServerFieldErrors(err.errors);
      }
      setGeneralError(err.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {generalError && (
        <div style={{ maxWidth: '680px', margin: '0 auto 16px auto' }}>
          <ErrorAlert
            title="Unable to create task"
            message={generalError}
          />
        </div>
      )}

      <TaskForm
        pageTitle="Create New Task"
        subtitle="Fill in the details below to add a new task to your dashboard."
        submitLabel="Create Task"
        initialValues={{
          title: '',
          description: '',
          status: 'pending',
          priority: 'low',
          dueDate: '',
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        serverFieldErrors={serverFieldErrors}
        backTo="/"
      />
    </div>
  );
}

export default CreateTaskPage;
