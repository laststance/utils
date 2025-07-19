/**
 * Type that can be either a synchronous value or a Promise-like (awaitable) version.
 * Useful for functions that can work with both sync and async values.
 *
 * @template T - The resolved value type
 *
 * @example
 * ```typescript
 * // Function that can handle both sync and async data sources
 * async function getData(source: Awaitable<string>): Promise<string> {
 *   return await source
 * }
 *
 * // Works with sync values
 * await getData('immediate value')
 *
 * // Works with promises
 * await getData(fetch('/api/data').then(r => r.text()))
 *
 * // API that may return cached (sync) or fetched (async) data
 * interface DataService {
 *   get(key: string): Awaitable<Data>  // Returns Data or Promise<Data>
 * }
 * ```
 */
declare type Awaitable<T> = T | PromiseLike<T>
