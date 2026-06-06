import { Router } from 'express';

export const invoiceRoutes = Router();

// TODO: Implement invoices routes
invoiceRoutes.get('/', (_req, res) => {
  res.json({ success: true, message: 'invoices module — TODO: implement' });
});

