# Clean Architecture Implementation Guide

## 📐 Architecture Overview

This project implements **Clean Architecture** principles as described by Robert C. Martin (Uncle Bob). The architecture emphasizes:

1. **Independence from frameworks** - The business logic doesn't depend on Express, TypeScript, MySQL, etc.
2. **Testability** - The core business logic can be tested without external dependencies
3. **Independence from UI** - Business logic remains the same regardless of interface
4. **Independence from database** - Database layer can be swapped without affecting business logic
5. **Independence from external agencies** - Business logic is isolated from external services

## 🏛️ The Four Layers

### 1. **Domain Layer** (Core Business Logic)

The innermost layer. Contains **business rules** that would still apply even if we changed everything else about the application.

**Responsibilities:**
- Define business entities
- Define repository interfaces (contracts)
- Define use cases (business operations)

**Key Principle:** 
- Has **NO dependencies** on other layers
- Uses only **plain TypeScript/JavaScript**
- Defines what the system should do

**Files:**
```
domain/
├── entities/          # Business objects (User, Course, etc)
├── repositories/      # Data access contracts (interfaces only)
└── use-cases/         # Business operation orchestration
```

**Example - User Entity:**

```typescript
// domain/entities/User.ts
export class User {
  // Business properties
  id: string;
  email: string;
  
  // Business methods (rules that must always apply)
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  
  deactivate(): void {
    this.isActive = false;
  }
}
```

**Example - Repository Interface:**

```typescript
// domain/repositories/IUserRepository.ts
export interface IUserRepository {
  // The domain layer only defines the contract
  // Implementation details are in infrastructure layer
  save(user: User): Promise<Result<User>>;
  findById(id: string): Promise<Result<User | null>>;
}
```

**Example - Use Case:**

```typescript
// domain/use-cases/CreateUserUseCase.ts
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(params: CreateUserInput): Promise<Result<User>> {
    // Business logic
    // 1. Validate input
    // 2. Check if email exists
    // 3. Create user entity
    // 4. Save via repository (abstracted interface)
  }
}
```

**Why it matters:**
- If we need to change database from MySQL to PostgreSQL, domain layer doesn't change
- If we need to change from REST API to GraphQL, domain layer doesn't change
- Business rules are documented in code

---

### 2. **Application Layer** (Use Case Orchestration)

The second layer. Orchestrates use cases and translates between external format and domain entities.

**Responsibilities:**
- Define Data Transfer Objects (DTOs)
- Map between DTOs and entities
- Orchestrate use cases
- Handle application services
- Define application workflows

**Key Principle:**
- Depends on **Domain layer only**
- Doesn't know about HTTP, database details, etc.
- All dependencies are injected

**Files:**
```
application/
├── dtos/              # Input/Output data contracts
├── mappers/           # Entity ↔ DTO transformations
└── services/          # Use case orchestration
```

**Example - DTOs:**

```typescript
// application/dtos/CreateUserDTO.ts
export class CreateUserDTO {
  @IsEmail()
  email!: string;
  
  @Length(3, 50)
  username!: string;
}

// application/dtos/UserResponseDTO.ts
export class UserResponseDTO {
  id!: string;
  email!: string;
  // Note: NO passwordHash here (sensitive data filtered)
}
```

**Example - Mapper:**

```typescript
// application/mappers/UserMapper.ts
export class UserMapper {
  // Entity → DTO (filter sensitive data)
  static toDTO(user: User): UserResponseDTO {
    const dto = new UserResponseDTO();
    dto.id = user.id;
    dto.email = user.email;
    // passwordHash is NOT included
    return dto;
  }
}
```

**Example - Application Service:**

```typescript
// application/services/UserApplicationService.ts
@injectable()
export class UserApplicationService {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}
  
  async createUser(createUserDTO: CreateUserDTO): Promise<Result<UserResponseDTO>> {
    // 1. Call use case with mapped input
    const useCase = new CreateUserUseCase(this.userRepository);
    const result = await useCase.execute(input);
    
    // 2. Return mapped result
    if (!result.isSuccess) {
      return fail(result.error);
    }
    
    const userDTO = UserMapper.toDTO(result.value);
    return ok(userDTO);
  }
}
```

