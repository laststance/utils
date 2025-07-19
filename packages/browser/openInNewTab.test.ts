import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { openInNewTab } from './openInNewTab.js'

describe('openInNewTab', () => {
  let mockAnchor: any
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a mock anchor element
    mockAnchor = {
      target: '',
      href: '',
      click: vi.fn(),
    }

    // Store original createElement and mock it
    originalCreateElement = document.createElement
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'a') {
        return mockAnchor
      }
      return originalCreateElement.call(document, tagName)
    })
  })

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should be a function', () => {
      expect(typeof openInNewTab).toBe('function')
    })

    it('should create an anchor element', () => {
      openInNewTab('https://example.com')

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(document.createElement).toHaveBeenCalledTimes(1)
    })

    it('should set target to _blank', () => {
      openInNewTab('https://example.com')

      expect(mockAnchor.target).toBe('_blank')
    })

    it('should set href to the provided URL', () => {
      const url = 'https://example.com'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
    })

    it('should call click on the anchor element', () => {
      openInNewTab('https://example.com')

      expect(mockAnchor.click).toHaveBeenCalledTimes(1)
    })

    it('should not return any value', () => {
      const result = openInNewTab('https://example.com')

      expect(result).toBeUndefined()
    })
  })

  describe('URL handling', () => {
    it('should handle HTTPS URLs', () => {
      const url = 'https://secure.example.com/path'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle HTTP URLs', () => {
      const url = 'http://example.com'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle URLs with paths and query parameters', () => {
      const url = 'https://example.com/path/to/page?param1=value1&param2=value2'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle URLs with fragments', () => {
      const url = 'https://example.com/page#section1'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle relative URLs', () => {
      const url = '/relative/path'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle protocol-relative URLs', () => {
      const url = '//example.com/path'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle file URLs', () => {
      const url = 'file:///path/to/file.html'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle data URLs', () => {
      const url = 'data:text/html,<h1>Hello World</h1>'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle blob URLs', () => {
      const url = 'blob:https://example.com/12345-6789'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle empty string URL', () => {
      openInNewTab('')

      expect(mockAnchor.href).toBe('')
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle URLs with special characters', () => {
      const url =
        'https://example.com/path with spaces/file?query=value with spaces'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle URLs with international characters', () => {
      const url = 'https://例え.テスト/パス'
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle very long URLs', () => {
      const longPath = 'a'.repeat(2000)
      const url = `https://example.com/${longPath}`
      openInNewTab(url)

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should handle malformed URLs gracefully', () => {
      const malformedUrls = [
        'ht tp://example.com',
        'https://',
        'javascript:alert("test")',
        'vbscript:alert("test")',
        '   https://example.com   ', // URL with spaces
      ]

      malformedUrls.forEach((url) => {
        expect(() => openInNewTab(url)).not.toThrow()
        expect(mockAnchor.href).toBe(url)
        expect(mockAnchor.target).toBe('_blank')
        expect(mockAnchor.click).toHaveBeenCalled()

        // Reset mock for next iteration
        vi.clearAllMocks()
        mockAnchor.href = ''
        mockAnchor.target = ''
      })
    })
  })

  describe('multiple calls', () => {
    it('should create new anchor element for each call', () => {
      openInNewTab('https://example1.com')
      openInNewTab('https://example2.com')
      openInNewTab('https://example3.com')

      expect(document.createElement).toHaveBeenCalledTimes(3)
      expect(mockAnchor.click).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid successive calls', () => {
      const urls = [
        'https://example1.com',
        'https://example2.com',
        'https://example3.com',
        'https://example4.com',
        'https://example5.com',
      ]

      urls.forEach((url) => openInNewTab(url))

      expect(document.createElement).toHaveBeenCalledTimes(5)
      expect(mockAnchor.click).toHaveBeenCalledTimes(5)
    })
  })

  describe('security considerations', () => {
    it('should not prevent potentially harmful URLs (delegates to browser)', () => {
      const potentiallyHarmfulUrls = [
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'vbscript:alert("xss")',
      ]

      potentiallyHarmfulUrls.forEach((url) => {
        expect(() => openInNewTab(url)).not.toThrow()
        expect(mockAnchor.href).toBe(url)
        expect(mockAnchor.target).toBe('_blank')

        // Reset for next iteration
        mockAnchor.href = ''
        mockAnchor.target = ''
      })
    })

    it('should use _blank target for security (prevents window.opener access)', () => {
      openInNewTab('https://external-site.com')

      expect(mockAnchor.target).toBe('_blank')
    })
  })

  describe('browser compatibility patterns', () => {
    it('should work with real DOM elements', () => {
      // Test with actual DOM implementation
      document.createElement = originalCreateElement

      const spy = vi.spyOn(HTMLAnchorElement.prototype, 'click')

      expect(() => openInNewTab('https://example.com')).not.toThrow()
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should handle click method not being available', () => {
      // Test edge case where click method might not exist
      const anchorWithoutClick = {
        target: '',
        href: '',
        // No click method
      }

      // @ts-ignore - mock implementation for testing
      document.createElement = vi.fn(() => anchorWithoutClick)

      // Should throw when trying to call click
      expect(() => openInNewTab('https://example.com')).toThrow()
    })
  })

  describe('performance considerations', () => {
    it('should not accumulate DOM elements', () => {
      // Elements should not be added to the DOM
      const initialChildCount = document.body.children.length

      openInNewTab('https://example.com')
      openInNewTab('https://example2.com')
      openInNewTab('https://example3.com')

      // DOM should not accumulate elements
      expect(document.body.children.length).toBe(initialChildCount)
    })

    it('should be efficient for multiple calls', () => {
      const startTime = performance.now()

      for (let i = 0; i < 100; i++) {
        openInNewTab(`https://example${i}.com`)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete quickly (less than 100ms for 100 calls)
      expect(duration).toBeLessThan(100)
      expect(document.createElement).toHaveBeenCalledTimes(100)
    })
  })

  describe('real world usage patterns', () => {
    it('should work in event handlers', () => {
      const mockButton = {
        addEventListener: vi.fn(),
      }

      const clickHandler = () => openInNewTab('https://docs.example.com')
      mockButton.addEventListener('click', clickHandler)

      // Simulate click event
      clickHandler()

      expect(mockAnchor.href).toBe('https://docs.example.com')
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should work with dynamic URLs', () => {
      const baseUrl = 'https://api.example.com'
      const userId = '12345'
      const dynamicUrl = `${baseUrl}/users/${userId}/profile`

      openInNewTab(dynamicUrl)

      expect(mockAnchor.href).toBe(dynamicUrl)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('should work with conditional logic', () => {
      const shouldOpenInNewTab = true
      const url = 'https://example.com'

      if (shouldOpenInNewTab) {
        openInNewTab(url)
      }

      expect(mockAnchor.href).toBe(url)
      expect(mockAnchor.target).toBe('_blank')
      expect(mockAnchor.click).toHaveBeenCalled()
    })
  })
})
