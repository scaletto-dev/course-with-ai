import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly name = 'UnauthorizedError';

  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
