import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import z from 'zod'

describe('noempty zodPlayground', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('basic array schema (allows empty)', () => {
    const schema = z.object({
      numArr: z.array(z.number()),
    })

    it('should allow empty arrays', () => {
      const result = schema.safeParse({ numArr: [] })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ numArr: [] })
      }
    })

    it('should allow non-empty arrays', () => {
      const result = schema.safeParse({ numArr: [1, 2, 3] })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ numArr: [1, 2, 3] })
      }
    })

    it('should validate array element types', () => {
      const result = schema.safeParse({ numArr: [1, 'invalid', 3] })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].code).toBe('invalid_type')
        expect(result.error.issues[0].path).toEqual(['numArr', 1])
      }
    })

    it('should reject non-array values', () => {
      const result = schema.safeParse({ numArr: 'not-an-array' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        const issue = result.error.issues[0]
        if (issue.code === 'invalid_type') {
          expect(issue.expected).toBe('array')
        }
      }
    })

    it('should require numArr property', () => {
      const result = schema.safeParse({})

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        expect(result.error.issues[0].path).toEqual(['numArr'])
      }
    })
  })

  describe('nonempty array schema', () => {
    const schemaNoemptySchema = z.object({
      numArr: z.array(z.number()).nonempty(),
    })

    it('should reject empty arrays', () => {
      const result = schemaNoemptySchema.safeParse({ numArr: [] })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].code).toBe('too_small')
        expect(result.error.issues[0].path).toEqual(['numArr'])
        const issue = result.error.issues[0]
        if (issue.code === 'too_small') {
          expect(issue.minimum).toBe(1)
        }
      }
    })

    it('should allow single element arrays', () => {
      const result = schemaNoemptySchema.safeParse({ numArr: [42] })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ numArr: [42] })
      }
    })

    it('should allow multiple element arrays', () => {
      const result = schemaNoemptySchema.safeParse({ numArr: [1, 2, 3, 4, 5] })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ numArr: [1, 2, 3, 4, 5] })
      }
    })

    it('should still validate element types in non-empty arrays', () => {
      const result = schemaNoemptySchema.safeParse({ numArr: [1, 'invalid'] })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        expect(result.error.issues[0].path).toEqual(['numArr', 1])
      }
    })

    it('should have appropriate error message for empty arrays', () => {
      const result = schemaNoemptySchema.safeParse({ numArr: [] })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('least 1 element')
      }
    })
  })

  describe('schema comparison behavior', () => {
    const regularSchema = z.object({
      numArr: z.array(z.number()),
    })

    const nonemptySchema = z.object({
      numArr: z.array(z.number()).nonempty(),
    })

    it('should show different behavior for empty arrays', () => {
      const emptyArray = { numArr: [] }

      const regularResult = regularSchema.safeParse(emptyArray)
      const nonemptyResult = nonemptySchema.safeParse(emptyArray)

      expect(regularResult.success).toBe(true)
      expect(nonemptyResult.success).toBe(false)
    })

    it('should show same behavior for valid non-empty arrays', () => {
      const validArray = { numArr: [1, 2, 3] }

      const regularResult = regularSchema.safeParse(validArray)
      const nonemptyResult = nonemptySchema.safeParse(validArray)

      expect(regularResult.success).toBe(true)
      expect(nonemptyResult.success).toBe(true)

      if (regularResult.success && nonemptyResult.success) {
        expect(regularResult.data).toEqual(nonemptyResult.data)
      }
    })

    it('should show same behavior for invalid types', () => {
      const invalidData = { numArr: 'not-an-array' }

      const regularResult = regularSchema.safeParse(invalidData)
      const nonemptyResult = nonemptySchema.safeParse(invalidData)

      expect(regularResult.success).toBe(false)
      expect(nonemptyResult.success).toBe(false)
    })
  })

  describe('edge cases and error handling', () => {
    const nonemptySchema = z.object({
      numArr: z.array(z.number()).nonempty(),
    })

    it('should handle null arrays', () => {
      const result = nonemptySchema.safeParse({ numArr: null })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        const issue = result.error.issues[0]
        if (issue.code === 'invalid_type') {
          expect(issue.received).toBe('null')
        }
      }
    })

    it('should handle undefined arrays', () => {
      const result = nonemptySchema.safeParse({ numArr: undefined })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        const issue = result.error.issues[0]
        if (issue.code === 'invalid_type') {
          expect(issue.received).toBe('undefined')
        }
      }
    })

    it('should handle arrays with mixed valid/invalid types', () => {
      const result = nonemptySchema.safeParse({
        numArr: [1, 2, 'invalid', null, 5, undefined],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        // Should have multiple validation errors
        expect(result.error.issues.length).toBeGreaterThan(1)

        // Check for string error
        const stringError = result.error.issues.find(
          (issue) => issue.path.length === 2 && issue.path[1] === 2,
        )
        expect(stringError?.code).toBe('invalid_type')
        if (stringError?.code === 'invalid_type') {
          expect(stringError.received).toBe('string')
        }

        // Check for null error
        const nullError = result.error.issues.find(
          (issue) => issue.path.length === 2 && issue.path[1] === 3,
        )
        expect(nullError?.code).toBe('invalid_type')
        if (nullError?.code === 'invalid_type') {
          expect(nullError.received).toBe('null')
        }
      }
    })

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i)
      const result = nonemptySchema.safeParse({ numArr: largeArray })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.numArr).toHaveLength(10000)
        expect(result.data.numArr[0]).toBe(0)
        expect(result.data.numArr[9999]).toBe(9999)
      }
    })

    it('should handle arrays with special number values', () => {
      const specialNumbers = [
        0,
        -0,
        1,
        -1,
        Infinity,
        -Infinity,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ]

      const result = nonemptySchema.safeParse({ numArr: specialNumbers })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.numArr).toEqual(specialNumbers)
      }
    })

    it('should reject arrays with NaN values', () => {
      const result = nonemptySchema.safeParse({ numArr: [1, NaN, 3] })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type')
        const issue = result.error.issues[0]
        if (issue.code === 'invalid_type') {
          expect(issue.received).toBe('nan')
        }
        expect(result.error.issues[0].path).toEqual(['numArr', 1])
      }
    })
  })

  describe('type safety and inference', () => {
    const regularSchema = z.object({
      numArr: z.array(z.number()),
    })

    const nonemptySchema = z.object({
      numArr: z.array(z.number()).nonempty(),
    })

    it('should infer correct types for regular schema', () => {
      type RegularType = z.infer<typeof regularSchema>

      const validData: RegularType = { numArr: [] }
      const result = regularSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should infer correct types for nonempty schema', () => {
      type NonemptyType = z.infer<typeof nonemptySchema>

      // TypeScript should allow this assignment
      const validData: NonemptyType = { numArr: [1, 2, 3] }
      const result = nonemptySchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('should work with parse instead of safeParse for valid data', () => {
      const validData = { numArr: [1, 2, 3] }

      expect(() => regularSchema.parse(validData)).not.toThrow()
      expect(() => nonemptySchema.parse(validData)).not.toThrow()

      const regularParsed = regularSchema.parse(validData)
      const nonemptyParsed = nonemptySchema.parse(validData)

      expect(regularParsed).toEqual(validData)
      expect(nonemptyParsed).toEqual(validData)
    })

    it('should throw for parse with invalid data', () => {
      const invalidData = { numArr: [] }

      expect(() => regularSchema.parse(invalidData)).not.toThrow()
      expect(() => nonemptySchema.parse(invalidData)).toThrow()
    })
  })

  describe('performance considerations', () => {
    const nonemptySchema = z.object({
      numArr: z.array(z.number()).nonempty(),
    })

    it('should handle validation performance for large valid arrays', () => {
      const largeValidArray = {
        numArr: Array.from({ length: 1000 }, (_, i) => i),
      }

      const startTime = performance.now()
      const result = nonemptySchema.safeParse(largeValidArray)
      const endTime = performance.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(300) // Should be reasonably fast
    })

    it('should handle validation performance for arrays with errors', () => {
      const arrayWithErrors = {
        numArr: Array.from({ length: 100 }, (_, i) =>
          i % 10 === 0 ? 'invalid' : i,
        ),
      }

      const startTime = performance.now()
      const result = nonemptySchema.safeParse(arrayWithErrors)
      const endTime = performance.now()

      expect(result.success).toBe(false)
      expect(endTime - startTime).toBeLessThan(100) // Should still be reasonably fast
    })
  })
})
