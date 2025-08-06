/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery DOM Removal Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.remove()', () => {
    it('should remove elements from the DOM', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p class="remove-me">Paragraph 1</p>
          <p class="keep">Paragraph 2</p>
          <p class="remove-me">Paragraph 3</p>
        </div>
      `

      // Test
      $('.remove-me').remove()

      // Assert
      expect(document.querySelectorAll('.remove-me').length).toBe(0)
      expect(document.querySelectorAll('.keep').length).toBe(1)
      expect(document.getElementById('container')?.children.length).toBe(1)
    })

    it('should remove single element', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Remove me</div>'

      // Test
      $('#target').remove()

      // Assert
      expect(document.getElementById('target')).toBeNull()
      expect(document.body.innerHTML).toBe('')
    })

    it('should remove element with all its children', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent">
          <span>Child 1</span>
          <div>
            <p>Nested child</p>
          </div>
        </div>
      `

      // Test
      $('#parent').remove()

      // Assert
      expect(document.getElementById('parent')).toBeNull()
      expect(document.body.innerHTML.trim()).toBe('')
    })

    it('should return the removed elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      const removed = $('.item').remove()

      // Assert
      expect(removed).toHaveProperty('length', 2)
      expect(removed[0]?.textContent).toBe('Item 1')
      expect(removed[1]?.textContent).toBe('Item 2')
      expect(document.querySelectorAll('.item').length).toBe(0)
    })

    it('should handle empty collection', () => {
      // Test
      const result = $('.non-existent').remove()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.empty()', () => {
    it('should remove all child nodes from elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p>Paragraph 1</p>
          <span>Span element</span>
          Text node
        </div>
      `

      // Test
      $('#container').empty()

      // Assert
      const container = document.getElementById('container')
      expect(container).not.toBeNull()
      expect(container?.children.length).toBe(0)
      expect(container?.textContent).toBe('')
      expect(container?.innerHTML).toBe('')
    })

    it('should empty multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="container">
          <p>Content 1</p>
        </div>
        <div class="container">
          <span>Content 2</span>
        </div>
      `

      // Test
      $('.container').empty()

      // Assert
      const containers = document.querySelectorAll('.container')
      expect(containers.length).toBe(2)
      containers.forEach((container) => {
        expect(container.innerHTML).toBe('')
      })
    })

    it('should remove text nodes', () => {
      // Setup
      document.body.innerHTML = '<div id="test">Text content</div>'

      // Test
      $('#test').empty()

      // Assert
      const element = document.getElementById('test')
      expect(element?.textContent).toBe('')
      expect(element?.childNodes.length).toBe(0)
    })

    it('should remove child elements completely', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button id="btn">Click me</button>
          <span id="text">Some text</span>
        </div>
      `

      // Test
      $('#container').empty()

      // Assert
      expect(document.getElementById('btn')).toBeNull()
      expect(document.getElementById('text')).toBeNull()
      expect(document.getElementById('container')).not.toBeNull()
      expect(document.getElementById('container')?.innerHTML).toBe('')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"><p>Content</p></div>'

      // Test
      const result = $('#test').empty()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
      expect(result[0]?.innerHTML).toBe('')
    })

    it('should handle empty collection', () => {
      // Test
      const result = $('.non-existent').empty()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.detach()', () => {
    it('should remove elements from DOM but preserve data and events', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p id="detachable">Detach me</p>
          <p id="keeper">Keep me</p>
        </div>
      `

      // Test
      const detached = $('#detachable').detach()

      // Assert
      expect(document.getElementById('detachable')).toBeNull()
      expect(document.getElementById('keeper')).not.toBeNull()
      expect(detached).toHaveProperty('length', 1)
      expect(detached[0]?.id).toBe('detachable')
      expect(detached[0]?.textContent).toBe('Detach me')
    })

    it('should detach multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <ul>
          <li class="detach">Item 1</li>
          <li class="keep">Item 2</li>
          <li class="detach">Item 3</li>
        </ul>
      `

      // Test
      const detached = $('.detach').detach()

      // Assert
      expect(document.querySelectorAll('.detach').length).toBe(0)
      expect(document.querySelectorAll('.keep').length).toBe(1)
      expect(detached).toHaveProperty('length', 2)
      expect(detached[0]?.textContent).toBe('Item 1')
      expect(detached[1]?.textContent).toBe('Item 3')
    })

    it('should allow reattaching detached elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="source">
          <p id="movable">Move me</p>
        </div>
        <div id="target"></div>
      `

      // Test
      const detached = $('#movable').detach()
      $('#target').append(detached)

      // Assert
      expect(document.querySelector('#source #movable')).toBeNull()
      expect(document.querySelector('#target #movable')).not.toBeNull()
      expect(document.querySelector('#target #movable')?.textContent).toBe(
        'Move me',
      )
    })

    it('should preserve element properties when detached', () => {
      // Setup
      document.body.innerHTML =
        '<input type="text" id="input" value="test value">'
      const input = document.getElementById('input') as HTMLInputElement
      input.disabled = true

      // Test
      const detached = $('#input').detach()

      // Assert
      expect(document.getElementById('input')).toBeNull()
      const detachedInput = detached[0] as HTMLInputElement
      expect(detachedInput.value).toBe('test value')
      expect(detachedInput.disabled).toBe(true)
    })

    it('should handle empty collection', () => {
      // Test
      const result = $('.non-existent').detach()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })

    it('should return detached elements for chaining', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <span class="item">Item 1</span>
          <span class="item">Item 2</span>
        </div>
      `

      // Test
      const result = $('.item').detach()

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Item 1')
      expect(result[1]?.textContent).toBe('Item 2')
      expect(document.querySelectorAll('.item').length).toBe(0)
    })
  })
})
