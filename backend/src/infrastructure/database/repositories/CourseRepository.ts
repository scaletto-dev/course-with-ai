import { Course } from '../../../domain/entities/Course.entity';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import { Result, ok, fail } from '@shared/types';
import { DatabaseConnection } from '../mysql/DatabaseConnection';
import logger from '@shared/utils/logger';
import { InternalServerError } from '@shared/errors';

/**
 * CourseRepository
 * Implementation của ICourseRepository interface
 * Xử lý tất cả database operations liên quan tới Course
 */
export class CourseRepository implements ICourseRepository {
  public constructor(private db: DatabaseConnection) {}

  /**
   * Lưu course mới vào database
   */
  public async save(course: Course): Promise<Result<Course>> {
    const connection = await this.db.getConnection();

    try {
      const query = `
        INSERT INTO courses (
          id, title, instructor, duration, description, thumbnail, category, difficulty, rating, students, isActive, enrolled, progress, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        course.id,
        course.title,
        course.instructor,
        course.duration,
        course.description,
        course.thumbnail,
        course.category,
        course.difficulty,
        course.rating,
        course.students,
        course.isActive ? 1 : 0,
        course.enrolled ? 1 : 0,
        course.progress || 0,
        course.createdAt,
        course.updatedAt,
      ];

      await connection.execute(query, values);
      logger.info(`Course created successfully: ${course.id}`);
      return ok(course);
    } catch (error) {
      logger.error('Error saving course:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to save course',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Tìm course theo ID
   */
  public async findById(id: string): Promise<Result<Course | null>> {
    const connection = await this.db.getConnection();

    try {
      const query = 'SELECT * FROM courses WHERE id = ?';
      const [rows] = await connection.execute(query, [id]);
      const courseRow = (rows as unknown[])[0] as Record<string, unknown> | undefined;

      if (!courseRow) {
        return ok(null);
      }

      return ok(this.mapToCourse(courseRow));
    } catch (error) {
      logger.error('Error finding course by id:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to find course',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy tất cả courses với pagination
   */
  public async findAll(page: number, limit: number): Promise<Result<{
    courses: Course[];
    total: number;
  }>> {
    const connection = await this.db.getConnection();

    try {
      const offset = (page - 1) * limit;

      // Lấy total count
      const [countRows] = await connection.execute(
        'SELECT COUNT(*) as total FROM courses WHERE isActive = 1',
      );
      const total = ((countRows as unknown[])[0] as Record<string, unknown>).total as number;

      // Lấy courses - LIMIT and OFFSET must be part of the query string
      const query = `SELECT * FROM courses WHERE isActive = 1 ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;
      const [rows] = await connection.execute(query);
      const courses = (rows as unknown[]).map(row => this.mapToCourse(row as Record<string, unknown>));

      return ok({ courses, total });
    } catch (error) {
      logger.error('Error finding all courses:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to find courses',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy courses theo category
   */
  public async findByCategory(category: string, page: number, limit: number): Promise<Result<{
    courses: Course[];
    total: number;
  }>> {
    const connection = await this.db.getConnection();

    try {
      const offset = (page - 1) * limit;
      // Lấy total count
      const [countRows] = await connection.execute(
        'SELECT COUNT(*) as total FROM courses WHERE category = ? AND isActive = 1',
        [category],
      );
      const total = ((countRows as unknown[])[0] as Record<string, unknown>).total as number;

      // Lấy courses
      const query = `SELECT * FROM courses WHERE category = ? AND isActive = 1 ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;
      const [rows] = await connection.execute(query, [category]);
      const courses = (rows as unknown[]).map(row => this.mapToCourse(row as Record<string, unknown>));

      return ok({ courses, total });
    } catch (error) {
      logger.error('Error finding courses by category:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to find courses',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Cập nhật course
   */
  public async update(course: Course): Promise<Result<Course>> {
    const connection = await this.db.getConnection();

    try {
      const query = `
        UPDATE courses 
        SET title = ?, instructor = ?, duration = ?, description = ?, 
            thumbnail = ?, category = ?, isActive = ?, updatedAt = ?
        WHERE id = ?
      `;

      const values = [
        course.title,
        course.instructor,
        course.duration,
        course.description,
        course.thumbnail,
        course.category,
        course.isActive ? 1 : 0,
        course.updatedAt,
        course.id,
      ];

      await connection.execute(query, values);
      logger.info(`Course updated successfully: ${course.id}`);
      return ok(course);
    } catch (error) {
      logger.error('Error updating course:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to update course',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Xóa course (soft delete)
   */
  public async delete(id: string): Promise<Result<boolean>> {
    const connection = await this.db.getConnection();

    try {
      const query = 'UPDATE courses SET isActive = 0, updatedAt = NOW() WHERE id = ?';
      await connection.execute(query, [id]);
      logger.info(`Course deleted successfully: ${id}`);
      return ok(true);
    } catch (error) {
      logger.error('Error deleting course:', error);
      return fail(
        new InternalServerError(
          error instanceof Error ? error.message : 'Failed to delete course',
        ),
      );
    } finally {
      connection.release();
    }
  }

  /**
   * Map database row to Course entity
   */
  private mapToCourse(row: Record<string, unknown>): Course {
    return new Course({
      id: String(row.id),
      title: String(row.title),
      instructor: String(row.instructor),
      duration: String(row.duration),
      description: String(row.description),
      thumbnail: String(row.thumbnail),
      category: String(row.category),
      difficulty: String(row.difficulty) as 'Beginner' | 'Intermediate' | 'Advanced',
      rating: Number(row.rating),
      students: Number(row.students),
      isActive: Boolean(row.isActive),
      enrolled: Boolean(row.enrolled),
      progress: Number(row.progress) || 0,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    });
  }
}
