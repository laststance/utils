import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from './mocks/server.js'

// Extends Vitest's expect with jest-dom matchers
import '@testing-library/jest-dom'

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close MSW server after all tests
afterAll(() => {
  server.close()
})

// Mock fetch for happy-dom
global.fetch = globalThis.fetch
