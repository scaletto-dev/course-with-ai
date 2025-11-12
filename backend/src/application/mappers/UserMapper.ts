import { User } from '../../domain/entities/User.entity';
import {
  RegisterDTO,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  UserListResponseDTO,
} from '../dtos/auth';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

/**
 * User Mapper
 *
 * Handles bidirectional conversion between DTOs and domain entities.
 * Separates data transfer concerns from business logic.
 * Ensures proper data transformation and field mapping.
 * 
 * Note: Password hashing is handled here for consistency.
 */
export class UserMapper {
  /**
   * Convert RegisterDTO to domain entity.
   * Generates new ID, hashes password, and sets timestamps.
   *
   * @param dto - The registration DTO
   * @returns Promise of new domain User entity
   */
  public static async toDomainFromRegister(dto: RegisterDTO): Promise<User> {
    const hashedPassword = await hash(dto.password, 10);
    
    return new User(
      uuidv4(), // id
      dto.email,
      hashedPassword, // hashed password
      dto.name,
      'user', // default role
      true, // isActive
      new Date(), // createdAt
      new Date() // updatedAt
    );
  }

  /**
   * Convert CreateUserDTO to domain entity.
   * Generates new ID, hashes password, and sets timestamps.
   * Can set custom role (default: 'user').
   *
   * @param dto - The create user DTO
   * @returns Promise of new domain User entity
   */
  public static async toDomainFromCreate(dto: CreateUserDTO): Promise<User> {
    const hashedPassword = await hash(dto.password, 10);
    
    return new User(
      uuidv4(), // id
      dto.email,
      hashedPassword, // hashed password
      dto.name,
      dto.role || 'user', // role
      true, // isActive
      new Date(), // createdAt
      new Date() // updatedAt
    );
  }

  /**
   * Convert UpdateUserDTO to partial entity data.
   * Only includes provided fields.
   * Does NOT hash password (should be handled separately if needed).
   *
   * @param dto - The update DTO
   * @returns Partial User data for updates
   */
  public static toUpdateData(dto: UpdateUserDTO): Partial<User> {
    const data: Partial<User> = {};
    
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.role !== undefined) data.role = dto.role;
    // Note: Password should be hashed separately before update
    
    return data;
  }

  /**
   * Convert domain entity to response DTO.
   * Excludes sensitive fields (password, internal flags).
   *
   * @param entity - The domain User entity
   * @returns Response DTO for API
   */
  public static toDTO(entity: User): UserResponseDTO {
    const dto = new UserResponseDTO();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.role = entity.role;
    dto.isActive = entity.isActive;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    
    return dto;
  }

  /**
   * Convert multiple entities to response DTOs.
   *
   * @param entities - Array of domain User entities
   * @returns Array of response DTOs
   */
  public static toDTOs(entities: User[]): UserResponseDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }

  /**
   * Convert paginated results to list response DTO.
   *
   * @param data - Paginated data from repository
   * @returns Paginated list response DTO
   */
  public static toListDTO(data: {
    items: User[];
    total: number;
    page: number;
    limit: number;
  }): UserListResponseDTO {
    const dto = new UserListResponseDTO();
    dto.items = this.toDTOs(data.items);
    dto.total = data.total;
    dto.page = data.page;
    dto.limit = data.limit;
    dto.totalPages = Math.ceil(data.total / data.limit);
    
    return dto;
  }
}
