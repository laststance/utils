import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { debounce } from './debounce.js'

describe('debounce', () => {
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
      expect(typeof debounce).toBe('function')
    })

    it('should return a function', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)
      expect(typeof debouncedFn).toBe('function')
    })

    it('should delay function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should only execute the last call when called multiple times rapidly', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('call1')
      debouncedFn('call2')
      debouncedFn('call3')
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('call3')
    })
  })

  describe('timing behavior', () => {
    it('should reset the timer on subsequent calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('test1')
      vi.advanceTimersByTime(150)

      debouncedFn('test2') // This should reset the timer
      vi.advanceTimersByTime(150) // Total 300ms, but only 150ms since reset
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(150) // Now 300ms since reset
      expect(mockFn).toHaveBeenCalledWith('test2')
    })

    it('should handle zero timeout', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(0, mockFn)

      debouncedFn('test')
      vi.advanceTimersByTime(0)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should handle long timeouts', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(5000, mockFn)

      debouncedFn('test')
      vi.advanceTimersByTime(4999)
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledWith('test')
    })
  })

  describe('argument handling', () => {
    it('should pass through single argument', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('single-arg')
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('single-arg')
    })

    it('should pass through multiple arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('arg1', 'arg2', 'arg3')
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })

    it('should handle no arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn()
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith()
    })

    it('should handle different argument types', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      const obj = { key: 'value' }
      debouncedFn(42, 'string', obj, true, null)
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith(42, 'string', obj, true, null)
    })
  })

  describe('callback context', () => {
    it('should work with arrow functions', () => {
      const mockFn = vi.fn((x: number, y: number) => x + y)
      const debouncedFn = debounce(300, mockFn)

      debouncedFn(5, 3)
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith(5, 3)
    })

    it('should work with regular functions', () => {
      const mockFn = vi.fn(function (this: any, value: string) {
        return value.toUpperCase()
      })
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('hello')
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('hello')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid consecutive calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      for (let i = 0; i < 100; i++) {
        debouncedFn(`call-${i}`)
      }

      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('call-99')
    })

    it('should allow execution after the debounced period', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(300, mockFn)

      debouncedFn('first')
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('first')

      vi.resetAllMocks()

      debouncedFn('second')
      vi.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledWith('second')
    })
  })

  describe('type safety', () => {
    it('should maintain type safety for typed functions', () => {
      const typedFn = (x: number, y: string): string => `${x}-${y}`
      const debouncedFn = debounce(300, typedFn)

      // This should not cause TypeScript errors
      debouncedFn(42, 'test')
      vi.advanceTimersByTime(300)
    })
  })
})
