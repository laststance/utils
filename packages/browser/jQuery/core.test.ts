/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery Core - $()', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('Element Selection', () => {
    it('should select elements by tag name', () => {
      // Setup
      document.body.innerHTML = `
        <div>First div</div>
        <div>Second div</div>
        <p>A paragraph</p>
      `

      // Test
      const divs = $('div')

      // Assert
      expect(divs.length).toBe(2)
      expect(divs[0]?.textContent).toBe('First div')
      expect(divs[1]?.textContent).toBe('Second div')
    })

    it('should select elements by ID', () => {
      // Setup
      document.body.innerHTML = `
        <div id="test-id">Selected by ID</div>
        <div>Not selected</div>
      `

      // Test
      const element = $('#test-id')

      // Assert
      expect(element.length).toBe(1)
      expect(element[0]?.textContent).toBe('Selected by ID')
    })

    it('should select elements by class', () => {
      // Setup
      document.body.innerHTML = `
        <div class="test-class">First with class</div>
        <div>No class</div>
        <div class="test-class">Second with class</div>
      `

      // Test
      const elements = $('.test-class')

      // Assert
      expect(elements.length).toBe(2)
      expect(elements[0]?.textContent).toBe('First with class')
      expect(elements[1]?.textContent).toBe('Second with class')
    })

    it('should select multiple classes', () => {
      // Setup
      document.body.innerHTML = `
        <div class="class1 class2">Both classes</div>
        <div class="class1">Only class1</div>
        <div class="class2">Only class2</div>
      `

      // Test
      const elements = $('.class1.class2')

      // Assert
      expect(elements.length).toBe(1)
      expect(elements[0]?.textContent).toBe('Both classes')
    })

    it('should select elements by attribute', () => {
      // Setup
      document.body.innerHTML = `
        <input type="text" value="Text input">
        <input type="checkbox">
        <button>Click me</button>
      `

      // Test
      const textInputs = $('[type="text"]')

      // Assert
      expect(textInputs.length).toBe(1)
      expect((textInputs[0] as HTMLInputElement)?.value).toBe('Text input')
    })

    it('should support complex CSS selectors', () => {
      // Setup
      document.body.innerHTML = `
        <ul>
          <li>Item 1</li>
          <li class="active">Item 2</li>
          <li>Item 3</li>
        </ul>
      `

      // Test
      const activeItem = $('ul li.active')

      // Assert
      expect(activeItem.length).toBe(1)
      expect(activeItem[0]?.textContent).toBe('Item 2')
    })

    it('should return empty collection for non-existent elements', () => {
      // Test
      const elements = $('.non-existent')

      // Assert
      expect(elements.length).toBe(0)
    })
  })

  describe('DOM Creation', () => {
    it('should create simple elements', () => {
      // Test
      const div = $('<div>')

      // Assert
      expect(div.length).toBe(1)
      expect(div[0]?.tagName.toLowerCase()).toBe('div')
    })

    it('should create elements with attributes', () => {
      // Test
      const link = $('<a href="https://example.com">Link</a>')

      // Assert
      expect(link.length).toBe(1)
      expect(link[0]?.tagName.toLowerCase()).toBe('a')
      expect(link[0]?.getAttribute('href')).toBe('https://example.com')
      expect(link[0]?.textContent).toBe('Link')
    })

    it('should create elements with classes', () => {
      // Test
      const div = $('<div class="new-class">Content</div>')

      // Assert
      expect(div[0]?.classList.contains('new-class')).toBe(true)
      expect(div[0]?.textContent).toBe('Content')
    })

    it('should create self-closing elements', () => {
      // Test
      const img = $('<img src="test.jpg" />')

      // Assert
      expect(img[0]?.tagName.toLowerCase()).toBe('img')
      expect(img[0]?.getAttribute('src')).toBe('test.jpg')
    })
  })

  describe('Context Selection', () => {
    it('should select within a specific context', () => {
      // Setup
      document.body.innerHTML = `
        <div id="context1">
          <span>Inside context1</span>
        </div>
        <div id="context2">
          <span>Inside context2</span>
        </div>
      `

      // Test
      const context = document.getElementById('context1')!
      const spans = $('span', context)

      // Assert
      expect(spans.length).toBe(1)
      expect(spans[0]?.textContent).toBe('Inside context1')
    })

    it('should accept jQuery object as context', () => {
      // Setup
      document.body.innerHTML = `
        <div class="container">
          <p>Paragraph in container</p>
        </div>
        <p>Paragraph outside</p>
      `

      // Test
      const container = $('.container')
      const paragraphs = $('p', container)

      // Assert
      expect(paragraphs.length).toBe(1)
      expect(paragraphs[0]?.textContent).toBe('Paragraph in container')
    })
  })

  describe('Special Characters', () => {
    it('should handle IDs with special characters', () => {
      // Setup
      document.body.innerHTML = `
        <div id="test.id">ID with dot</div>
        <div id="test:id">ID with colon</div>
      `

      // Test
      const dotElement = $('#test\\.id')
      const colonElement = $('#test\\:id')

      // Assert
      expect(dotElement.length).toBe(1)
      expect(dotElement[0]?.textContent).toBe('ID with dot')
      expect(colonElement.length).toBe(1)
      expect(colonElement[0]?.textContent).toBe('ID with colon')
    })
  })

  describe('Collection Behavior', () => {
    it('should be array-like with length property', () => {
      // Setup
      document.body.innerHTML = `
        <div>1</div>
        <div>2</div>
        <div>3</div>
      `

      // Test
      const divs = $('div')

      // Assert
      expect(typeof divs.length).toBe('number')
      expect(divs.length).toBe(3)
    })

    it('should allow index access', () => {
      // Setup
      document.body.innerHTML = `
        <div>First</div>
        <div>Second</div>
      `

      // Test
      const divs = $('div')

      // Assert
      expect(divs[0]).toBeInstanceOf(HTMLElement)
      expect(divs[0]?.textContent).toBe('First')
      expect(divs[1]?.textContent).toBe('Second')
      expect(divs[2]).toBeUndefined()
    })

    it('should be iterable', () => {
      // Setup
      document.body.innerHTML = `
        <span>A</span>
        <span>B</span>
        <span>C</span>
      `

      // Test
      const spans = $('span')
      const texts: string[] = []

      for (let i = 0; i < spans.length; i++) {
        texts.push(spans[i]?.textContent || '')
      }

      // Assert
      expect(texts).toEqual(['A', 'B', 'C'])
    })
  })

  describe('Ready Function', () => {
    it('should accept ready callback', () => {
      let callbackExecuted = false

      // Test
      $(function () {
        callbackExecuted = true
      })

      // Simulate DOM ready (in real implementation, this would wait for DOMContentLoaded)
      // For now, we'll assume immediate execution in tests

      // Assert
      expect(callbackExecuted).toBe(true)
    })
  })

  describe('Window and Document Selection', () => {
    it('should wrap window object', () => {
      // Test
      const $window = $(window)

      // Assert
      expect($window.length).toBe(1)
      expect($window[0]).toBe(window)
    })

    it('should wrap document object', () => {
      // Test
      const $document = $(document)

      // Assert
      expect($document.length).toBe(1)
      expect($document[0]).toBe(document)
    })
  })

  describe('DOM Element Wrapping', () => {
    it('should wrap a single DOM element', () => {
      // Setup
      const div = document.createElement('div')
      div.textContent = 'Test'

      // Test
      const $div = $(div)

      // Assert
      expect($div.length).toBe(1)
      expect($div[0]).toBe(div)
      expect($div[0]?.textContent).toBe('Test')
    })

    it('should wrap NodeList', () => {
      // Setup
      document.body.innerHTML = `
        <p>1</p>
        <p>2</p>
      `
      const nodeList = document.querySelectorAll('p')

      // Test
      const $elements = $(nodeList)

      // Assert
      expect($elements.length).toBe(2)
      expect($elements[0]?.textContent).toBe('1')
      expect($elements[1]?.textContent).toBe('2')
    })
  })
})
