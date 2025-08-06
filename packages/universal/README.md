# Universal Utilities

Platform-agnostic utility functions that work in any JavaScript environment (browser, Node.js, React Native, etc.). These utilities use only standard ECMAScript features and have zero runtime dependencies.

## 📦 Installation

This package is part of the monorepo workspace. Install dependencies from the root:

```bash
pnpm install
```

## 🚀 Usage

```typescript
import { 
  arrayEqual, 
  debounce, 
  isFunction,
  snakeToCameledSpace,
  shallowEqual,
  retry
} from 'universal'
```

## 📚 Available Utilities

### Array Utilities

#### `arrGen<T>(length: number, generator: (index: number) => T): T[]`
Generates an array with specified length using a generator function.

```typescript
import { arrGen } from 'universal'

const numbers = arrGen(5, i => i * 2)
// Result: [0, 2, 4, 6, 8]

const objects = arrGen(3, i => ({ id: i, name: `Item ${i}` }))
// Result: [{ id: 0, name: 'Item 0' }, ...]
```

#### `arrayEqual<T>(a: T[], b: T[]): boolean`
Performs shallow equality check between two arrays.

```typescript
import { arrayEqual } from 'universal'

arrayEqual([1, 2, 3], [1, 2, 3])     // true
arrayEqual(['a', 'b'], ['a', 'c'])    // false
arrayEqual([], [])                    // true
```

#### `arrayFillmap<T, U>(length: number, mapper: (index: number) => T): T[]`
Creates an array and maps over indices in one step.

```typescript
import { arrayFillmap } from 'universal'

const squares = arrayFillmap(5, i => i * i)
// Result: [0, 1, 4, 9, 16]
```

#### `range(start: number, end?: number, step?: number): number[]`
Generates a range of numbers.

```typescript
import { range } from 'universal'

range(5)           // [0, 1, 2, 3, 4]
range(2, 7)        // [2, 3, 4, 5, 6]
range(0, 10, 2)    // [0, 2, 4, 6, 8]
range(5, 0, -1)    // [5, 4, 3, 2, 1]
```

### String Utilities

#### `snakeToCameledSpace(str: string): string`
Converts kebab-case strings to title case with spaces.

```typescript
import { snakeToCameledSpace } from 'universal'

snakeToCameledSpace('hello-world')
// Result: 'Hello World'

snakeToCameledSpace('api-key-example')  
// Result: 'Api Key Example'
```

#### `removeSpecialCharacters(str: string, keep?: string): string`
Removes special characters from a string, optionally keeping specified ones.

```typescript
import { removeSpecialCharacters } from 'universal'

removeSpecialCharacters('Hello, World!')
// Result: 'Hello World'

removeSpecialCharacters('Price: $29.99', '.$')
// Result: 'Price $29.99'
```

#### `varToString(variable: any): string`
Converts a variable to a string representation for debugging.

```typescript
import { varToString } from 'universal'

const obj = { name: 'John', age: 30 }
varToString(obj)
// Result: '{"name":"John","age":30}'
```

### Type Checking Utilities

#### `isBoolean(value: unknown): value is boolean`
Type guard for boolean values.

```typescript
import { isBoolean } from 'universal'

if (isBoolean(value)) {
  // TypeScript knows value is boolean
  console.log(value ? 'true' : 'false')
}
```

#### `isError(value: unknown): value is Error`
Type guard for Error objects.

```typescript
import { isError } from 'universal'

try {
  riskyOperation()
} catch (e) {
  if (isError(e)) {
    console.log(e.message) // Safe to access Error properties
  }
}
```

#### `isFalsy(value: unknown): boolean`
Checks if a value is falsy.

```typescript
import { isFalsy } from 'universal'

isFalsy(0)         // true
isFalsy('')        // true
isFalsy(null)      // true
isFalsy(false)     // true
isFalsy('hello')   // false
```

#### `isFunction(value: unknown): value is Function`
Type guard for function values.

```typescript
import { isFunction } from 'universal'

if (isFunction(callback)) {
  callback() // Safe to call
}
```

#### `isImgUrl(url: string): boolean`
Checks if a URL points to an image based on file extension.

```typescript
import { isImgUrl } from 'universal'

isImgUrl('https://example.com/image.jpg')    // true
isImgUrl('https://example.com/image.png')    // true
isImgUrl('https://example.com/document.pdf') // false
```

#### `nonNullable<T>(value: T): value is NonNullable<T>`
Type guard that filters out null and undefined values.

```typescript
import { nonNullable } from 'universal'

const items = [1, null, 2, undefined, 3]
const validItems = items.filter(nonNullable)
// Result: [1, 2, 3], type is number[]
```

### Validation and Assertions

#### `invariant(condition: any, message?: string): asserts condition`
Assertion function that throws if condition is falsy.

```typescript
import { invariant } from 'universal'

function divide(a: number, b: number): number {
  invariant(b !== 0, 'Division by zero')
  return a / b
}
```

### Object Comparison

#### `shallowEqual(objA: any, objB: any): boolean`
Performs shallow equality comparison between objects.

