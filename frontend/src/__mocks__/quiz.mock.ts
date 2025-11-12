import { Quiz } from '../features/quiz/types';

export const quizzes: Record<string, Quiz> = {
  'lesson-1-1': {
    id: 'quiz-1-1',
    title: 'Web Development Basics',
    lessonId: 'lesson-1-1',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'Những lĩnh vực chính của web development là gì?',
        options: [
          'Frontend và Backend',
          'Frontend, Backend và Full-stack',
          'Chỉ Frontend',
          'Desktop development',
        ],
        correctAnswer: 1,
        explanation:
          'Web development bao gồm ba lĩnh vực chính: Front-end (giao diện người dùng), Back-end (logic phía máy chủ), và Full-stack (kết hợp cả hai).',
      },
      {
        id: 'q2',
        question: 'HTML là gì?',
        options: [
          'Một ngôn ngữ lập trình',
          'Một ngôn ngữ tạo kiểu',
          'Một ngôn ngữ đánh dấu để cấu trúc nội dung web',
          'Một framework JavaScript',
        ],
        correctAnswer: 2,
        explanation:
          'HTML (HyperText Markup Language) là ngôn ngữ đánh dấu được sử dụng để cấu trúc nội dung trên các trang web.',
      },
      {
        id: 'q3',
        question: 'CSS được sử dụng cho mục đích gì?',
        options: [
          'Tạo logic ứng dụng',
          'Styling và bố cục trang web',
          'Kết nối với cơ sở dữ liệu',
          'Quản lý phiên người dùng',
        ],
        correctAnswer: 1,
        explanation:
          'CSS (Cascading Style Sheets) được sử dụng để tạo kiểu và bố cục cho các phần tử HTML.',
      },
      {
        id: 'q4',
        question: 'JavaScript chủ yếu được dùng để làm gì?',
        options: [
          'Tạo cấu trúc trang web',
          'Tạo kiểu cho các phần tử',
          'Thêm tính tương tác và hành động động vào trang web',
          'Quản lý máy chủ',
        ],
        correctAnswer: 2,
        explanation:
          'JavaScript được sử dụng để tạo tính tương tác, xử lý sự kiện người dùng, và tạo hành động động trên trang web.',
      },
      {
        id: 'q5',
        question: 'Front-end development tập trung vào điều gì?',
        options: [
          'Những gì người dùng thấy và tương tác',
          'Logic phía máy chủ',
          'Cơ sở dữ liệu',
          'Bảo mật mạng',
        ],
        correctAnswer: 0,
        explanation:
          'Front-end development tập trung vào giao diện người dùng (UI) - những gì mà người dùng nhìn thấy và tương tác với nó trong trình duyệt.',
      },
    ],
  },
  'lesson-1-2': {
    id: 'quiz-1-2',
    title: 'Development Environment Setup',
    lessonId: 'lesson-1-2',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'Visual Studio Code là gì?',
        options: [
          'Một trình duyệt web',
          'Một code editor mạnh mẽ và miễn phí',
          'Một framework JavaScript',
          'Một máy chủ web',
        ],
        correctAnswer: 1,
        explanation:
          'Visual Studio Code là một code editor được phát triển bởi Microsoft, miễn phí, nhẹ và có rất nhiều extensions hữu ích.',
      },
      {
        id: 'q2',
        question: 'Node.js được sử dụng để làm gì?',
        options: [
          'Chỉ để tạo giao diện người dùng',
          'Chỉ để styling CSS',
          'Chạy JavaScript trên máy chủ và sử dụng build tools',
          'Quản lý cơ sở dữ liệu',
        ],
        correctAnswer: 2,
        explanation:
          'Node.js cho phép chạy JavaScript trên máy chủ và là nền tảng cho nhiều build tools và package managers như npm.',
      },
      {
        id: 'q3',
        question: 'npm là viết tắt của gì?',
        options: [
          'Network Package Manager',
          'Node Package Manager',
          'National Programming Manager',
          'New Programming Module',
        ],
        correctAnswer: 1,
        explanation:
          'npm viết tắt của "Node Package Manager", công cụ quản lý các package (thư viện) JavaScript cho Node.js.',
      },
      {
        id: 'q4',
        question: 'Git được sử dụng cho mục đích gì?',
        options: [
          'Styling trang web',
          'Quản lý phiên bản code',
          'Tạo database',
          'Tạo giao diện người dùng',
        ],
        correctAnswer: 1,
        explanation:
          'Git là hệ thống quản lý phiên bản (version control) giúp theo dõi các thay đổi trong code và làm việc cộng tác với các nhà phát triển khác.',
      },
    ],
  },
};
