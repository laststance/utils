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

- **Package Manager**: pnpm with workspaces
- **Build Orchestration**: Turborepo
- **Testing**: Vitest 4 (workspace mode) + Playwright for E2E
- **UI**: Next.js 16 + React 19 + Tailwind CSS 4 + Radix UI + shadcn/ui patterns
- **Storybook**: v10 with `@storybook/nextjs-vite`

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
- `packages/types/CLAUDE.md` - Types-only patterns, no runtime code
- `packages/universal/CLAUDE.md` - Zero dependencies, cross-platform code

## CI Workflows

GitHub Actions run on PRs and main branch pushes:
- `test.yml` - Runs `pnpm test` across all packages
- `lint.yml` - Runs `pnpm lint`
- `typecheck.yml` - Runs `pnpm typecheck`
- `build.yml` - Runs `pnpm build`
