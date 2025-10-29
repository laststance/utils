import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['../../setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      include: ['**/*.{ts,js}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.d.ts',
        '**/types/**',
        '**/*.config.*',
        '**/coverage/**',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
        perFile: false,
      },
      watermarks: {
        statements: [70, 85],
        functions: [70, 85],
        branches: [65, 80],
        lines: [70, 85],
      },
      reportOnFailure: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true,
    },
  },
})
