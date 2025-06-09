/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['ts-prefixer'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['*.js'],
      extends: ['eslint:recommended'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      extends: ['eslint:recommended'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      env: {
        node: true,
        browser: true,
        es6: true,
        jest: true,
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  ],
}