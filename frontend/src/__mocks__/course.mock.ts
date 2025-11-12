import { Course, Module, LessonContent } from '../features/course/types';

export const coursesData: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Sarah Johnson',
    duration: '6 Modules • 1h 45m',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    category: 'Web Development',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 5420,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
    enrolled: true,
    progress: 33,
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Michael Chen',
    duration: '12 Modules • 4h 30m',
    description: 'Dive into machine learning concepts, algorithms, and practical applications using Python and popular ML libraries.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    rating: 4.6,
    students: 3210,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    instructor: 'Emily Rodriguez',
    duration: '8 Modules • 2h 15m',
    description: 'Master the principles of user interface and user experience design to create beautiful, intuitive digital products.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
    category: 'Design',
    difficulty: 'Beginner',
    rating: 4.9,
    students: 4150,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
    enrolled: true,
    progress: 75,
  },
  {
    id: '4',
    title: 'Cloud Computing with AWS',
    instructor: 'James Wilson',
    duration: '10 Modules • 3h 20m',
    description: 'Learn cloud infrastructure, services, and deployment strategies using Amazon Web Services (AWS).',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    category: 'Cloud Computing',
    difficulty: 'Advanced',
    rating: 4.7,
    students: 2890,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
  },
  {
    id: '5',
    title: 'Data Science with Python',
    instructor: 'Dr. Lisa Anderson',
    duration: '15 Modules • 5h 45m',
    description: 'Comprehensive course covering data analysis, visualization, and statistical modeling using Python and pandas.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    category: 'Data Science',
    difficulty: 'Advanced',
    rating: 4.5,
    students: 3560,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
  },
  {
    id: '6',
    title: 'Mobile App Development',
    instructor: 'David Kim',
    duration: '14 Modules • 4h 50m',
    description: 'Build native mobile applications for iOS and Android using React Native and modern development practices.',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    rating: 4.7,
    students: 4780,
    isActive: true,
    createdAt: '2025-11-11T00:32:02.000Z',
    updatedAt: '2025-11-11T00:32:02.000Z',
  },
];

export const courseData: Module[] = [
  {
    id: 'module-1',
    title: 'Introduction to Web Development',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'What is Web Development?',
        duration: '12:30',
        completed: true,
      },
      {
        id: 'lesson-1-2',
        title: 'Setting Up Your Environment',
        duration: '15:45',
        completed: true,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'HTML & CSS Fundamentals',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'HTML Structure and Semantics',
        duration: '18:20',
        completed: false,
      },
      {
        id: 'lesson-2-2',
        title: 'CSS Styling Basics',
        duration: '22:15',
        completed: false,
      },
    ],
  },
  {
    id: 'module-3',
    title: 'JavaScript Essentials',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Variables and Data Types',
        duration: '16:40',
        completed: false,
      },
      {
        id: 'lesson-3-2',
        title: 'Functions and Scope',
        duration: '20:30',
        completed: false,
      },
    ],
  },
];

export const lessonContent: Record<string, LessonContent> = {
  'lesson-1-1': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript:
      "Welcome to this introductory lesson on web development. In this video, we'll explore what web development is, the different roles involved, and the technologies you'll be learning throughout this course.\n\nWeb development is the process of creating websites and web applications. It involves three main areas: front-end development (what users see), back-end development (server-side logic), and full-stack development (both combined).\n\nThroughout this course, you'll learn HTML for structure, CSS for styling, and JavaScript for interactivity. These are the foundational technologies of the web.",
    notes: 'Key Takeaways:\n• Web development encompasses front-end, back-end, and full-stack development\n• HTML provides structure, CSS adds styling, JavaScript enables interactivity\n• Modern web development involves frameworks and libraries\n• Responsive design is crucial for mobile devices\n\nNext Steps:\n- Set up your development environment\n- Practice basic HTML structure\n- Explore browser developer tools',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: What is Web Development?</h2>
      <section class="mt-6"><h3>Overview</h3><p>This lesson introduces the fundamental concepts of web development.</p></section>
    </div>`,
  },
  'lesson-1-2': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript:
      "In this lesson, we'll set up your development environment. You'll need a code editor, a web browser, and some essential tools to begin your web development journey.\n\nWe recommend Visual Studio Code as your code editor. It's free, powerful, and has excellent extensions for web development. For browsers, Chrome or Firefox with their developer tools will be your best friends.\n\nWe'll also install Node.js, which will be useful for running development servers and using modern build tools.",
    notes: 'Required Tools:\n• Visual Studio Code (or your preferred editor)\n• Chrome or Firefox browser\n• Node.js and npm\n• Git for version control\n\nRecommended Extensions:\n- Live Server\n- Prettier\n- ESLint\n- Auto Rename Tag',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: Setting Up Your Development Environment</h2>
      <section class="mt-6"><h3>Overview</h3><p>This lesson covers the essential tools and setup required to begin web development.</p></section>
    </div>`,
  },
  'lesson-2-1': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript:
      "HTML, or HyperText Markup Language, is the backbone of every website. In this lesson, we'll learn about HTML structure, semantic elements, and best practices.\n\nEvery HTML document starts with a DOCTYPE declaration, followed by html, head, and body tags. The head contains metadata, while the body contains the visible content.\n\nSemantic HTML uses meaningful tags like header, nav, main, article, and footer instead of generic divs. This improves accessibility and SEO.",
    notes: 'HTML Best Practices:\n• Use semantic HTML elements\n• Proper heading hierarchy (h1-h6)\n• Alt text for images\n• Valid HTML structure\n\nCommon Semantic Elements:\n- <header>: Site header\n- <nav>: Navigation\n- <main>: Main content\n- <article>: Self-contained content\n- <footer>: Site footer',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: HTML Structure and Semantics</h2>
      <section class="mt-6"><h3>Overview</h3><p>HTML (HyperText Markup Language) is the foundation of all web pages.</p></section>
    </div>`,
  },
  'lesson-2-2': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: 'CSS allows you to style your HTML elements...',
    notes: 'CSS Basics:\n• Selectors\n• Properties and values\n• Cascading and inheritance',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: CSS Styling Basics</h2>
      <section class="mt-6"><h3>Overview</h3><p>Learn the fundamentals of CSS styling.</p></section>
    </div>`,
  },
  'lesson-3-1': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: 'JavaScript variables store data values...',
    notes: 'Key Data Types:\n• String\n• Number\n• Boolean\n• Null\n• Undefined',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: Variables and Data Types</h2>
      <section class="mt-6"><h3>Overview</h3><p>Understanding JavaScript variables and data types.</p></section>
    </div>`,
  },
  'lesson-3-2': {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: 'Functions are reusable blocks of code...',
    notes: 'Function Concepts:\n• Function declaration\n• Parameters and arguments\n• Return values\n• Scope',
    downloadLink: '#',
    aiSummary: `<div class="prose prose-sm max-w-none">
      <h2>AI Summary: Functions and Scope</h2>
      <section class="mt-6"><h3>Overview</h3><p>Master JavaScript functions and scope concepts.</p></section>
    </div>`,
  },
};
