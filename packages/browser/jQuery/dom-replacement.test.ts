/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery DOM Replacement Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.replaceWith()', () => {
    it('should replace element with HTML string', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p id="target">Replace me</p>
        </div>
      `

      // Test
      $('#target').replaceWith('<span id="replacement">Replaced!</span>')

      // Assert
      expect(document.getElementById('target')).toBeNull()
      expect(document.getElementById('replacement')).not.toBeNull()
      expect(document.getElementById('replacement')?.textContent).toBe(
        'Replaced!',
      )
      expect(document.getElementById('container')?.innerHTML.trim()).toBe(
        '<span id="replacement">Replaced!</span>',
      )
    })

    it('should replace multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="replace">Item 1</p>
          <p class="keep">Keep this</p>
          <p class="replace">Item 2</p>
        </div>
      `

      // Test
      $('.replace').replaceWith('<span class="replaced">Replaced</span>')

      // Assert
      expect(document.querySelectorAll('.replace').length).toBe(0)
      expect(document.querySelectorAll('.replaced').length).toBe(2)
      expect(document.querySelectorAll('.keep').length).toBe(1)
    })

    it('should replace with DOM element', () => {
      // Setup
      document.body.innerHTML = '<p id="target">Replace me</p>'
      const newElement = document.createElement('div')
      newElement.id = 'new'
      newElement.textContent = 'New element'

      // Test
      $('#target').replaceWith(newElement)

      // Assert
      expect(document.getElementById('target')).toBeNull()
      expect(document.getElementById('new')).not.toBeNull()
      expect(document.getElementById('new')?.textContent).toBe('New element')
    })

    it('should replace with jQuery object', () => {
      // Setup
      document.body.innerHTML = `
        <p id="target">Replace me</p>
        <div id="replacement" style="display:none">Replacement</div>
      `

      // Test
      $('#target').replaceWith($('#replacement'))

      // Assert
      expect(document.getElementById('target')).toBeNull()
      expect(document.getElementById('replacement')).not.toBeNull()
      expect(document.getElementById('replacement')?.style.display).toBe('none')
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="item" data-index="0">Item 0</p>
          <p class="item" data-index="1">Item 1</p>
        </div>
      `

      // Test
      $('.item').replaceWith(function (index) {
        return `<span class="new-item">Replaced item ${index}</span>`
      })

      // Assert
      expect(document.querySelectorAll('.item').length).toBe(0)
      const newItems = document.querySelectorAll('.new-item')
      expect(newItems.length).toBe(2)
      expect(newItems[0]?.textContent).toBe('Replaced item 0')
      expect(newItems[1]?.textContent).toBe('Replaced item 1')
    })

    it('should return the removed elements', () => {
      // Setup
      document.body.innerHTML = `
        <p class="target">Item 1</p>
        <p class="target">Item 2</p>
      `

      // Test
      const removed = $('.target').replaceWith('<span>Replacement</span>')

      // Assert
      expect(removed).toHaveProperty('length', 2)
      expect(removed[0]?.textContent).toBe('Item 1')
      expect(removed[1]?.textContent).toBe('Item 2')
      // Elements should be detached from DOM
      expect(removed[0]?.parentNode).toBeNull()
      expect(removed[1]?.parentNode).toBeNull()
    })

    it('should handle empty collection', () => {
      // Test
      const result = $('.non-existent').replaceWith('<span>Test</span>')

      // Assert
      expect(result).toHaveProperty('length', 0)
      expect(document.querySelectorAll('span').length).toBe(0)
    })

    it('should maintain correct order when replacing multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="replace">First</p>
          <span>Middle</span>
          <p class="replace">Last</p>
        </div>
      `

      // Test
      $('.replace').replaceWith(function (index) {
        return `<div class="new">Replaced ${index}</div>`
      })

      // Assert
      const container = document.querySelector('div')
      const children = Array.from(container?.children || [])
      expect(children.length).toBe(3)
      expect(children[0]?.textContent).toBe('Replaced 0')
      expect(children[1]?.tagName).toBe('SPAN')
      expect(children[2]?.textContent).toBe('Replaced 1')
    })
  })

  describe('.replaceAll()', () => {
    it('should replace all target elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <p class="target">Target 2</p>
        </div>
      `

      // Test
      $('<span class="replacement">New content</span>').replaceAll('.target')

      // Assert
      expect(document.querySelectorAll('.target').length).toBe(0)
      expect(document.querySelectorAll('.replacement').length).toBe(2)
      const replacements = document.querySelectorAll('.replacement')
      replacements.forEach((el) => {
        expect(el.textContent).toBe('New content')
      })
    })

    it('should work with selector string', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p id="old">Old content</p>
        </div>
      `

      // Test
      $('<div id="new">New content</div>').replaceAll('#old')

      // Assert
      expect(document.getElementById('old')).toBeNull()
      expect(document.getElementById('new')).not.toBeNull()
      expect(document.getElementById('new')?.textContent).toBe('New content')
    })

    it('should work with element', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p id="target">Replace me</p>
        </div>
      `
      const target = document.getElementById('target')

      // Test
      $('<span>Replacement</span>').replaceAll(target!)

      // Assert
      expect(document.getElementById('target')).toBeNull()
      expect(document.querySelector('#container span')).not.toBeNull()
      expect(document.querySelector('#container span')?.textContent).toBe(
        'Replacement',
      )
    })

    it('should work with jQuery object', () => {
      // Setup
      document.body.innerHTML = `
        <ul>
          <li class="old">Item 1</li>
          <li class="old">Item 2</li>
        </ul>
      `

      // Test
      $('<li class="new">New item</li>').replaceAll($('.old'))

      // Assert
      expect(document.querySelectorAll('.old').length).toBe(0)
      expect(document.querySelectorAll('.new').length).toBe(2)
    })

    it('should return the replacement elements', () => {
      // Setup
      document.body.innerHTML = `
        <p class="target">Target 1</p>
        <p class="target">Target 2</p>
      `

      // Test
      const result = $('<span class="new">Replacement</span>').replaceAll(
        '.target',
      )

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.className).toBe('new')
      expect(result[1]?.className).toBe('new')
      // Should be in the DOM
      expect(result[0]?.parentNode).not.toBeNull()
      expect(result[1]?.parentNode).not.toBeNull()
    })

    it('should handle empty targets', () => {
      // Test
      const result = $('<span>Test</span>').replaceAll('.non-existent')

      // Assert
      expect(result).toHaveProperty('length', 0)
      expect(document.querySelectorAll('span').length).toBe(0)
    })

    it('should clone elements when replacing multiple targets', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <p class="target">Target 2</p>
        </div>
      `

      // Create element with specific attribute
      const $replacement = $('<span data-test="unique">Replacement</span>')

      // Test
      $replacement.replaceAll('.target')

      // Assert
      const replacements = document.querySelectorAll('span[data-test="unique"]')
      expect(replacements.length).toBe(2)
      // Check they are different instances
      expect(replacements[0]).not.toBe(replacements[1])
    })

    it('should move existing elements when replacing single target', () => {
      // Setup
      document.body.innerHTML = `
        <div id="source">
          <span id="mover">Move me</span>
        </div>
        <div id="target">
          <p id="replace">Replace this</p>
        </div>
      `

      // Test
      $('#mover').replaceAll('#replace')

      // Assert
      expect(document.querySelector('#source #mover')).toBeNull()
      expect(document.querySelector('#target #mover')).not.toBeNull()
      expect(document.getElementById('replace')).toBeNull()
    })

    it('should maintain document order', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <span>Keep 1</span>
          <p class="target">Target 1</p>
          <span>Keep 2</span>
          <p class="target">Target 2</p>
          <span>Keep 3</span>
        </div>
      `

      // Test
      $('<b>Bold</b>').replaceAll('.target')

      // Assert
      const container = document.querySelector('div')
      const children = Array.from(container?.children || [])
      expect(children.length).toBe(5)
      expect(children[0]?.tagName).toBe('SPAN')
      expect(children[1]?.tagName).toBe('B')
      expect(children[2]?.tagName).toBe('SPAN')
      expect(children[3]?.tagName).toBe('B')
      expect(children[4]?.tagName).toBe('SPAN')
    })
  })
})
