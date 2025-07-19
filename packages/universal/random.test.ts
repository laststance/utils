import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { randomNumber, randomNumberRange, randomInArray } from './random.js'

describe('random utilities', () => {
  describe('randomNumber', () => {
    it('should return numbers between 1 and the specified number (inclusive)', () => {
      // Run test multiple times to check range
      for (let i = 0; i < 100; i++) {
        const result = randomNumber(6)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should return 1 when input is 1', () => {
      // With number = 1, Math.floor(Math.random() * 1) + 1 should always be 1
      for (let i = 0; i < 50; i++) {
        expect(randomNumber(1)).toBe(1)
      }
    })

    it('should handle large numbers', () => {
      const largeNumber = 1000000
      for (let i = 0; i < 50; i++) {
        const result = randomNumber(largeNumber)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(largeNumber)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should produce different values over multiple calls', () => {
      const results = new Set()
      for (let i = 0; i < 100; i++) {
        results.add(randomNumber(100))
      }
      // Should have many different values (at least 50% unique)
      expect(results.size).toBeGreaterThan(50)
    })

    it('should work with decimal inputs (uses decimal directly)', () => {
      // Function uses decimal directly: Math.floor(Math.random() * 6.7) + 1
      for (let i = 0; i < 50; i++) {
        const result = randomNumber(6.7) // Can return 1-7 because Math.floor(6.7 * 0.999) + 1 = 7
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(7)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    describe('edge cases', () => {
      it('should handle zero input', () => {
        // Math.floor(Math.random() * 0) + 1 should always be 1
        for (let i = 0; i < 10; i++) {
          expect(randomNumber(0)).toBe(1)
        }
      })

      it('should handle negative input', () => {
        // Math.floor(Math.random() * negative) + 1 might behave unexpectedly
        const result = randomNumber(-5)
        expect(typeof result).toBe('number')
        // The exact behavior with negative numbers may vary
      })

      it('should handle very small positive numbers', () => {
        for (let i = 0; i < 10; i++) {
          const result = randomNumber(0.1)
          expect(result).toBe(1) // Math.floor(Math.random() * 0.1) + 1 = 1
        }
      })
    })

    describe('with mocked Math.random', () => {
      beforeEach(() => {
        vi.spyOn(Math, 'random')
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should use Math.random correctly', () => {
        vi.mocked(Math.random).mockReturnValue(0.5)

        const result = randomNumber(10)
        expect(Math.random).toHaveBeenCalled()
        expect(result).toBe(6) // Math.floor(0.5 * 10) + 1 = 5 + 1 = 6
      })

      it('should handle minimum Math.random value (0)', () => {
        vi.mocked(Math.random).mockReturnValue(0)

        const result = randomNumber(10)
        expect(result).toBe(1) // Math.floor(0 * 10) + 1 = 0 + 1 = 1
      })

      it('should handle maximum Math.random value (0.999...)', () => {
        vi.mocked(Math.random).mockReturnValue(0.9999999)

        const result = randomNumber(10)
        expect(result).toBe(10) // Math.floor(0.9999999 * 10) + 1 = 9 + 1 = 10
      })
    })
  })

  describe('randomNumberRange', () => {
    it('should return numbers within the specified range (inclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomNumberRange(5, 15)
        expect(result).toBeGreaterThanOrEqual(5)
        expect(result).toBeLessThanOrEqual(15)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should work with negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomNumberRange(-10, -5)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-5)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should work with ranges crossing zero', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomNumberRange(-3, 3)
        expect(result).toBeGreaterThanOrEqual(-3)
        expect(result).toBeLessThanOrEqual(3)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should return the same value when min equals max', () => {
      for (let i = 0; i < 50; i++) {
        expect(randomNumberRange(7, 7)).toBe(7)
        expect(randomNumberRange(-5, -5)).toBe(-5)
        expect(randomNumberRange(0, 0)).toBe(0)
      }
    })

    it('should produce different values over multiple calls', () => {
      const results = new Set()
      for (let i = 0; i < 100; i++) {
        results.add(randomNumberRange(1, 50))
      }
      // Should have many different values
      expect(results.size).toBeGreaterThan(25)
    })

    it('should handle large ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomNumberRange(1000, 2000)
        expect(result).toBeGreaterThanOrEqual(1000)
        expect(result).toBeLessThanOrEqual(2000)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    describe('edge cases', () => {
      it('should handle reversed parameters (max < min)', () => {
        // This might produce unexpected results, but should not crash
        const result = randomNumberRange(10, 5)
        expect(typeof result).toBe('number')
      })

      it('should handle decimal inputs', () => {
        for (let i = 0; i < 50; i++) {
          const result = randomNumberRange(1.5, 5.7)
          // Function uses decimals directly: Math.floor(Math.random() * (5.7 - 1.5 + 1)) + 1.5
          // = Math.floor(Math.random() * 5.2) + 1.5, can return 1.5, 2.5, 3.5, 4.5, 5.5, 6.5
          expect(result).toBeGreaterThanOrEqual(1.5)
          expect(result).toBeLessThanOrEqual(6.5)
          expect(result % 1).toBe(0.5) // Should always end in .5
        }
      })

      it('should handle very large numbers', () => {
        const result = randomNumberRange(
          Number.MAX_SAFE_INTEGER - 10,
          Number.MAX_SAFE_INTEGER,
        )
        expect(typeof result).toBe('number')
        expect(Number.isInteger(result)).toBe(true)
      })
    })

    describe('with mocked Math.random', () => {
      beforeEach(() => {
        vi.spyOn(Math, 'random')
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should use Math.random correctly for range calculation', () => {
        vi.mocked(Math.random).mockReturnValue(0.5)

        const result = randomNumberRange(10, 20)
        expect(Math.random).toHaveBeenCalled()
        expect(result).toBe(15) // Math.floor(0.5 * (20-10+1)) + 10 = 5 + 10 = 15
      })

      it('should return min value when Math.random returns 0', () => {
        vi.mocked(Math.random).mockReturnValue(0)

        const result = randomNumberRange(10, 20)
        expect(result).toBe(10)
      })

      it('should return max value when Math.random returns 0.999...', () => {
        vi.mocked(Math.random).mockReturnValue(0.9999999)

        const result = randomNumberRange(10, 20)
        expect(result).toBe(20)
      })
    })
  })

  describe('randomInArray', () => {
    it('should return an element from the array', () => {
      const array = ['apple', 'banana', 'cherry', 'date']

      for (let i = 0; i < 100; i++) {
        const result = randomInArray(array)
        expect(array.includes(result)).toBe(true)
      }
    })

    it('should work with different array types', () => {
      const numbers = [1, 2, 3, 4, 5]
      const booleans = [true, false]
      const mixed = [1, 'hello', true, null, { key: 'value' }]

      for (let i = 0; i < 50; i++) {
        expect(numbers.includes(randomInArray(numbers))).toBe(true)
        expect(booleans.includes(randomInArray(booleans))).toBe(true)
        expect(mixed.includes(randomInArray(mixed))).toBe(true)
      }
    })

    it('should return the only element for single-element arrays', () => {
      const singleElement = ['only']

      for (let i = 0; i < 50; i++) {
        expect(randomInArray(singleElement)).toBe('only')
      }
    })

    it('should produce different values over multiple calls for larger arrays', () => {
      const largeArray = Array.from({ length: 50 }, (_, i) => i)
      const results = new Set()

      for (let i = 0; i < 100; i++) {
        results.add(randomInArray(largeArray))
      }

      // Should have many different values
      expect(results.size).toBeGreaterThan(25)
    })

    it('should work with arrays containing objects', () => {
      const objects = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
      ]

      for (let i = 0; i < 50; i++) {
        const result = randomInArray(objects)
        expect(objects.includes(result)).toBe(true)
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
      }
    })

    it('should work with arrays containing functions', () => {
      const functions = [() => 'first', () => 'second', () => 'third']

      for (let i = 0; i < 50; i++) {
        const result = randomInArray(functions)
        expect(functions.includes(result)).toBe(true)
        expect(typeof result).toBe('function')
      }
    })

    it('should preserve reference equality', () => {
      const obj1 = { value: 1 }
      const obj2 = { value: 2 }
      const array = [obj1, obj2]

      for (let i = 0; i < 50; i++) {
        const result = randomInArray(array)
        expect(result === obj1 || result === obj2).toBe(true)
      }
    })

    describe('edge cases', () => {
      it('should handle empty arrays', () => {
        const emptyArray: any[] = []

        // This should return undefined (accessing non-existent index)
        const result = randomInArray(emptyArray)
        expect(result).toBeUndefined()
      })

      it('should handle arrays with undefined elements', () => {
        const arrayWithUndefined = [1, undefined, 3]

        for (let i = 0; i < 50; i++) {
          const result = randomInArray(arrayWithUndefined)
          expect(arrayWithUndefined.includes(result)).toBe(true)
        }
      })

      it('should handle arrays with null elements', () => {
        const arrayWithNull = [1, null, 3]

        for (let i = 0; i < 50; i++) {
          const result = randomInArray(arrayWithNull)
          expect(arrayWithNull.includes(result)).toBe(true)
        }
      })

      it('should handle sparse arrays', () => {
        const sparseArray = [1, , 3] // Has empty slot at index 1

        for (let i = 0; i < 50; i++) {
          const result = randomInArray(sparseArray)
          // Result should be 1, undefined (empty slot), or 3
          expect(result === 1 || result === undefined || result === 3).toBe(
            true,
          )
        }
      })

      it('should handle very large arrays', () => {
        const largeArray = Array.from({ length: 10000 }, (_, i) => i)

        for (let i = 0; i < 50; i++) {
          const result = randomInArray(largeArray)
          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThan(10000)
          expect(Number.isInteger(result)).toBe(true)
        }
      })
    })

    describe('with mocked Math.random', () => {
      beforeEach(() => {
        vi.spyOn(Math, 'random')
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should use Math.random correctly for index calculation', () => {
        const array = ['a', 'b', 'c', 'd', 'e']
        vi.mocked(Math.random).mockReturnValue(0.4)

        const result = randomInArray(array)
        expect(Math.random).toHaveBeenCalled()
        expect(result).toBe('c') // Math.floor(0.4 * 5) = 2, array[2] = 'c'
      })

      it('should return first element when Math.random returns 0', () => {
        const array = ['first', 'second', 'third']
        vi.mocked(Math.random).mockReturnValue(0)

        const result = randomInArray(array)
        expect(result).toBe('first')
      })

      it('should return last element when Math.random returns 0.999...', () => {
        const array = ['first', 'second', 'third']
        vi.mocked(Math.random).mockReturnValue(0.9999999)

        const result = randomInArray(array)
        expect(result).toBe('third')
      })
    })

    describe('type safety', () => {
      it('should maintain type safety with typed arrays', () => {
        const numbers: number[] = [1, 2, 3, 4, 5]
        const strings: string[] = ['a', 'b', 'c']

        const numberResult = randomInArray(numbers)
        const stringResult = randomInArray(strings)

        expect(typeof numberResult).toBe('number')
        expect(typeof stringResult).toBe('string')
      })

      it('should work with union types', () => {
        const mixed: (string | number)[] = [1, 'hello', 2, 'world']

        for (let i = 0; i < 50; i++) {
          const result = randomInArray(mixed)
          expect(typeof result === 'string' || typeof result === 'number').toBe(
            true,
          )
        }
      })
    })
  })

  describe('integration and distribution tests', () => {
    it('should have roughly uniform distribution for randomNumber', () => {
      const counts = new Array(6).fill(0)
      const iterations = 6000

      for (let i = 0; i < iterations; i++) {
        const result = randomNumber(6)
        counts[result - 1]++
      }

      // Each value should occur roughly 1000 times (±200 for randomness)
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(800)
        expect(count).toBeLessThan(1200)
      })
    })

    it('should have roughly uniform distribution for randomNumberRange', () => {
      const min = 5
      const max = 9
      const range = max - min + 1
      const counts = new Array(range).fill(0)
      const iterations = 5000

      for (let i = 0; i < iterations; i++) {
        const result = randomNumberRange(min, max)
        counts[result - min]++
      }

      // Each value should occur roughly 1000 times (±200 for randomness)
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(800)
        expect(count).toBeLessThan(1200)
      })
    })

    it('should have roughly uniform distribution for randomInArray', () => {
      const array = ['a', 'b', 'c', 'd', 'e']
      const counts = new Map(array.map((item) => [item, 0]))
      const iterations = 5000

      for (let i = 0; i < iterations; i++) {
        const result = randomInArray(array)
        counts.set(result, counts.get(result)! + 1)
      }

      // Each value should occur roughly 1000 times (±200 for randomness)
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(800)
        expect(count).toBeLessThan(1200)
      })
    })
  })
})
