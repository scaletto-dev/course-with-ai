import { Course } from '../../entities/Course.entity';
import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result, fail } from '@shared/types';
import { NotFoundError } from '@shared/errors';

/**
 * GetCourseByIdUseCase
 * 
 * Use case for retrieving a single course by its ID.
 * Implements business logic for fetching a specific course including:
 * - Input validation
 * - Not found error handling
 * - Repository delegation
 * 
 * @class GetCourseByIdUseCase
 * 
 * @example
 * const useCase = new GetCourseByIdUseCase(courseRepository);
 * const result = await useCase.execute('course-123');
 * 
 * if (result.isSuccess && result.value) {
 *   console.log('Found course:', result.value.title);
 * }
 */
export class GetCourseByIdUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute the use case.
   * 
   * @param {string} id - The course ID to retrieve
   * @returns {Promise<Result<Course>>} Result containing the course or error
   */
  public async execute(id: string): Promise<Result<Course>> {
    try {
      // Validate input
      if (!id || id.trim().length === 0) {
        return fail(new NotFoundError('Course ID is required'));
      }

      // Find course
      const result = await this.courseRepository.findById(id);

      if (!result.isSuccess) {
        return result;
      }

      if (!result.value) {
        return fail(new NotFoundError('Course not found'));
      }

      return result as Result<Course>;
    } catch (error) {
      return error as Result<Course>;
    }
  }
}
