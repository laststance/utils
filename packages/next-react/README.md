# Next.js + React Testing with Vitest

This package demonstrates a comprehensive testing setup using **Vitest**, **React Testing Library**, and **MSW (Mock Service Worker)** for testing React components and Next.js applications.

## 🧪 Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Simple and complete React DOM testing utilities
- **[MSW](https://mswjs.io/)** - API mocking by intercepting requests on the network level
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Custom matchers for DOM assertions
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - Realistic user interaction simulation

## 🚀 Getting Started

### Prerequisites

```bash
pnpm install
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test Button.test.tsx

# Run tests with coverage
pnpm test --coverage
```

## 📁 Project Structure

```
packages/next-react/
├── app/
│   ├── layout.tsx
│   ├── layout.test.tsx        # App tests co-located
│   ├── page.tsx
│   └── page.test.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── Button.test.tsx    # UI component tests co-located
│   │   ├── badge.tsx
│   │   ├── badge.test.tsx
│   │   ├── card.tsx
│   │   └── card.test.tsx
│   ├── LoginForm.tsx
│   ├── LoginForm.test.tsx     # Component tests co-located
│   ├── UserProfile.tsx
│   └── UserProfile.test.tsx
├── hooks/
│   ├── use-mobile.ts
│   └── use-mobile.test.ts     # Hook tests co-located
├── lib/
│   ├── api.ts
│   ├── api.test.ts            # Lib tests co-located
│   ├── utils.ts
│   └── utils.test.ts
├── mocks/
│   ├── handlers.ts            # MSW request handlers
│   └── server.ts              # MSW server setup
├── vitest.config.ts           # Vitest configuration
└── vitest-setup.ts            # Test setup file
```

## ⚙️ Configuration Files

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    setupFiles: ['./vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

### `vitest-setup.ts`

Global test setup including MSW server configuration and DOM mocks:

```typescript
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { server } from './mocks/server'
import '@testing-library/jest-dom'

// MSW Server setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

// DOM API mocks
Object.defineProperty(window, 'matchMedia', {
  /* ... */
})
global.IntersectionObserver = vi.fn(/* ... */)
global.ResizeObserver = vi.fn(/* ... */)
```

## 🔧 Testing Patterns

### 1. Component Testing

Testing React components with different scenarios:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Custom Hook Testing

Testing React hooks with `renderHook`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  it('returns false for desktop screen width', () => {
    // Mock window.matchMedia
    const mockMQL = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn().mockReturnValue(mockMQL)

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
```

### 3. API Mocking with MSW

#### Setting up MSW Handlers

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const credentials = await request.json()

    if (credentials.email === 'test@example.com') {
      return HttpResponse.json({
        success: true,
        user: { id: 1, email: credentials.email },
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }),
]
```

#### Using MSW in Tests

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'

describe('LoginForm', () => {
  it('handles custom error scenarios', async () => {
    // Override handler for this specific test
    server.use(
      http.post('/api/login', () => {
        return HttpResponse.json({ message: 'Account locked' }, { status: 423 })
      }),
    )

    // Test continues...
  })
})
```

### 4. Async Testing

Testing components with async operations:

```typescript
it('shows loading state during API call', async () => {
  server.use(
    http.post('/api/login', async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return HttpResponse.json({ success: true })
    })
  )

  render(<LoginForm />)

  // Interact with form
  await user.click(submitButton)

  // Assert loading state
  expect(screen.getByText(/signing in/i)).toBeInTheDocument()

  // Wait for completion
  await waitFor(() => {
    expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument()
  })
})
```

### 5. Accessibility Testing

Testing accessibility features:

```typescript
it('provides proper ARIA labels', () => {
  render(<Button aria-label="Custom label">Button</Button>)

  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('aria-label', 'Custom label')
})

it('associates error messages with form fields', async () => {
  // Trigger validation error
  await user.click(submitButton)

  const errorMessage = await screen.findByText(/email is required/i)
  const errorId = errorMessage.getAttribute('id')
  const emailInput = screen.getByLabelText(/email/i)

  expect(emailInput).toHaveAttribute('aria-describedby', errorId)
  expect(emailInput).toHaveAttribute('aria-invalid', 'true')
})
```

## 🎯 Testing Best Practices

### 1. Query Priority

Follow the [Testing Library query priority](https://testing-library.com/docs/queries/about#priority):

```typescript
// ✅ Preferred - Accessible to everyone
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByText(/welcome/i)

// ⚠️ Use when semantic queries aren't sufficient
screen.getByTestId('submit-button')

// ❌ Avoid - Implementation details
screen.getByClassName('btn-primary')
```

### 2. User-Centric Testing

Write tests that reflect how users interact with your app:

```typescript
// ✅ Good - Tests user behavior
it('allows user to login with valid credentials', async () => {
  const user = userEvent.setup()

  render(<LoginForm />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /sign in/i }))

  expect(await screen.findByText(/welcome back/i)).toBeInTheDocument()
})
```

### 3. Async Testing Patterns

```typescript
// ✅ Use findBy for elements that appear asynchronously
expect(await screen.findByText(/loading/i)).toBeInTheDocument()

// ✅ Use waitFor for state changes
await waitFor(() => {
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})

// ✅ Use waitForElementToBeRemoved for cleanup
await waitForElementToBeRemoved(screen.queryByText(/loading/i))
```

### 4. MSW Best Practices

```typescript
// ✅ Reset handlers between tests (done automatically in setup)
afterEach(() => server.resetHandlers())

// ✅ Override handlers for specific tests
server.use(http.get('/api/user/:id', () => HttpResponse.error()))

// ✅ Simulate realistic delays
server.use(
  http.post('/api/login', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return HttpResponse.json({ success: true })
  }),
)
```

## 🔍 Common Testing Scenarios

### Error Boundaries

```typescript
it('handles errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Something went wrong')
  }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### Form Validation

```typescript
it('validates required fields', async () => {
  const user = userEvent.setup()

  render(<ContactForm />)
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
})
```

### Conditional Rendering

```typescript
it('shows different content based on user role', () => {
  render(<Dashboard user={{ role: 'admin' }} />)
  expect(screen.getByText(/admin panel/i)).toBeInTheDocument()

  render(<Dashboard user={{ role: 'user' }} />)
  expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument()
})
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Query Guide](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🏃‍♂️ Example Test Files

Check out these example test files for reference:

- [`Button.test.tsx`](./components/ui/Button.test.tsx) - Component testing with variants and interactions
- [`use-mobile.test.ts`](./hooks/use-mobile.test.ts) - Custom hook testing with media queries
- [`LoginForm.test.tsx`](./components/LoginForm.test.tsx) - Form testing with validation and API calls
- [`UserProfile.test.tsx`](./components/UserProfile.test.tsx) - Data fetching and error handling
