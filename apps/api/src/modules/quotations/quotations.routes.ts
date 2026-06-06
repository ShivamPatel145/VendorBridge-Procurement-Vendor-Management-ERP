import { Router } from 'express';

export const quotationRoutes = Router();

// TODO: Implement quotations routes
quotationRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'quotations module — TODO: implement' });
});

