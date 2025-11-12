import { IsString, IsEmail, IsNotEmpty, Length, Matches, IsOptional } from 'class-validator';

/**
 * Create User DTO
 *
 * Data Transfer Object for creating a new user.
 * Validates input from HTTP POST requests.
 * Similar to RegisterDTO but for admin user creation.
 */
export class CreateUserDTO {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  public password!: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'Name contains invalid characters' })
  public name!: string;

  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  public role?: 'user' | 'admin';
}
