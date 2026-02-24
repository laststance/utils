import { describe, it, expect } from 'vitest'

import { isNullish } from './isNullish'

describe('isNullish', () => {
  it('should return true when pass undefined', () => {
    expect(isNullish(undefined)).toBe(true)
  })
  it('should return true when pass null', () => {
    expect(isNullish(null)).toBe(true)
  })
  it('should return false when pass false', () => {
    expect(isNullish(false)).toBe(false)
  })
  it('should return false when pass ""', () => {
    expect(isNullish('')).toBe(false)
  })
})
