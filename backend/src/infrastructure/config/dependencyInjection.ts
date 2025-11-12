import 'reflect-metadata';
import { container } from 'tsyringe';
import { ICourseRepository } from '@domain/repositories/ICourseRepository';
import type { IUserRepository } from '@domain/repositories/IUserRepository';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  GetUserUseCase,
  CreateCourseUseCase,
  GetAllCoursesUseCase,
  GetCourseByIdUseCase,
  GetCoursesByCategoryUseCase,
  UpdateCourseUseCase,
  DeleteCourseUseCase,
} from '@domain/use-cases';
import { CourseRepository } from '../database/repositories/CourseRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { DatabaseConnection } from '../database/mysql/DatabaseConnection';
import { CourseController } from '../http/controllers/CourseController';
import { AuthController } from '../http/controllers/AuthController';

/**
 * Dependency Injection Container Setup
 * Đăng ký tất cả dependencies để tsyringe có thể resolve
 */
export function setupDependencyInjection(): void {
  // Database - Use symbol token for singleton with private constructor
  const dbInstance = DatabaseConnection.getInstance();
  container.registerInstance('DatabaseConnection', dbInstance);

  // Repositories
  container.register<ICourseRepository>('ICourseRepository', {
    useValue: new CourseRepository(dbInstance),
  });

  container.register<IUserRepository>('IUserRepository', {
    useValue: new UserRepository(dbInstance),
  });

  // Course Use Cases
  container.register<CreateCourseUseCase>(CreateCourseUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new CreateCourseUseCase(courseRepo);
    },
  });

  container.register<GetAllCoursesUseCase>(GetAllCoursesUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new GetAllCoursesUseCase(courseRepo);
    },
  });

  container.register<GetCourseByIdUseCase>(GetCourseByIdUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new GetCourseByIdUseCase(courseRepo);
    },
  });

  container.register<GetCoursesByCategoryUseCase>(GetCoursesByCategoryUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new GetCoursesByCategoryUseCase(courseRepo);
    },
  });

  container.register<UpdateCourseUseCase>(UpdateCourseUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new UpdateCourseUseCase(courseRepo);
    },
  });

  container.register<DeleteCourseUseCase>(DeleteCourseUseCase, {
    useFactory: () => {
      const courseRepo = container.resolve<ICourseRepository>('ICourseRepository');
      return new DeleteCourseUseCase(courseRepo);
    },
  });

  // User Use Cases
  container.register<RegisterUseCase>(RegisterUseCase, {
    useFactory: () => {
      const userRepo = container.resolve<IUserRepository>('IUserRepository');
      return new RegisterUseCase(userRepo);
    },
  });

  container.register<LoginUseCase>(LoginUseCase, {
    useFactory: () => {
      const userRepo = container.resolve<IUserRepository>('IUserRepository');
      return new LoginUseCase(userRepo);
    },
  });

  container.register<RefreshTokenUseCase>(RefreshTokenUseCase, {
    useFactory: () => {
      const userRepo = container.resolve<IUserRepository>('IUserRepository');
      return new RefreshTokenUseCase(userRepo);
    },
  });

  container.register<GetUserUseCase>(GetUserUseCase, {
    useFactory: () => {
      const userRepo = container.resolve<IUserRepository>('IUserRepository');
      return new GetUserUseCase(userRepo);
    },
  });

  // Controllers
  container.register(CourseController, {
    useFactory: () => {
      const createUC = container.resolve(CreateCourseUseCase);
      const getAllUC = container.resolve(GetAllCoursesUseCase);
      const getByIdUC = container.resolve(GetCourseByIdUseCase);
      const getByCategoryUC = container.resolve(GetCoursesByCategoryUseCase);
      const updateUC = container.resolve(UpdateCourseUseCase);
      const deleteUC = container.resolve(DeleteCourseUseCase);
      return new CourseController(createUC, getAllUC, getByIdUC, getByCategoryUC, updateUC, deleteUC);
    },
  });

  container.register(AuthController, {
    useFactory: () => {
      const registerUC = container.resolve(RegisterUseCase);
      const loginUC = container.resolve(LoginUseCase);
      const refreshTokenUC = container.resolve(RefreshTokenUseCase);
      const getUserUC = container.resolve(GetUserUseCase);
      return new AuthController(registerUC, loginUC, refreshTokenUC, getUserUC);
    },
  });
}

export { container };
