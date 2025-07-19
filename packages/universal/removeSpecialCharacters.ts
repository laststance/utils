/**
 * Removes special characters from a string, keeping only:
 * - Hiragana (ひらがな)
 * - Katakana (カタカナ)
 * - CJK unified ideographs (漢字)
 * - Alphanumeric characters (half-width and full-width)
 * - Underscores
 *
 * Unicode ranges used:
 * - \w: Half-width alphanumeric and underscore
 * - \u3040-\u309F: Hiragana
 * - \u30A0-\u30FF: Katakana
 * - \uFF00-\uFF9F: Full-width alphanumeric
 * - \u4E00-\u9FAF: CJK unified ideographs
 *
 * @param str - The string to process
 * @returns String with special characters removed
 *
 * @example
 * ```typescript
 * removeSpecialCharacters('Hello! こんにちは123@#$')  // "Helloこんにちは123"
 * removeSpecialCharacters('test_file.txt')            // "test_filetxt"
 * removeSpecialCharacters('価格：￥1,000')             // "価格￥1000"
 * ```
 */
export function removeSpecialCharacters(str: string): string {
  return str.replace(
    /[^\w\u3040-\u309F\u30A0-\u30FF\uFF00-\uFF9F\u4E00-\u9FAF]/g,
    '',
  )
}
