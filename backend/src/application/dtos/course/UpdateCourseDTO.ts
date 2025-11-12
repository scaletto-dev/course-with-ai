import { IsString, IsOptional, IsBoolean, Length, MinLength } from 'class-validator';

/**
 * UpdateCourseDTO
 * Data Transfer Object cho việc cập nhật khóa học
 */
export class UpdateCourseDTO {
  @IsString()
  @IsOptional()
  @Length(3, 200)
  public title?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  public instructor?: string;

  @IsString()
  @IsOptional()
  public duration?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  public description?: string;

  @IsString()
  @IsOptional()
  public thumbnail?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  public category?: string;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;
}
