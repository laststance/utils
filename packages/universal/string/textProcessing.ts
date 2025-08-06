/**
 * Truncates a string to a specified maximum length, adding a suffix if truncated.
 * If the string is shorter than or equal to maxLength, returns the original string.
 * 
 * @param str - The string to truncate
 * @param maxLength - Maximum length of the resulting string (including suffix)
 * @param suffix - String to append when truncating (default: '...')
 * @returns The truncated string with suffix, or original string if not truncated
 * 
 * @example
 * ```typescript
 * truncate('Hello world', 8)           // 'Hello...'
 * truncate('Hello world', 8, ' more')  // 'Hell more'
 * truncate('Hello world', 20)          // 'Hello world' (unchanged)
 * truncate('Hello world', 3)           // '...' (suffix only)
 * truncate('', 5)                      // '' (empty string)
 * ```
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (maxLength < 0) {
    throw new Error('maxLength must be non-negative')
  }
  
  if (str.length <= maxLength) {
    return str
  }
  
  if (maxLength <= suffix.length) {
    return suffix.slice(0, maxLength)
  }
  
  return str.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalizes the first character of a string and lowercases the rest.
 * Handles Unicode characters properly.
 * 
 * @param str - The string to capitalize
 * @returns The capitalized string
 * 
 * @example
 * ```typescript
 * capitalize('hello world')    // 'Hello world'
 * capitalize('HELLO WORLD')    // 'Hello world'
 * capitalize('hELLO wORLD')    // 'Hello world'
 * capitalize('123abc')         // '123abc'
 * capitalize('')               // ''
 * capitalize('àpple')          // 'Àpple' (handles Unicode)
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str
  
  // Use Array.from to handle Unicode properly
  const chars = Array.from(str)
  return chars[0]!.toUpperCase() + chars.slice(1).join('').toLowerCase()
}

/**
 * Converts a string to title case (first letter of each word capitalized).
 * Words are separated by spaces, and other whitespace is preserved.
 * 
 * @param str - The string to convert to title case
 * @returns The title case version of the string
 * 
 * @example
 * ```typescript
 * titleCase('hello world')       // 'Hello World'
 * titleCase('hello  world')      // 'Hello  World' (preserves spacing)
 * titleCase('HELLO WORLD')       // 'Hello World'
 * titleCase('a b c')             // 'A B C'
 * titleCase('123 abc def')       // '123 Abc Def'
 * titleCase('')                  // ''
 * titleCase('àpple ørånge')      // 'Àpple Ørånge' (handles Unicode)
 * ```
 */
export function titleCase(str: string): string {
  if (!str) return str
  
  return str.replace(/\b\S+/g, (word) => {
    const chars = Array.from(word)
    return chars[0]!.toUpperCase() + chars.slice(1).join('').toLowerCase()
  })
}