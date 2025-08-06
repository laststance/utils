# TypeScript Types

Shared TypeScript type definitions, interfaces, and utility types used across the monorepo. This package provides type safety and consistency throughout all packages.

## 📦 Installation

This package is part of the monorepo workspace. Install dependencies from the root:

```bash
pnpm install
```

## 🚀 Usage

```typescript
import type { 
  Arrayable, 
  MaybePromise, 
  Nullable,
  DistributiveOmit,
  CamelToSnakeCase 
} from 'types'
```

## 📚 Available Types

### Basic Utility Types

#### `Arrayable<T>`
A type that can be either T or an array of T.

```typescript
import type { Arrayable } from 'types'

function process(input: Arrayable<string>) {
  const items = Array.isArray(input) ? input : [input]
  return items.map(item => item.toUpperCase())
}

process('hello')           // ✅ string
process(['hello', 'world']) // ✅ string[]
```

#### `Awaitable<T>`
A type that can be either T or Promise<T>.

```typescript
import type { Awaitable } from 'types'

async function handleValue<T>(value: Awaitable<T>): Promise<T> {
  return await value // Works whether value is T or Promise<T>
}
```

#### `MaybePromise<T>`
Similar to Awaitable, represents a value that might be wrapped in a Promise.

```typescript
import type { MaybePromise } from 'types'

function processResult<T>(result: MaybePromise<T>): Promise<T> {
  return Promise.resolve(result)
}
```

#### `Nullable<T>`
A type that can be either T or null.

```typescript
import type { Nullable } from 'types'

interface User {
  id: string
  avatar: Nullable<string> // Can be string or null
}
```

#### `UnwrapPromise<T>`
Extracts the type from a Promise.

```typescript
import type { UnwrapPromise } from 'types'

type ApiResponse = Promise<{ data: string; status: number }>
type ResponseData = UnwrapPromise<ApiResponse>
// Result: { data: string; status: number }
```

### Object Manipulation Types

#### `Concrete<T>`
Makes all optional properties required by removing undefined.

```typescript
import type { Concrete } from 'types'

interface Config {
  apiUrl?: string
  timeout?: number
}

type RequiredConfig = Concrete<Config>
// Result: { apiUrl: string; timeout: number }
```

#### `DistributiveOmit<T, K>`
A distributive version of Omit that works correctly with union types.

```typescript
import type { DistributiveOmit } from 'types'

type Event = 
  | { type: 'click'; target: Element; button: number }
  | { type: 'keypress'; key: string; target: Element }

type EventWithoutTarget = DistributiveOmit<Event, 'target'>
// Correctly omits 'target' from both union members
```

#### `DistributivePick<T, K>`
A distributive version of Pick that works correctly with union types.

```typescript
import type { DistributivePick } from 'types'

type EventType = DistributivePick<Event, 'type'>
// Result: { type: 'click' } | { type: 'keypress' }
```

#### `EmptyObject`
Represents an empty object with no properties.

```typescript
import type { EmptyObject } from 'types'

function createEmpty(): EmptyObject {
  return {}
}
```

#### `Override<T, U>`
Overrides properties in T with properties from U.

```typescript
import type { Override } from 'types'

interface BaseUser {
  id: string
  name: string
  email: string
}

type AdminUser = Override<BaseUser, {
  role: 'admin'
  permissions: string[]
}>
// Result: { id: string; name: string; email: string; role: 'admin'; permissions: string[] }
```

#### `OptionalIfAllPropsOptional<T>`
Makes the entire object optional if all its properties are optional.

```typescript
import type { OptionalIfAllPropsOptional } from 'types'

interface AllOptional {
  a?: string
  b?: number
}

type MaybeOptional = OptionalIfAllPropsOptional<AllOptional>
// The entire object becomes optional: AllOptional | undefined
```

### String Manipulation Types

#### `CamelToSnakeCase<T>`
Converts camelCase strings to snake_case at the type level.

```typescript
import type { CamelToSnakeCase } from 'types'

type Snake = CamelToSnakeCase<'userName'>
// Result: 'user_name'
```

#### `KeysToCamelCase<T>`
Converts all object keys from snake_case to camelCase.

```typescript
import type { KeysToCamelCase } from 'types'

type ApiResponse = {
  user_name: string
  user_id: number
  created_at: string
}

type CamelCased = KeysToCamelCase<ApiResponse>
// Result: { userName: string; userId: number; createdAt: string }
```

