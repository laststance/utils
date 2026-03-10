/**
 * Utility type to extract value types from an object (array/tuple compatible)
 */
export type ValueOf<T> = T extends readonly (infer U)[] ? U : T[keyof T]

/**
 * Get Union type of values from const object
 */
export type Values<T> = T[keyof T]

/**
 * Get element type from array
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

/**
 * Usage examples
 */
export const FREEWORD_SEARCH_TYPE = {
  DRAWING: 'drawing',
  DRAWING_AND_DOCUMENT_FILE: 'drawing_and_document_file',
} as const

export type FreewordSearchType = ValueOf<typeof FREEWORD_SEARCH_TYPE>
// 'drawing' | 'drawing_and_document_file'

export const COLORS = ['red', 'green', 'blue'] as const
export type Color = ValueOf<typeof COLORS>
// 'red' | 'green' | 'blue'
