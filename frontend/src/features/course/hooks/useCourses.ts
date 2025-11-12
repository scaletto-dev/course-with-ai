import { useState, useEffect } from 'react';
import { courseApi } from '../api/courseApi';
import type { Course } from '../types';

export function useCourses(page = 1, limit = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseApi.getAllCourses(page, limit);
        setCourses(data.courses);
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, limit]);

  return { courses, loading, error, pagination };
}

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseApi.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
}
