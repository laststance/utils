#!/usr/bin/env node

/**
 * CLI utility to convert kebab-case strings to title case with spaces.
 *
 * Takes a kebab-case string as a command line argument and converts it to
 * title case with spaces between words. Uses the same implementation as
 * the universal snakeToCameledSpace function for consistency.
 *
 * @example
 * ```bash
 * # Basic usage
 * node snake-to-cameled-space.js "hello-world"
 * # Output: Hello World
 *
 * # Complex example
 * node snake-to-cameled-space.js "code-piece-of-complete-guide-to-react-client-rendering-behavior"
 * # Output: Code Piece Of Complete Guide To React Client Rendering Behavior
 *
 * # Single word
 * node snake-to-cameled-space.js "test"
 * # Output: Test
 * ```
 */

/**
 * Converts a kebab-case string to title case with spaces.
 * This is the same implementation used in @utils/universal/string/snakeToCameledSpace.ts
 * 
 * @param {string} str - The kebab-case string to convert
 * @returns {string} Title case string with spaces
 */
function snakeToCameledSpace(str) {
  if (!str) return str
  
  // Replace hyphens with spaces, then capitalize first char and chars after spaces
  return str
    .replace(/-/g, ' ')
    .replace(/^(\w)|(\s)(\w)/g, (match, first, space, afterSpace) => {
      if (first) return first.toUpperCase()
      return space + afterSpace.toUpperCase()
    })
}

const str = process.argv[2]

if (!str) {
  console.log('')
  process.exit(0)
}

const result = snakeToCameledSpace(str)
console.log(result)
