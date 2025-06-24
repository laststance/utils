import { describe, it, expectTypeOf } from 'vitest'

// Import the Nullable type
type Nullable<T> = T | null

describe('Nullable type', () => {
  it('should accept original type values', () => {
    // Original string value
    expectTypeOf<string>().toMatchTypeOf<Nullable<string>>()
    
    // Original number value
    expectTypeOf<number>().toMatchTypeOf<Nullable<number>>()
    
    // Original boolean value
    expectTypeOf<boolean>().toMatchTypeOf<Nullable<boolean>>()
    
    // Original object value
    expectTypeOf<{ id: number }>().toMatchTypeOf<Nullable<{ id: number }>>()
    
    // Original array value
    expectTypeOf<string[]>().toMatchTypeOf<Nullable<string[]>>()
  })

  it('should accept null values', () => {
    // Null for any nullable type
    expectTypeOf<null>().toMatchTypeOf<Nullable<string>>()
    expectTypeOf<null>().toMatchTypeOf<Nullable<number>>()
    expectTypeOf<null>().toMatchTypeOf<Nullable<boolean>>()
    expectTypeOf<null>().toMatchTypeOf<Nullable<object>>()
    expectTypeOf<null>().toMatchTypeOf<Nullable<any[]>>()
  })

  it('should work with primitive types', () => {
    // String
    type NullableString = Nullable<string>
    expectTypeOf<string>().toMatchTypeOf<NullableString>()
    expectTypeOf<null>().toMatchTypeOf<NullableString>()
    
    // Number
    type NullableNumber = Nullable<number>
    expectTypeOf<number>().toMatchTypeOf<NullableNumber>()
    expectTypeOf<null>().toMatchTypeOf<NullableNumber>()
    
    // Boolean
    type NullableBoolean = Nullable<boolean>
    expectTypeOf<boolean>().toMatchTypeOf<NullableBoolean>()
    expectTypeOf<null>().toMatchTypeOf<NullableBoolean>()
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
    }

    // Nullable user
    type NullableUser = Nullable<User>
    expectTypeOf<User>().toMatchTypeOf<NullableUser>()
    expectTypeOf<null>().toMatchTypeOf<NullableUser>()
    
    // Nullable API response
    type NullableResponse = Nullable<ApiResponse<User>>
    expectTypeOf<ApiResponse<User>>().toMatchTypeOf<NullableResponse>()
    expectTypeOf<null>().toMatchTypeOf<NullableResponse>()
  })

  it('should work with union types', () => {
    type StringOrNumber = string | number
    type NullableStringOrNumber = Nullable<StringOrNumber>
    
    // Original union members
    expectTypeOf<string>().toMatchTypeOf<NullableStringOrNumber>()
    expectTypeOf<number>().toMatchTypeOf<NullableStringOrNumber>()
    
    // Null
    expectTypeOf<null>().toMatchTypeOf<NullableStringOrNumber>()
    
    // The full union
    expectTypeOf<string | number | null>().toEqualTypeOf<NullableStringOrNumber>()
  })

  it('should work with array types', () => {
    // Nullable array of strings
    type NullableStringArray = Nullable<string[]>
    expectTypeOf<string[]>().toMatchTypeOf<NullableStringArray>()
    expectTypeOf<null>().toMatchTypeOf<NullableStringArray>()
    
    // Array of nullable strings (different!)
    type ArrayOfNullableStrings = Nullable<string>[]
    expectTypeOf<(string | null)[]>().toEqualTypeOf<ArrayOfNullableStrings>()
  })

  it('should distinguish from undefined types', () => {
    type NullableString = Nullable<string>
    type OptionalString = string | undefined
    
    // Nullable accepts null but not undefined
    expectTypeOf<null>().toMatchTypeOf<NullableString>()
    expectTypeOf<undefined>().not.toMatchTypeOf<NullableString>()
    
    // Optional accepts undefined but not null
    expectTypeOf<undefined>().toMatchTypeOf<OptionalString>()
    expectTypeOf<null>().not.toMatchTypeOf<OptionalString>()
  })

  it('should work in function signatures', () => {
    // Function accepting nullable parameter
    const processValue = (value: Nullable<string>): string => {
      return value ?? 'default'
    }

    // Should accept string
    expectTypeOf(processValue).parameter(0).toMatchTypeOf<string>()
    
    // Should accept null
    expectTypeOf(processValue).parameter(0).toMatchTypeOf<null>()
    
    // Return type should be non-nullable string
    expectTypeOf(processValue).returns.toEqualTypeOf<string>()
  })

  it('should work with optional properties', () => {
    interface UserProfile {
      id: number
      name: string
      avatar: Nullable<string>  // Can be null
      bio?: string              // Can be undefined
    }

    // Avatar can be string or null
    expectTypeOf<string>().toMatchTypeOf<UserProfile['avatar']>()
    expectTypeOf<null>().toMatchTypeOf<UserProfile['avatar']>()
    expectTypeOf<undefined>().not.toMatchTypeOf<UserProfile['avatar']>()
    
    // Bio can be string or undefined
    expectTypeOf<string>().toMatchTypeOf<NonNullable<UserProfile['bio']>>()
    expectTypeOf<undefined>().toMatchTypeOf<UserProfile['bio']>()
  })

  describe('practical usage examples', () => {
    it('should work with database entity patterns', () => {
      interface User {
        id: number
        name: string
        email: string
        avatar: Nullable<string>
        deletedAt: Nullable<Date>
      }

      // Avatar can be null (no profile picture)
      expectTypeOf<string>().toMatchTypeOf<User['avatar']>()
      expectTypeOf<null>().toMatchTypeOf<User['avatar']>()
      
      // DeletedAt can be null (not deleted)
      expectTypeOf<Date>().toMatchTypeOf<User['deletedAt']>()
      expectTypeOf<null>().toMatchTypeOf<User['deletedAt']>()
    })

    it('should work with API response patterns', () => {
      interface ApiResponse<T> {
        data: Nullable<T>
        error: Nullable<string>
        metadata: {
          total: number
          nextCursor: Nullable<string>
        }
      }

      type UserResponse = ApiResponse<User[]>

      // Data can be null on error
      expectTypeOf<User[]>().toMatchTypeOf<UserResponse['data']>()
      expectTypeOf<null>().toMatchTypeOf<UserResponse['data']>()
      
      // Error can be null on success
      expectTypeOf<string>().toMatchTypeOf<UserResponse['error']>()
      expectTypeOf<null>().toMatchTypeOf<UserResponse['error']>()
      
      // Next cursor can be null (last page)
      expectTypeOf<string>().toMatchTypeOf<UserResponse['metadata']['nextCursor']>()
      expectTypeOf<null>().toMatchTypeOf<UserResponse['metadata']['nextCursor']>()
    })

    it('should work with form validation patterns', () => {
      interface FormState {
        email: string
        password: string
        confirmPassword: string
        errors: {
          email: Nullable<string>
          password: Nullable<string>
          confirmPassword: Nullable<string>
        }
      }

      // Each error field can be null (no error) or string (error message)
      expectTypeOf<string>().toMatchTypeOf<FormState['errors']['email']>()
      expectTypeOf<null>().toMatchTypeOf<FormState['errors']['email']>()
    })

    it('should work with caching patterns', () => {
      interface CacheEntry<T> {
        value: Nullable<T>
        timestamp: number
        expiresAt: Nullable<number>
      }

      type UserCacheEntry = CacheEntry<User>

      // Value can be null (cache miss)
      expectTypeOf<User>().toMatchTypeOf<UserCacheEntry['value']>()
      expectTypeOf<null>().toMatchTypeOf<UserCacheEntry['value']>()
      
      // ExpiresAt can be null (never expires)
      expectTypeOf<number>().toMatchTypeOf<UserCacheEntry['expiresAt']>()
      expectTypeOf<null>().toMatchTypeOf<UserCacheEntry['expiresAt']>()
    })

    it('should work with search and filter patterns', () => {
      interface SearchParams {
        query: string
        category: Nullable<string>
        priceMin: Nullable<number>
        priceMax: Nullable<number>
        sortBy: Nullable<'price' | 'date' | 'relevance'>
      }

      // Optional filters can be null
      expectTypeOf<string>().toMatchTypeOf<SearchParams['category']>()
      expectTypeOf<null>().toMatchTypeOf<SearchParams['category']>()
      
      expectTypeOf<number>().toMatchTypeOf<SearchParams['priceMin']>()
      expectTypeOf<null>().toMatchTypeOf<SearchParams['priceMin']>()
      
      expectTypeOf<'price' | 'date' | 'relevance'>().toMatchTypeOf<NonNullable<SearchParams['sortBy']>>()
      expectTypeOf<null>().toMatchTypeOf<SearchParams['sortBy']>()
    })

    it('should work with parent-child relationship patterns', () => {
      interface TreeNode<T> {
        id: string
        value: T
        parent: Nullable<TreeNode<T>>
        children: TreeNode<T>[]
      }

      type StringTreeNode = TreeNode<string>

      // Root node has null parent
      expectTypeOf<StringTreeNode>().toMatchTypeOf<StringTreeNode['parent']>()
      expectTypeOf<null>().toMatchTypeOf<StringTreeNode['parent']>()
      
      // Children is always an array (never null)
      expectTypeOf<StringTreeNode[]>().toEqualTypeOf<StringTreeNode['children']>()
    })
  })

  describe('type utilities and combinations', () => {
    it('should work with NonNullable utility', () => {
      type NullableString = Nullable<string>
      type NonNullableString = NonNullable<NullableString>
      
      // NonNullable should remove null
      expectTypeOf<NonNullableString>().toEqualTypeOf<string>()
      expectTypeOf<string>().toMatchTypeOf<NonNullableString>()
      expectTypeOf<null>().not.toMatchTypeOf<NonNullableString>()
    })

    it('should work with mapped types', () => {
      type NullableFields<T> = {
        [K in keyof T]: Nullable<T[K]>
      }

      interface User {
        id: number
        name: string
        email: string
      }

      type NullableUser = NullableFields<User>

      // Each field should be nullable
      expectTypeOf<number>().toMatchTypeOf<NullableUser['id']>()
      expectTypeOf<null>().toMatchTypeOf<NullableUser['id']>()
      
      expectTypeOf<string>().toMatchTypeOf<NullableUser['name']>()
      expectTypeOf<null>().toMatchTypeOf<NullableUser['name']>()
    })

    it('should work with conditional types', () => {
      type NullableIfString<T> = T extends string ? Nullable<T> : T

      // String becomes nullable
      expectTypeOf<string | null>().toEqualTypeOf<NullableIfString<string>>()
      
      // Number stays the same
      expectTypeOf<number>().toEqualTypeOf<NullableIfString<number>>()
    })

    it('should work with Pick and Omit', () => {
      interface User {
        id: number
        name: string
        email: Nullable<string>
        avatar: Nullable<string>
      }

      // Pick nullable fields
      type NullableFields = Pick<User, 'email' | 'avatar'>
      expectTypeOf<Nullable<string>>().toEqualTypeOf<NullableFields['email']>()
      expectTypeOf<Nullable<string>>().toEqualTypeOf<NullableFields['avatar']>()
      
      // Omit nullable fields
      type RequiredFields = Omit<User, 'email' | 'avatar'>
      expectTypeOf<number>().toEqualTypeOf<RequiredFields['id']>()
      expectTypeOf<string>().toEqualTypeOf<RequiredFields['name']>()
    })
  })
})