/**
 * HTTP integration test for all task API endpoints.
 * Run with: node Backend/scripts/testApi.mjs
 *
 * Starts the Express server, runs assertions against each endpoint using
 * the built-in fetch() API (Node 18+), then shuts down cleanly.
 *
 * Exit code 0 = all tests pass. Exit code 1 = at least one failure.
 */

import 'dotenv/config';
import app from '../src/app.js';

const PORT = process.env.PORT || 5001;
const BASE = `http://localhost:${PORT}/api/tasks`;

// ── Test helpers ──────────────────────────────────────────────────────────────

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

const req = async (method, url, body) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const json = await res.json().catch(() => null);
  return { status: res.status, body: json };
};

// ── Start server ──────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`[test] Server running on port ${PORT}`);
  runTests().finally(() => {
    server.close();
    console.log(`\n${'─'.repeat(40)}`);
    console.log(`Results: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  });
});

// ── Tests ─────────────────────────────────────────────────────────────────────

async function runTests() {
  let taskId;

  // ── GET /api/tasks (empty) ──────────────────────────────────────────────────
  section('GET /api/tasks — empty store');
  {
    const { status, body } = await req('GET', BASE);
    assert('status 200', status === 200, status);
    assert('success true', body?.success === true, body);
    assert('data is empty array', Array.isArray(body?.data) && body.data.length === 0, body);
    assert('count is 0', body?.count === 0, body?.count);
  }

  // ── POST /api/tasks — validation failures ───────────────────────────────────
  section('POST /api/tasks — validation');
  {
    const { status, body } = await req('POST', BASE, {});
    assert('missing body → 400', status === 400, status);
    assert('success false', body?.success === false, body);
    assert('errors.title present', typeof body?.errors?.title === 'string', body?.errors);
    assert('errors.description present', typeof body?.errors?.description === 'string', body?.errors);
  }
  {
    const { status, body } = await req('POST', BASE, { title: '  ', description: 'ok' });
    assert('blank title → 400', status === 400, status);
    assert('errors.title present for blank', typeof body?.errors?.title === 'string', body?.errors);
  }
  {
    const { status, body } = await req('POST', BASE, {
      title: 'T', description: 'D', status: 'INVALID',
    });
    assert('bad status value → 400', status === 400, status);
    assert('errors.status present', typeof body?.errors?.status === 'string', body?.errors);
  }
  {
    const { status, body } = await req('POST', BASE, {
      title: 'T', description: 'D', priority: 'INVALID',
    });
    assert('bad priority value → 400', status === 400, status);
    assert('errors.priority present', typeof body?.errors?.priority === 'string', body?.errors);
  }
  {
    const { status, body } = await req('POST', BASE, {
      title: 'T', description: 'D', dueDate: 'not-a-date',
    });
    assert('bad dueDate → 400', status === 400, status);
    assert('errors.dueDate present', typeof body?.errors?.dueDate === 'string', body?.errors);
  }

  // ── POST /api/tasks — successful creation ───────────────────────────────────
  section('POST /api/tasks — success');
  {
    const { status, body } = await req('POST', BASE, {
      title: 'Write tests',
      description: 'Cover all endpoints',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-12-31',
    });
    assert('status 201', status === 201, status);
    assert('success true', body?.success === true, body);
    assert('id is uuid', typeof body?.data?.id === 'string' && body.data.id.length === 36, body?.data?.id);
    assert('title stored', body?.data?.title === 'Write tests', body?.data);
    assert('status stored', body?.data?.status === 'in_progress', body?.data);
    assert('priority stored', body?.data?.priority === 'high', body?.data);
    assert('dueDate stored', body?.data?.dueDate === '2026-12-31', body?.data);
    assert('createdAt set', typeof body?.data?.createdAt === 'string', body?.data);
    assert('updatedAt set', typeof body?.data?.updatedAt === 'string', body?.data);
    taskId = body?.data?.id;
  }

  // Second task with defaults
  {
    const { status, body } = await req('POST', BASE, {
      title: 'Default task',
      description: 'No optional fields',
    });
    assert('second task → 201', status === 201, status);
    assert('status defaults to pending', body?.data?.status === 'pending', body?.data);
    assert('priority defaults to low', body?.data?.priority === 'low', body?.data);
    assert('dueDate defaults to null', body?.data?.dueDate === null, body?.data);
  }

  // ── GET /api/tasks — populated ──────────────────────────────────────────────
  section('GET /api/tasks — populated');
  {
    const { status, body } = await req('GET', BASE);
    assert('status 200', status === 200, status);
    assert('count is 2', body?.count === 2, body?.count);
    assert('data has 2 tasks', body?.data?.length === 2, body?.data?.length);
  }

  // ── GET /api/tasks/:id ──────────────────────────────────────────────────────
  section('GET /api/tasks/:id');
  {
    const { status, body } = await req('GET', `${BASE}/${taskId}`);
    assert('status 200', status === 200, status);
    assert('correct task returned', body?.data?.id === taskId, body?.data?.id);
  }
  {
    const { status, body } = await req('GET', `${BASE}/00000000-0000-0000-0000-000000000000`);
    assert('unknown id → 404', status === 404, status);
    assert('success false', body?.success === false, body);
    assert('message present', typeof body?.message === 'string', body);
  }

  // ── PUT /api/tasks/:id ──────────────────────────────────────────────────────
  section('PUT /api/tasks/:id');
  {
    const { status, body } = await req('PUT', `${BASE}/${taskId}`, {});
    assert('empty body → 400', status === 400, status);
  }
  {
    const { status, body } = await req('PUT', `${BASE}/${taskId}`, {
      status: 'completed',
      priority: 'low',
    });
    assert('update → 200', status === 200, status);
    assert('status updated', body?.data?.status === 'completed', body?.data);
    assert('priority updated', body?.data?.priority === 'low', body?.data);
    assert('title preserved', body?.data?.title === 'Write tests', body?.data);
  }
  {
    const { status } = await req('PUT', `${BASE}/00000000-0000-0000-0000-000000000000`, {
      title: 'Ghost',
    });
    assert('update unknown id → 404', status === 404, status);
  }

  // ── DELETE /api/tasks/:id ───────────────────────────────────────────────────
  section('DELETE /api/tasks/:id');
  {
    const { status, body } = await req('DELETE', `${BASE}/00000000-0000-0000-0000-000000000000`);
    assert('delete unknown id → 404', status === 404, status);
    assert('success false', body?.success === false, body);
  }
  {
    const { status, body } = await req('DELETE', `${BASE}/${taskId}`);
    assert('delete → 200', status === 200, status);
    assert('success true', body?.success === true, body);
    assert('deleted task returned', body?.data?.id === taskId, body?.data?.id);
  }
  {
    const { status } = await req('GET', `${BASE}/${taskId}`);
    assert('deleted task no longer found', status === 404, status);
  }
  {
    const { status, body } = await req('GET', BASE);
    assert('store has 1 task after delete', body?.count === 1, body?.count);
    assert('list status 200', status === 200, status);
  }

  // ── 404 — unknown route ─────────────────────────────────────────────────────
  section('Unknown routes');
  {
    const { status } = await req('GET', `http://localhost:${PORT}/api/nonexistent`);
    assert('unknown route → 404', status === 404, status);
  }

  // ── Malformed JSON body ─────────────────────────────────────────────────────
  section('Malformed request body');
  {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ "title": "broken json"',
    });
    const body = await res.json().catch(() => null);
    assert('malformed JSON → 400', res.status === 400, res.status);
    assert('error message present', typeof body?.message === 'string', body);
  }
}
