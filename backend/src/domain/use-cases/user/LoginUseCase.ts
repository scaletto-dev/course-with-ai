import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IUserRepository } from '@domain/repositories';
import { UnauthorizedError, ValidationError } from '@shared/errors';

export class LoginUseCase {
  private readonly accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  private readonly accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY;
  private readonly refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY;

  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: LoginInput): Promise<LoginOutput> {
    // Validate input
    if (!input.email || !input.password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.accessTokenSecret as string,
      { expiresIn: this.accessTokenExpiry } as Record<string, string>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      this.refreshTokenSecret as string,
      { expiresIn: this.refreshTokenExpiry } as Record<string, string>
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
