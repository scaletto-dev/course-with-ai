import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Circle } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface SidebarProps {
  modules: Module[];
  activeLesson: string;
  onLessonSelect: (lessonId: string) => void;
  isOpen: boolean;
}

export function Sidebar({
  modules,
  activeLesson,
  onLessonSelect,
  isOpen,
}: SidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(['module-1', 'module-2'])
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
        <p className="text-sm text-gray-500 mt-1">6 lessons • 1h 45m</p>
      </div>

      <div className="p-4">
        {modules.map((module: Module) => {
          const isExpanded = expandedModules.has(module.id);
          const completedLessons = module.lessons.filter((l) => l.completed).length;
          const totalLessons = module.lessons.length;

          return (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{module.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {completedLessons}/{totalLessons} completed
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {module.lessons.map((lesson: Lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonSelect(lesson.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        activeLesson === lesson.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={`text-sm ${
                            activeLesson === lesson.id
                              ? 'font-medium text-blue-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {lesson.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {lesson.duration}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
