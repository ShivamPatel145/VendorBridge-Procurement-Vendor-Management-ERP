import { Router } from 'express';

export const reportRoutes = Router();

// TODO: Implement reports routes
reportRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'reports module — TODO: implement' });
});

