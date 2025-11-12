# Feature Implementation Checklist & Quick Reference

## 🎯 When Implementing a New Feature

Copy this checklist and follow the order strictly. Each step builds on the previous one.

---

## **PHASE 1: Domain Layer** (Starts here, no dependencies)

### Step 1.1: Create Domain Entity
**File**: `src/domain/entities/[FeatureName].ts`

```typescript
/**
 * [FeatureName] Entity
 * 
 * Core business entity representing a [feature description].
 * Contains business logic and validation rules.
 * Framework-independent and reusable.
 */
export interface I[FeatureName] {
  id: string;
  // ... properties
  createdAt: Date;
  updatedAt: Date;
}

export class [FeatureName] implements I[FeatureName] {
  public readonly id: string;
  public name: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  
  constructor(props: I[FeatureName]) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
  
  /**
   * Business logic method
   * Example: Validate business rules
   */
  public isValid(): boolean {
    return this.name.length >= 3;
  }
  
  /**
   * Update entity data
   */
  public update(data: Partial<I[FeatureName]>): void {
    if (data.name) this.name = data.name;
    this.updatedAt = new Date();
  }
}
```

**Update**: `src/domain/entities/index.ts`
```typescript
export { [FeatureName], I[FeatureName] } from './[FeatureName]';
```

**Checklist**:
- [ ] Entity interface defined with all properties
- [ ] Entity class with constructor
- [ ] Business validation methods added
- [ ] Update method for mutable properties
- [ ] Comprehensive JSDoc comments
- [ ] Exported in index.ts

---

### Step 1.2: Create Repository Interface
**File**: `src/domain/repositories/I[FeatureName]Repository.ts`

```typescript
import { Result } from '../../shared/core/Result';
import { [FeatureName] } from '../entities';

/**
 * [FeatureName] Repository Interface
 *
 * Defines the contract for data access operations.
 * Implementation details hidden - can be MySQL, PostgreSQL, MongoDB, etc.
 */
export interface I[FeatureName]Repository {
  /**
   * Save a new [feature].
   * @param entity - The [feature] entity to save
   * @returns Result containing the saved entity
   */
  save(entity: [FeatureName]): Promise<Result<[FeatureName]>>;

  /**
   * Find [feature] by ID.
   * @param id - The unique identifier
   * @returns Result containing the entity or null if not found
   */
  findById(id: string): Promise<Result<[FeatureName] | null>>;

  /**
   * Find all [features] with pagination.
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Result containing paginated items and total count
   */
  findAll(page: number, limit: number): Promise<Result<{
    items: [FeatureName][];
    total: number;
    page: number;
    limit: number;
  }>>;

  /**
   * Update existing [feature].
   * @param entity - The [feature] entity with updated data
   * @returns Result containing the updated entity
   */
  update(entity: [FeatureName]): Promise<Result<[FeatureName]>>;

  /**
   * Delete [feature] (soft delete recommended).
   * @param id - The unique identifier
   * @returns Result containing boolean success status
   */
  delete(id: string): Promise<Result<boolean>>;
  
  /**
   * Check if [feature] exists by ID.
   * @param id - The unique identifier
   * @returns Result containing boolean existence status
   */
  exists(id: string): Promise<Result<boolean>>;
}
```

**Update**: `src/domain/repositories/index.ts`
```typescript
export { I[FeatureName]Repository } from './I[FeatureName]Repository';
```

**Checklist**:
- [ ] Repository interface created
- [ ] All necessary methods defined (save, findById, findAll, update, delete, exists)
- [ ] Return types use Result<T>
- [ ] Comprehensive JSDoc with @param and @returns
- [ ] Exported in index.ts

---

### Step 1.3: Create Use Cases
**Directory**: `src/domain/use-cases/[featureName]/`

Create one file per use case. **Minimum 5 use cases**:

