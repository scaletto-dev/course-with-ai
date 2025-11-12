export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: string;
  rating: number;
  students: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  enrolled?: boolean;
  progress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LessonContent {
  videoUrl: string;
  transcript: string;
  notes: string;
  downloadLink: string;
  aiSummary: string;
}
