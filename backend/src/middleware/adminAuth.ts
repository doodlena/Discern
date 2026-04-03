import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Simple admin authentication middleware
 * In production, use proper JWT tokens
 */
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Simple token check for demo
    // In production, verify JWT token
    const token = authHeader.replace('Bearer ', '');

    if (token === 'admin-authenticated' || token === process.env.ADMIN_PASSWORD) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
}
