import { Course } from '../../entities/Course.entity';
import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result, fail } from '@shared/types';
import { ValidationError, NotFoundError } from '@shared/errors';

/**
 * UpdateCourseInput
 * 
 * Input data transfer object for updating an existing course.
 * All fields are optional to allow partial updates.
 * 
 * @interface UpdateCourseInput
 */
export interface UpdateCourseInput {
  title?: string;
  instructor?: string;
  duration?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  students?: number;
  isActive?: boolean;
}

/**
 * UpdateCourseUseCase
 * 
 * Use case for updating an existing course in the system.
 * Implements business logic for course updates including:
 * - Input validation
 * - Existence verification
 * - Partial field updates
 * - Persistence via repository
 * 
 * @class UpdateCourseUseCase
 * 
 * @example
 * const useCase = new UpdateCourseUseCase(courseRepository);
 * const result = await useCase.execute('course-123', {
 *   title: 'Advanced Web Development',
 *   duration: '8 weeks',
 * });
 * 
 * if (result.isSuccess) {
 *   console.log('Course updated:', result.value.title);
 * }
 */
export class UpdateCourseUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute the use case.
   * 
   * @param {string} id - The ID of the course to update
   * @param {UpdateCourseInput} input - The fields to update
   * @returns {Promise<Result<Course>>} Result containing the updated course or error
   */
  public async execute(id: string, input: UpdateCourseInput): Promise<Result<Course>> {
    try {
      // Validate input
      if (!id || id.trim().length === 0) {
        return fail(new ValidationError('Course ID is required'));
      }

      // Find existing course
      const existingResult = await this.courseRepository.findById(id);

      if (!existingResult.isSuccess) {
        return existingResult as Result<Course>;
      }
      if (!existingResult.value) {
        return fail(new NotFoundError('Course not found'));
      }

      const existingCourse = existingResult.value;

      // Create updated course
      const updatedCourse = new Course({
        id: existingCourse.id,
        title: input.title || existingCourse.title,
        instructor: input.instructor || existingCourse.instructor,
        duration: input.duration || existingCourse.duration,
        description: input.description || existingCourse.description,
        thumbnail: input.thumbnail || existingCourse.thumbnail,
        category: input.category || existingCourse.category,
        difficulty: input.difficulty || existingCourse.difficulty,
        rating: input.rating || existingCourse.rating,
        students: input.students || existingCourse.students,
        isActive: input.isActive || existingCourse.isActive,
        createdAt: existingCourse.createdAt,
        updatedAt: new Date(),
      });

      // Update in repository
      const result = await this.courseRepository.update(updatedCourse);

      if (!result.isSuccess) {
        return result as Result<Course>;
      }

      return result as Result<Course>;
    } catch (error) {
      return error as Result<Course>;
    }
  }
}
