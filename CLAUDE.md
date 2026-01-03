# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (pnpm required)
pnpm install

# Build, test, lint across all packages (via Turbo)
pnpm build
pnpm test
pnpm lint
pnpm typecheck

# Full validation (typecheck + test + lint + build)
pnpm validate

# Format code
pnpm prettier

# Target specific package
pnpm --filter next-react test
pnpm --filter browser test
pnpm --filter next-react dev          # Next.js dev server (port 3000)
pnpm --filter next-react storybook    # Storybook (port 6006)

# Run single test file
cd packages/browser && pnpm test -- path/to/file.test.ts
```

## Architecture

This is a **monorepo organized by runtime environment**, not by feature. Turbo orchestrates cross-package builds and tests.

### Package Selection

| Package | Use When |
|---------|----------|
| `packages/universal` | Platform-agnostic code (no `window`, `document`, `fs`, `process`) |
| `packages/browser` | Browser-only code (DOM, Web APIs, localStorage) |
| `packages/node` | Node.js-only code (fs, path, process, crypto) |
| `packages/types` | Shared TypeScript types (no runtime code) |
| `packages/next-react` | React components with Next.js 16 App Router |

### Key Stack

- **Package Manager**: pnpm 10 with workspaces (isolated mode)
- **Build Orchestration**: Turborepo 2.7
- **Testing**: Vitest 4.0 (workspace mode) + Playwright 1.57 for E2E
- **UI**: Next.js 16 + React 19 + Tailwind CSS 4 + Radix UI + shadcn/ui patterns
- **Storybook**: v10 with `@storybook/nextjs-vite`
- **TypeScript**: 5.9 (strict mode)

## Dependency Management

### pnpm Isolated Mode

This project uses **pnpm isolated mode** (default, no `.npmrc` overrides). This means:

- **Each package must declare its own dependencies** - packages cannot access dependencies from other packages
- **Root imports require root package.json declarations** - if `setupTests.ts` imports a package, it must be in root `package.json`
- **No phantom dependencies** - all imports must be explicitly declared

### pnpm Catalogs

Shared dependency versions are managed via `catalog:` protocol in `pnpm-workspace.yaml`:

```yaml
# pnpm-workspace.yaml
catalog:
  vitest: ^4.0.16
  typescript: ^5.9.3
  eslint: ^9.39.2
```

```json
// package.json - Use catalog: to reference
{
  "devDependencies": {
    "vitest": "catalog:",
    "typescript": "catalog:"
  }
}
```

### Adding New Dependencies

| Scope | Action |
|-------|--------|
| Single package | `pnpm --filter <package> add <dep>` |
| Shared version | Add to `catalog:` in `pnpm-workspace.yaml`, then use `"dep": "catalog:"` |
| Root-level tool | `pnpm add -D -w <dep>` |

**Important**: After adding dependencies, run `pnpm install` and verify with `pnpm validate`.

## Conventions

### Language
- All code comments and documentation in **English**

### Next.js
- **App Router only** - never use Pages Router patterns
- Server Components by default
- `'use client'` only at the smallest necessary boundary
- Use `'use server'` for server-only files

### TypeScript
- Strict mode enabled (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Fix type errors **without changing runtime behavior**
- Prefer explicit typing over `any`

### Testing
- Test files: `*.test.ts` / `*.test.tsx`
- Use Vitest with `happy-dom` for DOM testing
- Playwright for UI verification after style changes
- Re-run tests after fixing failures to verify the fix

## Package-Specific Guidance

Each package has its own `CLAUDE.md` with environment-specific rules:
- `packages/browser/CLAUDE.md` - Browser API usage, DOM testing
- `packages/node/CLAUDE.md` - Node.js patterns, CLI tools
- `packages/next-react/CLAUDE.md` - React components, Storybook, Server vs Client
- `packages/types/CLAUDE.md` - Type definitions with schema validation (zod)
- `packages/universal/CLAUDE.md` - Zero runtime dependencies, cross-platform code

## CI Workflows

GitHub Actions run on PRs and main branch pushes:
- `test.yml` - Runs `pnpm test` across all packages
- `lint.yml` - Runs `pnpm lint`
- `typecheck.yml` - Runs `pnpm typecheck`
- `build.yml` - Runs `pnpm build`
