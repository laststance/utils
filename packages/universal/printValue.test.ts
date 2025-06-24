import { describe, it, expect } from 'vitest'
import printValue from './printValue'

describe('printValue', () => {
  describe('primitive values', () => {
    it('should handle null', () => {
      expect(printValue(null)).toBe('null')
    })

    it('should handle boolean values', () => {
      expect(printValue(true)).toBe('true')
      expect(printValue(false)).toBe('false')
    })

    it('should handle numbers', () => {
      expect(printValue(123)).toBe('123')
      expect(printValue(0)).toBe('0')
      expect(printValue(-456)).toBe('-456')
      expect(printValue(3.14)).toBe('3.14')
    })

    it('should handle special number values', () => {
      expect(printValue(NaN)).toBe('NaN')
      expect(printValue(Infinity)).toBe('Infinity')
      expect(printValue(-Infinity)).toBe('-Infinity')
      expect(printValue(-0)).toBe('-0')
    })

    it('should handle strings without quotes by default', () => {
      expect(printValue('hello')).toBe('hello')
      expect(printValue('')).toBe('')
      expect(printValue('with spaces')).toBe('with spaces')
    })

    it('should quote strings when quoteStrings is true', () => {
      expect(printValue('hello', true)).toBe('"hello"')
      expect(printValue('', true)).toBe('""')
      expect(printValue('with spaces', true)).toBe('"with spaces"')
    })
  })

  describe('functions', () => {
    it('should handle named functions', () => {
      function namedFunction() {}
      expect(printValue(namedFunction)).toBe('[Function namedFunction]')
    })

    it('should handle anonymous functions', () => {
      const anonymousFunction = function() {}
      expect(printValue(anonymousFunction)).toBe('[Function anonymousFunction]')
      
      const arrowFunction = () => {}
      expect(printValue(arrowFunction)).toBe('[Function arrowFunction]')
    })
  })

  describe('symbols', () => {
    it('should handle symbols', () => {
      const sym1 = Symbol()
      expect(printValue(sym1)).toBe('Symbol()')
      
      const sym2 = Symbol('test')
      expect(printValue(sym2)).toBe('Symbol(test)')
      
      const sym3 = Symbol('description with spaces')
      expect(printValue(sym3)).toBe('Symbol(description with spaces)')
    })
  })

  describe('dates', () => {
    it('should handle valid dates', () => {
      const date = new Date('2023-12-25T10:30:00.000Z')
      expect(printValue(date)).toBe('2023-12-25T10:30:00.000Z')
    })

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid')
      expect(printValue(invalidDate)).toBe('Invalid Date')
    })
  })

  describe('errors', () => {
    it('should handle Error objects', () => {
      const error = new Error('test message')
      expect(printValue(error)).toBe('[Error: test message]')
    })

    it('should handle different error types', () => {
      const typeError = new TypeError('type error')
      expect(printValue(typeError)).toBe('[TypeError: type error]')
      
      const rangeError = new RangeError('range error')
      expect(printValue(rangeError)).toBe('[RangeError: range error]')
    })

    it('should handle errors without message', () => {
      const error = new Error()
      expect(printValue(error)).toBe('[Error]')
    })
  })

  describe('regular expressions', () => {
    it('should handle RegExp objects', () => {
      const regex1 = /test/g
      expect(printValue(regex1)).toBe('/test/g')
      
      const regex2 = new RegExp('pattern', 'i')
      expect(printValue(regex2)).toBe('/pattern/i')
      
      const regex3 = /[a-z]+/
      expect(printValue(regex3)).toBe('/[a-z]+/')
    })
  })

  describe('objects and arrays', () => {
    it('should handle simple objects', () => {
      const obj = { a: 1, b: 2 }
      const result = printValue(obj)
      expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}')
    })

    it('should handle arrays', () => {
      const arr = [1, 2, 3]
      const result = printValue(arr)
      expect(result).toBe('[\n  1,\n  2,\n  3\n]')
    })

    it('should handle nested objects', () => {
      const nested = { user: { name: 'Alice', age: 30 } }
      const result = printValue(nested)
      expect(result).toBe('{\n  "user": {\n    "name": "Alice",\n    "age": 30\n  }\n}')
    })

    it('should handle objects with special values', () => {
      const obj = {
        func: function test() {},
        date: new Date('2023-12-25T10:30:00.000Z'),
        error: new Error('test'),
        regex: /test/g,
        sym: Symbol('test')
      }
      const result = printValue(obj)
      expect(result).toContain('"func": "[Function test]"')
      expect(result).toContain('"date": "2023-12-25T10:30:00.000Z"')
      expect(result).toContain('"error": "[Error: test]"')
      expect(result).toContain('"regex": "/test/g"')
      expect(result).toContain('"sym": "Symbol(test)"')
    })

    it('should handle empty objects and arrays', () => {
      expect(printValue({})).toBe('{}')
      expect(printValue([])).toBe('[]')
    })
  })

  describe('quoteStrings parameter', () => {
    it('should affect strings within objects when quoteStrings is true', () => {
      const obj = { message: 'hello world' }
      const result = printValue(obj, true)
      expect(result).toBe('{\n  "message": "\\"hello world\\""\n}')
    })

    it('should not affect non-string values when quoteStrings is true', () => {
      const obj = { number: 42, bool: true, nil: null }
      const result = printValue(obj, true)
      expect(result).toBe('{\n  "number": 42,\n  "bool": true,\n  "nil": null\n}')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined', () => {
      const result = printValue(undefined)
      expect(result).toBe('undefined')
    })

    it('should handle mixed arrays', () => {
      const mixed = [1, 'string', true, null, undefined, { key: 'value' }]
      const result = printValue(mixed)
      expect(result).toContain('1')
      expect(result).toContain('"string"')
      expect(result).toContain('true')
      expect(result).toContain('null')
      expect(result).toContain('undefined')
      expect(result).toContain('"key": "value"')
    })
  })
})