/**
 * jQuery Core - Selector and DOM manipulation
 * A plain JavaScript implementation of jQuery's core functionality
 */

export interface JQueryCollection extends ArrayLike<Element> {
  length: number
  [index: number]: Element
}

export class JQuery implements JQueryCollection {
  length: number = 0;
  [index: number]: Element

  constructor(
    selector?: string | Element | NodeList | Window | Document | Function,
    context?: Element | JQuery,
  ) {
    // Handle ready function
    if (typeof selector === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', selector as EventListener)
      } else {
        selector()
      }
      return this
    }

    // Handle window object
    if (selector === window) {
      this[0] = window as any
      this.length = 1
      return this
    }

    // Handle document object
    if (selector === document) {
      this[0] = document as any
      this.length = 1
      return this
    }

    // Handle DOM element
    if (selector instanceof Element) {
      this[0] = selector
      this.length = 1
      return this
    }

    // Handle NodeList
    if (selector instanceof NodeList) {
      Array.from(selector).forEach((el, i) => {
        this[i] = el as Element
      })
      this.length = selector.length
      return this
    }

    // Handle string selector
    if (typeof selector === 'string') {
      const trimmedSelector = selector.trim()

      // Check if it's HTML creation
      if (
        trimmedSelector[0] === '<' &&
        trimmedSelector[trimmedSelector.length - 1] === '>'
      ) {
        // Create element
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = trimmedSelector
        const elements = tempDiv.children

        Array.from(elements).forEach((el, i) => {
          this[i] = el
        })
        this.length = elements.length
        return this
      }

      // Regular selector
      let searchContext: Element | Document = document

      // Handle context
      if (context) {
        if (context instanceof JQuery) {
          searchContext = context[0] || document
        } else {
          searchContext = context
        }
      }

      // Handle special character escaping for IDs
      // Only escape when we have #id\\.something or #id\\:something pattern
      let processedSelector = selector
      if (selector.includes('\\')) {
        // Replace escaped dots and colons with temporary placeholders
        processedSelector = selector
          .replace(/\\\./g, '__DOT__')
          .replace(/\\:/g, '__COLON__')
          // Now replace the placeholders with proper CSS escapes
          .replace(/__DOT__/g, '\\.')
          .replace(/__COLON__/g, '\\:')
      }

      try {
        const elements = searchContext.querySelectorAll(processedSelector)
        Array.from(elements).forEach((el, i) => {
          this[i] = el as Element
        })
        this.length = elements.length
      } catch {
        // If selector fails, return empty collection
        this.length = 0
      }
    }

    return this
  }
}

// Global jQuery function
export function $(
  selector?: string | Element | NodeList | Window | Document | Function,
  context?: Element | JQuery,
): JQuery {
  return new JQuery(selector, context)
}

// Make $ available globally for tests
;(window as any).$ = $
