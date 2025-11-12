import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import logger from '@shared/utils/logger';

// Use Cases
import {
  CreateCourseUseCase,
  CreateCourseInput,
  GetAllCoursesUseCase,
  GetCourseByIdUseCase,
  GetCoursesByCategoryUseCase,
  UpdateCourseUseCase,
  UpdateCourseInput,
  DeleteCourseUseCase,
} from '@domain/use-cases';
import { CourseMapper } from '@application/mappers';

/**
 * CourseController
 *
 * Handles all HTTP requests related to Course operations.
 * Delegates business logic to use cases and uses BaseController for response handling.
 *
 * Responsibilities:
 * - Parse HTTP requests and extract parameters/body
 * - Call appropriate use cases
 * - Handle responses through BaseController methods
 * - Log errors and pass exceptions to error middleware
 *
 * @class CourseController
 * @extends BaseController
 */
@injectable()
export class CourseController extends BaseController {
  /**
   * Initialize CourseController with all required use cases.
   *
   * @param createCourseUseCase - Use case for creating courses
   * @param getAllCoursesUseCase - Use case for fetching all courses
   * @param getCourseByIdUseCase - Use case for fetching a course by ID
   * @param getCoursesByCategoryUseCase - Use case for fetching courses by category
   * @param updateCourseUseCase - Use case for updating a course
   * @param deleteCourseUseCase - Use case for deleting a course
   */
  public constructor(
    private createCourseUseCase: CreateCourseUseCase,
    private getAllCoursesUseCase: GetAllCoursesUseCase,
    private getCourseByIdUseCase: GetCourseByIdUseCase,
    private getCoursesByCategoryUseCase: GetCoursesByCategoryUseCase,
    private updateCourseUseCase: UpdateCourseUseCase,
    private deleteCourseUseCase: DeleteCourseUseCase,
  ) {
    super();
  }

  /**
   * Create a new course.
   *
   * HTTP Method: POST
   * Route: /courses
   * Body: CreateCourseInput { title, instructor, duration, description, thumbnail, category }
   * Response: 201 Created with CourseDTO
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * POST /api/courses
   * {
   *   "title": "Web Development 101",
   *   "instructor": "John Doe",
   *   "duration": "6 weeks",
   *   "description": "Learn web development...",
   *   "thumbnail": "https://...",
   *   "category": "Web Development"
   * }
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateCourseInput = req.body;
      const result = await this.createCourseUseCase.execute(input);
      
      if (result.isSuccess) {
        const courseDto = CourseMapper.toDTO(result.value);
        this.handleSuccess(res, courseDto, 201);
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error creating course:', error);
      next(error);
    }
  }

  /**
   * Retrieve all courses with pagination support.
   *
   * HTTP Method: GET
   * Route: /courses
   * Query Parameters: page (default: 1), limit (default: 10, max: 100)
   * Response: 200 OK with paginated courses and metadata
   *
   * @param req - Express request object with query parameters
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * GET /api/courses?page=1&limit=10
   * Response:
   * {
   *   "success": true,
   *   "statusCode": 200,
   *   "data": [...courses],
   *   "meta": {
   *     "total": 50,
   *     "page": 1,
   *     "limit": 10,
   *     "totalPages": 5
   *   },
   *   "timestamp": "2025-11-11T..."
   * }
   */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = this.getPaginationQuery(req.query);

      const result = await this.getAllCoursesUseCase.execute(page, limit);

      if (result.isSuccess) {
        const listDto = CourseMapper.toListDTO(result.value);
        this.handleSuccessWithPagination(
          res,
          listDto.items,
          listDto.total,
          listDto.page,
          listDto.limit,
        );
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error getting all courses:', error);
      next(error);
    }
  }

  /**
   * Retrieve a single course by its ID.
   *
   * HTTP Method: GET
   * Route: /courses/:id
   * Path Parameters: id (UUID string)
   * Response: 200 OK with course data or 404 Not Found
   *
   * @param req - Express request object with course ID in params
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * GET /api/courses/550e8400-e29b-41d4-a716-446655440000
   * Response:
   * {
   *   "success": true,
   *   "statusCode": 200,
   *   "data": { ...course },
   *   "timestamp": "2025-11-11T..."
   * }
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.getCourseByIdUseCase.execute(id);
      
      if (result.isSuccess) {
        const courseDto = CourseMapper.toDTO(result.value);
        this.handleSuccess(res, courseDto);
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error getting course by ID:', error);
      next(error);
    }
  }

  /**
   * Retrieve courses filtered by category with pagination support.
   *
   * HTTP Method: GET
   * Route: /courses/category/:category
   * Path Parameters: category (string)
   * Query Parameters: page (default: 1), limit (default: 10, max: 100)
   * Response: 200 OK with paginated courses and metadata or 400 Bad Request
   *
   * @param req - Express request object with category in params
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * GET /api/courses/category/Web%20Development?page=1&limit=10
   * Response:
   * {
   *   "success": true,
   *   "statusCode": 200,
   *   "data": [...courses],
   *   "meta": {
   *     "total": 15,
   *     "page": 1,
   *     "limit": 10,
   *     "totalPages": 2
   *   },
   *   "timestamp": "2025-11-11T..."
   * }
   */
  public async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const { page, limit } = this.getPaginationQuery(req.query);

      const result = await this.getCoursesByCategoryUseCase.execute(category, page, limit);

      if (result.isSuccess) {
        const listDto = CourseMapper.toListDTO(result.value);
        this.handleSuccessWithPagination(
          res,
          listDto.items,
          listDto.total,
          listDto.page,
          listDto.limit,
        );
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error getting courses by category:', error);
      next(error);
    }
  }

  /**
   * Update an existing course.
   *
   * HTTP Method: PUT
   * Route: /courses/:id
   * Path Parameters: id (UUID string)
   * Body: UpdateCourseInput (all fields optional)
   * Response: 200 OK with updated course or 404 Not Found
   *
   * @param req - Express request object with course ID and update data
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * PUT /api/courses/550e8400-e29b-41d4-a716-446655440000
   * {
   *   "title": "Updated Title",
   *   "isActive": false
   * }
   * Response: { "success": true, "statusCode": 200, "data": {...updated course} }
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateCourseInput = req.body;

      const result = await this.updateCourseUseCase.execute(id, input);
      
      if (result.isSuccess) {
        const courseDto = CourseMapper.toDTO(result.value);
        this.handleSuccess(res, courseDto);
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error updating course:', error);
      next(error);
    }
  }

  /**
   * Delete a course (soft delete - sets isActive to false).
   *
   * HTTP Method: DELETE
   * Route: /courses/:id
   * Path Parameters: id (UUID string)
   * Response: 204 No Content on success or 404 Not Found
   *
   * @param req - Express request object with course ID in params
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void
   *
   * @example
   * DELETE /api/courses/550e8400-e29b-41d4-a716-446655440000
   * Response: 204 No Content (empty body)
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.deleteCourseUseCase.execute(id);

      if (result.isSuccess) {
        this.handleNoContent(res);
      } else {
        this.handleError(res, result.error);
      }
    } catch (error) {
      logger.error('Error deleting course:', error);
      next(error);
    }
  }
}
