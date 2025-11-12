import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result, fail } from '@shared/types';
import { ValidationError, NotFoundError } from '@shared/errors';

/**
 * DeleteCourseUseCase
 */
export class DeleteCourseUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  public async execute(id: string): Promise<Result<boolean>> {
    try {
      // Validate input
      if (!id || id.trim().length === 0) {
        return fail(new ValidationError('Course ID is required'));
      }

      // Check if course exists
      const existingResult = await this.courseRepository.findById(id);

      if (!existingResult.isSuccess) {
        return existingResult as Result<boolean>;
      }

      if (!existingResult.value) {
        return fail(new NotFoundError('Course not found'));
      }

      // Delete course
      const result = await this.courseRepository.delete(id);

      if (!result.isSuccess) {
        return result as Result<boolean>;
      }

      return result as Result<boolean>;
    } catch (error) {
      return error as Result<boolean>;
    }
  }
}
