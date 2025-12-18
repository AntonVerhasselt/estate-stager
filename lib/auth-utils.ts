/**
 * Utility functions for handling authentication timing issues
 * between Clerk and Convex
 */

/**
 * Wait for a condition to become true with timeout
 * Useful for waiting for Convex auth to be ready after Clerk sign-up
 */
export async function waitForCondition(
  checkFn: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 500
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await checkFn();
    if (result) return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return false;
}

/**
 * Retry an async operation with exponential backoff
 * Useful for Convex mutations that might fail due to auth timing
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw error;
      }

      onRetry?.(attempt, error);

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("not authenticated") ||
      message.includes("authentication") ||
      message.includes("unauthorized") ||
      message.includes("unauthenticated")
    );
  }
  return false;
}
