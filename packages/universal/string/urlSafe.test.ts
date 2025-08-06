import { describe, it, expect } from 'vitest'

import { slugify, escapeHtml, unescapeHtml } from './urlSafe.js'

describe('urlSafe', () => {
  describe('slugify', () => {
    describe('basic functionality', () => {
      it('should convert strings to lowercase slugs', () => {
        expect(slugify('Hello World')).toBe('hello-world')
        expect(slugify('My Great Article')).toBe('my-great-article')
        expect(slugify('UPPERCASE TEXT')).toBe('uppercase-text')
      })

      it('should replace spaces with hyphens', () => {
        expect(slugify('hello world')).toBe('hello-world')
        expect(slugify('multiple word phrase')).toBe('multiple-word-phrase')
        expect(slugify('single')).toBe('single')
      })

      it('should remove special characters', () => {
        expect(slugify('Hello World!')).toBe('hello-world')
        expect(slugify('Testing 123 & More!')).toBe('testing-123-more')
        expect(slugify('Price: $5 < $10')).toBe('price-5-10')
        expect(slugify('What?! No way!!!')).toBe('what-no-way')
      })

      it('should handle numbers and alphanumeric content', () => {
        expect(slugify('Version 2.0')).toBe('version-2-0')
        expect(slugify('HTML5 CSS3 JS')).toBe('html5-css3-js')
        expect(slugify('User123 Profile456')).toBe('user123-profile456')
      })

      it('should preserve existing hyphens in reasonable positions', () => {
        expect(slugify('well-formatted-slug')).toBe('well-formatted-slug')
        expect(slugify('pre-existing-hyphens')).toBe('pre-existing-hyphens')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(slugify('')).toBe('')
      })

      it('should handle strings with only special characters', () => {
        expect(slugify('!!!')).toBe('')
        expect(slugify('@#$%^&*()')).toBe('')
        expect(slugify('---')).toBe('')
      })

      it('should handle multiple consecutive spaces and separators', () => {
        expect(slugify('multiple   spaces')).toBe('multiple-spaces')
        expect(slugify('hello     world')).toBe('hello-world')
        expect(slugify('tabs\t\tand\tspaces')).toBe('tabs-and-spaces')
      })

      it('should remove leading and trailing hyphens', () => {
        expect(slugify('---hello world---')).toBe('hello-world')
        expect(slugify('-start')).toBe('start')
        expect(slugify('end-')).toBe('end')
      })

      it('should collapse multiple consecutive hyphens', () => {
        expect(slugify('hello---world')).toBe('hello-world')
        expect(slugify('multiple----hyphens')).toBe('multiple-hyphens')
        expect(slugify('a--b--c')).toBe('a-b-c')
      })

      it('should handle whitespace-only strings', () => {
        expect(slugify('   ')).toBe('')
        expect(slugify('\t\n\r')).toBe('')
      })

      it('should handle leading/trailing whitespace', () => {
        expect(slugify('  hello world  ')).toBe('hello-world')
        expect(slugify('\n\thello world\r\n')).toBe('hello-world')
      })
    })

    describe('unicode and internationalization', () => {
      it('should handle accented characters', () => {
        expect(slugify('café résumé')).toBe('cafe-resume')
        expect(slugify('naïve coöperate')).toBe('naive-cooperate')
        expect(slugify('piñata jalapeño')).toBe('pinata-jalapeno')
      })

      it('should handle various European characters', () => {
        expect(slugify('Zürich München')).toBe('zurich-munchen')
        expect(slugify('español français')).toBe('espanol-francais')
        expect(slugify('Москва Санкт-Петербург')).toBe('moskva-sankt-peterburg')
      })

      it('should handle combined characters', () => {
        expect(slugify('Åpple Ørånge')).toBe('apple-orange')
        expect(slugify('Ångström Œuvre')).toBe('angstrom-oeuvre')
      })

      it('should handle non-Latin scripts gracefully', () => {
        // These should be removed as they're not alphanumeric in ASCII
        expect(slugify('测试 字符串')).toBe('')
        expect(slugify('تجربة نص')).toBe('')
        expect(slugify('テスト 文字列')).toBe('')
      })

      it('should handle emojis', () => {
        expect(slugify('Hello 👋 World 🌍')).toBe('hello-world')
        expect(slugify('Party 🎉🎊 Time')).toBe('party-time')
      })
    })

    describe('real-world examples', () => {
      it('should handle blog post titles', () => {
        expect(slugify('10 Tips for Better JavaScript Code')).toBe('10-tips-for-better-javascript-code')
        expect(slugify('How to Build a REST API with Node.js')).toBe('how-to-build-a-rest-api-with-node-js')
        expect(slugify('Understanding React Hooks: A Complete Guide')).toBe('understanding-react-hooks-a-complete-guide')
      })

      it('should handle product names', () => {
        expect(slugify('iPhone 14 Pro Max')).toBe('iphone-14-pro-max')
        expect(slugify('MacBook Air (M2, 2022)')).toBe('macbook-air-m2-2022')
        expect(slugify('Dell XPS 13" Laptop')).toBe('dell-xps-13-laptop')
      })

      it('should handle technical terms', () => {
        expect(slugify('JavaScript ES6+ Features')).toBe('javascript-es6-features')
        expect(slugify('CSS-in-JS vs. CSS Modules')).toBe('css-in-js-vs-css-modules')
        expect(slugify('OAuth 2.0 Authentication')).toBe('oauth-2-0-authentication')
      })

      it('should handle user-generated content', () => {
        expect(slugify("What's the best programming language?")).toBe('what-s-the-best-programming-language')
        expect(slugify('My thoughts on Web3 & Crypto...')).toBe('my-thoughts-on-web3-crypto')
        expect(slugify('Why I love TypeScript (and you should too!)')).toBe('why-i-love-typescript-and-you-should-too')
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = 'word with special characters! '.repeat(1000)
        
        const startTime = performance.now()
        const result = slugify(largeString)
        const endTime = performance.now()
        
        expect(result.split('-')).toHaveLength(4000)
        expect(endTime - startTime).toBeLessThan(100)
      })
    })
  })

  describe('escapeHtml', () => {
    describe('basic functionality', () => {
      it('should escape HTML special characters', () => {
        expect(escapeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;&#x2F;div&gt;')
        expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
        expect(escapeHtml('<img src="x" onerror="alert(1)">')).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;')
      })

      it('should escape ampersands', () => {
        expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
        expect(escapeHtml('R&D Department')).toBe('R&amp;D Department')
        expect(escapeHtml('Q&A Session')).toBe('Q&amp;A Session')
      })

      it('should escape quotes', () => {
        expect(escapeHtml('"Hello World"')).toBe('&quot;Hello World&quot;')
        expect(escapeHtml("It's a test")).toBe('It&#x27;s a test')
        expect(escapeHtml(`'Single' and "Double" quotes`)).toBe('&#x27;Single&#x27; and &quot;Double&quot; quotes')
      })

      it('should escape forward slashes', () => {
        expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;')
        expect(escapeHtml('path/to/file')).toBe('path&#x2F;to&#x2F;file')
      })

      it('should handle multiple special characters', () => {
        expect(escapeHtml('<tag attr="value">content</tag>')).toBe('&lt;tag attr=&quot;value&quot;&gt;content&lt;&#x2F;tag&gt;')
        expect(escapeHtml('if (x < 5 && y > 3)')).toBe('if (x &lt; 5 &amp;&amp; y &gt; 3)')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(escapeHtml('')).toBe('')
      })

      it('should handle strings with no special characters', () => {
        expect(escapeHtml('Hello World')).toBe('Hello World')
        expect(escapeHtml('1234567890')).toBe('1234567890')
        expect(escapeHtml('abcdefghijk')).toBe('abcdefghijk')
      })

      it('should handle strings with only special characters', () => {
        expect(escapeHtml('&<>"\'/')).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;')
        expect(escapeHtml('<<>>')).toBe('&lt;&lt;&gt;&gt;')
        expect(escapeHtml('&&&&')).toBe('&amp;&amp;&amp;&amp;')
      })

      it('should handle repeated special characters', () => {
        expect(escapeHtml('&amp;')).toBe('&amp;amp;')
        expect(escapeHtml('&lt;&gt;')).toBe('&amp;lt;&amp;gt;')
      })
    })

    describe('security scenarios', () => {
      it('should prevent XSS attacks', () => {
        const xssAttempts = [
          '<script>alert("xss")</script>',
          '<img src=x onerror=alert(1)>',
          '<iframe src="javascript:alert(1)"></iframe>',
          '<svg/onload=alert(1)>',
          '<input onfocus=alert(1) autofocus>',
          '<body onload=alert(1)>'
        ]

        xssAttempts.forEach(attempt => {
          const escaped = escapeHtml(attempt)
          expect(escaped).not.toContain('<script')
          expect(escaped).not.toContain('<img')
          expect(escaped).not.toContain('onerror=')
          expect(escaped).not.toContain('onload=')
          expect(escaped).not.toContain('onfocus=')
        })
      })

      it('should handle SQL injection-like strings', () => {
        expect(escapeHtml("'; DROP TABLE users; --")).toBe('&#x27;; DROP TABLE users; --')
        expect(escapeHtml('1\' OR \'1\'=\'1')).toBe('1&#x27; OR &#x27;1&#x27;=&#x27;1')
      })

      it('should handle various payload formats', () => {
        expect(escapeHtml('<ScRiPt>alert(1)</ScRiPt>')).toBe('&lt;ScRiPt&gt;alert(1)&lt;&#x2F;ScRiPt&gt;')
        expect(escapeHtml('<SCRIPT SRC="http://evil.com/xss.js"></SCRIPT>')).toBe('&lt;SCRIPT SRC=&quot;http:&#x2F;&#x2F;evil.com&#x2F;xss.js&quot;&gt;&lt;&#x2F;SCRIPT&gt;')
      })
    })

    describe('unicode and special characters', () => {
      it('should preserve unicode characters', () => {
        expect(escapeHtml('Héllo Wørld')).toBe('Héllo Wørld')
        expect(escapeHtml('测试 字符串')).toBe('测试 字符串')
        expect(escapeHtml('🎉 Party Time 🎊')).toBe('🎉 Party Time 🎊')
      })

      it('should handle mixed unicode and HTML', () => {
        expect(escapeHtml('<div>Héllo Wørld</div>')).toBe('&lt;div&gt;Héllo Wørld&lt;&#x2F;div&gt;')
        expect(escapeHtml('测试 <script>alert("xss")</script> 字符串')).toBe('测试 &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt; 字符串')
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = '<div>Hello & "World"</div> '.repeat(1000)
        
        const startTime = performance.now()
        const result = escapeHtml(largeString)
        const endTime = performance.now()
        
        expect(result).toContain('&lt;div&gt;')
        expect(result).toContain('&amp;')
        expect(result).toContain('&quot;')
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('unescapeHtml', () => {
    describe('basic functionality', () => {
      it('should unescape HTML entities', () => {
        expect(unescapeHtml('&lt;div&gt;Hello&lt;&#x2F;div&gt;')).toBe('<div>Hello</div>')
        expect(unescapeHtml('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')).toBe('<script>alert("xss")</script>')
        expect(unescapeHtml('Tom &amp; Jerry')).toBe('Tom & Jerry')
      })

      it('should unescape quotes', () => {
        expect(unescapeHtml('&quot;Hello World&quot;')).toBe('"Hello World"')
        expect(unescapeHtml('It&#x27;s a test')).toBe("It's a test")
        expect(unescapeHtml('&#x27;Single&#x27; and &quot;Double&quot; quotes')).toBe(`'Single' and "Double" quotes`)
      })

      it('should unescape forward slashes', () => {
        expect(unescapeHtml('&lt;&#x2F;script&gt;')).toBe('</script>')
        expect(unescapeHtml('path&#x2F;to&#x2F;file')).toBe('path/to/file')
      })

      it('should unescape additional common entities', () => {
        expect(unescapeHtml('Hello&nbsp;World')).toBe('Hello World')
        expect(unescapeHtml('&copy; 2023 Company')).toBe('© 2023 Company')
        expect(unescapeHtml('Registered &reg; Trademark &trade;')).toBe('Registered ® Trademark ™')
      })
    })

    describe('edge cases', () => {
      it('should handle empty strings', () => {
        expect(unescapeHtml('')).toBe('')
      })

      it('should handle strings with no entities', () => {
        expect(unescapeHtml('Hello World')).toBe('Hello World')
        expect(unescapeHtml('1234567890')).toBe('1234567890')
        expect(unescapeHtml('abcdefghijk')).toBe('abcdefghijk')
      })

      it('should handle unknown entities', () => {
        expect(unescapeHtml('&unknown;')).toBe('&unknown;')
        expect(unescapeHtml('&notfound; &fake;')).toBe('&notfound; &fake;')
      })

      it('should handle malformed entities', () => {
        expect(unescapeHtml('&amp')).toBe('&amp')
        expect(unescapeHtml('&lt')).toBe('&lt')
        expect(unescapeHtml('amp;')).toBe('amp;')
      })

      it('should handle partial entities', () => {
        expect(unescapeHtml('&amp; incomplete')).toBe('& incomplete')
        expect(unescapeHtml('complete &amp; partial &lt')).toBe('complete & partial &lt')
      })
    })

    describe('round-trip compatibility', () => {
      it('should be inverse of escapeHtml for basic cases', () => {
        const testStrings = [
          'Hello & World',
          '<script>alert("test")</script>',
          '"Single" and \'Double\' quotes',
          'path/to/file',
          '<div class="test">Content</div>',
          'if (x < 5 && y > 3)'
        ]

        testStrings.forEach(str => {
          expect(unescapeHtml(escapeHtml(str))).toBe(str)
        })
      })

      it('should handle multiple escape/unescape cycles', () => {
        const original = '<div class="test">Hello & "World"</div>'
        let processed = original
        
        // Multiple escape/unescape cycles
        for (let i = 0; i < 3; i++) {
          processed = escapeHtml(processed)
          processed = unescapeHtml(processed)
        }
        
        expect(processed).toBe(original)
      })

      it('should handle already-escaped content', () => {
        expect(unescapeHtml('&amp;lt;div&amp;gt;')).toBe('&lt;div&gt;')
        expect(unescapeHtml(escapeHtml('&lt;already&gt;'))).toBe('&lt;already&gt;')
      })
    })

    describe('unicode and special characters', () => {
      it('should preserve unicode characters', () => {
        expect(unescapeHtml('Héllo &amp; Wørld')).toBe('Héllo & Wørld')
        expect(unescapeHtml('测试 &lt;字符串&gt;')).toBe('测试 <字符串>')
        expect(unescapeHtml('🎉 &amp; 🎊')).toBe('🎉 & 🎊')
      })
    })

    describe('performance', () => {
      it('should handle large strings efficiently', () => {
        const largeString = '&lt;div&gt;Hello &amp; &quot;World&quot;&lt;&#x2F;div&gt; '.repeat(1000)
        
        const startTime = performance.now()
        const result = unescapeHtml(largeString)
        const endTime = performance.now()
        
        expect(result).toContain('<div>')
        expect(result).toContain('&')
        expect(result).toContain('"')
        expect(endTime - startTime).toBeLessThan(50)
      })
    })
  })

  describe('integration tests', () => {
    it('should work together for safe URL and HTML processing', () => {
      const userInput = 'My Blog Post: <script>alert("xss")</script> & More!'
      
      // Create safe slug
      const slug = slugify(userInput)
      expect(slug).toBe('my-blog-post-script-alert-xss-script-more')
      
      // Create safe HTML title
      const safeTitle = escapeHtml(userInput)
      expect(safeTitle).toContain('&lt;script&gt;')
      expect(safeTitle).toContain('&amp;')
      
      // Round trip
      const unescaped = unescapeHtml(safeTitle)
      expect(unescaped).toBe(userInput)
    })

    it('should handle complex real-world scenarios', () => {
      const scenarios = [
        'Article: "How to Handle User Input & XSS Attacks"',
        '<div>Price: $5 < $10 & Quality > Expectations</div>',
        'Search: "javascript" OR "typescript" (10 results)',
        'File: data/users.json -> output/processed.csv'
      ]

      scenarios.forEach(scenario => {
        // Should not throw errors
        expect(() => slugify(scenario)).not.toThrow()
        expect(() => escapeHtml(scenario)).not.toThrow()
        expect(() => unescapeHtml(escapeHtml(scenario))).not.toThrow()
        
        // Round trip should work
        expect(unescapeHtml(escapeHtml(scenario))).toBe(scenario)
        
        // Slugify should produce reasonable results
        const slug = slugify(scenario)
        expect(slug).toMatch(/^[a-z0-9-]*$/)
      })
    })

    it('should maintain string immutability', () => {
      const original = '<div class="test">Hello & World</div>'
      const originalCopy = original
      
      slugify(original)
      escapeHtml(original)
      unescapeHtml(original)
      
      expect(original).toBe(originalCopy)
    })
  })
})