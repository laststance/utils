/**
 * Splits an array into two arrays based on a predicate function.
 * Elements that satisfy the predicate go into the first array,
 * elements that don't go into the second array.
 *
 * @param array - The array to partition
 * @param predicate - Function to test each element
 * @returns A tuple [truthyElements, falsyElements]
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const [evens, odds] = partition(numbers, n => n % 2 === 0)
 * // evens: [2, 4, 6, 8, 10]
 * // odds: [1, 3, 5, 7, 9]
 *
 * const users = [
 *   { name: 'Alice', active: true, age: 30 },
 *   { name: 'Bob', active: false, age: 25 },
 *   { name: 'Charlie', active: true, age: 35 },
 *   { name: 'Diana', active: false, age: 28 }
 * ]
 *
 * const [activeUsers, inactiveUsers] = partition(users, user => user.active)
 * // activeUsers: [{ name: 'Alice', active: true, age: 30 }, { name: 'Charlie', active: true, age: 35 }]
 * // inactiveUsers: [{ name: 'Bob', active: false, age: 25 }, { name: 'Diana', active: false, age: 28 }]
 *
 * // Use case: Separating valid and invalid data
 * const data = ['valid@email.com', 'invalid-email', 'another@valid.com', 'also-invalid']
 * const [validEmails, invalidEmails] = partition(data, email => email.includes('@'))
 * ```
 */
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const truthyElements: T[] = []
  const falsyElements: T[] = []

  for (let i = 0; i < array.length; i++) {
    const item = array[i]!
    if (predicate(item, i)) {
      truthyElements.push(item)
    } else {
      falsyElements.push(item)
    }
  }

  return [truthyElements, falsyElements]
}
