/**
 * User Response DTO
 *
 * Output format for API responses.
 * Excludes sensitive fields (password, internal flags).
 * Used for serialization to JSON in API responses.
 */
export class UserResponseDTO {
  public id!: string;

  public email!: string;

  public name!: string;

  public role!: 'user' | 'admin';

  public isActive!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;

  // NEVER include: password, tokens, internal data
}
