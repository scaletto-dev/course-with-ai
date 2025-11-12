# Coursera Backend API

Production-ready backend API built with **Node.js**, **TypeScript**, **Express.js**, and **MySQL** following **Clean Architecture** pattern.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)
- [Development](#development)

## ✨ Features

- ✅ **Clean Architecture** - Separation of concerns with Domain, Application, and Infrastructure layers
- ✅ **TypeScript Strict Mode** - Full type safety and compile-time checking
- ✅ **Dependency Injection** - Using tsyringe for loose coupling
- ✅ **Repository Pattern** - Abstract data access with interfaces
- ✅ **Use Cases** - Business logic isolated in use case classes
- ✅ **MySQL with Connection Pooling** - Efficient database operations
- ✅ **Request Validation** - Using class-validator and class-transformer
- ✅ **Error Handling** - Centralized error handling with custom error classes
- ✅ **Security** - Helmet.js for HTTP headers, CORS, and Rate Limiting
- ✅ **Logging** - Winston logger for application and error logs
- ✅ **Environment Variables** - Dotenv for configuration management
- ✅ **DTOs** - Data Transfer Objects for API contracts
- ✅ **Mappers** - Entity-DTO mapping for clean API responses

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│     HTTP Layer (Controllers/Routes)     │
├─────────────────────────────────────────┤
│   Application Layer (Services/DTOs)     │
├─────────────────────────────────────────┤
│     Domain Layer (Entities/UseCases)    │
├─────────────────────────────────────────┤
│  Infrastructure Layer (DB/Repositories) │
└─────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── domain/
│   ├── entities/          # Business entities (User, etc)
│   ├── repositories/      # Repository interfaces
│   └── use-cases/         # Business logic operations
├── application/
│   ├── dtos/             # Data Transfer Objects
│   ├── mappers/          # Entity-DTO mappers
│   └── services/         # Application services
├── infrastructure/
│   ├── database/
│   │   ├── mysql/        # MySQL connection management
│   │   ├── repositories/ # Repository implementations
│   │   └── migrations/   # Database migrations
│   ├── http/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── middlewares/  # Express middlewares
│   │   ├── routes/       # Route definitions
│   │   └── validators/   # Request validation
│   └── config/           # Configuration files
├── shared/
│   ├── errors/           # Custom error classes
│   ├── utils/            # Utility functions
│   └── types/            # Shared TypeScript types
└── main.ts               # Application entry point
```

## 📦 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MySQL** >= 5.7

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

### 4. Update `.env` with your configuration

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=coursera_db

LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 🗄️ Database Setup

### 1. Run migrations

Migrations create the database and tables:

```bash
npm run migrate
```

### 2. Seed sample data (optional)

Populate the database with sample users:

```bash
npm run seed
```

## ▶️ Running the Application

### Development mode (with hot reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production build

```bash
npm run build
npm start
```

### Check health

```bash
curl http://localhost:3000/health
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### User Endpoints

#### Create User

```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "message": "Email already exists",
    "name": "ConflictError"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

#### Get User by ID

```http
GET /users/{id}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

#### Get All Users (Paginated)

```http
GET /users?page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user1@example.com",
      "username": "user1",
      "firstName": "User",
      "lastName": "One",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "message": "Error message",
    "name": "ErrorType"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Error Types:**

- `ValidationError` (400) - Validation failed
- `ConflictError` (409) - Resource already exists
- `NotFoundError` (404) - Resource not found
- `InternalServerError` (500) - Server error

## 🏭 Project Structure Details

### Domain Layer

**Entities** - Pure business logic, no external dependencies

```typescript
// User.ts - Domain entity with business methods
class User {
  getFullName(): string { ... }
  deactivate(): void { ... }
}
```

**Repositories** - Interface defining data access contracts

```typescript
// IUserRepository.ts - Interface
interface IUserRepository {
  save(user: User): Promise<Result<User>>;
  findById(id: string): Promise<Result<User | null>>;
}
```

**Use Cases** - Business logic operations

```typescript
// CreateUserUseCase.ts - Use case
class CreateUserUseCase {
  async execute(params: CreateUserInput): Promise<Result<User>> { ... }
}
```

### Application Layer

**DTOs** - Data transfer objects for API contracts

```typescript
// CreateUserDTO.ts - Input DTO with validation
class CreateUserDTO {
  @IsEmail()
  email: string;

  @Length(3, 50)
  username: string;
}
```

**Mappers** - Convert between entities and DTOs

```typescript
// UserMapper.ts
class UserMapper {
  static toDTO(user: User): UserResponseDTO { ... }
  static toDTOList(users: User[]): UserResponseDTO[] { ... }
}
```

**Services** - Orchestrate use cases and dependency injection

```typescript
// UserApplicationService.ts
@injectable()
class UserApplicationService {
  async createUser(createUserDTO: CreateUserDTO): Promise<Result<UserResponseDTO>> { ... }
}
```

### Infrastructure Layer

**Database** - MySQL connection and repository implementations

```typescript
// DatabaseConnection.ts - Connection pool management
// UserRepository.ts - Database operations
```

**HTTP** - Express controllers, routes, and middlewares

```typescript
// UserController.ts - Handle HTTP requests
// userRoutes.ts - Define routes
// validationMiddleware.ts - Validate request data
```

**Config** - Application configuration and DI setup

```typescript
// appConfig.ts - Environment variables
// dependencyInjection.ts - DI container setup
// expressApp.ts - Express app factory
```

## 🎯 Best Practices Implemented

### 1. Dependency Injection

Services receive dependencies through constructor injection:

```typescript
@injectable()
class UserApplicationService {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}
}
```

### 2. Repository Pattern

Data access abstracted behind interfaces:

```typescript
// Interface in domain
interface IUserRepository {
  save(user: User): Promise<Result<User>>;
}

