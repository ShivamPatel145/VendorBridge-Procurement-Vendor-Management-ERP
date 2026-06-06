import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';

export const authRoutes = Router();

// POST /api/v1/auth/register
authRoutes.post('/register', AuthController.register);

// POST /api/v1/auth/login
authRoutes.post('/login', AuthController.login);

// POST /api/v1/auth/refresh
authRoutes.post('/refresh', AuthController.refresh);

// POST /api/v1/auth/logout
authRoutes.post('/logout', authenticate, AuthController.logout);

// GET /api/v1/auth/me
authRoutes.get('/me', authenticate, AuthController.me);

// POST /api/v1/auth/forgot-password
authRoutes.post('/forgot-password', AuthController.forgotPassword);

// POST /api/v1/auth/reset-password
authRoutes.post('/reset-password', AuthController.resetPassword);

export default authRoutes;
