/**
 * Returns an array with unique elements based on a key function.
 * The first occurrence of each unique key is preserved.
 *
 * @param array - The array to filter for unique elements
 * @param keyGetter - Function that returns the uniqueness key for each item
 * @returns A new array with unique elements based on the key function
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice', email: 'alice@example.com' },
 *   { id: 2, name: 'Bob', email: 'bob@example.com' },
 *   { id: 1, name: 'Alice Updated', email: 'alice.new@example.com' }, // Duplicate ID
 * ]
 *
 * const uniqueUsers = uniqueBy(users, user => user.id)
 * // Result: [
 * //   { id: 1, name: 'Alice', email: 'alice@example.com' },
 * //   { id: 2, name: 'Bob', email: 'bob@example.com' }
 * // ]
 *
 * // Remove duplicate words by length
 * uniqueBy(['apple', 'pie', 'banana', 'cat'], str => str.length)
 * // Result: ['apple', 'pie'] (first 5-char and first 3-char words)
 *
 * // Remove duplicates by computed property
 * const products = [
 *   { name: 'Laptop', price: 1000, category: 'electronics' },
 *   { name: 'Phone', price: 500, category: 'electronics' },
 *   { name: 'Book', price: 20, category: 'books' }
 * ]
 * uniqueBy(products, p => p.category)
 * // Result: [{ name: 'Laptop', ... }, { name: 'Book', ... }]
 * ```
 */
export function uniqueBy<T, K>(
  array: readonly T[],
  keyGetter: (item: T, index: number) => K,
): T[] {
  const seen = new Set<K>()
  const result: T[] = []

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    const key = keyGetter(item, i)

    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}
