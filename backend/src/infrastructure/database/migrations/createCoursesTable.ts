import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createCoursesTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        instructor VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        description LONGTEXT NOT NULL,
        thumbnail VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
        rating FLOAT DEFAULT 0,
        students INT DEFAULT 0,
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_difficulty (difficulty),
        INDEX idx_isActive (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Courses table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Courses table already exists');
    } else {
      logger.error('Error creating courses table:', error);
      throw error;
    }
  }
}
