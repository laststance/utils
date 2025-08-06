/**
 * Returns elements that are in the first array but not in the second array.
 * Uses SameValueZero equality (like Set and Map).
 *
 * @param array1 - The main array
 * @param array2 - The array to exclude elements from
 * @returns A new array with elements from array1 that are not in array2
 *
 * @example
 * ```typescript
 * difference([1, 2, 3, 4], [2, 3, 5])
 * // Result: [1, 4]
 *
 * difference(['a', 'b', 'c'], ['b', 'd'])
 * // Result: ['a', 'c']
 * ```
 */
export function difference<T>(array1: readonly T[], array2: readonly T[]): T[] {
  if (array1.length === 0) return []
  if (array2.length === 0) return [...array1]

  const set2 = new Set(array2)
  return array1.filter((item) => !set2.has(item))
}

/**
 * Returns elements that are present in both arrays.
 * Uses SameValueZero equality (like Set and Map).
 * Preserves order from the first array and removes duplicates.
 *
 * @param array1 - The first array
 * @param array2 - The second array
 * @returns A new array with elements that are in both arrays
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3, 4], [2, 3, 5])
 * // Result: [2, 3]
 *
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd'])
 * // Result: ['b', 'c']
 * ```
 */
export function intersection<T>(
  array1: readonly T[],
  array2: readonly T[],
): T[] {
  if (array1.length === 0 || array2.length === 0) return []

  const set2 = new Set(array2)
  const seen = new Set<T>()
  const result: T[] = []

  for (const item of array1) {
    if (set2.has(item) && !seen.has(item)) {
      seen.add(item)
      result.push(item)
    }
  }

  return result
}

/**
 * Returns a new array containing unique elements from all input arrays.
 * Uses SameValueZero equality (like Set and Map).
 * Preserves the order of first occurrence.
 *
 * @param arrays - The arrays to union
 * @returns A new array with unique elements from all input arrays
 *
 * @example
 * ```typescript
 * union([1, 2], [2, 3], [3, 4])
 * // Result: [1, 2, 3, 4]
 *
 * union(['a', 'b'], ['b', 'c'], ['c', 'd'])
 * // Result: ['a', 'b', 'c', 'd']
 *
 * // Single array
 * union([1, 2, 2, 3])
 * // Result: [1, 2, 3]
 * ```
 */
export function union<T>(...arrays: readonly (readonly T[])[]): T[] {
  const seen = new Set<T>()
  const result: T[] = []

  for (const array of arrays) {
    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item)
        result.push(item)
      }
    }
  }

  return result
}
