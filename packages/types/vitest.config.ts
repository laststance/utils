import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['../../setupTests.ts'],
    typecheck: {
      enabled: true,
      only: false,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.d.ts',
        '**/coverage/**',
        'index.ts',
        '**/zodPlayground/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
        perFile: false,
        '**/*.ts': {
          lines: 90,
          functions: 90,
          branches: 85,
          statements: 90,
        },
        '**/zodPlayground/**': {
          lines: 0,
          functions: 0,
          branches: 0,
          statements: 0,
        },
      },
      watermarks: {
        statements: [80, 90],
        functions: [80, 90],
        branches: [75, 85],
        lines: [80, 90],
      },
      reportOnFailure: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true,
    },
  },
})
