import { useState } from 'react';
import { Navbar } from '@/shared/components/layout/Navbar';
import { CourseList } from '@/features/course/components/CourseList';
import { Pagination } from '@/shared/components/ui';
import { useCourses } from '@/features/course/hooks';

const LIMIT = 6;

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { courses, loading, error, pagination } = useCourses(page, LIMIT);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your next learning adventure from our curated collection
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading courses...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Failed to load courses. Please try again later.</p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <>
            <CourseList courses={filteredCourses} />
            {/* Pagination */}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              isLoading={loading}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
