/**
 * Testing utilities và helpers
 * Dùng cho unit testing và integration testing
 */

import { Result, ok } from '../types';

/**
 * Mock repository creator
 * Tạo mock repository để testing
 */
export class MockRepository<T> {
  private data: Map<string, T> = new Map();

  save(id: string, item: T): Result<T> {
    this.data.set(id, item);
    return ok(item);
  }

  findById(id: string): Result<T | null> {
    const item = this.data.get(id);
    return ok(item || null);
  }

  findAll(): Result<T[]> {
    return ok(Array.from(this.data.values()));
  }

  delete(id: string): Result<boolean> {
    const existed = this.data.has(id);
    this.data.delete(id);
    return ok(existed);
  }

  clear(): void {
    this.data.clear();
  }
}
