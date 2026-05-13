import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useRenderEffect } from './use-render-effect'

describe('useRenderEffect', () => {
  // No-deps branch — the original "fire on every render" behavior.
  describe('without a deps argument (fires on every render)', () => {
    it('calls the effect on the initial render (mount)', () => {
      const effect = vi.fn()
      renderHook(() => useRenderEffect(effect))
      expect(effect).toHaveBeenCalledOnce()
    })

    it('calls the effect on every subsequent re-render', () => {
      const effect = vi.fn()
      const { rerender } = renderHook(() => useRenderEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
      rerender()
      expect(effect).toHaveBeenCalledTimes(4)
    })

    it('runs the returned cleanup before the next effect on re-render', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { rerender } = renderHook(() => useRenderEffect(effect))

      // After mount: effect ran once, cleanup not yet called.
      expect(effect).toHaveBeenCalledTimes(1)
      expect(cleanup).toHaveBeenCalledTimes(0)

      // After first re-render: previous cleanup runs, then effect runs again.
      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)

      rerender()
      expect(cleanup).toHaveBeenCalledTimes(2)
      expect(effect).toHaveBeenCalledTimes(3)
    })

    it('runs the cleanup on unmount', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { unmount } = renderHook(() => useRenderEffect(effect))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it('works without a cleanup function returned from the effect', () => {
      const effect = vi.fn(() => undefined)
      const { rerender, unmount } = renderHook(() => useRenderEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      // Unmount with no cleanup should not throw.
      expect(() => unmount()).not.toThrow()
    })
  })

  // Deps-provided branch — same lifecycle behavior as `useEffect(fn, deps)`,
  // but with a non-empty deps list enforced at the type level.
  describe('with a non-empty deps argument (fires on mount + dep changes)', () => {
    it('calls the effect on the initial render with a single dep', () => {
      const effect = vi.fn()
      renderHook(() => useRenderEffect(effect, [0]))
      expect(effect).toHaveBeenCalledOnce()
    })

    it('does not re-fire when the dep value is unchanged across renders', () => {
      const effect = vi.fn()
      const dep = 'stable'
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('re-fires when a single dep changes', () => {
      const effect = vi.fn()
      let dep = 0
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      dep = 1
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      dep++
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
      // No change → no fire.
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })

    it('re-fires when any of multiple deps change', () => {
      const effect = vi.fn()
      let firstDep: { liked: boolean } = { liked: false }
      let secondDep = 0
      const { rerender } = renderHook(() =>
        useRenderEffect(effect, [firstDep, secondDep]),
      )

      expect(effect).toHaveBeenCalledTimes(1)
      // Mutating the same object reference does not change identity → no fire.
      firstDep.liked = true
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      // New object reference → fires.
      firstDep = { liked: true }
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      // Number change → fires.
      secondDep++
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })

    it('runs the cleanup before the next effect when a dep changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      let dep = 0
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      expect(cleanup).toHaveBeenCalledTimes(0)

      dep = 1
      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)

      // Same dep value → no fire, no cleanup.
      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })

    it('runs the cleanup on unmount when deps are provided', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { unmount } = renderHook(() => useRenderEffect(effect, [1, 2]))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  // Type-level guard — documents (and statically verifies via `@ts-expect-error`)
  // that an empty deps array `[]` is rejected at compile time.
  describe('type-level rejection of empty deps `[]`', () => {
    it('rejects `[]` at the type level — use `useInitialEffect` for mount-only effects', () => {
      const effect = vi.fn()
      renderHook(() =>
        // @ts-expect-error - useRenderEffect intentionally rejects `[]`. Use `useInitialEffect` for mount-only behavior.
        useRenderEffect(effect, []),
      )
      // Runtime still falls through to `useEffect(effect, [])` — mount-only fire —
      // but the call is forbidden at the type level, which is what we care about.
      expect(effect).toHaveBeenCalledOnce()
    })
  })
})
