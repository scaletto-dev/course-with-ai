/**
 * Utility function để delay execution (dùng cho retry logic)
 * @param ms - Milliseconds để delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry logic với exponential backoff
 * @param fn - Function để retry
 * @param maxAttempts - Số lần retry tối đa
 * @param delayMs - Delay ban đầu (ms)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        await delay(waitTime);
      }
    }
  }

  throw lastError;
}
