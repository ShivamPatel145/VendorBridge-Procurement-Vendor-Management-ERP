import { Router } from 'express';

export const userRoutes = Router();

// TODO: Implement users routes
userRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'users module — TODO: implement' });
});

