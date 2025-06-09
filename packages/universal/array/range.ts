/**
 * Create an array of numbers in a given range
 * const myRange = range(1, 5)
 * console.log(myRange) // Output: [1, 2, 3, 4, 5]
 */
export const range = (start: number, end: number): number[] => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}
