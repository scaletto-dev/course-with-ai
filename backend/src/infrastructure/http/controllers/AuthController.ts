import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  GetUserUseCase,
} from '@domain/use-cases';
import { ValidationError } from '@shared/errors';
import logger from '@shared/utils/logger';
import { UserMapper } from '@application/mappers';

@injectable()
export class AuthController extends BaseController {
  public constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserUseCase: GetUserUseCase
  ) {
    super();
  }

  /**
   * Register a new user.
   *
   * HTTP Method: POST
   * Route: /auth/register
   * Body: RegisterDTO { email, password, name }
   * Response: 201 Created with UserResponseDTO and tokens
   *
   * @param req - Express request object with registration data
   * @param res - Express response object
   * @returns void
   *
   * @example
   * POST /api/auth/register
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePass123!",
   *   "name": "John Doe"
   * }
   * Response: { "success": true, "statusCode": 201, "data": { "user": {...}, "accessToken": "...", "refreshToken": "..." } }
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const result = await this.registerUseCase.execute({
        email,
        password,
        name,
      });

      // Use mapper to convert user entity to DTO
      const userDto = UserMapper.toDTO(result.user);
      const responseData = {
        user: userDto,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };

      this.handleCreated(res, responseData);
    } catch (error) {
      logger.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Login with email and password.
   *
   * HTTP Method: POST
   * Route: /auth/login
   * Body: LoginDTO { email, password }
   * Response: 200 OK with UserResponseDTO and tokens
   *
   * @param req - Express request object with login credentials
   * @param res - Express response object
   * @returns void
   *
   * @example
   * POST /api/auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePass123!"
   * }
   * Response: { "success": true, "statusCode": 200, "data": { "accessToken": "...", "refreshToken": "...", "user": {...} } }
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const result = await this.loginUseCase.execute({
        email,
        password,
      });

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      this.handleSuccess(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token.
   *
   * HTTP Method: POST
   * Route: /auth/refresh-token
   * Body: { refreshToken }
   * Response: 200 OK with new accessToken
   *
   * @param req - Express request object with refresh token
   * @param res - Express response object
   * @returns void
   *
   * @example
   * POST /api/auth/refresh-token
   * {
   *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Response: { "success": true, "statusCode": 200, "data": { "accessToken": "..." } }
   */
  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      const result = await this.refreshTokenUseCase.execute({
        refreshToken,
      });

      this.handleSuccess(res, {
        accessToken: result.accessToken,
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  /**
   * Logout user and invalidate refresh token.
   *
   * HTTP Method: POST
   * Route: /auth/logout
   * Requires: Authentication (valid JWT token)
   * Response: 200 OK with logout confirmation
   *
   * @param _req - Express request object (authenticated user)
   * @param res - Express response object
   * @returns void
   *
   * @example
   * POST /api/auth/logout
   * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   * Response: { "success": true, "statusCode": 200, "data": { "message": "Logged out successfully" } }
   */
  public async logout(_req: Request, res: Response): Promise<void> {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      this.handleSuccess(res, {
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user information.
   *
   * HTTP Method: GET
   * Route: /auth/me
   * Requires: Authentication (valid JWT token)
   * Response: 200 OK with UserResponseDTO
   *
   * @param req - Express request object (authenticated user)
   * @param res - Express response object
   * @returns void
   *
   * @example
   * GET /api/auth/me
   * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   * Response: { "success": true, "statusCode": 200, "data": { "id": "...", "email": "user@example.com", "name": "John Doe", "role": "user", "isActive": true, ... } }
   */
  public async getMe(req: Request, res: Response): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (req as any).userId;

      if (!userId) {
        throw new ValidationError('User ID not found in request');
      }

      const userEntity = await this.getUserUseCase.execute(userId);
      const userDto = UserMapper.toDTO(userEntity);

      this.handleSuccess(res, userDto);
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }
}
