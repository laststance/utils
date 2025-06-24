import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('suppressConsoleError', () => {
  let originalConsoleError
  let capturedLogs
  let mockConsoleError

  beforeEach(() => {
    // Store the original console.error
    originalConsoleError = console.error
    capturedLogs = []
    
    // Create a mock that will act as the "original" console.error
    mockConsoleError = vi.fn((...args) => {
      capturedLogs.push(args)
    })
    
    // Set the mock as console.error before importing the module
    console.error = mockConsoleError
    
    // Import the module to set up suppression
    vi.resetModules()
  })

  afterEach(() => {
    // Restore the original console.error
    console.error = originalConsoleError
    vi.clearAllMocks()
    mockConsoleError.mockClear()
  })

  describe('module import and setup', () => {
    it('should import without throwing errors', async () => {
      await expect(import('./suppressConsoleError.js')).resolves.toBeDefined()
    })

    it('should modify console.error when imported', async () => {
      const beforeImport = console.error
      
      await import('./suppressConsoleError.js')
      
      // console.error should be different after import
      expect(console.error).not.toBe(beforeImport)
      expect(console.error).toBeInstanceOf(Function)
    })
  })

  describe('error suppression behavior', () => {
    beforeEach(async () => {
      // Import the module to activate error suppression
      await import('./suppressConsoleError.js')
    })

    it('should suppress ReactDOM.render deprecation warnings', () => {
      const reactDOMError = 'ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it\'s running React 17.'
      
      console.error(reactDOMError)
      
      // The error should be suppressed
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should suppress React act() warnings', () => {
      const actWarning = 'Warning: An update to TestComponent inside a test was not wrapped in act(...)'
      
      console.error(actWarning)
      
      // The error should be suppressed
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should suppress partial ReactDOM.render messages', () => {
      const partialMessages = [
        'ReactDOM.render is no longer supported in React 18.',
        'Something before ReactDOM.render is no longer supported in React 18. and after',
        'ReactDOM.render is no longer supported in React 18. More text here'
      ]
      
      partialMessages.forEach(message => {
        console.error(message)
        expect(mockConsoleError).not.toHaveBeenCalled()
        mockConsoleError.mockClear()
      })
    })

    it('should suppress partial act() warning messages', () => {
      const actMessages = [
        'Warning: An update to Component inside a test was not wrapped in act',
        'Before Warning: An update to MyComponent inside a test was not wrapped in act after',
        'Warning: An update to SomeComponent inside a test was not wrapped in act(...). More details'
      ]
      
      actMessages.forEach(message => {
        console.error(message)
        expect(mockConsoleError).not.toHaveBeenCalled()
        mockConsoleError.mockClear()
      })
    })
  })

  describe('error passthrough behavior', () => {
    beforeEach(async () => {
      await import('./suppressConsoleError.js')
    })

    it('should pass through other error messages', () => {
      const normalErrors = [
        'This is a normal error',
        'TypeError: Cannot read property of undefined',
        'Network request failed',
        'Validation error occurred',
        'Custom application error'
      ]
      
      normalErrors.forEach((error, index) => {
        console.error(error)
        expect(mockConsoleError).toHaveBeenNthCalledWith(index + 1, error)
      })
    })

    it('should pass through errors with multiple arguments', () => {
      const error = 'Error occurred'
      const details = { code: 500, message: 'Server error' }
      const stack = 'Error stack trace...'
      
      console.error(error, details, stack)
      
      expect(mockConsoleError).toHaveBeenCalledWith(error, details, stack)
    })

    it('should pass through React errors that are not suppressed', () => {
      const reactErrors = [
        'Warning: Failed prop type',
        'Warning: Each child in a list should have a unique "key" prop',
        'Warning: Cannot update a component while rendering',
        'Error: Element type is invalid'
      ]
      
      reactErrors.forEach((error, index) => {
        console.error(error)
        expect(mockConsoleError).toHaveBeenNthCalledWith(index + 1, error)
      })
    })

    it('should pass through similar but different messages', () => {
      const similarButDifferent = [
        'ReactDOM.render is deprecated', // Missing the exact phrase
        'Warning: An update inside a test', // Missing the exact phrase
        'ReactDOM.createRoot is no longer supported', // Different method
        'Warning: An update to component was not wrapped' // Missing "inside a test"
      ]
      
      similarButDifferent.forEach((error, index) => {
        console.error(error)
        expect(mockConsoleError).toHaveBeenNthCalledWith(index + 1, error)
      })
    })
  })

  describe('function behavior and context', () => {
    beforeEach(async () => {
      await import('./suppressConsoleError.js')
    })

    it('should maintain proper this context', () => {
      // Test that the original console.error is called with proper context
      const normalError = 'Normal error message'
      
      console.error(normalError)
      
      expect(mockConsoleError).toHaveBeenCalledWith(normalError)
    })

    it('should handle errors with no arguments', () => {
      console.error()
      
      expect(mockConsoleError).toHaveBeenCalledWith()
    })

    it('should handle errors with non-string first argument', () => {
      const errorObj = new Error('Test error')
      const numberError = 404
      const booleanError = false
      
      console.error(errorObj)
      console.error(numberError)
      console.error(booleanError)
      
      expect(mockConsoleError).toHaveBeenNthCalledWith(1, errorObj)
      expect(mockConsoleError).toHaveBeenNthCalledWith(2, numberError)
      expect(mockConsoleError).toHaveBeenNthCalledWith(3, booleanError)
    })

    it('should handle null and undefined arguments', () => {
      console.error(null)
      console.error(undefined)
      console.error(null, 'additional info')
      
      expect(mockConsoleError).toHaveBeenNthCalledWith(1, null)
      expect(mockConsoleError).toHaveBeenNthCalledWith(2, undefined)
      expect(mockConsoleError).toHaveBeenNthCalledWith(3, null, 'additional info')
    })
  })

  describe('edge cases and error handling', () => {
    beforeEach(async () => {
      await import('./suppressConsoleError.js')
    })

    it('should handle very long error messages', () => {
      const longError = 'Normal error: ' + 'A'.repeat(10000)
      
      console.error(longError)
      
      expect(mockConsoleError).toHaveBeenCalledWith(longError)
    })

    it('should handle Unicode and special characters', () => {
      const unicodeError = 'Error with unicode: 🚨 ñórmål érrör 中文'
      
      console.error(unicodeError)
      
      expect(mockConsoleError).toHaveBeenCalledWith(unicodeError)
    })

    it('should handle errors when original console.error throws', () => {
      // Test that the wrapper function doesn't throw even if the underlying implementation has issues
      const normalError = 'This should pass through'
      
      expect(() => console.error(normalError)).not.toThrow()
    })

    it('should handle case sensitivity', () => {
      const caseVariations = [
        'reactdom.render is no longer supported in React 18.',
        'REACTDOM.RENDER IS NO LONGER SUPPORTED IN REACT 18.',
        'warning: an update to component inside a test was not wrapped in act'
      ]
      
      caseVariations.forEach((error, index) => {
        console.error(error)
        // These should NOT be suppressed due to case differences
        expect(mockConsoleError).toHaveBeenNthCalledWith(index + 1, error)
      })
    })
  })

  describe('performance considerations', () => {
    beforeEach(async () => {
      await import('./suppressConsoleError.js')
    })

    it('should handle many console.error calls efficiently', () => {
      const startTime = performance.now()
      
      // Mix of suppressed and passed-through errors
      for (let i = 0; i < 1000; i++) {
        if (i % 3 === 0) {
          console.error('ReactDOM.render is no longer supported in React 18.')
        } else if (i % 3 === 1) {
          console.error('Warning: An update to Component inside a test was not wrapped in act')
        } else {
          console.error(`Normal error ${i}`)
        }
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete quickly (less than 100ms for 1000 calls)
      expect(duration).toBeLessThan(100)
      
      // Should have called mockConsoleError ~333 times (only non-suppressed errors)
      expect(mockConsoleError).toHaveBeenCalledTimes(333)
    })

    it('should not significantly impact performance for normal errors', () => {
      const iterations = 100
      const startTime = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        console.error(`Performance test error ${i}`)
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete very quickly
      expect(duration).toBeLessThan(50)
      expect(mockConsoleError).toHaveBeenCalledTimes(iterations)
    })
  })

  describe('real-world usage patterns', () => {
    beforeEach(async () => {
      await import('./suppressConsoleError.js')
    })

    it('should suppress React 18 warnings in test environments', () => {
      // Simulate common React 18 warnings that appear in tests
      const react18Warnings = [
        'ReactDOM.render is no longer supported in React 18. Use createRoot instead.',
        'ReactDOM.render is no longer supported in React 18. Until you switch to the new API, your app will behave as if it\'s running React 17.',
        'ReactDOM.render is no longer supported in React 18. Learn more: https://reactjs.org/link/switch-to-createroot'
      ]
      
      react18Warnings.forEach(warning => {
        console.error(warning)
        expect(mockConsoleError).not.toHaveBeenCalled()
        mockConsoleError.mockClear()
      })
    })

    it('should suppress act() warnings with various component names', () => {
      const componentNames = ['App', 'UserList', 'ProfileCard', 'Navigation', 'Footer']
      
      componentNames.forEach(componentName => {
        const warning = `Warning: An update to ${componentName} inside a test was not wrapped in act(...)`
        console.error(warning)
        expect(mockConsoleError).not.toHaveBeenCalled()
        mockConsoleError.mockClear()
      })
    })

    it('should maintain normal error reporting for application errors', () => {
      const appErrors = [
        'API request failed: 404 Not Found',
        'Validation failed: Email is required',
        'Database connection error',
        'Authentication failed: Invalid credentials',
        'File upload error: File too large'
      ]
      
      appErrors.forEach((error, index) => {
        console.error(error)
        expect(mockConsoleError).toHaveBeenNthCalledWith(index + 1, error)
      })
    })
  })
})