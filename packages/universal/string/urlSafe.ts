/**
 * Converts a string into a URL-friendly slug.
 * Removes special characters, converts to lowercase, and replaces spaces with hyphens.
 *
 * @param str - The string to slugify
 * @returns A URL-safe slug version of the string
 *
 * @example
 * ```typescript
 * slugify('Hello World!')           // 'hello-world'
 * slugify('My Great Article')       // 'my-great-article'
 * slugify('Testing 123 & More!')    // 'testing-123-more'
 * slugify('Special çhàracters')     // 'special-characters'
 * slugify('Multiple   Spaces')      // 'multiple-spaces'
 * slugify('---dashes---')           // 'dashes'
 * ```
 */
export function slugify(str: string): string {
  return (
    str
      .toLowerCase()
      .trim()
      // Replace accented characters with their base equivalents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace non-alphanumeric characters (except hyphens) with hyphens
      .replace(/[^a-z0-9-]/g, '-')
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-|-$/g, '')
  )
}

/**
 * Escapes HTML characters to prevent XSS and ensure safe display.
 * Converts dangerous HTML characters to their entity equivalents.
 *
 * @param str - The string to escape
 * @returns The HTML-escaped string
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>')  // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * escapeHtml('Tom & Jerry')                    // 'Tom &amp; Jerry'
 * escapeHtml('"Hello World"')                  // '&quot;Hello World&quot;'
 * escapeHtml("It's a test")                    // 'It&#x27;s a test'
 * escapeHtml('Price: $5 < $10')                // 'Price: $5 &lt; $10'
 * ```
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]!)
}

/**
 * Unescapes HTML entities back to their original characters.
 * Converts HTML entities to their character equivalents.
 *
 * @param str - The HTML-escaped string to unescape
 * @returns The unescaped string
 *
 * @example
 * ```typescript
 * unescapeHtml('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')  // '<script>alert("xss")</script>'
 * unescapeHtml('Tom &amp; Jerry')                                    // 'Tom & Jerry'
 * unescapeHtml('&quot;Hello World&quot;')                            // '"Hello World"'
 * unescapeHtml('It&#x27;s a test')                                   // "It's a test"
 * unescapeHtml('Price: $5 &lt; $10')                                 // 'Price: $5 < $10'
 * ```
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    // Additional common entities
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  }

  return str.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F|nbsp|copy|reg|trade);/g,
    (match) => htmlUnescapes[match] || match,
  )
}
