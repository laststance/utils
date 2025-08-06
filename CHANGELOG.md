# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README files for all packages with API documentation and examples
- Missing documentation files (CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, CODE_OF_CONDUCT.md)

### Changed
- Queue.js refactored to use event-based waiting instead of polling for better performance
- Consolidated snake-to-camel implementations for consistency across packages
- Enhanced package export configurations for better module resolution

### Fixed
- CI failures resolved across multiple packages (TypeScript errors, ESLint issues)
- Security vulnerability in on-headers dependency resolved using pnpm overrides
- Various TypeScript strict mode compatibility issues

## [1.0.0] - 2023-XX-XX

### Added

#### Browser Package
- `Queue` - Concurrent task queue with configurable concurrency
- `openInNewTab` - Opens URLs in new browser tabs
- `getImageRect` - Gets natural dimensions of images
- `getBase64Image` - Converts images to base64
- `debounce` - Debounces function execution
- `isClient` - Detects browser environment
- `sleep` - Async delay utility
- `suppressConsoleError` - Temporarily suppresses console errors
- `sizeof` - Calculates memory size of JavaScript objects
- `probability` utilities for random number generation

#### Node Package
- `readFileAsJson` - Reads and parses JSON files with type safety
- `writeJson` - Writes objects to JSON files
- `colorfulTerminalMessage` - Colorful terminal output with chalk
- `snakeToCameledSpace` - CLI tool for string conversion
- `exec` - Enhanced command execution
- Git utilities for repository operations
- `serve` - Simple HTTP server for development
- `TokenGenerator` - JWT token generation and validation
- `eqeqeqCodemod` - Code transformation utilities

#### Universal Package
- Array utilities: `arrGen`, `arrayEqual`, `arrayFillmap`, `range`
- String utilities: `snakeToCameledSpace`, `removeSpecialCharacters`, `varToString`
- Type checking: `isBoolean`, `isError`, `isFalsy`, `isFunction`, `isImgUrl`, `nonNullable`
- Object comparison: `shallowEqual`, `shallowEqualScalar`
- Date utilities: `getDate`, `yyyy_mm_dd`
- Regex patterns: `cssRegex`, `emailRegex`, `email2Regex`
- Functional utilities: `filterFalsy`, `printValue`, `retry`
- Math utilities: `positiveIntegerSum`, `random`
- Validation: `invariant` assertion function

#### Types Package
- Basic utility types: `Arrayable`, `Awaitable`, `MaybePromise`, `Nullable`, `UnwrapPromise`
- Object manipulation: `Concrete`, `DistributiveOmit`, `DistributivePick`, `EmptyObject`, `Override`
- String manipulation: `CamelToSnakeCase`, `KeysToCamelCase`, `RemoveUnderscoreFirstLetter`
- Type checking: `IsAny`, `NoInfer`, `Primitive`
- Data types: `Json`, `URLType`
- Advanced utilities: `UnionToIntersection`, `Unique`, `ExtractNonOptionalKeys`
- Runtime utilities: `assertIsError`, `betterTypeof`

#### Next-React Package
- React components with Next.js 15 App Router
- Storybook integration for component documentation
- Comprehensive testing setup with Vitest and React Testing Library
- MSW (Mock Service Worker) for API mocking
- UI components with Tailwind CSS and Radix UI

### Infrastructure
- pnpm workspace monorepo structure
- TypeScript strict configuration with shared base config
- ESLint with TypeScript support and flat config
- Prettier for code formatting
- Vitest for testing across all packages
- Turbo for build orchestration
- GitHub Actions for CI/CD
- Volta for Node.js version management

### Development Tools
- Comprehensive test coverage with Vitest
- Type checking with TypeScript strict mode
- Linting with ESLint
- Code formatting with Prettier
- Build system with Turbo
- Development server for Next.js
- Storybook for component development

---

## Release Types

### Major Releases (x.0.0)
- Breaking changes to public APIs
- Removal of deprecated features
- Significant architectural changes

### Minor Releases (x.y.0)
- New features and utilities
- New packages
- Non-breaking API additions
- Deprecation warnings for future removals

### Patch Releases (x.y.z)
- Bug fixes
- Performance improvements
- Documentation updates
- Dependency updates
- Security patches

## Migration Guides

### From 0.x to 1.0.0
This represents the initial stable release. All APIs are considered stable and will follow semantic versioning going forward.

---

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for information about how to contribute to this changelog.

## Security

Security-related changes are documented here, but for security vulnerabilities, please see our [Security Policy](./SECURITY.md).