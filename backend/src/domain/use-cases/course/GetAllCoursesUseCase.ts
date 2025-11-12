import { Course } from '../../entities/Course.entity';
import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result } from '@shared/types';

/**
 * GetAllCoursesUseCase
 * 
 * Use case for retrieving all courses with pagination support.
 * Implements business logic for fetching courses including:
 * - Pagination handling
 * - Repository delegation
 * - Error propagation
 * 
 * @class GetAllCoursesUseCase
 * 
 * @example
 * const useCase = new GetAllCoursesUseCase(courseRepository);
 * const result = await useCase.execute(1, 10);
 * 
 * if (result.isSuccess) {
 *   console.log(`Found ${result.value.total} courses`);
 *   result.value.courses.forEach(course => console.log(course.title));
 * }
 */
export class GetAllCoursesUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute the use case.
   * 
   * @param {number} page - The page number (1-indexed)
   * @param {number} limit - The number of items per page
   * @returns {Promise<Result<{ courses: Course[]; total: number }>>} 
   *          Result containing paginated courses and total count
   */
  public async execute(
    page: number,
    limit: number,
  ): Promise<Result<{ courses: Course[]; total: number }>> {
    try {
      const result = await this.courseRepository.findAll(page, limit);

      if (!result.isSuccess) {
        return result;
      }

      return result;
    } catch (error) {
      return error as Result<{ courses: Course[]; total: number }>;
    }
  }
}
