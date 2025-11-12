import { Request, Response, NextFunction } from 'express';
import logger from '@shared/utils/logger';

/**
 * Request Logging Middleware
 * Logs all incoming requests with method, path, status code, and response time on a single line
 */
export const requestLoggingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();

  // Hook into multiple response methods to capture all responses
  const originalSend = _res.send;
  const originalJson = _res.json;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _res.send = function (data: any) {
    const duration = Date.now() - startTime;
    logger.info(`[${req.method}] ${req.originalUrl} - ${_res.statusCode} (${duration}ms)`);
    return originalSend.call(this, data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _res.json = function (data: any) {
    const duration = Date.now() - startTime;
    logger.info(`[${req.method}] ${req.originalUrl} - ${_res.statusCode} (${duration}ms)`);
    return originalJson.call(this, data);
  };

  next();
};
