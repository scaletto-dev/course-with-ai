/**
 * Response Helper
 * Utility functions for creating standardized API responses
 */

import { ApiResponse, PaginationMeta } from '../types/http.types';

export class ResponseHelper {
  public static success<T>(data: T, statusCode = 200): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  public static successWithPagination<T>(
    data: T[],
    pagination: PaginationMeta,
  ): ApiResponse<T[]> {
    return {
      success: true,
      statusCode: 200,
      data,
      meta: pagination,
      timestamp: new Date().toISOString(),
    };
  }

  public static error(message: string, statusCode = 500): ApiResponse {
    return {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  public static created<T>(data: T): ApiResponse<T> {
    return this.success(data, 201);
  }

  public static noContent(): ApiResponse {
    return {
      success: true,
      statusCode: 204,
      timestamp: new Date().toISOString(),
    };
  }
}