**Why it matters:**
- DTOs define API contracts (what clients send/receive)
- Mappers ensure entities are never exposed in responses
- Services orchestrate complex business flows
- Easy to test without infrastructure layer

---

### 3. **Infrastructure Layer** (External Concerns)

The third layer. Implements interfaces defined in domain layer and provides technical mechanisms.

**Responsibilities:**
- Database implementations (MySQL, repositories)
- HTTP framework (Express, controllers, routes)
- External service integrations
- Configuration

**Key Principle:**
- Implements domain layer interfaces
- Depends on all other layers
- Technical details hidden from business logic

**Files:**
```
infrastructure/
├── database/
│   ├── mysql/          # Database connection
│   ├── repositories/   # Repository implementations
│   └── migrations/     # Schema changes
├── http/
│   ├── controllers/    # HTTP request handlers
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # Route definitions
│   └── validators/     # Request validation
└── config/             # Configuration & DI setup
```

**Example - Database Connection:**

```typescript
// infrastructure/database/mysql/DatabaseConnection.ts
export class DatabaseConnection {
  async initialize(): Promise<void> {
    // Create connection pool
    // This is a technical detail the domain doesn't care about
  }
}
```

**Example - Repository Implementation:**

```typescript
// infrastructure/database/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  // Implements the interface from domain layer
  async save(user: User): Promise<Result<User>> {
    const connection = await this.db.getConnection();
    try {
      const query = `INSERT INTO users (...)VALUES(?)`;
      await connection.execute(query, [...]);
      return ok(user);
    } catch (error) {
      return fail(new InternalServerError(...));
    }
  }
}
```

**Example - Controller:**

```typescript
// infrastructure/http/controllers/UserController.ts
export class UserController {
  constructor(private userService: UserApplicationService) {}
  
  async create(req: Request, res: Response): Promise<void> {
    // 1. Extract HTTP request data
    const createUserDTO = req.body;
    
    // 2. Call application service
    const result = await this.userService.createUser(createUserDTO);
    
    // 3. Return HTTP response
    if (!result.isSuccess) {
      res.status(result.error.statusCode).json(errorResponse(...));
      return;
    }
    
    res.status(201).json(successResponse(result.value));
  }
}
```

**Example - Routes:**

```typescript
// infrastructure/http/routes/userRoutes.ts
export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  
  router.post(
    '/',
    validationMiddleware(CreateUserDTO),  // Validate input
    (req, res, next) => userController.create(req, res, next)
  );
  
  return router;
}
```

**Why it matters:**
- Database can be swapped (MySQL → PostgreSQL → MongoDB)
- Framework can be changed (Express → Fastify → Koa)
- External service APIs can be changed
- Business logic remains completely unaffected

---

### 4. **Shared/Cross-Cutting Layer** (Utilities)

The outermost layer. Shared utilities and types used across the application.

**Responsibilities:**
- Custom error classes
- Utility functions
- Shared types and interfaces
- Logging

**Key Principle:**
- Independent utilities
- Used by all other layers

**Files:**
```
shared/
├── errors/             # Custom error classes
├── utils/              # Helper functions
├── types/              # Shared TypeScript types
```

---

## 🔄 Dependency Flow

### Correct Flow (Dependency Inversion)

```
Presentation Layer (Controllers/Routes)
    ↓ depends on
Application Layer (Services/DTOs)
    ↓ depends on
Domain Layer (Entities/UseCases/Repository Interfaces)
    
Infrastructure Layer (Repositories/Database)
    ↓ implements
Domain Layer Repository Interfaces
```

**Key Point:** The domain layer defines interfaces, infrastructure implements them. The dependency points from outer to inner, NOT from inner to outer. This is called **Dependency Inversion Principle**.

### How Dependency Injection Works

