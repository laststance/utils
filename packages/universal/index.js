// Universal utilities that work in any JavaScript environment

// Array utilities
export { arrGen } from './array/arrGen.js'
export { arrayEqual } from './array/arrayEqual.ts'
export { arrayFillmap } from './array/arrayFilllmap.ts'
export { range } from './array/range.ts'

// Enhanced array utilities
export { groupBy } from './array/groupBy.ts'
export { uniqueBy } from './array/uniqueBy.ts'
export { chunk } from './array/chunk.ts'
export { partition } from './array/partition.ts'
export { difference, intersection, union } from './array/setOperations.ts'

// String utilities
export { snakeToCameledSpace } from './string/snakeToCameledSpace.ts'
export { removeSpecialCharacters } from './removeSpecialCharacters.ts'
export { varToString } from './varToString.js'

// Type checking utilities
export { isBoolean } from './isBoolean.ts'
export { isError } from './isError.ts'
export { isFalsy } from './isFalsy.ts'
export { isFunction } from './isFunction.ts'
export { isImgUrl } from './isImageUrl.js'
export { nonNullable } from './non-nullable.ts'

// Type helpers
export * from './typeHelpers.ts'

// Validation and assertions
export { invariant } from './invariant.ts'

// Object comparison
export { shallowEqual } from './shallowEqual.ts'
export { default as shallowEqualScalar } from './shallowEqualScalar.js'

// Date utilities
export { getDate } from './getDate.ts'
export { yyyy_mm_dd } from './yyyy-mm-dd.js'

// Regex patterns
export { cssRegex } from './regex/css.ts'
export { emailRegex } from './regex/email.ts'
export { email2Regex } from './regex/email2.ts'

// Functional utilities
export { filterFalsy } from './filterFalsy.ts'
export { printValue } from './printValue.ts'
export { default as retry } from './retry.js'

// Math utilities
export { positiveIntegerSum } from './positiveIntegerSum.js'
export { random } from './random.ts'

// Code transformation
export { default as eqeqeqCodemod } from './eqeqeq.codemod.js'
