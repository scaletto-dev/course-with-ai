import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createLessonProgressTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        lessonId VARCHAR(36) NOT NULL,
        completed BOOLEAN DEFAULT false,
        completedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_lesson (userId, lessonId),
        INDEX idx_userId (userId),
        INDEX idx_lessonId (lessonId),
        INDEX idx_completed (completed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Lesson progress table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Lesson progress table already exists');
    } else {
      logger.error('Error creating lesson progress table:', error);
      throw error;
    }
  }
}
