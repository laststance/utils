import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useIsMobile } from './use-mobile'

describe('useIsMobile', () => {
  // Save the original matchMedia implementation before any tests run
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // Reset window.innerWidth to desktop size before each test
    window.innerWidth = 1024 // Default to desktop size
  })

  describe('initial state', () => {
    it('should return false for desktop screen width (>= 768px)', () => {
      // Set window width to desktop size
      window.innerWidth = 1024

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(false)
    })

    it('should return true for mobile screen width (< 768px)', () => {
      // Set window width to mobile size
      window.innerWidth = 375

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(true)
    })
  })

  describe('media query setup', () => {
    it('should create media query with correct breakpoint', () => {
      const { result } = renderHook(() => useIsMobile())

      // Verify that matchMedia can be called with the correct breakpoint
      const mql = window.matchMedia('(max-width: 767px)')
      expect(mql).toBeDefined()
      expect(mql.media).toBe('(max-width: 767px)')
      expect(result.current).toBeDefined()
    })

    it('should add event listener for media query changes', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia')
      const addEventListenerSpy = vi.fn()

      // Intercept matchMedia calls and spy on addEventListener
      matchMediaSpy.mockImplementation((query: string) => {
        const mql = originalMatchMedia.call(window, query)
        vi.spyOn(mql, 'addEventListener').mockImplementation(addEventListenerSpy)
        return mql
      })

      renderHook(() => useIsMobile())

      expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 767px)')
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })
  })

  describe('media query changes', () => {
    it('should update when media query changes from desktop to mobile', () => {
      // Start with desktop width
      window.innerWidth = 1024

      let changeHandler: (() => void) | undefined
      const matchMediaSpy = vi.spyOn(window, 'matchMedia')
      
      // Capture the change handler by intercepting matchMedia calls
      matchMediaSpy.mockImplementation((query: string) => {
        const mql = originalMatchMedia.call(window, query)
        const originalAddEventListener = mql.addEventListener.bind(mql)
        vi.spyOn(mql, 'addEventListener').mockImplementation((event: string, handler: EventListenerOrEventListenerObject) => {
          if (event === 'change') {
            changeHandler = handler as () => void
          }
          return originalAddEventListener(event, handler)
        })
        return mql
      })

      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(false)

      // Simulate change to mobile width and trigger change event
      act(() => {
        window.innerWidth = 375
        if (changeHandler) {
          changeHandler()
        }
      })

      expect(result.current).toBe(true)
    })

    it('should update when media query changes from mobile to desktop', () => {
      // Start with mobile width
      window.innerWidth = 375

      let changeHandler: (() => void) | undefined
      const matchMediaSpy = vi.spyOn(window, 'matchMedia')
      
      // Capture the change handler by intercepting matchMedia calls
      matchMediaSpy.mockImplementation((query: string) => {
        const mql = originalMatchMedia.call(window, query)
        const originalAddEventListener = mql.addEventListener.bind(mql)
        vi.spyOn(mql, 'addEventListener').mockImplementation((event: string, handler: EventListenerOrEventListenerObject) => {
          if (event === 'change') {
            changeHandler = handler as () => void
          }
          return originalAddEventListener(event, handler)
        })
        return mql
      })

      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(true)

      // Simulate change to desktop width and trigger change event
      act(() => {
        window.innerWidth = 1024
        if (changeHandler) {
          changeHandler()
        }
      })

      expect(result.current).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle exact breakpoint boundary (767px) as mobile', () => {
      window.innerWidth = 767

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(true)
    })

    it('should handle breakpoint boundary (768px) as desktop', () => {
      window.innerWidth = 768

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.fn()
      const matchMediaSpy = vi.spyOn(window, 'matchMedia')
      
      // Intercept matchMedia calls and spy on removeEventListener
      matchMediaSpy.mockImplementation((query: string) => {
        const mql = originalMatchMedia.call(window, query)
        vi.spyOn(mql, 'removeEventListener').mockImplementation(removeEventListenerSpy)
        return mql
      })

      const { unmount } = renderHook(() => useIsMobile())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })
  })

  describe('SSR considerations', () => {
    it('should handle undefined initial state', () => {
      const { result } = renderHook(() => useIsMobile())

      // The hook should return a boolean, not undefined
      expect(typeof result.current).toBe('boolean')
    })
  })

  describe('multiple instances', () => {
    it('should work correctly with multiple hook instances', () => {
      window.innerWidth = 1024

      const { result: result1 } = renderHook(() => useIsMobile())
      const { result: result2 } = renderHook(() => useIsMobile())

      expect(result1.current).toBe(false)
      expect(result2.current).toBe(false)
      expect(result1.current).toBe(result2.current)
    })
  })
})
