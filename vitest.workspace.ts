import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/node/vitest.config.ts',
      './packages/browser/vitest.config.ts',
      './packages/universal/vitest.config.ts',
      './packages/types/vitest.config.ts',
      './packages/next-react/vitest.config.ts',
    ],
  },
})
