/**
 * Type guard to check if a value is a boolean.
 * 
 * @param value - The value to check
 * @returns True if the value is a boolean, false otherwise
 * 
 * @example
 * ```typescript
 * isBoolean(true)      // true
 * isBoolean(false)     // true
 * isBoolean('true')    // false
 * isBoolean(1)         // false
 * isBoolean(null)      // false
 * ```
 */
export default (value: unknown): value is boolean => typeof value === 'boolean'
