import { IsString, IsNotEmpty, Length, MinLength } from 'class-validator';

/**
 * CreateCourseDTO
 * Data Transfer Object cho việc tạo khóa học mới
 */
export class CreateCourseDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  public title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  public instructor!: string;

  @IsString()
  @IsNotEmpty()
  public duration!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  public description!: string;

  @IsString()
  @IsNotEmpty()
  public thumbnail!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  public category!: string;
}
