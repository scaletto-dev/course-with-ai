import { User } from '@domain/entities';
import type { IUserRepository } from '@domain/repositories';
import { DatabaseConnection } from '../mysql';
import logger from '@shared/utils/logger';

export class UserRepository implements IUserRepository {
  public constructor(private readonly database: DatabaseConnection) {}

  public async create(user: User): Promise<User> {
    try {
      const connection = await this.database.getConnection();
      const sql =
        'INSERT INTO users (id, email, password, name, role, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      await connection.execute(sql, [
        user.id,
        user.email,
        user.password,
        user.name,
        user.role,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      ]);

      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      const connection = await this.database.getConnection();
      const sql = 'SELECT * FROM users WHERE id = ?';

      const [rows] = await connection.execute(sql, [id]);
      const userRow = (rows as unknown[])[0];

      if (!userRow) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.mapToUser(userRow as any);
    } catch (error) {
      logger.error('Error finding user by id:', error);
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const connection = await this.database.getConnection();
      const sql = 'SELECT * FROM users WHERE email = ?';

      const [rows] = await connection.execute(sql, [email]);
      const userRow = (rows as unknown[])[0];

      if (!userRow) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.mapToUser(userRow as any);
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  public async update(user: User): Promise<User> {
    try {
      const connection = await this.database.getConnection();
      const sql =
        'UPDATE users SET email = ?, password = ?, name = ?, role = ?, isActive = ?, updatedAt = ? WHERE id = ?';

      await connection.execute(sql, [
        user.email,
        user.password,
        user.name,
        user.role,
        user.isActive,
        new Date(),
        user.id,
      ]);

      logger.info(`User updated: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const connection = await this.database.getConnection();
      const sql = 'DELETE FROM users WHERE id = ?';

      const [result] = await connection.execute(sql, [id]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const affectedRows = (result as any).affectedRows;

      if (affectedRows === 0) {
        logger.warn(`User not found for deletion: ${id}`);
        return false;
      }

      logger.info(`User deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      const connection = await this.database.getConnection();
      const sql = 'SELECT * FROM users ORDER BY createdAt DESC';

      const [rows] = await connection.execute(sql);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (rows as any[]).map(row => this.mapToUser(row));
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToUser(row: any): User {
    return new User(
      row.id,
      row.email,
      row.password,
      row.name,
      row.role,
      row.isActive,
      new Date(row.createdAt),
      new Date(row.updatedAt)
    );
  }
}
