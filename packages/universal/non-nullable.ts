/**
 * Type guard to check if a value is not null or undefined.
 * Useful for filtering arrays or asserting non-nullable values.
 * 
 * @param value - The value to check
 * @returns True if the value is not null or undefined, false otherwise
 * 
 * @example
 * ```typescript
 * const mixed = [1, null, 'hello', undefined, true]
 * const filtered = mixed.filter(nonNullable) // [1, 'hello', true]
 * 
 * // Type assertion usage
 * const maybeString: string | null = getValue()
 * if (nonNullable(maybeString)) {
 *   // maybeString is now typed as string (not string | null)
 *   console.log(maybeString.toUpperCase())
 * }
 * ```
 */
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}
