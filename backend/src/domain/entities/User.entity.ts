/**
 * User Entity Interface
 *
 * Core business entity representing a user in the system.
 * Contains business logic and validation rules.
 * Framework-independent and reusable.
 */
export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Entity
 *
 * Core business entity representing a user in the system.
 * Contains business logic and validation rules.
 * Framework-independent and reusable.
 */
export class User implements IUser {
  public id!: string;

  public email!: string;

  public password!: string;

  public name!: string;

  public role!: 'user' | 'admin';

  public isActive!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;

  public constructor(
    id: string,
    email: string,
    password: string,
    name: string,
    role: 'user' | 'admin' = 'user',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Static factory method to create a new User instance
   *
   * @param id - Unique identifier
   * @param email - User's email address
   * @param password - Hashed password
   * @param name - User's full name
   * @param role - User role (default: 'user')
   * @returns New User instance
   */
  public static create(
    id: string,
    email: string,
    password: string,
    name: string,
    role: 'user' | 'admin' = 'user'
  ): User {
    return new User(id, email, password, name, role, true, new Date(), new Date());
  }

  /**
   * Validate user business rules
   *
   * Business Rules:
   * - Email must be valid format
   * - Name must be at least 3 characters
   * - Password must exist
   * - Role must be valid
   *
   * @returns true if user is valid, false otherwise
   */
  public isValid(): boolean {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      return false;
    }

    // Name validation
    if (!this.name || this.name.trim().length < 3) {
      return false;
    }

    // Password validation
    if (!this.password || this.password.length === 0) {
      return false;
    }

    // Role validation
    if (!['user', 'admin'].includes(this.role)) {
      return false;
    }

    return true;
  }

  /**
   * Update user properties
   *
   * @param data - Partial user data to update
   */
  public update(data: Partial<IUser>): void {
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.name !== undefined) this.name = data.name;
    if (data.role !== undefined) this.role = data.role;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    this.updatedAt = new Date();
  }

  /**
   * Convert user entity to JSON
   *
   * Removes password from serialization for security.
   *
   * @returns User data without password
   */
  public toJSON(): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = this;
    return rest as Omit<User, 'password'>;
  }
}
