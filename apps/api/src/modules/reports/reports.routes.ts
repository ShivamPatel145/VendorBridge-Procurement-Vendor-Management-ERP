import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const reportRoutes = Router();

// Secure all report endpoints
reportRoutes.use(authenticate);

// GET /api/v1/reports/summary — accessible to all authenticated roles for dashboard stats
reportRoutes.get('/summary', ReportsController.getSummary);

// GET /api/v1/reports/audit-logs — restricted to ADMIN & MANAGER
reportRoutes.get('/audit-logs', authorize(Role.ADMIN, Role.MANAGER), ReportsController.getAuditLogs);

export default reportRoutes;
