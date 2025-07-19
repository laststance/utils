import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('isClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('browser environment detection', () => {
    it('should detect browser environment with window object', async () => {
      // In test environment with happy-dom, window should be available
      expect(typeof window).toBe('object')
      expect(window.document).toBeDefined()
      expect(window.document.createElement).toBeInstanceOf(Function)

      // Import after environment is set up
      return import('./isClient.js').then((module) => {
        expect(module.default).toBe(true)
      })
    })

    it('should detect browser environment with proper DOM APIs', async () => {
      // Verify the exact conditions checked by isClient
      const hasWindow = typeof window !== 'undefined'
      const hasDocument = window.document
      const hasCreateElement = window.document.createElement

      expect(hasWindow).toBe(true)
      expect(hasDocument).toBeTruthy()
      expect(hasCreateElement).toBeTruthy()

      return import('./isClient.js').then((module) => {
        expect(module.default).toBe(true)
      })
    })
  })

  describe('server environment simulation', () => {
    it('should detect server environment when window is undefined', async () => {
      // Store original window
      const originalWindow = global.window

      try {
        // Remove window to simulate server environment
        // @ts-ignore
        delete global.window

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module in server-like environment
        const module = await import('./isClient.js')
        expect(module.default).toBe(false)
      } finally {
        // Restore window
        global.window = originalWindow
      }
    })

    it('should detect server environment when document is missing', async () => {
      // Store original values
      const originalWindow = global.window
      const originalDocument = global.window?.document

      try {
        // Create window without document
        // @ts-ignore
        global.window = {}

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module with incomplete window object
        const module = await import('./isClient.js')
        expect(module.default).toBe(false)
      } finally {
        // Restore original values
        global.window = originalWindow
        if (originalDocument && global.window) {
          global.window.document = originalDocument
        }
      }
    })

    it('should detect server environment when createElement is missing', async () => {
      // Store original values
      const originalWindow = global.window
      const originalCreateElement = global.window?.document?.createElement

      try {
        // Create window with document but no createElement
        // @ts-ignore
        global.window = {
          // @ts-ignore - intentionally incomplete for testing
          document: {},
        }

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module with incomplete document object
        const module = await import('./isClient.js')
        expect(module.default).toBe(false)
      } finally {
        // Restore original values
        global.window = originalWindow
        if (originalCreateElement && global.window?.document) {
          global.window.document.createElement = originalCreateElement
        }
      }
    })
  })

  describe('edge cases', () => {
    it('should handle window as non-object', async () => {
      // Store original window
      const originalWindow = global.window

      try {
        // Set window to non-object value
        // @ts-ignore
        global.window = 'not an object'

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module with invalid window
        const module = await import('./isClient.js')
        expect(module.default).toBe(false)
      } finally {
        // Restore window
        global.window = originalWindow
      }
    })

    it('should handle document as falsy value', async () => {
      // Store original values
      const originalWindow = global.window

      try {
        // Create window with falsy document
        // @ts-ignore
        global.window = {
          document: null,
        }

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module with null document
        const module = await import('./isClient.js')
        expect(module.default).toBe(false)
      } finally {
        // Restore original values
        global.window = originalWindow
      }
    })

    it('should handle createElement as non-function', async () => {
      // Store original values
      const originalWindow = global.window

      try {
        // Create window with document but createElement as non-function
        // @ts-ignore
        global.window = {
          document: {
            // @ts-ignore - intentionally invalid for testing
            createElement: 'not a function',
          },
        }

        // Clear module cache to force re-evaluation
        vi.resetModules()

        // Import module with invalid createElement
        const module = await import('./isClient.js')
        // Since createElement is truthy (a string), the check will pass
        expect(module.default).toBe(true)
      } finally {
        // Restore original values
        global.window = originalWindow
      }
    })
  })

  describe('type checking', () => {
    it('should be a boolean value', async () => {
      return import('./isClient.js').then((module) => {
        expect(typeof module.default).toBe('boolean')
      })
    })

    it('should be either true or false, never undefined', async () => {
      return import('./isClient.js').then((module) => {
        const value = module.default as unknown as boolean
        expect(value === true || value === false).toBe(true)
        expect(value).not.toBeUndefined()
        expect(value).not.toBeNull()
      })
    })
  })

  describe('consistency', () => {
    it('should return the same value on multiple imports', async () => {
      return Promise.all([
        import('./isClient.js'),
        import('./isClient.js'),
        import('./isClient.js'),
      ]).then(([module1, module2, module3]) => {
        expect(module1.default).toBe(module2.default)
        expect(module2.default).toBe(module3.default)
        expect(module1.default).toBe(module3.default)
      })
    })

    it('should be computed at module load time, not at runtime', async () => {
      return import('./isClient.js').then((module) => {
        const value1 = module.default

        // Try to modify window (shouldn't affect the already computed value)
        const originalWindow = global.window
        // @ts-ignore
        delete global.window

        const value2 = module.default

        // Restore window
        global.window = originalWindow

        // Value should remain the same since it's computed at load time
        expect(value1).toBe(value2)
      })
    })
  })

  describe('practical usage', () => {
    it('should work for conditional code execution', async () => {
      return import('./isClient.js').then((module) => {
        const isClient = module.default

        if (isClient) {
          // This should run in browser environment
          expect(typeof window).toBe('object')
          expect(window.document).toBeDefined()
        } else {
          // This should run in server environment
          expect(
            typeof window === 'undefined' ||
              !window.document ||
              !window.document.createElement,
          ).toBe(true)
        }
      })
    })

    it('should work for feature detection patterns', async () => {
      return import('./isClient.js').then((module) => {
        const isClient = module.default

        // Common pattern: only run DOM-related code on client
        if (isClient && window.document) {
          const element = window.document.createElement('div')
          expect(element).toBeInstanceOf(HTMLElement)
        }

        // Should not throw errors in either environment
        expect(() => {
          if (isClient) {
            // Client-side code
            const body = window.document.body
            expect(body).toBeDefined()
          } else {
            // Server-side code
            const serverSideValue = 'computed on server'
            expect(serverSideValue).toBe('computed on server')
          }
        }).not.toThrow()
      })
    })
  })
})
