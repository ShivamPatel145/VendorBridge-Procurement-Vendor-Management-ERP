import { Router } from 'express';
import multer from 'multer';
import { RFQsController } from './rfqs.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const rfqRoutes = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Secure all RFQ endpoints
rfqRoutes.use(authenticate);

// Reads (List & Detail)
rfqRoutes.get('/', RFQsController.list);
rfqRoutes.get('/:id', RFQsController.get);

// Changes: Restricted to ADMIN or PROCUREMENT_OFFICER
rfqRoutes.post('/', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), RFQsController.create);
rfqRoutes.put('/:id', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), RFQsController.update);
rfqRoutes.post('/:id/publish', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), RFQsController.publish);
rfqRoutes.post('/:id/close', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), RFQsController.close);
rfqRoutes.post('/:id/invite', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), RFQsController.invite);
rfqRoutes.post('/:id/attachments', authorize(Role.ADMIN, Role.PROCUREMENT_OFFICER), upload.single('file'), RFQsController.uploadAttachment);

export default rfqRoutes;