```typescript
// Infrastructure provides implementation
const userRepository = new UserRepository(db);

// Domain layer uses interface, not concrete implementation
class CreateUserUseCase {
  constructor(private repo: IUserRepository) {}  // Interface type
}

// Application service gets repository injected
@injectable()
class UserApplicationService {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository,  // Injected implementation
  ) {}
}

// Container wires everything together
container.register('IUserRepository', {
  useValue: new UserRepository(db),
});
```

---

## 🎯 Common Patterns in This Architecture

### 1. **Result Type** (Error Handling without Exceptions)

```typescript
type Result<T> = Success<T> | Failure<Error>;

// Use cases return Result, not throw
const result = await useCase.execute(input);

if (!result.isSuccess) {
  // Handle error
  return fail(result.error);
}

// Use value
const user = result.value;
```

**Benefits:**
- Explicit error handling
- No try-catch noise
- Type-safe error handling

### 2. **Repository Pattern** (Data Access Abstraction)

```typescript
// Domain defines interface
interface IUserRepository {
  save(user: User): Promise<Result<User>>;
  findById(id: string): Promise<Result<User | null>>;
}

// Infrastructure implements it
class UserRepository implements IUserRepository {
  async save(user: User): Promise<Result<User>> { ... }
}

// Domain uses interface (doesn't know about MySQL, queries, etc)
class CreateUserUseCase {
  constructor(private repo: IUserRepository) {}
}
```

**Benefits:**
- Database changes don't affect business logic
- Easy to mock for testing
- Can have multiple implementations (MySQL, PostgreSQL, etc)

### 3. **Entity-DTO Separation** (API Contract Protection)

```typescript
// Domain entity (internal, with business methods)
class User {
  passwordHash: string;  // Sensitive!
  
  deactivate(): void { ... }
  
  getFullName(): string { ... }
}

// API DTO (external, safe to expose)
class UserResponseDTO {
  id: string;
  email: string;
  // NO passwordHash!
}

// Mapper handles conversion
const userDTO = UserMapper.toDTO(user);
```

**Benefits:**
- Never expose sensitive data
- API contract is explicit
- Can change entity without breaking API

### 4. **Use Cases** (Business Logic Organization)

```typescript
// Each business operation is a use case
class CreateUserUseCase {
  async execute(params: CreateUserInput): Promise<Result<User>> {
    // Orchestrate business logic
    // 1. Validate
    // 2. Check business rules
    // 3. Create entity
    // 4. Persist
  }
}

class GetUserByIdUseCase {
  async execute(userId: string): Promise<Result<User | null>> {
    // Simpler use case for retrieval
  }
}
```

**Benefits:**
- Business logic is explicit and testable
- Easy to understand what the system does
- Reusable across different interfaces (REST, GraphQL, CLI)

---

## 📊 Data Flow Example: Creating a User

```
1. HTTP Request
   POST /api/users
   { email, username, firstName, lastName, password }
   
2. Controller
   - Validates request (validationMiddleware)
   - Calls UserApplicationService.createUser(DTO)
   
3. Application Service
   - Hashes password
   - Creates CreateUserUseCase instance
   - Calls useCase.execute()
   
4. Use Case (Domain Logic)
   - Validates input
   - Checks if email exists (via repository interface)
   - Checks if username exists (via repository interface)
   - Creates User entity with business methods
   - Calls repository.save(user)
   
5. Repository (Infrastructure)
   - Executes SQL: INSERT INTO users (...)
   - Returns Result<User>
   
6. Use Case Returns
   - Result { isSuccess: true, value: User }
   
7. Application Service
   - Maps User entity to UserResponseDTO
   - Returns Result<UserResponseDTO>
   
8. Controller
   - Checks result.isSuccess
   - Returns HTTP 201 with UserResponseDTO
   
9. HTTP Response
   { success: true, data: { id, email, ... }, ... }
```

**Key Observations:**
- At each layer, we check for errors with `Result`
- No exceptions thrown (controlled error handling)
- Repository interface separates business logic from database
- DTOs ensure sensitive data is never exposed
- Entity business methods stay encapsulated

---

## 🧪 Testing Architecture

