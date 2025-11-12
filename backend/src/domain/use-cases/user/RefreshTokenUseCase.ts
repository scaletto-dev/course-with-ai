import jwt from 'jsonwebtoken';
import type { IUserRepository } from '@domain/repositories';
import { UnauthorizedError } from '@shared/errors';

export class RefreshTokenUseCase {
  private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  private readonly accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  private readonly accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY;

  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(input.refreshToken, this.refreshTokenSecret as string) as {
        id: string;
        email: string;
      };

      // Find user to ensure still exists and is active
      const user = await this.userRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new access token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        this.accessTokenSecret as string,
        { expiresIn: this.accessTokenExpiry } as Record<string, string>
      );

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
}
