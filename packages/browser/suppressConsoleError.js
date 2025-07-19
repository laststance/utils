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
  const message = String(args[0] || '')

  // Suppress ReactDOM.render deprecation warnings
  if (message.includes('ReactDOM.render is no longer supported in React 18.')) {
    return
  }

  // Suppress React act() warnings - match pattern with actual component names
  if (
    message.includes('Warning: An update to') &&
    message.includes('inside a test was not wrapped in act')
  ) {
    return
  }

  originalError.call(console, ...args)
}
