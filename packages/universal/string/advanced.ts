/**
 * Reverses a string while properly handling Unicode characters.
 * Uses Array.from() to correctly handle multi-byte Unicode characters like emojis.
 * 
 * @param str - The string to reverse
 * @returns The reversed string
 * 
 * @example
 * ```typescript
 * reverse('hello')              // 'olleh'
 * reverse('Hello World')        // 'dlroW olleH'
 * reverse('🎉🎊🎈')              // '🎈🎊🎉'
 * reverse('Café')               // 'éfaC'
 * reverse('')                   // ''
 * reverse('12345')              // '54321'
 * ```
 */
export function reverse(str: string): string {
  return Array.from(str).reverse().join('')
}

/**
 * Checks if a string is a palindrome (reads the same forwards and backwards).
 * Case-insensitive and ignores whitespace and punctuation.
 * 
 * @param str - The string to check
 * @param options - Configuration options
 * @returns True if the string is a palindrome, false otherwise
 * 
 * @example
 * ```typescript
 * isPalindrome('racecar')                    // true
 * isPalindrome('A man a plan a canal Panama') // true
 * isPalindrome('race a car')                 // false (with strict mode)
 * isPalindrome('race a car', { strict: false }) // true (ignoring spaces/punctuation)
 * isPalindrome('Madam')                      // true (case-insensitive)
 * isPalindrome('')                           // true
 * isPalindrome('a')                          // true
 * ```
 */
export function isPalindrome(
  str: string, 
  options: { 
    /** If true, only consider alphanumeric characters and ignore case/punctuation */
    strict?: boolean 
  } = {}
): boolean {
  const { strict = true } = options
  
  let cleanStr = str
  if (!strict) {
    // Remove non-alphanumeric characters and convert to lowercase
    cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  } else {
    // Just convert to lowercase for case-insensitive comparison
    cleanStr = str.toLowerCase()
  }
  
  return cleanStr === reverse(cleanStr)
}

/**
 * Calculates the Levenshtein distance between two strings.
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 * 
 * @param str1 - First string
 * @param str2 - Second string  
 * @returns The Levenshtein distance between the two strings
 * 
 * @example
 * ```typescript
 * levenshteinDistance('cat', 'bat')          // 1 (substitute 'c' with 'b')
 * levenshteinDistance('kitten', 'sitting')   // 3 (k→s, e→i, insert 'g')
 * levenshteinDistance('hello', 'hello')      // 0 (identical)
 * levenshteinDistance('', 'abc')             // 3 (insert 3 characters)
 * levenshteinDistance('abc', '')             // 3 (delete 3 characters)
 * levenshteinDistance('hello', 'world')      // 4
 * ```
 */
export function levenshteinDistance(str1: string, str2: string): number {
  // Handle edge cases
  if (str1 === str2) return 0
  if (str1.length === 0) return str2.length
  if (str2.length === 0) return str1.length
  
  // Convert strings to arrays for proper Unicode handling
  const chars1 = Array.from(str1)
  const chars2 = Array.from(str2)
  
  const len1 = chars1.length
  const len2 = chars2.length
  
  // Create matrix
  const matrix: number[][] = []
  
  // Initialize first row and column
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0]![j] = j
  }
  
  // Fill in the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (chars1[i - 1] === chars2[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]! // No operation needed
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,    // Deletion
          matrix[i]![j - 1]! + 1,    // Insertion
          matrix[i - 1]![j - 1]! + 1 // Substitution
        )
      }
    }
  }
  
  return matrix[len1]![len2]!
}

/**
 * Calculates string similarity based on Levenshtein distance.
 * Returns a percentage (0-100) where 100 means identical strings.
 * 
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity percentage (0-100)
 * 
 * @example
 * ```typescript
 * similarity('hello', 'hello')        // 100 (identical)
 * similarity('hello', 'world')        // 20 (very different)
 * similarity('kitten', 'sitting')     // 57.14... (moderately similar)
 * similarity('', '')                  // 100 (both empty)
 * similarity('abc', '')               // 0 (completely different)
 * ```
 */
export function similarity(str1: string, str2: string): number {
  if (str1 === str2) return 100
  
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 100 // Both strings are empty
  
  const distance = levenshteinDistance(str1, str2)
  return Math.round(((maxLength - distance) / maxLength) * 100 * 100) / 100
}

/**
 * Finds the longest common subsequence between two strings.
 * A subsequence is a sequence that can be derived from another sequence 
 * by deleting some or no elements without changing the order of remaining elements.
 * 
 * @param str1 - First string
 * @param str2 - Second string  
 * @returns The longest common subsequence
 * 
 * @example
 * ```typescript
 * longestCommonSubsequence('ABCDGH', 'AEDFHR')      // 'ADH'
 * longestCommonSubsequence('hello', 'world')         // 'ol' 
 * longestCommonSubsequence('programming', 'algorithm') // 'ogram'
 * longestCommonSubsequence('', 'abc')                // ''
 * longestCommonSubsequence('same', 'same')           // 'same'
 * ```
 */
export function longestCommonSubsequence(str1: string, str2: string): string {
  if (!str1 || !str2) return ''
  
  const chars1 = Array.from(str1)
  const chars2 = Array.from(str2)
  const len1 = chars1.length
  const len2 = chars2.length
  
  // Create LCS length matrix
  const dp: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0))
  
  // Fill the dp table
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (chars1[i - 1] === chars2[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1
      } else {
        dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!)
      }
    }
  }
  
  // Reconstruct the LCS string
  let i = len1, j = len2
  const lcs: string[] = []
  
  while (i > 0 && j > 0) {
    if (chars1[i - 1] === chars2[j - 1]) {
      lcs.unshift(chars1[i - 1]!)
      i--
      j--
    } else if (dp[i - 1]![j]! > dp[i]![j - 1]!) {
      i--
    } else {
      j--
    }
  }
  
  return lcs.join('')
}