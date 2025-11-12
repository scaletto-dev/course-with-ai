import { hash } from 'bcryptjs';
import type { User } from '@domain/entities';
import type { IUserRepository } from '@domain/repositories';
import { ValidationError, NotFoundError, InternalServerError } from '@shared/errors';
import logger from '@shared/utils/logger';

/**
 * Input data for updating a user
 */
export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
}

/**
 * Update User Use Case
 *
 * Updates an existing user.
 * Orchestrates validation and data persistence.
 *
 * Business Rules:
 * - User must exist
 * - At least one field must be provided
 * - Email must be unique (if updating)
 * - Password must be hashed if provided
 */
export class UpdateUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: UpdateUserInput): Promise<User> {
    try {
      // 1. Validate input
      if (!input.id) {
        throw new ValidationError('ID is required');
      }

      // 2. Check if user exists
      const existingUser = await this.userRepository.findById(input.id);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // 3. Update user properties
      const updateData: Partial<User> = {};

      if (input.name !== undefined) {
        if (input.name.trim().length < 3) {
          throw new ValidationError('Name must be at least 3 characters');
        }
        updateData.name = input.name.trim();
      }

      if (input.email !== undefined) {
        if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          throw new ValidationError('Invalid email format');
        }
        // Check if email is already used by another user
        const userWithEmail = await this.userRepository.findByEmail(input.email);
        if (userWithEmail && userWithEmail.id !== input.id) {
          throw new ValidationError('Email already in use');
        }
        updateData.email = input.email.trim();
      }

      if (input.password !== undefined) {
        if (input.password.length < 8) {
          throw new ValidationError('Password must be at least 8 characters');
        }
        updateData.password = await hash(input.password, 10);
      }

      if (input.role !== undefined) {
        if (!['user', 'admin'].includes(input.role)) {
          throw new ValidationError('Invalid role');
        }
        updateData.role = input.role;
      }

      // Verify at least one field is being updated
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('At least one field must be provided');
      }

      // 4. Merge updates with existing user
      Object.assign(existingUser, updateData);
      existingUser.updatedAt = new Date();

      // 5. Persist changes
      const updatedUser = await this.userRepository.update(existingUser);

      logger.info(`User updated successfully: ${input.id}`);
      return updatedUser;
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      logger.error('Error updating user:', err);
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(err?.message || 'Failed to update user');
    }
  }
}
