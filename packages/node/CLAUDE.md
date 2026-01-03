# CLAUDE.md - Node Package

This file provides specific guidance for the `packages/node` directory when working with Claude Code.

## Package Purpose

Node.js-specific utilities including CLI tools, file system operations, JWT handling, and server-side utilities. These utilities are designed to work only in Node.js environments.

## Key Rules

- **Node.js-only code**: Free to use `fs`, `path`, `process`, `crypto`, and other Node.js APIs
- **CLI tools**: Follow Unix philosophy - do one thing well
- **Error handling**: Always handle file system and network errors gracefully
- **No browser APIs**: Never use `window`, `document`, or browser-specific features

## Common Utilities

- File system operations (read, write, watch)
- Path manipulation
- CLI argument parsing
- JWT token generation and validation
- Environment variable handling
- Process management
- Network utilities
- Cryptography helpers

## CLI Tool Guidelines

- Use clear, descriptive command names
- Provide helpful `--help` output
- Support both short (`-v`) and long (`--verbose`) flags
- Exit with appropriate codes (0 for success, non-zero for errors)
- Use stderr for errors, stdout for normal output

## Testing Guidelines

- Mock file system operations when appropriate
- Test CLI tools with different argument combinations
- Verify error handling and edge cases
- Use temporary directories for file operation tests

## Code Examples

```typescript
// ✅ Good - Node.js-specific utility
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function loadConfig(fileName: string): Promise<unknown> {
  try {
    const filePath = join(process.cwd(), fileName)
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`Failed to load config from ${fileName}: ${error.message}`)
  }
}

// ❌ Bad - Uses browser API
export function saveToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value)) // NO!
}
```

## Security Considerations

- Validate all file paths to prevent directory traversal
- Use crypto.randomBytes() for secure random values
- Never expose sensitive information in error messages
- Sanitize user inputs for CLI tools

## Performance Considerations

- Use streams for large file operations
- Implement proper backpressure handling
- Cache expensive computations when appropriate
- Use worker threads for CPU-intensive tasks

## Dependencies

This package uses pnpm isolated mode. Key dependencies:
- `@types/node` - Required for TypeScript types (must be explicitly declared)
- `typescript-eslint` - Use `catalog:` for shared version
- `jsonwebtoken` - JWT operations

When adding imports, ensure the package is declared in `package.json`. Use `catalog:` for shared versions defined in `pnpm-workspace.yaml`.
