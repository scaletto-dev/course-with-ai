import { Router, Request, Response, NextFunction } from 'express';
import { CourseController } from '../controllers/CourseController';
import { authMiddleware, adminMiddleware } from '../middlewares';

/**
 * Course Routes
 * Defines all endpoints related to course management
 */
export function createCourseRoutes(courseController: CourseController): Router {
  const router = Router();

  /**
   * POST /courses
   * Create a new course
   * Requires: Authentication, Admin role
   * Body: { title, instructor, duration, description, thumbnail, category }
   * Response: { course }
   */
  router.post('/', authMiddleware, adminMiddleware, (req: Request, res: Response, next: NextFunction) => {
    void courseController.create(req, res, next);
  });

  /**
   * GET /courses/:id
   * Get course by ID
   * Public endpoint
   * Response: { course }
   */
  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    void courseController.getById(req, res, next);
  });

  /**
   * GET /courses/category/:category
   * Get courses by category with pagination
   * Public endpoint
   * Query: ?page=1&limit=10
   * Response: { courses, total, page, limit, totalPages }
   */
  router.get('/category/:category', (req: Request, res: Response, next: NextFunction) => {
    void courseController.getByCategory(req, res, next);
  });

  /**
   * GET /courses
   * Get all courses with pagination
   * Public endpoint
   * Query: ?page=1&limit=10
   * Response: { courses, total, page, limit, totalPages }
   */
  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    void courseController.getAll(req, res, next);
  });

  /**
   * PUT /courses/:id
   * Update course information
   * Requires: Authentication, Admin role
   * Body: Partial course data
   * Response: { course }
   */
  router.put('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response, next: NextFunction) => {
    void courseController.update(req, res, next);
  });

  /**
   * DELETE /courses/:id
   * Delete course (soft delete)
   * Requires: Authentication, Admin role
   * Response: { message }
   */
  router.delete('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response, next: NextFunction) => {
    void courseController.delete(req, res, next);
  });

  return router;
}
