/**
 * Generates a random integer between 1 and the specified number (inclusive).
 *
 * @param number - The upper bound for the random number
 * @returns Random integer between 1 and number (inclusive)
 *
 * @example
 * ```typescript
 * randomNumber(6)  // Returns 1, 2, 3, 4, 5, or 6 (like a dice roll)
 * randomNumber(10) // Returns 1-10
 * ```
 */
export function randomNumber(number: number) {
  return Math.floor(Math.random() * number) + 1
}

/**
 * Generates a random integer within a specified range (inclusive on both ends).
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns Random integer between min and max (inclusive)
 *
 * @example
 * ```typescript
 * randomNumberRange(5, 15)  // Returns 5, 6, 7, ..., 14, or 15
 * randomNumberRange(-3, 3)  // Returns -3, -2, -1, 0, 1, 2, or 3
 * ```
 */
export function randomNumberRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a random element from an array.
 *
 * @param array - The array to select from
 * @returns A random element from the array
 *
 * @example
 * ```typescript
 * const colors = ['red', 'green', 'blue']
 * randomInArray(colors)     // Returns 'red', 'green', or 'blue'
 *
 * const numbers = [10, 20, 30, 40]
 * randomInArray(numbers)    // Returns 10, 20, 30, or 40
 * ```
 */
export function randomInArray(array: any) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Random number generator utility for testing probability distributions.
 * Generates random numbers between 0 and 100.
 *
 * @returns Random number between 0 and 100
 * 
 * @example
 * ```typescript
 * rand()  // Returns 0-99.999... (never quite 100)
 * ```
 */
export function rand(): number {
  return Math.random() * 100
}
