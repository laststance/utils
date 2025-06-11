// from https://github.com/reduxjs/react-redux/blob/7a3e2fd11c9898e28700cad963757b523e215ab4/src/utils/shallowEqual.js

/**
 * Performs a shallow equality check between two objects.
 * Only compares the first level of properties - nested objects are compared by reference.
 * 
 * @param objA - First object to compare
 * @param objB - Second object to compare
 * @returns True if objects are shallowly equal, false otherwise
 * 
 * @example
 * ```typescript
 * const obj1 = { a: 1, b: 'hello' }
 * const obj2 = { a: 1, b: 'hello' }
 * const obj3 = { a: 1, b: 'world' }
 * 
 * shallowEqual(obj1, obj2) // true
 * shallowEqual(obj1, obj3) // false
 * 
 * // Nested objects are compared by reference
 * const nested1 = { a: { x: 1 } }
 * const nested2 = { a: { x: 1 } }
 * shallowEqual(nested1, nested2) // false (different object references)
 * ```
 */
export default function shallowEqual(
  objA: Record<string, unknown>,
  objB: Record<string, unknown>,
): boolean {
  if (objA === objB) {
    return true
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}
