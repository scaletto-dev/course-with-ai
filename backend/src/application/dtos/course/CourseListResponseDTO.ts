import { CourseResponseDTO } from './CourseResponseDTO';

/**
 * Course List Response DTO
 *
 * Paginated list response format for multiple courses.
 * Used for pagination support in GetAll operations.
 */
export class CourseListResponseDTO {
  public items!: CourseResponseDTO[];

  public total!: number;

  public page!: number;

  public limit!: number;

  public totalPages!: number;
}
