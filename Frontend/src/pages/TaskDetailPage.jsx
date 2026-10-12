/**
 * TaskDetailPage — shows full details of a single task at /tasks/:id
 * Full implementation in Task 8.
 */
import { useParams } from 'react-router-dom';

function TaskDetailPage() {
  const { id } = useParams();
  return (
    <div className="animate-fadeIn">
      <h1>Task Details</h1>
      <p style={{ marginTop: '8px' }}>Details for task <code>{id}</code> coming in Task 8.</p>
    </div>
  );
}

export default TaskDetailPage;
