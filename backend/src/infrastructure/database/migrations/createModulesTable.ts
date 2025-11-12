import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createModulesTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS modules (
        id VARCHAR(36) PRIMARY KEY,
        courseId VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        orderIndex INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
        INDEX idx_courseId (courseId),
        INDEX idx_order (orderIndex)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Modules table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Modules table already exists');
    } else {
      logger.error('Error creating modules table:', error);
      throw error;
    }
  }
}
