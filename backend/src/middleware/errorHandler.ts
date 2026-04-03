import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
}
