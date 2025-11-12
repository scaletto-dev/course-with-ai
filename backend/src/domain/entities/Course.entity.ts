/**
 * ICourse
 * 
 * Interface defining the shape of a Course domain entity.
 * All properties required for a complete Course object.
 * 
 * @interface ICourse
 */
export interface ICourse {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  isActive: boolean;
  enrolled?: boolean;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course
 * 
 * Core domain entity representing a course in the system.
 * Encapsulates course business logic and rules.
 * Independent of any framework or external dependencies.
 * 
 * @class Course
 * @implements {ICourse}
 * 
 * @example
 * const course = new Course({
 *   id: 'course-123',
 *   title: 'Web Development Fundamentals',
 *   instructor: 'John Doe',
 *   duration: '6 weeks',
 *   description: 'Learn web development...',
 *   thumbnail: 'https://...',
 *   category: 'Web Development',
 *   isActive: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * 
 * if (course.isAvailable()) {
 *   console.log(course.getSummary());
 * }
 */
export class Course implements ICourse {
  public id: string;
  public title: string;
  public instructor: string;
  public duration: string;
  public description: string;
  public thumbnail: string;
  public category: string;
  public difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  public rating: number;
  public students: number;
  public isActive: boolean;
  public enrolled?: boolean;
  public progress?: number;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(props: ICourse) {
    this.id = props.id;
    this.title = props.title;
    this.instructor = props.instructor;
    this.duration = props.duration;
    this.description = props.description;
    this.thumbnail = props.thumbnail;
    this.category = props.category;
    this.difficulty = props.difficulty;
    this.rating = props.rating;
    this.students = props.students;
    this.isActive = props.isActive;
    this.enrolled = props.enrolled;
    this.progress = props.progress;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Get a formatted summary of the course.
   * 
   * @returns {string} A formatted string with course title, instructor, and duration
   * 
   * @example
   * const summary = course.getSummary();
   * // Returns: "Web Development Fundamentals by John Doe (6 weeks)"
   */
  public getSummary(): string {
    return `${this.title} by ${this.instructor} (${this.duration})`;
  }

  /**
   * Check if the course is currently available/active.
   * 
   * @returns {boolean} True if the course is active, false otherwise
   * 
   * @example
   * if (course.isAvailable()) {
   *   console.log('Course can be enrolled');
   * }
   */
  public isAvailable(): boolean {
    return this.isActive;
  }

  /**
   * Validate course business rules
   *
   * Business Rules:
   * - Title must be at least 3 characters
   * - Duration must not be empty
   * - Category must not be empty
   * - Difficulty must be valid
   * - Rating must be between 0 and 5
   * - Students must be non-negative
   * - Instructor must be at least 3 characters
   * - Description must be at least 10 characters
   *
   * @returns {boolean} true if course is valid, false otherwise
   */
  public isValid(): boolean {
    // Title validation
    if (!this.title || this.title.trim().length < 3) {
      return false;
    }

    // Duration validation
    if (!this.duration || this.duration.trim().length === 0) {
      return false;
    }

    // Category validation
    if (!this.category || this.category.trim().length === 0) {
      return false;
    }

    // Difficulty validation
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(this.difficulty)) {
      return false;
    }

    // Rating validation (0-5)
    if (this.rating < 0 || this.rating > 5) {
      return false;
    }

    // Students validation
    if (this.students < 0) {
      return false;
    }

    // Instructor validation
    if (!this.instructor || this.instructor.trim().length < 3) {
      return false;
    }

    // Description validation
    if (!this.description || this.description.trim().length < 10) {
      return false;
    }

    return true;
  }

  /**
   * Update course properties
   *
   * @param data - Partial course data to update
   */
  public update(data: Partial<ICourse>): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.instructor !== undefined) this.instructor = data.instructor;
    if (data.duration !== undefined) this.duration = data.duration;
    if (data.description !== undefined) this.description = data.description;
    if (data.thumbnail !== undefined) this.thumbnail = data.thumbnail;
    if (data.category !== undefined) this.category = data.category;
    if (data.difficulty !== undefined) this.difficulty = data.difficulty;
    if (data.rating !== undefined) this.rating = data.rating;
    if (data.students !== undefined) this.students = data.students;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    if (data.enrolled !== undefined) this.enrolled = data.enrolled;
    if (data.progress !== undefined) this.progress = data.progress;
    this.updatedAt = new Date();
  }
}
