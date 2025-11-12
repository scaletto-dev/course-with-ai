/**
 * Pagination utilities
 * Helper functions cho pagination logic
 */

import { PaginationMeta } from '../types';

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Calculate offset for database query
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(
  page: number,
  limit: number,
): { page: number; limit: number } {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page
  
  return { page: validPage, limit: validLimit };
}
