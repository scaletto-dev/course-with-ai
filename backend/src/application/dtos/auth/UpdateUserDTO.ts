import { IsString, IsEmail, Length, Matches, IsOptional } from 'class-validator';

/**
 * Update User DTO
 *
 * Data Transfer Object for updating an existing user.
 * All fields are optional for partial updates.
 * Validates input from HTTP PUT/PATCH requests.
 */
export class UpdateUserDTO {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'Name contains invalid characters' })
  public name?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  public email?: string;

  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  public password?: string;

  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  public role?: 'user' | 'admin';
}
