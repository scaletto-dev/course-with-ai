# Course List Page - Specification

## Overview

The Course List Page (Home Page) displays a grid of available courses that users can browse, search, and filter.

**URL**: `/`  
**Component**: `HomePage.tsx`  
**Child Components**: 
- `Navbar.tsx` - Navigation and search bar
- `CourseList.tsx` - Course grid layout
- `CourseCard.tsx` - Individual course card

---

## Page Features

### 1. Navigation Bar (Navbar)
Located at the top of the page for site-wide navigation and course search.

**Features**:
- Logo/Site title
- Search input field
- User menu (optional future feature)

### 2. Header Section
Introductory section with welcome message.

**Content**:
- Title: "Explore Courses"
- Subtitle: "Discover your next learning adventure from our curated collection"

### 3. Course Grid
Responsive grid layout displaying course cards.

**Grid Layout**:
- Desktop: 3 columns (`lg:grid-cols-3`)
- Tablet: 2 columns (`md:grid-cols-2`)
- Mobile: 1 column (`grid-cols-1`)
- Gap: 24px between items

**Features**:
- Empty state message when no courses match search
- Smooth animations and hover effects

---

## Course Card Component

### Visual Structure

```
┌─────────────────────────────────────┐
│                                     │
│    [Course Thumbnail Image]         │
│         (w: 100%, h: 192px)         │
│           (If Enrolled)             │
│         [Enrolled Badge]            │
│                                     │
├─────────────────────────────────────┤
│  [Category Tag] (blue background)   │
│                                     │
│  Course Title (2 lines max)         │
│  Course Title (2 lines max)         │
│                                     │
│  Course description text...         │
│  Course description text... (2 lines│
│                                     │
│  👤 Instructor Name  ⏱️ Duration   │
│                                     │
│  (Optional Progress Bar if enrolled)│
│  ████████░░░░ 33%                  │
│                                     │
│        [View Course Button]         │
│                                     │
└─────────────────────────────────────┘
```

### Card Properties

**Dimensions**:
- Width: Responsive (grid based)
- Height: Auto (content-driven)
- Border Radius: 16px
- Shadow: Light hover effect

**Interactivity**:
- Hover: Scale up 5% + shadow increase
- Transition: 300ms duration
- Button: Changes text based on enrollment status

---

## Data Structure

### Course Object

```typescript
interface Course {
  id: string;              // Unique identifier
  title: string;           // Course title
  instructor: string;      // Instructor name
  duration: string;        // Duration format: "X Modules • Xh Xm"
  description: string;     // Short course description
  thumbnail: string;       // Image URL
  category: string;        // Course category
  enrolled?: boolean;      // Is user enrolled (optional)
  progress?: number;       // Progress percentage 0-100 (optional)
}
```

### Sample Course Data

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

---

## Current Courses

### 1. Introduction to Web Development
- **ID**: 1
- **Instructor**: Sarah Johnson
- **Duration**: 6 Modules • 1h 45m
- **Category**: Web Development
- **Status**: Enrolled (33% complete)
- **Description**: Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners starting their coding journey.

### 2. Machine Learning Fundamentals
- **ID**: 2
- **Instructor**: Dr. Michael Chen
- **Duration**: 12 Modules • 4h 30m
- **Category**: AI & Machine Learning
- **Status**: Not enrolled
- **Description**: Dive into machine learning concepts, algorithms, and practical applications using Python and popular ML libraries.

### 3. UI/UX Design Principles
- **ID**: 3
- **Instructor**: Emily Rodriguez
- **Duration**: 8 Modules • 2h 15m
- **Category**: Design
- **Status**: Enrolled (75% complete)
- **Description**: Master the principles of user interface and user experience design to create beautiful, intuitive digital products.

### 4. Cloud Computing with AWS
- **ID**: 4
- **Instructor**: James Wilson
- **Duration**: 10 Modules • 3h 20m
- **Category**: Cloud Computing
- **Status**: Not enrolled
- **Description**: Learn cloud infrastructure, services, and deployment strategies using Amazon Web Services (AWS).

### 5. Data Science with Python
- **ID**: 5
- **Instructor**: Dr. Lisa Anderson
- **Duration**: 15 Modules • 5h 45m
- **Category**: Data Science
- **Status**: Not enrolled
- **Description**: Comprehensive course covering data analysis, visualization, and statistical modeling using Python and pandas.

### 6. Mobile App Development
- **ID**: 6
- **Instructor**: David Kim
- **Duration**: 14 Modules • 4h 50m
- **Category**: Mobile Development
- **Status**: Not enrolled
- **Description**: Build native mobile applications for iOS and Android using React Native and modern development practices.

---

## Functionality

### Search Feature

**Implementation**: Real-time filter as user types

**Search Fields**: Searches across:
- Course title
- Course description
- Course category

**Behavior**:
- Case-insensitive search
- Live filtering (no button needed)
- Displays "No courses found" message if no matches

