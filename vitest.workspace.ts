import { defineWorkspace } from 'vitest/config'
import { coverageConfigDefaults } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './packages/node/vitest.config.ts',
    test: {
      name: 'node',
      environment: 'node',
    },
  },
  {
    extends: './packages/browser/vitest.config.ts',
    test: {
      name: 'browser',
      environment: 'happy-dom',
    },
  },
  {
    extends: './packages/universal/vitest.config.ts',
    test: {
      name: 'universal',
      environment: 'happy-dom',
    },
  },
  {
    extends: './packages/types/vitest.config.ts',
    test: {
      name: 'types',
      environment: 'node',
    },
  },
  {
    extends: './packages/next-react/vitest.config.ts',
    test: {
      name: 'next-react',
      environment: 'happy-dom',
    },
  },
])
