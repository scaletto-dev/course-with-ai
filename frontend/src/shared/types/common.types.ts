export interface ErrorDetail {
  field?: string | null;
  message: string;
  code: string;
}

export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data: T | null;
  error: ErrorDetail | null;
  timestamp: string;
}

export interface PaginatedData<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
