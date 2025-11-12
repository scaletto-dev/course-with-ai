import { Request, Response, NextFunction } from 'express';
import logger from '@shared/utils/logger';
import { AppError } from '@shared/errors';
import { errorResponse } from '@shared/utils/response';

/**
 * Error Handler Middleware
 * Xử lý tất cả errors trong application
 * Phải được đặt cuối cùng trong middleware stack
 */
export const errorHandlerMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error('Error caught by handler:', error);

  // Xử lý AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.message, error.statusCode, error.name));
    return;
  }

  // Xử lý unknown errors
  res.status(500).json(
    errorResponse(
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
      500,
      'InternalServerError',
    ),
  );
};
