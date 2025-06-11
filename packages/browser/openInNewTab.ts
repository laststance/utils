/**
 * Opens a URL in a new browser tab programmatically.
 * Creates a temporary anchor element and simulates a click to open the URL.
 * 
 * @param url - The URL to open in a new tab
 * 
 * @example
 * ```typescript
 * openInNewTab('https://example.com')
 * openInNewTab('https://github.com/user/repo')
 * 
 * // Use in event handlers
 * button.addEventListener('click', () => {
 *   openInNewTab('https://docs.example.com')
 * })
 * ```
 */
export function openInNewTab(url: string) {
  const anchor = document.createElement('a')
  anchor.target = '_blank'
  anchor.href = url
  anchor.click()
}
