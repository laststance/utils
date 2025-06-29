import { defineConfig } from 'vitest/config'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['../../setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      all: true,
      include: ['**/*.{ts,js}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.d.ts',
        '**/types/**',
        '**/*.config.*',
        '**/coverage/**',
        '**/bin/**',
        'serve.js',
        'snake-to-cameled-space.js'
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
        perFile: false
      },
      watermarks: {
        statements: [65, 80],
        functions: [65, 80],
        branches: [60, 75],
        lines: [65, 80]
      },
      reportOnFailure: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true
    },
  },
})
