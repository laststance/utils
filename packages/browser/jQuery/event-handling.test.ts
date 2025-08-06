/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach, vi } from 'vitest'
import './core.js'

describe('jQuery Event Handling Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.on()', () => {
    it('should attach basic event handler', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)

      // Trigger event
      const button = document.getElementById('btn')!
      button.click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should attach event handler with data', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()
      const testData = { foo: 'bar', num: 42 }

      // Test
      $('#btn').on('click', testData, handler)

      // Trigger event
      const button = document.getElementById('btn')!
      button.click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const eventArg = handler.mock.calls[0]?.[0]
      expect(eventArg.data).toEqual(testData)
    })

    it('should support event delegation with selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">Button 1</button>
          <button class="btn">Button 2</button>
        </div>
      `
      const handler = vi.fn()

      // Test - delegate to .btn elements within #container
      $('#container').on('click', '.btn', handler)

      // Trigger events on both buttons
      const buttons = document.querySelectorAll('.btn')
      ;(buttons[0] as HTMLElement).click()
      ;(buttons[1] as HTMLElement).click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should support event delegation with data and selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">Button 1</button>
        </div>
      `
      const handler = vi.fn()
      const testData = { delegated: true }

      // Test
      $('#container').on('click', '.btn', testData, handler)

      // Trigger event
      const button = document.querySelector('.btn') as HTMLElement
      button.click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const eventArg = handler.mock.calls[0]?.[0]
      expect(eventArg.data).toEqual(testData)
    })

    it('should support multiple events with space-separated string', () => {
      // Setup
      document.body.innerHTML = '<input id="input" type="text" />'
      const handler = vi.fn()

      // Test
      $('#input').on('focus blur', handler)

      // Trigger events
      const input = document.getElementById('input')!
      input.focus()
      input.blur()

      // Assert
      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should support events object map', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const clickHandler = vi.fn()
      const mouseoverHandler = vi.fn()

      // Test
      $('#btn').on({
        click: clickHandler,
        mouseover: mouseoverHandler,
      })

      // Trigger events
      const button = document.getElementById('btn')!
      button.click()
      button.dispatchEvent(new MouseEvent('mouseover'))

      // Assert
      expect(clickHandler).toHaveBeenCalledTimes(1)
      expect(mouseoverHandler).toHaveBeenCalledTimes(1)
    })

    it('should support events object map with selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">Button</button>
        </div>
      `
      const clickHandler = vi.fn()
      const mouseoverHandler = vi.fn()

      // Test
      $('#container').on(
        {
          click: clickHandler,
          mouseover: mouseoverHandler,
        },
        '.btn',
      )

      // Trigger events
      const button = document.querySelector('.btn') as HTMLElement
      button.click()
      button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

      // Assert
      expect(clickHandler).toHaveBeenCalledTimes(1)
      expect(mouseoverHandler).toHaveBeenCalledTimes(1)
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <button class="btn">Button 1</button>
        <button class="btn">Button 2</button>
      `
      const handler = vi.fn()

      // Test
      $('.btn').on('click', handler)

      // Trigger events
      const buttons = document.querySelectorAll('.btn')
      ;(buttons[0] as HTMLElement).click()
      ;(buttons[1] as HTMLElement).click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'

      // Test
      const result = $('#btn').on('click', () => {})

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('btn'))
    })

    it('should handle dynamically added elements with delegation', () => {
      // Setup
      document.body.innerHTML = '<div id="container"></div>'
      const handler = vi.fn()

      // Test - set up delegation first
      $('#container').on('click', '.dynamic-btn', handler)

      // Add element dynamically
      $('#container').append(
        '<button class="dynamic-btn">Dynamic Button</button>',
      )

      // Trigger event on dynamically added element
      const dynamicButton = document.querySelector(
        '.dynamic-btn',
      ) as HTMLElement
      dynamicButton.click()

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('.off()', () => {
    it('should remove specific event handler', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      // Test
      $('#btn').on('click', handler1)
      $('#btn').on('click', handler2)
      $('#btn').off('click', handler1)

      // Trigger event
      const button = document.getElementById('btn')!
      button.click()

      // Assert - only handler2 should be called
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should remove all handlers for specific event type', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const clickHandler1 = vi.fn()
      const clickHandler2 = vi.fn()
      const mouseoverHandler = vi.fn()

      // Test
      $('#btn').on('click', clickHandler1)
      $('#btn').on('click', clickHandler2)
      $('#btn').on('mouseover', mouseoverHandler)
      $('#btn').off('click')

      // Trigger events
      const button = document.getElementById('btn')!
      button.click()
      button.dispatchEvent(new MouseEvent('mouseover'))

      // Assert - click handlers removed, mouseover handler remains
      expect(clickHandler1).not.toHaveBeenCalled()
      expect(clickHandler2).not.toHaveBeenCalled()
      expect(mouseoverHandler).toHaveBeenCalledTimes(1)
    })

    it('should remove all event handlers when called without arguments', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const clickHandler = vi.fn()
      const mouseoverHandler = vi.fn()

      // Test
      $('#btn').on('click', clickHandler)
      $('#btn').on('mouseover', mouseoverHandler)
      $('#btn').off()

      // Trigger events
      const button = document.getElementById('btn')!
      button.click()
      button.dispatchEvent(new MouseEvent('mouseover'))

      // Assert - all handlers removed
      expect(clickHandler).not.toHaveBeenCalled()
      expect(mouseoverHandler).not.toHaveBeenCalled()
    })

    it('should remove delegated event handlers with selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">Button</button>
        </div>
      `
      const handler = vi.fn()

      // Test
      $('#container').on('click', '.btn', handler)
      $('#container').off('click', '.btn')

      // Trigger event
      const button = document.querySelector('.btn') as HTMLElement
      button.click()

      // Assert
      expect(handler).not.toHaveBeenCalled()
    })

    it('should remove multiple event types with space-separated string', () => {
      // Setup
      document.body.innerHTML = '<input id="input" type="text" />'
      const handler = vi.fn()

      // Test
      $('#input').on('focus blur', handler)
      $('#input').off('focus blur')

      // Trigger events
      const input = document.getElementById('input')!
      input.focus()
      input.blur()

      // Assert
      expect(handler).not.toHaveBeenCalled()
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <button class="btn">Button 1</button>
        <button class="btn">Button 2</button>
      `
      const handler = vi.fn()

      // Test
      $('.btn').on('click', handler)
      $('.btn').off('click')

      // Trigger events
      const buttons = document.querySelectorAll('.btn')
      ;(buttons[0] as HTMLElement).click()
      ;(buttons[1] as HTMLElement).click()

      // Assert
      expect(handler).not.toHaveBeenCalled()
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'

      // Test
      const result = $('#btn').off('click')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('btn'))
    })
  })

  describe('.trigger()', () => {
    it('should trigger event handlers', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)
      $('#btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should trigger event handlers with extra parameters', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)
      $('#btn').trigger('click', ['param1', 'param2'])

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const args = handler.mock.calls[0]
      expect(args?.[1]).toBe('param1')
      expect(args?.[2]).toBe('param2')
    })

    it('should trigger event handlers with single extra parameter', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)
      $('#btn').trigger('click', 'single-param')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const args = handler.mock.calls[0]
      expect(args?.[1]).toBe('single-param')
    })

    it('should trigger event object', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()
      const customEvent = new Event('customEvent')

      // Test
      $('#btn').on('customEvent', handler)
      $('#btn').trigger(customEvent)

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should trigger multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <button class="btn">Button 1</button>
        <button class="btn">Button 2</button>
      `
      const handler = vi.fn()

      // Test
      $('.btn').on('click', handler)
      $('.btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should trigger delegated event handlers', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">Button</button>
        </div>
      `
      const handler = vi.fn()

      // Test
      $('#container').on('click', '.btn', handler)
      $('.btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'

      // Test
      const result = $('#btn').trigger('click')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('btn'))
    })

    it('should handle custom events', () => {
      // Setup
      document.body.innerHTML = '<div id="element">Element</div>'
      const handler = vi.fn()

      // Test
      $('#element').on('myCustomEvent', handler)
      $('#element').trigger('myCustomEvent')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('event shorthand methods', () => {
    it('should support .click() shorthand', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').click(handler)
      $('#btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should support .click() trigger without handler', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)
      $('#btn').click() // Should trigger click event

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should support common event shorthands', () => {
      // Setup
      document.body.innerHTML = `
        <form id="form">
          <input id="input" type="text" />
          <input id="checkbox" type="checkbox" />
        </form>
      `

      const focusHandler = vi.fn()
      const blurHandler = vi.fn()
      const changeHandler = vi.fn()
      const submitHandler = vi.fn()

      // Test
      $('#input').focus(focusHandler)
      $('#input').blur(blurHandler)
      $('#checkbox').change(changeHandler)
      $('#form').submit(submitHandler)

      // Trigger events
      $('#input').focus()
      $('#input').blur()
      $('#checkbox').change()
      $('#form').submit()

      // Assert
      expect(focusHandler).toHaveBeenCalledTimes(1)
      expect(blurHandler).toHaveBeenCalledTimes(1)
      expect(changeHandler).toHaveBeenCalledTimes(1)
      expect(submitHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('event object properties', () => {
    it('should provide event object with correct properties', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()

      // Test
      $('#btn').on('click', handler)
      $('#btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const event = handler.mock.calls[0]?.[0]
      expect(event).toHaveProperty('type', 'click')
      expect(event).toHaveProperty('target')
      expect(event).toHaveProperty('currentTarget')
      expect(typeof event.preventDefault).toBe('function')
      expect(typeof event.stopPropagation).toBe('function')
    })

    it('should provide event.data when data is passed to .on()', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler = vi.fn()
      const testData = { test: 'data' }

      // Test
      $('#btn').on('click', testData, handler)
      $('#btn').trigger('click')

      // Assert
      expect(handler).toHaveBeenCalledTimes(1)
      const event = handler.mock.calls[0]?.[0]
      expect(event.data).toEqual(testData)
    })
  })

  describe('event handling edge cases', () => {
    it('should handle empty collection', () => {
      // Test - should not throw errors
      expect(() => {
        $('.non-existent').on('click', () => {})
        $('.non-existent').off('click')
        $('.non-existent').trigger('click')
        $('.non-existent').click()
      }).not.toThrow()
    })

    it('should handle false as handler to prevent default', () => {
      // Setup
      document.body.innerHTML = '<a id="link" href="#test">Link</a>'
      let defaultPrevented = false

      // Test
      $('#link').on('click', false)

      // Simulate clicking the link
      const link = document.getElementById('link')!
      link.addEventListener('click', (e) => {
        if (e.defaultPrevented) {
          defaultPrevented = true
        }
      })

      $('#link').trigger('click')

      // Assert
      expect(defaultPrevented).toBe(true)
    })

    it('should support chaining multiple event operations', () => {
      // Setup
      document.body.innerHTML = '<button id="btn">Click me</button>'
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      // Test
      const result = $('#btn')
        .on('click', handler1)
        .on('mouseover', handler2)
        .trigger('click')
        .trigger('mouseover')
        .off('click')

      // Assert - chaining should work
      expect(result).toHaveProperty('length', 1)
      expect(result[0]).toBe(document.getElementById('btn'))
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })
  })
})
