/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery Attribute Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.attr()', () => {
    it('should get attribute value', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" title="Hello" data-value="123"></div>'

      // Test
      expect($('#test').attr('id')).toBe('test')
      expect($('#test').attr('title')).toBe('Hello')
      expect($('#test').attr('data-value')).toBe('123')
    })

    it('should return undefined for non-existent attribute', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      expect($('#test').attr('title')).toBeUndefined()
      expect($('#test').attr('data-missing')).toBeUndefined()
    })

    it('should get attribute from first element only', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" title="First"></div>
        <div class="item" title="Second"></div>
      `

      // Test
      expect($('.item').attr('title')).toBe('First')
    })

    it('should set attribute value', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').attr('title', 'New Title')

      // Assert
      expect(document.getElementById('test')?.getAttribute('title')).toBe(
        'New Title',
      )
    })

    it('should set attributes on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item"></div>
        <div class="item"></div>
      `

      // Test
      $('.item').attr('data-index', 'value')

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.getAttribute('data-index')).toBe('value')
      expect(items[1]?.getAttribute('data-index')).toBe('value')
    })

    it('should set multiple attributes with object', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      $('#test').attr({
        title: 'Test Title',
        'data-value': '123',
        'aria-label': 'Test Label',
      })

      // Assert
      const element = document.getElementById('test')
      expect(element?.getAttribute('title')).toBe('Test Title')
      expect(element?.getAttribute('data-value')).toBe('123')
      expect(element?.getAttribute('aria-label')).toBe('Test Label')
    })

    it('should accept function for attribute value', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" data-index="0"></div>
        <div class="item" data-index="1"></div>
      `

      // Test
      $('.item').attr('title', function (index, oldValue) {
        return `Item ${index} - ${oldValue || 'no value'}`
      })

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.getAttribute('title')).toBe('Item 0 - no value')
      expect(items[1]?.getAttribute('title')).toBe('Item 1 - no value')
    })

    it('should handle boolean attributes correctly', () => {
      // Setup
      document.body.innerHTML = '<input id="test" />'

      // Test - setting boolean attributes
      $('#test').attr('disabled', 'disabled')
      $('#test').attr('readonly', true as any)

      // Assert
      const input = document.getElementById('test') as HTMLInputElement
      expect(input.hasAttribute('disabled')).toBe(true)
      expect(input.hasAttribute('readonly')).toBe(true)
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').attr('title', 'Test')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test getting
      expect($('.non-existent').attr('title')).toBeUndefined()

      // Test setting - should not throw
      const result = $('.non-existent').attr('title', 'Test')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.removeAttr()', () => {
    it('should remove single attribute', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" title="Hello" data-value="123"></div>'

      // Test
      $('#test').removeAttr('title')

      // Assert
      const element = document.getElementById('test')
      expect(element?.hasAttribute('title')).toBe(false)
      expect(element?.hasAttribute('data-value')).toBe(true)
    })

    it('should remove multiple attributes (space-separated)', () => {
      // Setup
      document.body.innerHTML =
        '<div id="test" title="Hello" data-value="123" aria-label="Test"></div>'

      // Test
      $('#test').removeAttr('title data-value')

      // Assert
      const element = document.getElementById('test')
      expect(element?.hasAttribute('title')).toBe(false)
      expect(element?.hasAttribute('data-value')).toBe(false)
      expect(element?.hasAttribute('aria-label')).toBe(true)
    })

    it('should remove attributes from multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item" title="Item 1"></div>
        <div class="item" title="Item 2"></div>
      `

      // Test
      $('.item').removeAttr('title')

      // Assert
      const items = document.querySelectorAll('.item')
      expect(items[0]?.hasAttribute('title')).toBe(false)
      expect(items[1]?.hasAttribute('title')).toBe(false)
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test" title="Hello"></div>'

      // Test
      const result = $('#test').removeAttr('title')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test - should not throw
      const result = $('.non-existent').removeAttr('title')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.prop()', () => {
    it('should get property value', () => {
      // Setup
      document.body.innerHTML =
        '<input type="checkbox" id="checkbox" checked />'

      // Test
      expect($('#checkbox').prop('checked')).toBe(true)
      expect($('#checkbox').prop('type')).toBe('checkbox')
    })

    it('should get property from first element only', () => {
      // Setup
      document.body.innerHTML = `
        <input type="checkbox" class="check" checked />
        <input type="checkbox" class="check" />
      `

      // Test
      expect($('.check').prop('checked')).toBe(true)
    })

    it('should set property value', () => {
      // Setup
      document.body.innerHTML = '<input type="checkbox" id="checkbox" />'

      // Test
      $('#checkbox').prop('checked', true)

      // Assert
      const checkbox = document.getElementById('checkbox') as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('should set properties on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <input type="checkbox" class="check" />
        <input type="checkbox" class="check" />
      `

      // Test
      $('.check').prop('checked', true)

      // Assert
      const checkboxes = document.querySelectorAll(
        '.check',
      ) as NodeListOf<HTMLInputElement>
      expect(checkboxes[0]?.checked).toBe(true)
      expect(checkboxes[1]?.checked).toBe(true)
    })

    it('should set multiple properties with object', () => {
      // Setup
      document.body.innerHTML = '<input id="input" />'

      // Test
      $('#input').prop({
        disabled: true,
        readOnly: true,
        value: 'test',
      })

      // Assert
      const input = document.getElementById('input') as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(input.readOnly).toBe(true)
      expect(input.value).toBe('test')
    })

    it('should accept function for property value', () => {
      // Setup
      document.body.innerHTML = `
        <input class="input" value="old1" />
        <input class="input" value="old2" />
      `

      // Test
      $('.input').prop('value', function (index: number, oldValue: string) {
        return `new${index}-${oldValue}`
      })

      // Assert
      const inputs = document.querySelectorAll(
        '.input',
      ) as NodeListOf<HTMLInputElement>
      expect(inputs[0]?.value).toBe('new0-old1')
      expect(inputs[1]?.value).toBe('new1-old2')
    })

    it('should handle select element options', () => {
      // Setup
      document.body.innerHTML = `
        <select id="select">
          <option value="1">One</option>
          <option value="2" selected>Two</option>
        </select>
      `

      // Test
      expect($('#select').prop('selectedIndex')).toBe(1)

      // Change selection
      $('#select').prop('selectedIndex', 0)
      expect(
        (document.getElementById('select') as HTMLSelectElement).selectedIndex,
      ).toBe(0)
    })

    it('should return proper types for different properties', () => {
      // Setup
      document.body.innerHTML = `
        <input type="text" id="text" value="test" disabled />
        <div id="div" tabindex="5"></div>
      `

      // Test
      expect($('#text').prop('disabled')).toBe(true)
      expect($('#text').prop('value')).toBe('test')
      expect($('#div').prop('tabIndex')).toBe(5)
    })

    it('should return jQuery object for chaining when setting', () => {
      // Setup
      document.body.innerHTML = '<input id="test" />'

      // Test
      const result = $('#test').prop('disabled', true)

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test getting
      expect($('.non-existent').prop('checked')).toBeUndefined()

      // Test setting - should not throw
      const result = $('.non-existent').prop('checked', true)
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.removeProp()', () => {
    it('should remove custom properties', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'
      const element = document.getElementById('test') as any
      element.customProp = 'custom value'
      element.anotherProp = 123

      // Test
      $('#test').removeProp('customProp')

      // Assert
      expect(element.customProp).toBeUndefined()
      expect(element.anotherProp).toBe(123)
    })

    it('should not remove native properties', () => {
      // Setup
      document.body.innerHTML = '<div id="test" class="myclass"></div>'

      // Test - attempting to remove native property
      $('#test').removeProp('className')

      // Assert - native property should still exist
      const element = document.getElementById('test')
      expect(element?.className).toBe('myclass')
    })

    it('should remove properties from multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="item"></div>
        <div class="item"></div>
      `
      const items = document.querySelectorAll('.item') as any
      items[0].customProp = 'value1'
      items[1].customProp = 'value2'

      // Test
      $('.item').removeProp('customProp')

      // Assert
      expect(items[0].customProp).toBeUndefined()
      expect(items[1].customProp).toBeUndefined()
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"></div>'

      // Test
      const result = $('#test').removeProp('customProp')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('test'))
    })

    it('should handle empty collection', () => {
      // Test - should not throw
      const result = $('.non-existent').removeProp('customProp')
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('attr vs prop differences', () => {
    it('should handle checked attribute vs property correctly', () => {
      // Setup
      document.body.innerHTML =
        '<input type="checkbox" id="cb" checked="checked" />'
      const checkbox = document.getElementById('cb') as HTMLInputElement

      // Initially checked
      expect($('#cb').attr('checked')).toBe('checked')
      expect($('#cb').prop('checked')).toBe(true)

      // Uncheck programmatically
      checkbox.checked = false

      // attr still returns initial value, prop returns current state
      expect($('#cb').attr('checked')).toBe('checked')
      expect($('#cb').prop('checked')).toBe(false)
    })

    it('should handle value attribute vs property correctly', () => {
      // Setup
      document.body.innerHTML =
        '<input type="text" id="input" value="initial" />'
      const input = document.getElementById('input') as HTMLInputElement

      // Initial state
      expect($('#input').attr('value')).toBe('initial')
      expect($('#input').prop('value')).toBe('initial')

      // Change value programmatically
      input.value = 'changed'

      // attr returns initial, prop returns current
      expect($('#input').attr('value')).toBe('initial')
      expect($('#input').prop('value')).toBe('changed')
    })
  })
})