#### Create[FeatureName]UseCase.ts
```typescript
import { injectable, inject } from 'inversify';
import { Result, ok, fail } from '../../../shared/core/Result';
import { [FeatureName] } from '../../entities';
import { I[FeatureName]Repository } from '../../repositories';
import { ValidationError, InternalServerError } from '../../../shared/errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Input data for creating a [feature]
 */
export interface Create[FeatureName]Input {
  name: string;
  // ... other required fields
}

/**
 * Create[FeatureName] Use Case
 *
 * Handles the creation of a new [feature].
 * Orchestrates validation and data persistence.
 * 
 * Business Rules:
 * - Name must be unique
 * - Name must be at least 3 characters
 */
@injectable()
export class Create[FeatureName]UseCase {
  constructor(
    @inject('I[FeatureName]Repository')
    private repository: I[FeatureName]Repository
  ) {}

  async execute(input: Create[FeatureName]Input): Promise<Result<[FeatureName]>> {
    try {
      // 1. Validate input
      if (!input.name || input.name.trim().length < 3) {
        return fail(new ValidationError('Name must be at least 3 characters'));
      }

      // 2. Create entity
      const entity = new [FeatureName]({
        id: uuidv4(),
        name: input.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3. Validate business rules
      if (!entity.isValid()) {
        return fail(new ValidationError('Invalid [feature] data'));
      }

      // 4. Persist to repository
      const result = await this.repository.save(entity);
      if (result.isFailure) {
        return fail(result.error);
      }

      return ok(result.value);
    } catch (error) {
      return fail(new InternalServerError(error?.message || 'Failed to create [feature]'));
    }
  }
}
```

#### GetAll[FeatureNames]UseCase.ts
```typescript
import { injectable, inject } from 'inversify';
import { Result, ok, fail } from '../../../shared/core/Result';
import { [FeatureName] } from '../../entities';
import { I[FeatureName]Repository } from '../../repositories';
import { InternalServerError, ValidationError } from '../../../shared/errors';

/**
 * GetAll[FeatureNames] Use Case
 *
 * Retrieves all [features] with pagination support.
 * 
 * Business Rules:
 * - Page must be positive number
 * - Limit must be between 1 and 100
 */
@injectable()
export class GetAll[FeatureNames]UseCase {
  constructor(
    @inject('I[FeatureName]Repository')
    private repository: I[FeatureName]Repository
  ) {}

  async execute(page: number = 1, limit: number = 10): Promise<Result<{
    items: [FeatureName][];
    total: number;
    page: number;
    limit: number;
  }>> {
    try {
      // Validate pagination parameters
      if (page < 1) {
        return fail(new ValidationError('Page must be positive'));
      }
      if (limit < 1 || limit > 100) {
        return fail(new ValidationError('Limit must be between 1 and 100'));
      }

      const result = await this.repository.findAll(page, limit);
      if (result.isFailure) {
        return fail(result.error);
      }

      return ok(result.value);
    } catch (error) {
      return fail(new InternalServerError(error?.message || 'Failed to get [features]'));
    }
  }
}
```

#### Get[FeatureName]ByIdUseCase.ts
```typescript
import { injectable, inject } from 'inversify';
import { Result, ok, fail } from '../../../shared/core/Result';
import { [FeatureName] } from '../../entities';
import { I[FeatureName]Repository } from '../../repositories';
import { NotFoundError, ValidationError, InternalServerError } from '../../../shared/errors';

/**
 * Get[FeatureName]ById Use Case
 *
 * Retrieves a specific [feature] by its unique identifier.
 */
@injectable()
export class Get[FeatureName]ByIdUseCase {
  constructor(
    @inject('I[FeatureName]Repository')
    private repository: I[FeatureName]Repository
  ) {}

  async execute(id: string): Promise<Result<[FeatureName]>> {
    try {
      // Validate ID format
      if (!id || id.trim().length === 0) {
        return fail(new ValidationError('ID is required'));
      }

      const result = await this.repository.findById(id);
      if (result.isFailure) {
        return fail(result.error);
      }

      if (!result.value) {
        return fail(new NotFoundError('[FeatureName] not found'));
      }

      return ok(result.value);
    } catch (error) {
      return fail(new InternalServerError(error?.message || 'Failed to get [feature]'));
    }
  }
}
```

#### Update[FeatureName]UseCase.ts
```typescript
import { injectable, inject } from 'inversify';
import { Result, ok, fail } from '../../../shared/core/Result';
import { [FeatureName] } from '../../entities';
import { I[FeatureName]Repository } from '../../repositories';
import { NotFoundError, ValidationError, InternalServerError } from '../../../shared/errors';

/**
 * Input data for updating a [feature]
 */
export interface Update[FeatureName]Input {
  id: string;
  name?: string;
  // ... other optional fields
}

/**
 * Update[FeatureName] Use Case
 *
 * Updates an existing [feature].
 * 
 * Business Rules:
 * - [Feature] must exist
 * - At least one field must be provided
 * - Updated name must be valid
 */
@injectable()
export class Update[FeatureName]UseCase {
  constructor(
    @inject('I[FeatureName]Repository')
    private repository: I[FeatureName]Repository
  ) {}

  async execute(input: Update[FeatureName]Input): Promise<Result<[FeatureName]>> {
    try {
      // 1. Validate input
      if (!input.id) {
        return fail(new ValidationError('ID is required'));
      }

      // 2. Check if entity exists
      const existingResult = await this.repository.findById(input.id);
      if (existingResult.isFailure) {
        return fail(existingResult.error);
      }
      if (!existingResult.value) {
        return fail(new NotFoundError('[FeatureName] not found'));
      }

      // 3. Update entity
      const entity = existingResult.value;
      entity.update({
        name: input.name,
        // ... other fields
      });

      // 4. Validate business rules
      if (!entity.isValid()) {
        return fail(new ValidationError('Invalid [feature] data'));
      }

      // 5. Persist changes
      const result = await this.repository.update(entity);
      if (result.isFailure) {
        return fail(result.error);
      }

      return ok(result.value);
    } catch (error) {
      return fail(new InternalServerError(error?.message || 'Failed to update [feature]'));
    }
  }
}
```

