# CLAUDE.md - Next-React Package

This file provides specific guidance for the `packages/next-react` directory when working with Claude Code.

## Package Purpose

React components built with Next.js 15 App Router, Tailwind CSS, and Radix UI. Includes Storybook for component documentation and testing.

## Key Rules

- **App Router only**: Never use Pages Router patterns
- **Server Components by default**: Only use `'use client'` when necessary
- **Component boundaries**: Place `'use client'` at the smallest necessary boundary
- **Tailwind CSS**: Use utility classes for styling, avoid inline styles
- **Radix UI**: Leverage unstyled components for accessibility

## Development Commands

- `pnpm dev` - Start Next.js dev server (port 3000)
- `pnpm storybook` - Start Storybook (port 6006)
- `pnpm build-storybook` - Build static Storybook
- `pnpm test` - Run component tests

## Component Guidelines

- Create components in `src/components/`
- Each component gets its own directory with:
  - `ComponentName.tsx` - Main component file
  - `ComponentName.stories.tsx` - Storybook stories
  - `ComponentName.test.tsx` - Component tests
  - `index.ts` - Re-export for clean imports

## Server vs Client Components

```typescript
// ✅ Good - Server Component (default)
// src/components/UserList/UserList.tsx
export async function UserList() {
  const users = await fetchUsers(); // Server-side data fetching
  return <div>{users.map(user => <UserCard key={user.id} user={user} />)}</div>;
}

// ✅ Good - Client Component with boundary
// src/components/UserCard/UserCard.tsx
'use client';
import { useState } from 'react';

export function UserCard({ user }) {
  const [expanded, setExpanded] = useState(false);
  return <div onClick={() => setExpanded(!expanded)}>...</div>;
}
```

## Storybook Best Practices

- Write stories for all exported components
- Include multiple states (default, loading, error, etc.)
- Add controls for interactive props
- Document component usage in story descriptions

## Testing Approach

- Use React Testing Library
- Test user interactions, not implementation
- Mock server components when testing client components
- Use Playwright for E2E testing of critical flows

## Styling Guidelines

- Tailwind utilities first, custom CSS last
- Use CSS variables for design tokens
- Follow mobile-first responsive design
- Leverage Radix UI's built-in accessibility

## Performance Optimization

- Lazy load client components when appropriate
- Use Next.js Image component for images
- Implement proper loading states
- Minimize client-side JavaScript bundles
