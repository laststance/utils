/**
 * Splits an array into chunks of specified size.
 * The last chunk may contain fewer elements if the array length is not divisible by the chunk size.
 *
 * @param array - The array to chunk
 * @param size - The size of each chunk (must be positive integer)
 * @returns An array of arrays, each containing at most `size` elements
 *
 * @throws {Error} If size is not a positive integer
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2)
 * // Result: [[1, 2], [3, 4], [5]]
 *
 * chunk(['a', 'b', 'c', 'd', 'e', 'f'], 3)
 * // Result: [['a', 'b', 'c'], ['d', 'e', 'f']]
 *
 * chunk([1, 2, 3, 4, 5, 6, 7], 3)
 * // Result: [[1, 2, 3], [4, 5, 6], [7]]
 *
 * // Use case: Pagination
 * const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const pages = chunk(items, 3)
 * // Result: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 *
 * // Use case: Batch processing
 * const users = [] // large user array
 * const batches = chunk(users, 100)
 * for (const batch of batches) {
 *   await processBatch(batch)
 * }
 * ```
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`Chunk size must be a positive integer, received: ${size}`)
  }

  if (array.length === 0) {
    return []
  }

  const result: T[][] = []

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}
