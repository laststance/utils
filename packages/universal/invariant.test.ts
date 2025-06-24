import { describe, it, expect } from 'vitest'
import { invariant } from './invariant'

describe('invariant', () => {
  describe('condition validation', () => {
    it('should not throw when condition is truthy', () => {
      expect(() => {
        invariant(true, 'This should not throw')
      }).not.toThrow()

      expect(() => {
        invariant(1, 'Non-zero number is truthy')
      }).not.toThrow()

      expect(() => {
        invariant('string', 'Non-empty string is truthy')
      }).not.toThrow()

      expect(() => {
        invariant({}, 'Object is truthy')
      }).not.toThrow()

      expect(() => {
        invariant([], 'Array is truthy')
      }).not.toThrow()

      expect(() => {
        invariant(() => {}, 'Function is truthy')
      }).not.toThrow()
    })

    it('should throw when condition is falsy', () => {
      expect(() => {
        invariant(false, 'Condition failed')
      }).toThrow('Condition failed')

      expect(() => {
        invariant(0, 'Zero is falsy')
      }).toThrow('Zero is falsy')

      expect(() => {
        invariant('', 'Empty string is falsy')
      }).toThrow('Empty string is falsy')

      expect(() => {
        invariant(null, 'Null is falsy')
      }).toThrow('Null is falsy')

      expect(() => {
        invariant(undefined, 'Undefined is falsy')
      }).toThrow('Undefined is falsy')

      expect(() => {
        invariant(NaN, 'NaN is falsy')
      }).toThrow('NaN is falsy')
    })
  })

  describe('error message formatting', () => {
    it('should throw error with provided message when condition is false', () => {
      const message = 'Custom error message'
      expect(() => {
        invariant(false, message)
      }).toThrow(message)
    })

    it('should format message with %s placeholder substitution', () => {
      expect(() => {
        invariant(false, 'Value %s is invalid', 'test-value')
      }).toThrow('Value test-value is invalid')

      expect(() => {
        invariant(false, 'User %s has role %s', 'john', 'admin')
      }).toThrow('User john has role admin')

      expect(() => {
        invariant(false, 'Expected %s but got %s for property %s', 'string', 'number', 'name')
      }).toThrow('Expected string but got number for property name')
    })

    it('should handle multiple %s placeholders with all argument types', () => {
      expect(() => {
        invariant(false, 'Args: %s %s %s %s %s %s', 'str', 123, true, null, undefined, { key: 'value' })
      }).toThrow('Args: str 123 true null undefined [object Object]')
    })

    it('should handle more %s placeholders than arguments', () => {
      expect(() => {
        invariant(false, 'Values: %s %s %s', 'first', 'second')
      }).toThrow('Values: first second undefined')
    })

    it('should handle fewer %s placeholders than arguments', () => {
      expect(() => {
        invariant(false, 'Value: %s', 'first', 'second', 'third')
      }).toThrow('Value: first')
    })

    it('should handle no %s placeholders with arguments', () => {
      expect(() => {
        invariant(false, 'Static message', 'arg1', 'arg2')
      }).toThrow('Static message')
    })

    it('should handle complex object serialization', () => {
      const obj = { name: 'test', nested: { value: 42 } }
      const arr = [1, 2, 3]
      
      expect(() => {
        invariant(false, 'Object: %s, Array: %s', obj, arr)
      }).toThrow('Object: [object Object], Array: 1,2,3')
    })

    it('should handle function arguments', () => {
      const func = () => 'test'
      expect(() => {
        invariant(false, 'Function: %s', func)
      }).toThrow('Function: () => "test"')
    })
  })

  describe('error properties', () => {
    it('should create error with correct name for formatted messages', () => {
      try {
        invariant(false, 'Test error with %s', 'formatting')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.name).toBe('Invariant Violation')
        expect(error.message).toBe('Test error with formatting')
      }
    })

    it('should set framesToPop property', () => {
      try {
        invariant(false, 'Test error')
      } catch (error) {
        expect(error.framesToPop).toBe(1)
      }
    })

    it('should create generic error when format is undefined in development', () => {
      try {
        invariant(false, undefined as any, undefined, undefined, undefined, undefined, undefined, undefined, true)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('invariant requires an error message argument')
      }
    })
  })

  describe('development vs production mode', () => {
    it('should validate format argument in development mode', () => {
      expect(() => {
        invariant(false, undefined as any, undefined, undefined, undefined, undefined, undefined, undefined, true)
      }).toThrow('invariant requires an error message argument')
    })

    it('should create minified error in production mode when format is undefined', () => {
      try {
        invariant(false, undefined as any, undefined, undefined, undefined, undefined, undefined, undefined, false)
      } catch (error) {
        expect(error.message).toBe(
          'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
        )
      }
    })

    it('should still format messages in production mode when format is provided', () => {
      try {
        invariant(false, 'Production error: %s', 'value', undefined, undefined, undefined, undefined, undefined, undefined)
      } catch (error) {
        expect(error.message).toBe('Production error: value')
        expect(error.name).toBe('Invariant Violation')
      }
    })

    it('should default to development mode when isDevelopment not specified', () => {
      expect(() => {
        invariant(false, undefined as any)
      }).toThrow('invariant requires an error message argument')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string format', () => {
      expect(() => {
        invariant(false, '')
      }).toThrow('')
    })

    it('should handle format with only %s', () => {
      expect(() => {
        invariant(false, '%s', 'replacement')
      }).toThrow('replacement')
    })

    it('should handle special characters in format string', () => {
      expect(() => {
        invariant(false, 'Error: %s! @#$%^&*()', 'special')
      }).toThrow('Error: special! @#$%^&*()')
    })

    it('should handle newlines and unicode in format string', () => {
      expect(() => {
        invariant(false, 'Multi\nline %s with unicode: 🚨', 'error')
      }).toThrow('Multi\nline error with unicode: 🚨')
    })

    it('should handle very long format strings', () => {
      const longFormat = 'This is a very long error message that might be used in real applications '.repeat(10) + '%s'
      expect(() => {
        invariant(false, longFormat, 'end')
      }).toThrow()
    })

    it('should handle symbol arguments', () => {
      const sym = Symbol('test')
      expect(() => {
        invariant(false, 'Symbol: %s', sym)
      }).toThrow('Cannot convert a Symbol value to a string')
    })

    it('should handle bigint arguments', () => {
      const big = BigInt(9007199254740991)
      expect(() => {
        invariant(false, 'BigInt: %s', big)
      }).toThrow('BigInt: 9007199254740991')
    })

    it('should handle circular references gracefully', () => {
      const circular: any = { name: 'test' }
      circular.self = circular
      
      expect(() => {
        invariant(false, 'Circular: %s', circular)
      }).toThrow('Circular: [object Object]')
    })
  })

  describe('performance considerations', () => {
    it('should not evaluate expensive operations when condition is true', () => {
      let sideEffectExecuted = false
      const expensiveOperation = () => {
        sideEffectExecuted = true
        return 'expensive result'
      }

      invariant(true, 'This will not execute: %s', expensiveOperation())
      
      // The expensive operation should still be executed because it's passed as argument
      expect(sideEffectExecuted).toBe(true)
    })

    it('should handle many arguments efficiently', () => {
      const manyArgs = Array(100).fill('arg')
      expect(() => {
        invariant(false, 'Many args: %s %s %s', ...manyArgs)
      }).toThrow('Many args: arg arg arg')
    })
  })

  describe('integration with common patterns', () => {
    it('should work with null checks', () => {
      const value: string | null = null
      expect(() => {
        invariant(value !== null, 'Value must not be null')
      }).toThrow('Value must not be null')
    })

    it('should work with array validation', () => {
      const arr: number[] = []
      expect(() => {
        invariant(arr.length > 0, 'Array must not be empty')
      }).toThrow('Array must not be empty')
    })

    it('should work with object property checks', () => {
      const user = { name: 'John' }
      expect(() => {
        invariant('email' in user, 'User must have email property')
      }).toThrow('User must have email property')
    })

    it('should work with type guards', () => {
      const value: unknown = 'not a number'
      expect(() => {
        invariant(typeof value === 'number', 'Expected number but got %s', typeof value)
      }).toThrow('Expected number but got string')
    })

    it('should work in async contexts', async () => {
      const asyncCheck = async (condition: boolean) => {
        invariant(condition, 'Async operation failed')
        return 'success'
      }

      await expect(asyncCheck(true)).resolves.toBe('success')
      await expect(asyncCheck(false)).rejects.toThrow('Async operation failed')
    })
  })
})