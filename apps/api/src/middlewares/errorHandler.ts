import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import prisma from '../config/database';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        code: 'CONFLICT',
        message: 'A record with this value already exists',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'Record not found',
      });
      return;
    }
  }

  // Neon DB auto-suspend: "terminating connection due to administrator command"
  // Neon free tier suspends after ~5 min inactivity.
  // The first request after resume hits this — tell client to retry in 2-3 seconds.
  const errMsg = err instanceof Error ? err.message : String(err);
  const isNeonSuspend =
    errMsg.includes('terminating connection') ||
    errMsg.includes('E57P01') ||
    errMsg.includes('Server has closed the connection') ||
    err instanceof Prisma.PrismaClientInitializationError;

  if (isNeonSuspend) {
    console.warn('⚠️  Neon DB waking from suspension — client should retry.');
    prisma.$disconnect().then(() => prisma.$connect()).catch(() => {});
    res.status(503).json({
      success: false,
      code: 'DB_WAKING',
      message: 'Database is waking up from sleep. Please retry in 2-3 seconds.',
    });
    return;
  }

  // Unhandled errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
};
