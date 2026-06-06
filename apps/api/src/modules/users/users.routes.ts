import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.use(authorize(Role.ADMIN, Role.MANAGER));

userRoutes.get('/', UsersController.list);
userRoutes.get('/:id', UsersController.get);
userRoutes.post('/', UsersController.create);
userRoutes.put('/:id', UsersController.update);
userRoutes.delete('/:id', UsersController.delete);

export default userRoutes;
