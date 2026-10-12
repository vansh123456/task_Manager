/**
 * EditTaskPage — form to update an existing task at /tasks/:id/edit
 * Full implementation in Task 7.
 */
import { useParams } from 'react-router-dom';

function EditTaskPage() {
  const { id } = useParams();
  return (
    <div className="animate-fadeIn">
      <h1>Edit Task</h1>
      <p style={{ marginTop: '8px' }}>Edit form for task <code>{id}</code> coming in Task 7.</p>
    </div>
  );
}

export default EditTaskPage;
