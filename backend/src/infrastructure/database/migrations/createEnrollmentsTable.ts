import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createEnrollmentsTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        courseId VARCHAR(36) NOT NULL,
        progress INT DEFAULT 0,
        enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastAccessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_course (userId, courseId),
        INDEX idx_userId (userId),
        INDEX idx_courseId (courseId),
        INDEX idx_progress (progress)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Enrollments table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Enrollments table already exists');
    } else {
      logger.error('Error creating enrollments table:', error);
      throw error;
    }
  }
}