**Code**:
```typescript
const filteredCourses = coursesData.filter(course => 
  course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  course.category.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### Course Card Click

**Action**: Navigate to course detail page

**Route**: `/course/{courseId}`

**Button Text**:
- If enrolled: "Continue Learning"
- If not enrolled: "View Course"

---

## Styling Details

### Colors
- **Background**: `bg-gray-50` (light gray)
- **Card Background**: `white`
- **Primary Action**: `bg-blue-600` (hover: `bg-blue-700`)
- **Category Tag**: `bg-blue-50` text `text-blue-600`
- **Enrolled Badge**: `bg-blue-600` text `text-white`
- **Text Primary**: `text-gray-900`
- **Text Secondary**: `text-gray-600`
- **Text Tertiary**: `text-gray-500`

### Typography
- **Page Title**: `text-4xl font-bold`
- **Page Subtitle**: `text-lg text-gray-600`
- **Card Title**: `text-xl font-semibold line-clamp-2`
- **Card Description**: `text-sm text-gray-600 line-clamp-2`
- **Meta Info**: `text-sm text-gray-500`
- **Category Tag**: `text-xs font-medium`
- **Button**: `font-medium`

### Spacing
- **Page Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- **Header Margin**: `mb-8`
- **Grid Gap**: `gap-6`
- **Card Padding**: `p-6`
- **Card Image Height**: `h-48`

### Responsive Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns, `md:`)
- **Desktop**: > 1024px (3 columns, `lg:`)

---

## Component Hierarchy

```
HomePage
├── Navbar
│   └── [Search Input]
└── main
    ├── [Header Section]
    └── CourseList
        ├── CourseCard #1
        │   ├── [Thumbnail Image]
        │   ├── [Enrolled Badge] (conditional)
        │   ├── [Category Tag]
        │   ├── [Title]
        │   ├── [Description]
        │   ├── [Instructor & Duration]
        │   ├── [Progress Bar] (conditional)
        │   └── [Button]
        ├── CourseCard #2
        │   └── ...
        └── CourseCard #N
            └── ...
```

---

## Empty States

### No Courses Found
**Condition**: Search returns 0 results

**Display**:
```
┌─────────────────────────────────────┐
│                                     │
│  No courses found. Try a different  │
│  search.                            │
│                                     │
└─────────────────────────────────────┘
```

**Styling**:
- Centered text
- `text-lg text-gray-500`
- Padding: `py-12`

---

## State Management

### HomePage State
```typescript
const [searchQuery, setSearchQuery] = useState('');
```

**Properties**:
- `searchQuery`: Current search text
- `filteredCourses`: Computed courses matching search

**Updates**:
- When user types in search bar: `onSearchChange={setSearchQuery}`

---

## File Structure

```
src/
├── pages/
│   └── HomePage.tsx          # Main page component
├── components/
│   ├── Navbar.tsx            # Navigation & search
│   ├── CourseList.tsx        # Grid layout
│   └── CourseCard.tsx        # Individual card
└── data/
    └── coursesData.ts        # Course data & types
```

---

## Accessibility Features

### Screen Readers
- Image alt text: `alt={course.title}`
- Semantic HTML structure
- Link text: "View Course" / "Continue Learning"

### Keyboard Navigation
- All buttons/links are keyboard accessible
- Tab order follows visual layout

### Color Contrast
- Text colors meet WCAG AA standards
- Badges have sufficient contrast

---

## Performance Considerations

### Optimization
1. **Images**: Lazy loading (future implementation)
2. **Grid**: CSS Grid is GPU-accelerated
3. **Search**: Instant filtering (data size is manageable)

### Future Improvements
1. Pagination for larger course lists
2. Course filtering by category
3. Sorting options (by popularity, newest, etc.)
4. Course ratings display
5. Difficulty level indicators

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Responsive on all mobile devices

---

## Notes for Developers

1. **Images**: Using Unsplash URLs in demo. Replace with real course thumbnails in production.
2. **Styling**: Uses Tailwind CSS classes. All colors and spacing follow the design system.
3. **Navigation**: Links use React Router v6 `Link` component.
4. **Responsive**: Fully responsive using Tailwind's breakpoint system.
5. **Future**: Add filters, sorting, and more detailed course information.

---

## Testing Checklist

- [ ] All courses display correctly
- [ ] Search filters work in real-time
- [ ] Cards are responsive on mobile/tablet/desktop
- [ ] Enrolled badge shows only for enrolled courses
- [ ] Progress bar displays only for enrolled courses
- [ ] Button text changes based on enrollment status
- [ ] Clicking a course navigates to detail page
- [ ] Empty state displays when no search results
- [ ] Hover effects work smoothly
- [ ] Images load properly
- [ ] Page is accessible with screen reader

---

## Future Enhancements

1. **Course Filtering**
   - Filter by category
   - Filter by difficulty level
   - Filter by duration

2. **Sorting Options**
   - Sort by popularity
   - Sort by newest
   - Sort by rating
   - Sort by duration

3. **Course Info**
   - Display star rating
   - Show number of enrolled students
   - Display difficulty level
   - Show prerequisites

4. **Pagination**
   - Handle large course lists
   - Infinite scroll option
   - Page-based navigation

5. **Advanced Search**
   - Search suggestions
   - Search history
   - Related courses

6. **User Features**
   - Wishlist/bookmark courses
   - Course recommendations
   - Enrollment statistics

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-01 | Initial specification |

