import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['**/*.{ts,js}'],
      exclude: ['node_modules', 'dist', '**/*.test.{ts,js}', '**/*.spec.{ts,js}', 'vitest.config.ts', 'setupTests.ts'],
    },
  },
})
