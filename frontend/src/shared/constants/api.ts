// API configuration constants
export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
} as const;

export const API_ENDPOINTS = {
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
} as const;

export const API_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
