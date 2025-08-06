import { describe, it, expect } from 'vitest'

import { groupBy } from './groupBy.js'

describe('groupBy', () => {
  describe('basic functionality', () => {
    it('should group objects by a property', () => {
      const users = [
        { id: 1, role: 'admin', name: 'Alice' },
        { id: 2, role: 'user', name: 'Bob' },
        { id: 3, role: 'admin', name: 'Charlie' },
        { id: 4, role: 'user', name: 'Diana' },
      ]

      const result = groupBy(users, (user) => user.role)

      expect(result).toEqual({
        admin: [
          { id: 1, role: 'admin', name: 'Alice' },
          { id: 3, role: 'admin', name: 'Charlie' },
        ],
        user: [
          { id: 2, role: 'user', name: 'Bob' },
          { id: 4, role: 'user', name: 'Diana' },
        ],
      })
    })

    it('should group numbers by even/odd', () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const result = groupBy(numbers, (n) => (n % 2 === 0 ? 'even' : 'odd'))

      expect(result).toEqual({
        odd: [1, 3, 5],
        even: [2, 4, 6],
      })
    })

    it('should group strings by length', () => {
      const words = ['apple', 'pie', 'banana', 'cat', 'dog']
      const result = groupBy(words, (str) => str.length)

      expect(result).toEqual({
        3: ['pie', 'cat', 'dog'],
        5: ['apple'],
        6: ['banana'],
      })
    })

    it('should use index parameter in key function', () => {
      const items = ['a', 'b', 'c', 'd']
      const result = groupBy(items, (_, index) =>
        index < 2 ? 'first-half' : 'second-half',
      )

      expect(result).toEqual({
        'first-half': ['a', 'b'],
        'second-half': ['c', 'd'],
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = groupBy([], () => 'group')
      expect(result).toEqual({})
    })

    it('should handle single element arrays', () => {
      const result = groupBy([42], (n) => (n > 40 ? 'large' : 'small'))
      expect(result).toEqual({
        large: [42],
      })
    })

    it('should handle all items mapping to same key', () => {
      const result = groupBy([1, 2, 3, 4], () => 'same')
      expect(result).toEqual({
        same: [1, 2, 3, 4],
      })
    })

    it('should handle each item mapping to unique key', () => {
      const result = groupBy([1, 2, 3], (_, index) => `item-${index}`)
      expect(result).toEqual({
        'item-0': [1],
        'item-1': [2],
        'item-2': [3],
      })
    })
  })

  describe('type safety', () => {
    it('should work with string keys', () => {
      const items = ['apple', 'banana', 'apricot', 'cherry']
      const result = groupBy(items, (str) => str.charAt(0))

      expect(result).toEqual({
        a: ['apple', 'apricot'],
        b: ['banana'],
        c: ['cherry'],
      })

      // TypeScript should infer Record<string, string[]>
      expect(typeof result).toBe('object')
      expect(Array.isArray(result.a)).toBe(true)
    })

    it('should work with number keys', () => {
      const items = [10, 20, 15, 25, 30]
      const result = groupBy(items, (n) => Math.floor(n / 10))

      expect(result).toEqual({
        1: [10, 15],
        2: [20, 25],
        3: [30],
      })
    })

    it('should work with symbol keys', () => {
      const sym1 = Symbol('group1')
      const sym2 = Symbol('group2')

      const items = [1, 2, 3, 4]
      const result = groupBy(items, (n) => (n % 2 === 0 ? sym1 : sym2))

      expect(result[sym1]).toEqual([2, 4])
      expect(result[sym2]).toEqual([1, 3])
    })
  })

  describe('complex data types', () => {
    it('should group objects with nested properties', () => {
      const data = [
        { user: { department: 'engineering' }, score: 95 },
        { user: { department: 'marketing' }, score: 87 },
        { user: { department: 'engineering' }, score: 92 },
        { user: { department: 'sales' }, score: 88 },
      ]

      const result = groupBy(data, (item) => item.user.department)

      expect(result.engineering).toHaveLength(2)
      expect(result.marketing).toHaveLength(1)
      expect(result.sales).toHaveLength(1)
    })

    it('should group by computed properties', () => {
      const products = [
        { name: 'Laptop', price: 1200 },
        { name: 'Phone', price: 800 },
        { name: 'Tablet', price: 400 },
        { name: 'Monitor', price: 300 },
      ]

      const result = groupBy(products, (p) => {
        if (p.price >= 1000) return 'expensive'
        if (p.price >= 500) return 'moderate'
        return 'cheap'
      })

      expect(result.expensive).toEqual([{ name: 'Laptop', price: 1200 }])
      expect(result.moderate).toEqual([{ name: 'Phone', price: 800 }])
      expect(result.cheap).toEqual([
        { name: 'Tablet', price: 400 },
        { name: 'Monitor', price: 300 },
      ])
    })
  })

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const originalCopy = [...original]

      groupBy(original, (n) => (n % 2 === 0 ? 'even' : 'odd'))

      expect(original).toEqual(originalCopy)
    })

    it('should not modify original objects in the array', () => {
      const users = [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ]
      const usersCopy = JSON.parse(JSON.stringify(users))

      const result = groupBy(users, (u) => u.role)

      expect(users).toEqual(usersCopy)
      expect(result.admin?.[0]).toBe(users[0]) // Should reference same object
      expect(result.user?.[0]).toBe(users[1])
    })
  })

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        category: `category-${i % 100}`,
      }))

      const startTime = performance.now()
      const result = groupBy(largeArray, (item) => item.category)
      const endTime = performance.now()

      expect(Object.keys(result)).toHaveLength(100)
      expect(result['category-0']).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(100) // Should be reasonably fast
    })
  })

  describe('error handling', () => {
    it('should handle key function throwing errors', () => {
      const items = [1, 2, 3]
      const keyGetter = (n: number) => {
        if (n === 2) throw new Error('Key error')
        return n.toString()
      }

      expect(() => groupBy(items, keyGetter)).toThrow('Key error')
    })

    it('should handle null/undefined values in array', () => {
      const items = [1, null, undefined, 2, null]
      const result = groupBy(items, (item) =>
        item === null ? 'null' : item === undefined ? 'undefined' : 'number',
      )

      expect(result).toEqual({
        number: [1, 2],
        null: [null, null],
        undefined: [undefined],
      })
    })
  })
})
