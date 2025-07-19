import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { rand } from './probability.js'

describe('probability.js', () => {
  let originalMathRandom

  beforeEach(() => {
    originalMathRandom = Math.random
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original Math.random
    Math.random = originalMathRandom
    vi.restoreAllMocks()
  })

  describe('rand function behavior', () => {
    it('should be a function', () => {
      expect(typeof rand).toBe('function')
    })

    it('should return a number', () => {
      const result = rand()
      expect(typeof result).toBe('number')
    })

    it('should return values between 0 and 100', () => {
      for (let i = 0; i < 1000; i++) {
        const result = rand()
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThan(100)
      }
    })

    it('should use Math.random internally', () => {
      const mathRandomSpy = vi.spyOn(Math, 'random')
      rand()
      expect(mathRandomSpy).toHaveBeenCalledTimes(1)
    })

    it('should scale Math.random output by 100', () => {
      Math.random = vi.fn().mockReturnValue(0.5)
      expect(rand()).toBe(50)

      Math.random = vi.fn().mockReturnValue(0.25)
      expect(rand()).toBe(25)

      Math.random = vi.fn().mockReturnValue(0.75)
      expect(rand()).toBe(75)
    })

    it('should handle edge case when Math.random returns 0', () => {
      Math.random = vi.fn().mockReturnValue(0)
      expect(rand()).toBe(0)
    })

    it('should handle edge case when Math.random returns close to 1', () => {
      Math.random = vi.fn().mockReturnValue(0.999999)
      const result = rand()
      expect(result).toBeCloseTo(99.9999)
      expect(result).toBeLessThan(100)
    })
  })

  describe('probability distribution', () => {
    it('should generate a roughly uniform distribution', () => {
      const buckets = new Array(10).fill(0)
      const iterations = 10000

      for (let i = 0; i < iterations; i++) {
        const value = rand()
        const bucketIndex = Math.floor(value / 10)
        buckets[bucketIndex]++
      }

      // Each bucket should have roughly 10% of values (1000 out of 10000)
      // Allow for statistical variance
      buckets.forEach((count) => {
        expect(count).toBeGreaterThan(800) // At least 8%
        expect(count).toBeLessThan(1200) // At most 12%
      })
    })

    it('should generate different values on consecutive calls', () => {
      // Reset Math.random to use real implementation
      Math.random = originalMathRandom

      const values = new Set()
      for (let i = 0; i < 100; i++) {
        values.add(rand())
      }

      // Should generate at least 90 different values out of 100
      expect(values.size).toBeGreaterThan(90)
    })
  })

  describe('performance', () => {
    it('should generate numbers efficiently', () => {
      const start = performance.now()
      for (let i = 0; i < 100000; i++) {
        rand()
      }
      const end = performance.now()

      // Should complete 100,000 iterations in less than 100ms
      expect(end - start).toBeLessThan(100)
    })
  })

  describe('module characteristics', () => {
    it('should export rand as a named export', () => {
      expect(rand).toBeDefined()
      expect(typeof rand).toBe('function')
    })
  })
})
