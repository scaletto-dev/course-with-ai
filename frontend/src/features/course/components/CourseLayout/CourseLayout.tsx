import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { VideoPlayer } from '@/features/video/components/VideoPlayer';
import { Tabs } from '@/shared/components/ui/Tabs';
import { courseData, lessonContent, quizzes } from '@/__mocks__';

export function CourseLayout() {
  const [activeLesson, setActiveLesson] = useState('lesson-1-1');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentContent = lessonContent[activeLesson] || lessonContent['lesson-1-1'];
  const currentQuiz = quizzes[activeLesson];
  const currentLesson = courseData
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.id === activeLesson);
  const allLessons = courseData.flatMap((module) => module.lessons);
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === activeLesson);
  const nextLesson = allLessons[currentIndex + 1];

  const handleNextLesson = () => {
    if (nextLesson) {
      setActiveLesson(nextLesson.id);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          modules={courseData}
          activeLesson={activeLesson}
          onLessonSelect={setActiveLesson}
          isOpen={true}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={currentContent.videoUrl}
            lessonTitle={currentLesson?.title || 'Lesson'}
          />

          {/* Tabs */}
          <Tabs
            transcript={currentContent.transcript}
            notes={currentContent.notes}
            downloadLink={currentContent.downloadLink}
            aiSummary={currentContent.aiSummary}
            quiz={currentQuiz}
          />

          {/* Navigation */}
          <div className="flex justify-end">
            {nextLesson && (
              <button
                onClick={handleNextLesson}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Next Lesson
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
