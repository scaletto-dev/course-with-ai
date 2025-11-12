import { Course } from '../../entities/Course.entity';
import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result, fail } from '@shared/types';
import { ValidationError } from '@shared/errors';

/**
 * GetCoursesByCategoryUseCase
 * 
 * Use case for retrieving courses filtered by category with pagination support.
 * Implements business logic for fetching courses by category including:
 * - Input validation
 * - Category filtering
 * - Pagination handling
 * - Repository delegation
 * 
 * @class GetCoursesByCategoryUseCase
 * 
 * @example
 * const useCase = new GetCoursesByCategoryUseCase(courseRepository);
 * const result = await useCase.execute('Web Development', 1, 10);
 * 
 * if (result.isSuccess) {
 *   console.log(`Found ${result.value.total} courses in Web Development`);
 * }
 */
export class GetCoursesByCategoryUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute the use case.
   * 
   * @param {string} category - The category to filter by
   * @param {number} page - The page number (1-indexed)
   * @param {number} limit - The number of items per page
   * @returns {Promise<Result<{ courses: Course[]; total: number }>>} 
   *          Result containing filtered paginated courses and total count
   */
  public async execute(
    category: string,
    page: number,
    limit: number,
  ): Promise<Result<{ courses: Course[]; total: number }>> {
    try {
      // Validate input
      if (!category || category.trim().length === 0) {
        return fail(new ValidationError('Category is required'));
      }

      // Find courses by category
      const result = await this.courseRepository.findByCategory(category, page, limit);

      if (!result.isSuccess) {
        return result;
      }

      return result;
    } catch (error) {
      return error as Result<{ courses: Course[]; total: number }>;
    }
  }
}
