import tsPrefixer from 'eslint-config-ts-prefixer'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tsPrefixer,
  {
    ignores: ['*.d.ts', 'coverage/**', 'dist/**', 'build/**', 'playground/**'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: [
          '**/*.js',
          '**/*.mjs',
          '**/*.cjs',
          'eslint.config.js',
        ],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'],
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
      'no-undef': 'off',
    },
  },
)
