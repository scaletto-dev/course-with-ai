import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createLessonsTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lessons (
        id VARCHAR(36) PRIMARY KEY,
        moduleId VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        duration VARCHAR(50),
        orderIndex INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE,
        INDEX idx_moduleId (moduleId),
        INDEX idx_order (orderIndex)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Lessons table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Lessons table already exists');
    } else {
      logger.error('Error creating lessons table:', error);
      throw error;
    }
  }
}
