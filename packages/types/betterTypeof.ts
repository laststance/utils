// from https://x.com/colinhacks/status/1927640989696688277

/**
 * Enhanced typeof function that provides more specific type information.
 * Goes beyond JavaScript's built-in typeof operator to distinguish between
 * different object types, numbers, and other edge cases.
 * 
 * @param data - The value to check the type of
 * @returns More specific type string than built-in typeof
 * 
 * @example
 * ```typescript
 * betterTypeof(42)               // 'integer'
 * betterTypeof(3.14)             // 'number'
 * betterTypeof(NaN)              // 'NaN'
 * betterTypeof([1, 2, 3])        // 'array'
 * betterTypeof(null)             // 'null'
 * betterTypeof({})               // 'object'
 * betterTypeof(new Date())       // 'Date'
 * betterTypeof('hello')          // 'string'
 * betterTypeof(true)             // 'boolean'
 * betterTypeof(() => {})         // 'function'
 * betterTypeof(undefined)        // 'undefined'
 * ```
 */
export function betterTypeof(data: unknown) {
  if (typeof data === 'number') {
    if (Number.isNaN(data)) return 'NaN'
    if (Number.isInteger(data)) return 'integer'
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) return 'array'
    if (data === null) return 'null'
    if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
      return data.constructor.name as string & {} // assert (string & {}) to help IDE autocomplete
    }
  }

  return typeof data
}
