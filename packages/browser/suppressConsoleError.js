/**
 * Console error suppression utility for testing environments.
 * Filters out specific React-related error messages that are expected during tests.
 * 
 * This utility overrides console.error to suppress:
 * - ReactDOM.render deprecation warnings in React 18+
 * - React act() warnings during tests
 * 
 * All other error messages are passed through normally.
 * 
 * @example
 * ```javascript
 * // Import this file to suppress console errors in test setup
 * import './suppressConsoleError'
 * 
 * // Now React 18 and act() warnings won't clutter test output
 * ```
 */
const originalError = console.error

console.error = (...args) => {
  // Suppress jest error msg
  if (args[0].includes('ReactDOM.render is no longer supported in React 18.')) {
    return
  } else if (
    args[0].includes(
      'Warning: An update to %s inside a test was not wrapped in act',
    )
  ) {
    return
  }

  originalError.call(console, ...args)
}