#### `RemoveUnderscoreFirstLetter<T>`
Removes underscore from the first letter of a string type.

```typescript
import type { RemoveUnderscoreFirstLetter } from 'types'

type Clean = RemoveUnderscoreFirstLetter<'_internal'>
// Result: 'internal'
```

### Type Checking Types

#### `IsAny<T>`
Checks if a type is `any`.

```typescript
import type { IsAny } from 'types'

type Check1 = IsAny<any>     // true
type Check2 = IsAny<string>  // false
```

#### `NoInfer<T>`
Prevents TypeScript from inferring the generic type parameter.

```typescript
import type { NoInfer } from 'types'

function assertEqual<T>(actual: T, expected: NoInfer<T>) {
  // TypeScript won't infer T from 'expected'
}

assertEqual('hello', 'world') // T inferred as 'hello', 'world' must match
```

#### `Primitive`
Union of all primitive types.

```typescript
import type { Primitive } from 'types'

function isPrimitive(value: unknown): value is Primitive {
  return value !== Object(value)
}

type Primitive = string | number | boolean | symbol | null | undefined
```

### Data Types

#### `Json`
Represents valid JSON values.

```typescript
import type { Json } from 'types'

interface ApiEndpoint {
  method: 'GET' | 'POST'
  url: string
  body?: Json
}
```

#### `URLType`
Represents different types of URLs.

```typescript
import type { URLType } from 'types'

function handleUrl(url: URLType) {
  // Handle different URL formats
}
```

### Advanced Utility Types

#### `UnionToIntersection<U>`
Converts a union type to an intersection type.

```typescript
import type { UnionToIntersection } from 'types'

type Union = { a: string } | { b: number }
type Intersection = UnionToIntersection<Union>
// Result: { a: string } & { b: number }
```

#### `Unique<T>`
Creates a unique branded type.

```typescript
import type { Unique } from 'types'

type UserId = Unique<string, 'UserId'>
type ProductId = Unique<string, 'ProductId'>

// These are not assignable to each other despite both being strings
```

#### `ExtractNonOptionalKeys<T>`
Extracts keys that are not optional.

```typescript
import type { ExtractNonOptionalKeys } from 'types'

interface User {
  id: string      // required
  name?: string   // optional
  email: string   // required
}

type RequiredKeys = ExtractNonOptionalKeys<User>
// Result: 'id' | 'email'
```

## 🔧 Runtime Utilities

The package also includes some runtime utilities:

#### `assertIsError(error: unknown): asserts error is Error`
Type assertion for error objects.

```typescript
import { assertIsError } from 'types'

try {
  riskyOperation()
} catch (error) {
  assertIsError(error)
  console.log(error.message) // TypeScript knows this is safe
}
```

#### `betterTypeof(value: unknown): string`
Enhanced typeof that provides more accurate type information.

```typescript
import { betterTypeof } from 'types'

console.log(betterTypeof(null))       // 'null' instead of 'object'
console.log(betterTypeof([]))         // 'array' instead of 'object'
console.log(betterTypeof(new Date())) // 'date' instead of 'object'
```

## 🧪 Testing

This package includes type-level tests to ensure utility types work correctly:

```bash
cd packages/types
pnpm test:types
```

## 🎯 Best Practices

### When to Use This Package

- ✅ Shared types across multiple packages
- ✅ Complex utility types that enhance type safety
- ✅ API response/request type definitions
- ✅ Domain model interfaces

### When NOT to Use This Package

- ❌ Package-specific types (keep them local)
- ❌ Runtime code (this is types-only)
- ❌ Very specific, single-use types

### Naming Conventions

- **Interfaces**: PascalCase, no `I` prefix
- **Type aliases**: PascalCase  
- **Utility types**: PascalCase with descriptive names
- **Generic parameters**: Single letters (T, U, K) or descriptive names

### Documentation

All exported types should include:
- JSDoc comments explaining purpose
- Usage examples
- Related types or alternatives

## 📋 Dependencies

- `zod`: Runtime type validation and parsing

## 🔗 Related Packages

- [`universal`](../universal/) - Runtime utilities that complement these types
- [`browser`](../browser/) - Browser-specific utilities
- [`node`](../node/) - Node.js-specific utilities