import { describe, it, expect } from 'vitest'
import { arraysEqual } from './arrayEqual'

describe('arraysEqual', () => {
  describe('basic equality', () => {
    it('should return true for identical primitive arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true)
      expect(arraysEqual([true, false, true], [true, false, true])).toBe(true)
    })

    it('should return false for different primitive arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false)
      expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false)
      expect(arraysEqual([true, false], [false, true])).toBe(false)
    })

    it('should return true for empty arrays', () => {
      expect(arraysEqual([], [])).toBe(true)
    })

    it('should return false for arrays of different lengths', () => {
      expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false)
      expect(arraysEqual([1, 2, 3], [1, 2])).toBe(false)
      expect(arraysEqual([], [1])).toBe(false)
      expect(arraysEqual([1], [])).toBe(false)
    })
  })

  describe('type variations', () => {
    it('should handle number arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(arraysEqual([1.5, 2.7, 3.14], [1.5, 2.7, 3.14])).toBe(true)
      expect(arraysEqual([0, -1, Infinity], [0, -1, Infinity])).toBe(true)
      expect(arraysEqual([NaN], [NaN])).toBe(false) // NaN !== NaN
    })

    it('should handle string arrays', () => {
      expect(arraysEqual(['hello', 'world'], ['hello', 'world'])).toBe(true)
      expect(arraysEqual(['', 'test', ''], ['', 'test', ''])).toBe(true)
      expect(arraysEqual(['Hello'], ['hello'])).toBe(false) // Case sensitive
    })

    it('should handle boolean arrays', () => {
      expect(arraysEqual([true, false, true], [true, false, true])).toBe(true)
      expect(arraysEqual([false], [true])).toBe(false)
    })

    it('should handle mixed type arrays', () => {
      expect(arraysEqual([1, 'hello', true], [1, 'hello', true])).toBe(true)
      expect(arraysEqual([1, 'hello', true], [1, 'hello', false])).toBe(false)
      expect(arraysEqual([0, '', false], [0, '', false])).toBe(true)
    })

    it('should handle null and undefined values', () => {
      expect(arraysEqual([null, undefined], [null, undefined])).toBe(true)
      expect(arraysEqual([null], [undefined])).toBe(false)
      expect(arraysEqual([null, null], [null, undefined])).toBe(false)
    })
  })

  describe('special values', () => {
    it('should handle zero values correctly', () => {
      expect(arraysEqual([0, -0], [0, -0])).toBe(true)
      expect(arraysEqual([0], [-0])).toBe(true) // 0 === -0 in JavaScript
    })

    it('should handle NaN values', () => {
      expect(arraysEqual([NaN], [NaN])).toBe(false) // NaN !== NaN
      expect(arraysEqual([1, NaN, 3], [1, NaN, 3])).toBe(false)
    })

    it('should handle Infinity values', () => {
      expect(arraysEqual([Infinity, -Infinity], [Infinity, -Infinity])).toBe(true)
      expect(arraysEqual([Infinity], [-Infinity])).toBe(false)
    })

    it('should handle symbol values', () => {
      const sym1 = Symbol('test')
      const sym2 = Symbol('test')
      
      expect(arraysEqual([sym1], [sym1])).toBe(true) // Same symbol reference
      expect(arraysEqual([sym1], [sym2])).toBe(false) // Different symbols
    })

    it('should handle bigint values', () => {
      expect(arraysEqual([1n, 2n], [1n, 2n])).toBe(true)
      expect(arraysEqual([1n], [1 as any])).toBe(false) // bigint !== number
      expect(arraysEqual([BigInt(123)], [123n])).toBe(true)
    })
  })

  describe('object references (shallow comparison)', () => {
    it('should return true for same object references', () => {
      const obj1 = { x: 1 }
      const obj2 = { y: 2 }
      
      expect(arraysEqual([obj1, obj2], [obj1, obj2])).toBe(true)
    })

    it('should return false for different object references with same content', () => {
      const obj1 = { x: 1 }
      const obj2 = { x: 1 } // Different reference, same content
      
      expect(arraysEqual([obj1], [obj2])).toBe(false)
    })

    it('should handle arrays containing nested arrays by reference', () => {
      const nestedArray1 = [1, 2]
      const nestedArray2 = [3, 4]
      
      expect(arraysEqual([nestedArray1, nestedArray2], [nestedArray1, nestedArray2])).toBe(true)
      expect(arraysEqual([[1, 2]], [[1, 2]])).toBe(false) // Different array references
    })

    it('should handle functions by reference', () => {
      const fn1 = () => 'test'
      const fn2 = () => 'test'
      
      expect(arraysEqual([fn1], [fn1])).toBe(true) // Same function reference
      expect(arraysEqual([fn1], [fn2])).toBe(false) // Different function references
    })

    it('should handle Date objects by reference', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-01')
      
      expect(arraysEqual([date1], [date1])).toBe(true) // Same Date reference
      expect(arraysEqual([date1], [date2])).toBe(false) // Different Date references
    })

    it('should handle RegExp objects by reference', () => {
      const regex1 = /test/i
      const regex2 = /test/i
      
      expect(arraysEqual([regex1], [regex1])).toBe(true) // Same RegExp reference
      expect(arraysEqual([regex1], [regex2])).toBe(false) // Different RegExp references
    })
  })

  describe('complex scenarios', () => {
    it('should handle arrays with complex mixed content', () => {
      const obj = { name: 'test' }
      const arr = [1, 2]
      const fn = () => 'hello'
      
      const complex1 = [1, 'hello', obj, arr, fn, null, undefined, true]
      const complex2 = [1, 'hello', obj, arr, fn, null, undefined, true]
      
      expect(arraysEqual(complex1, complex2)).toBe(true)
    })

    it('should handle large arrays efficiently', () => {
      const large1 = Array.from({ length: 10000 }, (_, i) => i)
      const large2 = Array.from({ length: 10000 }, (_, i) => i)
      const large3 = Array.from({ length: 10000 }, (_, i) => i === 9999 ? i + 1 : i)
      
      expect(arraysEqual(large1, large2)).toBe(true)
      expect(arraysEqual(large1, large3)).toBe(false)
    })

    it('should handle sparse arrays', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse1 = [1, , 3] // Has empty slot at index 1
      // eslint-disable-next-line no-sparse-arrays
      const sparse2 = [1, , 3] // Has empty slot at index 1
      const sparse3 = [1, undefined, 3] // Has undefined at index 1
      
      expect(arraysEqual(sparse1, sparse2)).toBe(true)
      // Note: arraysEqual does shallow comparison using a[i] !== b[i]
      // Both sparse1[1] and sparse3[1] return undefined, so they're equal
      expect(arraysEqual(sparse1, sparse3)).toBe(true) // Both return undefined when accessed
    })

    it('should handle arrays with prototype pollution attempts', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3]
      
      // Add property to prototype (should not affect comparison)
      ;(Array.prototype as any).polluted = 'value'
      
      expect(arraysEqual(arr1, arr2)).toBe(true)
      
      // Cleanup
      delete (Array.prototype as any).polluted
    })
  })

  describe('edge cases', () => {
    it('should handle same array reference', () => {
      const arr = [1, 2, 3]
      expect(arraysEqual(arr, arr)).toBe(true)
    })

    it('should handle arrays with length property modified', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3, 4]
      arr2.length = 3 // Truncate array
      
      expect(arraysEqual(arr1, arr2)).toBe(true)
    })

    it('should handle frozen arrays', () => {
      const frozen1 = Object.freeze([1, 2, 3])
      const frozen2 = Object.freeze([1, 2, 3])
      
      expect(arraysEqual(frozen1 as number[], frozen2 as number[])).toBe(true)
    })

    it('should handle sealed arrays', () => {
      const sealed1 = Object.seal([1, 2, 3])
      const sealed2 = Object.seal([1, 2, 3])
      
      expect(arraysEqual(sealed1, sealed2)).toBe(true)
    })

    it('should handle arrays with non-numeric properties', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3]
      
      ;(arr1 as any).customProp = 'test'
      ;(arr2 as any).customProp = 'test'
      
      // Should still compare based on indexed elements only
      expect(arraysEqual(arr1, arr2)).toBe(true)
    })
  })

  describe('performance considerations', () => {
    it('should short-circuit on length difference', () => {
      const longArray = Array.from({ length: 10000 }, (_, i) => i)
      const shortArray = [1, 2, 3]
      
      // This should be fast because it returns false immediately on length check
      expect(arraysEqual(longArray, shortArray)).toBe(false)
    })

    it('should short-circuit on first difference', () => {
      const arr1 = Array.from({ length: 10000 }, (_, i) => i)
      const arr2 = Array.from({ length: 10000 }, (_, i) => i === 0 ? 999 : i)
      
      // Should return false quickly on first element difference
      expect(arraysEqual(arr1, arr2)).toBe(false)
    })

    it('should handle arrays with mostly identical elements', () => {
      const arr1 = Array.from({ length: 1000 }, () => 'same')
      const arr2 = Array.from({ length: 1000 }, () => 'same')
      
      expect(arraysEqual(arr1, arr2)).toBe(true)
    })
  })

  describe('type safety and generic behavior', () => {
    it('should work with typed arrays (number[])', () => {
      const numbers1: number[] = [1, 2, 3]
      const numbers2: number[] = [1, 2, 3]
      const numbers3: number[] = [1, 2, 4]
      
      expect(arraysEqual(numbers1, numbers2)).toBe(true)
      expect(arraysEqual(numbers1, numbers3)).toBe(false)
    })

    it('should work with typed arrays (string[])', () => {
      const strings1: string[] = ['a', 'b', 'c']
      const strings2: string[] = ['a', 'b', 'c']
      const strings3: string[] = ['a', 'b', 'd']
      
      expect(arraysEqual(strings1, strings2)).toBe(true)
      expect(arraysEqual(strings1, strings3)).toBe(false)
    })

    it('should work with union types', () => {
      const mixed1: (string | number)[] = [1, 'hello', 2, 'world']
      const mixed2: (string | number)[] = [1, 'hello', 2, 'world']
      const mixed3: (string | number)[] = [1, 'hello', 3, 'world']
      
      expect(arraysEqual(mixed1, mixed2)).toBe(true)
      expect(arraysEqual(mixed1, mixed3)).toBe(false)
    })

    it('should work with object types', () => {
      interface TestObj {
        id: number
        name: string
      }
      
      const obj1: TestObj = { id: 1, name: 'test' }
      const obj2: TestObj = { id: 1, name: 'test' } // Different reference
      
      const objs1: TestObj[] = [obj1]
      const objs2: TestObj[] = [obj1] // Same reference
      const objs3: TestObj[] = [obj2] // Different reference
      
      expect(arraysEqual(objs1, objs2)).toBe(true)
      expect(arraysEqual(objs1, objs3)).toBe(false)
    })
  })
})