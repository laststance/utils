/**
 * Generates a new array by applying a callback function to each element of the array.
 *
 * @param {number} arrayLength - The length of the new array.
 * @param {(value: any, index: number, array: any[]) => unknown} callback - The function to apply to each element of the array.
 * @return {number[]} - The new array with the results of applying the callback function to each element.
 */
export function arrayFillmap(
  arrayLength: number,
  callback: (_value: any, _index: number, _array: any[]) => unknown,
): unknown[] {
  return new Array(arrayLength).fill(0).map(callback)
}
