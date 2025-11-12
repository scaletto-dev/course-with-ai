/**
 * Base application error class
 * Tất cả custom errors trong application đều kế thừa từ class này
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly name: string;

  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
