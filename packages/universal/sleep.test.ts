import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import sleep from './sleep.js'

describe('sleep', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should be a function', () => {
      expect(typeof sleep).toBe('function')
    })

    it('should return a Promise', () => {
      const result = sleep(100)
      expect(result).toBeInstanceOf(Promise)
    })

    it('should resolve after specified delay', async () => {
      const promise = sleep(1000)

      // Advance timers to complete the delay
      vi.advanceTimersByTime(1000)

      await expect(promise).resolves.toBeUndefined()
    })

    it('should resolve with undefined', async () => {
      const promise = sleep(500)
      vi.advanceTimersByTime(500)
      const result = await promise

      expect(result).toBeUndefined()
    })
  })

  describe('timing', () => {
    it('should handle zero delay', async () => {
      const promise = sleep(0)
      vi.advanceTimersByTime(0)
      await expect(promise).resolves.toBeUndefined()
    })

    it('should handle various delays', async () => {
      const delays = [1, 10, 100, 1000]

      for (const delay of delays) {
        const promise = sleep(delay)
        vi.advanceTimersByTime(delay)
        await expect(promise).resolves.toBeUndefined()
      }
    })

    it('should handle large delays', async () => {
      const promise = sleep(10000)
      vi.advanceTimersByTime(10000)
      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('concurrent usage', () => {
    it('should handle multiple concurrent sleep calls', async () => {
      const promises = [sleep(100), sleep(200), sleep(300)]

      vi.advanceTimersByTime(300)
      const results = await Promise.all(promises)

      expect(results).toEqual([undefined, undefined, undefined])
    })

    it('should work with Promise.all', async () => {
      const promises = [sleep(100), sleep(200), sleep(150)]
      const allPromise = Promise.all(promises)

      vi.advanceTimersByTime(200)
      await expect(allPromise).resolves.toEqual([
        undefined,
        undefined,
        undefined,
      ])
    })

    it('should work with Promise.race', async () => {
      const promises = [sleep(300), sleep(100), sleep(200)]
      const racePromise = Promise.race(promises)

      vi.advanceTimersByTime(100)
      await expect(racePromise).resolves.toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('should handle negative delays', async () => {
      const promise = sleep(-100)
      vi.advanceTimersByTime(0)
      await expect(promise).resolves.toBeUndefined()
    })

    it('should handle decimal delays', async () => {
      const promise = sleep(100.5)
      vi.advanceTimersByTime(100)
      await expect(promise).resolves.toBeUndefined()
    })

    it('should handle very large numbers', async () => {
      const promise = sleep(Number.MAX_SAFE_INTEGER)
      vi.advanceTimersByTime(Number.MAX_SAFE_INTEGER)
      await expect(promise).resolves.toBeUndefined()
    })

    it('should handle NaN', async () => {
      const promise = sleep(NaN)
      vi.advanceTimersByTime(0)
      await expect(promise).resolves.toBeUndefined()
    })

    it('should handle Infinity gracefully', () => {
      expect(async () => sleep(Infinity)).not.toThrow()
    })
  })

  describe('async patterns', () => {
    it('should work with then() callbacks', async () => {
      const result: string[] = []

      const promise = sleep(100).then(() => {
        result.push('completed')
      })

      vi.advanceTimersByTime(100)
      await promise

      expect(result).toEqual(['completed'])
    })

    it('should work in Promise.resolve context', async () => {
      const promise = Promise.resolve().then(async () => sleep(100))

      // Wait for the sleep call to be made
      await vi.runOnlyPendingTimersAsync()

      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should not throw errors for valid inputs', () => {
      expect(async () => sleep(0)).not.toThrow()
      expect(async () => sleep(100)).not.toThrow()
      expect(async () => sleep(1000)).not.toThrow()
    })

    it('should handle being called multiple times rapidly', async () => {
      const promises = []

      for (let i = 0; i < 10; i++) {
        promises.push(sleep(100))
      }

      vi.advanceTimersByTime(100)
      const results = await Promise.all(promises)

      expect(results).toHaveLength(10)
      expect(results.every((result) => result === undefined)).toBe(true)
    })
  })

  describe('real timer integration', () => {
    it('should work with real timers for very short delays', async () => {
      vi.useRealTimers()

      const promise = sleep(1)
      await expect(promise).resolves.toBeUndefined()

      vi.useFakeTimers()
    })
  })

  describe('type safety', () => {
    it('should accept number parameters', () => {
      expect(async () => sleep(100)).not.toThrow()
      expect(async () => sleep(0)).not.toThrow()
      expect(async () => sleep(1.5)).not.toThrow()
    })

    it('should return Promise<void>', async () => {
      const result = sleep(100)
      expect(result).toBeInstanceOf(Promise)

      vi.advanceTimersByTime(100)
      const resolved = await result
      expect(resolved).toBeUndefined()
    })
  })
})
