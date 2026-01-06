import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useUnmountEffect } from './use-unmount-effect'

describe('useUnmountEffect', () => {
  it('call callcack once when unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useUnmountEffect(callback))
    unmount()
    expect(callback).toHaveBeenCalledOnce()
  })
  it('not call callback with mount', () => {
    const callback = vi.fn()
    renderHook(() => useUnmountEffect(callback))

    expect(callback).not.toHaveBeenCalledOnce()
  })
})
