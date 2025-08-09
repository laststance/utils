import { describe, it, expect } from 'vitest'

import {
  wordCount,
  isBlank,
  lines,
  lineCount,
  characterCount,
  sentences,
  sentenceCount,
} from './analysis.js'

describe('analysis', () => {
  describe('wordCount', () => {
    describe('basic functionality', () => {
      it('should count words separated by single spaces', () => {
        expect(wordCount('hello world')).toBe(2)
        expect(wordCount('the quick brown fox')).toBe(4)
        expect(wordCount('one two three four five')).toBe(5)
      })

      it('should count single words', () => {
        expect(wordCount('hello')).toBe(1)
        expect(wordCount('world')).toBe(1)
        expect(wordCount('antidisestablishmentarianism')).toBe(1)
      })

      it('should handle multiple consecutive spaces', () => {
        expect(wordCount('hello   world')).toBe(2)
        expect(wordCount('one  two    three')).toBe(3)
        expect(wordCount('extra     spaces    everywhere')).toBe(3)
      })

      it('should handle different types of whitespace', () => {
        expect(wordCount('hello\tworld')).toBe(2)
        expect(wordCount('hello\nworld')).toBe(2)
        expect(wordCount('hello\r\nworld')).toBe(2)
        expect(wordCount('mixed\t\nwhitespace\r\ncharacters')).toBe(3)
      })

      it('should handle hyphenated and compound words', () => {
        expect(wordCount('well-formatted')).toBe(1)
        expect(wordCount('self-explanatory word')).toBe(2)
        expect(wordCount('mother-in-law')).toBe(1)
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(wordCount('')).toBe(0)
      })

      it('should handle whitespace-only strings', () => {
        expect(wordCount('   ')).toBe(0)
        expect(wordCount('\t\n\r')).toBe(0)
        expect(wordCount('  \t  \n  \r  ')).toBe(0)
      })

      it('should handle leading and trailing whitespace', () => {
        expect(wordCount('  hello world  ')).toBe(2)
        expect(wordCount('\thello world\n')).toBe(2)
        expect(wordCount('   single   ')).toBe(1)
      })

      it('should handle strings with only punctuation', () => {
        expect(wordCount('!!!')).toBe(1)
        expect(wordCount('... --- ...')).toBe(3)
        expect(wordCount('@#$%')).toBe(1)
      })
    })

    describe('special characters and unicode', () => {
      it('should handle numbers', () => {
        expect(wordCount('hello 123 world')).toBe(3)
        expect(wordCount('version 2.0 release')).toBe(3)
        expect(wordCount('1 2 3 4 5')).toBe(5)
      })

      it('should handle unicode characters', () => {
        expect(wordCount('héllo wørld')).toBe(2)
        expect(wordCount('测试 字符串')).toBe(2)
        expect(wordCount('café résumé')).toBe(2)
      })

      it('should handle emojis', () => {
        expect(wordCount('hello 👋 world 🌍')).toBe(4)
        expect(wordCount('🎉 party 🎊 time')).toBe(4)
      })

      it('should handle mixed content', () => {
        expect(wordCount('Hello @username! How are you? #happy')).toBe(6)
        expect(wordCount('Email: user@example.com Phone: 555-1234')).toBe(4)
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'word '.repeat(10000).trim()

        const startTime = performance.now()
        const count = wordCount(largeString)
        const endTime = performance.now()

        expect(count).toBe(10000)
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('isBlank', () => {
    describe('basic functionality', () => {
      it('should return true for empty strings', () => {
        expect(isBlank('')).toBe(true)
      })

      it('should return true for whitespace-only strings', () => {
        expect(isBlank(' ')).toBe(true)
        expect(isBlank('   ')).toBe(true)
        expect(isBlank('\t')).toBe(true)
        expect(isBlank('\n')).toBe(true)
        expect(isBlank('\r')).toBe(true)
        expect(isBlank('\r\n')).toBe(true)
        expect(isBlank('  \t  \n  \r  ')).toBe(true)
      })

      it('should return false for non-blank strings', () => {
        expect(isBlank('hello')).toBe(false)
        expect(isBlank('hello world')).toBe(false)
        expect(isBlank(' hello ')).toBe(false)
        expect(isBlank('\thello\n')).toBe(false)
      })

      it('should return false for strings with only special characters', () => {
        expect(isBlank('0')).toBe(false)
        expect(isBlank('!')).toBe(false)
        expect(isBlank('@#$')).toBe(false)
        expect(isBlank('...')).toBe(false)
      })
    })

    describe('null and undefined handling', () => {
      it('should return true for null and undefined', () => {
        expect(isBlank(null)).toBe(true)
        expect(isBlank(undefined)).toBe(true)
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode whitespace', () => {
        expect(isBlank('\u00A0')).toBe(true) // Non-breaking space
        expect(isBlank('\u2000\u2001\u2002')).toBe(true) // Various unicode spaces
      })

      it('should handle unicode characters', () => {
        expect(isBlank('é')).toBe(false)
        expect(isBlank('测试')).toBe(false)
        expect(isBlank('🎉')).toBe(false)
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeBlankString = ' '.repeat(10000)
        const largeNonBlankString = ' '.repeat(5000) + 'x' + ' '.repeat(5000)

        const startTime1 = performance.now()
        const result1 = isBlank(largeBlankString)
        const endTime1 = performance.now()

        const startTime2 = performance.now()
        const result2 = isBlank(largeNonBlankString)
        const endTime2 = performance.now()

        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(endTime1 - startTime1).toBeLessThan(10)
        expect(endTime2 - startTime2).toBeLessThan(10)
      })
    })
  })

  describe('lines', () => {
    describe('basic functionality', () => {
      it('should split strings on Unix line endings', () => {
        expect(lines('hello\nworld')).toEqual(['hello', 'world'])
        expect(lines('line1\nline2\nline3')).toEqual([
          'line1',
          'line2',
          'line3',
        ])
      })

      it('should split strings on Windows line endings', () => {
        expect(lines('hello\r\nworld')).toEqual(['hello', 'world'])
        expect(lines('line1\r\nline2\r\nline3')).toEqual([
          'line1',
          'line2',
          'line3',
        ])
      })

      it('should split strings on classic Mac line endings', () => {
        expect(lines('hello\rworld')).toEqual(['hello', 'world'])
        expect(lines('line1\rline2\rline3')).toEqual([
          'line1',
          'line2',
          'line3',
        ])
      })

      it('should handle mixed line endings', () => {
        expect(lines('unix\nwindows\r\nmac\r')).toEqual([
          'unix',
          'windows',
          'mac',
          '',
        ])
        expect(lines('line1\r\nline2\nline3\rline4')).toEqual([
          'line1',
          'line2',
          'line3',
          'line4',
        ])
      })

      it('should preserve empty lines', () => {
        expect(lines('line1\n\nline3')).toEqual(['line1', '', 'line3'])
        expect(lines('line1\r\n\r\nline3')).toEqual(['line1', '', 'line3'])
        expect(lines('\nline2\n')).toEqual(['', 'line2', ''])
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(lines('')).toEqual([''])
      })

      it('should handle single line strings', () => {
        expect(lines('single line')).toEqual(['single line'])
        expect(lines('no line breaks here')).toEqual(['no line breaks here'])
      })

      it('should handle strings with only line breaks', () => {
        expect(lines('\n')).toEqual(['', ''])
        expect(lines('\r\n')).toEqual(['', ''])
        expect(lines('\n\n\n')).toEqual(['', '', '', ''])
        expect(lines('\r\n\r\n')).toEqual(['', '', ''])
      })

      it('should handle trailing line breaks', () => {
        expect(lines('line1\nline2\n')).toEqual(['line1', 'line2', ''])
        expect(lines('line1\r\nline2\r\n')).toEqual(['line1', 'line2', ''])
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode content', () => {
        expect(lines('héllo\nwørld')).toEqual(['héllo', 'wørld'])
        expect(lines('测试\n字符串')).toEqual(['测试', '字符串'])
        expect(lines('🎉\n🎊\n🎈')).toEqual(['🎉', '🎊', '🎈'])
      })

      it('should handle long lines', () => {
        const longLine = 'a'.repeat(1000)
        expect(lines(`${longLine}\nshort`)).toEqual([longLine, 'short'])
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'line content\n'.repeat(10000)

        const startTime = performance.now()
        const result = lines(largeString)
        const endTime = performance.now()

        expect(result).toHaveLength(10001) // 10000 lines + 1 empty at end
        expect(endTime - startTime).toBeLessThan(100)
      })
    })
  })

  describe('lineCount', () => {
    describe('basic functionality', () => {
      it('should count lines correctly', () => {
        expect(lineCount('hello\nworld')).toBe(2)
        expect(lineCount('line1\nline2\nline3')).toBe(3)
        expect(lineCount('single line')).toBe(1)
        expect(lineCount('')).toBe(1)
      })

      it('should handle different line endings', () => {
        expect(lineCount('hello\r\nworld')).toBe(2)
        expect(lineCount('hello\rworld')).toBe(2)
        expect(lineCount('unix\nwindows\r\nmac\r')).toBe(4)
      })

      it('should count empty lines', () => {
        expect(lineCount('line1\n\nline3')).toBe(3)
        expect(lineCount('\n\n\n')).toBe(4)
        expect(lineCount('line1\nline2\n')).toBe(3)
      })
    })

    describe('edge cases', () => {
      it('should handle edge cases consistently with lines function', () => {
        const testCases = ['', 'single', 'line1\nline2', '\n', 'line1\n\nline3']

        testCases.forEach((testCase) => {
          expect(lineCount(testCase)).toBe(lines(testCase).length)
        })
      })
    })
  })

  describe('characterCount', () => {
    describe('basic functionality', () => {
      it('should count ASCII characters correctly', () => {
        expect(characterCount('hello')).toBe(5)
        expect(characterCount('Hello World')).toBe(11)
        expect(characterCount('12345')).toBe(5)
        expect(characterCount('')).toBe(0)
      })

      it('should count Unicode characters correctly', () => {
        expect(characterCount('café')).toBe(4)
        expect(characterCount('naïve')).toBe(5)
        expect(characterCount('résumé')).toBe(6)
      })

      it('should count emojis correctly', () => {
        expect(characterCount('🎉')).toBe(1)
        expect(characterCount('🎉🎊🎈')).toBe(3)
        expect(characterCount('Hello 👋 World 🌍')).toBe(15)
      })

      it('should count complex Unicode characters', () => {
        expect(characterCount('👨‍👩‍👧‍👦')).toBe(7) // Family emoji (complex sequence)
        expect(characterCount('🇺🇸')).toBe(2) // Flag emoji (2 codepoints)
        expect(characterCount('💁🏻‍♀️')).toBe(5) // Emoji with modifiers
      })
    })

    describe('comparison with string length', () => {
      it('should differ from .length for multi-byte characters', () => {
        const emojiString = '🎉🎊🎈'
        expect(characterCount(emojiString)).toBe(3)
        expect(emojiString.length).toBe(6) // .length counts code units, not characters
      })

      it('should match .length for ASCII strings', () => {
        const asciiString = 'Hello World'
        expect(characterCount(asciiString)).toBe(asciiString.length)
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(characterCount('')).toBe(0)
      })

      it('should handle whitespace', () => {
        expect(characterCount(' ')).toBe(1)
        expect(characterCount('   ')).toBe(3)
        expect(characterCount('\t\n\r')).toBe(3)
      })

      it('should handle mixed content', () => {
        expect(characterCount('Hello 🌍! Test 123')).toBe(17)
        expect(characterCount('Café ☕ & 🥐')).toBe(10)
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'Hello 👋 '.repeat(1000)

        const startTime = performance.now()
        const count = characterCount(largeString)
        const endTime = performance.now()

        expect(count).toBe(8000) // 8 characters * 1000 repetitions
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('sentences', () => {
    describe('basic functionality', () => {
      it('should split sentences on periods', () => {
        expect(sentences('Hello world. How are you.')).toEqual([
          'Hello world',
          'How are you',
        ])
        expect(
          sentences('First sentence. Second sentence. Third sentence.'),
        ).toEqual(['First sentence', 'Second sentence', 'Third sentence'])
      })

      it('should split sentences on question marks', () => {
        expect(sentences('How are you? Fine thanks.')).toEqual([
          'How are you',
          'Fine thanks',
        ])
        expect(sentences('Are you okay? Yes? Good!')).toEqual([
          'Are you okay',
          'Yes',
          'Good',
        ])
      })

      it('should split sentences on exclamation marks', () => {
        expect(sentences('Hello! How are you! Great!')).toEqual([
          'Hello',
          'How are you',
          'Great',
        ])
        expect(sentences('Wow! Amazing! Fantastic!')).toEqual([
          'Wow',
          'Amazing',
          'Fantastic',
        ])
      })

      it('should handle mixed punctuation', () => {
        expect(sentences('Hello world. How are you? Fine! Thanks.')).toEqual([
          'Hello world',
          'How are you',
          'Fine',
          'Thanks',
        ])
        expect(sentences('Question? Answer! Statement.')).toEqual([
          'Question',
          'Answer',
          'Statement',
        ])
      })

      it('should handle multiple consecutive punctuation marks', () => {
        expect(sentences('Wow!!! Amazing... Really???')).toEqual([
          'Wow',
          'Amazing',
          'Really',
        ])
        expect(sentences('End. . . New sentence!')).toEqual([
          'End',
          'New sentence',
        ])
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(sentences('')).toEqual([])
        expect(sentences('   ')).toEqual([])
      })

      it('should handle single sentences', () => {
        expect(sentences('Single sentence')).toEqual(['Single sentence'])
        expect(sentences('No ending punctuation')).toEqual([
          'No ending punctuation',
        ])
      })

      it('should handle strings with only punctuation', () => {
        expect(sentences('!!!')).toEqual([])
        expect(sentences('... ??? !!!')).toEqual([])
      })

      it('should trim whitespace from sentences', () => {
        expect(sentences('  Hello world.   How are you?  ')).toEqual([
          'Hello world',
          'How are you',
        ])
        expect(sentences('Sentence 1 .  Sentence 2 ! ')).toEqual([
          'Sentence 1',
          'Sentence 2',
        ])
      })

      it('should handle abbreviations (simple implementation limitation)', () => {
        // Note: This is a limitation of the simple implementation
        expect(sentences('Mr. Smith went home. Mrs. Jones stayed.')).toEqual([
          'Mr',
          'Smith went home',
          'Mrs',
          'Jones stayed',
        ])
      })
    })

    describe('unicode and special characters', () => {
      it('should handle unicode content', () => {
        expect(sentences('Hola! ¿Cómo estás? Bien, gracias.')).toEqual([
          'Hola',
          '¿Cómo estás',
          'Bien, gracias',
        ])
        expect(sentences('测试句子。另一个句子！')).toEqual([
          '测试句子',
          '另一个句子',
        ])
      })

      it('should handle emojis', () => {
        expect(sentences('Hello 👋! How are you 😊? Great 🎉!')).toEqual([
          'Hello 👋',
          'How are you 😊',
          'Great 🎉',
        ])
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeSentence =
          'This is sentence number X. '.replace('X', '').repeat(1000) +
          'Final sentence.'

        const startTime = performance.now()
        const result = sentences(largeSentence)
        const endTime = performance.now()

        expect(result).toHaveLength(1001)
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('sentenceCount', () => {
    describe('basic functionality', () => {
      it('should count sentences correctly', () => {
        expect(sentenceCount('Hello world. How are you?')).toBe(2)
        expect(sentenceCount('One! Two? Three.')).toBe(3)
        expect(sentenceCount('Single sentence')).toBe(1)
        expect(sentenceCount('')).toBe(0)
      })

      it('should handle various punctuation', () => {
        expect(sentenceCount('First. Second! Third?')).toBe(3)
        expect(sentenceCount('Wow!!! Amazing... Really???')).toBe(3)
      })
    })

    describe('consistency with sentences function', () => {
      it('should match sentences function length', () => {
        const testCases = [
          '',
          'Single sentence',
          'First. Second!',
          'One? Two! Three.',
          'Hello world. How are you? Fine! Thanks.',
        ]

        testCases.forEach((testCase) => {
          expect(sentenceCount(testCase)).toBe(sentences(testCase).length)
        })
      })
    })
  })

  describe('integration tests', () => {
    it('should work together for text analysis', () => {
      const text = `
        Hello world! This is a test document.
        It contains multiple lines and sentences.
        
        How many words does it have? Let's count them!
        We can also count characters: 123 & émojis 🎉.
      `.trim()

      expect(wordCount(text)).toBeGreaterThan(20)
      expect(lineCount(text)).toBe(5)
      expect(characterCount(text)).toBeGreaterThan(text.length - 10) // Account for emojis
      expect(sentenceCount(text)).toBe(6)
      expect(isBlank(text)).toBe(false)
    })

    it('should handle complex real-world text', () => {
      const text =
        'Dr. Johnson said, "Hello! How are you?" She replied, "Fine, thanks."'

      // Note: Simple implementation limitations with abbreviations
      expect(wordCount(text)).toBe(11)
      expect(sentenceCount(text)).toBeGreaterThan(2) // May split on "Dr."
      expect(characterCount(text)).toBe(68)
      expect(isBlank(text)).toBe(false)
    })

    it('should maintain string immutability', () => {
      const original = 'Hello world!\nHow are you?'
      const originalCopy = original

      wordCount(original)
      isBlank(original)
      lines(original)
      characterCount(original)
      sentences(original)

      expect(original).toBe(originalCopy)
    })
  })
})
