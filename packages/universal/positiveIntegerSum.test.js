import { describe, it, expect } from 'vitest'
import { positiveIntegerSum } from './positiveIntegerSum.js'

describe('positiveIntegerSum', () => {
  it('should calculate sum of positive integers from 1 to n', () => {
    expect(positiveIntegerSum(1)).toBe(1)
    expect(positiveIntegerSum(3)).toBe(6) // 1 + 2 + 3 = 6
    expect(positiveIntegerSum(5)).toBe(15) // 1 + 2 + 3 + 4 + 5 = 15
    expect(positiveIntegerSum(10)).toBe(55) // 1 + 2 + ... + 10 = 55
  })

  it('should return false for zero', () => {
    expect(positiveIntegerSum(0)).toBe(false)
  })

  it('should return false for negative numbers', () => {
    expect(positiveIntegerSum(-1)).toBe(false)
    expect(positiveIntegerSum(-5)).toBe(false)
    expect(positiveIntegerSum(-10)).toBe(false)
  })

  it('should handle large numbers correctly', () => {
    expect(positiveIntegerSum(100)).toBe(5050) // sum of 1 to 100
    expect(positiveIntegerSum(20)).toBe(210) // sum of 1 to 20
  })

  it('should match mathematical formula n*(n+1)/2', () => {
    // The mathematical formula for sum of first n positive integers is n*(n+1)/2
    const testValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50]
    
    testValues.forEach(n => {
      const expected = (n * (n + 1)) / 2
      expect(positiveIntegerSum(n)).toBe(expected)
    })
  })

  it('should handle floating point numbers (treating them as their integer part)', () => {
    // Since the function uses n-- in a loop, it will work with floats
    expect(positiveIntegerSum(3.7)).toBe(6) // treats as 3
    expect(positiveIntegerSum(5.9)).toBe(15) // treats as 5
  })

  it('should handle edge case of very small positive decimal', () => {
    expect(positiveIntegerSum(0.5)).toBe(false) // 0.5 > 0 but loop doesn't execute
  })
})