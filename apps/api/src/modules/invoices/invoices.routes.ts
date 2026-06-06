import { Router } from 'express';
import { InvoicesController } from './invoices.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const invoiceRoutes = Router();

// Secure all invoice endpoints
invoiceRoutes.use(authenticate);

// Reads (List & Detail)
invoiceRoutes.get('/', InvoicesController.list);
invoiceRoutes.get('/:id', InvoicesController.get);

// PDF Download
invoiceRoutes.get('/:id/pdf', InvoicesController.downloadPDF);

// Vendor generates invoice from active PO
invoiceRoutes.post('/generate', authorize(Role.VENDOR), InvoicesController.create);

// Update status: ADMIN, MANAGER, or PROCUREMENT_OFFICER
invoiceRoutes.put('/:id', authorize(Role.ADMIN, Role.MANAGER, Role.PROCUREMENT_OFFICER), InvoicesController.update);

// Record payment details: ADMIN, MANAGER, or PROCUREMENT_OFFICER
invoiceRoutes.post('/:id/pay', authorize(Role.ADMIN, Role.MANAGER, Role.PROCUREMENT_OFFICER), InvoicesController.pay);

export default invoiceRoutes;
