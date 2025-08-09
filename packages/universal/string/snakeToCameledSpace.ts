/**
 * Converts a kebab-case string to title case with spaces.
 * Uses regex replacement for optimal performance and consistent behavior.
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
const snakeToCameledSpace = (str: string): string => {
  if (!str) return str

  // Replace hyphens with spaces, then capitalize first char and chars after spaces
  return str
    .replace(/-/g, ' ')
    .replace(/^(\w)|(\s)(\w)/g, (_match, first, space, afterSpace) => {
      if (first) return first.toUpperCase()
      return space + afterSpace.toUpperCase()
    })
}

export default snakeToCameledSpace
