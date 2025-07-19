import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import z from 'zod'

describe('or zodPlayground', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('zod import functionality', () => {
    it('should import zod successfully', () => {
      expect(z).toBeDefined()
      expect(typeof z.string).toBe('function')
      expect(typeof z.number).toBe('function')
      expect(typeof z.object).toBe('function')
    })

    it('should have core zod methods available', () => {
      const expectedMethods = [
        'string',
        'number',
        'boolean',
        'array',
        'object',
        'union',
        'enum',
        'literal',
        'null',
        'undefined',
      ]

      expectedMethods.forEach((method) => {
        expect(z).toHaveProperty(method)
        expect(typeof z[method as keyof typeof z]).toBe('function')
      })
    })
  })

  describe('zod or/union functionality examples', () => {
    it('should demonstrate union types with z.union()', () => {
      const stringOrNumber = z.union([z.string(), z.number()])

      const validInputs = ['hello', 42, '', 0, -1, 3.14]
      const invalidInputs = [true, null, undefined, {}, []]

      validInputs.forEach((input) => {
        const result = stringOrNumber.safeParse(input)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(input)
        }
      })

      invalidInputs.forEach((input) => {
        const result = stringOrNumber.safeParse(input)
        expect(result.success).toBe(false)
      })
    })

    it('should demonstrate or() method with schemas', () => {
      const stringOrNumber = z.string().or(z.number())

      expect(stringOrNumber.safeParse('hello').success).toBe(true)
      expect(stringOrNumber.safeParse(42).success).toBe(true)
      expect(stringOrNumber.safeParse(true).success).toBe(false)
    })

    it('should handle complex union types', () => {
      const userSchema = z.object({
        id: z.number(),
        name: z.string(),
      })

      const adminSchema = z.object({
        id: z.number(),
        name: z.string(),
        permissions: z.array(z.string()),
      })

      const userOrAdmin = userSchema.or(adminSchema)

      const regularUser = { id: 1, name: 'John' }
      const adminUser = { id: 2, name: 'Jane', permissions: ['read', 'write'] }

      expect(userOrAdmin.safeParse(regularUser).success).toBe(true)
      expect(userOrAdmin.safeParse(adminUser).success).toBe(true)
      expect(userOrAdmin.safeParse({ id: 1 }).success).toBe(false)
    })

    it('should demonstrate multiple union options', () => {
      const multiUnion = z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
      ])

      const validValues = ['string', 123, true, false, null, '', 0]

      validValues.forEach((value) => {
        const result = multiUnion.safeParse(value)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(value)
        }
      })

      const invalidValues = [undefined, {}, [], new Date()]

      invalidValues.forEach((value) => {
        const result = multiUnion.safeParse(value)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('discriminated unions', () => {
    it('should handle discriminated unions with literal types', () => {
      const shapeSchema = z.discriminatedUnion('type', [
        z.object({
          type: z.literal('circle'),
          radius: z.number(),
        }),
        z.object({
          type: z.literal('rectangle'),
          width: z.number(),
          height: z.number(),
        }),
      ])

      const circle = { type: 'circle' as const, radius: 5 }
      const rectangle = { type: 'rectangle' as const, width: 10, height: 20 }
      const invalid = { type: 'triangle', sides: 3 }

      expect(shapeSchema.safeParse(circle).success).toBe(true)
      expect(shapeSchema.safeParse(rectangle).success).toBe(true)
      expect(shapeSchema.safeParse(invalid).success).toBe(false)
    })

    it('should provide specific error messages for discriminated unions', () => {
      const eventSchema = z.discriminatedUnion('eventType', [
        z.object({
          eventType: z.literal('click'),
          target: z.string(),
        }),
        z.object({
          eventType: z.literal('scroll'),
          position: z.number(),
        }),
      ])

      const invalidEvent = { eventType: 'hover', element: 'button' }
      const result = eventSchema.safeParse(invalidEvent)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union_discriminator')
      }
    })
  })

  describe('literal unions and enums', () => {
    it('should handle literal value unions', () => {
      const statusSchema = z.union([
        z.literal('pending'),
        z.literal('approved'),
        z.literal('rejected'),
      ])

      expect(statusSchema.safeParse('pending').success).toBe(true)
      expect(statusSchema.safeParse('approved').success).toBe(true)
      expect(statusSchema.safeParse('rejected').success).toBe(true)
      expect(statusSchema.safeParse('invalid').success).toBe(false)
    })

    it('should handle enum schemas as alternative to unions', () => {
      const statusEnum = z.enum(['pending', 'approved', 'rejected'])

      expect(statusEnum.safeParse('pending').success).toBe(true)
      expect(statusEnum.safeParse('approved').success).toBe(true)
      expect(statusEnum.safeParse('rejected').success).toBe(true)
      expect(statusEnum.safeParse('invalid').success).toBe(false)
    })

    it('should handle numeric literal unions', () => {
      const versionSchema = z.union([z.literal(1), z.literal(2), z.literal(3)])

      expect(versionSchema.safeParse(1).success).toBe(true)
      expect(versionSchema.safeParse(2).success).toBe(true)
      expect(versionSchema.safeParse(3).success).toBe(true)
      expect(versionSchema.safeParse(4).success).toBe(false)
      expect(versionSchema.safeParse('1').success).toBe(false) // String vs number
    })
  })

  describe('optional and nullable with or', () => {
    it('should handle optional fields with or patterns', () => {
      const configSchema = z.object({
        host: z.string(),
        port: z.number().or(z.string()), // Port can be number or string
        ssl: z.boolean().optional(),
      })

      const validConfigs = [
        { host: 'localhost', port: 3000 },
        { host: 'localhost', port: '3000' },
        { host: 'localhost', port: 3000, ssl: true },
        { host: 'localhost', port: '3000', ssl: false },
      ]

      validConfigs.forEach((config) => {
        const result = configSchema.safeParse(config)
        expect(result.success).toBe(true)
      })
    })

    it('should handle nullable or undefined patterns', () => {
      const optionalString = z.string().or(z.null()).or(z.undefined())

      expect(optionalString.safeParse('hello').success).toBe(true)
      expect(optionalString.safeParse(null).success).toBe(true)
      expect(optionalString.safeParse(undefined).success).toBe(true)
      expect(optionalString.safeParse(123).success).toBe(false)
    })

    it('should handle nullish as alternative to or patterns', () => {
      const nullishString = z.string().nullish() // Equivalent to .or(z.null()).or(z.undefined())

      expect(nullishString.safeParse('hello').success).toBe(true)
      expect(nullishString.safeParse(null).success).toBe(true)
      expect(nullishString.safeParse(undefined).success).toBe(true)
      expect(nullishString.safeParse(123).success).toBe(false)
    })
  })

  describe('error handling and type inference', () => {
    it('should provide clear error messages for union failures', () => {
      const stringOrNumberSchema = z.string().or(z.number())
      const result = stringOrNumberSchema.safeParse(true)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        expect(result.error.issues[0].code).toBe('invalid_union')
      }
    })

    it('should infer correct types for unions', () => {
      const stringOrNumber = z.string().or(z.number())
      type StringOrNumber = z.infer<typeof stringOrNumber>

      // These should be valid TypeScript assignments
      const value1: StringOrNumber = 'hello'
      const value2: StringOrNumber = 42

      expect(stringOrNumber.safeParse(value1).success).toBe(true)
      expect(stringOrNumber.safeParse(value2).success).toBe(true)
    })

    it('should work with parse() method for valid union data', () => {
      const stringOrNumber = z.string().or(z.number())

      expect(() => stringOrNumber.parse('hello')).not.toThrow()
      expect(() => stringOrNumber.parse(42)).not.toThrow()
      expect(() => stringOrNumber.parse(true)).toThrow()

      expect(stringOrNumber.parse('hello')).toBe('hello')
      expect(stringOrNumber.parse(42)).toBe(42)
    })
  })

  describe('complex union scenarios', () => {
    it('should handle nested object unions', () => {
      const apiResponseSchema = z.union([
        z.object({
          success: z.literal(true),
          data: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
        z.object({
          success: z.literal(false),
          error: z.object({
            code: z.number(),
            message: z.string(),
          }),
        }),
      ])

      const successResponse = {
        success: true as const,
        data: { id: 1, name: 'John' },
      }

      const errorResponse = {
        success: false as const,
        error: { code: 404, message: 'Not found' },
      }

      expect(apiResponseSchema.safeParse(successResponse).success).toBe(true)
      expect(apiResponseSchema.safeParse(errorResponse).success).toBe(true)
    })

    it('should handle array unions', () => {
      const mixedArraySchema = z.union([
        z.array(z.string()),
        z.array(z.number()),
        z.array(z.boolean()),
      ])

      expect(mixedArraySchema.safeParse(['a', 'b', 'c']).success).toBe(true)
      expect(mixedArraySchema.safeParse([1, 2, 3]).success).toBe(true)
      expect(mixedArraySchema.safeParse([true, false]).success).toBe(true)
      expect(mixedArraySchema.safeParse(['mixed', 123]).success).toBe(false)
    })

    it('should handle function unions (if supported)', () => {
      // Zod doesn't typically handle functions, but we can test the concept
      const stringOrNumberOrBoolean = z.union([
        z.string(),
        z.number(),
        z.boolean(),
      ])

      const testValues = [
        { value: 'string', expected: true },
        { value: 123, expected: true },
        { value: true, expected: true },
        { value: false, expected: true },
        { value: null, expected: false },
        { value: undefined, expected: false },
        { value: {}, expected: false },
        { value: [], expected: false },
      ]

      testValues.forEach(({ value, expected }) => {
        const result = stringOrNumberOrBoolean.safeParse(value)
        expect(result.success).toBe(expected)
      })
    })
  })

  describe('performance considerations', () => {
    it('should handle large union types efficiently', () => {
      // Create a union with many literal options
      const options = Array.from({ length: 100 }, (_, i) =>
        z.literal(`option${i}`),
      )
      const largeUnion = z.union([options[0], options[1], ...options.slice(2)])

      const startTime = performance.now()
      const result = largeUnion.safeParse('option50')
      const endTime = performance.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast
    })

    it('should handle union validation errors efficiently', () => {
      const complexUnion = z.union([
        z.object({ type: z.literal('A'), valueA: z.string() }),
        z.object({ type: z.literal('B'), valueB: z.number() }),
        z.object({ type: z.literal('C'), valueC: z.boolean() }),
      ])

      const invalidData = { type: 'D', valueD: 'invalid' }

      const startTime = performance.now()
      const result = complexUnion.safeParse(invalidData)
      const endTime = performance.now()

      expect(result.success).toBe(false)
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast even for errors
    })
  })

  describe('real-world usage patterns', () => {
    it('should handle configuration object unions', () => {
      const databaseConfigSchema = z.union([
        z.object({
          type: z.literal('sqlite'),
          filename: z.string(),
        }),
        z.object({
          type: z.literal('postgres'),
          host: z.string(),
          port: z.number(),
          database: z.string(),
          username: z.string(),
          password: z.string(),
        }),
        z.object({
          type: z.literal('memory'),
          // No additional properties needed
        }),
      ])

      const configs = [
        { type: 'sqlite' as const, filename: 'db.sqlite' },
        {
          type: 'postgres' as const,
          host: 'localhost',
          port: 5432,
          database: 'myapp',
          username: 'user',
          password: 'pass',
        },
        { type: 'memory' as const },
      ]

      configs.forEach((config) => {
        const result = databaseConfigSchema.safeParse(config)
        expect(result.success).toBe(true)
      })
    })

    it('should handle API payload unions', () => {
      const apiPayloadSchema = z.union([
        z.object({
          action: z.literal('create'),
          data: z.object({
            name: z.string(),
            email: z.string().email(),
          }),
        }),
        z.object({
          action: z.literal('update'),
          id: z.number(),
          data: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
          }),
        }),
        z.object({
          action: z.literal('delete'),
          id: z.number(),
        }),
      ])

      const payloads = [
        {
          action: 'create' as const,
          data: { name: 'John', email: 'john@example.com' },
        },
        {
          action: 'update' as const,
          id: 1,
          data: { name: 'Jane' },
        },
        {
          action: 'delete' as const,
          id: 2,
        },
      ]

      payloads.forEach((payload) => {
        const result = apiPayloadSchema.safeParse(payload)
        expect(result.success).toBe(true)
      })
    })
  })
})
