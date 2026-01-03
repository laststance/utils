import { defineConfig } from 'eslint/config'
import globals from 'globals'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import tsPreFixer from 'eslint-config-ts-prefixer'

export default defineConfig([
  ...tsPreFixer,
  reactYouMightNotNeedAnEffect.configs.recommended,
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
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'eslint.config.js',
      '*.cjs', // Ignore CommonJS files not in TypeScript project
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
      '@eslint-react/dom/no-missing-button-type': 'error',
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
      '@eslint-react/dom/no-missing-button-type': 'warn',
      '@eslint-react/no-nested-component-definitions': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
])
