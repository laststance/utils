import { describe, it, expect } from 'vitest'

import { chunk } from './chunk.js'

describe('chunk', () => {
  describe('basic functionality', () => {
    it('should split array into equal chunks', () => {
      const result = chunk([1, 2, 3, 4, 5, 6], 2)
      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ])
    })

    it('should handle arrays that divide evenly', () => {
      const result = chunk(['a', 'b', 'c', 'd', 'e', 'f'], 3)
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
      ])
    })

    it('should handle arrays that do not divide evenly', () => {
      const result = chunk([1, 2, 3, 4, 5, 6, 7], 3)
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    })

    it('should handle single element chunks', () => {
      const result = chunk([1, 2, 3], 1)
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should handle chunk size larger than array', () => {
      const result = chunk([1, 2, 3], 5)
      expect(result).toEqual([[1, 2, 3]])
    })

    it('should handle chunk size equal to array length', () => {
      const result = chunk([1, 2, 3, 4], 4)
      expect(result).toEqual([[1, 2, 3, 4]])
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = chunk([], 2)
      expect(result).toEqual([])
    })

    it('should handle single element arrays', () => {
      const result = chunk([42], 2)
      expect(result).toEqual([[42]])
    })

    it('should handle large chunk sizes', () => {
      const result = chunk([1, 2], 100)
      expect(result).toEqual([[1, 2]])
    })
  })

  describe('error handling', () => {
    it('should throw error for zero size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow(
        'Chunk size must be a positive integer, received: 0',
      )
    })

    it('should throw error for negative size', () => {
      expect(() => chunk([1, 2, 3], -1)).toThrow(
        'Chunk size must be a positive integer, received: -1',
      )
    })

    it('should throw error for non-integer size', () => {
      expect(() => chunk([1, 2, 3], 2.5)).toThrow(
        'Chunk size must be a positive integer, received: 2.5',
      )
    })

    it('should throw error for NaN size', () => {
      expect(() => chunk([1, 2, 3], NaN)).toThrow(
        'Chunk size must be a positive integer, received: NaN',
      )
    })

    it('should throw error for Infinity size', () => {
      expect(() => chunk([1, 2, 3], Infinity)).toThrow(
        'Chunk size must be a positive integer, received: Infinity',
      )
    })
  })

  describe('type safety', () => {
    it('should work with different data types', () => {
      const strings = chunk(['apple', 'banana', 'cherry', 'date'], 2)
      expect(strings).toEqual([
        ['apple', 'banana'],
        ['cherry', 'date'],
      ])

      const objects = chunk(
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' },
        ],
        2,
      )
      expect(objects).toEqual([
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        [{ id: 3, name: 'Charlie' }],
      ])

      const mixed = chunk([1, 'two', { three: 3 }, [4]], 2)
      expect(mixed).toEqual([
        [1, 'two'],
        [{ three: 3 }, [4]],
      ])
    })

    it('should preserve array element types', () => {
      interface User {
        id: number
        name: string
      }

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]

      const result = chunk(users, 2)

      // TypeScript should infer User[][]
      expect(result[0]?.[0]?.id).toBe(1)
      expect(result[0]?.[0]?.name).toBe('Alice')
    })
  })

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const originalCopy = [...original]

      chunk(original, 2)

      expect(original).toEqual(originalCopy)
    })

    it('should create new arrays for chunks', () => {
      const original = [1, 2, 3, 4]
      const result = chunk(original, 2)

      // Modifying a chunk should not affect the original
      result[0]?.push(999)
      expect(original).toEqual([1, 2, 3, 4])
    })

    it('should not modify original objects in chunks', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]
      const usersCopy = JSON.parse(JSON.stringify(users))

      const result = chunk(users, 2)

      expect(users).toEqual(usersCopy)
      expect(result[0]?.[0]).toBe(users[0]) // Should reference same object
    })
  })

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i)

      const startTime = performance.now()
      const result = chunk(largeArray, 100)
      const endTime = performance.now()

      expect(result).toHaveLength(100)
      expect(result[0]).toHaveLength(100)
      expect(result[99]).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast
    })

    it('should handle many small chunks efficiently', () => {
      const array = Array.from({ length: 1000 }, (_, i) => i)

      const startTime = performance.now()
      const result = chunk(array, 1)
      const endTime = performance.now()

      expect(result).toHaveLength(1000)
      expect(result[0]).toEqual([0])
      expect(result[999]).toEqual([999])
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast
    })
  })

  describe('practical use cases', () => {
    it('should work for pagination scenarios', () => {
      const items = Array.from({ length: 25 }, (_, i) => `item-${i}`)
      const pageSize = 10
      const pages = chunk(items, pageSize)

      expect(pages).toHaveLength(3)
      expect(pages[0]).toHaveLength(10)
      expect(pages[1]).toHaveLength(10)
      expect(pages[2]).toHaveLength(5) // Last page with remaining items
    })

    it('should work for batch processing scenarios', () => {
      const tasks = Array.from({ length: 17 }, (_, i) => `task-${i}`)
      const batchSize = 5
      const batches = chunk(tasks, batchSize)

      expect(batches).toHaveLength(4)
      expect(batches[0]).toHaveLength(5)
      expect(batches[1]).toHaveLength(5)
      expect(batches[2]).toHaveLength(5)
      expect(batches[3]).toHaveLength(2) // Last batch with remaining items
    })

    it('should work for creating matrices', () => {
      const flatMatrix = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const matrix = chunk(flatMatrix, 3)

      expect(matrix).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
    })
  })

  describe('readonly arrays', () => {
    it('should work with readonly arrays', () => {
      const readonlyArray: readonly number[] = [1, 2, 3, 4, 5]
      const result = chunk(readonlyArray, 2)

      expect(result).toEqual([[1, 2], [3, 4], [5]])
    })
  })
})
