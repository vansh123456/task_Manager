/**
 * App.jsx — root component.
 * Sets up React Router with the Layout shell and all page routes.
 *
 * Route map:
 *   /               → DashboardPage   (task list)
 *   /tasks/new      → CreateTaskPage  (create form)
 *   /tasks/:id      → TaskDetailPage  (read-only detail)
 *   /tasks/:id/edit → EditTaskPage    (edit form)
 *   *               → NotFoundPage    (404)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout        from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CreateTaskPage from './pages/CreateTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import EditTaskPage  from './pages/EditTaskPage';
import NotFoundPage  from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks/new"       element={<CreateTaskPage />} />
          <Route path="tasks/:id"       element={<TaskDetailPage />} />
          <Route path="tasks/:id/edit"  element={<EditTaskPage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
