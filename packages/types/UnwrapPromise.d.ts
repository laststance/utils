/**
 * Utility type that extracts the resolved value type from a Promise.
 * If the type is not a Promise, returns the type as-is.
 * 
 * @template T - The type that may be a Promise
 * 
 * @example
 * ```typescript
 * // Extract value types from Promises
 * type StringPromise = Promise<string>
 * type ExtractedString = UnwrapPromise<StringPromise>  // string
 * 
 * type NumberValue = number
 * type ExtractedNumber = UnwrapPromise<NumberValue>    // number (unchanged)
 * 
 * // Useful for function return types
 * async function fetchUser(): Promise<{ id: number; name: string }> {
 *   return { id: 1, name: 'John' }
 * }
 * 
 * type User = UnwrapPromise<ReturnType<typeof fetchUser>>  // { id: number; name: string }
 * 
 * // Works with nested Promises
 * type NestedPromise = Promise<Promise<string>>
 * type Unwrapped = UnwrapPromise<NestedPromise>  // Promise<string> (unwraps one level)
 * ```
 */
declare type UnwrapPromise<T> = T extends PromiseLike<infer V> ? V : T
