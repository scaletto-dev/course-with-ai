/**
 * Base Controller
 * Abstract base class for all controllers with common response handling
 */

import { Response } from 'express';
import { Result } from '@shared/types';
import { ResponseHelper } from '@shared/utils/response.helper';
import { PaginationHelper } from '@shared/utils/pagination.helper';
import { PaginationQuery } from '@shared/types/http.types';

export abstract class BaseController {
  protected handleSuccess<T>(res: Response, result: T, statusCode = 200): void {
    res.status(statusCode).json(ResponseHelper.success(result, statusCode));
  }

  protected handleSuccessWithPagination<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): void {
    const meta = PaginationHelper.createMeta(total, page, limit);
    res.status(200).json(ResponseHelper.successWithPagination(data, meta));
  }

  protected handleCreated<T>(res: Response, result: T): void {
    res.status(201).json(ResponseHelper.created(result));
  }

  protected handleNoContent(res: Response): void {
    res.status(204).send();
  }

  protected handleError(res: Response, error: unknown): void {
    const err = error as Record<string, unknown>;
    const statusCode = (err.statusCode as number) || 500;
    const message = (err.message as string) || 'Internal server error';

    res.status(statusCode).json(ResponseHelper.error(message, statusCode));
  }

  protected handleResult<T>(res: Response, result: Result<T>, statusCode = 200): void {
    if (result.isSuccess) {
      this.handleSuccess(res, result.value, statusCode);
    } else {
      this.handleError(res, result.error);
    }
  }

  protected handleResultWithPagination<T>(
    res: Response,
    result: Result<{ courses: T[]; total: number }>,
    page: number,
    limit: number,
  ): void {
    if (result.isSuccess) {
      this.handleSuccessWithPagination(res, result.value.courses, result.value.total, page, limit);
    } else {
      this.handleError(res, result.error);
    }
  }

  protected getPaginationQuery(query: Record<string, unknown>): PaginationQuery {
    return PaginationHelper.parsePaginationQuery(query);
  }
}
