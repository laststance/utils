/**
 * Utility type to extract value types from an object
 */
export type ValueOf<T> = T[keyof T]

/**
 * Usage example
 */
export const FREEWORD_SEARCH_TYPE = {
  DRAWING: 'drawing',
  DRAWING_AND_DOCUMENT_FILE: 'drawing_and_document_file',
} as const

export type FreewordSearchType = ValueOf<typeof FREEWORD_SEARCH_TYPE>
// Results in type: 'drawing' | 'drawing_and_document_file'
