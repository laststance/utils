import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import useUpdateEffect from './use-update-effect'

describe('useUpdateEffect', () => {
  it('simulates componentDidUpdate', () => {
    const effect = vi.fn()
    const { rerender } = renderHook(() => useUpdateEffect(effect))

    expect(effect).toHaveBeenCalledTimes(0)
    rerender()
    expect(effect).toHaveBeenCalledTimes(1)
    rerender()
    expect(effect).toHaveBeenCalledTimes(2)
    rerender()
    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('simulates componentDidUpdate with single dependency change', () => {
    const effect = vi.fn()
    let num = 0
    const { rerender } = renderHook(() => useUpdateEffect(effect, [num]))

    expect(effect).toHaveBeenCalledTimes(0)
    num = 5
    rerender()
    expect(effect).toHaveBeenCalledTimes(1)
    num++
    rerender()
    expect(effect).toHaveBeenCalledTimes(2)
    num = 0
    rerender()
    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('does not run when the dependency identity is unchanged', () => {
    const effect = vi.fn()
    const stableValue = 'stable'
    const { rerender } = renderHook(() =>
      useUpdateEffect(effect, [stableValue]),
    )

    expect(effect).not.toHaveBeenCalled()
    rerender()
    rerender()
    expect(effect).not.toHaveBeenCalled()
  })

  it('simulates componentDidUpdate with multiple dependency change', () => {
    const effect = vi.fn()
    let arg1 = { like: false }
    let arg2 = 0
    const { rerender } = renderHook(() => useUpdateEffect(effect, [arg1, arg2]))

    expect(effect).toHaveBeenCalledTimes(0)
    rerender()
    expect(effect).toHaveBeenCalledTimes(0)
    arg1.like = true
    rerender()
    expect(effect).toHaveBeenCalledTimes(0)
    arg1 = { like: true }
    rerender()
    expect(effect).toHaveBeenCalledTimes(1)
    arg2++
    rerender()
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('should not run effect on initial render', () => {
    const effect = vi.fn()
    renderHook(() => useUpdateEffect(effect))

    expect(effect).toHaveBeenCalledTimes(0)
  })

  it('should not run effect on initial render with single dependency change', () => {
    const effect = vi.fn()
    renderHook(() => useUpdateEffect(effect, [1]))

    expect(effect).toHaveBeenCalledTimes(0)
  })

  it('runs cleanup before the next update effect and on unmount', () => {
    const cleanup = vi.fn()
    const effect = vi.fn(() => cleanup)
    let value = 0
    const { rerender, unmount } = renderHook(() =>
      useUpdateEffect(effect, [value]),
    )

    expect(effect).not.toHaveBeenCalled()
    expect(cleanup).not.toHaveBeenCalled()

    value = 1
    rerender()
    expect(effect).toHaveBeenCalledOnce()
    expect(cleanup).not.toHaveBeenCalled()

    value = 2
    rerender()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(effect).toHaveBeenCalledTimes(2)

    unmount()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('rejects empty dependency lists at the type level', () => {
    const effect = vi.fn()
    renderHook(() =>
      // @ts-expect-error - omit deps for every update, or pass non-empty deps.
      useUpdateEffect(effect, []),
    )

    expect(effect).not.toHaveBeenCalled()
  })
})
