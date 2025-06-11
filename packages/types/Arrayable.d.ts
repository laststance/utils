/**
 * Type that can be either a single value or an array of that value.
 * Useful for APIs that accept both individual items and collections.
 * 
 * @template T - The base type
 * 
 * @example
 * ```typescript
 * // Function that accepts single string or array of strings
 * function process(input: Arrayable<string>) {
 *   const items = Array.isArray(input) ? input : [input]
 *   return items.map(item => item.toUpperCase())
 * }
 * 
 * process('hello')           // ['HELLO']
 * process(['hello', 'world']) // ['HELLO', 'WORLD']
 * 
 * // API configuration
 * interface Config {
 *   exclude: Arrayable<string>  // Can be 'file.js' or ['file1.js', 'file2.js']
 * }
 * ```
 */
declare type Arrayable<T> = T | Array<T>
