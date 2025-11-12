import 'dotenv/config';
import mysql from 'mysql2/promise';
import logger from '@shared/utils/logger';

/**
 * Migration: Create users table
 */
const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email',
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    name VARCHAR(255) NOT NULL COMMENT 'User full name',
    role ENUM('user', 'admin') DEFAULT 'user' COMMENT 'User role',
    isActive BOOLEAN DEFAULT true COMMENT 'User active status',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    KEY idx_email (email),
    KEY idx_role (role),
    KEY idx_createdAt (createdAt)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create courses table
 */
const CREATE_COURSES_TABLE = `
  CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    title VARCHAR(255) NOT NULL COMMENT 'Course title',
    instructor VARCHAR(255) NOT NULL COMMENT 'Instructor name',
    duration VARCHAR(100) NOT NULL COMMENT 'Course duration',
    description LONGTEXT NOT NULL COMMENT 'Course description',
    thumbnail VARCHAR(255) COMMENT 'Thumbnail image URL',
    category VARCHAR(100) NOT NULL COMMENT 'Course category',
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner' COMMENT 'Difficulty level',
    rating FLOAT DEFAULT 0 COMMENT 'Course rating',
    students INT DEFAULT 0 COMMENT 'Number of students',
    isActive BOOLEAN DEFAULT true COMMENT 'Course active status',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    KEY idx_category (category),
    KEY idx_difficulty (difficulty),
    KEY idx_isActive (isActive)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create modules table
 */
const CREATE_MODULES_TABLE = `
  CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    courseId VARCHAR(36) NOT NULL COMMENT 'FK to courses',
    title VARCHAR(255) NOT NULL COMMENT 'Module title',
    orderIndex INT NOT NULL COMMENT 'Display order',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    KEY idx_courseId (courseId),
    KEY idx_order (orderIndex)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create lessons table
 */
const CREATE_LESSONS_TABLE = `
  CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    moduleId VARCHAR(36) NOT NULL COMMENT 'FK to modules',
    title VARCHAR(255) NOT NULL COMMENT 'Lesson title',
    duration VARCHAR(50) COMMENT 'Lesson duration',
    orderIndex INT NOT NULL COMMENT 'Display order',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    
    FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE,
    KEY idx_moduleId (moduleId),
    KEY idx_order (orderIndex)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create lesson_contents table
 */
const CREATE_LESSON_CONTENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS lesson_contents (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    lessonId VARCHAR(36) NOT NULL COMMENT 'FK to lessons',
    videoUrl VARCHAR(255) COMMENT 'Video URL',
    transcript LONGTEXT COMMENT 'Video transcript',
    notes TEXT COMMENT 'Notes and key takeaways',
    downloadLink VARCHAR(255) COMMENT 'Download link',
    aiSummary LONGTEXT COMMENT 'AI-generated HTML summary',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
    KEY idx_lessonId (lessonId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create enrollments table
 */
const CREATE_ENROLLMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    userId VARCHAR(36) NOT NULL COMMENT 'FK to users',
    courseId VARCHAR(36) NOT NULL COMMENT 'FK to courses',
    progress INT DEFAULT 0 COMMENT 'Progress percentage (0-100)',
    enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Enrollment timestamp',
    lastAccessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last access timestamp',
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (userId, courseId),
    KEY idx_userId (userId),
    KEY idx_courseId (courseId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Migration: Create lesson_progress table
 */
const CREATE_LESSON_PROGRESS_TABLE = `
  CREATE TABLE IF NOT EXISTS lesson_progress (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    userId VARCHAR(36) NOT NULL COMMENT 'FK to users',
    lessonId VARCHAR(36) NOT NULL COMMENT 'FK to lessons',
    completed BOOLEAN DEFAULT false COMMENT 'Completion status',
    completedAt TIMESTAMP NULL COMMENT 'Completion timestamp',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (userId, lessonId),
    KEY idx_userId (userId),
    KEY idx_lessonId (lessonId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Run migrations
 */
async function runMigrations(): Promise<void> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });

  try {
    // Create database if not exists
    const dbName = process.env.DB_NAME || 'coursera_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    logger.info(`Database '${dbName}' created or already exists`);

    // Select database
    await connection.query(`USE \`${dbName}\``);

    // Run migrations in order
    await connection.query(CREATE_USERS_TABLE);
    logger.info('✅ Users table created');

    await connection.query(CREATE_COURSES_TABLE);
    logger.info('✅ Courses table created');

    await connection.query(CREATE_MODULES_TABLE);
    logger.info('✅ Modules table created');

    await connection.query(CREATE_LESSONS_TABLE);
    logger.info('✅ Lessons table created');

    await connection.query(CREATE_LESSON_CONTENTS_TABLE);
    logger.info('✅ Lesson contents table created');

    await connection.query(CREATE_ENROLLMENTS_TABLE);
    logger.info('✅ Enrollments table created');

    await connection.query(CREATE_LESSON_PROGRESS_TABLE);
    logger.info('✅ Lesson progress table created');

    logger.info('🎉 All migrations completed successfully');
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run migrations
runMigrations().catch(error => {
  logger.error('❌ Migration script failed:', error);
  process.exit(1);
});
