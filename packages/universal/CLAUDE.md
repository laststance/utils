# CLAUDE.md - Universal Package

This file provides specific guidance for the `packages/universal` directory when working with Claude Code.

## Package Purpose

Platform-agnostic utilities that work in any JavaScript environment (browser, Node.js, React Native, etc.). No browser-specific or Node.js-specific APIs should be used here.

## Key Rules

- **NO environment-specific APIs**: No `window`, `document`, `process`, `fs`, or any platform-specific code
- **Pure JavaScript/TypeScript**: Only use standard ECMAScript features
- **Zero runtime dependencies**: Keep this package dependency-free for maximum portability
- **Comprehensive testing**: Test utilities across different environments when possible

## Common Utilities

- Array manipulation functions
- Object utilities
- String formatting
- Date/time helpers
- Math utilities
- Data validation
- Type guards

## Testing Guidelines

- Write tests that verify behavior, not implementation
- Co-locate test files with their source files using `.test.ts` suffix
- Test edge cases and error conditions
- Ensure 100% code coverage for utility functions

## Code Examples

```typescript
// ✅ Good - Pure function with no dependencies
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ❌ Bad - Uses browser-specific API
export function saveToLocalStorage(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value)) // NO!
}
```

## Export Patterns

- Use named exports for individual utilities
- Group related utilities in the same file
- Re-export from `index.ts` for convenient importing

## Dependencies

This package uses pnpm isolated mode with **zero runtime dependencies** for maximum portability. Dev dependencies:
- `typescript` - Use `catalog:` for shared version
- `typescript-eslint` - Use `catalog:` for shared version
- `vitest` - Use `catalog:` for shared version

When adding dev dependencies, use `catalog:` for shared versions defined in `pnpm-workspace.yaml`. Never add runtime dependencies to maintain cross-platform compatibility.