#### Delete[FeatureName]UseCase.ts
```typescript
import { injectable, inject } from 'inversify';
import { Result, ok, fail } from '../../../shared/core/Result';
import { I[FeatureName]Repository } from '../../repositories';
import { NotFoundError, ValidationError, InternalServerError } from '../../../shared/errors';

/**
 * Delete[FeatureName] Use Case
 *
 * Deletes a [feature] (soft delete).
 * 
 * Business Rules:
 * - [Feature] must exist
 * - Cannot delete if referenced by other entities
 */
@injectable()
export class Delete[FeatureName]UseCase {
  constructor(
    @inject('I[FeatureName]Repository')
    private repository: I[FeatureName]Repository
  ) {}

  async execute(id: string): Promise<Result<boolean>> {
    try {
      // 1. Validate input
      if (!id || id.trim().length === 0) {
        return fail(new ValidationError('ID is required'));
      }

      // 2. Check if exists
      const existsResult = await this.repository.exists(id);
      if (existsResult.isFailure) {
        return fail(existsResult.error);
      }
      if (!existsResult.value) {
        return fail(new NotFoundError('[FeatureName] not found'));
      }

      // 3. Delete entity
      const result = await this.repository.delete(id);
      if (result.isFailure) {
        return fail(result.error);
      }

      return ok(true);
    } catch (error) {
      return fail(new InternalServerError(error?.message || 'Failed to delete [feature]'));
    }
  }
}
```

**Update**: `src/domain/use-cases/[featureName]/index.ts`
```typescript
export { Create[FeatureName]UseCase, Create[FeatureName]Input } from './Create[FeatureName]UseCase';
export { GetAll[FeatureNames]UseCase } from './GetAll[FeatureNames]UseCase';
export { Get[FeatureName]ByIdUseCase } from './Get[FeatureName]ByIdUseCase';
export { Update[FeatureName]UseCase, Update[FeatureName]Input } from './Update[FeatureName]UseCase';
export { Delete[FeatureName]UseCase } from './Delete[FeatureName]UseCase';
```

**Update**: `src/domain/use-cases/index.ts`
```typescript
export * from './[featureName]';
```

**Checklist**:
- [ ] All 5+ use cases created
- [ ] Each use case has single responsibility
- [ ] Input validation implemented
- [ ] Business rules validated
- [ ] Use repository via interface
- [ ] Return Result<T> for error handling
- [ ] Comprehensive JSDoc on class and execute()
- [ ] Error handling with try/catch
- [ ] Exported in index.ts files

---

## **PHASE 2: Application Layer** (DTO & Mapping)

### Step 2.1: Create DTOs
**Directory**: `src/application/dtos/[featureName]/`

#### Create[FeatureName]DTO.ts
```typescript
import { IsString, IsNotEmpty, Length, IsOptional, IsEmail, Matches } from 'class-validator';

/**
 * Create[FeatureName] DTO
 *
 * Data Transfer Object for creating a new [feature].
 * Validates input from HTTP requests.
 * Framework-independent validation decorators.
 */
export class Create[FeatureName]DTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'Name contains invalid characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  // ... other properties with validation decorators
}
```

#### Update[FeatureName]DTO.ts
```typescript
import { IsString, IsOptional, Length, IsEmail, Matches } from 'class-validator';

/**
 * Update[FeatureName] DTO
 * 
 * All fields are optional for partial updates.
 * Validates input from HTTP PUT/PATCH requests.
 */
export class Update[FeatureName]DTO {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'Name contains invalid characters' })
  name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  // ... other optional fields with validators
}
```

#### [FeatureName]ResponseDTO.ts
```typescript
/**
 * [FeatureName] Response DTO
 *
 * Output format for API responses.
 * Excludes sensitive fields (passwords, internal IDs, etc).
 * Used for serialization to JSON.
 */
export class [FeatureName]ResponseDTO {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;

  // NEVER include: passwords, tokens, internal flags
}
```

