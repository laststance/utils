// Universal utilities that work in any JavaScript environment

// Array utilities
export { arrGen } from './array/arrGen.js'
export { arrayEqual } from './array/arrayEqual.ts'
export { arrayFillmap } from './array/arrayFilllmap.ts'
export { range } from './array/range.ts'

// String utilities
export { snakeToCameledSpace } from './string/snakeToCameledSpace.ts'
export { removeSpecialCharacters } from './removeSpecialCharacters.ts'
export { varToString } from './varToString.js'

// String case conversion
export { camelCase, kebabCase, pascalCase, constantCase } from './string/caseConversions.ts'

// String text processing  
export { truncate, capitalize, titleCase } from './string/textProcessing.ts'

// String URL-safe operations
export { slugify, escapeHtml, unescapeHtml } from './string/urlSafe.ts'

// String templating
export { template, templateAdvanced } from './string/template.ts'

// String analysis
export { 
  wordCount, 
  isBlank, 
  lines, 
  lineCount, 
  characterCount, 
  sentences, 
  sentenceCount 
} from './string/analysis.ts'

// String advanced operations
export { 
  reverse, 
  isPalindrome, 
  levenshteinDistance, 
  similarity, 
  longestCommonSubsequence 
} from './string/advanced.ts'

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