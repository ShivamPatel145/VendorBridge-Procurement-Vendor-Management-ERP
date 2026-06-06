import { Router } from 'express';

export const rfqRoutes = Router();

// TODO: Implement rfqs routes
rfqRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'rfqs module — TODO: implement' });
});

