import { defineConfig } from 'eslint/config'
import globals from 'globals'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import tsPreFixer from 'eslint-config-ts-prefixer'

export default defineConfig([
  ...tsPreFixer,
  // eslint-plugin-react-you-might-not-need-an-effect
  // Main doc: https://react.dev/learn/you-might-not-need-an-effect
  // GitHub: https://github.com/NickvanDyke/eslint-plugin-react-you-might-not-need-an-effect
  {
    plugins: {
      'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
    },
    rules: {
      // https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state
      'react-you-might-not-need-an-effect/no-derived-state': 'error',
      // https://react.dev/learn/you-might-not-need-an-effect#chains-of-computations
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'error',
      // https://react.dev/learn/you-might-not-need-an-effect#sharing-logic-between-event-handlers
      'react-you-might-not-need-an-effect/no-event-handler': 'error',
      // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change':
        'error',
      // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change':
        'error',
      // https://react.dev/learn/you-might-not-need-an-effect#notifying-parent-components-about-state-changes
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent':
        'error',
      // https://react.dev/learn/you-might-not-need-an-effect#passing-data-to-the-parent
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'error',
      // https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
      'react-you-might-not-need-an-effect/no-initialize-state': 'error',
    },
  },
  // Use typescript-eslint recommended config directly
  // Add react-hooks plugin for hook rules
  {
    ignores: [
      '*.d.ts',
      'coverage/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.storybook/**',
      'storybook-static/**',
      'node_modules/**',
      'generated/**', // Prisma generated files
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'eslint.config.js',
      '*.cjs', // Ignore CommonJS files not in TypeScript project
      'playground/**',
    ],
  },
  {
    // Apply React rules to React components (TSX/JSX) and custom hooks in .ts files.
    files: ['**/*.tsx', '**/*.jsx', '**/use*.ts'],
    languageOptions: {
      globals: {
        React: 'readonly',
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      ...eslintReact.configs.all.plugins,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // eslint-plugin-react-x
      '@eslint-react/no-forward-ref': 'error',
      '@eslint-react/no-context-provider': 'error',
      '@eslint-react/no-missing-key': 'error',
      '@eslint-react/no-duplicate-key': 'error',
      '@eslint-react/no-missing-component-display-name': 'error',
      '@eslint-react/no-nested-component-definitions': 'error',
      // eslint-plugin-react-x
      '@eslint-react/dom-no-missing-button-type': 'error',
      // 'react-x/dom/no-missing-button-type': 'error', // TODO: Check correct rule path
      // React Compiler rules
      'react-hooks/config': 'error',
      'react-hooks/error-boundaries': 'error',
      'react-hooks/component-hook-factories': 'error',
      'react-hooks/gating': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/static-components': 'error',
      'react-hooks/unsupported-syntax': 'error',
      'react-hooks/use-memo': 'error',
      'react-hooks/incompatible-library': 'error',
    },
  },
  {
    files: [
      '**/*.stories.tsx',
      '**/*.stories.ts',
      '**/*.stories.jsx',
      '**/*.stories.js',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        fail: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-constant-binary-expression': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // shadcn/ui blocks and design-system components - relax strict rules
    files: [
      'components/*.tsx',
      'components/ui/*.tsx',
      'components/blocks/**/*.tsx',
      'components/design-system/**/*.tsx',
    ],
    rules: {
      '@eslint-react/dom-no-missing-button-type': 'warn',
      '@eslint-react/no-nested-component-definitions': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
])
