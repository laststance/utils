/**
 * Unit Test: useMounted Hook
 *
 * Tests for the useSyncExternalStore-based useMounted hook.
 *
 * Test targets:
 * - Returns true on client (mounted)
 * - Returns false during SSR (not mounted)
 * - Uses useSyncExternalStore correctly
 * - No re-render cascade after mount
 *
 * @remarks
 * This hook was refactored from useState + useEffect pattern to
 * useSyncExternalStore pattern to eliminate hydration mismatch warnings.
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { useMounted } from '@/hooks/use-mounted'

describe('useMounted', () => {
  describe('Client-side behavior', () => {
    it('should return true when rendered on client', () => {
      const { result } = renderHook(() => useMounted())

      // On client, useSyncExternalStore uses getClientSnapshot which returns true
      expect(result.current).toBe(true)
    })

    it('should return stable value across re-renders', () => {
      const { result, rerender } = renderHook(() => useMounted())

      const initialValue = result.current
      expect(initialValue).toBe(true)

      // Re-render should return same value
      rerender()
      expect(result.current).toBe(initialValue)

      // Multiple re-renders should still return same value
      rerender()
      rerender()
      expect(result.current).toBe(true)
    })

    it('should be usable in conditional rendering', () => {
      const { result } = renderHook(() => {
        const isMounted = useMounted()
        return isMounted ? 'client' : 'server'
      })

      expect(result.current).toBe('client')
    })
  })

  describe('Hook API', () => {
    it('should return boolean type', () => {
      const { result } = renderHook(() => useMounted())

      expect(typeof result.current).toBe('boolean')
    })

    it('should not throw errors when called', () => {
      expect(() => {
        renderHook(() => useMounted())
      }).not.toThrow()
    })
  })

  describe('SSR simulation', () => {
    /**
     * Note: Testing SSR behavior in happy-dom is limited.
     * The real SSR test is done in e2e/unauthenticated/ssr-hydration.spec.ts
     * which checks for console hydration errors in a real browser.
     *
     * These tests verify the hook works correctly on the client side,
     * which is the post-hydration behavior.
     */
    it('should handle initial render without errors', () => {
      // Simulates that the hook can be called without errors
      // even if it's the "first" render (mimics hydration)
      const { result } = renderHook(() => useMounted())

      // After hydration, the value should be true
      expect(result.current).toBe(true)
    })
  })

  describe('Integration with components', () => {
    it('should work with multiple components using the hook', () => {
      // Render multiple hooks simultaneously
      const { result: result1 } = renderHook(() => useMounted())
      const { result: result2 } = renderHook(() => useMounted())
      const { result: result3 } = renderHook(() => useMounted())

      // All should return true on client
      expect(result1.current).toBe(true)
      expect(result2.current).toBe(true)
      expect(result3.current).toBe(true)
    })

    it('should work in nested hook calls', () => {
      const { result } = renderHook(() => {
        const isMounted = useMounted()
        // Simulates using the hook value for conditional logic
        const conditionalValue = isMounted ? 'mounted' : 'not-mounted'
        return { isMounted, conditionalValue }
      })

      expect(result.current.isMounted).toBe(true)
      expect(result.current.conditionalValue).toBe('mounted')
    })
  })
})
