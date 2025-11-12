import 'reflect-metadata';
import 'dotenv/config';
import { appConfig } from './infrastructure/config/appConfig';
import { setupDependencyInjection } from './infrastructure/config/dependencyInjection';
import { createExpressApp } from './infrastructure/config/expressApp';
import { DatabaseConnection } from './infrastructure/database/mysql/DatabaseConnection';
import { notFoundHandler } from './infrastructure/http/middlewares';
import logger from '@shared/utils/logger';

/**
 * Application Entry Point
 * Khởi tạo tất cả thành phần và start server
 */
async function main(): Promise<void> {
  try {
    logger.info(`Starting application in ${appConfig.nodeEnv} mode`);

    // 1. Setup Dependency Injection
    setupDependencyInjection();
    logger.info('Dependency Injection container initialized');

    // 2. Initialize Database
    const db = DatabaseConnection.getInstance();
    await db.initialize();

    // 3. Create Express App
    const app = createExpressApp();

    // 4. 404 Handler
    app.use(notFoundHandler);

    // 5. Start Server
    const server = app.listen(appConfig.port, () => {
      logger.info(`Server running on http://localhost:${appConfig.port}`);
      logger.info(`Environment: ${appConfig.nodeEnv}`);
    });

    // 6. Graceful Shutdown
    const shutdown = async (): Promise<void> => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        await db.close();
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start application
void main();
