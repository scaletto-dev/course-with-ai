import { AppError } from './AppError';

/**
 * Lỗi khi dữ liệu đã tồn tại trong hệ thống
 * Status code: 409 Conflict
 */
export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly name = 'ConflictError';

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
