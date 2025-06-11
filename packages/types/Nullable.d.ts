/**
 * Type that includes null and undefined as possible values.
 * Represents a value that might not exist or be initialized.
 * 
 * @template T - The base type that can be nullable
 * 
 * @example
 * ```typescript
 * // Database field that might be empty
 * interface User {
 *   id: number
 *   name: string
 *   email: Nullable<string>  // Can be string, null, or undefined
 * }
 * 
 * // Function that might not find a result
 * function findUser(id: number): Nullable<User> {
 *   return users.find(u => u.id === id) || null
 * }
 * 
 * // Safe access pattern
 * const user = findUser(123)
 * if (user) {
 *   console.log(user.name)  // TypeScript knows user is not null here
 * }
 * ```
 */
declare type Nullable<T> = T | null | undefined