// Implementation in infrastructure
class UserRepository implements IUserRepository {
  async save(user: User): Promise<Result<User>> { ... }
}
```

### 3. Use Cases

Business logic in dedicated classes:

```typescript
class CreateUserUseCase {
  async execute(params: CreateUserInput): Promise<Result<User>> {
    // Validation
    // Check duplicate email/username
    // Create user entity
    // Save via repository
  }
}
```

### 4. DTOs for API Contracts

Explicit API input/output types:

```typescript
// Request: CreateUserDTO - validation via decorators
// Response: UserResponseDTO - no sensitive data like password hash
```

### 5. Error Handling

Centralized with custom error classes:

```typescript
// Custom errors with appropriate status codes
class ValidationError extends AppError { statusCode = 400; }
class ConflictError extends AppError { statusCode = 409; }
class NotFoundError extends AppError { statusCode = 404; }
```

### 6. Result Type

Consistent error handling without exceptions:

```typescript
type Result<T> = Success<T> | Failure<Error>;

// Use case returns Result
const result = await useCase.execute(input);
if (!result.isSuccess) {
  return fail(result.error);
}
```

### 7. Logging

Structured logging with Winston:

```typescript
logger.info('User created', { userId: user.id });
logger.error('Database error', error);
```

### 8. Security

- **Helmet.js** - HTTP headers security
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Request validation
- **Password Hashing** - SHA-256 (use bcrypt/argon2 in production)

## ❌ Error Handling Strategy

### Error Flow

```
1. Controller receives request
2. Validation middleware validates request
3. Service/Use case processes, may return error in Result
4. Controller checks result.isSuccess
5. If error, return error response
6. Error handler middleware catches unexpected errors
```

### Custom Errors

All errors extend `AppError` and have:

- `statusCode` - HTTP status code
- `name` - Error type name
- `message` - Error description

### Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "message": "Validation failed",
    "name": "ValidationError"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## 🛠️ Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Run tests
npm test

# Check types
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Adding New Features

#### 1. Create Domain Entity

```typescript
// src/domain/entities/Course.ts
export class Course {
  id: string;
  title: string;
  // ... properties and methods
}
```

#### 2. Create Repository Interface

```typescript
// src/domain/repositories/ICourseRepository.ts
export interface ICourseRepository {
  save(course: Course): Promise<Result<Course>>;
  findById(id: string): Promise<Result<Course | null>>;
  // ... other methods
}
```

#### 3. Create Use Case

```typescript
// src/domain/use-cases/CreateCourseUseCase.ts
export class CreateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}
  
  async execute(params: CreateCourseInput): Promise<Result<Course>> {
    // Business logic
  }
}
```

#### 4. Create DTOs

```typescript
// src/application/dtos/CreateCourseDTO.ts
export class CreateCourseDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;
}
```

#### 5. Create Repository Implementation

```typescript
// src/infrastructure/database/repositories/CourseRepository.ts
export class CourseRepository implements ICourseRepository {
  async save(course: Course): Promise<Result<Course>> {
    // Database logic
  }
}
```

#### 6. Create Service

```typescript
// src/application/services/CourseApplicationService.ts
@injectable()
export class CourseApplicationService {
  constructor(
    @inject('ICourseRepository')
    private courseRepository: ICourseRepository,
  ) {}

  async createCourse(dto: CreateCourseDTO): Promise<Result<CourseResponseDTO>> {
    // Service logic
  }
}
```

#### 7. Create Controller

```typescript
// src/infrastructure/http/controllers/CourseController.ts
export class CourseController {
  constructor(private courseService: CourseApplicationService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Handle HTTP request
  }
}
```

#### 8. Create Routes

```typescript
// src/infrastructure/http/routes/courseRoutes.ts
export function createCourseRoutes(courseController: CourseController): Router {
  const router = Router();
  router.post('/', validationMiddleware(CreateCourseDTO), (req, res, next) => {
    void courseController.create(req, res, next);
  });
  return router;
}
```

#### 9. Register in main.ts

```typescript
const courseService = container.resolve(CourseApplicationService);
const courseController = new CourseController(courseService);
const courseRoutes = createCourseRoutes(courseController);

app.use('/api/courses', courseRoutes);
```

## 📝 Database Migration Example

To add a new migration:

```typescript
// src/infrastructure/database/migrations/add_course_table.ts
const CREATE_COURSES_TABLE = `
  CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;
```

## 🚀 Deployment

### Environment Setup

Create `.env` for your deployment environment:

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=coursera_db
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### Build and Run

```bash
npm run build
npm start
```

## 📄 License

MIT

## 👨‍💻 Author

Created as a production-ready backend template following Clean Architecture principles.

---

**Happy Coding!** 🎉
