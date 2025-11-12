import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export async function createLessonContentsTable(): Promise<void> {
  try {
    const connection = await DatabaseConnection.getInstance().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lesson_contents (
        id VARCHAR(36) PRIMARY KEY,
        lessonId VARCHAR(36) NOT NULL,
        videoUrl VARCHAR(255),
        transcript LONGTEXT,
        notes TEXT,
        downloadLink VARCHAR(255),
        aiSummary LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
        INDEX idx_lessonId (lessonId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    logger.info('Lesson contents table created successfully');

    connection.end();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any).code === 'ER_TABLE_EXISTS_ERROR') {
      logger.info('Lesson contents table already exists');
    } else {
      logger.error('Error creating lesson contents table:', error);
      throw error;
    }
  }
}
