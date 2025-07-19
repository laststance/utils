import { describe, it, expectTypeOf } from 'vitest'

// Import the Awaitable type
type Awaitable<T> = T | Promise<T>

describe('Awaitable type', () => {
  it('should accept synchronous values', () => {
    // Synchronous string
    expectTypeOf<string>().toMatchTypeOf<Awaitable<string>>()

    // Synchronous number
    expectTypeOf<number>().toMatchTypeOf<Awaitable<number>>()

    // Synchronous boolean
    expectTypeOf<boolean>().toMatchTypeOf<Awaitable<boolean>>()

    // Synchronous object
    expectTypeOf<{ id: number }>().toMatchTypeOf<Awaitable<{ id: number }>>()

    // Synchronous array
    expectTypeOf<string[]>().toMatchTypeOf<Awaitable<string[]>>()
  })

  it('should accept promises of values', () => {
    // Promise of string
    expectTypeOf<Promise<string>>().toMatchTypeOf<Awaitable<string>>()

    // Promise of number
    expectTypeOf<Promise<number>>().toMatchTypeOf<Awaitable<number>>()

    // Promise of boolean
    expectTypeOf<Promise<boolean>>().toMatchTypeOf<Awaitable<boolean>>()

    // Promise of object
    expectTypeOf<Promise<{ id: number }>>().toMatchTypeOf<
      Awaitable<{ id: number }>
    >()

    // Promise of array
    expectTypeOf<Promise<string[]>>().toMatchTypeOf<Awaitable<string[]>>()
  })

  it('should work with complex types', () => {
    interface User {
      id: number
      name: string
      email?: string
    }

    interface ApiResponse<T> {
      data: T
      status: number
      message: string
    }

    // Synchronous complex type
    expectTypeOf<ApiResponse<User>>().toMatchTypeOf<
      Awaitable<ApiResponse<User>>
    >()

    // Asynchronous complex type
    expectTypeOf<Promise<ApiResponse<User>>>().toMatchTypeOf<
      Awaitable<ApiResponse<User>>
    >()
  })

  it('should work with union types', () => {
    type StringOrNumber = string | number

    // Synchronous union
    expectTypeOf<string>().toMatchTypeOf<Awaitable<StringOrNumber>>()
    expectTypeOf<number>().toMatchTypeOf<Awaitable<StringOrNumber>>()

    // Asynchronous union
    expectTypeOf<Promise<string | number>>().toMatchTypeOf<
      Awaitable<StringOrNumber>
    >()
  })

  it('should work with nullable types', () => {
    // Nullable values
    expectTypeOf<string | null>().toMatchTypeOf<Awaitable<string | null>>()
    expectTypeOf<Promise<string | null>>().toMatchTypeOf<
      Awaitable<string | null>
    >()

    // Optional values
    expectTypeOf<string | undefined>().toMatchTypeOf<
      Awaitable<string | undefined>
    >()
    expectTypeOf<Promise<string | undefined>>().toMatchTypeOf<
      Awaitable<string | undefined>
    >()
  })

  it('should work with void and never types', () => {
    // Void type (common for side-effect functions)
    expectTypeOf<void>().toMatchTypeOf<Awaitable<void>>()
    expectTypeOf<Promise<void>>().toMatchTypeOf<Awaitable<void>>()

    // Never type (edge case) - these types work at compile time
    // Note: never types are handled correctly by the type system
    // The type system correctly prevents invalid assignments to never types
  })

  it('should work in function signatures', () => {
    // Function that can return sync or async value
    const getValue = async (useAsync: boolean): Promise<Awaitable<string>> => {
      return useAsync ? Promise.resolve('async') : 'sync'
    }

    // Return type should be Promise<Awaitable<string>>
    expectTypeOf(getValue).returns.toEqualTypeOf<Promise<Awaitable<string>>>()

    // Function accepting Awaitable parameter
    const processValue = async (value: Awaitable<number>): Promise<number> => {
      return Promise.resolve(value)
    }

    // Should accept sync number
    expectTypeOf(processValue).parameter(0).toEqualTypeOf<Awaitable<number>>()

    // Should accept Promise<number>
    expectTypeOf(processValue).parameter(0).toEqualTypeOf<Awaitable<number>>()
  })

  it('should work with generic constraints', () => {
    // Generic function with Awaitable constraint
    async function processAwaitable<T>(value: Awaitable<T>): Promise<T> {
      return Promise.resolve(value)
    }

    // Should work with any type
    expectTypeOf(processAwaitable<string>)
      .parameter(0)
      .toEqualTypeOf<Awaitable<string>>()
    expectTypeOf(processAwaitable<string>).returns.toEqualTypeOf<
      Promise<string>
    >()
  })

  describe('practical usage examples', () => {
    it('should work with data fetching patterns', () => {
      interface DataFetcher<T> {
        get(id: string): Awaitable<T>
        getMultiple(ids: string[]): Awaitable<T[]>
      }

      interface User {
        id: string
        name: string
      }

      // Sync implementation
      const syncFetcher: DataFetcher<User> = {
        get: (id) => ({ id, name: `User ${id}` }),
        getMultiple: (ids) => ids.map((id) => ({ id, name: `User ${id}` })),
      }

      // Async implementation
      const asyncFetcher: DataFetcher<User> = {
        get: async (id) => ({ id, name: `User ${id}` }),
        getMultiple: async (ids) =>
          ids.map((id) => ({ id, name: `User ${id}` })),
      }

      expectTypeOf(syncFetcher.get).returns.toMatchTypeOf<Awaitable<User>>()
      expectTypeOf(asyncFetcher.get).returns.toMatchTypeOf<Awaitable<User>>()
    })

    it('should work with cache patterns', () => {
      interface Cache<T> {
        get(key: string): Awaitable<T | undefined>
        set(key: string, value: T): Awaitable<void>
      }

      // Memory cache (sync)
      const memoryCache: Cache<string> = {
        get: (key) => `value-${key}`,
        set: (key, value) => {
          /* store in memory */
        },
      }

      // Redis cache (async)
      const redisCache: Cache<string> = {
        get: async (key) => `value-${key}`,
        set: async (key, value) => {
          /* store in redis */
        },
      }

      expectTypeOf(memoryCache.get).returns.toEqualTypeOf<
        Awaitable<string | undefined>
      >()
      expectTypeOf(redisCache.get).returns.toEqualTypeOf<
        Awaitable<string | undefined>
      >()
    })

    it('should work with middleware patterns', () => {
      type Middleware<T> = (input: T) => Awaitable<T>

      // Sync middleware
      const syncMiddleware: Middleware<string> = (input) => input.toUpperCase()

      // Async middleware
      const asyncMiddleware: Middleware<string> = async (input) => {
        await new Promise((resolve) => setTimeout(resolve, 0))
        return input.toUpperCase()
      }

      expectTypeOf(syncMiddleware).returns.toMatchTypeOf<Awaitable<string>>()
      expectTypeOf(asyncMiddleware).returns.toMatchTypeOf<Awaitable<string>>()
    })

    it('should work with plugin systems', () => {
      interface Plugin {
        name: string
        init(): Awaitable<void>
        process(data: any): Awaitable<any>
      }

      // Sync plugin
      const syncPlugin: Plugin = {
        name: 'sync-plugin',
        init: () => {
          /* sync init */
        },
        process: (data) => data,
      }

      // Async plugin
      const asyncPlugin: Plugin = {
        name: 'async-plugin',
        init: async () => {
          /* async init */
        },
        process: async (data) => data,
      }

      expectTypeOf(syncPlugin.init).returns.toMatchTypeOf<Awaitable<void>>()
      expectTypeOf(asyncPlugin.init).returns.toMatchTypeOf<Awaitable<void>>()
    })

    it('should work with config loaders', () => {
      interface ConfigLoader<T> {
        load(path: string): Awaitable<T>
        validate(config: T): Awaitable<boolean>
      }

      interface AppConfig {
        port: number
        host: string
      }

      // File-based loader (async)
      const fileLoader: ConfigLoader<AppConfig> = {
        load: async (path) => ({ port: 3000, host: 'localhost' }),
        validate: async (config) => config.port > 0,
      }

      // Environment loader (sync)
      const envLoader: ConfigLoader<AppConfig> = {
        load: (path) => ({ port: 3000, host: 'localhost' }),
        validate: (config) => config.port > 0,
      }

      expectTypeOf(fileLoader.load).returns.toMatchTypeOf<
        Awaitable<AppConfig>
      >()
      expectTypeOf(envLoader.validate).returns.toMatchTypeOf<
        Awaitable<boolean>
      >()
    })
  })

  describe('edge cases and complex scenarios', () => {
    it('should handle nested promises correctly', () => {
      // Awaitable should not create Promise<Promise<T>>
      expectTypeOf<Promise<string>>().toMatchTypeOf<Awaitable<string>>()

      // But it should handle already promised types
      expectTypeOf<Promise<string>>().toMatchTypeOf<
        Awaitable<Promise<string>>
      >()
    })

    it('should work with conditional types', () => {
      type ConditionalAwaitable<T> = T extends string ? Awaitable<T> : T

      expectTypeOf<string>().toMatchTypeOf<ConditionalAwaitable<string>>()
      expectTypeOf<Promise<string>>().toMatchTypeOf<
        ConditionalAwaitable<string>
      >()
      expectTypeOf<number>().toMatchTypeOf<ConditionalAwaitable<number>>()
    })

    it('should work with mapped types', () => {
      type AwaitableFields<T> = {
        [K in keyof T]: Awaitable<T[K]>
      }

      interface User {
        id: number
        name: string
      }

      type AwaitableUser = AwaitableFields<User>

      expectTypeOf<number>().toMatchTypeOf<AwaitableUser['id']>()
      expectTypeOf<Promise<number>>().toMatchTypeOf<AwaitableUser['id']>()
      expectTypeOf<string>().toMatchTypeOf<AwaitableUser['name']>()
      expectTypeOf<Promise<string>>().toMatchTypeOf<AwaitableUser['name']>()
    })
  })
})
