# Browser Utilities

Browser-specific utility functions that leverage web APIs and DOM manipulation. These utilities are designed to work exclusively in browser environments.

## 📦 Installation

This package is part of the monorepo workspace. Install dependencies from the root:

```bash
pnpm install
```

## 🚀 Usage

```typescript
import { 
  openInNewTab, 
  getImageRect, 
  debounce, 
  sleep,
  Queue 
} from 'browser'
```

## 📚 Available Utilities

### DOM & Browser APIs

#### `openInNewTab(url: string)`
Opens a URL in a new browser tab using a programmatically created anchor element.

```typescript
import { openInNewTab } from 'browser'

openInNewTab('https://example.com')
```

#### `getImageRect(imageUrl: string)`
Gets the natural dimensions of an image.

```typescript
import { getImageRect } from 'browser'

const rect = await getImageRect('/path/to/image.jpg')
console.log(rect) // { width: 800, height: 600 }
```

#### `getBase64Image(url: string)`
Converts an image URL to a base64 data URL.

```typescript
import { getBase64Image } from 'browser'

const base64 = await getBase64Image('/path/to/image.jpg')
// Returns: "data:image/jpeg;base64,..."
```

### Event Handling

#### `debounce<T>(func: T, wait: number)`
Creates a debounced version of a function that delays execution.

```typescript
import { debounce } from 'browser'

const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query)
}, 300)

debouncedSearch('react') // Only executes after 300ms of inactivity
```

### Queue Management

#### `Queue`
A concurrent task queue with configurable concurrency using event-based waiting.

```typescript
import { Queue } from 'browser'

const queue = new Queue(async (task) => {
  console.log('Processing:', task)
  await fetch(`/api/process/${task.id}`)
}, { concurrency: 3 })

queue.push([
  { id: 1, data: 'task1' },
  { id: 2, data: 'task2' },
  { id: 3, data: 'task3' }
])

// Wait for all tasks to complete
await queue.wait({ empty: true })
```

### Environment Detection

#### `isClient()`
Checks if code is running in a browser environment.

```typescript
import { isClient } from 'browser'

if (isClient()) {
  // Safe to use window, document, etc.
  localStorage.setItem('key', 'value')
}
```

### Async Utilities

#### `sleep(ms: number)`
Creates a promise that resolves after a specified number of milliseconds.

```typescript
import { sleep } from 'browser'

async function delayedAction() {
  await sleep(1000) // Wait 1 second
  console.log('Action executed!')
}
```

### Math Utilities

#### `rand()`
Generates a random number using probability distribution.

```typescript
import { rand } from 'browser'

const randomValue = rand() // Returns number between 0 and 1
```

### Debug Utilities

#### `suppressConsoleError(callback: Function)`
Temporarily suppresses console errors during callback execution.

```typescript
import { suppressConsoleError } from 'browser'

suppressConsoleError(() => {
  // Code that might log errors
  someRiskyOperation()
})
```

### Size Calculation

#### `sizeof(object: any)`
Calculates the approximate memory size of JavaScript objects.

```typescript
import { sizeof } from 'browser'

const obj = { name: 'John', age: 30 }
const size = sizeof(obj) // Returns size in bytes
```

#### `byte_size(object: any)`
Alternative size calculation utility.

## 🧪 Testing

Run tests for the browser package:

```bash
cd packages/browser
pnpm test
```

Run tests with coverage:

```bash
pnpm test --coverage
```

## 🎯 Browser Compatibility

- Modern browsers (ES2020+)
- Uses native DOM APIs and web standards
- No polyfills included - use feature detection when needed

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

## 📋 Dependencies

- `buffer`: For Buffer polyfill in browser environments

## 🚨 Important Notes

- These utilities are **browser-only** - they will not work in Node.js
- Uses modern web APIs - ensure browser compatibility for your use case
- Some utilities like `Queue` use event-based patterns for optimal performance
- Always check `isClient()` before using browser-specific APIs in SSR applications

## 🔗 Related Packages

- [`universal`](../universal/) - Platform-agnostic utilities
- [`node`](../node/) - Node.js-specific utilities
- [`types`](../types/) - TypeScript type definitions