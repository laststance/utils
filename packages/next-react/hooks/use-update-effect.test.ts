import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import useUpdateEffect from './use-update-effect'

describe('useUpdateEffect ', () => {
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
})
