import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@shared/errors';
import logger from '@shared/utils/logger';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const secret = process.env.JWT_ACCESS_SECRET || '';

    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: string;
    };

    // Attach user info to request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).userId = decoded.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).userEmail = decoded.email;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const adminMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (req as any).userRole;

    if (userRole !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }

    next();
  } catch (error) {
    logger.error('Admin middleware error:', error);
    throw new UnauthorizedError('Access denied');
  }
};
