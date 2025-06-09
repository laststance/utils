/**
 * @param {number} timeout
 * @param {(event: Event) => void} callback
 * @return {(event: Event) => void}
 */
export function debounce(
  timeout: number,
  callback: (_event: Event) => void,
): (_event: Event) => void {
  let timeoutID = 0
  return (event) => {
    clearTimeout(timeoutID)
    timeoutID = window.setTimeout(() => callback(event), timeout)
  }
}
