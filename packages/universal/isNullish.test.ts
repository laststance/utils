import { describe, it, expect } from 'vitest'

import { isNullish } from './isNullish'

describe('isNullish', () => {
  it('should return true pass undefined', () => {
    expect(isNullish(undefined)).toBe(true)
  })
  it('should return true pass null', () => {
    expect(isNullish(null)).toBe(true)
  })
})
