import { Router } from 'express';

export const authRoutes = Router();

// POST /api/v1/auth/register
authRoutes.post('/register', (_req, res) => {
  res.json({ success: true, message: 'Auth register — TODO: implement' });
});

// POST /api/v1/auth/login
authRoutes.post('/login', (_req, res) => {
  res.json({ success: true, message: 'Auth login — TODO: implement' });
});

// POST /api/v1/auth/refresh
authRoutes.post('/refresh', (_req, res) => {
  res.json({ success: true, message: 'Auth refresh — TODO: implement' });
});

// POST /api/v1/auth/logout
authRoutes.post('/logout', (_req, res) => {
  res.json({ success: true, message: 'Auth logout — TODO: implement' });
});

// GET /api/v1/auth/me
authRoutes.get('/me', (_req, res) => {
  res.json({ success: true, message: 'Auth me — TODO: implement' });
});
