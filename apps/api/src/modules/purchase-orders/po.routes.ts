import { Router } from 'express';
import { POController } from './po.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const purchaseOrderRoutes = Router();

// Secure all PO endpoints
purchaseOrderRoutes.use(authenticate);

// Reads (List & Detail)
purchaseOrderRoutes.get('/', POController.list);
purchaseOrderRoutes.get('/:id', POController.get);

// Changes: Restricted to ADMIN, MANAGER, or PROCUREMENT_OFFICER
purchaseOrderRoutes.post('/generate', authorize(Role.ADMIN, Role.MANAGER, Role.PROCUREMENT_OFFICER), POController.generate);

// Updates status or dates: ADMIN, MANAGER, PROCUREMENT_OFFICER, or VENDOR (e.g. to acknowledge)
purchaseOrderRoutes.put('/:id', POController.update);

export default purchaseOrderRoutes;