#### [FeatureName]ListResponseDTO.ts
```typescript
/**
 * [FeatureName] List Response DTO
 *
 * Paginated list response format.
 */
export class [FeatureName]ListResponseDTO {
  items: [FeatureName]ResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Update**: `src/application/dtos/[featureName]/index.ts`
```typescript
export { Create[FeatureName]DTO } from './Create[FeatureName]DTO';
export { Update[FeatureName]DTO } from './Update[FeatureName]DTO';
export { [FeatureName]ResponseDTO } from './[FeatureName]ResponseDTO';
export { [FeatureName]ListResponseDTO } from './[FeatureName]ListResponseDTO';
```

**Update**: `src/application/dtos/index.ts`
```typescript
export * from './[featureName]';
```

**Checklist**:
- [ ] Create DTO with validators and error messages
- [ ] Update DTO with optional fields
- [ ] Response DTO with output fields only
- [ ] List response DTO for pagination
- [ ] No sensitive data in response DTOs
- [ ] Comprehensive JSDoc
- [ ] Exported in index.ts files

---

### Step 2.2: Create Mapper
**File**: `src/application/mappers/[FeatureName]Mapper.ts`

```typescript
import { [FeatureName] } from '../../domain/entities';
import { 
  Create[FeatureName]DTO, 
  Update[FeatureName]DTO, 
  [FeatureName]ResponseDTO,
  [FeatureName]ListResponseDTO 
} from '../dtos/[featureName]';
import { v4 as uuidv4 } from 'uuid';

/**
 * [FeatureName] Mapper
 *
 * Handles bidirectional conversion between DTOs and domain entities.
 * Separates data transfer concerns from business logic.
 * Ensures proper data transformation and field mapping.
 */
