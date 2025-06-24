import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

// Mock window.matchMedia
const mockMatchMedia = vi.fn()

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockMatchMedia.mockClear()
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Default to desktop size
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should return false for desktop screen width (>= 768px)', () => {
      // Mock matchMedia for desktop
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)
      
      // Set window width to desktop size
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(false)
    })

    it('should return true for mobile screen width (< 768px)', () => {
      // Mock matchMedia for mobile
      const mockMQL = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)
      
      // Set window width to mobile size
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(true)
    })
  })

  describe('media query setup', () => {
    it('should create media query with correct breakpoint', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      renderHook(() => useIsMobile())

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    })

    it('should add event listener for media query changes', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      renderHook(() => useIsMobile())

      expect(mockMQL.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })
  })

  describe('media query changes', () => {
    it('should update when media query changes from desktop to mobile', () => {
      let changeHandler: (() => void) | undefined
      
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler
          }
        }),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      // Start with desktop width
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(false)

      // Simulate change to mobile width
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          value: 375,
          configurable: true,
        })
        if (changeHandler) {
          changeHandler()
        }
      })

      expect(result.current).toBe(true)
    })

    it('should update when media query changes from mobile to desktop', () => {
      let changeHandler: (() => void) | undefined
      
      const mockMQL = {
        matches: true,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler
          }
        }),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      // Start with mobile width
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(true)

      // Simulate change to desktop width
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          value: 1024,
          configurable: true,
        })
        if (changeHandler) {
          changeHandler()
        }
      })

      expect(result.current).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle exact breakpoint boundary (767px) as mobile', () => {
      const mockMQL = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)
      
      Object.defineProperty(window, 'innerWidth', {
        value: 767,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(true)
    })

    it('should handle breakpoint boundary (768px) as desktop', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)
      
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
        configurable: true,
      })

      const { result } = renderHook(() => useIsMobile())

      expect(result.current).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      const { unmount } = renderHook(() => useIsMobile())

      expect(mockMQL.addEventListener).toHaveBeenCalled()
      
      unmount()

      expect(mockMQL.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })
  })

  describe('SSR considerations', () => {
    it('should handle undefined initial state', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)

      const { result } = renderHook(() => useIsMobile())
      
      // The hook should return a boolean, not undefined
      expect(typeof result.current).toBe('boolean')
    })
  })

  describe('multiple instances', () => {
    it('should work correctly with multiple hook instances', () => {
      const mockMQL = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      mockMatchMedia.mockReturnValue(mockMQL)
      
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true,
      })

      const { result: result1 } = renderHook(() => useIsMobile())
      const { result: result2 } = renderHook(() => useIsMobile())

      expect(result1.current).toBe(false)
      expect(result2.current).toBe(false)
      expect(result1.current).toBe(result2.current)
    })
  })
}) 