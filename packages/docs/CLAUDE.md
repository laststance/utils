# CLAUDE.md - Docs Package

This file provides specific guidance for the `packages/docs` directory when working with Claude Code.

## Package Purpose
Documentation and guides for the utilities monorepo. This package contains all user-facing documentation, API references, and usage examples.

## Key Rules
- **Clear and concise**: Write for developers who need quick answers
- **Example-driven**: Always include practical code examples
- **Up-to-date**: Keep docs synchronized with code changes
- **Searchable**: Use descriptive headings and keywords

## Documentation Structure
```
docs/
├── getting-started/     # Installation, setup guides
├── api/                 # API references for each package
├── guides/              # How-to guides and tutorials
├── examples/            # Full example projects
└── contributing/        # Contribution guidelines
```

## Writing Guidelines
- Start with the most common use case
- Use active voice and present tense
- Include both TypeScript and JavaScript examples
- Highlight breaking changes clearly
- Add "Since version X.X.X" for new features

## Example Documentation
```markdown
## Array Utilities

### chunk

Splits an array into smaller arrays of a specified size.

**Since version**: 1.0.0

#### Syntax
\`\`\`typescript
chunk<T>(array: T[], size: number): T[][]
\`\`\`

#### Examples
\`\`\`typescript
import { chunk } from '@utils/universal';

// Basic usage
chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// With strings
chunk(['a', 'b', 'c', 'd'], 3);
// [['a', 'b', 'c'], ['d']]
\`\`\`

#### Parameters
- `array`: The array to split
- `size`: The size of each chunk (must be positive)

#### Returns
An array of chunks
```

## API Documentation
- Document all exported functions/types
- Include parameter descriptions
- Show return types clearly
- Add complexity notes for performance-critical functions
- Include edge cases and error conditions

## Code Examples
- Keep examples runnable and self-contained
- Show common patterns first
- Include error handling examples
- Test all examples before publishing

## Versioning
- Follow semantic versioning in docs
- Maintain changelog with clear categories:
  - Added
  - Changed
  - Deprecated
  - Removed
  - Fixed
  - Security

## Tools Integration
- Consider using TypeDoc for automatic API docs
- Set up search functionality
- Enable syntax highlighting
- Add copy buttons to code blocks