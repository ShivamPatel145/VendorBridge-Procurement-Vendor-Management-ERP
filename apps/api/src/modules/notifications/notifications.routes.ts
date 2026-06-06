import { Router } from 'express';

export const notificationRoutes = Router();

// TODO: Implement notifications routes
notificationRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'notifications module — TODO: implement' });
});

