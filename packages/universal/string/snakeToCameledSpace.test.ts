import { describe, it, expect } from 'vitest'
import snakeToCameledSpace from './snakeToCameledSpace'

describe('snakeToCameledSpace', () => {
  it('should convert simple kebab-case to title case', () => {
    expect(snakeToCameledSpace('hello-world')).toBe('Hello World')
    expect(snakeToCameledSpace('test-case')).toBe('Test Case')
    expect(snakeToCameledSpace('api-key')).toBe('Api Key')
  })

  it('should handle single words', () => {
    expect(snakeToCameledSpace('single')).toBe('Single')
    expect(snakeToCameledSpace('word')).toBe('Word')
    expect(snakeToCameledSpace('test')).toBe('Test')
  })

  it('should handle multiple hyphens', () => {
    expect(snakeToCameledSpace('one-two-three')).toBe('One Two Three')
    expect(snakeToCameledSpace('my-long-component-name')).toBe('My Long Component Name')
    expect(snakeToCameledSpace('very-long-string-with-many-words')).toBe('Very Long String With Many Words')
  })

  it('should handle the example from the documentation', () => {
    const input = 'code-piece-of-complete-guide-to-react-client-rendering-behavior'
    const expected = 'Code Piece Of Complete Guide To React Client Rendering Behavior'
    expect(snakeToCameledSpace(input)).toBe(expected)
  })

  it('should handle empty string', () => {
    expect(snakeToCameledSpace('')).toBe('')
  })

  it('should handle strings without hyphens', () => {
    expect(snakeToCameledSpace('nohyphens')).toBe('Nohyphens')
    expect(snakeToCameledSpace('UPPERCASE')).toBe('UPPERCASE')
    expect(snakeToCameledSpace('lowercase')).toBe('Lowercase')
  })

  it('should handle strings with numbers', () => {
    expect(snakeToCameledSpace('item-1-test')).toBe('Item 1 Test')
    expect(snakeToCameledSpace('version-2-0-1')).toBe('Version 2 0 1')
    expect(snakeToCameledSpace('api-v1-endpoint')).toBe('Api V1 Endpoint')
  })

  it('should handle consecutive hyphens', () => {
    expect(snakeToCameledSpace('double--hyphen')).toBe('Double  Hyphen')
    expect(snakeToCameledSpace('triple---hyphen')).toBe('Triple   Hyphen')
  })

  it('should handle hyphens at the beginning and end', () => {
    expect(snakeToCameledSpace('-leading-hyphen')).toBe(' Leading Hyphen')
    expect(snakeToCameledSpace('trailing-hyphen-')).toBe('Trailing Hyphen ')
    expect(snakeToCameledSpace('-both-ends-')).toBe(' Both Ends ')
  })

  it('should preserve existing capitalization in the middle of words', () => {
    expect(snakeToCameledSpace('iPhone-app')).toBe('IPhone App')
    expect(snakeToCameledSpace('JSON-api')).toBe('JSON Api')
    expect(snakeToCameledSpace('HTML-css')).toBe('HTML Css')
  })

  it('should handle special characters within words', () => {
    expect(snakeToCameledSpace('user@domain-test')).toBe('User@domain Test')
    expect(snakeToCameledSpace('price$-calculation')).toBe('Price$ Calculation')
    expect(snakeToCameledSpace('file.txt-backup')).toBe('File.txt Backup')
  })

  it('should handle mixed case input', () => {
    expect(snakeToCameledSpace('MiXeD-CaSe')).toBe('MiXeD CaSe')
    expect(snakeToCameledSpace('camelCase-kebab-case')).toBe('CamelCase Kebab Case')
  })

  it('should handle real-world component names', () => {
    expect(snakeToCameledSpace('button-primary')).toBe('Button Primary')
    expect(snakeToCameledSpace('nav-menu-item')).toBe('Nav Menu Item')
    expect(snakeToCameledSpace('form-input-field')).toBe('Form Input Field')
    expect(snakeToCameledSpace('modal-dialog-box')).toBe('Modal Dialog Box')
  })

  it('should handle file names and paths', () => {
    expect(snakeToCameledSpace('my-component.tsx')).toBe('My Component.tsx')
    expect(snakeToCameledSpace('user-profile-page')).toBe('User Profile Page')
    expect(snakeToCameledSpace('api-client-service')).toBe('Api Client Service')
  })

  it('should handle edge cases with only hyphens', () => {
    expect(snakeToCameledSpace('-')).toBe(' ')
    expect(snakeToCameledSpace('--')).toBe('  ')
    expect(snakeToCameledSpace('---')).toBe('   ')
  })

  it('should be consistent with multiple calls', () => {
    const input = 'test-string-conversion'
    const result1 = snakeToCameledSpace(input)
    const result2 = snakeToCameledSpace(input)
    expect(result1).toBe(result2)
    expect(result1).toBe('Test String Conversion')
  })

  it('should handle Unicode characters', () => {
    expect(snakeToCameledSpace('café-résumé')).toBe('Café Résumé')
    expect(snakeToCameledSpace('naïve-approach')).toBe('Naïve Approach')
    expect(snakeToCameledSpace('piñata-party')).toBe('Piñata Party')
  })
})