export class [FeatureName]Mapper {
  /**
   * Convert Create DTO to domain entity.
   * Generates new ID and timestamps.
   * 
   * @param dto - The create DTO
   * @returns New domain entity instance
   */
  static toDomain(dto: Create[FeatureName]DTO): [FeatureName] {
    return new [FeatureName]({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      // Map other fields
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Convert Update DTO to partial entity data.
   * 
   * @param dto - The update DTO
   * @returns Partial entity data for updates
   */
  static toUpdateData(dto: Update[FeatureName]DTO): Partial<[FeatureName]> {
    const data: Partial<[FeatureName]> = {};
    
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    // Map other optional fields
    
    return data;
  }

  /**
   * Convert domain entity to response DTO.
   * Excludes sensitive fields.
   * 
   * @param entity - The domain entity
   * @returns Response DTO for API
   */
  static toDTO(entity: [FeatureName]): [FeatureName]ResponseDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Convert multiple entities to response DTOs.
   * 
   * @param entities - Array of domain entities
   * @returns Array of response DTOs
   */
  static toDTOs(entities: [FeatureName][]): [FeatureName]ResponseDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }

  /**
   * Convert paginated results to list response DTO.
   * 
   * @param data - Paginated data from repository
   * @returns Paginated list response DTO
   */
  static toListDTO(data: {
    items: [FeatureName][];
    total: number;
    page: number;
    limit: number;
  }): [FeatureName]ListResponseDTO {
    return {
      items: this.toDTOs(data.items),
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
    };
  }
}
```

**Update**: `src/application/mappers/index.ts`
```typescript
export { [FeatureName]Mapper } from './[FeatureName]Mapper';
```

**Checklist**:
- [ ] toDomain() method for Create DTO
- [ ] toUpdateData() for Update DTO
- [ ] toDTO() method for single entity
- [ ] toDTOs() for entity arrays
- [ ] toListDTO() for pagination
- [ ] Comprehensive JSDoc with @param and @returns
- [ ] Exported in index.ts

---

## **PHASE 3: Infrastructure - Data Layer**

### Step 3.1: Create Repository Implementation
**File**: `src/infrastructure/database/repositories/[FeatureName]Repository.ts`

```typescript
import { injectable } from 'inversify';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { I[FeatureName]Repository } from '../../../domain/repositories';
import { [FeatureName] } from '../../../domain/entities';
import { Result, ok, fail } from '../../../shared/core/Result';
import { InternalServerError, NotFoundError } from '../../../shared/errors';
import { DatabaseConnection } from '../connection/DatabaseConnection';
import { logger } from '../../../shared/utils/logger';

/**
 * [FeatureName] Repository
 *
 * Implements I[FeatureName]Repository interface.
 * Handles database operations using MySQL2 Promise driver.
 * Maps database rows to domain entities.
 * 
 * Database Schema:
 * - Table: [feature_names]
 * - Primary Key: id (VARCHAR(36))
 * - Indexes: idx_createdAt
 */
@injectable()
export class [FeatureName]Repository implements I[FeatureName]Repository {
  constructor(private db: DatabaseConnection) {}

  /**
   * Save a new [feature] to database.
   */
  async save(entity: [FeatureName]): Promise<Result<[FeatureName]>> {
    const connection = await this.db.getConnection();
    try {
      const query = `
        INSERT INTO [feature_names]
        (id, name, email, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        entity.id,
        entity.name,
        entity.email || null,
        entity.createdAt,
        entity.updatedAt,
      ];

      const [result] = await connection.execute<ResultSetHeader>(query, values);
      
      if (result.affectedRows === 0) {
        return fail(new InternalServerError('Failed to save [feature]'));
      }

      logger.info(`[FeatureName] saved successfully: ${entity.id}`);
      return ok(entity);
    } catch (error: any) {
      logger.error('Error saving [feature]:', error);
      
      // Handle duplicate key error
      if (error.code === 'ER_DUP_ENTRY') {
        return fail(new InternalServerError('[FeatureName] already exists'));
      }
      
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Find [feature] by ID.
   */
  async findById(id: string): Promise<Result<[FeatureName] | null>> {
    const connection = await this.db.getConnection();
    try {
      const query = `
        SELECT id, name, email, createdAt, updatedAt
        FROM [feature_names]
        WHERE id = ? AND isActive = 1
      `;
      
      const [rows] = await connection.execute<RowDataPacket[]>(query, [id]);
      
      if (rows.length === 0) {
        return ok(null);
      }

      const entity = this.mapRowToEntity(rows[0]);
      return ok(entity);
    } catch (error: any) {
      logger.error('Error finding [feature] by ID:', error);
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Find all [features] with pagination.
   */
  async findAll(page: number, limit: number): Promise<Result<{
    items: [FeatureName][];
    total: number;
    page: number;
    limit: number;
  }>> {
    const connection = await this.db.getConnection();
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM [feature_names]
        WHERE isActive = 1
      `;
      const [countRows] = await connection.execute<RowDataPacket[]>(countQuery);
      const total = countRows[0].total;

      // Get paginated data
      const dataQuery = `
        SELECT id, name, email, createdAt, updatedAt
        FROM [feature_names]
        WHERE isActive = 1
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await connection.execute<RowDataPacket[]>(dataQuery, [limit, offset]);
      
      const items = rows.map(row => this.mapRowToEntity(row));

      return ok({
        items,
        total,
        page,
        limit,
      });
    } catch (error: any) {
      logger.error('Error finding all [features]:', error);
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Update existing [feature].
   */
  async update(entity: [FeatureName]): Promise<Result<[FeatureName]>> {
    const connection = await this.db.getConnection();
    try {
      entity.updatedAt = new Date();
      
      const query = `
        UPDATE [feature_names]
        SET name = ?, email = ?, updatedAt = ?
        WHERE id = ? AND isActive = 1
      `;
      const values = [
        entity.name,
        entity.email || null,
        entity.updatedAt,
        entity.id,
      ];

      const [result] = await connection.execute<ResultSetHeader>(query, values);
      
      if (result.affectedRows === 0) {
        return fail(new NotFoundError('[FeatureName] not found'));
      }

      logger.info(`[FeatureName] updated successfully: ${entity.id}`);
      return ok(entity);
    } catch (error: any) {
      logger.error('Error updating [feature]:', error);
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Delete [feature] (soft delete).
   */
  async delete(id: string): Promise<Result<boolean>> {
    const connection = await this.db.getConnection();
    try {
      const query = `
        UPDATE [feature_names]
        SET isActive = 0, updatedAt = ?
        WHERE id = ? AND isActive = 1
      `;
      
      const [result] = await connection.execute<ResultSetHeader>(
        query,
        [new Date(), id]
      );
      
      if (result.affectedRows === 0) {
        return fail(new NotFoundError('[FeatureName] not found'));
      }

      logger.info(`[FeatureName] deleted successfully: ${id}`);
      return ok(true);
    } catch (error: any) {
      logger.error('Error deleting [feature]:', error);
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Check if [feature] exists.
   */
  async exists(id: string): Promise<Result<boolean>> {
    const connection = await this.db.getConnection();
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM [feature_names]
        WHERE id = ? AND isActive = 1
      `;

      const [rows] = await connection.execute<RowDataPacket[]>(query, [id]);
      const exists = rows[0].count > 0;

      return ok(exists);
    } catch (error: any) {
      logger.error('Error checking [feature] existence:', error);
      return fail(new InternalServerError(error?.message || 'Database error'));
    } finally {
      connection.release();
    }
  }

  /**
   * Map database row to domain entity.
   * @param row - Database row data
   * @returns Domain entity instance
   */
  private mapRowToEntity(row: RowDataPacket): [FeatureName] {
    return new [FeatureName]({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}
```

**Update**: `src/infrastructure/database/repositories/index.ts`
```typescript
export { [FeatureName]Repository } from './[FeatureName]Repository';
```

**Checklist**:
- [ ] Repository class implements interface
- [ ] save() persists new entities
- [ ] findById() retrieves single entity
- [ ] findAll() with pagination support
- [ ] update() modifies existing entities
- [ ] delete() performs soft delete
- [ ] exists() checks entity presence
- [ ] mapRowToEntity() converts DB rows to entities
- [ ] Error handling for all DB operations
- [ ] Logging for important operations
- [ ] Connection management with finally blocks
- [ ] Exported in index.ts

---

## **PHASE 4: Infrastructure - HTTP Layer**

### Step 4.1: Create Controllers
**Directory**: `src/infrastructure/http/controllers/`

#### [FeatureName]Controller.ts
```typescript
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import {
  Create[FeatureName]UseCase,
  Get[FeatureName]ByIdUseCase,
  GetAll[FeatureNames]UseCase,
  Update[FeatureName]UseCase,
  Delete[FeatureName]UseCase,
} from '../../../domain/use-cases';
import {
  Create[FeatureName]DTO,
  Update[FeatureName]DTO,
} from '../../../application/dtos';
import { [FeatureName]Mapper } from '../../../application/mappers';
import { sendSuccess, sendError } from '../../../shared/utils/response';
import { logger } from '../../../shared/utils/logger';

/**
 * [FeatureName] Controller
 *
 * Handles HTTP requests for [feature] operations.
 * Orchestrates use cases and returns formatted responses.
 * Separates HTTP concerns from business logic.
 */
@injectable()
export class [FeatureName]Controller {
  constructor(
    @inject('Create[FeatureName]UseCase')
    private create[FeatureName]UseCase: Create[FeatureName]UseCase,

    @inject('Get[FeatureName]ByIdUseCase')
    private get[FeatureName]ByIdUseCase: Get[FeatureName]ByIdUseCase,

    @inject('GetAll[FeatureNames]UseCase')
    private getAll[FeatureNames]UseCase: GetAll[FeatureNames]UseCase,

    @inject('Update[FeatureName]UseCase')
    private update[FeatureName]UseCase: Update[FeatureName]UseCase,

    @inject('Delete[FeatureName]UseCase')
    private delete[FeatureName]UseCase: Delete[FeatureName]UseCase,
  ) {}

  /**
   * Create a new [feature].
   *
   * HTTP Method: POST
   * Route: /[features]
   * Body: Create[FeatureName]DTO
   * Response: 201 Created with newly created [feature]
   *
   * @param req - Express request object with DTO in body
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void - Response sent via res object
   *
   * @example
   * POST /api/[features]
   * {
   *   "name": "Example Name",
   *   "email": "example@email.com"
   * }
   * Response: { "success": true, "statusCode": 201, "data": {...[feature] object} }
   */
  async create(
    req: Request<{}, {}, Create[FeatureName]DTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as Create[FeatureName]DTO;

      logger.info(`Creating [feature]: ${dto.name}`);

      const result = await this.create[FeatureName]UseCase.execute({
        name: dto.name,
        email: dto.email,
        // Map other fields from DTO
      });

      if (result.isFailure) {
        sendError(res, result.error);
        return;
      }

      const responseDto = [FeatureName]Mapper.toDTO(result.value);
      sendSuccess(res, responseDto, 201, 'Created');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get [feature] by ID.
   *
   * HTTP Method: GET
   * Route: /[features]/:id
   * Path Parameters: id (UUID string)
   * Response: 200 OK with [feature] or 404 Not Found
   *
   * @param req - Express request object with [feature] ID
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void - Response sent via res object
   *
   * @example
   * GET /api/[features]/550e8400-e29b-41d4-a716-446655440000
   * Response: { "success": true, "statusCode": 200, "data": {...[feature] object} }
   */
  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      logger.info(`Fetching [feature]: ${id}`);

      const result = await this.get[FeatureName]ByIdUseCase.execute(id);

      if (result.isFailure) {
        sendError(res, result.error);
        return;
      }

      const responseDto = [FeatureName]Mapper.toDTO(result.value);
      sendSuccess(res, responseDto, 200, 'Retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all [features] with pagination.
   *
   * HTTP Method: GET
   * Route: /[features]
   * Query Parameters: page (default: 1), limit (default: 10)
   * Response: 200 OK with paginated [features]
   *
   * @param req - Express request object with pagination params
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void - Response sent via res object
   *
   * @example
   * GET /api/[features]?page=1&limit=10
   * Response: {
   *   "success": true,
   *   "statusCode": 200,
   *   "data": {
   *     "items": [...[feature] objects],
   *     "total": 100,
   *     "page": 1,
   *     "limit": 10,
   *     "totalPages": 10
   *   }
   * }
   */
  async getAll(
    req: Request<{}, {}, {}, { page?: string; limit?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');

      logger.info(`Fetching all [features]: page=${page}, limit=${limit}`);

      const result = await this.getAll[FeatureNames]UseCase.execute(page, limit);

      if (result.isFailure) {
        sendError(res, result.error);
        return;
      }

      const responseDto = [FeatureName]Mapper.toListDTO(result.value);
      sendSuccess(res, responseDto, 200, 'Retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing [feature].
   *
   * HTTP Method: PUT
   * Route: /[features]/:id
   * Path Parameters: id (UUID string)
   * Body: Update[FeatureName]DTO (all fields optional)
   * Response: 200 OK with updated [feature] or 404 Not Found
   *
   * @param req - Express request object with [feature] ID and update data
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void - Response sent via res object
   *
   * @example
   * PUT /api/[features]/550e8400-e29b-41d4-a716-446655440000
   * {
   *   "name": "Updated Name",
   *   "email": "updated@email.com"
   * }
   * Response: { "success": true, "statusCode": 200, "data": {...updated [feature]} }
   */
  async update(
    req: Request<{ id: string }, {}, Update[FeatureName]DTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body as Update[FeatureName]DTO;

      logger.info(`Updating [feature]: ${id}`);

      const result = await this.update[FeatureName]UseCase.execute({
        id,
        name: dto.name,
        email: dto.email,
        // Map other optional fields from DTO
      });

      if (result.isFailure) {
        sendError(res, result.error);
        return;
      }

      const responseDto = [FeatureName]Mapper.toDTO(result.value);
      sendSuccess(res, responseDto, 200, 'Updated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a [feature].
   *
   * HTTP Method: DELETE
   * Route: /[features]/:id
   * Path Parameters: id (UUID string)
   * Response: 200 OK with deletion confirmation or 404 Not Found
   *
   * @param req - Express request object with [feature] ID
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns void - Response sent via res object
   *
   * @example
   * DELETE /api/[features]/550e8400-e29b-41d4-a716-446655440000
   * Response: { "success": true, "statusCode": 200, "message": "Deleted" }
   */
  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      logger.info(`Deleting [feature]: ${id}`);

      const result = await this.delete[FeatureName]UseCase.execute(id);

      if (result.isFailure) {
        sendError(res, result.error);
        return;
      }

      sendSuccess(res, { id }, 200, 'Deleted');
    } catch (error) {
      next(error);
    }
  }
}
```

**Update**: `src/infrastructure/http/controllers/index.ts`
```typescript
export { [FeatureName]Controller } from './[FeatureName]Controller';
```

**Checklist**:
- [ ] Controller class created with dependency injection
- [ ] create() method with POST documentation
- [ ] getById() method with GET by ID documentation
- [ ] getAll() method with pagination documentation
- [ ] update() method with PUT documentation
- [ ] delete() method with DELETE documentation
- [ ] All methods have comprehensive JSDoc with @example
- [ ] Each method documents HTTP Method, Route, Parameters, Response
- [ ] Error handling with next(error) for async errors
- [ ] Logging for all operations
- [ ] Uses Mapper for DTO conversion
- [ ] Uses sendSuccess/sendError helpers for responses
- [ ] Exported in index.ts

---

### Step 4.2: Create Routes
**File**: `src/infrastructure/http/routes/[featureName]Routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { [FeatureName]Controller } from '../controllers';
import { authMiddleware, adminMiddleware } from '../middlewares';
import { validationMiddleware } from '../middlewares';
import {
  Create[FeatureName]DTO,
  Update[FeatureName]DTO,
} from '../../../application/dtos';

/**
 * [FeatureName] Routes
 *
 * Defines HTTP endpoints for [feature] resource.
 * Routes are organized RESTfully.
 * Public endpoints do not require authentication.
 * Protected endpoints require valid JWT token.
 */
const router = Router();
const controller = container.resolve([FeatureName]Controller);

/**
 * POST /[features]
 * Create a new [feature]
 * Requires: Authentication, Admin role
 * Body: { name, email, ... }
 * Response: { success, statusCode, data: {...[feature]} }
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validationMiddleware(Create[FeatureName]DTO),
  (req: Request, res: Response) => controller.create(req, res, () => {})
);

/**
 * GET /[features]/:id
 * Retrieve [feature] by ID
 * Public endpoint
 * Path Parameters: id (UUID)
 * Response: { success, statusCode, data: {...[feature]} }
 */
router.get(
  '/:id',
  (req: Request, res: Response) => controller.getById(req, res, () => {})
);

/**
 * GET /[features]
 * Retrieve all [features] with pagination
 * Public endpoint
 * Query Parameters: page (default: 1), limit (default: 10)
 * Response: { success, statusCode, data: { items, total, page, limit, totalPages } }
 */
router.get(
  '/',
  (req: Request, res: Response) => controller.getAll(req, res, () => {})
);

/**
 * PUT /[features]/:id
 * Update existing [feature]
 * Requires: Authentication, Admin role
 * Path Parameters: id (UUID)
 * Body: { name?, email?, ... } (all fields optional)
 * Response: { success, statusCode, data: {...updated [feature]} }
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validationMiddleware(Update[FeatureName]DTO),
  (req: Request, res: Response) => controller.update(req, res, () => {})
);

/**
 * DELETE /[features]/:id
 * Delete [feature] (soft delete)
 * Requires: Authentication, Admin role
 * Path Parameters: id (UUID)
 * Response: { success, statusCode, message: 'Deleted' }
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  (req: Request, res: Response) => controller.delete(req, res, () => {})
);

export default router;
```

**Update**: `src/main.ts`
```typescript
import express from 'express';
import authRoutes from './infrastructure/http/routes/authRoutes';
import [featureName]Routes from './infrastructure/http/routes/[featureName]Routes';
// ... other imports

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/[features]', [featureName]Routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
});

export default app;
```

**Checklist**:
- [ ] Routes file created with all endpoints
- [ ] POST endpoint with auth + admin middleware
- [ ] GET by ID endpoint (public)
- [ ] GET all endpoint with pagination (public)
- [ ] PUT endpoint with auth + admin middleware
- [ ] DELETE endpoint with auth + admin middleware
- [ ] All endpoints have comprehensive JSDoc
- [ ] Each endpoint documents Method, description, Security, Body/Query, Response
- [ ] Validation middleware applied to POST/PUT
- [ ] Error handling with next() function
- [ ] Routes imported in main.ts
- [ ] Proper Express router structure
- [ ] Exported correctly

---

## **PHASE 5: Testing & Validation**

Create comprehensive tests for all layers:

### Step 5.1: Unit Tests
- [ ] Entity methods (isValid, update)
- [ ] Mapper conversions (toDomain, toDTO, toListDTO)
- [ ] Use case business logic
- [ ] Error handling scenarios

### Step 5.2: Integration Tests
- [ ] Controller methods with mocked services
- [ ] Route endpoints with HTTP requests
- [ ] Database operations (if using test DB)
- [ ] Error middleware handling

### Step 5.3: End-to-End Tests
- [ ] Complete user flows (create, read, update, delete)
- [ ] Error scenarios and edge cases
- [ ] Pagination and filtering
- [ ] Authorization and authentication

---

## **Final Validation Checklist**

Before considering feature complete:

- [ ] All 5 Phases implemented
- [ ] All files created and exported properly
- [ ] TypeScript strict mode compliant
- [ ] No console.log(), use logger instead
- [ ] All methods have JSDoc comments
- [ ] Error handling implemented everywhere
- [ ] No hardcoded values - use config
- [ ] Database operations wrapped in try/catch
- [ ] Connection pooling in use
- [ ] Logging implemented for important operations
- [ ] Security checks (auth, admin role) applied
- [ ] Input validation with class-validator
- [ ] Response format consistent (sendSuccess/sendError)
- [ ] README updated with API documentation
- [ ] Feature marked as COMPLETE in this checklist

---

## **Common Issues & Solutions**

### Issue: "Cannot find module" errors
**Solution**: Ensure all exports are in index.ts files at each layer

### Issue: Dependency injection not working
**Solution**: Register dependencies in dependencyInjection.ts container before using

### Issue: TypeScript strict mode errors
**Solution**: Use proper typing, avoid `any`, use `unknown` for unknown types

### Issue: Database query errors
**Solution**: Check parameterized query syntax, ensure connection.release() in finally block

### Issue: Async/await not working
**Solution**: Ensure methods are marked `async`, use `await` with promises, catch errors with try/catch

---

**