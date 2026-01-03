# CLAUDE.md - Types Package

This file provides specific guidance for the `packages/types` directory when working with Claude Code.

## Package Purpose

Shared TypeScript type definitions, interfaces, and utility types used across the monorepo. This package provides type safety and consistency throughout all packages.

## Key Rules

- **Types only**: No runtime code, only TypeScript types and interfaces
- **Minimal dependencies**: Only schema libraries (e.g., `zod`) for validation types
- **Generic and reusable**: Types should be useful across multiple packages
- **Well-documented**: Use JSDoc comments to explain complex types

## Organization

- Group related types in the same file
- Use descriptive file names that indicate the domain
- Re-export all types from `index.ts` for easy importing
- Prefer interfaces over type aliases when possible

## Common Type Categories

- API response types
- Domain models
- Utility types (Partial, Required extensions)
- Configuration types
- Error types
- Event types
- React component prop types

## Type Examples

```typescript
// ✅ Good - Well-documented, reusable type
/**
 * Represents a user in the system
 * @example
 * const user: User = {
 *   id: '123',
 *   email: 'user@example.com',
 *   roles: ['user']
 * };
 */
export interface User {
  id: string
  email: string
  name?: string
  roles: UserRole[]
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'user' | 'guest'

// ✅ Good - Utility type
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

// ❌ Bad - Runtime code
export function isUser(obj: unknown): obj is User {
  // NO! This is runtime code, not just types
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

## Best Practices

- Use `interface` for object shapes
- Use `type` for unions, intersections, and utilities
- Export all types/interfaces
- Avoid `any` - use `unknown` or generic constraints
- Use branded types for type safety when needed
- Leverage TypeScript's utility types

## Naming Conventions

- Interfaces: PascalCase, no `I` prefix
- Type aliases: PascalCase
- Enums: PascalCase (prefer const assertions)
- Generic parameters: Single letters (T, U, K, V) or descriptive names

## Testing Types

- Use TypeScript's type testing utilities
- Write type-level tests for complex utility types
- Ensure types don't break when packages update

## Dependencies

This package uses pnpm isolated mode. Key dependencies:
- `zod` - Schema validation library (use `catalog:` for shared version)
- `typescript` - Use `catalog:` for shared version
- `typescript-eslint` - Use `catalog:` for shared version

When adding imports, ensure the package is declared in `package.json`. Use `catalog:` for shared versions defined in `pnpm-workspace.yaml`.
