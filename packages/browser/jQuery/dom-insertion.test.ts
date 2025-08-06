/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery DOM Insertion Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.append()', () => {
    it('should append HTML string to elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Original</div>'

      // Test
      $('#container').append('<span>Appended</span>')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        'Original<span>Appended</span>',
      )
    })

    it('should append element to elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Original</div>'
      const span = document.createElement('span')
      span.textContent = 'Appended'

      // Test
      $('#container').append(span)

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        'Original<span>Appended</span>',
      )
    })

    it('should append to multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="target">Div 1</div>
        <div class="target">Div 2</div>
      `

      // Test
      $('.target').append('<strong>!</strong>')

      // Assert
      const divs = document.querySelectorAll('.target')
      expect(divs[0]?.innerHTML).toBe('Div 1<strong>!</strong>')
      expect(divs[1]?.innerHTML).toBe('Div 2<strong>!</strong>')
    })

    it('should append jQuery object', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">Original</div>
        <span id="toAppend">Content</span>
      `

      // Test
      $('#container').append($('#toAppend'))

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        'Original<span id="toAppend">Content</span>',
      )
      // Original element should be moved, not in original location
      expect(document.body.querySelectorAll('#toAppend').length).toBe(1)
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').append(function (index) {
        return `<span> - Index ${index}</span>`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.innerHTML).toBe('Item 0<span> - Index 0</span>')
      expect(items[1]?.innerHTML).toBe('Item 1<span> - Index 1</span>')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').append('<span>Content</span>')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })
  })

  describe('.prepend()', () => {
    it('should prepend HTML string to elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Original</div>'

      // Test
      $('#container').prepend('<span>Prepended</span>')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        '<span>Prepended</span>Original',
      )
    })

    it('should prepend element to elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Original</div>'
      const span = document.createElement('span')
      span.textContent = 'Prepended'

      // Test
      $('#container').prepend(span)

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        '<span>Prepended</span>Original',
      )
    })

    it('should prepend to multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="target">Div 1</div>
        <div class="target">Div 2</div>
      `

      // Test
      $('.target').prepend('<strong>!</strong>')

      // Assert
      const divs = document.querySelectorAll('.target')
      expect(divs[0]?.innerHTML).toBe('<strong>!</strong>Div 1')
      expect(divs[1]?.innerHTML).toBe('<strong>!</strong>Div 2')
    })

    it('should prepend jQuery object', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">Original</div>
        <span id="toPrepend">Content</span>
      `

      // Test
      $('#container').prepend($('#toPrepend'))

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        '<span id="toPrepend">Content</span>Original',
      )
      // Original element should be moved
      expect(document.body.querySelectorAll('#toPrepend').length).toBe(1)
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').prepend(function (index) {
        return `<span>Index ${index} - </span>`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.innerHTML).toBe('<span>Index 0 - </span>Item 0')
      expect(items[1]?.innerHTML).toBe('<span>Index 1 - </span>Item 1')
    })
  })

  describe('.before()', () => {
    it('should insert HTML before elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      $('#target').before('<span>Before</span>')

      // Assert
      expect(document.body.innerHTML).toBe(
        '<span>Before</span><div id="target">Target</div>',
      )
    })

    it('should insert element before elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'
      const span = document.createElement('span')
      span.textContent = 'Before'

      // Test
      $('#target').before(span)

      // Assert
      expect(document.body.innerHTML).toBe(
        '<span>Before</span><div id="target">Target</div>',
      )
    })

    it('should insert before multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Paragraph 1</p>
          <p class="target">Paragraph 2</p>
        </div>
      `

      // Test
      $('.target').before('<span>Before</span>')

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<span>Before</span><p class="target">Paragraph 1</p>\n          <span>Before</span><p class="target">Paragraph 2</p>',
      )
    })

    it('should insert jQuery object before element', () => {
      // Setup
      document.body.innerHTML = `
        <div id="target">Target</div>
        <span id="toInsert">Insert me</span>
      `

      // Test
      $('#target').before($('#toInsert'))

      // Assert
      expect(document.body.innerHTML.trim()).toBe(
        '<span id="toInsert">Insert me</span><div id="target">Target</div>',
      )
      // Original element should be moved
      expect(document.querySelectorAll('#toInsert').length).toBe(1)
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="item">Item 0</p>
          <p class="item">Item 1</p>
        </div>
      `

      // Test
      $('.item').before(function (index) {
        return `<span>Index ${index}</span>`
      })

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<span>Index 0</span><p class="item">Item 0</p>\n          <span>Index 1</span><p class="item">Item 1</p>',
      )
    })
  })

  describe('.after()', () => {
    it('should insert HTML after elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      $('#target').after('<span>After</span>')

      // Assert
      expect(document.body.innerHTML).toBe(
        '<div id="target">Target</div><span>After</span>',
      )
    })

    it('should insert element after elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'
      const span = document.createElement('span')
      span.textContent = 'After'

      // Test
      $('#target').after(span)

      // Assert
      expect(document.body.innerHTML).toBe(
        '<div id="target">Target</div><span>After</span>',
      )
    })

    it('should insert after multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Paragraph 1</p>
          <p class="target">Paragraph 2</p>
        </div>
      `

      // Test
      $('.target').after('<span>After</span>')

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<p class="target">Paragraph 1</p><span>After</span>\n          <p class="target">Paragraph 2</p><span>After</span>',
      )
    })

    it('should insert jQuery object after element', () => {
      // Setup
      document.body.innerHTML = `
        <div id="target">Target</div>
        <span id="toInsert">Insert me</span>
      `

      // Test
      $('#target').after($('#toInsert'))

      // Assert
      expect(document.body.innerHTML.trim()).toBe(
        '<div id="target">Target</div><span id="toInsert">Insert me</span>',
      )
      // Original element should be moved
      expect(document.querySelectorAll('#toInsert').length).toBe(1)
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="item">Item 0</p>
          <p class="item">Item 1</p>
        </div>
      `

      // Test
      $('.item').after(function (index) {
        return `<span>Index ${index}</span>`
      })

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<p class="item">Item 0</p><span>Index 0</span>\n          <p class="item">Item 1</p><span>Index 1</span>',
      )
    })
  })

  describe('.appendTo()', () => {
    it('should append elements to target', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">Container</div>
        <span id="toAppend">Content</span>
      `

      // Test
      $('#toAppend').appendTo('#container')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        'Container<span id="toAppend">Content</span>',
      )
      // Element should be moved
      expect(document.body.querySelectorAll('#toAppend').length).toBe(1)
    })

    it('should append newly created elements to target', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Container</div>'

      // Test
      $('<span>New content</span>').appendTo('#container')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        'Container<span>New content</span>',
      )
    })

    it('should append to multiple targets', () => {
      // Setup
      document.body.innerHTML = `
        <div class="container">Container 1</div>
        <div class="container">Container 2</div>
      `

      // Test
      $('<span>Content</span>').appendTo('.container')

      // Assert
      const containers = document.querySelectorAll('.container')
      expect(containers[0]?.innerHTML).toBe('Container 1<span>Content</span>')
      expect(containers[1]?.innerHTML).toBe('Container 2<span>Content</span>')
    })

    it('should return the appended elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container"></div>'

      // Test
      const result = $('<span id="new">Content</span>').appendTo('#container')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('new'))
    })
  })

  describe('.prependTo()', () => {
    it('should prepend elements to target', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">Container</div>
        <span id="toPrepend">Content</span>
      `

      // Test
      $('#toPrepend').prependTo('#container')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        '<span id="toPrepend">Content</span>Container',
      )
      // Element should be moved
      expect(document.body.querySelectorAll('#toPrepend').length).toBe(1)
    })

    it('should prepend newly created elements to target', () => {
      // Setup
      document.body.innerHTML = '<div id="container">Container</div>'

      // Test
      $('<span>New content</span>').prependTo('#container')

      // Assert
      expect(document.getElementById('container')?.innerHTML).toBe(
        '<span>New content</span>Container',
      )
    })

    it('should prepend to multiple targets', () => {
      // Setup
      document.body.innerHTML = `
        <div class="container">Container 1</div>
        <div class="container">Container 2</div>
      `

      // Test
      $('<span>Content</span>').prependTo('.container')

      // Assert
      const containers = document.querySelectorAll('.container')
      expect(containers[0]?.innerHTML).toBe('<span>Content</span>Container 1')
      expect(containers[1]?.innerHTML).toBe('<span>Content</span>Container 2')
    })

    it('should return the prepended elements', () => {
      // Setup
      document.body.innerHTML = '<div id="container"></div>'

      // Test
      const result = $('<span id="new">Content</span>').prependTo('#container')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('new'))
    })
  })

  describe('.insertBefore()', () => {
    it('should insert elements before target', () => {
      // Setup
      document.body.innerHTML = `
        <div id="target">Target</div>
        <span id="toInsert">Insert me</span>
      `

      // Test
      $('#toInsert').insertBefore('#target')

      // Assert
      expect(document.body.innerHTML.trim()).toBe(
        '<span id="toInsert">Insert me</span><div id="target">Target</div>',
      )
      // Element should be moved
      expect(document.querySelectorAll('#toInsert').length).toBe(1)
    })

    it('should insert newly created elements before target', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      $('<span>New content</span>').insertBefore('#target')

      // Assert
      expect(document.body.innerHTML).toBe(
        '<span>New content</span><div id="target">Target</div>',
      )
    })

    it('should insert before multiple targets', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <p class="target">Target 2</p>
        </div>
      `

      // Test
      $('<span>Content</span>').insertBefore('.target')

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<span>Content</span><p class="target">Target 1</p>\n          <span>Content</span><p class="target">Target 2</p>',
      )
    })

    it('should return the inserted elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      const result = $('<span id="new">Content</span>').insertBefore('#target')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('new'))
    })
  })

  describe('.insertAfter()', () => {
    it('should insert elements after target', () => {
      // Setup
      document.body.innerHTML = `
        <div id="target">Target</div>
        <span id="toInsert">Insert me</span>
      `

      // Test
      $('#toInsert').insertAfter('#target')

      // Assert
      expect(document.body.innerHTML.trim()).toBe(
        '<div id="target">Target</div><span id="toInsert">Insert me</span>',
      )
      // Element should be moved
      expect(document.querySelectorAll('#toInsert').length).toBe(1)
    })

    it('should insert newly created elements after target', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      $('<span>New content</span>').insertAfter('#target')

      // Assert
      expect(document.body.innerHTML).toBe(
        '<div id="target">Target</div><span>New content</span>',
      )
    })

    it('should insert after multiple targets', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <p class="target">Target 2</p>
        </div>
      `

      // Test
      $('<span>Content</span>').insertAfter('.target')

      // Assert
      const container = document.querySelector('div')
      expect(container?.innerHTML.trim()).toBe(
        '<p class="target">Target 1</p><span>Content</span>\n          <p class="target">Target 2</p><span>Content</span>',
      )
    })

    it('should return the inserted elements', () => {
      // Setup
      document.body.innerHTML = '<div id="target">Target</div>'

      // Test
      const result = $('<span id="new">Content</span>').insertAfter('#target')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('new'))
    })
  })
})
