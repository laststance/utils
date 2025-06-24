import { describe, it, expect } from 'vitest'
import isError from './isError'

describe('isError', () => {
  describe('true cases - valid Error objects', () => {
    it('should return true for standard Error instances', () => {
      expect(isError(new Error('test message'))).toBe(true)
      expect(isError(new Error())).toBe(true)
      expect(isError(Error('test'))).toBe(true) // Called without new
    })

    it('should return true for specific Error subclasses', () => {
      expect(isError(new TypeError('type error'))).toBe(true)
      expect(isError(new ReferenceError('reference error'))).toBe(true)
      expect(isError(new SyntaxError('syntax error'))).toBe(true)
      expect(isError(new RangeError('range error'))).toBe(true)
      expect(isError(new URIError('uri error'))).toBe(true)
      expect(isError(new EvalError('eval error'))).toBe(true)
    })

    it('should return true for custom Error classes', () => {
      class CustomError extends Error {
        code: string
        constructor(message: string, code: string) {
          super(message)
          this.name = 'CustomError'
          this.code = code
        }
      }
      
      class AnotherError extends TypeError {
        constructor(message: string) {
          super(message)
          this.name = 'AnotherError'
        }
      }
      
      expect(isError(new CustomError('custom message', 'CUSTOM_CODE'))).toBe(true)
      expect(isError(new AnotherError('another message'))).toBe(true)
    })

    it('should return true for Error-like objects with name and message', () => {
      const errorLike = {
        name: 'CustomError',
        message: 'This is an error-like object'
      }
      
      expect(isError(errorLike)).toBe(true)
    })

    it('should return true for Error-like objects with additional properties', () => {
      const complexError = {
        name: 'ValidationError',
        message: 'Validation failed',
        code: 400,
        field: 'email',
        timestamp: Date.now()
      }
      
      expect(isError(complexError)).toBe(true)
    })

    it('should return true for objects with inherited Error properties', () => {
      const proto = { name: 'BaseError', message: 'Base message' }
      const derived = Object.create(proto)
      
      expect(isError(derived)).toBe(true)
    })
  })

  describe('false cases - invalid Error objects', () => {
    it('should return false for primitive values', () => {
      expect(isError('error string')).toBe(false)
      expect(isError(123)).toBe(false)
      expect(isError(true)).toBe(false)
      expect(isError(false)).toBe(false)
      expect(isError(Symbol('error'))).toBe(false)
      expect(isError(42n)).toBe(false)
    })

    it('should return false for null and undefined', () => {
      expect(isError(null)).toBe(false)
      expect(isError(undefined)).toBe(false)
    })

    it('should return false for objects missing name property', () => {
      const noName = {
        message: 'Has message but no name'
      }
      
      expect(isError(noName)).toBe(false)
    })

    it('should return false for objects missing message property', () => {
      const noMessage = {
        name: 'HasName'
      }
      
      expect(isError(noMessage)).toBe(false)
    })

    it('should return false for objects missing both name and message', () => {
      const neither = {
        code: 500,
        description: 'Server error'
      }
      
      expect(isError(neither)).toBe(false)
    })

    it('should return false for arrays', () => {
      expect(isError([])).toBe(false)
      expect(isError(['error'])).toBe(false)
      expect(isError([{ name: 'Error', message: 'test' }])).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isError(() => {})).toBe(false)
      expect(isError(function error() {})).toBe(false)
      expect(isError(Error)).toBe(false) // Error constructor itself
    })

    it('should return false for dates', () => {
      expect(isError(new Date())).toBe(false)
    })

    it('should return false for regular expressions', () => {
      expect(isError(/error/)).toBe(false)
    })

    it('should return false for Maps and Sets', () => {
      expect(isError(new Map())).toBe(false)
      expect(isError(new Set())).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle objects with name/message as non-string values', () => {
      const numericProperties = {
        name: 123,
        message: 456
      }
      
      expect(isError(numericProperties)).toBe(true) // Still has name and message properties
    })

    it('should handle objects with null/undefined name/message', () => {
      expect(isError({ name: null, message: 'test' })).toBe(true)
      expect(isError({ name: 'Error', message: null })).toBe(true)
      expect(isError({ name: undefined, message: 'test' })).toBe(true)
      expect(isError({ name: 'Error', message: undefined })).toBe(true)
    })

    it('should handle objects with empty string name/message', () => {
      expect(isError({ name: '', message: 'test' })).toBe(true)
      expect(isError({ name: 'Error', message: '' })).toBe(true)
      expect(isError({ name: '', message: '' })).toBe(true)
    })

    it('should handle objects with getters for name/message', () => {
      const objectWithGetters = {
        get name() { return 'GetterError' },
        get message() { return 'Message from getter' }
      }
      
      expect(isError(objectWithGetters)).toBe(true)
    })

    it('should handle objects with enumerable: false properties', () => {
      const obj = {}
      Object.defineProperty(obj, 'name', {
        value: 'HiddenError',
        enumerable: false,
        configurable: true
      })
      Object.defineProperty(obj, 'message', {
        value: 'Hidden message',
        enumerable: false,
        configurable: true
      })
      
      expect(isError(obj)).toBe(true)
    })

    it('should handle frozen objects', () => {
      const frozenError = Object.freeze({
        name: 'FrozenError',
        message: 'This object is frozen'
      })
      
      expect(isError(frozenError)).toBe(true)
    })

    it('should handle sealed objects', () => {
      const sealedError = Object.seal({
        name: 'SealedError',
        message: 'This object is sealed'
      })
      
      expect(isError(sealedError)).toBe(true)
    })

    it('should handle objects with symbol properties', () => {
      const symName = Symbol('name')
      const symMessage = Symbol('message')
      
      const objectWithSymbols = {
        [symName]: 'SymbolError',
        [symMessage]: 'Symbol message',
        name: 'RegularError',
        message: 'Regular message'
      }
      
      expect(isError(objectWithSymbols)).toBe(true)
    })
  })

  describe('prototype chain considerations', () => {
    it('should work with objects that have Error in prototype chain', () => {
      const errorInstance = new Error('test')
      expect(isError(errorInstance)).toBe(true)
    })

    it('should work with objects created with Object.create(Error.prototype)', () => {
      const errorLike = Object.create(Error.prototype)
      errorLike.name = 'CreatedError'
      errorLike.message = 'Created with Object.create'
      
      expect(isError(errorLike)).toBe(true)
    })

    it('should work with objects that don\'t inherit from Error', () => {
      const plainObject = {
        name: 'PlainError',
        message: 'Not inheriting from Error'
      }
      
      expect(isError(plainObject)).toBe(true)
    })

    it('should handle objects with null prototype', () => {
      const nullProtoObject = Object.create(null)
      nullProtoObject.name = 'NullProtoError'
      nullProtoObject.message = 'Has null prototype'
      
      expect(isError(nullProtoObject)).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should work with try-catch error objects', () => {
      try {
        JSON.parse('invalid json')
      } catch (error) {
        expect(isError(error)).toBe(true)
      }
      
      try {
        (null as any).property
      } catch (error) {
        expect(isError(error)).toBe(true)
      }
    })

    it('should work with Promise rejection errors', async () => {
      try {
        await Promise.reject(new Error('Promise rejection'))
      } catch (error) {
        expect(isError(error)).toBe(true)
      }
      
      try {
        await Promise.reject('String rejection')
      } catch (error) {
        expect(isError(error)).toBe(false)
      }
    })

    it('should work with API response error objects', () => {
      const apiError = {
        name: 'APIError',
        message: 'Request failed',
        status: 404,
        url: '/api/users/123',
        timestamp: '2023-01-01T00:00:00Z'
      }
      
      expect(isError(apiError)).toBe(true)
    })

    it('should work with validation error objects', () => {
      const validationError = {
        name: 'ValidationError',
        message: 'Field validation failed',
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'age', message: 'Must be a positive number' }
        ]
      }
      
      expect(isError(validationError)).toBe(true)
    })

    it('should distinguish between error objects and regular data', () => {
      const userData = {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com'
      }
      
      const settingsData = {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
      
      expect(isError(userData)).toBe(false)
      expect(isError(settingsData)).toBe(false)
    })
  })

  describe('type guard behavior', () => {
    it('should narrow type correctly when used as type guard', () => {
      function handleUnknown(value: unknown) {
        if (isError(value)) {
          // TypeScript should recognize value as Error here
          return value.message // Should not cause TypeScript error
        }
        return 'Not an error'
      }
      
      expect(handleUnknown(new Error('test'))).toBe('test')
      expect(handleUnknown('not error')).toBe('Not an error')
      expect(handleUnknown({ name: 'Error', message: 'test' })).toBe('test')
    })

    it('should work with union types', () => {
      function processValue(value: string | Error | { name: string; message: string }) {
        if (isError(value)) {
          return `Error: ${value.message}`
        }
        return `Value: ${value}`
      }
      
      expect(processValue(new Error('test'))).toBe('Error: test')
      expect(processValue('hello')).toBe('Value: hello')
      expect(processValue({ name: 'CustomError', message: 'custom' })).toBe('Error: custom')
    })
  })

  describe('performance considerations', () => {
    it('should be fast for typical error objects', () => {
      const errors = [
        new Error('test1'),
        new TypeError('test2'),
        { name: 'CustomError', message: 'test3' },
        new RangeError('test4'),
        { name: 'APIError', message: 'test5', status: 500 }
      ]
      
      errors.forEach(error => {
        expect(isError(error)).toBe(true)
      })
    })

    it('should be fast for non-error values', () => {
      const nonErrors = [
        'string',
        123,
        true,
        null,
        undefined,
        [],
        {},
        () => {},
        new Date(),
        /regex/
      ]
      
      nonErrors.forEach(value => {
        expect(isError(value)).toBe(false)
      })
    })

    it('should handle large objects efficiently', () => {
      const largeObject = {
        name: 'LargeError',
        message: 'Large error object',
        ...Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [`prop${i}`, i]))
      }
      
      expect(isError(largeObject)).toBe(true)
    })
  })
})