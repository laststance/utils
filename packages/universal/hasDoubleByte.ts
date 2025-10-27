/**
 * Checks if a string contains double-byte characters (non-ASCII characters)
 * outside of the Japanese half-width katakana range (｡-ﾟ).
 *
 * @param value - The string to check for double-byte characters
 * @returns true if the string contains double-byte characters, false otherwise
 */
export function hasDoubleByte(value: string): boolean {
  return /[^ -~｡-ﾟ]/.test(value)
}
