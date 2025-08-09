/**
 * Creates a debounced function that delays invoking the provided callback until after
 * the specified timeout has elapsed since the last time it was invoked.
 *
 * @param timeout - The number of milliseconds to delay
 * @param callback - The function to debounce
 * @returns A debounced version of the callback function
 *
 * @example
 * ```typescript
 * const debouncedHandler = debounce(300, (event) => {
 *   console.log('Event handled:', event)
 * })
 *
 * // Multiple rapid calls will be debounced
 * debouncedHandler(event1)
 * debouncedHandler(event2)  // Only this will execute after 300ms
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  timeout: number,
  callback: T,
): (...args: Parameters<T>) => void {
  let timeoutID: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutID) clearTimeout(timeoutID)
    timeoutID = setTimeout(() => callback(...args), timeout)
  }
}
