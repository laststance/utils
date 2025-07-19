# CLAUDE.md - Browser Package

This file provides specific guidance for the `packages/browser` directory when working with Claude Code.

## Package Purpose

Browser-specific utilities that leverage web APIs and DOM manipulation. These utilities are designed to work only in browser environments.

## Key Rules

- **Browser-only code**: Free to use `window`, `document`, DOM APIs, Web APIs
- **TypeScript DOM types**: Ensure proper typing for DOM elements and events
- **Progressive enhancement**: Consider fallbacks for older browsers when appropriate
- **No Node.js APIs**: Never use `fs`, `path`, `process`, or other Node.js-specific features

## Common Utilities

- DOM manipulation helpers
- Event handling utilities
- Browser storage (localStorage, sessionStorage, IndexedDB)
- Cookie management
- Clipboard operations
- Media queries and responsive utilities
- Animation helpers
- Web Worker utilities

## Testing Guidelines

- Use `happy-dom` for DOM testing environment
- Mock browser APIs when necessary
- Test event handlers and DOM mutations
- Verify cross-browser compatibility concerns

## Code Examples

```typescript
// ✅ Good - Browser-specific utility
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for older browsers
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

// ❌ Bad - Uses Node.js API
import fs from 'fs' // NO!
export function saveFile(content: string) {
  fs.writeFileSync('file.txt', content)
}
```

## Browser Compatibility

- Target modern browsers by default
- Document any polyfills or fallbacks
- Use feature detection over browser detection
- Consider using `@supports` and `@media` queries

## Performance Considerations

- Minimize DOM manipulations
- Use `requestAnimationFrame` for animations
- Debounce/throttle expensive operations
- Consider using Web Workers for heavy computations
