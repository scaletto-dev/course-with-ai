import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Login DTO
 *
 * Data Transfer Object for user login.
 * Validates input from HTTP POST /auth/login requests.
 * Uses class-validator decorators for validation.
 */
export class LoginDTO {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  public password!: string;
}
