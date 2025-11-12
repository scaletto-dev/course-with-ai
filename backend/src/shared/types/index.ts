/**
 * Shared types sử dụng trong toàn bộ application
 */

/**
 * Generic result type dùng cho use cases
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  isSuccess: true;
  value: T;
}

export interface Failure<E> {
  isSuccess: false;
  error: E;
}

// Export HTTP types
export * from './http.types';

/**
 * Helper function tạo success result
 */
export function ok<T>(value: T): Success<T> {
  return {
    isSuccess: true,
    value,
  };
}

/**
 * Helper function tạo failure result
 */
export function fail<E>(error: E): Failure<E> {
  return {
    isSuccess: false,
    error,
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
