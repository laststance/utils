/**
 * Groups array elements by a key function result.
 *
 * @param array - The array to group
 * @param keyGetter - Function that returns the grouping key for each item
 * @returns An object with keys as group identifiers and values as arrays of grouped items
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, role: 'admin', name: 'Alice' },
 *   { id: 2, role: 'user', name: 'Bob' },
 *   { id: 3, role: 'admin', name: 'Charlie' }
 * ]
 *
 * const grouped = groupBy(users, user => user.role)
 * // Result: {
 * //   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
 * //   user: [{ id: 2, role: 'user', name: 'Bob' }]
 * // }
 *
 * // Group numbers by even/odd
 * groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd')
 * // Result: { odd: [1, 3, 5], even: [2, 4] }
 *
 * // Group strings by length
 * groupBy(['apple', 'pie', 'banana'], str => str.length)
 * // Result: { 3: ['pie'], 5: ['apple'], 6: ['banana'] }
 * ```
 */
export function groupBy<T, K extends string | number | symbol>(
  array: readonly T[],
  keyGetter: (item: T, index: number) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    const key = keyGetter(item, i)

    if (result[key]) {
      result[key]!.push(item)
    } else {
      result[key] = [item]
    }
  }

  return result
}
