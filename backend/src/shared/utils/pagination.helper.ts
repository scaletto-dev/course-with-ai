/**
 * Pagination Helper
 * Utility functions for pagination operations
 */

import { PaginationQuery, PaginationMeta } from '../types/http.types';

export class PaginationHelper {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  public static parsePaginationQuery(query: Record<string, unknown>): PaginationQuery {
    const page = Math.max(1, parseInt(String(query.page)) || this.DEFAULT_PAGE);
    const limit = Math.min(
      this.MAX_LIMIT,
      Math.max(1, parseInt(String(query.limit)) || this.DEFAULT_LIMIT),
    );

    return { page, limit };
  }

  public static createMeta(total: number, page: number, limit: number): PaginationMeta {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
