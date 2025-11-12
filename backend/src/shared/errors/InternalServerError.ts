import { AppError } from './AppError';

/**
 * Lỗi server internal
 * Status code: 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly name = 'InternalServerError';

  constructor(message: string = 'Internal server error') {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
