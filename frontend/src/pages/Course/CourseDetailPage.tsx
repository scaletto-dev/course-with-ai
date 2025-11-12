import { useParams, Navigate } from 'react-router-dom';
import { CourseLayout } from '@/features/course/components/CourseLayout';
import { coursesData } from '@/__mocks__';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();

  // Verify the course exists
  const course = coursesData.find((c: { id: string }) => c.id === courseId);

  if (!course) {
    return <Navigate to="/" replace />;
  }

  return <CourseLayout />;
}
