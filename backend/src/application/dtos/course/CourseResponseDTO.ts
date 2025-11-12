/**
 * CourseResponseDTO
 * Data Transfer Object cho HTTP response
 * Hiển thị thông tin khóa học (không có sensitive data)
 */
import { Course } from '../../../domain/entities';

export class CourseResponseDTO {
  public id!: string;
  public title!: string;
  public instructor!: string;
  public duration!: string;
  public description!: string;
  public thumbnail!: string;
  public category!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Static method tạo DTO từ course entity
   */
  public static fromEntity(entity: Course): CourseResponseDTO {
    const dto = new CourseResponseDTO();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.instructor = entity.instructor;
    dto.duration = entity.duration;
    dto.description = entity.description;
    dto.thumbnail = entity.thumbnail;
    dto.category = entity.category;
    dto.isActive = entity.isActive;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
