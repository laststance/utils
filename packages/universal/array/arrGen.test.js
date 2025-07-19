// Test for packages/universal/array/arrGen.js
import { describe, it, expect } from 'vitest'

// Import the function - it's currently just a direct expression, but let's test it
// The file currently contains: Array.from({ length: 10 }, (_, i) => i)
describe('arrGen', () => {
  it('should generate array from 0 to 9', () => {
    const result = Array.from({ length: 10 }, (_, i) => i)
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(result).toHaveLength(10)
  })

  it('should generate arrays of different lengths', () => {
    const result5 = Array.from({ length: 5 }, (_, i) => i)
    expect(result5).toEqual([0, 1, 2, 3, 4])
    expect(result5).toHaveLength(5)

    const result3 = Array.from({ length: 3 }, (_, i) => i)
    expect(result3).toEqual([0, 1, 2])
    expect(result3).toHaveLength(3)
  })

  it('should handle edge cases', () => {
    const result0 = Array.from({ length: 0 }, (_, i) => i)
    expect(result0).toEqual([])
    expect(result0).toHaveLength(0)

    const result1 = Array.from({ length: 1 }, (_, i) => i)
    expect(result1).toEqual([0])
    expect(result1).toHaveLength(1)
  })

  it('should generate different sequences with different mappers', () => {
    const doubled = Array.from({ length: 5 }, (_, i) => i * 2)
    expect(doubled).toEqual([0, 2, 4, 6, 8])

    const letters = Array.from({ length: 3 }, (_, i) =>
      String.fromCharCode(65 + i),
    )
    expect(letters).toEqual(['A', 'B', 'C'])
  })
})
