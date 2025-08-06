/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery Class Manipulation Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.hasClass()', () => {
    it('should return true if element has the class', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar baz"></div>'

      // Test & Assert
      expect($('#test').hasClass('foo')).toBe(true)
      expect($('#test').hasClass('bar')).toBe(true)
      expect($('#test').hasClass('baz')).toBe(true)
    })

    it('should return false if element does not have the class', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar"></div>'

      // Test & Assert
      expect($('#test').hasClass('baz')).toBe(false)
      expect($('#test').hasClass('missing')).toBe(false)
    })

    it('should return false for empty class name', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar"></div>'

      // Test & Assert
      expect($('#test').hasClass('')).toBe(false)
      expect($('#test').hasClass(' ')).toBe(false)
    })

    it('should handle element with no class attribute', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test & Assert
      expect($('#test').hasClass('foo')).toBe(false)
    })

    it('should check first element in collection', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item active">First</div>
        <div class="item">Second</div>
      `

      // Test & Assert
      expect($('.item').hasClass('active')).toBe(true)
    })

    it('should return false for empty collection', () => {
      // Test & Assert
      expect($('.non-existent').hasClass('foo')).toBe(false)
    })

    it('should handle multiple classes in className', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" class="  foo   bar  baz  "></div>'

      // Test & Assert
      expect($('#test').hasClass('foo')).toBe(true)
      expect($('#test').hasClass('bar')).toBe(true)
      expect($('#test').hasClass('baz')).toBe(true)
    })
  })

  describe('.addClass()', () => {
    it('should add single class to element', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').addClass('new-class')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('new-class')
    })

    it('should add class to existing classes', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').addClass('new-class')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing new-class')
    })

    it('should add multiple classes (space-separated)', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').addClass('class1 class2 class3')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('class1 class2 class3')
    })

    it('should not add duplicate classes', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').addClass('existing new-class')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing new-class')
    })

    it('should add classes to multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      $('.item').addClass('active')

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item active')
      expect(items[1]?.className).toBe('item active')
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').addClass(function (index, currentClass) {
        return `index-${index} ${currentClass}-modified`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item index-0 item-modified')
      expect(items[1]?.className).toBe('item index-1 item-modified')
    })

    it('should handle empty string gracefully', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').addClass('')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').addClass('new-class')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test - should not throw
      const result = $('.non-existent').addClass('test')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.removeClass()', () => {
    it('should remove single class from element', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar baz"></div>'

      // Test
      $('#test').removeClass('bar')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('foo baz')
    })

    it('should remove multiple classes (space-separated)', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar baz qux"></div>'

      // Test
      $('#test').removeClass('bar qux')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('foo baz')
    })

    it('should remove all classes if no parameter provided', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar baz"></div>'

      // Test
      $('#test').removeClass()

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('')
    })

    it('should handle non-existent class gracefully', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar"></div>'

      // Test
      $('#test').removeClass('baz')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('foo bar')
    })

    it('should remove classes from multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item active">Item 1</div>
        <div class="item active">Item 2</div>
      `

      // Test
      $('.item').removeClass('active')

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item')
      expect(items[1]?.className).toBe('item')
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item active-0">Item 0</div>
        <div class="item active-1">Item 1</div>
      `

      // Test
      $('.item').removeClass(function (index, _currentClass) {
        return `active-${index}`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item')
      expect(items[1]?.className).toBe('item')
    })

    it('should handle element with no class attribute', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').removeClass('foo')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo"></div>'

      // Test
      const result = $('#test').removeClass('foo')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test - should not throw
      const result = $('.non-existent').removeClass('test')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.toggleClass()', () => {
    it('should add class if not present', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').toggleClass('new-class')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing new-class')
    })

    it('should remove class if present', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" class="existing toggle-me"></div>'

      // Test
      $('#test').toggleClass('toggle-me')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing')
    })

    it('should toggle multiple classes (space-separated)', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="foo bar"></div>'

      // Test - toggle bar (remove) and baz (add)
      $('#test').toggleClass('bar baz')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('foo baz')
    })

    it('should force add class when switch is true', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" class="existing toggle-me"></div>'

      // Test
      $('#test').toggleClass('toggle-me', true)

      // Assert - should still have the class
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing toggle-me')
    })

    it('should force remove class when switch is false', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').toggleClass('new-class', false)

      // Assert - should not add the class
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing')
    })

    it('should toggle classes on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item active">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      $('.item').toggleClass('active')

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item') // removed
      expect(items[1]?.className).toBe('item active') // added
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item special">Item 1</div>
      `

      // Test
      $('.item').toggleClass(function (index, _currentClass) {
        return index === 0 ? 'first' : 'special'
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item first') // added
      expect(items[1]?.className).toBe('item') // removed
    })

    it('should accept function parameter with switch', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 0</div>
        <div class="item">Item 1</div>
      `

      // Test
      $('.item').toggleClass(function (index) {
        return `item-${index}`
      }, true) // force add

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.className).toBe('item item-0')
      expect(items[1]?.className).toBe('item item-1')
    })

    it('should handle empty string gracefully', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="existing"></div>'

      // Test
      $('#test').toggleClass('')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').toggleClass('new-class')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test - should not throw
      const result = $('.non-existent').toggleClass('test')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('class manipulation edge cases', () => {
    it('should handle classes with special characters', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').addClass('my-class_name my.class')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('my-class_name my.class')
      expect($('#test').hasClass('my-class_name')).toBe(true)
      expect($('#test').hasClass('my.class')).toBe(true)
    })

    it('should normalize whitespace in class names', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').addClass('  class1   class2  class3  ')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('class1 class2 class3')
    })

    it('should handle class operations on elements with existing whitespace', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" class="  existing1   existing2  "></div>'

      // Test
      $('#test').addClass('new-class')
      $('#test').removeClass('existing1')

      // Assert
      const element = document.getElementById('test')
      expect(element?.className).toBe('existing2 new-class')
    })
  })
})
