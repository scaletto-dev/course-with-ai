import { AppError } from './AppError';

/**
 * Lỗi khi tài nguyên không được tìm thấy
 * Status code: 404 Not Found
 */
export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly name = 'NotFoundError';

  constructor(message: string = 'Resource not found') {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
