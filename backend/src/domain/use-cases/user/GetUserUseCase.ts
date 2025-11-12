import type { IUserRepository } from '@domain/repositories';
import { User } from '@domain/entities';
import { NotFoundError } from '@shared/errors';

export class GetUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
