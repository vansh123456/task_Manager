import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes (to be wired in Task 4) ───────────────────────────────────────────
// import taskRoutes from './routes/taskRoutes.js';
// app.use('/api/tasks', taskRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler (to be expanded in Task 4) ──────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
