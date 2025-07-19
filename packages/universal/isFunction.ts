/**
 * Type guard to check if a value is a function.
 *
 * @param functionToCheck - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```typescript
 * isFunction(() => {})           // true
 * isFunction(function() {})      // true
 * isFunction(async () => {})     // true
 * isFunction('string')           // false
 * isFunction(123)                // false
 * isFunction(null)               // false
 * ```
 */
const isFunction = (functionToCheck: unknown): functionToCheck is Function =>
  typeof functionToCheck === 'function'

export default isFunction
