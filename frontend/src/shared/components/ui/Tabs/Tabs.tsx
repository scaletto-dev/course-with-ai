import { useState } from 'react';
import { FileText, BookOpen, Download, Zap, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  passingScore: number;
  questions: Question[];
}

// QuizComponent - inline to avoid circular dependency
const QuizComponent = ({ quiz }: { quiz: Quiz }) => {
  // Placeholder - QuizComponent will be imported from features when available
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p>Quiz: {quiz.title}</p>
    </div>
  );
};

interface TabsProps {
  transcript: string;
  notes: string;
  downloadLink: string;
  aiSummary: string;
  quiz?: Quiz;
}

export function Tabs({
  transcript,
  notes,
  downloadLink,
  aiSummary,
  quiz,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<
    'transcript' | 'aiSummary' | 'notes' | 'quiz' | 'download'
  >('transcript');

  const tabs = [
    {
      id: 'transcript' as const,
      label: 'Transcript',
      icon: FileText,
    },
    {
      id: 'aiSummary' as const,
      label: 'AI Summary',
      icon: Zap,
    },
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: BookOpen,
    },
    ...(quiz
      ? [
          {
            id: 'quiz' as const,
            label: 'AI Quiz',
            icon: CheckCircle,
          },
        ]
      : []),
    {
      id: 'download' as const,
      label: 'Resources',
      icon: Download,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'transcript' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {transcript}
            </p>
          </div>
        )}

        {activeTab === 'aiSummary' && (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: aiSummary }}
          />
        )}

        {activeTab === 'notes' && (
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {notes}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && quiz && <QuizComponent quiz={quiz} />}

        {activeTab === 'download' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Lesson Slides</div>
                  <div className="text-sm text-gray-500">PDF • 2.4 MB</div>
                </div>
              </div>
              <a
                href={downloadLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Code Examples</div>
                  <div className="text-sm text-gray-500">ZIP • 1.8 MB</div>
                </div>
              </div>
              <a
                href={downloadLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
