import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useCycleEffect } from './use-cycle-effect'

describe('useCycleEffect', () => {
  // Without deps → same as `useEffect(fn)` (fires every render).
  describe('without a deps argument', () => {
    it('calls the effect on the initial render', () => {
      const effect = vi.fn()
      renderHook(() => useCycleEffect(effect))
      expect(effect).toHaveBeenCalledOnce()
    })

    it('calls the effect on every subsequent re-render', () => {
      const effect = vi.fn()
      const { rerender } = renderHook(() => useCycleEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })
  })

  // With empty deps `[]` → mount only (allowed here; useRenderEffect rejects it).
  describe('with empty deps `[]` (mount only)', () => {
    it('calls the effect on mount and never again', () => {
      const effect = vi.fn()
      const { rerender } = renderHook(() => useCycleEffect(effect, []))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('runs the cleanup on unmount', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { unmount } = renderHook(() => useCycleEffect(effect, []))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  // With non-empty deps → standard `useEffect(fn, deps)` behavior.
  describe('with a non-empty deps argument (mount + dep changes)', () => {
    it('calls the effect on the initial render with a single dep', () => {
      const effect = vi.fn()
      renderHook(() => useCycleEffect(effect, [0]))
      expect(effect).toHaveBeenCalledOnce()
    })

    it('does not re-fire when the dep value is unchanged across renders', () => {
      const effect = vi.fn()
      const dep = 'stable'
      const { rerender } = renderHook(() => useCycleEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('re-fires when a single dep changes', () => {
      const effect = vi.fn()
      let dep = 0
      const { rerender } = renderHook(() => useCycleEffect(effect, [dep]))

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
        useCycleEffect(effect, [firstDep, secondDep]),
      )

      expect(effect).toHaveBeenCalledTimes(1)
      // Mutating same object reference → no fire.
      firstDep.liked = true
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      // New object reference → fires.
      firstDep = { liked: true }
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      // Primitive change → fires.
      secondDep++
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })

    it('runs the cleanup before the next effect when a dep changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      let dep = 0
      const { rerender } = renderHook(() => useCycleEffect(effect, [dep]))

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
      const { unmount } = renderHook(() => useCycleEffect(effect, [1, 2]))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })
})
