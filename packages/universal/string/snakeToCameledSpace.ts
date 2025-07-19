/**
 * Converts a kebab-case string to title case with spaces.
 * Splits on hyphens, capitalizes each word, and joins with spaces.
 *
 * @param str - The kebab-case string to convert
 * @returns Title case string with spaces
 *
 * @example
 * ```typescript
 * snakeToCameledSpace('code-piece-of-complete-guide-to-react-client-rendering-behavior')
 * // "Code Piece Of Complete Guide To React Client Rendering Behavior"
 *
 * snakeToCameledSpace('hello-world')        // "Hello World"
 * snakeToCameledSpace('single')             // "Single"
 * snakeToCameledSpace('api-key-example')    // "Api Key Example"
 * ```
 */
const snakeToCameledSpace = (str: string): string =>
  str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

export default snakeToCameledSpace
