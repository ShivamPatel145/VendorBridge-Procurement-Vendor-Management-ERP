import { Router } from 'express';
import multer from 'multer';
import { QuotationsController } from './quotations.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const quotationRoutes = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Secure all quotation endpoints
quotationRoutes.use(authenticate);

// Reads (List & Detail)
quotationRoutes.get('/', QuotationsController.list);
quotationRoutes.get('/:id', QuotationsController.get);

// Actions
quotationRoutes.post('/', authorize(Role.VENDOR), QuotationsController.create);
quotationRoutes.put('/:id', QuotationsController.update);
quotationRoutes.post('/:id/attachments', upload.single('file'), QuotationsController.uploadAttachment);

// Compare quotations (restricted to internal team)
quotationRoutes.get('/compare/rfq/:rfqId', authorize(Role.ADMIN, Role.MANAGER, Role.PROCUREMENT_OFFICER), QuotationsController.compare);

export default quotationRoutes;
