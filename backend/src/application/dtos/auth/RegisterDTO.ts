import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * Register DTO
 *
 * Data Transfer Object for user registration.
 * Validates input from HTTP POST /auth/register requests.
 * Uses class-validator decorators for validation.
 */
export class RegisterDTO {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  public password!: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'Name contains invalid characters' })
  public name!: string;
}
