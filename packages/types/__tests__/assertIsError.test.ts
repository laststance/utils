import { assertIsError } from '../assertIsError'

// Custom error class for testing
class CustomError extends Error {
  name = 'CustomError'
}

describe('assertIsError', () => {
  describe('should not throw when passed valid Error instances', () => {
    it('should accept a basic Error instance', () => {
      const error = new Error('test error')
      expect(() => assertIsError(error)).not.toThrow()
    })

    it('should accept built-in Error subclasses', () => {
      const typeError = new TypeError('type error')
      const referenceError = new ReferenceError('reference error')
      const syntaxError = new SyntaxError('syntax error')
      const rangeError = new RangeError('range error')

      expect(() => assertIsError(typeError)).not.toThrow()
      expect(() => assertIsError(referenceError)).not.toThrow()
      expect(() => assertIsError(syntaxError)).not.toThrow()
      expect(() => assertIsError(rangeError)).not.toThrow()
    })

    it('should accept custom Error subclasses', () => {
      const customError = new CustomError('custom error')
      expect(() => assertIsError(customError)).not.toThrow()
    })
  })

  describe('should throw AssertionError when passed non-Error values', () => {
    it('should throw when passed null', () => {
      expect(() => assertIsError(null)).toThrow()
      expect(() => assertIsError(null)).toThrow(
        "Expected 'error' to be Error, but received null",
      )
    })

    it('should throw when passed undefined', () => {
      expect(() => assertIsError(undefined)).toThrow()
      expect(() => assertIsError(undefined)).toThrow(
        "Expected 'error' to be Error, but received undefined",
      )
    })

    it('should throw when passed a string', () => {
      const value = 'error string'
      expect(() => assertIsError(value)).toThrow()
      expect(() => assertIsError(value)).toThrow(
        `Expected 'error' to be Error, but received ${value}`,
      )
    })

    it('should throw when passed a number', () => {
      const value = 42
      expect(() => assertIsError(value)).toThrow()
      expect(() => assertIsError(value)).toThrow(
        `Expected 'error' to be Error, but received ${value}`,
      )
    })

    it('should throw when passed a boolean', () => {
      expect(() => assertIsError(true)).toThrow()
      expect(() => assertIsError(true)).toThrow(
        "Expected 'error' to be Error, but received true",
      )

      expect(() => assertIsError(false)).toThrow()
      expect(() => assertIsError(false)).toThrow(
        "Expected 'error' to be Error, but received false",
      )
    })

    it('should throw when passed an array', () => {
      const value = [1, 2, 3]
      expect(() => assertIsError(value)).toThrow()
      expect(() => assertIsError(value)).toThrow(
        `Expected 'error' to be Error, but received ${value}`,
      )
    })

    it('should throw when passed a plain object', () => {
      const value = { message: 'looks like error', name: 'FakeError' }
      expect(() => assertIsError(value)).toThrow()
      expect(() => assertIsError(value)).toThrow(
        `Expected 'error' to be Error, but received [object Object]`,
      )
    })

    it('should throw when passed an error-like object that is not an Error instance', () => {
      const errorLike = {
        message: 'I look like an error',
        name: 'FakeError',
        stack: 'fake stack trace',
      }
      expect(() => assertIsError(errorLike)).toThrow()
      expect(() => assertIsError(errorLike)).toThrow(
        "Expected 'error' to be Error, but received [object Object]",
      )
    })

    it('should throw when passed a function', () => {
      const fn = () => 'error'
      expect(() => assertIsError(fn)).toThrow()
      expect(() => assertIsError(fn)).toThrow(
        'Expected \'error\' to be Error, but received () => "error"',
      )
    })
  })

  describe('AssertionError properties', () => {
    it('should throw an error with name "AssertionError"', () => {
      try {
        assertIsError('not an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('AssertionError')
      }
    })

    it('should throw an error that extends Error', () => {
      try {
        assertIsError(123)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('TypeScript type assertion behavior', () => {
    it('should narrow the type after successful assertion', () => {
      const unknownValue: unknown = new Error('test')

      // Before assertion, TypeScript doesn't know it's an Error
      // After assertion, TypeScript should know it's an Error
      assertIsError(unknownValue)

      // If this compiles and runs without error, the type assertion worked
      expect(unknownValue.message).toBe('test')
      expect(unknownValue.name).toBe('Error')
    })

    it('should work with custom Error types', () => {
      const unknownValue: unknown = new CustomError('custom test')

      assertIsError<CustomError>(unknownValue)

      // TypeScript should now know this is a CustomError
      expect(unknownValue.message).toBe('custom test')
      expect(unknownValue.name).toBe('CustomError')
    })
  })
})
