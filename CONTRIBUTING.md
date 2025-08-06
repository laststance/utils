# Contributing to Utils

Thank you for your interest in contributing to this project! This guide will help you get started with contributing to our monorepo of JavaScript/TypeScript utilities.

## 🚀 Quick Start

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `pnpm test`
6. Submit a pull request

## 📁 Project Structure

This is a pnpm workspace monorepo with the following packages:

- **`packages/browser/`** - Browser-specific utilities (DOM, web APIs)
- **`packages/node/`** - Node.js utilities (CLI tools, file system)
- **`packages/universal/`** - Platform-agnostic utilities
- **`packages/types/`** - TypeScript type definitions
- **`packages/next-react/`** - React components with Next.js and Storybook

## 🛠 Development Setup

### Prerequisites

- Node.js 18+ (managed with Volta)
- pnpm (package manager)
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/utils.git
cd utils

# Install dependencies
pnpm install
```

### Available Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server
pnpm storybook             # Start Storybook

# Testing
pnpm test                  # Run all tests
pnpm test --watch          # Run tests in watch mode
pnpm test --coverage       # Generate coverage report

# Code Quality
pnpm lint                  # Run ESLint
pnpm lint:fix              # Auto-fix linting issues
pnpm typecheck             # Run TypeScript checking
pnpm prettier              # Format code

# Build
pnpm build                 # Build all packages
pnpm validate              # Run all checks (typecheck, test, lint, build)
```

## 📝 Making Changes

### Before You Start

1. Check if there's an existing issue for your contribution
2. If not, consider opening an issue to discuss your changes
3. Make sure your change fits the project's goals

### Adding New Utilities

Choose the appropriate package for your utility:

#### Browser Package (`packages/browser/`)
For browser-specific code that uses DOM or web APIs:

```typescript
// ✅ Good - browser-specific
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

// ❌ Bad - should be in universal
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}
```

#### Node Package (`packages/node/`)
For Node.js-specific code using Node APIs:

```typescript
// ✅ Good - Node.js-specific
import { readFile } from 'fs/promises'

export async function readJsonFile(path: string) {
  const content = await readFile(path, 'utf-8')
  return JSON.parse(content)
}

// ❌ Bad - should be in universal
export function debounce(fn: Function, delay: number) {
  // ...implementation
}
```

#### Universal Package (`packages/universal/`)
For platform-agnostic code with no dependencies:

```typescript
// ✅ Good - works anywhere
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ❌ Bad - uses browser API
export function getWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}
```

#### Types Package (`packages/types/`)
For TypeScript type definitions only:

```typescript
// ✅ Good - type-only
export interface User {
  id: string
  name: string
  email: string
}

export type UserRole = 'admin' | 'user' | 'guest'

// ❌ Bad - runtime code
export function createUser(data: Partial<User>): User {
  return { id: generateId(), ...data }
}
```

### File Naming Conventions

- Use camelCase for file names: `myUtility.ts`
- Use kebab-case for CLI tools: `my-cli-tool.js`
- Co-locate tests: `myUtility.test.ts` next to `myUtility.ts`
- Use descriptive names that indicate functionality

### Code Style

- Follow existing code patterns in each package
- Use TypeScript with strict mode enabled
- Add JSDoc comments for exported functions
- Include usage examples in comments
- Write tests for all new functionality

### Testing Requirements

All new utilities must include tests:

```typescript
// myUtility.ts
export function add(a: number, b: number): number {
  return a + b
}

// myUtility.test.ts
import { describe, it, expect } from 'vitest'
import { add } from './myUtility'

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(add(-1, 5)).toBe(4)
  })
})
```

### Documentation

- Update relevant README files
- Add JSDoc comments with examples
- Update exports in index files
- Consider adding Storybook stories for UI components

## 🧪 Testing

### Running Tests

```bash
# All packages
pnpm test

# Specific package
cd packages/browser && pnpm test

# With coverage
pnpm test --coverage

# Watch mode
pnpm test --watch
```

### Writing Tests

- Use Vitest for unit and integration tests
- Use React Testing Library for component tests
- Use Playwright for end-to-end tests
- Follow the AAA pattern (Arrange, Act, Assert)
- Test edge cases and error conditions
- Aim for good test coverage (>80%)

## 📋 Pull Request Process

### Before Submitting

1. Ensure all tests pass: `pnpm test`
2. Check linting: `pnpm lint`
3. Verify type checking: `pnpm typecheck`
4. Run the full validation: `pnpm validate`

### PR Guidelines

1. **Clear title**: Describe what your PR does
2. **Detailed description**: Explain the why and what
3. **Link issues**: Reference related issues with "Closes #123"
4. **Small changes**: Keep PRs focused and reasonably sized
5. **Update tests**: Include tests for new functionality

### PR Template

```markdown
## Summary
Brief description of changes

## Changes
- List specific changes made
- Include any breaking changes

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated documentation

## Related Issues
Closes #123
```

## 🏗 Architecture Decisions

### Package Organization

We organize code by environment rather than feature:
- **Environment-specific** packages (browser, node)
- **Universal** package for shared utilities
- **Types** package for TypeScript definitions

### Dependencies

- Prefer zero dependencies for universal utilities
- Use well-maintained packages for specific functionality
- Avoid large dependencies that increase bundle size

### TypeScript

- Use strict TypeScript configuration
- Provide proper type definitions
- Export types alongside utilities
- Use utility types from the types package

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (Node.js version, browser, OS)
5. **Minimal reproduction** if possible

### Feature Requests

For new features, include:

1. **Use case description** - what problem does it solve?
2. **Proposed API** - how would developers use it?
3. **Alternative solutions** - what alternatives exist?
4. **Breaking changes** - would this break existing code?

## 💡 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Code Review** - Ask for feedback in your pull request

## 📜 Code of Conduct

This project follows our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](./LICENSE)).

## 🙏 Recognition

Contributors are recognized in:
- Git commit history
- Release notes
- Package acknowledgments

Thank you for contributing to make this project better for everyone! 🎉