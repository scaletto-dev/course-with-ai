import { UserResponseDTO } from './UserResponseDTO';

/**
 * User List Response DTO
 *
 * Paginated list response format for multiple users.
 * Used for pagination support in GetAll operations.
 */
export class UserListResponseDTO {
  public items!: UserResponseDTO[];

  public total!: number;

  public page!: number;

  public limit!: number;

  public totalPages!: number;
}
