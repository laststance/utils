import tseslint from 'typescript-eslint'
import tsPrefixer from 'eslint-config-ts-prefixer'

export default tseslint.config(
  ...tsPrefixer,
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.git/**',
      '**/.idea/**',
      '**/.husky/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/.next/**',
      '**/out/**',
    ],
  },
  {
    languageOptions: {
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
    },
  },
)
