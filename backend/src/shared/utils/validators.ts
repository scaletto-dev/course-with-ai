/**
 * Validation utilities
 * Helper functions cho validation logic
 */

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is strong password
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function isStrongPassword(password: string): boolean {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

/**
 * Check if string is valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Check if string length is within range
 */
export function isLengthInRange(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Sanitize string input
 * Remove potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>\"']/g, '');
}
