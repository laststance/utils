import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import z from 'zod'

describe('nullish zodPlayground', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('nullish schema definition', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should be defined correctly', () => {
      expect(schema).toBeDefined()
      expect(typeof schema.safeParse).toBe('function')
    })

    it('should accept valid objects', () => {
      const validData = {
        nameList: ['Alice', 'Bob'],
        age: 25
      }
      
      const result = schema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should accept null values due to nullish()', () => {
      const result = schema.safeParse(null)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(null)
      }
    })

    it('should accept undefined values due to nullish()', () => {
      const result = schema.safeParse(undefined)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(undefined)
      }
    })

    it('should reject invalid objects and provide field errors', () => {
      const invalidData = { age: 9 } // Missing nameList, age too low
      
      const result = schema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const flattenedErrors = result.error.flatten().fieldErrors
        
        // Should have errors for both missing nameList and invalid age
        expect(flattenedErrors.nameList).toBeDefined()
        expect(flattenedErrors.age).toBeDefined()
        
        // Age error should have custom message
        expect(flattenedErrors.age).toContain('age should be greater than 10')
      }
    })
  })

  describe('age validation with custom message', () => {
    const ageSchema = z.number().gt(10, { message: 'age should be greater than 10' })

    it('should pass for ages greater than 10', () => {
      const validAges = [11, 15, 20, 100, 999]
      
      validAges.forEach(age => {
        const result = ageSchema.safeParse(age)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(age)
        }
      })
    })

    it('should fail for ages equal to or less than 10', () => {
      const invalidAges = [10, 9, 5, 0, -1, -100]
      
      invalidAges.forEach(age => {
        const result = ageSchema.safeParse(age)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('age should be greater than 10')
        }
      })
    })

    it('should handle edge case: exactly 10', () => {
      const result = ageSchema.safeParse(10)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('age should be greater than 10')
        expect(result.error.issues[0].code).toBe('too_small')
      }
    })

    it('should handle non-number inputs', () => {
      const nonNumbers = ['10', true, [], {}, null, undefined]
      
      nonNumbers.forEach(input => {
        const result = ageSchema.safeParse(input)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type')
        }
      })
    })

    it('should handle special number values', () => {
      const specialNumbers = [
        { value: 11.5, shouldPass: true },
        { value: Infinity, shouldPass: true },
        { value: -Infinity, shouldPass: false },
        { value: NaN, shouldPass: false }
      ]
      
      specialNumbers.forEach(({ value, shouldPass }) => {
        const result = ageSchema.safeParse(value)
        expect(result.success).toBe(shouldPass)
      })
    })
  })

  describe('nameList array validation', () => {
    const nameListSchema = z.array(z.string())

    it('should accept valid string arrays', () => {
      const validArrays = [
        [],
        ['Alice'],
        ['Alice', 'Bob', 'Charlie'],
        ['', 'name with spaces', 'name-with-dashes', 'name_with_underscores']
      ]
      
      validArrays.forEach(array => {
        const result = nameListSchema.safeParse(array)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(array)
        }
      })
    })

    it('should reject arrays with non-string elements', () => {
      const invalidArrays = [
        [1, 2, 3],
        ['Alice', 123, 'Bob'],
        [true, false],
        [null, undefined],
        [{}],
        [[]]
      ]
      
      invalidArrays.forEach(array => {
        const result = nameListSchema.safeParse(array)
        expect(result.success).toBe(false)
      })
    })

    it('should reject non-array inputs', () => {
      const nonArrays = ['string', 123, true, {}, null, undefined]
      
      nonArrays.forEach(input => {
        const result = nameListSchema.safeParse(input)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type')
          const issue = result.error.issues[0]
          if (issue.code === 'invalid_type') {
            expect(issue.expected).toBe('array')
          }
        }
      })
    })
  })

  describe('full schema validation scenarios', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should handle the example case from the playground', () => {
      const exampleData = { age: 9 }
      
      const result = schema.safeParse(exampleData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const flattenedErrors = result.error.flatten().fieldErrors
        
        // Should match the playground example output
        expect(flattenedErrors.nameList).toBeDefined()
        expect(flattenedErrors.age).toContain('age should be greater than 10')
      }
    })

    it('should handle complete valid objects', () => {
      const validObjects = [
        {
          nameList: ['Alice', 'Bob'],
          age: 25
        },
        {
          nameList: [],
          age: 11
        },
        {
          nameList: ['Single Name'],
          age: 100
        }
      ]
      
      validObjects.forEach(obj => {
        const result = schema.safeParse(obj)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(obj)
        }
      })
    })

    it('should handle objects with multiple validation errors', () => {
      const invalidObjects = [
        {
          nameList: 'not-an-array',
          age: 5
        },
        {
          nameList: [123, 'valid', null],
          age: 'not-a-number'
        },
        {
          // Missing both properties
        }
      ]
      
      invalidObjects.forEach(obj => {
        const result = schema.safeParse(obj)
        expect(result.success).toBe(false)
        if (!result.success) {
          const flattenedErrors = result.error.flatten().fieldErrors
          expect(Object.keys(flattenedErrors).length).toBeGreaterThan(0)
        }
      })
    })

    it('should provide detailed error paths for nested validation', () => {
      const dataWithNestedErrors = {
        nameList: ['valid', 123, 'also-valid', null, true],
        age: 'not-a-number'
      }
      
      const result = schema.safeParse(dataWithNestedErrors)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues
        
        // Should have multiple errors
        expect(issues.length).toBeGreaterThan(1)
        
        // Check for age error
        const ageError = issues.find(issue => 
          issue.path.length === 1 && issue.path[0] === 'age'
        )
        expect(ageError?.code).toBe('invalid_type')
        
        // Check for nameList element errors
        const nameListErrors = issues.filter(issue => 
          issue.path.length === 2 && issue.path[0] === 'nameList'
        )
        expect(nameListErrors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('nullish behavior edge cases', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should distinguish between null, undefined, and missing values', () => {
      const testCases = [
        { input: null, shouldPass: true, expectedData: null },
        { input: undefined, shouldPass: true, expectedData: undefined },
        { input: {}, shouldPass: false }, // Missing required properties
      ]
      
      testCases.forEach(({ input, shouldPass, expectedData }) => {
        const result = schema.safeParse(input)
        expect(result.success).toBe(shouldPass)
        
        if (shouldPass && result.success) {
          expect(result.data).toBe(expectedData)
        }
      })
    })

    it('should handle mixed valid/invalid properties in objects', () => {
      const mixedData = {
        nameList: ['valid', 'names'],
        age: 5 // Invalid: too low
      }
      
      const result = schema.safeParse(mixedData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const flattenedErrors = result.error.flatten().fieldErrors
        
        // Should only have error for age, not nameList
        expect(flattenedErrors.nameList).toBeUndefined()
        expect(flattenedErrors.age).toBeDefined()
        expect(flattenedErrors.age).toContain('age should be greater than 10')
      }
    })
  })

  describe('error formatting and debugging', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should provide flatten().fieldErrors format as shown in playground', () => {
      const invalidData = { age: 9 }
      
      const result = schema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors
        
        expect(typeof fieldErrors).toBe('object')
        expect(fieldErrors).not.toBeNull()
        
        // Should have string array values for each field
        if (fieldErrors.nameList) {
          expect(Array.isArray(fieldErrors.nameList)).toBe(true)
        }
        if (fieldErrors.age) {
          expect(Array.isArray(fieldErrors.age)).toBe(true)
        }
      }
    })

    it('should provide formatted errors that are useful for debugging', () => {
      const problematicData = {
        nameList: [1, 2, 3], // Wrong type
        age: 'twenty' // Wrong type
      }
      
      const result = schema.safeParse(problematicData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors
        
        // Age should have the custom message
        expect(fieldErrors.age).toBeDefined()
        
        // nameList should have type validation errors
        expect(fieldErrors.nameList).toBeDefined()
      }
    })

    it('should handle complex error scenarios', () => {
      const complexInvalidData = {
        nameList: ['valid', null, 123, 'also-valid', false],
        age: -5,
        extraProperty: 'should-be-ignored' // Extra properties are typically stripped
      }
      
      const result = schema.safeParse(complexInvalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues
        expect(issues.length).toBeGreaterThan(0)
        
        // Should have detailed path information
        issues.forEach(issue => {
          expect(issue.path).toBeDefined()
          expect(Array.isArray(issue.path)).toBe(true)
        })
      }
    })
  })

  describe('performance and memory considerations', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should handle large name lists efficiently', () => {
      const largeNameList = Array.from({ length: 1000 }, (_, i) => `Name${i}`)
      const data = {
        nameList: largeNameList,
        age: 25
      }
      
      const startTime = performance.now()
      const result = schema.safeParse(data)
      const endTime = performance.now()
      
      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should be reasonably fast
    })

    it('should handle validation errors efficiently', () => {
      const largeInvalidNameList = Array.from({ length: 100 }, (_, i) => 
        i % 2 === 0 ? `Name${i}` : i // Mix valid strings with numbers
      )
      const data = {
        nameList: largeInvalidNameList,
        age: 5
      }
      
      const startTime = performance.now()
      const result = schema.safeParse(data)
      const endTime = performance.now()
      
      expect(result.success).toBe(false)
      expect(endTime - startTime).toBeLessThan(200) // Should still be reasonably fast
    })
  })

  describe('type inference and TypeScript integration', () => {
    const schema = z
      .object({
        nameList: z.array(z.string()),
        age: z.number().gt(10, { message: 'age should be greater than 10' }),
      })
      .nullish()

    it('should infer correct types', () => {
      type SchemaType = z.infer<typeof schema>
      
      // These should all be valid TypeScript assignments
      const validData1: SchemaType = {
        nameList: ['Alice', 'Bob'],
        age: 25
      }
      
      const validData2: SchemaType = null
      const validData3: SchemaType = undefined
      
      expect(schema.safeParse(validData1).success).toBe(true)
      expect(schema.safeParse(validData2).success).toBe(true)
      expect(schema.safeParse(validData3).success).toBe(true)
    })

    it('should work with parse() method for valid data', () => {
      const validData = {
        nameList: ['Alice', 'Bob'],
        age: 25
      }
      
      expect(() => schema.parse(validData)).not.toThrow()
      expect(() => schema.parse(null)).not.toThrow()
      expect(() => schema.parse(undefined)).not.toThrow()
      
      const parsed = schema.parse(validData)
      expect(parsed).toEqual(validData)
    })

    it('should throw with parse() method for invalid data', () => {
      const invalidData = { age: 9 }
      
      expect(() => schema.parse(invalidData)).toThrow()
    })
  })
})