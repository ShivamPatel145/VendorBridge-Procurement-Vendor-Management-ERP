import { Router } from 'express';
import multer from 'multer';
import { VendorsController } from './vendors.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const vendorRoutes = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Secure all vendor endpoints
vendorRoutes.use(authenticate);

// Profile detail & list accessible by authenticated users
vendorRoutes.get('/', VendorsController.list);
vendorRoutes.get('/me', VendorsController.getMyProfile);
vendorRoutes.get('/:id', VendorsController.get);

// Update profile: accessible by owner or admin
vendorRoutes.put('/:id', VendorsController.update);

// Documents upload
vendorRoutes.post('/:id/documents', upload.single('file'), VendorsController.uploadDoc);

// Status flow - restricted to ADMIN/MANAGER
vendorRoutes.patch('/:id/status', authorize(Role.ADMIN, Role.MANAGER), VendorsController.updateStatus);

// Categories routes
vendorRoutes.get('/categories/all', VendorsController.listCategories);
vendorRoutes.post('/categories', authorize(Role.ADMIN, Role.MANAGER), VendorsController.createCategory);
vendorRoutes.delete('/categories/:id', authorize(Role.ADMIN, Role.MANAGER), VendorsController.deleteCategory);

export default vendorRoutes;
