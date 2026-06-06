import { Router } from 'express';

export const purchaseOrderRoutes = Router();

// TODO: Implement purchase-orders routes
purchaseOrderRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'purchase-orders module — TODO: implement' });
});

