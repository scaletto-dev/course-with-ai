/**
 * HTTP Response Types
 * Định nghĩa các type cho HTTP responses
 */

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data?: T;
  meta?: PaginationMeta;
  message?: string;
  timestamp: string;
}
