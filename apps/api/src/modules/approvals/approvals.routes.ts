import { Router } from 'express';
import { ApprovalsController } from './approvals.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const approvalRoutes = Router();

// Secure all approval endpoints
approvalRoutes.use(authenticate);

// Start approval workflow (Procurement Officers or Admin)
approvalRoutes.post('/', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), ApprovalsController.start);

// List pending approvals for active approver (Manager or Admin)
approvalRoutes.get('/pending', authorize(Role.ADMIN, Role.MANAGER), ApprovalsController.listPending);

// Take approval action (Manager or Admin)
approvalRoutes.post('/:id/action', authorize(Role.ADMIN, Role.MANAGER), ApprovalsController.takeAction);

// Get workflow detail
approvalRoutes.get('/:id', ApprovalsController.get);
approvalRoutes.get('/quotation/:quotationId', ApprovalsController.getByQuotation);

export default approvalRoutes;
