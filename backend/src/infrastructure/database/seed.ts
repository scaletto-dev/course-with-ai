import 'dotenv/config';
import mysql from 'mysql2/promise';
import { hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import logger from '@shared/utils/logger';

/**
 * Seed Data for Development & Testing
 * Creates comprehensive test data for all tables
 */

// ========== USERS SEED DATA ==========
const seedUsers = [
  {
    id: uuidv4(),
    email: 'admin@example.com',
    password: hashSync('admin123', 10),
    name: 'Admin User',
    role: 'admin',
    isActive: true,
  },
  {
    id: uuidv4(),
    email: 'john@example.com',
    password: hashSync('password123', 10),
    name: 'John Doe',
    role: 'user',
    isActive: true,
  },
  {
    id: uuidv4(),
    email: 'jane@example.com',
    password: hashSync('password123', 10),
    name: 'Jane Smith',
    role: 'user',
    isActive: true,
  },
  {
    id: uuidv4(),
    email: 'bob@example.com',
    password: hashSync('password123', 10),
    name: 'Bob Wilson',
    role: 'user',
    isActive: true,
  },
];

/**
 * Seed data: Courses
 * Dữ liệu khóa học để populate vào database
 */
const seedCourses = [
  {
    id: uuidv4(),
    title: 'Introduction to Web Development',
    instructor: 'Sarah Johnson',
    duration: '6 Modules • 1h 45m',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    category: 'Web Development',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 5420,
  },
  {
    id: uuidv4(),
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Michael Chen',
    duration: '12 Modules • 4h 30m',
    description: 'Dive into machine learning concepts, algorithms, and practical applications using Python and popular ML libraries.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    rating: 4.6,
    students: 3210,
  },
  {
    id: uuidv4(),
    title: 'UI/UX Design Principles',
    instructor: 'Emily Rodriguez',
    duration: '8 Modules • 2h 15m',
    description: 'Master the principles of user interface and user experience design to create beautiful, intuitive digital products.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
    category: 'Design',
    difficulty: 'Beginner',
    rating: 4.9,
    students: 4150,
  },
  {
    id: uuidv4(),
    title: 'Cloud Computing with AWS',
    instructor: 'James Wilson',
    duration: '10 Modules • 3h 20m',
    description: 'Learn cloud infrastructure, services, and deployment strategies using Amazon Web Services (AWS).',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    category: 'Cloud Computing',
    difficulty: 'Advanced',
    rating: 4.7,
    students: 2890,
  },
  {
    id: uuidv4(),
    title: 'Data Science with Python',
    instructor: 'Dr. Lisa Anderson',
    duration: '15 Modules • 5h 45m',
    description: 'Comprehensive course covering data analysis, visualization, and statistical modeling using Python and pandas.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    category: 'Data Science',
    difficulty: 'Advanced',
    rating: 4.5,
    students: 3560,
  },
  {
    id: uuidv4(),
    title: 'Mobile App Development',
    instructor: 'David Kim',
    duration: '14 Modules • 4h 50m',
    description: 'Build native mobile applications for iOS and Android using React Native and modern development practices.',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    rating: 4.7,
    students: 4780,
  },
  {
    id: uuidv4(),
    title: 'Advanced TypeScript',
    instructor: 'Alex Turner',
    duration: '10 Modules • 3h 10m',
    description: 'Master advanced TypeScript concepts including generics, decorators, and type manipulation for production-grade applications.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop',
    category: 'Web Development',
    difficulty: 'Advanced',
    rating: 4.8,
    students: 2150,
  },
  {
    id: uuidv4(),
    title: 'React Advanced Patterns',
    instructor: 'Jennifer Lee',
    duration: '9 Modules • 2h 50m',
    description: 'Learn advanced React patterns including hooks, context API, suspense, and performance optimization techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f7?w=400&h=200&fit=crop',
    category: 'Web Development',
    difficulty: 'Intermediate',
    rating: 4.9,
    students: 6230,
  },
  {
    id: uuidv4(),
    title: 'DevOps Fundamentals',
    instructor: 'Mark Stevens',
    duration: '11 Modules • 3h 40m',
    description: 'Learn containerization, orchestration, CI/CD pipelines, and infrastructure as code with Docker and Kubernetes.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=400&h=200&fit=crop',
    category: 'DevOps',
    difficulty: 'Advanced',
    rating: 4.6,
    students: 2890,
  },
  {
    id: uuidv4(),
    title: 'Cybersecurity Essentials',
    instructor: 'Rachel Green',
    duration: '8 Modules • 2h 30m',
    description: 'Comprehensive guide to cybersecurity fundamentals, threat analysis, and best practices for protecting digital assets.',
    thumbnail: 'https://images.unsplash.com/photo-1535527557189-efb96d80aa48?w=400&h=200&fit=crop',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    rating: 4.7,
    students: 3450,
  },
  {
    id: uuidv4(),
    title: 'Blockchain & Web3 Development',
    instructor: 'Chris Carter',
    duration: '12 Modules • 4h 15m',
    description: 'Explore blockchain technology, smart contracts, decentralized applications, and the future of Web3.',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e0a479e23?w=400&h=200&fit=crop',
    category: 'Blockchain',
    difficulty: 'Advanced',
    rating: 4.5,
    students: 1890,
  },
  {
    id: uuidv4(),
    title: 'Game Development with Unity',
    instructor: 'Tom Brown',
    duration: '16 Modules • 5h 30m',
    description: 'Create amazing 2D and 3D games with Unity engine, covering game mechanics, physics, and deployment strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=200&fit=crop',
    category: 'Game Development',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 4560,
  },
];

/**
 * Run seed function - Populates all tables with test data
 */
async function runSeed(): Promise<void> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'coursera_db',
  });

  try {
    // Clear existing data (in reverse order of foreign key dependencies)
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    await connection.execute('TRUNCATE TABLE lesson_progress');
    logger.info('✓ Cleared lesson_progress');

    await connection.execute('TRUNCATE TABLE lesson_contents');
    logger.info('✓ Cleared lesson_contents');

    await connection.execute('TRUNCATE TABLE lessons');
    logger.info('✓ Cleared lessons');

    await connection.execute('TRUNCATE TABLE modules');
    logger.info('✓ Cleared modules');

    await connection.execute('TRUNCATE TABLE enrollments');
    logger.info('✓ Cleared enrollments');

    await connection.execute('TRUNCATE TABLE courses');
    logger.info('✓ Cleared courses');

    await connection.execute('TRUNCATE TABLE users');
    logger.info('✓ Cleared users');

    // Seed Users
    logger.info('\n📝 Seeding Users...');
    for (const user of seedUsers) {
      const query = `
        INSERT INTO users (id, email, password, name, role, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const values = [user.id, user.email, user.password, user.name, user.role, user.isActive ? 1 : 0];
      await connection.execute(query, values);
    }
    logger.info(`✅ Seeded ${seedUsers.length} users`);

    // Seed Courses
    logger.info('\n📝 Seeding Courses...');
    const courseIds: string[] = [];
    for (const course of seedCourses) {
      const query = `
        INSERT INTO courses (id, title, instructor, duration, description, thumbnail, category, difficulty, rating, students, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const values = [
        course.id,
        course.title,
        course.instructor,
        course.duration,
        course.description,
        course.thumbnail,
        course.category,
        course.difficulty,
        course.rating,
        course.students,
        1, // isActive
      ];
      await connection.execute(query, values);
      courseIds.push(course.id);
    }
    logger.info(`✅ Seeded ${seedCourses.length} courses`);

    // Seed Modules for First Course
    logger.info('\n📝 Seeding Modules...');
    const firstCourseId = courseIds[0];
    const modules = [
      { id: uuidv4(), courseId: firstCourseId, title: 'Introduction to Web Dev', orderIndex: 1 },
      { id: uuidv4(), courseId: firstCourseId, title: 'HTML Fundamentals', orderIndex: 2 },
      { id: uuidv4(), courseId: firstCourseId, title: 'CSS Styling', orderIndex: 3 },
      { id: uuidv4(), courseId: firstCourseId, title: 'JavaScript Basics', orderIndex: 4 },
      { id: uuidv4(), courseId: firstCourseId, title: 'DOM Manipulation', orderIndex: 5 },
      { id: uuidv4(), courseId: firstCourseId, title: 'Final Project', orderIndex: 6 },
    ];

    const moduleIds: string[] = [];
    for (const module of modules) {
      const query = `INSERT INTO modules (id, courseId, title, orderIndex, createdAt) VALUES (?, ?, ?, ?, NOW())`;
      await connection.execute(query, [module.id, module.courseId, module.title, module.orderIndex]);
      moduleIds.push(module.id);
    }
    logger.info(`✅ Seeded ${modules.length} modules`);

    // Seed Lessons for First Module
    logger.info('\n📝 Seeding Lessons...');
    const firstModuleId = moduleIds[0];
    const lessons = [
      { id: uuidv4(), moduleId: firstModuleId, title: 'What is Web Development?', duration: '12:45', orderIndex: 1 },
      { id: uuidv4(), moduleId: firstModuleId, title: 'Frontend vs Backend', duration: '18:30', orderIndex: 2 },
      { id: uuidv4(), moduleId: firstModuleId, title: 'Development Tools', duration: '22:15', orderIndex: 3 },
      { id: uuidv4(), moduleId: firstModuleId, title: 'Setting Up Your Environment', duration: '19:50', orderIndex: 4 },
    ];

    const lessonIds: string[] = [];
    for (const lesson of lessons) {
      const query = `INSERT INTO lessons (id, moduleId, title, duration, orderIndex, createdAt) VALUES (?, ?, ?, ?, ?, NOW())`;
      await connection.execute(query, [lesson.id, lesson.moduleId, lesson.title, lesson.duration, lesson.orderIndex]);
      lessonIds.push(lesson.id);
    }
    logger.info(`✅ Seeded ${lessons.length} lessons`);

    // Seed Lesson Contents
    logger.info('\n📝 Seeding Lesson Contents...');
    let contentCount = 0;
    for (const lessonId of lessonIds) {
      const contentId = uuidv4();
      const query = `
        INSERT INTO lesson_contents 
        (id, lessonId, videoUrl, transcript, notes, downloadLink, aiSummary, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const values = [
        contentId,
        lessonId,
        `https://example.com/videos/${lessonId}`,
        `Transcript for lesson ${lessonId}: Detailed video transcript content...`,
        `Key points:\n• Important concept 1\n• Important concept 2\n• Important concept 3`,
        `https://example.com/resources/${lessonId}.pdf`,
        `<h3>Lesson Summary</h3><p>AI-generated summary of the lesson content with key takeaways.</p>`,
      ];
      await connection.execute(query, values);
      contentCount++;
    }
    logger.info(`✅ Seeded ${contentCount} lesson contents`);

    // Seed Enrollments
    logger.info('\n📝 Seeding Enrollments...');
    let enrollmentCount = 0;
    const usersToEnroll = seedUsers.slice(1); // All users except admin
    for (const user of usersToEnroll) {
      for (let i = 0; i < Math.min(2, courseIds.length); i++) {
        const enrollmentId = uuidv4();
        const query = `
          INSERT INTO enrollments (id, userId, courseId, progress, enrolledAt, lastAccessed)
          VALUES (?, ?, ?, ?, NOW(), NOW())
        `;
        const progress = Math.floor(Math.random() * 100);
        await connection.execute(query, [enrollmentId, user.id, courseIds[i], progress]);
        enrollmentCount++;
      }
    }
    logger.info(`✅ Seeded ${enrollmentCount} enrollments`);

    // Seed Lesson Progress
    logger.info('\n📝 Seeding Lesson Progress...');
    let progressCount = 0;
    for (const user of usersToEnroll) {
      for (let i = 0; i < Math.min(2, lessonIds.length); i++) {
        const progressId = uuidv4();
        const completed = Math.random() > 0.5;
        const completedAt = completed ? new Date() : null;
        const query = `
          INSERT INTO lesson_progress (id, userId, lessonId, completed, completedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;
        await connection.execute(query, [progressId, user.id, lessonIds[i], completed ? 1 : 0, completedAt]);
        progressCount++;
      }
    }
    logger.info(`✅ Seeded ${progressCount} lesson progress records`);

    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
    logger.info('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run seed
runSeed().catch(error => {
  logger.error('❌ Seed script failed:', error);
  process.exit(1);
});
