import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { User } from '@domain/entities';
import type { IUserRepository } from '@domain/repositories';
import { ConflictError, ValidationError } from '@shared/errors';

export class RegisterUseCase {
  private readonly accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  private readonly accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY;
  private readonly refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY;

  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: RegisterInput): Promise<RegisterOutput> {
    // Validate input
    if (!input.email || !input.password || !input.name) {
      throw new ValidationError('Email, password, and name are required');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(input.password, 10);

    // Create new user
    const user = User.create(uuidv4(), input.email, hashedPassword, input.name, 'user');

    // Save to repository
    const savedUser = await this.userRepository.create(user);

    // Generate tokens
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      this.accessTokenSecret as string,
      { expiresIn: this.accessTokenExpiry } as Record<string, string>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = jwt.sign(
      { id: savedUser.id, email: savedUser.email },
      this.refreshTokenSecret as string,
      { expiresIn: this.refreshTokenExpiry } as Record<string, string>
    );

    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterOutput {
  user: User;
  accessToken: string;
  refreshToken: string;
}
