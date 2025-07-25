/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery DOM Manipulation', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.html()', () => {
    it('should get HTML content of first element', () => {
      // Setup
      document.body.innerHTML = `
        <div id="test1"><p>Hello</p></div>
        <div id="test2"><span>World</span></div>
      `

      // Test
      const html = $('#test1').html()

      // Assert
      expect(html).toBe('<p>Hello</p>')
    })

    it('should set HTML content for all matched elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="target">Old content 1</div>
        <div class="target">Old content 2</div>
      `

      // Test
      $('.target').html('<strong>New content</strong>')

      // Assert
      const divs = document.querySelectorAll('.target')
      expect(divs[0]?.innerHTML).toBe('<strong>New content</strong>')
      expect(divs[1]?.innerHTML).toBe('<strong>New content</strong>')
    })

    it('should return empty string for empty elements', () => {
      // Setup
      document.body.innerHTML = '<div id="empty"></div>'

      // Test
      const html = $('#empty').html()

      // Assert
      expect(html).toBe('')
    })

    it('should return undefined for empty collection', () => {
      // Test
      const html = $('#non-existent').html()

      // Assert
      expect(html).toBeUndefined()
    })

    it('should support function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').html(function (index) {
        return `<span>Updated ${index}</span>`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.innerHTML).toBe('<span>Updated 0</span>')
      expect(items[1]?.innerHTML).toBe('<span>Updated 1</span>')
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').html('<p>Content</p>')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })
  })

  describe('.text()', () => {
    it('should get combined text of all matched elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="text">Hello </div>
        <div class="text">World</div>
      `

      // Test
      const text = $('.text').text()

      // Assert
      expect(text).toBe('Hello World')
    })

    it('should set text content for all matched elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="target">Old text 1</div>
        <div class="target">Old text 2</div>
      `

      // Test
      $('.target').text('New text')

      // Assert
      const divs = document.querySelectorAll('.target')
      expect(divs[0]?.textContent).toBe('New text')
      expect(divs[1]?.textContent).toBe('New text')
    })

    it('should escape HTML when setting text', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').text('<script>alert("XSS")</script>')

      // Assert
      const div = document.getElementById('test')
      expect(div?.textContent).toBe('<script>alert("XSS")</script>')
      expect(div?.innerHTML).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;')
    })

    it('should return empty string for empty elements', () => {
      // Setup
      document.body.innerHTML = '<div id="empty"></div>'

      // Test
      const text = $('#empty').text()

      // Assert
      expect(text).toBe('')
    })

    it('should return empty string for empty collection', () => {
      // Test
      const text = $('#non-existent').text()

      // Assert
      expect(text).toBe('')
    })

    it('should support function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').text(function (index, oldText) {
        return `${oldText} - Updated ${index}`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.textContent).toBe('Item 0 - Updated 0')
      expect(items[1]?.textContent).toBe('Item 1 - Updated 1')
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').text('Content')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should get text from nested elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="nested">
          <p>Paragraph <strong>with bold</strong> text</p>
          <span>and a span</span>
        </div>
      `

      // Test
      const text = $('#nested').text()

      // Assert
      expect(text.trim().replace(/\s+/g, ' ')).toBe(
        'Paragraph with bold text and a span',
      )
    })
  })

  describe('.val()', () => {
    it('should get value of input element', () => {
      // Setup
      document.body.innerHTML =
        '<input type="text" id="input" value="Test value">'

      // Test
      const value = $('#input').val()

      // Assert
      expect(value).toBe('Test value')
    })

    it('should set value of input elements', () => {
      // Setup
      document.body.innerHTML = `
        <input type="text" class="input" value="Old">
        <input type="text" class="input" value="Old">
      `

      // Test
      $('.input').val('New value')

      // Assert
      const inputs = document.querySelectorAll(
        '.input',
      ) as NodeListOf<HTMLInputElement>
      expect(inputs[0]?.value).toBe('New value')
      expect(inputs[1]?.value).toBe('New value')
    })

    it('should get value of textarea', () => {
      // Setup
      document.body.innerHTML =
        '<textarea id="textarea">Textarea content</textarea>'

      // Test
      const value = $('#textarea').val()

      // Assert
      expect(value).toBe('Textarea content')
    })

    it('should set value of textarea', () => {
      // Setup
      document.body.innerHTML = '<textarea id="textarea">Old content</textarea>'

      // Test
      $('#textarea').val('New content')

      // Assert
      const textarea = document.getElementById(
        'textarea',
      ) as HTMLTextAreaElement
      expect(textarea.value).toBe('New content')
    })

    it('should get selected value of select element', () => {
      // Setup
      document.body.innerHTML = `
        <select id="select">
          <option value="1">One</option>
          <option value="2" selected>Two</option>
          <option value="3">Three</option>
        </select>
      `

      // Test
      const value = $('#select').val()

      // Assert
      expect(value).toBe('2')
    })

    it('should set selected value of select element', () => {
      // Setup
      document.body.innerHTML = `
        <select id="select">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      `

      // Test
      $('#select').val('3')

      // Assert
      const select = document.getElementById('select') as HTMLSelectElement
      expect(select.value).toBe('3')
    })

    it('should get array of selected values for select-multiple', () => {
      // Setup
      document.body.innerHTML = `
        <select id="multi" multiple>
          <option value="1" selected>One</option>
          <option value="2">Two</option>
          <option value="3" selected>Three</option>
        </select>
      `

      // Test
      const values = $('#multi').val()

      // Assert
      expect(values).toEqual(['1', '3'])
    })

    it('should set multiple selected values for select-multiple', () => {
      // Setup
      document.body.innerHTML = `
        <select id="multi" multiple>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      `

      // Test
      $('#multi').val(['1', '3'])

      // Assert
      const options = document.querySelectorAll(
        '#multi option',
      ) as NodeListOf<HTMLOptionElement>
      expect(options[0]?.selected).toBe(true)
      expect(options[1]?.selected).toBe(false)
      expect(options[2]?.selected).toBe(true)
    })

    it('should return undefined for empty collection', () => {
      // Test
      const value = $('#non-existent').val()

      // Assert
      expect(value).toBeUndefined()
    })

    it('should return undefined for non-form elements', () => {
      // Setup
      document.body.innerHTML = '<div id="div">Not a form element</div>'

      // Test
      const value = $('#div').val()

      // Assert
      expect(value).toBeUndefined()
    })

    it('should support function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <input type="text" class="input" value="Value 0">
        <input type="text" class="input" value="Value 1">
      `

      // Test
      $('.input').val(function (index, oldValue) {
        return `${oldValue} - Updated ${index}`
      })

      // Assert
      const inputs = document.querySelectorAll(
        '.input',
      ) as NodeListOf<HTMLInputElement>
      expect(inputs[0]?.value).toBe('Value 0 - Updated 0')
      expect(inputs[1]?.value).toBe('Value 1 - Updated 1')
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<input type="text" id="input">'

      // Test
      const result = $('#input').val('Test')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('input'))
    })

    it('should handle checkbox values', () => {
      // Setup
      document.body.innerHTML = `
        <input type="checkbox" id="checkbox" value="checkValue">
      `

      // Test
      const value = $('#checkbox').val()

      // Assert
      expect(value).toBe('checkValue')
    })

    it('should handle radio button values', () => {
      // Setup
      document.body.innerHTML = `
        <input type="radio" name="radio" value="radio1">
        <input type="radio" name="radio" value="radio2" checked>
      `

      // Test
      const value = $('input[name="radio"]:checked').val()

      // Assert
      expect(value).toBe('radio2')
    })
  })
})
