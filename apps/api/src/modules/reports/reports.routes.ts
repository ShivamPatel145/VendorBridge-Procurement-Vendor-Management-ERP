import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const reportRoutes = Router();

// Secure all report endpoints
reportRoutes.use(authenticate);
reportRoutes.use(authorize(Role.ADMIN, Role.MANAGER));

// GET /api/v1/reports/summary
reportRoutes.get('/summary', ReportsController.getSummary);

// GET /api/v1/reports/audit-logs
reportRoutes.get('/audit-logs', ReportsController.getAuditLogs);

export default reportRoutes;
