import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares';

/**
 * Authentication Routes
 * Defines all endpoints related to user authentication and authorization
 */
export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  /**
   * POST /auth/register
   * Register a new user account
   * Public endpoint
   * Body: { email, password, name }
   * Response: { accessToken, refreshToken, user }
   */
  router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    void authController.register(req, res).catch(next);
  });

  /**
   * POST /auth/login
   * Login with email and password
   * Public endpoint
   * Body: { email, password }
   * Response: { accessToken, refreshToken, user }
   */
  router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    void authController.login(req, res).catch(next);
  });

  /**
   * POST /auth/refresh-token
   * Refresh access token using refresh token
   * Public endpoint
   * Body: { refreshToken }
   * Response: { accessToken }
   */
  router.post('/refresh-token', (req: Request, res: Response, next: NextFunction) => {
    void authController.refreshToken(req, res).catch(next);
  });

  /**
   * POST /auth/logout
   * Logout and invalidate tokens
   * Requires: Authentication
   * Response: { message }
   */
  router.post('/logout', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    void authController.logout(req, res).catch(next);
  });

  /**
   * GET /auth/me
   * Get current authenticated user information
   * Requires: Authentication
   * Response: { user }
   */
  router.get('/me', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    void authController.getMe(req, res).catch(next);
  });

  return router;
}

export default createAuthRoutes;
