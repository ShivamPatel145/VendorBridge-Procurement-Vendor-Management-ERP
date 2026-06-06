import { Router } from 'express';

export const approvalRoutes = Router();

// TODO: Implement approvals routes
approvalRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'approvals module — TODO: implement' });
});

