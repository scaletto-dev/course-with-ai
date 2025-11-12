import { Course } from '../../domain/entities/Course.entity';
import { CourseResponseDTO } from '../dtos/course/CourseResponseDTO';
import { CourseListResponseDTO } from '../dtos/course/CourseListResponseDTO';
import { CreateCourseDTO } from '../dtos/course/CreateCourseDTO';
import { UpdateCourseDTO } from '../dtos/course/UpdateCourseDTO';
import { v4 as uuidv4 } from 'uuid';

/**
 * Course Mapper
 *
 * Handles bidirectional conversion between DTOs and domain entities.
 * Separates data transfer concerns from business logic.
 * Ensures proper data transformation and field mapping.
 */
export class CourseMapper {
  /**
   * Convert Create DTO to domain entity.
   * Generates new ID and timestamps.
   *
   * @param dto - The create DTO
   * @returns New domain Course entity
   */
  public static toDomain(dto: CreateCourseDTO): Course {
    return new Course({
      id: uuidv4(),
      title: dto.title,
      instructor: dto.instructor,
      duration: dto.duration,
      description: dto.description,
      thumbnail: dto.thumbnail,
      category: dto.category,
      difficulty: 'Beginner', // Default difficulty
      rating: 0, // Default rating
      students: 0, // Default students count
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Convert Update DTO to partial entity data.
   *
   * @param dto - The update DTO
   * @returns Partial entity data for updates
   */
  public static toUpdateData(dto: UpdateCourseDTO): Partial<Course> {
    const data: Partial<Course> = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.instructor !== undefined) data.instructor = dto.instructor;
    if (dto.duration !== undefined) data.duration = dto.duration;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.thumbnail !== undefined) data.thumbnail = dto.thumbnail;
    if (dto.category !== undefined) data.category = dto.category;

    return data;
  }

  /**
   * Map Course entity sang CourseResponseDTO
   *
   * Converts domain entity to response DTO.
   * Excludes sensitive fields if any.
   *
   * @param course - The domain Course entity
   * @returns Response DTO for API
   */
  public static toDTO(course: Course): CourseResponseDTO {
    return CourseResponseDTO.fromEntity(course);
  }

  /**
   * Map array của Course entities sang array của DTOs
   *
   * Converts multiple domain entities to response DTOs.
   *
   * @param courses - Array of domain Course entities
   * @returns Array of response DTOs
   */
  public static toDTOList(courses: Course[]): CourseResponseDTO[] {
    return courses.map(course => this.toDTO(course));
  }

  /**
   * Convert paginated results to list response DTO.
   *
   * @param data - Paginated data from repository
   * @returns Paginated list response DTO
   */
  public static toListDTO(data: {
    courses: Course[];
    total: number;
    page?: number;
    limit?: number;
  }): CourseListResponseDTO {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const totalPages = Math.ceil(data.total / limit);

    const dto = new CourseListResponseDTO();
    dto.items = this.toDTOList(data.courses);
    dto.total = data.total;
    dto.page = page;
    dto.limit = limit;
    dto.totalPages = totalPages;

    return dto;
  }
}
