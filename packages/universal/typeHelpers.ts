// from https://github.com/reduxjs/redux-toolkit/blob/4fbd29f0032f1ebb9e2e621ab48bbff5266e312c/packages/toolkit/src/query/tsHelpers.ts

/**
 * Type assertion helper that casts a value to a specific type.
 * WARNING: This performs no runtime checking - use carefully!
 *
 * @param v - The value to cast
 */
export function assertCast<T>(v: any): asserts v is T {}

/**
 * Safely assigns properties to a target object with type checking.
 * Similar to Object.assign but with better TypeScript support.
 *
 * @param target - The target object to assign to
 * @param args - Partial objects to assign from
 *
 * @example
 * ```typescript
 * const user = { name: '', age: 0 }
 * safeAssign(user, { name: 'Alice' }, { age: 30 })
 * // user is now { name: 'Alice', age: 30 }
 * ```
 */
export function safeAssign<T extends Record<string, unknown>>(
  target: T,
  ...args: Array<Partial<NoInfer<T>>>
) {
  Object.assign(target, ...args)
}

/**
 * Asserts that a value is defined (not undefined).
 * Throws a compilation error if the value might be undefined.
 *
 * @param x - The value to check
 */
export function assertIsDefined<T>(x: T | undefined): asserts x is T {}

/**
 * Asserts that a value is defined (not null or undefined) with runtime checking.
 * Throws an error if the value is null or undefined.
 *
 * @param value - The value to check
 * @throws {Error} If the value is null or undefined
 *
 * @example
 * ```typescript
 * const maybeValue: string | null = getValue()
 * assertIsDefinedWithError(maybeValue)
 * // maybeValue is now typed as string (not string | null)
 * console.log(maybeValue.toUpperCase()) // Safe to use
 * ```
 */
export function assertIsDefinedWithError<T>(
  value: T,
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`)
  }
}
