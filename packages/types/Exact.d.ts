/**
 * Reproduces Facebook Flow's $Exact<T> utility type for TypeScript.
 * Rejects objects with excess properties beyond what Shape declares.
 *
 * TypeScript uses structural typing where extra properties are always assignable.
 * This utility enforces exact property matching by mapping excess keys to `never`.
 *
 * Use as a generic function constraint: `<T extends $Exact<Shape, T>>(input: T) => void`
 *
 * @template Shape - The expected object shape (no extra properties allowed)
 * @template Input - The actual input type to validate against Shape
 * @example
 * type User = { name: string; age: number }
 *
 * // Reject excess properties even from intermediate variables:
 * declare function createUser<T extends $Exact<User, T>>(user: T): void
 *
 * createUser({ name: 'Alice', age: 30 })          // OK
 * createUser({ name: 'Alice', age: 30, id: 1 })   // Error: 'id' is never
 *
 * const extra = { name: 'Alice', age: 30, id: 1 }
 * createUser(extra)                                // Error: 'id' is never
 */
declare type $Exact<Shape, Input> = Shape &
  Record<Exclude<keyof Input, keyof Shape>, never>
