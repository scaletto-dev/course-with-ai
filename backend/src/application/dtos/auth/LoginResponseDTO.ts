/**
 * Login Response DTO
 *
 * Output format for login API response.
 * Contains authentication tokens and user information.
 */
export class LoginResponseDTO {
  public accessToken!: string;

  public refreshToken!: string;

  public user!: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };

  public expiresIn!: number;
}
