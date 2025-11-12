import { Course } from '../entities/Course.entity';
import { Result } from '@shared/types';

/**
 * ICourseRepository
 * 
 * Repository interface for Course data access operations.
 * Defines the contract that all Course repository implementations must follow.
 * This interface belongs to the Domain layer and is independent of any persistence mechanism.
 * 
 * @interface ICourseRepository
 */
export interface ICourseRepository {
  /**
   * Save a new course to the repository.
   * 
   * @param {Course} course - The course entity to save
   * @returns {Promise<Result<Course>>} Result containing the saved course or error
   * 
   * @example
   * const course = new Course({ id: '123', title: 'Web Dev', ... });
   * const result = await courseRepository.save(course);
   * if (result.isSuccess) {
   *   console.log('Course saved:', result.value);
   * }
   */
  save(course: Course): Promise<Result<Course>>;

  /**
   * Find a course by its ID.
   * 
   * @param {string} id - The unique course identifier
   * @returns {Promise<Result<Course | null>>} Result containing the course or null if not found
   * 
   * @example
   * const result = await courseRepository.findById('course-123');
   * if (result.isSuccess && result.value) {
   *   console.log('Found course:', result.value.title);
   * }
   */
  findById(id: string): Promise<Result<Course | null>>;

  /**
   * Find all courses with pagination support.
   * 
   * @param {number} page - The page number (1-indexed)
   * @param {number} limit - The maximum number of courses per page
   * @returns {Promise<Result<{ courses: Course[]; total: number }>>} 
   *          Result containing paginated courses and total count
   * 
   * @example
   * const result = await courseRepository.findAll(1, 10);
   * if (result.isSuccess) {
   *   console.log(`Page 1: ${result.value.courses.length} of ${result.value.total} courses`);
   * }
   */
  findAll(page: number, limit: number): Promise<Result<{
    courses: Course[];
    total: number;
  }>>;

  /**
   * Find courses by category with pagination support.
   * 
   * @param {string} category - The course category to filter by
   * @param {number} page - The page number (1-indexed)
   * @param {number} limit - The maximum number of courses per page
   * @returns {Promise<Result<{ courses: Course[]; total: number }>>} 
   *          Result containing paginated courses in the category and total count
   * 
   * @example
   * const result = await courseRepository.findByCategory('Web Development', 1, 10);
   * if (result.isSuccess) {
   *   console.log(`Found ${result.value.total} courses in Web Development category`);
   * }
   */
  findByCategory(category: string, page: number, limit: number): Promise<Result<{
    courses: Course[];
    total: number;
  }>>;

  /**
   * Update an existing course.
   * 
   * @param {Course} course - The course entity with updated values
   * @returns {Promise<Result<Course>>} Result containing the updated course or error
   * 
   * @example
   * const updatedCourse = new Course({ ...existingCourse, title: 'New Title' });
   * const result = await courseRepository.update(updatedCourse);
   * if (result.isSuccess) {
   *   console.log('Course updated:', result.value.title);
   * }
   */
  update(course: Course): Promise<Result<Course>>;

  /**
   * Delete a course (soft delete).
   * Sets the isActive flag to false instead of actually removing the course from the database.
   * This preserves data integrity and maintains referential consistency.
   * 
   * @param {string} id - The unique course identifier
   * @returns {Promise<Result<boolean>>} Result indicating success or error
   * 
   * @example
   * const result = await courseRepository.delete('course-123');
   * if (result.isSuccess) {
   *   console.log('Course deactivated successfully');
   * }
   */
  delete(id: string): Promise<Result<boolean>>;
}
