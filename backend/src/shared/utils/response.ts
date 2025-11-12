/**
 * Response standardization cho tất cả API responses
 * Generic response wrapper để có consistent format
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: {
    message: string;
    name?: string;
  };
  timestamp: string;
}

/**
 * Helper function tạo successful response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200,
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Helper function tạo error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  name?: string,
): ApiResponse<null> {
  return {
    success: false,
    statusCode,
    error: {
      message,
      name,
    },
    timestamp: new Date().toISOString(),
  };
}
