import { describe, it, expect } from 'vitest'

import { truncate, capitalize, titleCase } from './textProcessing.js'

describe('textProcessing', () => {
  describe('truncate', () => {
    describe('basic functionality', () => {
      it('should truncate strings longer than maxLength', () => {
        expect(truncate('Hello world', 8)).toBe('Hello...')
        expect(truncate('This is a long string', 10)).toBe('This is...')
        expect(truncate('Truncate me please', 12)).toBe('Truncate...')
      })

      it('should not truncate strings shorter than or equal to maxLength', () => {
        expect(truncate('Hello', 10)).toBe('Hello')
        expect(truncate('Hello world', 11)).toBe('Hello world')
        expect(truncate('Exact length', 12)).toBe('Exact length')
      })

      it('should use custom suffix when provided', () => {
        expect(truncate('Hello world', 8, ' more')).toBe('Hel more')
        expect(truncate('Hello world', 10, '***')).toBe('Hello w***')
        expect(truncate('Hello world', 15, ' (continued)')).toBe('Hello world')
      })

      it('should handle maxLength equal to suffix length', () => {
        expect(truncate('Hello world', 3)).toBe('...')
        expect(truncate('Hello world', 3, '***')).toBe('***')
        expect(truncate('Hello world', 5, ' more')).toBe(' more')
      })

      it('should handle maxLength smaller than suffix length', () => {
        expect(truncate('Hello world', 2)).toBe('..')
        expect(truncate('Hello world', 1, '***')).toBe('*')
        expect(truncate('Hello world', 0, 'suffix')).toBe('')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(truncate('', 5)).toBe('')
        expect(truncate('', 0)).toBe('')
        expect(truncate('', 10, '...')).toBe('')
      })

      it('should handle single character strings', () => {
        expect(truncate('a', 1)).toBe('a')
        expect(truncate('a', 0)).toBe('') // maxLength 0 returns empty
        expect(truncate('a', 2)).toBe('a')
      })

      it('should handle maxLength of 0', () => {
        expect(truncate('Hello', 0)).toBe('')
        expect(truncate('Hello', 0, '...')).toBe('')
        expect(truncate('Hello', 0, 'x')).toBe('')
      })

      it('should throw error for negative maxLength', () => {
        expect(() => truncate('Hello', -1)).toThrow(
          'maxLength must be non-negative',
        )
        expect(() => truncate('Hello', -5, '...')).toThrow(
          'maxLength must be non-negative',
        )
      })

      it('should handle empty suffix', () => {
        expect(truncate('Hello world', 8, '')).toBe('Hello wo')
        expect(truncate('Hello world', 5, '')).toBe('Hello')
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode characters correctly', () => {
        expect(truncate('héllo wørld', 8)).toBe('héllo...')
        expect(truncate('测试字符串', 3)).toBe('...')
        expect(truncate('🎉🎊🎈', 2, '...')).toBe('..')
      })

      it('should handle strings with emojis', () => {
        expect(truncate('Hello 👋 World 🌍', 12)).toBe('Hello 👋...') // Trailing space trimmed
        expect(truncate('🎉🎊🎈🎁', 3, '...')).toBe('...')
      })

      it('should handle newlines and tabs', () => {
        expect(truncate('Hello\nworld\ttest', 10)).toBe('Hello\nw...')
        expect(truncate('Line1\r\nLine2', 8)).toBe('Line1...')
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'word '.repeat(10000)

        const startTime = performance.now()
        const result = truncate(largeString, 100)
        const endTime = performance.now()

        expect(result).toHaveLength(100)
        expect(endTime - startTime).toBeLessThan(10)
      })
    })
  })

  describe('capitalize', () => {
    describe('basic functionality', () => {
      it('should capitalize first letter and lowercase the rest', () => {
        expect(capitalize('hello')).toBe('Hello')
        expect(capitalize('world')).toBe('World')
        expect(capitalize('HELLO')).toBe('Hello')
        expect(capitalize('hELLO')).toBe('Hello')
      })

      it('should handle multi-word strings', () => {
        expect(capitalize('hello world')).toBe('Hello world')
        expect(capitalize('HELLO WORLD')).toBe('Hello world')
        expect(capitalize('hELLO wORLD')).toBe('Hello world')
      })

      it('should handle mixed case', () => {
        expect(capitalize('JavaScript')).toBe('Javascript')
        expect(capitalize('iPhone')).toBe('Iphone')
        expect(capitalize('XMLHttpRequest')).toBe('Xmlhttprequest')
      })
    })

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(capitalize('')).toBe('')
      })

      it('should handle single character', () => {
        expect(capitalize('a')).toBe('A')
        expect(capitalize('A')).toBe('A')
        expect(capitalize('1')).toBe('1')
        expect(capitalize('!')).toBe('!')
      })

      it('should handle strings starting with numbers or symbols', () => {
        expect(capitalize('123abc')).toBe('123abc')
        expect(capitalize('!hello')).toBe('!hello')
        expect(capitalize('@world')).toBe('@world')
        expect(capitalize('$money')).toBe('$money')
      })

      it('should handle whitespace-only strings', () => {
        expect(capitalize('   ')).toBe('   ')
        expect(capitalize('\t')).toBe('\t')
        expect(capitalize('\n')).toBe('\n')
      })

      it('should handle strings starting with whitespace', () => {
        expect(capitalize(' hello')).toBe(' hello')
        expect(capitalize('\thello')).toBe('\thello')
        expect(capitalize('\nhello')).toBe('\nhello')
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode characters correctly', () => {
        expect(capitalize('àpple')).toBe('Àpple')
        expect(capitalize('über')).toBe('Über')
        expect(capitalize('naïve')).toBe('Naïve')
        expect(capitalize('café')).toBe('Café')
      })

      it('should handle non-Latin scripts', () => {
        expect(capitalize('测试')).toBe('测试')
        expect(capitalize('тест')).toBe('Тест')
        expect(capitalize('δοκιμή')).toBe('Δοκιμή')
      })

      it('should handle emojis', () => {
        expect(capitalize('🎉party')).toBe('🎉party')
        expect(capitalize('😀happy')).toBe('😀happy')
      })

      it('should handle combining characters', () => {
        // Combining characters should be handled correctly
        expect(capitalize('é')).toBe('É') // e + combining acute
      })
    })

    describe('type safety', () => {
      it('should return string type', () => {
        const result = capitalize('test')
        expect(typeof result).toBe('string')
      })

      it('should handle null and undefined gracefully', () => {
        // @ts-expect-error testing runtime behavior
        expect(capitalize(null)).toBe(null)
        // @ts-expect-error testing runtime behavior
        expect(capitalize(undefined)).toBe(undefined)
      })
    })
  })

  describe('titleCase', () => {
    describe('basic functionality', () => {
      it('should capitalize first letter of each word', () => {
        expect(titleCase('hello world')).toBe('Hello World')
        expect(titleCase('the quick brown fox')).toBe('The Quick Brown Fox')
        expect(titleCase('a b c d')).toBe('A B C D')
      })

      it('should handle mixed case input', () => {
        expect(titleCase('HELLO WORLD')).toBe('Hello World')
        expect(titleCase('hELLO wORLD')).toBe('Hello World')
        expect(titleCase('JavaScript is awesome')).toBe('Javascript Is Awesome')
      })

      it('should preserve spacing between words', () => {
        expect(titleCase('hello  world')).toBe('Hello  World')
        expect(titleCase('hello   world   test')).toBe('Hello   World   Test')
        expect(titleCase('word\tword\tword')).toBe('Word\tWord\tWord')
      })

      it('should handle words with numbers', () => {
        expect(titleCase('hello 123 world')).toBe('Hello 123 World')
        expect(titleCase('version 2.0 release')).toBe('Version 2.0 Release')
        expect(titleCase('123abc def456')).toBe('123abc Def456')
      })
    })

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(titleCase('')).toBe('')
      })

      it('should handle single word', () => {
        expect(titleCase('hello')).toBe('Hello')
        expect(titleCase('HELLO')).toBe('Hello')
        expect(titleCase('hELLO')).toBe('Hello')
      })

      it('should handle single character words', () => {
        expect(titleCase('a')).toBe('A')
        expect(titleCase('i am a developer')).toBe('I Am A Developer')
        expect(titleCase('a b c')).toBe('A B C')
      })

      it('should handle strings with only whitespace', () => {
        expect(titleCase('   ')).toBe('   ')
        expect(titleCase('\t\n\r')).toBe('\t\n\r')
      })

      it('should handle strings with leading/trailing whitespace', () => {
        expect(titleCase('  hello world  ')).toBe('  Hello World  ')
        expect(titleCase('\thello world\n')).toBe('\tHello World\n')
      })

      it('should handle punctuation', () => {
        expect(titleCase('hello, world!')).toBe('Hello, World!')
        expect(titleCase("don't stop believing")).toBe("Don't Stop Believing")
        expect(titleCase('mr. smith and mrs. jones')).toBe(
          'Mr. Smith And Mrs. Jones',
        )
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode characters correctly', () => {
        expect(titleCase('héllo wørld')).toBe('Héllo Wørld')
        expect(titleCase('àpple ørånge')).toBe('Àpple Ørånge')
        expect(titleCase('café résumé')).toBe('Café Résumé')
      })

      it('should handle non-Latin scripts', () => {
        expect(titleCase('测试 字符串')).toBe('测试 字符串')
        expect(titleCase('тест строка')).toBe('Тест Строка')
        expect(titleCase('δοκιμή συμβολοσειράς')).toBe('Δοκιμή Συμβολοσειράς')
      })

      it('should handle emojis', () => {
        expect(titleCase('hello 👋 world 🌍')).toBe('Hello 👋 World 🌍')
        expect(titleCase('🎉party 🎊celebration')).toBe('🎉party 🎊celebration')
      })

      it('should handle special characters within words', () => {
        expect(titleCase('co-worker ex-president')).toBe(
          'Co-worker Ex-president',
        )
        expect(titleCase('user@domain.com test@example.org')).toBe(
          'User@domain.com Test@example.org',
        )
      })
    })

    describe('real-world examples', () => {
      it('should handle common phrases', () => {
        expect(titleCase('the lord of the rings')).toBe('The Lord Of The Rings')
        expect(titleCase('to be or not to be')).toBe('To Be Or Not To Be')
        expect(titleCase('once upon a time')).toBe('Once Upon A Time')
      })

      it('should handle technical terms', () => {
        expect(titleCase('hypertext markup language')).toBe(
          'Hypertext Markup Language',
        )
        expect(titleCase('javascript object notation')).toBe(
          'Javascript Object Notation',
        )
        expect(titleCase('application programming interface')).toBe(
          'Application Programming Interface',
        )
      })

      it('should handle mixed content', () => {
        expect(titleCase('chapter 1: the beginning')).toBe(
          'Chapter 1: The Beginning',
        )
        expect(titleCase('part II: the return')).toBe('Part Ii: The Return')
        expect(titleCase('version 2.0: new features')).toBe(
          'Version 2.0: New Features',
        )
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'word '.repeat(1000).trim()

        const startTime = performance.now()
        const result = titleCase(largeString)
        const endTime = performance.now()

        expect(result.split(' ')).toHaveLength(1000)
        expect(result.split(' ')[0]).toBe('Word')
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('integration tests', () => {
    it('should work together for text processing pipelines', () => {
      const text = 'HELLO WORLD THIS IS A TEST'

      // Test chaining operations
      expect(capitalize(titleCase(text.toLowerCase()))).toBe(
        'Hello world this is a test',
      )
      expect(truncate(titleCase(text.toLowerCase()), 15)).toBe('Hello World...')
      expect(titleCase(truncate(text.toLowerCase(), 20))).toBe(
        'Hello World This...',
      )
    })

    it('should handle complex real-world scenarios', () => {
      const scenarios = [
        'XMLHttpRequest API documentation',
        'iOS 15.0 release notes',
        'React.js vs Vue.js comparison',
        'Node.js server-side rendering',
        'CSS-in-JS styling solutions',
      ]

      scenarios.forEach((scenario) => {
        // Should not throw errors and produce reasonable results
        expect(() => capitalize(scenario)).not.toThrow()
        expect(() => titleCase(scenario)).not.toThrow()
        expect(() => truncate(scenario, 20)).not.toThrow()

        // Results should be strings
        expect(typeof capitalize(scenario)).toBe('string')
        expect(typeof titleCase(scenario)).toBe('string')
        expect(typeof truncate(scenario, 20)).toBe('string')
      })
    })

    it('should preserve string immutability', () => {
      const original = 'hello world test'
      const originalCopy = original

      capitalize(original)
      titleCase(original)
      truncate(original, 10)

      expect(original).toBe(originalCopy)
    })
  })
})
