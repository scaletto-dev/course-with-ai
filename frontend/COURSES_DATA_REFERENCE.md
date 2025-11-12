# Courses Data Structure - Frontend Reference

## Overview

This document provides detailed information about the course data structure used throughout the frontend application.

---

## Table of Contents

1. [Data Structure](#data-structure)
2. [Available Courses](#available-courses)
3. [Categories](#categories)
4. [File Location](#file-location)
5. [Usage Examples](#usage-examples)

---

## Data Structure

### Course Interface

```typescript
interface Course {
  id: string;              // Unique identifier (string number)
  title: string;           // Course title/name
  instructor: string;      // Instructor name
  duration: string;        // Duration format: "X Modules • Xh Xm"
  description: string;     // Brief course description
  thumbnail: string;       // Image URL
  category: string;        // Course category
  enrolled?: boolean;      // Whether user is enrolled (optional)
  progress?: number;       // Progress percentage 0-100 (optional)
}
```

### Field Descriptions

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| id | string | Yes | '1', '2' | Unique identifier |
| title | string | Yes | 'Introduction to Web Development' | Course name |
| instructor | string | Yes | 'Sarah Johnson' | Full name of instructor |
| duration | string | Yes | '6 Modules • 1h 45m' | Total course duration |
| description | string | Yes | 'Learn the fundamentals...' | Short description (50-200 chars) |
| thumbnail | string | Yes | 'https://...' | Image URL (400x200 recommended) |
| category | string | Yes | 'Web Development' | Course category/subject |
| enrolled | boolean | No | true/false | Default: false |
| progress | number | No | 0-100 | Only if enrolled=true |

---

## Available Courses

### Course #1: Introduction to Web Development

```typescript
{
  id: '1',
  title: 'Introduction to Web Development',
  instructor: 'Sarah Johnson',
  duration: '6 Modules • 1h 45m',
  description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.',
  thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
  category: 'Web Development',
  enrolled: true,
  progress: 33
}
```

**Details**:
- **Topics**: HTML, CSS, JavaScript basics
- **Level**: Beginner
- **Modules**: 6
- **Total Duration**: 1 hour 45 minutes
- **Status**: Enrolled, 33% complete
- **Best For**: Complete beginners in web development

---

### Course #2: Machine Learning Fundamentals

```typescript
{
  id: '2',
  title: 'Machine Learning Fundamentals',
  instructor: 'Dr. Michael Chen',
  duration: '12 Modules • 4h 30m',
  description: 'Dive into machine learning concepts, algorithms, and practical applications using Python and popular ML libraries.',
  thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
  category: 'AI & Machine Learning'
}
```

**Details**:
- **Topics**: ML algorithms, Python, libraries (scikit-learn, TensorFlow)
- **Level**: Intermediate
- **Modules**: 12
- **Total Duration**: 4 hours 30 minutes
- **Status**: Not enrolled
- **Prerequisites**: Python programming basics

---

### Course #3: UI/UX Design Principles

```typescript
{
  id: '3',
  title: 'UI/UX Design Principles',
  instructor: 'Emily Rodriguez',
  duration: '8 Modules • 2h 15m',
  description: 'Master the principles of user interface and user experience design to create beautiful, intuitive digital products.',
  thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
  category: 'Design',
  enrolled: true,
  progress: 75
}
```

**Details**:
- **Topics**: UI design, UX principles, user research, wireframing
- **Level**: Beginner to Intermediate
- **Modules**: 8
- **Total Duration**: 2 hours 15 minutes
- **Status**: Enrolled, 75% complete
- **Best For**: Aspiring designers

---

### Course #4: Cloud Computing with AWS

```typescript
{
  id: '4',
  title: 'Cloud Computing with AWS',
  instructor: 'James Wilson',
  duration: '10 Modules • 3h 20m',
  description: 'Learn cloud infrastructure, services, and deployment strategies using Amazon Web Services (AWS).',
  thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
  category: 'Cloud Computing'
}
```

**Details**:
- **Topics**: AWS services, EC2, S3, deployment, scaling
- **Level**: Intermediate
- **Modules**: 10
- **Total Duration**: 3 hours 20 minutes
- **Status**: Not enrolled
- **Prerequisites**: Basic Linux/system administration knowledge

---

### Course #5: Data Science with Python

```typescript
{
  id: '5',
  title: 'Data Science with Python',
  instructor: 'Dr. Lisa Anderson',
  duration: '15 Modules • 5h 45m',
  description: 'Comprehensive course covering data analysis, visualization, and statistical modeling using Python and pandas.',
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
  category: 'Data Science'
}
```

**Details**:
- **Topics**: Python, pandas, NumPy, data visualization, statistics
- **Level**: Intermediate
- **Modules**: 15
- **Total Duration**: 5 hours 45 minutes
- **Status**: Not enrolled
- **Prerequisites**: Python programming basics

---

### Course #6: Mobile App Development

```typescript
{
  id: '6',
  title: 'Mobile App Development',
  instructor: 'David Kim',
  duration: '14 Modules • 4h 50m',
  description: 'Build native mobile applications for iOS and Android using React Native and modern development practices.',
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
  category: 'Mobile Development'
}
```

**Details**:
- **Topics**: React Native, iOS, Android, mobile UI/UX
- **Level**: Intermediate to Advanced
- **Modules**: 14
- **Total Duration**: 4 hours 50 minutes
- **Status**: Not enrolled
- **Prerequisites**: JavaScript/React knowledge

---

## Categories

Available course categories:

1. **Web Development**
   - Courses: Introduction to Web Development
   - Focus: HTML, CSS, JavaScript, frontend frameworks

2. **AI & Machine Learning**
   - Courses: Machine Learning Fundamentals
   - Focus: ML algorithms, neural networks, deep learning

3. **Design**
   - Courses: UI/UX Design Principles
   - Focus: Design principles, user research, prototyping

4. **Cloud Computing**
   - Courses: Cloud Computing with AWS
   - Focus: Cloud platforms, infrastructure, DevOps

5. **Data Science**
   - Courses: Data Science with Python
   - Focus: Data analysis, visualization, statistics

6. **Mobile Development**
   - Courses: Mobile App Development
   - Focus: iOS, Android, React Native, mobile-specific patterns

---

## File Location

**File**: `src/data/coursesData.ts`

**Path**: `frontend/src/data/coursesData.ts`

**Import**:
```typescript
import { coursesData, Course } from '../data/coursesData';
```

---

## Usage Examples

### 1. Display All Courses

```typescript
import { coursesData } from '../data/coursesData';

function AllCourses() {
  return (
    <div>
      {coursesData.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.instructor}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Find Course by ID

```typescript
import { coursesData } from '../data/coursesData';

function getCourseById(courseId: string) {
  return coursesData.find(course => course.id === courseId);
}

const course = getCourseById('1');
console.log(course?.title); // "Introduction to Web Development"
```

### 3. Filter by Category

```typescript
import { coursesData } from '../data/coursesData';

function getCoursesByCategory(category: string) {
  return coursesData.filter(course => course.category === category);
}

const webDevCourses = getCoursesByCategory('Web Development');
```

### 4. Get Enrolled Courses

```typescript
import { coursesData } from '../data/coursesData';

function getEnrolledCourses() {
  return coursesData.filter(course => course.enrolled === true);
}

const myEnrolledCourses = getEnrolledCourses();
```

### 5. Calculate Total Duration

```typescript
import { coursesData } from '../data/coursesData';

function calculateTotalDuration() {
  // Extract hours and minutes from duration string
  const totalMinutes = coursesData.reduce((acc, course) => {
    const match = course.duration.match(/(\d+)h\s(\d+)m/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return acc + (hours * 60) + minutes;
    }
    return acc;
  }, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
```

### 6. Search Courses

```typescript
import { coursesData } from '../data/coursesData';

function searchCourses(query: string) {
  const lowerQuery = query.toLowerCase();
  return coursesData.filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.category.toLowerCase().includes(lowerQuery)
  );
}

const results = searchCourses('python');
```

### 7. Sort Courses

```typescript
import { coursesData } from '../data/coursesData';

// Sort by title (A-Z)
const sortedByTitle = [...coursesData].sort((a, b) =>
  a.title.localeCompare(b.title)
);

// Sort by duration (longest first)
const sortedByDuration = [...coursesData].sort((a, b) => {
  const getDurationMinutes = (duration: string) => {
    const match = duration.match(/(\d+)h\s(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };
  
  return getDurationMinutes(b.duration) - getDurationMinutes(a.duration);
});

// Sort by progress (highest first, for enrolled courses)
const sortedByProgress = [...coursesData]
  .filter(c => c.enrolled)
  .sort((a, b) => (b.progress || 0) - (a.progress || 0));
```

### 8. Get Course Statistics

```typescript
import { coursesData } from '../data/coursesData';

function getCourseStats() {
  return {
    totalCourses: coursesData.length,
    enrolledCourses: coursesData.filter(c => c.enrolled).length,
    categories: new Set(coursesData.map(c => c.category)).size,
    instructors: new Set(coursesData.map(c => c.instructor)).size,
    avgProgress: (() => {
      const enrolled = coursesData.filter(c => c.enrolled);
      if (enrolled.length === 0) return 0;
      const total = enrolled.reduce((sum, c) => sum + (c.progress || 0), 0);
      return Math.round(total / enrolled.length);
    })()
  };
}

// Output:
// {
//   totalCourses: 6,
//   enrolledCourses: 2,
//   categories: 6,
//   instructors: 6,
//   avgProgress: 54
// }
```

---

## Data Validation

### Course Object Validation

```typescript
function validateCourse(course: any): course is Course {
  return (
    typeof course.id === 'string' &&
    typeof course.title === 'string' &&
    typeof course.instructor === 'string' &&
    typeof course.duration === 'string' &&
    typeof course.description === 'string' &&
    typeof course.thumbnail === 'string' &&
    typeof course.category === 'string' &&
    (course.enrolled === undefined || typeof course.enrolled === 'boolean') &&
    (course.progress === undefined || 
     (typeof course.progress === 'number' && course.progress >= 0 && course.progress <= 100))
  );
}
```

---

## Adding New Courses

To add a new course to `coursesData`:

1. **Find an appropriate thumbnail image URL** (400x200 recommended)
2. **Create the course object**:
   ```typescript
   {
     id: '7',  // Next available ID
     title: 'Your Course Title',
     instructor: 'Instructor Name',
     duration: 'X Modules • Xh Xm',
     description: 'Short description (50-200 characters)',
     thumbnail: 'https://image-url.jpg',
     category: 'Your Category',
     enrolled: false,  // or true if needed
     progress: 0       // or specific percentage if enrolled
   }
   ```
3. **Add to the `coursesData` array**
4. **Update this documentation**

---

## Data Types & Exports

### Type Exports

```typescript
// From src/data/coursesData.ts
export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  description: string;
  thumbnail: string;
  category: string;
  enrolled?: boolean;
  progress?: number;
}

export const coursesData: Course[];
```

### Usage in Other Components

```typescript
import { Course, coursesData } from '../data/coursesData';

interface CourseListProps {
  courses: Course[];
}

function CourseList({ courses }: CourseListProps) {
  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

---

## Future Enhancements

### Recommended Data Additions

1. **ratings**: number (0-5)
2. **enrolledCount**: number
3. **difficulty**: 'Beginner' | 'Intermediate' | 'Advanced'
4. **prerequisites**: string[]
5. **lessons**: Lesson[] (for detail page)
6. **tags**: string[]
7. **price**: number | 'free'
8. **startDate**: string (ISO date)
9. **isFeatured**: boolean
10. **certificateEarned**: boolean (if enrolled)

### Example with Full Data

```typescript
interface CourseFull extends Course {
  ratings: number;
  enrolledCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  lessons: Lesson[];
  tags: string[];
  price: number | 'free';
  startDate: string;
  isFeatured: boolean;
  certificateEarned?: boolean;
}
```

---

## Performance Notes

- **Current Data Size**: ~1.5 KB
- **Load Time**: Instant (no API call)
- **Scalability**: Fine for up to ~100 courses
- **Recommendation**: For larger datasets, migrate to API-based loading

---

## API Integration (Future)

Current implementation uses static data. For dynamic course data:

```typescript
async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('http://localhost:3000/api/courses');
  const data = await response.json();
  return data.data; // or appropriate response path
}
```

---

## Testing Examples

```typescript
// Test course by ID
const course1 = coursesData.find(c => c.id === '1');
expect(course1?.title).toBe('Introduction to Web Development');

// Test filtering
const enrolled = coursesData.filter(c => c.enrolled);
expect(enrolled.length).toBe(2);

// Test category filtering
const design = coursesData.filter(c => c.category === 'Design');
expect(design.length).toBe(1);
```

---

## Related Files

- **Component**: `src/components/CourseCard.tsx`
- **Component**: `src/components/CourseList.tsx`
- **Page**: `src/pages/HomePage.tsx`
- **Specification**: `COURSE_LIST_PAGE_SPEC.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-01 | Initial data structure documentation |

