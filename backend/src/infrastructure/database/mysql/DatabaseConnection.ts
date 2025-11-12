import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import logger from '@shared/utils/logger';
import { retry } from '@shared/utils/helpers';

/**
 * MySQL Database Connection Manager
 * Quản lý connection pool và kết nối tới MySQL database
 * Có retry logic để handle connection failures
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool | null = null;

  private constructor() {}

  /**
   * Lấy singleton instance
   */
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize connection pool
   */
  async initialize(): Promise<void> {
    const poolConfig: PoolOptions = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'coursera_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };

    try {
      // Retry connection 3 times với exponential backoff
      await retry(
        async () => {
          this.pool = mysql.createPool(poolConfig);
          // Test connection
          const connection = await this.pool.getConnection();
          await connection.ping();
          connection.release();
          logger.info('Database connection established successfully');
        },
        3,
        1000,
      );
    } catch (error) {
      logger.error('Failed to establish database connection:', error);
      throw error;
    }
  }

  /**
   * Lấy connection từ pool
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return await this.pool.getConnection();
  }

  /**
   * Lấy pool
   */
  getPool(): Pool {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database connection pool closed');
    }
  }
}

/**
 * Helper function để lấy database instance
 */
export const getDatabase = (): DatabaseConnection => {
  return DatabaseConnection.getInstance();
};
