# Mapper Usage Analysis

## Current Status

### ✅ Mappers Đã Được Implement

#### 1. UserMapper (`src/application/mappers/UserMapper.ts`)
**Methods Implemented:**
- `toDomainFromRegister()` - Convert RegisterDTO → User entity (with password hashing)
- `toDomainFromCreate()` - Convert CreateUserDTO → User entity (with password hashing)
- `toUpdateData()` - Convert UpdateUserDTO → Partial<User>
- `toDTO()` - Convert User entity → UserResponseDTO (excludes password)
- `toDTOs()` - Convert User[] → UserResponseDTO[]
- `toListDTO()` - Convert paginated data → UserListResponseDTO

**Exported in:** `src/application/mappers/index.ts` ✅

#### 2. CourseMapper (`src/application/mappers/CourseMapper.ts`)
**Methods Implemented:**
- `toDomain()` - Convert CreateCourseDTO → Course entity
- `toUpdateData()` - Convert UpdateCourseDTO → Partial<Course>
- `toDTO()` - Convert Course entity → CourseResponseDTO
- `toDTOList()` - Convert Course[] → CourseResponseDTO[]
- `toListDTO()` - Convert paginated data → CourseListResponseDTO

**Exported in:** `src/application/mappers/index.ts` ✅

---

## ❌ Mapper Usage Issues

### Problem 1: Mappers NOT Used in Use Cases
**Current State:** Use cases create entities and return data directly without mapping
```typescript
// Example: RegisterUseCase (không sử dụng mapper)
const user = User.create(uuidv4(), input.email, hashedPassword, input.name, 'user');
const savedUser = await this.userRepository.create(user);
return {
  id: savedUser.id,
  email: savedUser.email,
  name: savedUser.name,
  role: savedUser.role,
}; // ❌ Manual mapping instead of UserMapper.toDTO()
```

**Impact:** Code duplication, harder to maintain, inconsistent response format

**Solution Required:** 
- Use cases should return domain entities
- Controllers should use mappers to convert entities to DTOs
- This keeps separation of concerns: Use Case → Domain Entity → Mapper → DTO

### Problem 2: Mappers NOT Used in Controllers
**Current State:** Controllers call use cases but don't convert results to DTOs

```typescript
// Example: CourseController.create() (không sử dụng mapper)
public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
  const input: CreateCourseInput = req.body;
  const result = await this.createCourseUseCase.execute(input);
  this.handleResult(res, result, 201); // ❌ Direct entity returned, not DTO
}
```

**Impact:** 
- API responses might include unwanted fields
- Inconsistent response format
- Difficult to evolve API contract

**Solution Required:**
- Controllers should import and use mappers
- After use case execution, convert entity to DTO
- Example: `const dto = CourseMapper.toDTO(result);`

### Problem 3: Inconsistent Data Flow Pattern
**Current (❌ Not Clean Architecture):**
```
Controller → UseCase → Entity (returned as-is)
            ↓
        API Response (inconsistent format)
```

**Expected (✅ Clean Architecture):**
```
Controller → UseCase → Entity
                        ↓
                    Mapper.toDTO()
                        ↓
                    Response DTO
                        ↓
                    API Response
```

---

## Recommended Implementation Plan

### Step 1: Update Use Cases to Return Entities (Not DTOs)
**Pattern:**
```typescript
// ✅ Good pattern
public async execute(input: RegisterInput): Promise<User> {
  // ... business logic ...
  const user = User.create(...);
  await this.userRepository.create(user);
  return user; // Return entity, not DTO
}
```

### Step 2: Update Controllers to Use Mappers
**Pattern:**
```typescript
// ✅ Good pattern in controller
public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
  const dto = req.body as CreateCourseDTO;
  const entity = await this.createCourseUseCase.execute(dto);
  const responseDto = CourseMapper.toDTO(entity);
  this.handleSuccess(res, responseDto, 201);
}
```

