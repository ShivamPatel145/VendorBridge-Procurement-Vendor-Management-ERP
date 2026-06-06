import { Router } from 'express';

export const vendorRoutes = Router();

// TODO: Implement vendors routes
vendorRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'vendors module — TODO: implement' });
});

