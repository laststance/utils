import { describe, it, expect } from 'vitest'

import { isFalsy } from './isFalsy.js'

describe('isFalsy', () => {
  it('should return true for false', () => {
    expect(isFalsy(false)).toBe(true)
  })

  it('should return true for 0', () => {
    expect(isFalsy(0)).toBe(true)
  })

  it('should return true for negative zero (-0)', () => {
    expect(isFalsy(-0)).toBe(true)
  })

  it('should return true for BigInt zero (0n)', () => {
    expect(isFalsy(0n)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isFalsy('')).toBe(true)
  })

  it('should return true for null', () => {
    expect(isFalsy(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isFalsy(undefined)).toBe(true)
  })

  it('should return true for NaN', () => {
    expect(isFalsy(NaN)).toBe(true)
  })

  it('should return false for truthy values', () => {
    expect(isFalsy(1)).toBe(false)
    expect(isFalsy('hello')).toBe(false)
    expect(isFalsy({})).toBe(false)
    expect(isFalsy([])).toBe(false)
    expect(isFalsy(() => {})).toBe(false)
    expect(isFalsy(true)).toBe(false)
    expect(isFalsy(1n)).toBe(false)
  })
})
