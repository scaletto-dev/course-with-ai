// Route constants
export const ROUTES = {
  HOME: '/',
  COURSE_LIST: '/courses',
  COURSE_DETAIL: (id: string) => `/course/${id}`,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  QUIZ: '/quiz',
} as const;
