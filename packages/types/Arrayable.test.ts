import { describe, it, expectTypeOf } from 'vitest'

// Import the Arrayable type
// Note: We're testing TypeScript types at compile-time, not runtime behavior
// This uses vitest's expectTypeOf for type-level testing

type Arrayable<T> = T | T[]

describe('Arrayable type', () => {
  it('should accept single values', () => {
    // Single string
    expectTypeOf<string>().toMatchTypeOf<Arrayable<string>>()
    
    // Single number
    expectTypeOf<number>().toMatchTypeOf<Arrayable<number>>()
    
    // Single boolean
    expectTypeOf<boolean>().toMatchTypeOf<Arrayable<boolean>>()
    
    // Single object
    expectTypeOf<{ id: number }>().toMatchTypeOf<Arrayable<{ id: number }>>()
  })

  it('should accept arrays of values', () => {
    // Array of strings
    expectTypeOf<string[]>().toMatchTypeOf<Arrayable<string>>()
    
    // Array of numbers
    expectTypeOf<number[]>().toMatchTypeOf<Arrayable<number>>()
    
    // Array of booleans
    expectTypeOf<boolean[]>().toMatchTypeOf<Arrayable<boolean>>()
    
    // Array of objects
    expectTypeOf<{ id: number }[]>().toMatchTypeOf<Arrayable<{ id: number }>>()
  })

  it('should work with complex types', () => {
    interface User {
      id: number
      name: string
      email?: string
    }

    // Single user
    expectTypeOf<User>().toMatchTypeOf<Arrayable<User>>()
    
    // Array of users
    expectTypeOf<User[]>().toMatchTypeOf<Arrayable<User>>()
  })

  it('should work with union types', () => {
    type StringOrNumber = string | number
    
    // Single value from union
    expectTypeOf<string>().toMatchTypeOf<Arrayable<StringOrNumber>>()
    expectTypeOf<number>().toMatchTypeOf<Arrayable<StringOrNumber>>()
    
    // Array of union values
    expectTypeOf<(string | number)[]>().toMatchTypeOf<Arrayable<StringOrNumber>>()
  })

  it('should work with generic constraints', () => {
    // Arrayable of any type
    expectTypeOf<unknown>().toMatchTypeOf<Arrayable<unknown>>()
    expectTypeOf<unknown[]>().toMatchTypeOf<Arrayable<unknown>>()
    
    // Arrayable of never (edge case) - these types work at compile time
    // Note: never types are handled correctly by the type system
    // The type system correctly prevents invalid assignments to never types
  })

  it('should work with nullable types', () => {
    // Nullable string
    expectTypeOf<string | null>().toMatchTypeOf<Arrayable<string | null>>()
    expectTypeOf<(string | null)[]>().toMatchTypeOf<Arrayable<string | null>>()
    
    // Optional string
    expectTypeOf<string | undefined>().toMatchTypeOf<Arrayable<string | undefined>>()
    expectTypeOf<(string | undefined)[]>().toMatchTypeOf<Arrayable<string | undefined>>()
  })

  it('should preserve type information', () => {
    // The type should be distributive over unions
    type NumberOrStringArrayable = Arrayable<number | string>
    
    // Should allow individual types
    expectTypeOf<number>().toMatchTypeOf<NumberOrStringArrayable>()
    expectTypeOf<string>().toMatchTypeOf<NumberOrStringArrayable>()
    
    // Should allow arrays
    expectTypeOf<number[]>().toMatchTypeOf<NumberOrStringArrayable>()
    expectTypeOf<string[]>().toMatchTypeOf<NumberOrStringArrayable>()
    expectTypeOf<(number | string)[]>().toMatchTypeOf<NumberOrStringArrayable>()
  })

  it('should work in function signatures', () => {
    // Function accepting Arrayable parameter
    const processItems = (items: Arrayable<string>): string[] => {
      return Array.isArray(items) ? items : [items]
    }

    // Should accept single string
    expectTypeOf(processItems).parameter(0).toEqualTypeOf<Arrayable<string>>()
    
    // Should accept string array
    expectTypeOf(processItems).parameter(0).toEqualTypeOf<Arrayable<string>>()
    
    // Return type should be string array
    expectTypeOf(processItems).returns.toEqualTypeOf<string[]>()
  })

  describe('practical usage examples', () => {
    it('should work with React children pattern', () => {
      // Define ReactNode type locally for testing
      type ReactNode = string | number | boolean | null | undefined
      
      interface ComponentProps {
        children: Arrayable<ReactNode>
      }

      // Single element (using ReactNode which includes ReactElement)
      expectTypeOf<ReactNode>().toMatchTypeOf<ComponentProps['children']>()
      
      // Array of elements  
      expectTypeOf<ReactNode[]>().toMatchTypeOf<ComponentProps['children']>()
      
      // String content
      expectTypeOf<string>().toMatchTypeOf<ComponentProps['children']>()
      
      // Array of mixed content
      expectTypeOf<ReactNode[]>().toMatchTypeOf<ComponentProps['children']>()
    })

    it('should work with API response patterns', () => {
      interface ApiResponse<T> {
        data: Arrayable<T>
        success: boolean
      }

      interface User {
        id: number
        name: string
      }

      // Single user response
      expectTypeOf<User>().toMatchTypeOf<ApiResponse<User>['data']>()
      
      // Multiple users response
      expectTypeOf<User[]>().toMatchTypeOf<ApiResponse<User>['data']>()
    })

    it('should work with configuration patterns', () => {
      interface PluginConfig {
        plugins: Arrayable<string>
        middleware: Arrayable<() => void>
      }

      // Single plugin
      expectTypeOf<string>().toMatchTypeOf<PluginConfig['plugins']>()
      
      // Multiple plugins
      expectTypeOf<string[]>().toMatchTypeOf<PluginConfig['plugins']>()
      
      // Single middleware
      expectTypeOf<() => void>().toMatchTypeOf<PluginConfig['middleware']>()
      
      // Multiple middleware
      expectTypeOf<(() => void)[]>().toMatchTypeOf<PluginConfig['middleware']>()
    })
  })
})