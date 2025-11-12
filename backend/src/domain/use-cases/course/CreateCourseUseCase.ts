import { Course } from '../../entities/Course.entity';
import { ICourseRepository } from '../../repositories/ICourseRepository';
import { Result, ok, fail } from '@shared/types';
import { ValidationError } from '@shared/errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * CreateCourseInput
 * 
 * Input data transfer object for creating a new course.
 * Contains all required fields for course creation.
 * 
 * @interface CreateCourseInput
 */
export interface CreateCourseInput {
  title: string;
  instructor: string;
  duration: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

/**
 * CreateCourseUseCase
 * 
 * Use case for creating a new course in the system.
 * Implements business logic for course creation including:
 * - Input validation
 * - Course entity instantiation
 * - Persistence via repository
 * - Error handling
 * 
 * @class CreateCourseUseCase
 * 
 * @example
 * const useCase = new CreateCourseUseCase(courseRepository);
 * const result = await useCase.execute({
 *   title: 'Web Development',
 *   instructor: 'John Doe',
 *   duration: '6 weeks',
 *   description: 'Learn web development...',
 *   thumbnail: 'https://...',
 *   category: 'Technology',
 * });
 * 
 * if (result.isSuccess) {
 *   console.log('Course created:', result.value.id);
 * }
 */
export class CreateCourseUseCase {
  public constructor(private courseRepository: ICourseRepository) {}

  /**
   * Execute the use case.
   * 
   * @param {CreateCourseInput} input - The course data to create
   * @returns {Promise<Result<Course>>} Result containing the created course or error
   */
  public async execute(input: CreateCourseInput): Promise<Result<Course>> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (!validation.isValid) {
        return fail(new ValidationError(validation.error || 'Validation failed'));
      }

      // Create new course
      const course = new Course({
        id: uuidv4(),
        title: input.title,
        instructor: input.instructor,
        duration: input.duration,
        description: input.description,
        thumbnail: input.thumbnail,
        category: input.category,
        difficulty: input.difficulty || 'Beginner',
        rating: 0,
        students: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save to repository
      const result = await this.courseRepository.save(course);

      if (!result.isSuccess) {
        return result;
      }

      return ok(result.value);
    } catch (error) {
      return fail(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  private validateInput(input: CreateCourseInput): { isValid: boolean; error?: string } {
    if (!input.title || input.title.trim().length === 0) {
      return { isValid: false, error: 'Title is required' };
    }

    if (!input.instructor || input.instructor.trim().length === 0) {
      return { isValid: false, error: 'Instructor is required' };
    }

    if (!input.duration || input.duration.trim().length === 0) {
      return { isValid: false, error: 'Duration is required' };
    }

    if (!input.description || input.description.trim().length === 0) {
      return { isValid: false, error: 'Description is required' };
    }

    if (!input.thumbnail || input.thumbnail.trim().length === 0) {
      return { isValid: false, error: 'Thumbnail is required' };
    }

    if (!input.category || input.category.trim().length === 0) {
      return { isValid: false, error: 'Category is required' };
    }

    return { isValid: true };
  }
}
