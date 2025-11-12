import { AppError } from './AppError';

/**
 * Lỗi khi validation dữ liệu đầu vào thất bại
 * Status code: 400 Bad Request
 */
export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly name = 'ValidationError';

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
