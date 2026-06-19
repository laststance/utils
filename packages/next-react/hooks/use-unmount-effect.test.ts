import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useUnmountEffect } from './use-unmount-effect'

describe('useUnmountEffect', () => {
  it('calls the callback once when unmounting', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useUnmountEffect(callback))

    unmount()

    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not call the callback on mount', () => {
    const callback = vi.fn()
    renderHook(() => useUnmountEffect(callback))

    expect(callback).not.toHaveBeenCalled()
  })

  it('uses the latest callback when unmounting after a re-render', () => {
    const initialCallback = vi.fn()
    const latestCallback = vi.fn()
    let callback = initialCallback
    const { rerender, unmount } = renderHook(() => useUnmountEffect(callback))

    callback = latestCallback
    rerender()
    unmount()

    expect(initialCallback).not.toHaveBeenCalled()
    expect(latestCallback).toHaveBeenCalledOnce()
  })
})
