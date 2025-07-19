import { describe, it, expect } from 'vitest'

import { cssRegex, cssModuleRegex, sassRegex, sassModuleRegex } from './css.js'

describe('CSS Regex Patterns', () => {
  describe('cssRegex', () => {
    it('should match .css files', () => {
      expect(cssRegex.test('styles.css')).toBe(true)
      expect(cssRegex.test('main.css')).toBe(true)
      expect(cssRegex.test('component.css')).toBe(true)
      expect(cssRegex.test('global.css')).toBe(true)
    })

    it('should match .css files with paths', () => {
      expect(cssRegex.test('./styles/main.css')).toBe(true)
      expect(cssRegex.test('/assets/css/theme.css')).toBe(true)
      expect(cssRegex.test('src/components/Button/button.css')).toBe(true)
    })

    it('should not match non-css files', () => {
      expect(cssRegex.test('styles.scss')).toBe(false)
      expect(cssRegex.test('styles.sass')).toBe(false)
      expect(cssRegex.test('styles.less')).toBe(false)
      expect(cssRegex.test('script.js')).toBe(false)
      expect(cssRegex.test('component.tsx')).toBe(false)
      expect(cssRegex.test('data.json')).toBe(false)
    })

    it('should match module css files', () => {
      expect(cssRegex.test('component.module.css')).toBe(true)
    })

    it('should not match files that just contain css in the name', () => {
      expect(cssRegex.test('css-loader.js')).toBe(false)
      expect(cssRegex.test('mycss.txt')).toBe(false)
      expect(cssRegex.test('styles.css.map')).toBe(false)
    })
  })

  describe('cssModuleRegex', () => {
    it('should match .module.css files', () => {
      expect(cssModuleRegex.test('component.module.css')).toBe(true)
      expect(cssModuleRegex.test('Button.module.css')).toBe(true)
      expect(cssModuleRegex.test('styles.module.css')).toBe(true)
    })

    it('should match .module.css files with paths', () => {
      expect(cssModuleRegex.test('./components/Button.module.css')).toBe(true)
      expect(cssModuleRegex.test('/src/styles/theme.module.css')).toBe(true)
      expect(cssModuleRegex.test('assets/css/layout.module.css')).toBe(true)
    })

    it('should not match regular css files', () => {
      expect(cssModuleRegex.test('styles.css')).toBe(false)
      expect(cssModuleRegex.test('main.css')).toBe(false)
      expect(cssModuleRegex.test('component.css')).toBe(false)
    })

    it('should not match other module file types', () => {
      expect(cssModuleRegex.test('component.module.scss')).toBe(false)
      expect(cssModuleRegex.test('component.module.sass')).toBe(false)
      expect(cssModuleRegex.test('component.module.less')).toBe(false)
      expect(cssModuleRegex.test('component.module.js')).toBe(false)
    })

    it('should not match partial matches', () => {
      expect(cssModuleRegex.test('module.css.backup')).toBe(false)
      expect(cssModuleRegex.test('component.css.module')).toBe(false)
      expect(cssModuleRegex.test('not-module.css')).toBe(false)
    })
  })

  describe('sassRegex', () => {
    it('should match .scss files', () => {
      expect(sassRegex.test('styles.scss')).toBe(true)
      expect(sassRegex.test('main.scss')).toBe(true)
      expect(sassRegex.test('variables.scss')).toBe(true)
    })

    it('should match .sass files', () => {
      expect(sassRegex.test('styles.sass')).toBe(true)
      expect(sassRegex.test('main.sass')).toBe(true)
      expect(sassRegex.test('mixins.sass')).toBe(true)
    })

    it('should match sass files with paths', () => {
      expect(sassRegex.test('./styles/main.scss')).toBe(true)
      expect(sassRegex.test('/assets/sass/theme.sass')).toBe(true)
      expect(sassRegex.test('src/components/Button/button.scss')).toBe(true)
    })

    it('should not match css files', () => {
      expect(sassRegex.test('styles.css')).toBe(false)
      expect(sassRegex.test('component.module.css')).toBe(false)
    })

    it('should not match other file types', () => {
      expect(sassRegex.test('styles.less')).toBe(false)
      expect(sassRegex.test('script.js')).toBe(false)
      expect(sassRegex.test('component.tsx')).toBe(false)
      expect(sassRegex.test('data.json')).toBe(false)
    })

    it('should match module sass files', () => {
      expect(sassRegex.test('component.module.scss')).toBe(true)
      expect(sassRegex.test('component.module.sass')).toBe(true)
    })
  })

  describe('sassModuleRegex', () => {
    it('should match .module.scss files', () => {
      expect(sassModuleRegex.test('component.module.scss')).toBe(true)
      expect(sassModuleRegex.test('Button.module.scss')).toBe(true)
      expect(sassModuleRegex.test('styles.module.scss')).toBe(true)
    })

    it('should match .module.sass files', () => {
      expect(sassModuleRegex.test('component.module.sass')).toBe(true)
      expect(sassModuleRegex.test('Button.module.sass')).toBe(true)
      expect(sassModuleRegex.test('styles.module.sass')).toBe(true)
    })

    it('should match module sass files with paths', () => {
      expect(sassModuleRegex.test('./components/Button.module.scss')).toBe(true)
      expect(sassModuleRegex.test('/src/styles/theme.module.sass')).toBe(true)
      expect(sassModuleRegex.test('assets/sass/layout.module.scss')).toBe(true)
    })

    it('should not match regular sass files', () => {
      expect(sassModuleRegex.test('styles.scss')).toBe(false)
      expect(sassModuleRegex.test('main.sass')).toBe(false)
      expect(sassModuleRegex.test('variables.scss')).toBe(false)
    })

    it('should not match css module files', () => {
      expect(sassModuleRegex.test('component.module.css')).toBe(false)
      expect(sassModuleRegex.test('styles.module.css')).toBe(false)
    })

    it('should not match other module file types', () => {
      expect(sassModuleRegex.test('component.module.less')).toBe(false)
      expect(sassModuleRegex.test('component.module.js')).toBe(false)
      expect(sassModuleRegex.test('component.module.ts')).toBe(false)
    })

    it('should not match partial matches', () => {
      expect(sassModuleRegex.test('module.scss.backup')).toBe(false)
      expect(sassModuleRegex.test('component.scss.module')).toBe(false)
      expect(sassModuleRegex.test('not-module.scss')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(cssRegex.test('')).toBe(false)
      expect(cssModuleRegex.test('')).toBe(false)
      expect(sassRegex.test('')).toBe(false)
      expect(sassModuleRegex.test('')).toBe(false)
    })

    it('should handle files with multiple dots', () => {
      expect(cssRegex.test('my.component.css')).toBe(true)
      expect(cssModuleRegex.test('my.component.module.css')).toBe(true)
      expect(sassRegex.test('my.component.scss')).toBe(true)
      expect(sassModuleRegex.test('my.component.module.scss')).toBe(true)
    })

    it('should be case sensitive', () => {
      expect(cssRegex.test('styles.CSS')).toBe(false)
      expect(cssModuleRegex.test('component.MODULE.CSS')).toBe(false)
      expect(sassRegex.test('styles.SCSS')).toBe(false)
      expect(sassModuleRegex.test('component.MODULE.SCSS')).toBe(false)
    })

    it('should handle very long file names', () => {
      const longName = 'very-long-component-name-with-many-words'
      expect(cssRegex.test(`${longName}.css`)).toBe(true)
      expect(cssModuleRegex.test(`${longName}.module.css`)).toBe(true)
      expect(sassRegex.test(`${longName}.scss`)).toBe(true)
      expect(sassModuleRegex.test(`${longName}.module.sass`)).toBe(true)
    })
  })
})
