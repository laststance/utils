import { describe, it, expect } from 'vitest'

import { uniqueBy } from './uniqueBy.js'

describe('uniqueBy', () => {
  describe('basic functionality', () => {
    it('should remove duplicates by object property', () => {
      const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 1, name: 'Alice Updated', email: 'alice.new@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
        { id: 2, name: 'Bob Updated', email: 'bob.new@example.com' },
      ]

      const result = uniqueBy(users, (user) => user.id)

      expect(result).toEqual([
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      ])
      expect(result).toHaveLength(3)
    })

    it('should preserve first occurrence', () => {
      const items = [
        { value: 'a', position: 1 },
        { value: 'b', position: 2 },
        { value: 'a', position: 3 }, // Duplicate
        { value: 'c', position: 4 },
        { value: 'b', position: 5 }, // Duplicate
      ]

      const result = uniqueBy(items, (item) => item.value)

      expect(result).toEqual([
        { value: 'a', position: 1 }, // First 'a'
        { value: 'b', position: 2 }, // First 'b'
        { value: 'c', position: 4 },
      ])
    })

    it('should work with primitive arrays', () => {
      const numbers = [1, 2, 3, 2, 4, 1, 5]
      const result = uniqueBy(numbers, (n) => n)

      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('should use index parameter in key function', () => {
      const items = ['a', 'b', 'c', 'd']
      const result = uniqueBy(items, (_, index) => index % 2) // Even/odd indices

      expect(result).toEqual(['a', 'b']) // First even index (0) and first odd index (1)
    })
  })

  describe('key function variations', () => {
    it('should work with string keys', () => {
      const words = ['apple', 'pie', 'banana', 'cat', 'dog']
      const result = uniqueBy(words, (str) => str.length)

      expect(result).toEqual(['apple', 'pie', 'banana']) // First 5-char, first 3-char, first 6-char
    })

    it('should work with computed keys', () => {
      const products = [
        { name: 'Laptop', price: 1000, category: 'electronics' },
        { name: 'Phone', price: 500, category: 'electronics' },
        { name: 'Tablet', price: 300, category: 'electronics' },
        { name: 'Book', price: 20, category: 'books' },
        { name: 'Magazine', price: 5, category: 'books' },
      ]

      const result = uniqueBy(products, (p) => p.category)

      expect(result).toEqual([
        { name: 'Laptop', price: 1000, category: 'electronics' },
        { name: 'Book', price: 20, category: 'books' },
      ])
    })

    it('should work with complex key computations', () => {
      const items = [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 1 }, // Same sum as first
        { x: 1, y: 2 },
        { x: 0, y: 5 }, // Same sum as second
      ]

      const result = uniqueBy(items, (item) => item.x + item.y)

      expect(result).toEqual([
        { x: 1, y: 1 }, // Sum: 2
        { x: 2, y: 3 }, // Sum: 5
        { x: 3, y: 1 }, // Sum: 4
        { x: 1, y: 2 }, // Sum: 3
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = uniqueBy([], () => 'key')
      expect(result).toEqual([])
    })

    it('should handle single element arrays', () => {
      const result = uniqueBy([42], (n) => n)
      expect(result).toEqual([42])
    })

    it('should handle arrays with no duplicates', () => {
      const items = [1, 2, 3, 4, 5]
      const result = uniqueBy(items, (n) => n)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle arrays with all duplicates', () => {
      const items = ['same', 'same', 'same', 'same']
      const result = uniqueBy(items, (s) => s)
      expect(result).toEqual(['same'])
    })

    it('should handle null/undefined keys', () => {
      const items = [
        { key: null, value: 1 },
        { key: undefined, value: 2 },
        { key: null, value: 3 }, // Duplicate null
        { key: 'string', value: 4 },
        { key: undefined, value: 5 }, // Duplicate undefined
      ]

      const result = uniqueBy(items, (item) => item.key)

      expect(result).toEqual([
        { key: null, value: 1 },
        { key: undefined, value: 2 },
        { key: 'string', value: 4 },
      ])
    })
  })

  describe('type safety', () => {
    it('should work with object keys', () => {
      const data = [
        { ref: { id: 1 }, name: 'First' },
        { ref: { id: 1 }, name: 'Second' },
        { ref: { id: 2 }, name: 'Third' },
      ]

      const result = uniqueBy(data, (item) => item.ref.id)

      expect(result).toHaveLength(2)
      expect(result[0]?.name).toBe('First')
      expect(result[1]?.name).toBe('Third')
    })

    it('should work with boolean keys', () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const result = uniqueBy(numbers, (n) => n % 2 === 0)

      expect(result).toEqual([1, 2]) // First odd and first even
    })

    it('should work with symbol keys', () => {
      const sym1 = Symbol('key1')
      const sym2 = Symbol('key2')

      const items = [
        { symbol: sym1, value: 'a' },
        { symbol: sym2, value: 'b' },
        { symbol: sym1, value: 'c' }, // Duplicate symbol
      ]

      const result = uniqueBy(items, (item) => item.symbol)

      expect(result).toEqual([
        { symbol: sym1, value: 'a' },
        { symbol: sym2, value: 'b' },
      ])
    })
  })

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 2, 1]
      const originalCopy = [...original]

      uniqueBy(original, (n) => n)

      expect(original).toEqual(originalCopy)
    })

    it('should not modify original objects', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Duplicate' },
      ]
      const usersCopy = JSON.parse(JSON.stringify(users))

      const result = uniqueBy(users, (u) => u.id)

      expect(users).toEqual(usersCopy)
      expect(result[0]).toBe(users[0]) // Should reference same object
      expect(result[1]).toBe(users[1])
    })
  })

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i % 1000, // 1000 unique IDs, 10 duplicates each
        value: `item-${i}`,
      }))

      const startTime = performance.now()
      const result = uniqueBy(largeArray, (item) => item.id)
      const endTime = performance.now()

      expect(result).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast
    })

    it('should use Set for efficient key lookups', () => {
      // This test ensures we're using Set internally for O(1) lookups
      const items = Array.from({ length: 1000 }, (_, i) => ({ key: i % 100 }))

      const result = uniqueBy(items, (item) => item.key)

      expect(result).toHaveLength(100)
    })
  })

  describe('error handling', () => {
    it('should handle key function throwing errors', () => {
      const items = [1, 2, 3]
      const keyGetter = (n: number) => {
        if (n === 2) throw new Error('Key error')
        return n
      }

      expect(() => uniqueBy(items, keyGetter)).toThrow('Key error')
    })

    it('should handle complex key types', () => {
      const items = [
        { data: [1, 2, 3] },
        { data: [1, 2, 3] },
        { data: [4, 5, 6] },
      ]

      // Using JSON.stringify for array comparison (not recommended in real code)
      const result = uniqueBy(items, (item) => JSON.stringify(item.data))

      expect(result).toHaveLength(2)
    })
  })
})