### Step 3: For GetAll Operations, Use toListDTO()
**Pattern:**
```typescript
// ✅ Good pattern for pagination
public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { page, limit } = this.getPaginationQuery(req.query);
  const result = await this.getAllCoursesUseCase.execute(page, limit);
  // result = { courses: Course[], total: number, page, limit }
  const listDto = CourseMapper.toListDTO(result);
  this.handleSuccessWithPagination(res, listDto.items, listDto.total, page, limit);
}
```

---

## Current Architecture Gap

### DTOs Created But Not Used
- ✅ `RegisterDTO` - Created but input validation unclear
- ✅ `LoginDTO` - Created but input validation unclear
- ✅ `CreateUserDTO` - Created but not integrated
- ✅ `UpdateUserDTO` - Created but not integrated
- ✅ `UserResponseDTO` - Created but not used in responses
- ✅ `UserListResponseDTO` - Created but not used
- ✅ `CreateCourseDTO` - Created but validation unclear
- ✅ `UpdateCourseDTO` - Created but validation unclear
- ✅ `CourseResponseDTO` - Created but needs mapping
- ✅ `CourseListResponseDTO` - Created but not used

### Mappers Created But Not Used
- ✅ `UserMapper` - Fully implemented but **NOT CALLED** in controllers
- ✅ `CourseMapper` - Fully implemented but **NOT CALLED** in controllers

### Result
**Data flows directly from controllers to responses WITHOUT mapping**
```
❌ HTTP Request → Controller → UseCase → Entity → HTTP Response
✅ HTTP Request → Controller → UseCase → Entity → Mapper → DTO → HTTP Response
```

---

## Checklist to Fix Mapper Integration

### For Each Use Case:
- [ ] Verify use case returns **domain entity** (not DTO)
- [ ] Verify use case does NOT manually construct response objects
- [ ] Ensure proper error handling

### For Each Controller Method:
- [ ] [ ] Import required mapper (UserMapper, CourseMapper)
- [ ] [ ] After use case execution, call appropriate mapper method:
  - [ ] Single entity: `Mapper.toDTO(entity)`
  - [ ] Multiple entities: `Mapper.toDTOs(entities)`
  - [ ] Paginated: `Mapper.toListDTO({ items, total, page, limit })`
- [ ] [ ] Pass mapped DTO to response handler
- [ ] [ ] Test API response includes only expected fields

### For Auth Feature:
- [ ] Update RegisterUseCase to return User entity
- [ ] Update LoginUseCase to return user data
- [ ] Update RefreshTokenUseCase to return token data
- [ ] Update AuthController to import UserMapper
- [ ] Apply UserMapper.toDTO() in all auth controller methods
- [ ] Verify response format matches UserResponseDTO

### For Course Feature:
- [ ] Update all course use cases to return Course entities
- [ ] Update CourseController to import CourseMapper
- [ ] Apply CourseMapper.toDTO() in getById()
- [ ] Apply CourseMapper.toDTOList() in getAll()
- [ ] Apply CourseMapper.toListDTO() for paginated responses
- [ ] Verify response format matches CourseResponseDTO

---

## Benefits After Integration

✅ **Separation of Concerns** - Use cases don't know about DTOs
✅ **Consistency** - All responses follow same mapping pattern
✅ **Maintainability** - Change DTO format in one place (mapper)
✅ **Type Safety** - Mappers ensure correct field mapping
✅ **Testability** - Mappers can be tested independently
✅ **Security** - Sensitive fields excluded automatically
✅ **Evolution** - Easy to add/remove response fields

---

## Summary

**Status:** Mappers implemented ✅ but not integrated ❌

Both `UserMapper` and `CourseMapper` are fully implemented with all required methods:
- Entity → DTO conversion
- DTO → Entity conversion
- Batch conversions
- Pagination support

However, they are **not being called** in the actual code flow (controllers/use cases).

**Next Step:** Integrate mappers into controllers to complete the Clean Architecture pattern.

