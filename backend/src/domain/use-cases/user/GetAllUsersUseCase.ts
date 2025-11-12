import type { User } from '@domain/entities';
import type { IUserRepository } from '@domain/repositories';
import { ValidationError, InternalServerError } from '@shared/errors';
import logger from '@shared/utils/logger';

/**
 * Get All Users Use Case
 *
 * Retrieves all users.
 * Useful for admin dashboards and user management.
 *
 * Note: Current implementation returns all users without pagination.
 * TODO: Update IUserRepository.findAll() to support pagination parameters.
 */
export class GetAllUsersUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(): Promise<User[]> {
    try {
      // Fetch all users from repository
      const users = await this.userRepository.findAll();

      logger.info(`Retrieved ${users.length} users`);

      return users;
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      logger.error('Error getting all users:', err);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new InternalServerError(err?.message || 'Failed to get users');
    }
  }
}
