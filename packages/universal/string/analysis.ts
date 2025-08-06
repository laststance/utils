/**
 * Counts the number of words in a string.
 * Words are defined as sequences of non-whitespace characters.
 * 
 * @param str - The string to count words in
 * @returns The number of words in the string
 * 
 * @example
 * ```typescript
 * wordCount('Hello world')              // 2
 * wordCount('The quick brown fox')      // 4
 * wordCount('  extra   spaces  ')       // 2
 * wordCount('one-hyphenated-word')      // 1
 * wordCount('')                         // 0
 * wordCount('   ')                      // 0
 * wordCount('Hello\nworld\ttabs')       // 3
 * ```
 */
export function wordCount(str: string): number {
  if (!str || !str.trim()) {
    return 0
  }
  
  // Split on whitespace and filter out empty strings
  return str.trim().split(/\s+/).length
}

/**
 * Checks if a string is blank (empty, null, undefined, or only whitespace).
 * Returns true for empty strings, strings with only spaces, tabs, newlines, etc.
 * 
 * @param str - The string to check
 * @returns True if the string is blank, false otherwise
 * 
 * @example
 * ```typescript
 * isBlank('')                    // true
 * isBlank('   ')                 // true
 * isBlank('\t\n\r')              // true
 * isBlank('  \t  \n  ')          // true
 * isBlank('Hello')               // false  
 * isBlank(' Hello ')             // false
 * isBlank('0')                   // false
 * ```
 */
export function isBlank(str: string | null | undefined): boolean {
  return !str || !str.trim()
}

/**
 * Splits a string into lines, handling various line ending formats.
 * Preserves empty lines and handles Windows (\r\n), Unix (\n), and classic Mac (\r) line endings.
 * 
 * @param str - The string to split into lines
 * @returns An array of lines
 * 
 * @example
 * ```typescript
 * lines('Hello\nWorld')                    // ['Hello', 'World']
 * lines('Line 1\r\nLine 2\r\nLine 3')     // ['Line 1', 'Line 2', 'Line 3']
 * lines('Unix\nWindows\r\nMac\r')         // ['Unix', 'Windows', 'Mac', '']
 * lines('Single line')                     // ['Single line']
 * lines('')                                // ['']
 * lines('Line 1\n\nLine 3')                // ['Line 1', '', 'Line 3']
 * ```
 */
export function lines(str: string): string[] {
  // Handle all types of line endings: \r\n, \n, \r
  return str.split(/\r\n|\n|\r/)
}

/**
 * Counts the number of lines in a string.
 * Handles various line ending formats and empty strings.
 * 
 * @param str - The string to count lines in
 * @returns The number of lines in the string
 * 
 * @example
 * ```typescript
 * lineCount('Hello\nWorld')              // 2
 * lineCount('Line 1\r\nLine 2')          // 2  
 * lineCount('Single line')               // 1
 * lineCount('')                          // 1
 * lineCount('Line 1\n\nLine 3')          // 3
 * ```
 */
export function lineCount(str: string): number {
  return lines(str).length
}

/**
 * Counts the number of characters in a string, handling Unicode properly.
 * Uses Array.from() to correctly count multi-byte Unicode characters like emojis.
 * 
 * @param str - The string to count characters in
 * @returns The number of Unicode characters (not bytes) in the string
 * 
 * @example
 * ```typescript
 * characterCount('Hello')              // 5
 * characterCount('Hello 👋')           // 7 (not 9)
 * characterCount('🎉🎊🎈')              // 3 (not 12)
 * characterCount('Café')               // 4
 * characterCount('')                   // 0
 * ```
 */
export function characterCount(str: string): number {
  return Array.from(str).length
}

/**
 * Extracts sentences from a string based on sentence-ending punctuation.
 * Handles periods, question marks, and exclamation marks as sentence endings.
 * 
 * @param str - The string to extract sentences from
 * @returns An array of sentences (trimmed)
 * 
 * @example
 * ```typescript
 * sentences('Hello world. How are you? Fine!')     // ['Hello world', 'How are you', 'Fine']
 * sentences('One. Two! Three?')                    // ['One', 'Two', 'Three']
 * sentences('No ending')                           // ['No ending']  
 * sentences('')                                    // []
 * sentences('Mr. Smith went home.')                // ['Mr', 'Smith went home'] (Note: simple implementation)
 * ```
 */
export function sentences(str: string): string[] {
  if (!str.trim()) {
    return []
  }
  
  // Split on sentence-ending punctuation, filter out empty strings
  // Includes Western (.!?) and Chinese (。！？) punctuation
  return str
    .split(/[.!?。！？]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

/**
 * Counts the number of sentences in a string.
 * 
 * @param str - The string to count sentences in
 * @returns The number of sentences in the string
 * 
 * @example
 * ```typescript
 * sentenceCount('Hello world. How are you? Fine!')  // 3
 * sentenceCount('Single sentence')                   // 1
 * sentenceCount('')                                  // 0
 * ```
 */
export function sentenceCount(str: string): number {
  return sentences(str).length
}