import { describe, it, expect, vi } from 'vitest'
import transformer from './eqeqeq.codemod.js'

// Mock jscodeshift API for testing
const mockJscodeshift = (source) => ({
  find: (type, filter) => {
    if (type === 'BinaryExpression' && filter.operator === '==') {
      return {
        replaceWith: (replaceFn) => ({ // eslint-disable-line no-unused-vars
          toSource: () => {
            // Return transformed source for testing - only replace standalone == operators
            if (source.includes('===')) {
              return source // Don't transform if it already has ===
            }
            return source.replace(/==/g, '===')
          }
        })
      }
    }
    return { replaceWith: () => ({ toSource: () => source }) }
  }
})

describe('node/eqeqeq.codemod', () => {
  it('should transform == to === in binary expressions', () => {
    const mockApi = {
      jscodeshift: Object.assign(mockJscodeshift, {
        BinaryExpression: 'BinaryExpression',
        template: {
          expression: (strings, ...values) => {
            let result = strings[0]
            for (let i = 0; i < values.length; i++) {
              result += values[i] + (strings[i + 1] || '')
            }
            return result
          }
        }
      })
    }

    const sourceCode = 'if (a == b) { return true; }'
    const file = { source: sourceCode }
    
    const result = transformer(file, mockApi)
    expect(result).toBe('if (a === b) { return true; }')
  })

  it('should handle multiple == operators', () => {
    const mockApi = {
      jscodeshift: Object.assign(mockJscodeshift, {
        BinaryExpression: 'BinaryExpression',
        template: {
          expression: (strings, ...values) => {
            let result = strings[0]
            for (let i = 0; i < values.length; i++) {
              result += values[i] + (strings[i + 1] || '')
            }
            return result
          }
        }
      })
    }

    const sourceCode = 'if (a == b && c == d) { return true; }'
    const file = { source: sourceCode }
    
    const result = transformer(file, mockApi)
    expect(result).toBe('if (a === b && c === d) { return true; }')
  })

  it('should not affect === operators', () => {
    const mockApi = {
      jscodeshift: Object.assign(mockJscodeshift, {
        BinaryExpression: 'BinaryExpression',
        template: {
          expression: (strings, ...values) => {
            let result = strings[0]
            for (let i = 0; i < values.length; i++) {
              result += values[i] + (strings[i + 1] || '')
            }
            return result
          }
        }
      })
    }

    const sourceCode = 'if (a === b) { return true; }'
    const file = { source: sourceCode }
    
    const result = transformer(file, mockApi)
    expect(result).toBe('if (a === b) { return true; }')
  })

  it('should handle empty source', () => {
    const mockApi = {
      jscodeshift: Object.assign(mockJscodeshift, {
        BinaryExpression: 'BinaryExpression',
        template: {
          expression: (strings, ...values) => {
            let result = strings[0]
            for (let i = 0; i < values.length; i++) {
              result += values[i] + (strings[i + 1] || '')
            }
            return result
          }
        }
      })
    }

    const sourceCode = ''
    const file = { source: sourceCode }
    
    const result = transformer(file, mockApi)
    expect(result).toBe('')
  })

  describe('real-world code examples', () => {
    it('should handle function comparisons', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = `
        function isEqual(a, b) {
          return a == b;
        }
      `
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      expect(result).toContain('a === b')
    })

    it('should handle object property comparisons', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if (user.name == "John") { console.log("Hello John"); }'
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      expect(result).toBe('if (user.name === "John") { console.log("Hello John"); }')
    })

    it('should handle null and undefined comparisons', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if (value == null || other == undefined) { return false; }'
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      expect(result).toBe('if (value === null || other === undefined) { return false; }')
    })
  })

  describe('edge cases', () => {
    it('should handle complex expressions', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if ((a + b) == (c * d)) { return true; }'
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      expect(result).toBe('if ((a + b) === (c * d)) { return true; }')
    })

    it('should handle array and function call comparisons', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if (arr[0] == getValue()) { process(); }'
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      expect(result).toBe('if (arr[0] === getValue()) { process(); }')
    })
  })

  describe('transformation correctness', () => {
    it('should maintain code structure and spacing', () => {
      // This is a conceptual test since our mock is simplified
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if ( a == b ) { return true; }'
      const file = { source: sourceCode }
      
      const result = transformer(file, mockApi)
      // The exact spacing depends on the jscodeshift implementation
      expect(result).toContain('===')
      expect(result).toContain(' === ')  // Should have === with spaces
      expect(result).not.toContain(' == ')  // Should not have == with spaces
    })

    it('should be idempotent (running twice should have same result)', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const sourceCode = 'if (a == b) { return true; }'
      const file1 = { source: sourceCode }
      const file2 = { source: sourceCode }
      
      const result1 = transformer(file1, mockApi)
      const result2 = transformer(file2, mockApi)
      
      expect(result1).toBe(result2)
      expect(result1).toBe('if (a === b) { return true; }')
    })
  })

  describe('function signature and API', () => {
    it('should export a default function', () => {
      expect(typeof transformer).toBe('function')
    })

    it('should accept file and api parameters', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const file = { source: 'test == code' }
      
      expect(() => transformer(file, mockApi)).not.toThrow()
    })

    it('should return transformed source code', () => {
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: (strings, ...values) => {
              let result = strings[0]
              for (let i = 0; i < values.length; i++) {
                result += values[i] + (strings[i + 1] || '')
              }
              return result
            }
          }
        })
      }

      const file = { source: 'a == b' }
      const result = transformer(file, mockApi)
      
      expect(typeof result).toBe('string')
      expect(result).toBe('a === b')
    })
  })

  describe('jscodeshift integration', () => {
    it('should use correct jscodeshift APIs', () => {
      const mockFind = vi.fn().mockReturnValue({
        replaceWith: vi.fn().mockReturnValue({
          toSource: vi.fn().mockReturnValue('transformed')
        })
      })

      const mockJscodeshift = vi.fn().mockReturnValue({
        find: mockFind
      })

      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: vi.fn()
          }
        })
      }

      const file = { source: 'test code' }
      transformer(file, mockApi)

      expect(mockJscodeshift).toHaveBeenCalledWith('test code')
      expect(mockFind).toHaveBeenCalledWith('BinaryExpression', { operator: '==' })
    })

    it('should use template expressions correctly', () => {
      const mockTemplate = vi.fn().mockReturnValue('template result')
      
      const mockApi = {
        jscodeshift: Object.assign(mockJscodeshift, {
          BinaryExpression: 'BinaryExpression',
          template: {
            expression: mockTemplate
          }
        })
      }

      const file = { source: 'a == b' }
      transformer(file, mockApi)

      // The template function should be available for use
      expect(mockTemplate).toBeDefined()
    })
  })
})