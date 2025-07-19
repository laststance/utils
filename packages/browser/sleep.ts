/**
 * Asynchronously delays execution for a specified number of milliseconds.
 * Uses a Promise that resolves after the given delay.
 *
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the delay
 *
 * @example
 * ```typescript
 * await sleep(1000)        // Wait 1 second
 * console.log('1 second later')
 *
 * await sleep(500)         // Wait 500ms
 * console.log('Half second later')
 *
 * // Use in async function
 * async function delayedGreeting() {
 *   console.log('Hello')
 *   await sleep(2000)
 *   console.log('World') // Appears 2 seconds later
 * }
 * ```
 */
const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export default sleep