### Unit Test - Domain Layer

```typescript
// Test use case without database
describe('CreateUserUseCase', () => {
  it('should create user when email is unique', async () => {
    // Arrange
    const mockRepo = {
      existsByEmail: async () => ok(false),
      save: async (user: User) => ok(user),
    };
    
    const useCase = new CreateUserUseCase(mockRepo as any);
    
    // Act
    const result = await useCase.execute({
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'hash',
    });
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.email).toBe('test@example.com');
  });
});
```

### Unit Test - Application Layer

```typescript
describe('UserApplicationService', () => {
  it('should hash password before creating user', async () => {
    // Can test password hashing independently
  });
});
```

### Integration Test - Infrastructure Layer

```typescript
describe('UserRepository', () => {
  it('should persist user to database', async () => {
    // Requires actual database connection
    const db = new DatabaseConnection();
    await db.initialize();
    
    const repo = new UserRepository(db);
    const user = new User({ ... });
    
    const result = await repo.save(user);
    
    expect(result.isSuccess).toBe(true);
    
    const found = await repo.findById(user.id);
    expect(found.value?.id).toBe(user.id);
  });
});
```

---

## 🚀 Adding New Features (Step-by-Step)

### Example: Add Course Module

**1. Create Domain Entity**

```typescript
// src/domain/entities/Course.ts
export class Course {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  
  updateTitle(title: string): void {
    this.title = title;
  }
}
```

**2. Create Repository Interface**

```typescript
// src/domain/repositories/ICourseRepository.ts
export interface ICourseRepository {
  save(course: Course): Promise<Result<Course>>;
  findById(id: string): Promise<Result<Course | null>>;
}
```

**3. Create Use Cases**

```typescript
// src/domain/use-cases/CreateCourseUseCase.ts
export class CreateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}
  
  async execute(params: CreateCourseInput): Promise<Result<Course>> {
    // Business logic
  }
}
```

**4. Create DTOs**

```typescript
// src/application/dtos/CreateCourseDTO.ts
export class CreateCourseDTO {
  @IsString()
  title!: string;
  
  @IsString()
  description!: string;
}
```

**5. Create Mapper**

```typescript
// src/application/mappers/CourseMapper.ts
export class CourseMapper {
  static toDTO(course: Course): CourseResponseDTO { ... }
}
```

**6. Create Application Service**

```typescript
// src/application/services/CourseApplicationService.ts
@injectable()
export class CourseApplicationService {
  async createCourse(dto: CreateCourseDTO): Promise<Result<CourseResponseDTO>> {
    // Service logic
  }
}
```

**7. Create Repository Implementation**

```typescript
// src/infrastructure/database/repositories/CourseRepository.ts
export class CourseRepository implements ICourseRepository {
  async save(course: Course): Promise<Result<Course>> {
    // SQL queries
  }
}
```

**8. Create Controller**

```typescript
// src/infrastructure/http/controllers/CourseController.ts
export class CourseController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // HTTP handling
  }
}
```

**9. Create Routes**

```typescript
// src/infrastructure/http/routes/courseRoutes.ts
export function createCourseRoutes(controller: CourseController): Router {
  // Define routes
}
```

**10. Register in DI Container**

```typescript
// src/infrastructure/config/dependencyInjection.ts
container.register('ICourseRepository', {
  useValue: new CourseRepository(db),
});
```

**11. Wire in main.ts**

```typescript
const courseService = container.resolve(CourseApplicationService);
const courseController = new CourseController(courseService);
const courseRoutes = createCourseRoutes(courseController);

app.use('/api/courses', courseRoutes);
```

---

## ✅ Summary

Clean Architecture provides:

1. **Independence** - Business logic independent of frameworks
2. **Testability** - Easy to test without mocking everything
3. **Maintainability** - Changes in one layer don't cascade
4. **Clarity** - Clear separation of concerns
5. **Flexibility** - Easy to swap implementations
6. **Scalability** - Scales well as application grows

The key is understanding the **dependency direction**: outer layers depend on inner layers, never the reverse.
