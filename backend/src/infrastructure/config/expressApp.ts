import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { container } from 'tsyringe';
import { appConfig } from './appConfig';
import { requestLoggingMiddleware, errorHandlerMiddleware } from '../http/middlewares';
import { createAuthRoutes } from '../http/routes/authRoutes';
import { createCourseRoutes } from '../http/routes/courseRoutes';
import { AuthController } from '../http/controllers/AuthController';
import { CourseController } from '../http/controllers/CourseController';
import logger from '@shared/utils/logger';

/**
 * Express App Factory
 * Khởi tạo Express app với tất cả middleware
 */
export function createExpressApp(): Express {
  const app = express();

  // Trust proxy
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(
    cors({
      origin: appConfig.corsOrigin,
      credentials: true,
    }),
  );

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: appConfig.rateLimit.windowMs,
    max: appConfig.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));

  // Request logging middleware
  app.use(requestLoggingMiddleware);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  const authController = container.resolve(AuthController);
  const courseController = container.resolve(CourseController);
  
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/courses', createCourseRoutes(courseController));

  logger.info('Express app created successfully');

  // Error handler middleware (phải ở cuối cùng)
  app.use(errorHandlerMiddleware);

  return app;
}