```typescript
import { shallowEqual } from 'universal'

const obj1 = { a: 1, b: 2 }
const obj2 = { a: 1, b: 2 }
const obj3 = { a: 1, b: 3 }

shallowEqual(obj1, obj2) // true
shallowEqual(obj1, obj3) // false
```

#### `shallowEqualScalar(a: any, b: any): boolean`
Optimized shallow equality for scalar values and simple objects.

```typescript
import { shallowEqualScalar } from 'universal'

shallowEqualScalar('hello', 'hello')           // true
shallowEqualScalar(42, 42)                     // true
shallowEqualScalar({ x: 1 }, { x: 1 })         // true
```

### Date Utilities

#### `getDate(): Date`
Gets the current date (useful for mocking in tests).

```typescript
import { getDate } from 'universal'

const now = getDate()
console.log(now.toISOString())
```

#### `yyyy_mm_dd(date?: Date): string`
Formats a date as YYYY-MM-DD string.

```typescript
import { yyyy_mm_dd } from 'universal'

yyyy_mm_dd(new Date('2023-12-25'))  // '2023-12-25'
yyyy_mm_dd()                        // Current date as YYYY-MM-DD
```

### Regex Patterns

#### `cssRegex`
Regular expression for matching CSS code.

```typescript
import { cssRegex } from 'universal'

const styles = '.button { color: red; }'
if (cssRegex.test(styles)) {
  console.log('Valid CSS found')
}
```

#### `emailRegex` & `email2Regex`
Regular expressions for email validation.

```typescript
import { emailRegex, email2Regex } from 'universal'

const email = 'user@example.com'
const isValid = emailRegex.test(email) || email2Regex.test(email)
```

### Functional Utilities

#### `filterFalsy<T>(array: (T | null | undefined | false | 0 | '')[]): T[]`
Filters out falsy values from an array with proper TypeScript typing.

```typescript
import { filterFalsy } from 'universal'

const mixed = ['hello', '', null, 'world', 0, false, 'foo']
const filtered = filterFalsy(mixed)
// Result: ['hello', 'world', 'foo'], type is string[]
```

#### `printValue<T>(value: T): T`
Prints a value to console and returns it (useful for debugging in chains).

```typescript
import { printValue } from 'universal'

const result = [1, 2, 3]
  .map(x => x * 2)
  .filter(printValue) // Logs: [2, 4, 6]
  .reduce((a, b) => a + b)
```

#### `retry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T>`
Retries an async function on failure.

```typescript
import { retry } from 'universal'

const data = await retry(async () => {
  const response = await fetch('/api/data')
  if (!response.ok) throw new Error('Failed')
  return response.json()
}, 3)
```

### Math Utilities

#### `positiveIntegerSum(...numbers: number[]): number`
Calculates sum of positive integers only.

```typescript
import { positiveIntegerSum } from 'universal'

positiveIntegerSum(1, -2, 3, 4, -5)  // 8 (only 1 + 3 + 4)
```

#### `random(min: number = 0, max: number = 1): number`
Generates a random number between min and max.

```typescript
import { random } from 'universal'

random()        // 0 to 1
random(10, 20)  // 10 to 20
random(100)     // 0 to 100
```

### Code Transformation

#### `eqeqeqCodemod(code: string): string`
Transforms `==` and `!=` operators to `===` and `!==`.

```typescript
import { eqeqeqCodemod } from 'universal'

const code = 'if (x == y && a != b) { return true }'
const transformed = eqeqeqCodemod(code)
// Result: 'if (x === y && a !== b) { return true }'
```

### Type Helpers

The package re-exports all type helpers for runtime use:

```typescript
import { typeHelpers } from 'universal'

// Various runtime type checking utilities
```

## 🧪 Testing

Run tests for the universal package:

```bash
cd packages/universal
pnpm test
```

Run tests with coverage:

```bash
pnpm test --coverage
```

## 🔧 Development

### Type Checking
```bash
pnpm typecheck
```

### Linting
```bash
pnpm lint
pnpm lint:fix
```

## 🎯 Design Principles

- **Zero Dependencies**: Uses only standard JavaScript features
- **Pure Functions**: No side effects, predictable behavior
- **Type Safe**: Full TypeScript support with proper type guards
- **Platform Agnostic**: Works in any JavaScript environment
- **Tree Shakeable**: Import only what you need

## 🚨 Important Notes

- **Platform agnostic** - works in browser, Node.js, React Native, etc.
- **No environment-specific APIs** - doesn't use DOM, file system, etc.
- **Pure JavaScript/TypeScript** - no runtime dependencies
- **Performance optimized** - efficient implementations
- **Type safe** - comprehensive TypeScript support

## 📋 Zero Dependencies

This package intentionally has zero runtime dependencies to:
- Maximize compatibility across environments
- Minimize bundle size impact
- Reduce security surface area
- Ensure long-term stability

## 🔗 Related Packages

- [`browser`](../browser/) - Browser-specific utilities
- [`node`](../node/) - Node.js-specific utilities  
- [`types`](../types/) - TypeScript type definitions