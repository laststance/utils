/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery CSS and Style Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.css()', () => {
    it('should get CSS property value', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="color: red; font-size: 16px;"></div>'

      // Test - color can be returned as either 'red' or 'rgb(255, 0, 0)' depending on browser
      const color = $('#test').css('color')
      expect(color === 'red' || color === 'rgb(255, 0, 0)').toBe(true)
      expect($('#test').css('font-size')).toBe('16px')
    })

    it('should get computed CSS property value', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="width: 100px; height: 50px;"></div>'

      // Test
      expect($('#test').css('width')).toBe('100px')
      expect($('#test').css('height')).toBe('50px')
    })

    it('should return undefined for non-existent property', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test - custom properties should return empty string or undefined
      const result = $('#test').css('non-existent-property')
      expect(result === '' || result === undefined).toBe(true)
    })

    it('should get property from first element only', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" style="color: red;"></div>
        <div class="item" style="color: blue;"></div>
      `

      // Test - color can be returned as either 'red' or 'rgb(255, 0, 0)' depending on browser
      const color = $('.item').css('color')
      expect(color === 'red' || color === 'rgb(255, 0, 0)').toBe(true)
    })

    it('should set CSS property value', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').css('color', 'blue')

      // Assert
      const element = document.getElementById('test')
      expect(element?.style.color).toBe('blue')
    })

    it('should set CSS properties on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      $('.item').css('background-color', 'yellow')

      // Assert
      const items = document.querySelectorAll('.item')
      expect((items[0] as HTMLElement).style.backgroundColor).toBe('yellow')
      expect((items[1] as HTMLElement).style.backgroundColor).toBe('yellow')
    })

    it('should set multiple CSS properties with object', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').css({
        color: 'red',
        'font-size': '18px',
        backgroundColor: 'yellow',
      })

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.color).toBe('red')
      expect(element.style.fontSize).toBe('18px')
      expect(element.style.backgroundColor).toBe('yellow')
    })

    it('should handle both camelCase and kebab-case property names', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test - setting with kebab-case
      $('#test').css('background-color', 'red')
      expect(
        (document.getElementById('test') as HTMLElement).style.backgroundColor,
      ).toBe('red')

      // Test - setting with camelCase
      $('#test').css('backgroundColor', 'blue')
      expect(
        (document.getElementById('test') as HTMLElement).style.backgroundColor,
      ).toBe('blue')
    })

    it('should accept function for CSS value', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" style="width: 100px; height: 10px;">Item 1</div>
        <div class="item" style="width: 200px; height: 20px;">Item 2</div>
      `

      // Test
      $('.item').css('height', function (index, currentValue) {
        return (parseInt(currentValue, 10) || 50) + index * 10 + 'px'
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect((items[0] as HTMLElement).style.height).toBe('10px') // 10 + (0 * 10)
      expect((items[1] as HTMLElement).style.height).toBe('30px') // 20 + (1 * 10)
    })

    it('should add px unit for numeric values on appropriate properties', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').css('width', 100)
      $('#test').css('height', 50)
      $('#test').css('margin-top', 20)

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.width).toBe('100px')
      expect(element.style.height).toBe('50px')
      expect(element.style.marginTop).toBe('20px')
    })

    it('should not add px unit for unitless properties', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').css('z-index', 10)
      $('#test').css('opacity', 0.5)
      $('#test').css('font-weight', 700)

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.zIndex).toBe('10')
      expect(element.style.opacity).toBe('0.5')
      expect(element.style.fontWeight).toBe('700')
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').css('color', 'red')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test getting
      expect($('.non-existent').css('color')).toBeUndefined()

      // Test setting - should not throw
      const result = $('.non-existent').css('color', 'red')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.width()', () => {
    it('should get element width', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="width: 100px; padding: 10px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return content width only
      expect($('#test').width()).toBe(100)
    })

    it('should set element width', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').width(150)

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.width).toBe('150px')
    })

    it('should set width on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      $('.item').width(200)

      // Assert
      const items = document.querySelectorAll('.item')
      expect((items[0] as HTMLElement).style.width).toBe('200px')
      expect((items[1] as HTMLElement).style.width).toBe('200px')
    })

    it('should accept string values with units', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').width('50%')

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.width).toBe('50%')
    })

    it('should accept function parameter', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" style="width: 100px;">Item 1</div>
        <div class="item" style="width: 200px;">Item 2</div>
      `

      // Test
      $('.item').width(function (index, currentWidth) {
        return currentWidth + index * 50
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect((items[0] as HTMLElement).style.width).toBe('100px') // 100 + (0 * 50)
      expect((items[1] as HTMLElement).style.width).toBe('250px') // 200 + (1 * 50)
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').width(100)

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })
  })

  describe('.height()', () => {
    it('should get element height', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="height: 80px; padding: 10px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return content height only
      expect($('#test').height()).toBe(80)
    })

    it('should set element height', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').height(120)

      // Assert
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.height).toBe('120px')
    })

    it('should set height on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
      `

      // Test
      $('.item').height(150)

      // Assert
      const items = document.querySelectorAll('.item')
      expect((items[0] as HTMLElement).style.height).toBe('150px')
      expect((items[1] as HTMLElement).style.height).toBe('150px')
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').height(100)

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })
  })

  describe('.innerWidth()', () => {
    it('should get element inner width (including padding)', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="width: 100px; padding: 10px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return width + padding
      expect($('#test').innerWidth()).toBe(120) // 100 + 10 + 10
    })

    it('should set element inner width', () => {
      // Setup
      document.body.innerHTML = '<div id="test" style="padding: 5px;"></div>'

      // Test
      $('#test').innerWidth(150)

      // Assert - should set width to (150 - padding)
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.width).toBe('140px') // 150 - 5 - 5
    })
  })

  describe('.innerHeight()', () => {
    it('should get element inner height (including padding)', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="height: 80px; padding: 15px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return height + padding
      expect($('#test').innerHeight()).toBe(110) // 80 + 15 + 15
    })

    it('should set element inner height', () => {
      // Setup
      document.body.innerHTML = '<div id="test" style="padding: 10px;"></div>'

      // Test
      $('#test').innerHeight(120)

      // Assert - should set height to (120 - padding)
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.height).toBe('100px') // 120 - 10 - 10
    })
  })

  describe('.outerWidth()', () => {
    it('should get element outer width (including padding and border)', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="width: 100px; padding: 10px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return width + padding + border
      expect($('#test').outerWidth()).toBe(124) // 100 + 10 + 10 + 2 + 2
    })

    it('should get element outer width including margin when includeMargin is true', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="width: 100px; padding: 10px; border: 2px solid red; margin: 5px;"></div>'

      // Test - should return width + padding + border + margin
      expect($('#test').outerWidth(true)).toBe(134) // 100 + 10 + 10 + 2 + 2 + 5 + 5
    })

    it('should set element outer width', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="padding: 5px; border: 1px solid red;"></div>'

      // Test
      $('#test').outerWidth(150)

      // Assert - should set width to (150 - padding - border)
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.width).toBe('138px') // 150 - 5 - 5 - 1 - 1
    })
  })

  describe('.outerHeight()', () => {
    it('should get element outer height (including padding and border)', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="height: 80px; padding: 15px; border: 3px solid red; margin: 5px;"></div>'

      // Test - should return height + padding + border
      expect($('#test').outerHeight()).toBe(116) // 80 + 15 + 15 + 3 + 3
    })

    it('should get element outer height including margin when includeMargin is true', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="height: 80px; padding: 15px; border: 3px solid red; margin: 5px;"></div>'

      // Test - should return height + padding + border + margin
      expect($('#test').outerHeight(true)).toBe(126) // 80 + 15 + 15 + 3 + 3 + 5 + 5
    })

    it('should set element outer height', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" style="padding: 8px; border: 2px solid red;"></div>'

      // Test
      $('#test').outerHeight(120)

      // Assert - should set height to (120 - padding - border)
      const element = document.getElementById('test') as HTMLElement
      expect(element.style.height).toBe('100px') // 120 - 8 - 8 - 2 - 2
    })
  })
})
