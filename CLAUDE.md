# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Task

- Re impment all jQuery API with plain javascript in browser/jQuery folder.
- first, create issue and write task requirement.
- setup vitest browser test for testing within Real DOM.
- start implementation. this must be TDD apprroch. Understand a API specification from document, read real test code from Github jQuery repository etc. end then write test with vitest browser spec.
- start implemantation.
- Passed test per API implementation, go ahead next API.

## Rules for Claude Code

- Feel free to web search for information.
- Feel free to use mcp tools for work efficiently.

## Development Commands

### Core Commands

- `pnpm build` - Build all packages in the monorepo
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - TypeScript type checking across all packages
- `pnpm prettier` - Format code using Prettier
- `pnpm validate` - Run all checks in parallel using Turborepo (typecheck, test, lint, build)

### Package-Specific Commands

- `cd packages/[package-name] && pnpm test` - Run tests for specific package
- `cd packages/next-react && pnpm dev` - Start Next.js development server (port 3000)
- `cd packages/next-react && pnpm storybook` - Start Storybook (port 6006)

### Test Commands

- `pnpm test --watch` - Run tests in watch mode
- `pnpm test --coverage` - Generate test coverage reports
- `pnpm test [filename]` - Run a specific test file
- Individual package testing: Each package has its own test setup in `__tests__/` directories

## Architecture

This is a **pnpm workspace monorepo** containing utility packages for different JavaScript environments:

### Package Structure

- **packages/universal/** - Platform-agnostic utilities (no browser/Node.js APIs)
- **packages/browser/** - Browser-specific utilities (DOM, web APIs)
- **packages/node/** - Node.js utilities (CLI tools, file system, JWT handling)
- **packages/next-react/** - React components with Next.js App Router and Storybook
- **packages/types/** - TypeScript type definitions and utility types

### Technology Stack

- **TypeScript**: Strict configuration, Node 22.16.0 (Volta)
- **Testing**: Vitest with workspace configuration, React Testing Library
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **React/Next.js**: Next.js 15 App Router only, Tailwind CSS, Radix UI components
- **Storybook**: Component documentation and testing

### Testing Configuration

- Global setup in `vitest.workspace.ts` and `setupTests.ts`
- Package-specific `vitest.config.ts` files
- Browser testing with happy-dom
- Component testing with React Testing Library
- E2E testing with Playwright (for UI changes)
- Test patterns: `*.test.{ts,js}` or `*.spec.{ts,js}`

## Important Rules

### Code Standards

- All comments and documentation must be in English
- Fix TypeScript errors only if code runs correctly at runtime
- Never change runtime behavior when fixing type issues
- Follow existing code patterns and conventions within each package

### Next.js Specific

- Use App Router exclusively (never Pages Router)
- Use `'use client'` only at component boundaries for client-side trees
- Use `'use server'` for server-only files

### Development Workflow

- Always re-run tests after fixing test failures
- Run linting and type checking before commits
- For UI changes: use Playwright to verify behavior and generate test code
- Check port 3000 availability before starting Next.js dev server
- Use `pnpm validate` to run all validations before pushing code

### Package Selection Guidelines

- Universal logic → `packages/universal`
- Browser-specific code → `packages/browser`
- Node.js server code → `packages/node`
- React components → `packages/next-react`
- Type definitions → `packages/types`
