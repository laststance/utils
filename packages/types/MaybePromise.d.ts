/**
 * Type that can be either a value or a Promise of that value.
 * Similar to Awaitable, useful for functions that can handle both sync and async scenarios.
 * 
 * @template T - The value type that may be wrapped in a Promise
 * 
 * @example
 * ```typescript
 * // Function that can work with sync or async transformers
 * async function transform<T, U>(
 *   data: T, 
 *   transformer: (data: T) => MaybePromise<U>
 * ): Promise<U> {
 *   return await transformer(data)
 * }
 * 
 * // Sync transformer
 * const upper = (str: string) => str.toUpperCase()
 * await transform('hello', upper) // 'HELLO'
 * 
 * // Async transformer
 * const fetchData = async (id: string) => fetch(`/api/${id}`).then(r => r.json())
 * await transform('123', fetchData) // { data: ... }
 * ```
 */
declare type MaybePromise<T> = T | PromiseLike<T>
