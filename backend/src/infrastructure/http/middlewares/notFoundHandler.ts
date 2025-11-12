import { Request, Response } from 'express';

/**
 * 404 Not Found Handler Middleware
 *
 * Handles all requests that don't match any route.
 * Should be placed LAST in middleware chain.
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: {
      message: 'Not Found',
    },
    timestamp: new Date().toISOString(),
  });
};
