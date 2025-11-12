import { axiosInstance } from '@/shared/lib/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { Course } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const courseApi = {
  /**
   * Fetch all courses with pagination
   */
  async getAllCourses(page = 1, limit = 10): Promise<PaginatedCoursesResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<Course[]>>(
        API_ENDPOINTS.COURSES,
        {
          params: { page, limit },
        }
      );
      return {
        courses: response.data.data,
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10,
        totalPages: response.data.meta?.totalPages || 1,
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Fetch a single course by ID
   */
  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await axiosInstance.get<ApiResponse<Course>>(
        API_ENDPOINTS.COURSE_DETAIL(id)
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
};
