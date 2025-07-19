/**
 * Gets the current date in YYYY-MM-DD format.
 * Uses the local date (not UTC) converted to ISO string format.
 *
 * @returns Current date as a string in YYYY-MM-DD format
 *
 * @example
 * ```typescript
 * const today = getDate()
 * console.log(today) // "2023-12-25"
 * ```
 */
export function getDate(): 'YYYY-MM-DD' {
  return new Date().toISOString().split('T')[0] as 'YYYY-MM-DD'
}
