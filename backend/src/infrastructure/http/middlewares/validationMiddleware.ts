import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError as ClassValidationError } from 'class-validator';
import logger from '@shared/utils/logger';
import { errorResponse } from '@shared/utils/response';

/**
 * Validation Middleware
 * Validate request body theo DTO class
 * Sử dụng class-validator và class-transformer
 */
export const validationMiddleware = (type: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Transform plain object sang instance của class
      const object = plainToClass(type, req.body);

      // Validate
      const errors: ClassValidationError[] = await validate(object);

      if (errors.length > 0) {
        const messages = errors
          .map(error => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join(', ');
          })
          .join('; ');

        logger.warn(`Validation error: ${messages}`);
        res.status(400).json(errorResponse(messages, 400, 'ValidationError'));
        return;
      }

      // Attach validated object to request
      (req as any).validatedData = object;
      next();
    } catch (error) {
      logger.error('Validation middleware error:', error);
      res.status(500).json(errorResponse('Internal server error', 500));
    }
  };
};
