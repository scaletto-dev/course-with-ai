import { User } from '../entities/User.entity';

/**
 * User Repository Interface
 *
 * Defines the contract for user data access operations.
 * Implementation details hidden - can be MySQL, PostgreSQL, MongoDB, etc.
 * Used to decouple domain logic from infrastructure.
 */
export interface IUserRepository {
  /**
   * Create a new user
   *
   * @param user - The User entity to persist
   * @returns Promise of the created user
   * @throws Error if user creation fails or email already exists
   */
  create(user: User): Promise<User>;

  /**
   * Find user by ID
   *
   * @param id - The unique identifier
   * @returns Promise of the user or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email address
   *
   * Useful for login and email uniqueness checks
   *
   * @param email - The user's email address
   * @returns Promise of the user or null if not found
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find all users
   *
   * Returns all active users from the database.
   * TODO: Add pagination support (page, limit parameters)
   *
   * @returns Promise of array of all users
   */
  findAll(): Promise<User[]>;

  /**
   * Update existing user
   *
   * @param user - The User entity with updated data
   * @returns Promise of the updated user
   * @throws Error if user not found
   */
  update(user: User): Promise<User>;

  /**
   * Delete user (soft delete)
   *
   * Marks user as inactive instead of removing from database
   *
   * @param id - The unique identifier
   * @returns Promise of boolean indicating success
   * @throws Error if user not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if user exists by ID
   *
   * @param id - The unique identifier
   * @returns Promise of boolean existence status
   */
  exists(id: string): Promise<boolean>;
}

export const IUserRepository = Symbol('IUserRepository');
