/**
 * Smoke test for the task service layer.
 * Run with: node Backend/scripts/testService.mjs
 *
 * This is NOT a production test suite — it is a quick verification that
 * the service functions behave correctly before wiring up HTTP routes.
 * A proper test suite (e.g. Vitest) will be introduced in Task 10.
 */

import { _reset } from '../src/services/taskStore.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../src/services/taskService.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

const assert = (label, condition, got) => {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`, got !== undefined ? `→ got: ${JSON.stringify(got)}` : '');
    failed++;
  }
};

const section = (name) => console.log(`\n▸ ${name}`);

// ── Reset before each test group ─────────────────────────────────────────────

section('Initial state');
_reset();
assert('getAllTasks returns empty array', getAllTasks().length === 0);

// ── createTask ────────────────────────────────────────────────────────────────

section('createTask');

const task1 = createTask({ title: 'Fix bug', description: 'Null pointer in auth', dueDate: '2026-12-31' });
assert('returns a task object', typeof task1 === 'object' && task1 !== null);
assert('has a uuid id', typeof task1.id === 'string' && task1.id.length === 36);
assert('title is stored', task1.title === 'Fix bug');
assert('description is stored', task1.description === 'Null pointer in auth');
assert('status defaults to pending', task1.status === 'pending');
assert('priority defaults to low', task1.priority === 'low');
assert('dueDate stored as YYYY-MM-DD', task1.dueDate === '2026-12-31');
assert('createdAt is set', typeof task1.createdAt === 'string' && task1.createdAt.length > 0);
assert('updatedAt equals createdAt on creation', task1.updatedAt === task1.createdAt);

const task2 = createTask({
  title: 'Write docs',
  description: 'API documentation',
  status: 'in_progress',
  priority: 'high',
});
assert('explicit status stored', task2.status === 'in_progress');
assert('explicit priority stored', task2.priority === 'high');
assert('null dueDate when not provided', task2.dueDate === null);

const task3 = createTask({
  title: 'Deploy',
  description: 'Push to prod',
  status: 'invalid_status',    // should fall back to default
  priority: 'invalid_priority', // should fall back to default
});
assert('invalid status falls back to pending', task3.status === 'pending');
assert('invalid priority falls back to low', task3.priority === 'low');

// ── getAllTasks ────────────────────────────────────────────────────────────────

section('getAllTasks');
const all = getAllTasks();
assert('returns 3 tasks', all.length === 3);
assert('first task is task1', all[0].id === task1.id);

// Mutating the returned array must not affect the store
all.push({ id: 'fake' });
assert('store is not mutated by external push', getAllTasks().length === 3);

// ── getTaskById ───────────────────────────────────────────────────────────────

section('getTaskById');
assert('finds existing task', getTaskById(task1.id)?.id === task1.id);
assert('returns null for unknown id', getTaskById('does-not-exist') === null);

// ── updateTask ────────────────────────────────────────────────────────────────

section('updateTask');

// Small delay to ensure updatedAt > createdAt
await new Promise((r) => setTimeout(r, 5));

const updated = updateTask(task1.id, { title: 'Fix bug (urgent)', status: 'completed' });
assert('returns updated task', updated?.id === task1.id);
assert('title updated', updated?.title === 'Fix bug (urgent)');
assert('status updated', updated?.status === 'completed');
assert('description unchanged', updated?.description === 'Null pointer in auth');
assert('priority unchanged', updated?.priority === 'low');
assert('dueDate unchanged', updated?.dueDate === '2026-12-31');
assert('createdAt unchanged', updated?.createdAt === task1.createdAt);
assert('updatedAt is newer than createdAt', updated?.updatedAt > task1.createdAt);

// Update with dueDate: null to clear it
const cleared = updateTask(task1.id, { dueDate: null });
assert('dueDate can be cleared to null', cleared?.dueDate === null);

const notFound = updateTask('does-not-exist', { title: 'Ghost' });
assert('returns null for unknown id', notFound === null);

// ── deleteTask ────────────────────────────────────────────────────────────────

section('deleteTask');
const deleted = deleteTask(task2.id);
assert('returns deleted task', deleted?.id === task2.id);
assert('task removed from store', getTaskById(task2.id) === null);
assert('store now has 2 tasks', getAllTasks().length === 2);

const deleteMissing = deleteTask('does-not-exist');
assert('returns null when not found', deleteMissing === null);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
