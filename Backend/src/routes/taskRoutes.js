/**
 * Task routes — maps HTTP method + path to middleware + controller.
 *
 * Validation middleware runs before controllers.
 * No business logic here — only routing concerns.
 *
 * Mounted at /api/tasks in app.js, so paths below are relative:
 *   GET    /        → getAllTasks
 *   GET    /:id     → getTaskById
 *   POST   /        → validateCreate → createTask
 *   PUT    /:id     → validateUpdate → updateTask
 *   DELETE /:id     → deleteTask
 */
import { Router } from 'express';
import { validateCreate, validateUpdate } from '../middleware/validate.js';
import * as taskController from '../controllers/taskController.js';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateCreate, taskController.createTask);
router.put('/:id', validateUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
