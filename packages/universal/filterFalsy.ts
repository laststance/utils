type Falsy = false | 0 | '' | null | undefined

/**
 * Filters out falsy values from an array.
 * Removes false, 0, '', null, and undefined values.
 * 
 * @param array - Array that may contain falsy values
 * @returns New array with only truthy values
 * 
 * @example
 * ```typescript
 * const mixed = [1, 0, 'hello', '', true, false, null, undefined]
 * const filtered = filterFalsy(mixed)
 * console.log(filtered) // [1, 'hello', true]
 * ```
 */
export function filterFalsy<T = unknown>(array: (T | Falsy)[]): T[] {
  return array.filter(Boolean) as T[]
}
