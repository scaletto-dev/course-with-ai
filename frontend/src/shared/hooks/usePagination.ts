import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

export function usePagination(
  initialPage = 1,
  initialLimit = 10,
  initialTotal = 0
): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: initialTotal,
    totalPages: Math.ceil(initialTotal / initialLimit) || 1,
  });

  const goToPage = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState((prev) => {
      const newTotalPages = Math.ceil(prev.total / limit) || 1;
      return {
        ...prev,
        limit,
        totalPages: newTotalPages,
        page: 1, // Reset to first page when limit changes
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      page: initialPage,
      limit: initialLimit,
      total: initialTotal,
      totalPages: Math.ceil(initialTotal / initialLimit) || 1,
    });
  }, [initialPage, initialLimit, initialTotal]);

  return {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    reset,
  };
}
