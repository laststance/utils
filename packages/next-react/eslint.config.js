import tseslint from 'typescript-eslint'
import tsPrefixer from 'eslint-config-ts-prefixer'
import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  // Extend Next.js config using FlatCompat first
  ...compat.config({
    extends: ['next'],
  }),
  // Then apply tsPrefixer, but filter out conflicting plugins
  ...tsPrefixer.filter((config) => {
    // Skip configs that define plugins that might conflict with Next.js
    if (
      config.plugins &&
      ('import' in config.plugins || 'react' in config.plugins)
    ) {
      return false
    }
    return true
  }),
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
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Override rules from base configs
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-img-element': 'off',
      'no-console': 'off',
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
    },
  },
)
