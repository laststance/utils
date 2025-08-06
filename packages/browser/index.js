// Browser-specific utilities

// Queue management
export { default as Queue } from './Queue.js'

// DOM and browser APIs
export { getBase64Image } from './getBase64Image.js'
export { getImageRect } from './getImageRect.ts'
export { openInNewTab } from './openInNewTab.ts'

// Environment detection
export { isClient } from './isClient.ts'

// Debug utilities
export { suppressConsoleError } from './suppressConsoleError.js'

// Size calculation
export { default as sizeof } from './sizeof/index.js'
export { default as byte_size } from './sizeof/byte_size.js'

// Re-exports from universal package for backward compatibility
// These utilities have been moved to the universal package but are re-exported here
export { debounce } from '../universal/debounce.ts'
export { default as sleep } from '../universal/sleep.ts'
export { rand } from '../universal/random.ts'
