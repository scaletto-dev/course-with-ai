import type { IUserRepository } from '@domain/repositories';
import { ValidationError, NotFoundError, InternalServerError } from '@shared/errors';
import logger from '@shared/utils/logger';

/**
 * Delete User Use Case
 *
 * Deletes a user (soft delete).
 * Marks user as inactive instead of removing from database.
 *
 * Business Rules:
 * - User must exist
 * - Cannot delete admin users (optional, based on requirements)
 */
export class DeleteUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string): Promise<boolean> {
    try {
      // 1. Validate input
      if (!id || id.trim().length === 0) {
        throw new ValidationError('ID is required');
      }

      // 2. Check if user exists
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // 3. Optional: Prevent deletion of admin users
      // Uncomment if needed based on business rules
      // if (user.role === 'admin') {
      //   throw new ValidationError('Cannot delete admin users');
      // }

      // 4. Delete user (soft delete via repository)
      const result = await this.userRepository.delete(id);

      if (!result) {
        throw new InternalServerError('Failed to delete user');
      }

      logger.info(`User deleted successfully: ${id}`);
      return true;
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      logger.error('Error deleting user:', err);
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(err?.message || 'Failed to delete user');
    }
  }
}
