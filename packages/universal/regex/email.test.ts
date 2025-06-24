import { describe, it, expect } from 'vitest'
import { emailRegex } from './regex/email'

describe('emailRegex', () => {
  describe('valid email addresses', () => {
    it('should match simple valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user@domain.org',
        'admin@site.net',
        'contact@company.co.uk',
        'info@website.io'
      ]
      
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with numbers', () => {
      const emailsWithNumbers = [
        'user123@example.com',
        'test2@domain.org',
        '123test@site.net',
        'user@example123.com',
        'test@site2.org'
      ]
      
      emailsWithNumbers.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with special characters in local part', () => {
      const emailsWithSpecialChars = [
        'user.name@example.com',
        'first_last@domain.org',
        'user+tag@site.net',
        'test-email@example.com',
        'user%discount@company.co.uk'
      ]
      
      emailsWithSpecialChars.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with uppercase letters (case insensitive)', () => {
      const uppercaseEmails = [
        'USER@EXAMPLE.COM',
        'Test@Domain.Org',
        'ADMIN@SITE.NET',
        'Contact@Company.CO.UK',
        'INFO@WEBSITE.IO'
      ]
      
      uppercaseEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with mixed case', () => {
      const mixedCaseEmails = [
        'User@Example.com',
        'Test.Name@Domain.ORG',
        'Admin123@Site.net',
        'Contact_Info@Company.Co.Uk',
        'Info+Support@Website.IO'
      ]
      
      mixedCaseEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with subdomains', () => {
      const subdomainEmails = [
        'user@mail.example.com',
        'test@support.company.org',
        'admin@api.service.net',
        'contact@www.site.co.uk',
        'info@docs.website.io'
      ]
      
      subdomainEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with various TLD lengths', () => {
      const variousTLDs = [
        'user@example.co',     // 2 letters
        'test@domain.com',     // 3 letters  
        'admin@site.info',     // 4 letters
        'contact@company.travel',  // 6 letters
        'info@website.international'  // 13 letters
      ]
      
      variousTLDs.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails with hyphens in domain', () => {
      const hyphenatedDomains = [
        'user@example-site.com',
        'test@my-domain.org',
        'admin@web-service.net',
        'contact@e-commerce.co.uk',
        'info@tech-company.io'
      ]
      
      hyphenatedDomains.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })
  })

  describe('invalid email addresses', () => {
    it('should not match emails without @ symbol', () => {
      const noAtSymbol = [
        'userexample.com',
        'testdomain.org',
        'adminsite.net',
        'contactcompany.co.uk',
        'infowebsite.io'
      ]
      
      noAtSymbol.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should not match emails without domain', () => {
      const noDomain = [
        'user@',
        'test@.',
        'admin@.com',
        'contact@',
        '@example.com'
      ]
      
      noDomain.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should not match emails without TLD', () => {
      const noTLD = [
        'user@example',
        'test@domain',
        'admin@site',
        'contact@company',
        'info@website'
      ]
      
      noTLD.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should not match emails with invalid TLD (single character)', () => {
      const singleCharTLD = [
        'user@example.c',
        'test@domain.o',
        'admin@site.n',
        'contact@company.u',
        'info@website.i'
      ]
      
      singleCharTLD.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should not match emails with spaces', () => {
      const emailsWithSpaces = [
        'user @example.com',
        'test@ domain.org',
        'admin@site .net',
        'contact@company. co.uk',
        ' user@example.com',
        'user@example.com ',
        'user @example .com'
      ]
      
      emailsWithSpaces.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should not match emails with multiple @ symbols', () => {
      const multipleAtSymbols = [
        'user@@example.com',
        'test@domain@org',
        'admin@site@net',
        'contact@company@co.uk',
        'user@test@example.com'
      ]
      
      multipleAtSymbols.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should match emails starting with allowed special characters', () => {
      // The regex allows . % + - _ at the start
      const startingWithSpecial = [
        '.user@example.com',
        '_test@domain.org',
        '+admin@site.net',
        '%contact@company.co.uk',
        '-info@website.io'
      ]
      
      startingWithSpecial.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should match emails ending with allowed special characters (before @)', () => {
      // The regex allows . _ + % - at the end of local part
      const endingWithSpecial = [
        'user.@example.com',
        'test_@domain.org',
        'admin+@site.net',
        'contact%@company.co.uk',
        'info-@website.io'
      ]
      
      endingWithSpecial.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should not match empty strings and non-strings', () => {
      const invalidInputs = [
        '',
        ' ',
        '\n',
        '\t'
      ]
      
      invalidInputs.forEach(input => {
        expect(emailRegex.test(input)).toBe(false)
      })
    })

    it('should match domains with hyphens (regex is permissive)', () => {
      // The regex [A-Z0-9.-]+ allows hyphens anywhere in domain
      const withHyphens = [
        'user@-example.com',
        'test@example-.com',
        'admin@-site-.net',
        'contact@.example.com',
        'info@example..com'
      ]
      
      withHyphens.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })
  })

  describe('edge cases', () => {
    it('should allow consecutive dots in domain (regex is permissive)', () => {
      // The regex [A-Z0-9.-]+ allows multiple consecutive dots
      const consecutiveDots = [
        'user@example..com',
        'test@domain...org',
        'admin@site..net'
      ]
      
      consecutiveDots.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should handle very long email addresses', () => {
      const longLocal = 'a'.repeat(64) + '@example.com'
      const longDomain = 'user@' + 'a'.repeat(50) + '.com'
      
      expect(emailRegex.test(longLocal)).toBe(true)
      expect(emailRegex.test(longDomain)).toBe(true)
    })

    it('should handle minimum valid email length', () => {
      const shortEmail = 'a@b.co'  // Minimum realistic email
      expect(emailRegex.test(shortEmail)).toBe(true)
    })

    it('should handle emails with numbers in TLD', () => {
      // Some new TLDs might have numbers, but traditionally they don't
      const numbersInTLD = [
        'user@example.c0m',
        'test@domain.0rg',
        'admin@site.n3t'
      ]
      
      numbersInTLD.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should handle emails with special characters in domain', () => {
      const specialInDomain = [
        'user@exam_ple.com',
        'test@dom+ain.org',
        'admin@si%te.net',
        'contact@comp&any.co.uk'
      ]
      
      specialInDomain.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe('international and special cases', () => {
    it('should handle common international domains', () => {
      const internationalDomains = [
        'user@example.co.uk',
        'test@domain.com.au',
        'admin@site.gov.us',
        'contact@company.edu.sg',
        'info@website.org.in'
      ]
      
      internationalDomains.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should not match emails with unicode characters', () => {
      // This regex is ASCII-only, so unicode should fail
      const unicodeEmails = [
        'üser@example.com',
        'test@dömain.org',
        'admin@site.cöm',
        'user@例え.com'
      ]
      
      unicodeEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe('regex properties and behavior', () => {
    it('should be case insensitive', () => {
      expect(emailRegex.flags).toContain('i')
    })

    it('should be global flag independent', () => {
      // Test that the regex doesn't have unexpected global behavior
      const email = 'test@example.com'
      expect(emailRegex.test(email)).toBe(true)
      expect(emailRegex.test(email)).toBe(true) // Should still work on second call
    })

    it('should NOT match partial strings because regex is anchored', () => {
      // The regex has ^ and $ anchors, so it only matches complete strings
      const partialMatches = [
        'prefix test@example.com suffix',
        'email: user@domain.org here',
        'contact us at admin@site.net today'
      ]
      
      partialMatches.forEach(text => {
        expect(emailRegex.test(text)).toBe(false) // Won't match because of anchors
      })
    })

    it('should NOT extract email from text because regex is anchored', () => {
      const textWithEmail = 'Please contact us at support@company.com for help'
      const match = textWithEmail.match(emailRegex)
      
      expect(match).toBeNull() // Won't match because regex is anchored
    })

    it('should NOT work with String.replace() for partial text', () => {
      const text = 'Email me at john@example.com'
      const censored = text.replace(emailRegex, '[EMAIL]')
      
      expect(censored).toBe('Email me at john@example.com') // No replacement
    })

    it('should return -1 for String.search() on partial text', () => {
      const text = 'Contact: admin@site.org'
      const position = text.search(emailRegex)
      
      expect(position).toBe(-1) // Not found because regex is anchored
    })

    it('should work with String methods on pure email strings', () => {
      const email = 'john@example.com'
      
      expect(email.match(emailRegex)).not.toBeNull()
      expect(email.replace(emailRegex, '[EMAIL]')).toBe('[EMAIL]')
      expect(email.search(emailRegex)).toBe(0)
    })
  })

  describe('performance and boundary testing', () => {
    it('should handle many email validations efficiently', () => {
      const emails = Array.from({ length: 1000 }, (_, i) => `user${i}@example${i}.com`)
      
      emails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should handle malformed emails without errors', () => {
      const malformedEmails = [
        '@',
        '@@',
        '@.@',
        '.@.',
        '..@..',
        '...@...',
        '@@@.@@@',
        'a'.repeat(1000) + '@' + 'b'.repeat(1000) + '.com'
      ]
      
      malformedEmails.forEach(email => {
        expect(() => emailRegex.test(email)).not.toThrow()
      })
    })
  })

  describe('real-world scenarios', () => {
    it('should validate common email providers', () => {
      const commonProviders = [
        'user@gmail.com',
        'test@yahoo.com',
        'admin@outlook.com',
        'contact@hotmail.com',
        'info@aol.com',
        'support@icloud.com',
        'hello@protonmail.com'
      ]
      
      commonProviders.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should validate business email formats', () => {
      const businessEmails = [
        'john.doe@company.com',
        'jane_smith@corporation.org',
        'support+tickets@service.net',
        'no-reply@notifications.co.uk',
        'admin123@tech-startup.io'
      ]
      
      businessEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should reject common invalid formats users might enter', () => {
      const commonMistakes = [
        'user@',
        '@domain.com',
        'user@.com',
        'user.domain.com',
        'user at domain.com',
        'user@domain',
        'user@domain.',
        'user@@domain.com'
        // Note: .user@domain.com and user.@domain.com actually pass this regex
        // because the regex allows . at any position in the local part
      ]
      
      commonMistakes.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })
})