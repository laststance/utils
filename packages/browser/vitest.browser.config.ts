import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
      provider: playwright(),
      // Enable headless mode for CI
      headless: true,
      // Viewport size
      viewport: { width: 1280, height: 720 },
    },
    // Use native browser environment for jQuery tests
    include: ['jQuery/**/*.{test,spec}.{ts,js}'],
    globals: true,
    setupFiles: ['../../setupTests.ts'],
  },
})
