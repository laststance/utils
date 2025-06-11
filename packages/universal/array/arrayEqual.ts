/**
 * Checks if two arrays are equal by comparing their elements in order.
 * Performs shallow comparison - nested objects/arrays are compared by reference.
 * 
 * @param a - First array to compare
 * @param b - Second array to compare
 * @returns True if arrays have the same length and all elements are equal, false otherwise
 * 
 * @example
 * ```typescript
 * arraysEqual([1, 2, 3], [1, 2, 3])     // true
 * arraysEqual([1, 2, 3], [1, 2, 4])     // false
 * arraysEqual(['a', 'b'], ['a', 'b'])   // true
 * arraysEqual([1, 2], [1, 2, 3])        // false (different lengths)
 * 
 * // Shallow comparison for objects
 * const obj = { x: 1 }
 * arraysEqual([obj], [obj])             // true (same reference)
 * arraysEqual([{ x: 1 }], [{ x: 1 }])   // false (different references)
 * ```
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
