import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import retry from '../retry.js'

describe('retry', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('successful execution', () => {
    it('should return result when function succeeds on first try', async () => {
      const mockFn = vi.fn(async () => 'success')
      
      const result = await retry(mockFn)
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith({ bail: expect.any(Function), tries: 1 })
    })

    it('should return result when function succeeds after retries', async () => {
      let attemptCount = 0
      const mockFn = vi.fn(async () => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error('Temporary failure')
        }
        return 'success after retries'
      })
      
      const result = await retry(mockFn, { retries: 5 })
      
      expect(result).toBe('success after retries')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should work with async functions returning promises', async () => {
      const mockFn = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return 'async result'
      })
      
      const promise = retry(mockFn)
      vi.advanceTimersByTime(100)
      const result = await promise
      
      expect(result).toBe('async result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should work with functions returning non-promise values', async () => {
      const mockFn = vi.fn(() => 'sync result')
      
      const result = await retry(mockFn)
      
      expect(result).toBe('sync result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('retry behavior', () => {
    it('should use default retries value of 3', async () => {
      const mockFn = vi.fn(async () => {
        throw new Error('Always fail')
      })
      
      await expect(retry(mockFn)).rejects.toThrow('Always fail')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should respect custom retries option', async () => {
      const mockFn = vi.fn(async () => {
        throw new Error('Always fail')
      })
      
      await expect(retry(mockFn, { retries: 5 })).rejects.toThrow('Always fail')
      expect(mockFn).toHaveBeenCalledTimes(5)
    })

    it('should call function with correct tries parameter', async () => {
      const mockFn = vi.fn(async ({ tries }) => {
        if (tries < 3) {
          throw new Error(`Attempt ${tries} failed`)
        }
        return `Success on attempt ${tries}`
      })
      
      const result = await retry(mockFn, { retries: 5 })
      
      expect(result).toBe('Success on attempt 3')
      expect(mockFn).toHaveBeenNthCalledWith(1, { bail: expect.any(Function), tries: 1 })
      expect(mockFn).toHaveBeenNthCalledWith(2, { bail: expect.any(Function), tries: 2 })
      expect(mockFn).toHaveBeenNthCalledWith(3, { bail: expect.any(Function), tries: 3 })
    })

    it('should handle zero retries', async () => {
      const mockFn = vi.fn(async () => {
        throw new Error('Immediate failure')
      })
      
      // With retries: 0, the loop condition tries < retries is never true
      const result = await retry(mockFn, { retries: 0 })
      expect(result).toBeNull() // Should return initial output value (null)
      expect(mockFn).toHaveBeenCalledTimes(0)
    })

    it('should handle single retry', async () => {
      const mockFn = vi.fn(async () => {
        throw new Error('Single attempt failure')
      })
      
      await expect(retry(mockFn, { retries: 1 })).rejects.toThrow('Single attempt failure')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('bail functionality', () => {
    it('should exit early when bail is called', async () => {
      const mockFn = vi.fn(async ({ bail, tries }) => {
        const error = new Error(`Critical error on attempt ${tries}`)
        bail(error)
        // Function should complete normally, but bail error will be thrown at the end
        return 'success'
      })
      
      await expect(retry(mockFn, { retries: 5 })).rejects.toThrow('Critical error on attempt 1')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should throw bail error even when function succeeds', async () => {
      const mockFn = vi.fn(async ({ bail }) => {
        bail(new Error('Bailed out'))
        return 'This success should be ignored'
      })
      
      await expect(retry(mockFn)).rejects.toThrow('Bailed out')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle bail with different error types', async () => {
      const customError = new TypeError('Type error bail')
      const mockFn = vi.fn(async ({ bail }) => {
        bail(customError)
      })
      
      await expect(retry(mockFn)).rejects.toThrow(customError)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should prioritize function error over bail error when both occur', async () => {
      // eslint-disable-next-line no-unused-vars
      const mockFn = vi.fn(async ({ bail, tries }) => {
        bail(new Error('Bail error'))
        throw new Error('Function error') // This error is thrown first, caught by try-catch
      })
      
      // The function error is thrown and caught, preventing bail error from being checked
      await expect(retry(mockFn, { retries: 3 })).rejects.toThrow('Function error')
      expect(mockFn).toHaveBeenCalledTimes(3) // Retries because function error was thrown
    })

    it('should handle bail called multiple times', async () => {
      const mockFn = vi.fn(async ({ bail }) => {
        bail(new Error('First bail'))
        bail(new Error('Second bail')) // Overwrites the first bail
        return 'success'
      })
      
      // Should throw the last bail error since bail calls overwrite exitErr
      await expect(retry(mockFn)).rejects.toThrow('Second bail')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should throw last error when all retries exhausted', async () => {
      let attemptCount = 0
      const mockFn = vi.fn(async () => {
        attemptCount++
        throw new Error(`Attempt ${attemptCount} failed`)
      })
      
      await expect(retry(mockFn, { retries: 3 })).rejects.toThrow('Attempt 3 failed')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should handle different error types', async () => {
      const errors = [
        new TypeError('Type error'),
        new ReferenceError('Reference error'),
        new SyntaxError('Syntax error')
      ]
      
      let attemptCount = 0
      const mockFn = vi.fn(async () => {
        throw errors[attemptCount++]
      })
      
      await expect(retry(mockFn, { retries: 3 })).rejects.toThrow('Syntax error')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should handle non-Error thrown values', async () => {
      const mockFn = vi.fn(async () => {
        throw 'String error'
      })
      
      await expect(retry(mockFn, { retries: 2 })).rejects.toBe('String error')
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should handle functions that throw synchronously', async () => {
      const mockFn = vi.fn(() => {
        throw new Error('Sync error')
      })
      
      await expect(retry(mockFn, { retries: 2 })).rejects.toThrow('Sync error')
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('complex scenarios', () => {
    it('should handle mixed success and failure patterns', async () => {
      const results = ['fail', 'fail', 'success', 'fail']
      let attemptCount = 0
      
      const mockFn = vi.fn(async () => {
        const result = results[attemptCount++]
        if (result === 'fail') {
          throw new Error(`Attempt ${attemptCount} failed`)
        }
        return result
      })
      
      const result = await retry(mockFn, { retries: 5 })
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should handle async operations with delays', async () => {
      let attemptCount = 0
      const mockFn = vi.fn(async () => {
        attemptCount++
        await new Promise(resolve => setTimeout(resolve, 50))
        
        if (attemptCount < 3) {
          throw new Error(`Delayed failure ${attemptCount}`)
        }
        return `Delayed success ${attemptCount}`
      })
      
      const promise = retry(mockFn, { retries: 4 })
      
      // Fast-forward all timers to complete the async operations
      await vi.runAllTimersAsync()
      
      const result = await promise
      expect(result).toBe('Delayed success 3')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should handle functions that access external state', async () => {
      let externalCounter = 0
      
      const mockFn = vi.fn(async ({ tries }) => {
        externalCounter += tries
        
        if (externalCounter < 10) {
          throw new Error(`Counter too low: ${externalCounter}`)
        }
        
        return `Counter reached: ${externalCounter}`
      })
      
      const result = await retry(mockFn, { retries: 5 })
      
      expect(result).toBe('Counter reached: 10')
      expect(externalCounter).toBe(10) // 1 + 2 + 3 + 4 = 10
    })
  })

  describe('options handling', () => {
    it('should handle empty options object', async () => {
      const mockFn = vi.fn(async () => 'success')
      
      const result = await retry(mockFn, {})
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle undefined options', async () => {
      const mockFn = vi.fn(async () => 'success')
      
      const result = await retry(mockFn, undefined)
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle null options', async () => {
      const mockFn = vi.fn(async () => 'success')
      
      // The code does { retries = 3 } = options, which will fail with null
      // So this test should expect an error
      await expect(retry(mockFn, null)).rejects.toThrow()
    })

    it('should handle extra options gracefully', async () => {
      const mockFn = vi.fn(async () => 'success')
      
      const result = await retry(mockFn, {
        retries: 2,
        extraOption: 'ignored',
        anotherOption: 123
      })
      
      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle non-integer retries', async () => {
      const mockFn = vi.fn(async () => {
        throw new Error('Always fail')
      })
      
      // Uses 2.7 directly in tries < retries comparison, so tries 1, 2, 3 all pass (since 3 < 2.7 is false, stops after try 3)
      await expect(retry(mockFn, { retries: 2.7 })).rejects.toThrow('Always fail')
      expect(mockFn).toHaveBeenCalledTimes(3) // 1 < 2.7, 2 < 2.7, 3 < 2.7 is false
    })
  })

  describe('edge cases', () => {
    it('should handle function that returns null', async () => {
      const mockFn = vi.fn(async () => null)
      
      const result = await retry(mockFn)
      
      expect(result).toBeNull()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle function that returns undefined', async () => {
      const mockFn = vi.fn(async () => undefined)
      
      const result = await retry(mockFn)
      
      expect(result).toBeUndefined()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle function that returns falsy values', async () => {
      const falsyValues = [false, 0, '', null, undefined]
      
      for (const value of falsyValues) {
        const mockFn = vi.fn(async () => value)
        const result = await retry(mockFn)
        expect(result).toBe(value)
      }
    })

    it('should handle very high retry counts', async () => {
      let attemptCount = 0
      const mockFn = vi.fn(async () => {
        attemptCount++
        if (attemptCount < 100) {
          throw new Error(`Attempt ${attemptCount}`)
        }
        return 'final success'
      })
      
      const result = await retry(mockFn, { retries: 150 })
      
      expect(result).toBe('final success')
      expect(mockFn).toHaveBeenCalledTimes(100)
    })

    it('should handle bail with non-Error objects', async () => {
      const mockFn = vi.fn(async ({ bail }) => {
        bail({ message: 'Custom error object', code: 500 })
      })
      
      await expect(retry(mockFn)).rejects.toEqual({ message: 'Custom error object', code: 500 })
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('integration patterns', () => {
    it('should work with network-like operations', async () => {
      let networkAttempts = 0
      const mockNetworkCall = vi.fn(async ({ tries, bail }) => {
        networkAttempts++
        
        // Simulate network conditions
        if (networkAttempts === 1) {
          throw new Error('Connection timeout')
        }
        if (networkAttempts === 2) {
          throw new Error('Server error 500')
        }
        if (networkAttempts === 3) {
          return { data: 'Success', status: 200, attempts: tries }
        }
        
        bail(new Error('Unexpected state'))
      })
      
      const result = await retry(mockNetworkCall, { retries: 5 })
      
      expect(result).toEqual({ data: 'Success', status: 200, attempts: 3 })
      expect(mockNetworkCall).toHaveBeenCalledTimes(3)
    })

    it('should work with resource cleanup patterns', async () => {
      const resources = []
      
      // eslint-disable-next-line no-unused-vars
      const mockResourceOperation = vi.fn(async ({ tries, bail }) => {
        const resource = `resource-${tries}`
        resources.push(resource)
        
        try {
          if (tries < 3) {
            throw new Error(`Resource ${resource} failed to initialize`)
          }
          return `Initialized ${resource}`
        } catch (error) {
          // Cleanup resource on failure
          resources.pop()
          throw error
        }
      })
      
      const result = await retry(mockResourceOperation, { retries: 4 })
      
      expect(result).toBe('Initialized resource-3')
      expect(resources).toEqual(['resource-3']) // Only successful resource remains
    })

    it('should work with conditional bail scenarios', async () => {
      const mockOperation = vi.fn(async ({ tries, bail }) => {
        const error = new Error(`Attempt ${tries} failed`)
        
        // Bail on specific error conditions
        if (tries === 2) {
          error.code = 'FATAL_ERROR'
          bail(error) // Sets exitErr but doesn't stop execution
        }
        
        throw error // This error is thrown and retries continue
      })
      
      // Bail doesn't stop retries, so all attempts run and the last error is thrown
      await expect(retry(mockOperation, { retries: 5 })).rejects.toMatchObject({
        message: 'Attempt 5 failed'
      })
      
      expect(mockOperation).toHaveBeenCalledTimes(5)
    })
  })
})