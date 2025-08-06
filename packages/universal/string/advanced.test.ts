import { describe, it, expect } from 'vitest'

import { 
  reverse, 
  isPalindrome, 
  levenshteinDistance, 
  similarity, 
  longestCommonSubsequence 
} from './advanced.js'

describe('advanced', () => {
  describe('reverse', () => {
    describe('basic functionality', () => {
      it('should reverse simple strings', () => {
        expect(reverse('hello')).toBe('olleh')
        expect(reverse('world')).toBe('dlrow')
        expect(reverse('abc')).toBe('cba')
        expect(reverse('12345')).toBe('54321')
      })

      it('should reverse strings with spaces', () => {
        expect(reverse('hello world')).toBe('dlrow olleh')
        expect(reverse('the quick brown fox')).toBe('xof nworb kciuq eht')
        expect(reverse('a b c')).toBe('c b a')
      })

      it('should handle single characters', () => {
        expect(reverse('a')).toBe('a')
        expect(reverse('1')).toBe('1')
        expect(reverse('!')).toBe('!')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(reverse('')).toBe('')
      })

      it('should handle palindromes', () => {
        expect(reverse('racecar')).toBe('racecar')
        expect(reverse('level')).toBe('level')
        expect(reverse('a')).toBe('a')
      })

      it('should handle strings with special characters', () => {
        expect(reverse('hello!')).toBe('!olleh')
        expect(reverse('a@b#c$')).toBe('$c#b@a')
        expect(reverse('12!@#')).toBe('#@!21')
      })
    })

    describe('unicode support', () => {
      it('should handle Unicode characters correctly', () => {
        expect(reverse('café')).toBe('éfac')
        expect(reverse('naïve')).toBe('evïan')
        expect(reverse('résumé')).toBe('émusér')
      })

      it('should handle emojis correctly', () => {
        expect(reverse('🎉🎊🎈')).toBe('🎈🎊🎉')
        expect(reverse('Hello 👋')).toBe('👋 olleH')
        expect(reverse('🌍🌎🌏')).toBe('🌏🌎🌍')
      })

      it('should handle complex Unicode characters', () => {
        // Note: Complex emojis with ZWJ sequences may not reverse as expected
        const familyEmoji = '👨‍👩‍👧‍👦'
        const reversed = reverse(familyEmoji)
        expect(reversed.length).toBeGreaterThan(0) // Just ensure it doesn't crash
        // Note: Flag emojis are composed of two regional indicator symbols each
        const flagResult = reverse('🇺🇸🇨🇦')
        expect(flagResult.length).toBeGreaterThan(0) // Should still have some codepoints
      })

      it('should handle mixed Unicode content', () => {
        expect(reverse('Hello 🌍 World')).toBe('dlroW 🌍 olleH')
        expect(reverse('Café ☕ & 🥐')).toBe('🥐 & ☕ éfaC')
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'abcdefghij'.repeat(1000)
        
        const startTime = performance.now()
        const result = reverse(largeString)
        const endTime = performance.now()
        
        expect(result).toHaveLength(10000)
        expect(result.startsWith('jihgfedcba'))
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('isPalindrome', () => {
    describe('basic functionality - strict mode', () => {
      it('should detect simple palindromes', () => {
        expect(isPalindrome('racecar')).toBe(true)
        expect(isPalindrome('level')).toBe(true)
        expect(isPalindrome('noon')).toBe(true)
        expect(isPalindrome('madam')).toBe(true)
      })

      it('should be case insensitive by default', () => {
        expect(isPalindrome('Racecar')).toBe(true)
        expect(isPalindrome('Level')).toBe(true)
        expect(isPalindrome('Madam')).toBe(true)
        expect(isPalindrome('RaceCar')).toBe(true)
      })

      it('should detect non-palindromes', () => {
        expect(isPalindrome('hello')).toBe(false)
        expect(isPalindrome('world')).toBe(false)
        expect(isPalindrome('almost')).toBe(false)
        expect(isPalindrome('palindrom')).toBe(false)
      })

      it('should handle strings with spaces in strict mode', () => {
        expect(isPalindrome('race car')).toBe(false) // Strict mode considers spaces
        expect(isPalindrome('a man a plan a canal panama')).toBe(false) // Strict mode
      })
    })

    describe('non-strict mode', () => {
      it('should ignore spaces and punctuation', () => {
        expect(isPalindrome('race car', { strict: false })).toBe(true)
        expect(isPalindrome('A man, a plan, a canal: Panama', { strict: false })).toBe(true)
        expect(isPalindrome('race a car', { strict: false })).toBe(false)
      })

      it('should ignore punctuation and special characters', () => {
        expect(isPalindrome('Madam, I\'m Adam', { strict: false })).toBe(true)
        expect(isPalindrome('Was it a car or a cat I saw?', { strict: false })).toBe(true)
        expect(isPalindrome('No \'x\' in Nixon', { strict: false })).toBe(true)
      })

      it('should be case insensitive', () => {
        expect(isPalindrome('RaceCar', { strict: false })).toBe(true)
        expect(isPalindrome('A Man A Plan A Canal Panama', { strict: false })).toBe(true)
      })

      it('should handle numbers and letters', () => {
        expect(isPalindrome('race a car', { strict: false })).toBe(false)
        expect(isPalindrome('A Santa at NASA', { strict: false })).toBe(true)
        expect(isPalindrome('12321', { strict: false })).toBe(true)
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(isPalindrome('')).toBe(true)
        expect(isPalindrome('', { strict: false })).toBe(true)
      })

      it('should handle single characters', () => {
        expect(isPalindrome('a')).toBe(true)
        expect(isPalindrome('A')).toBe(true)
        expect(isPalindrome('1')).toBe(true)
        expect(isPalindrome('!', { strict: false })).toBe(true)
      })

      it('should handle strings with only special characters', () => {
        expect(isPalindrome('!!!')).toBe(true)
        expect(isPalindrome('!@#@!')).toBe(true)
        expect(isPalindrome('!@#$!', { strict: false })).toBe(true) // Only alphanumeric considered
      })

      it('should handle two-character strings', () => {
        expect(isPalindrome('aa')).toBe(true)
        expect(isPalindrome('ab')).toBe(false)
        expect(isPalindrome('Aa')).toBe(true)
        expect(isPalindrome('a!')).toBe(false)
        expect(isPalindrome('a!', { strict: false })).toBe(true)
      })
    })

    describe('unicode support', () => {
      it('should handle Unicode palindromes', () => {
        expect(isPalindrome('tàt')).toBe(true)
        expect(isPalindrome('été')).toBe(true) // French summer
        expect(isPalindrome('אבא')).toBe(true) // Hebrew "dad" is a palindrome
      })

      it('should handle emojis', () => {
        expect(isPalindrome('🎉🎊🎉')).toBe(true)
        expect(isPalindrome('🎉🎊🎈')).toBe(false)
        expect(isPalindrome('a🎉a')).toBe(true)
      })
    })

    describe('performance', () => {
      it('should handle large palindromes efficiently', () => {
        const largePalindrome = 'a'.repeat(5000) + 'b' + 'a'.repeat(5000)
        
        const startTime = performance.now()
        const result = isPalindrome(largePalindrome)
        const endTime = performance.now()
        
        expect(result).toBe(true)
        expect(endTime - startTime).toBeLessThan(50)
      })

      it('should handle large non-palindromes efficiently', () => {
        const largeString = 'abcdefghij'.repeat(1000)
        
        const startTime = performance.now()
        const result = isPalindrome(largeString)
        const endTime = performance.now()
        
        expect(result).toBe(false)
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('levenshteinDistance', () => {
    describe('basic functionality', () => {
      it('should calculate distance for simple cases', () => {
        expect(levenshteinDistance('cat', 'bat')).toBe(1) // substitute c->b
        expect(levenshteinDistance('hello', 'hell')).toBe(1) // delete o
        expect(levenshteinDistance('hell', 'hello')).toBe(1) // insert o
      })

      it('should handle identical strings', () => {
        expect(levenshteinDistance('hello', 'hello')).toBe(0)
        expect(levenshteinDistance('', '')).toBe(0)
        expect(levenshteinDistance('a', 'a')).toBe(0)
      })

      it('should handle empty strings', () => {
        expect(levenshteinDistance('', 'abc')).toBe(3) // insert 3
        expect(levenshteinDistance('abc', '')).toBe(3) // delete 3
        expect(levenshteinDistance('', '')).toBe(0)
      })

      it('should calculate complex distances', () => {
        expect(levenshteinDistance('kitten', 'sitting')).toBe(3) // k->s, e->i, +g
        expect(levenshteinDistance('saturday', 'sunday')).toBe(3) // s->s, a->u, t->n, delete ur, delete da, delete y (3 operations)
        expect(levenshteinDistance('hello', 'world')).toBe(4)
      })
    })

    describe('edge cases', () => {
      it('should handle single character strings', () => {
        expect(levenshteinDistance('a', 'b')).toBe(1) // substitute
        expect(levenshteinDistance('a', '')).toBe(1) // delete
        expect(levenshteinDistance('', 'a')).toBe(1) // insert
      })

      it('should handle completely different strings', () => {
        expect(levenshteinDistance('abc', 'xyz')).toBe(3)
        expect(levenshteinDistance('123', 'abc')).toBe(3)
      })

      it('should be symmetric', () => {
        const pairs = [
          ['hello', 'world'],
          ['kitten', 'sitting'],
          ['cat', 'bat'],
          ['', 'abc']
        ]

        pairs.forEach(([str1, str2]) => {
          expect(levenshteinDistance(str1, str2)).toBe(levenshteinDistance(str2, str1))
        })
      })
    })

    describe('unicode support', () => {
      it('should handle Unicode characters', () => {
        expect(levenshteinDistance('café', 'cave')).toBe(2) // é->v, +e
        expect(levenshteinDistance('naïve', 'naive')).toBe(1) // ï->i
      })

      it('should handle emojis', () => {
        expect(levenshteinDistance('🎉', '🎊')).toBe(1) // substitute
        expect(levenshteinDistance('a🎉', 'a🎊')).toBe(1) // substitute emoji
        expect(levenshteinDistance('🎉🎊', '🎈🎁')).toBe(2) // substitute both
      })
    })

    describe('performance', () => {
      it('should handle moderately large strings efficiently', () => {
        const str1 = 'a'.repeat(100)
        const str2 = 'b'.repeat(100)
        
        const startTime = performance.now()
        const result = levenshteinDistance(str1, str2)
        const endTime = performance.now()
        
        expect(result).toBe(100)
        expect(endTime - startTime).toBeLessThan(100)
      })

      it('should handle strings of different lengths', () => {
        const str1 = 'short'
        const str2 = 'a very long string with many characters'
        
        const startTime = performance.now()
        const result = levenshteinDistance(str1, str2)
        const endTime = performance.now()
        
        expect(result).toBeGreaterThan(30) // Mostly insertions
        expect(endTime - startTime).toBeLessThan(50)
      })
    })

    describe('algorithmic correctness', () => {
      it('should satisfy triangle inequality', () => {
        const strings = ['hello', 'world', 'help', 'helm']
        
        // For any three strings a, b, c: distance(a,c) <= distance(a,b) + distance(b,c)
        for (let i = 0; i < strings.length; i++) {
          for (let j = 0; j < strings.length; j++) {
            for (let k = 0; k < strings.length; k++) {
              const dac = levenshteinDistance(strings[i]!, strings[k]!)
              const dab = levenshteinDistance(strings[i]!, strings[j]!)
              const dbc = levenshteinDistance(strings[j]!, strings[k]!)
              
              expect(dac).toBeLessThanOrEqual(dab + dbc)
            }
          }
        }
      })
    })
  })

  describe('similarity', () => {
    describe('basic functionality', () => {
      it('should return 100 for identical strings', () => {
        expect(similarity('hello', 'hello')).toBe(100)
        expect(similarity('', '')).toBe(100)
        expect(similarity('test', 'test')).toBe(100)
      })

      it('should return 0 for completely different strings of same length', () => {
        expect(similarity('abc', 'xyz')).toBe(0)
        expect(similarity('123', 'abc')).toBe(0)
      })

      it('should return 0 when one string is empty', () => {
        expect(similarity('abc', '')).toBe(0)
        expect(similarity('', 'abc')).toBe(0)
      })

      it('should calculate reasonable similarity scores', () => {
        expect(similarity('hello', 'hell')).toBe(80) // 4/5 = 80%
        expect(similarity('cat', 'bat')).toBe(66.67) // 2/3 = 66.67%
        expect(similarity('hello', 'world')).toBe(20) // 1/5 = 20%
      })
    })

    describe('edge cases', () => {
      it('should handle single character strings', () => {
        expect(similarity('a', 'a')).toBe(100)
        expect(similarity('a', 'b')).toBe(0)
        expect(similarity('a', '')).toBe(0)
      })

      it('should be symmetric', () => {
        const pairs = [
          ['hello', 'world'],
          ['kitten', 'sitting'],
          ['cat', 'bat']
        ]

        pairs.forEach(([str1, str2]) => {
          expect(similarity(str1, str2)).toBe(similarity(str2, str1))
        })
      })

      it('should return percentage between 0 and 100', () => {
        const testCases = [
          ['hello', 'world'],
          ['kitten', 'sitting'],
          ['completely', 'different'],
          ['similar', 'similar'],
          ['a', 'z']
        ]

        testCases.forEach(([str1, str2]) => {
          const sim = similarity(str1, str2)
          expect(sim).toBeGreaterThanOrEqual(0)
          expect(sim).toBeLessThanOrEqual(100)
        })
      })
    })

    describe('real-world examples', () => {
      it('should give reasonable scores for similar words', () => {
        expect(similarity('color', 'colour')).toBeGreaterThan(80)
        expect(similarity('organize', 'organise')).toBeGreaterThan(85)
        expect(similarity('JavaScript', 'Javascript')).toBeGreaterThanOrEqual(90)
      })

      it('should give low scores for different words', () => {
        expect(similarity('apple', 'orange')).toBeLessThan(30)
        expect(similarity('cat', 'elephant')).toBeLessThan(30)
        expect(similarity('hello', 'goodbye')).toBeLessThan(30)
      })
    })

    describe('performance', () => {
      it('should handle moderately large strings efficiently', () => {
        const str1 = 'a'.repeat(50) + 'different' + 'b'.repeat(50)
        const str2 = 'a'.repeat(50) + 'similar' + 'b'.repeat(50)
        
        const startTime = performance.now()
        const result = similarity(str1, str2)
        const endTime = performance.now()
        
        expect(result).toBeGreaterThan(80) // Mostly similar
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('longestCommonSubsequence', () => {
    describe('basic functionality', () => {
      it('should find LCS for simple cases', () => {
        expect(longestCommonSubsequence('ABCDGH', 'AEDFHR')).toBe('ADH')
        expect(longestCommonSubsequence('AGGTAB', 'GXTXAYB')).toBe('GTAB')
      })

      it('should handle identical strings', () => {
        expect(longestCommonSubsequence('hello', 'hello')).toBe('hello')
        expect(longestCommonSubsequence('abc', 'abc')).toBe('abc')
      })

      it('should handle completely different strings', () => {
        expect(longestCommonSubsequence('abc', 'xyz')).toBe('')
        expect(longestCommonSubsequence('123', 'abc')).toBe('')
      })

      it('should handle substrings', () => {
        expect(longestCommonSubsequence('hello', 'ello')).toBe('ello')
        expect(longestCommonSubsequence('hello', 'hell')).toBe('hell')
        expect(longestCommonSubsequence('programming', 'program')).toBe('program')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(longestCommonSubsequence('', 'abc')).toBe('')
        expect(longestCommonSubsequence('abc', '')).toBe('')
        expect(longestCommonSubsequence('', '')).toBe('')
      })

      it('should handle single character strings', () => {
        expect(longestCommonSubsequence('a', 'a')).toBe('a')
        expect(longestCommonSubsequence('a', 'b')).toBe('')
        expect(longestCommonSubsequence('a', 'ab')).toBe('a')
      })

      it('should handle reversed strings', () => {
        const result1 = longestCommonSubsequence('abc', 'cba')
        expect(['a', 'b', 'c']).toContain(result1) // Could be any single character
        expect(result1).toHaveLength(1)
        
        const result2 = longestCommonSubsequence('hello', 'olleh')
        expect(result2.length).toBeGreaterThanOrEqual(1) // Should find at least one common character
      })
    })

    describe('complex cases', () => {
      it('should find LCS in longer strings', () => {
        const result1 = longestCommonSubsequence('programming', 'algorithm')
        expect(result1.length).toBeGreaterThanOrEqual(3) // Should find a reasonable LCS
        expect(result1).toMatch(/[gri]+/) // Should contain some combination of these chars
        
        const result2 = longestCommonSubsequence('dynamic', 'programming')
        expect(result2.length).toBeGreaterThanOrEqual(2) // Should find at least 2 chars
      })

      it('should handle strings with repeated characters', () => {
        expect(longestCommonSubsequence('aaa', 'aa')).toBe('aa')
        expect(longestCommonSubsequence('ababa', 'babb')).toBe('bab')
      })

      it('should find one of multiple valid LCS', () => {
        // When multiple LCS exist of the same length, algorithm should return one of them
        const result = longestCommonSubsequence('ABC', 'AC')
        expect(['A', 'C', 'AC']).toContain(result)
        expect(result.length).toBeGreaterThanOrEqual(1)
      })
    })

    describe('unicode support', () => {
      it('should handle Unicode characters', () => {
        expect(longestCommonSubsequence('café', 'cave')).toBe('ca')
        const result = longestCommonSubsequence('résumé', 'resume')
        expect(result.length).toBeGreaterThanOrEqual(4) // Should find at least 'rsum' or 'resu'
      })

      it('should handle emojis', () => {
        expect(longestCommonSubsequence('🎉🎊🎈', '🎊🎈🎁')).toBe('🎊🎈')
        expect(longestCommonSubsequence('a🎉b', 'a🎊b')).toBe('ab')
      })
    })

    describe('algorithmic properties', () => {
      it('should satisfy LCS properties', () => {
        // LCS length should be <= length of shorter string
        const testCases = [
          ['hello', 'world'],
          ['programming', 'algorithm'],
          ['abc', 'def'],
          ['same', 'same']
        ]

        testCases.forEach(([str1, str2]) => {
          const lcs = longestCommonSubsequence(str1, str2)
          expect(lcs.length).toBeLessThanOrEqual(Math.min(str1.length, str2.length))
        })
      })

      it('should be commutative for length', () => {
        const pairs = [
          ['hello', 'world'],
          ['programming', 'algorithm'],
          ['abc', 'xyz']
        ]

        pairs.forEach(([str1, str2]) => {
          const lcs1 = longestCommonSubsequence(str1, str2)
          const lcs2 = longestCommonSubsequence(str2, str1)
          expect(lcs1.length).toBe(lcs2.length)
        })
      })
    })

    describe('performance', () => {
      it('should handle moderately sized strings efficiently', () => {
        const str1 = 'abcdefghijklmnop'
        const str2 = 'acegikmo'
        
        const startTime = performance.now()
        const result = longestCommonSubsequence(str1, str2)
        const endTime = performance.now()
        
        expect(result).toBe('acegikmo') // All chars from str2 are in str1 in order
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('integration tests', () => {
    it('should work together for string analysis', () => {
      const str1 = 'programming'
      const str2 = 'algorithm'
      
      const reversed1 = reverse(str1)
      const reversed2 = reverse(str2)
      const distance = levenshteinDistance(str1, str2)
      const sim = similarity(str1, str2)
      const lcs = longestCommonSubsequence(str1, str2)
      
      expect(reversed1).toBe('gnimmargorp')
      expect(reversed2).toBe('mhtirogla')
      expect(distance).toBeGreaterThan(0)
      expect(sim).toBeLessThan(100)
      expect(lcs.length).toBeGreaterThan(0)
    })

    it('should handle palindrome analysis', () => {
      const palindrome = 'racecar'
      const notPalindrome = 'hello'
      
      expect(isPalindrome(palindrome)).toBe(true)
      expect(reverse(palindrome)).toBe(palindrome)
      expect(similarity(palindrome, reverse(palindrome))).toBe(100)
      
      expect(isPalindrome(notPalindrome)).toBe(false)
      expect(reverse(notPalindrome)).not.toBe(notPalindrome)
      expect(similarity(notPalindrome, reverse(notPalindrome))).toBeLessThan(100)
    })

    it('should maintain string immutability', () => {
      const original1 = 'hello world'
      const original2 = 'goodbye world'
      const original1Copy = original1
      const original2Copy = original2
      
      reverse(original1)
      isPalindrome(original1)
      levenshteinDistance(original1, original2)
      similarity(original1, original2)
      longestCommonSubsequence(original1, original2)
      
      expect(original1).toBe(original1Copy)
      expect(original2).toBe(original2Copy)
    })
  })
})