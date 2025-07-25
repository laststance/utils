/// <reference path="./global.d.ts" />
import { describe, it, expect, beforeEach } from 'vitest'
import './core.js'

describe('jQuery DOM Traversal Methods', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = ''
  })

  describe('.find()', () => {
    it('should find descendant elements by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p class="text">Paragraph 1</p>
          <div class="nested">
            <p class="text">Paragraph 2</p>
            <span class="text">Span 1</span>
          </div>
        </div>
      `

      // Test
      const result = $('#container').find('.text')

      // Assert
      expect(result).toHaveProperty('length', 3)
      expect(result[0]?.textContent).toBe('Paragraph 1')
      expect(result[1]?.textContent).toBe('Paragraph 2')
      expect(result[2]?.textContent).toBe('Span 1')
    })

    it('should find elements by tag name', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p>Para 1</p>
          <div><p>Para 2</p></div>
          <span>Span</span>
        </div>
      `

      // Test
      const result = $('#container').find('p')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Para 1')
      expect(result[1]?.textContent).toBe('Para 2')
    })

    it('should return empty collection if no matches found', () => {
      // Setup
      document.body.innerHTML = '<div id="container"><p>Test</p></div>'

      // Test
      const result = $('#container').find('.nonexistent')

      // Assert
      expect(result).toHaveProperty('length', 0)
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="container">
          <span class="item">Item 1</span>
        </div>
        <div class="container">
          <span class="item">Item 2</span>
        </div>
      `

      // Test
      const result = $('.container').find('.item')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Item 1')
      expect(result[1]?.textContent).toBe('Item 2')
    })

    it('should return jQuery object for chaining', () => {
      // Setup
      document.body.innerHTML = '<div id="test"><p>Test</p></div>'

      // Test
      const result = $('#test').find('p')

      // Assert - check it's a jQuery object with methods
      expect(result).toHaveProperty('length', 1)
      expect(typeof result.addClass).toBe('function')
    })
  })

  describe('.parent()', () => {
    it('should get immediate parent element', () => {
      // Setup
      document.body.innerHTML = `
        <div id="grandparent">
          <div id="parent">
            <p id="child">Child</p>
          </div>
        </div>
      `

      // Test
      const result = $('#child').parent()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.id).toBe('parent')
    })

    it('should filter parent by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="grandparent" class="container">
          <div id="parent">
            <p id="child">Child</p>
          </div>
        </div>
      `

      // Test - parent doesn't match selector
      const result1 = $('#child').parent('.container')

      // Test - grandparent matches selector but not immediate parent
      const result2 = $('#child').parent('#parent')

      // Assert
      expect(result1).toHaveProperty('length', 0)
      expect(result2).toHaveProperty('length', 1)
      expect(result2[0]?.id).toBe('parent')
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent1">
          <p class="child">Child 1</p>
        </div>
        <div id="parent2">
          <p class="child">Child 2</p>
        </div>
      `

      // Test
      const result = $('.child').parent()

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.id).toBe('parent1')
      expect(result[1]?.id).toBe('parent2')
    })

    it('should return empty collection for elements without parent', () => {
      // Test - body element (which has html as parent, but let's test root elements)
      const result = $('html').parent()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.parents()', () => {
    it('should get all ancestor elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="great-grandparent">
          <div id="grandparent">
            <div id="parent">
              <p id="child">Child</p>
            </div>
          </div>
        </div>
      `

      // Test
      const result = $('#child').parents()

      // Assert - should include parent, grandparent, great-grandparent, body, html
      expect(result.length).toBeGreaterThanOrEqual(3)
      expect(result[0]?.id).toBe('parent')
      expect(result[1]?.id).toBe('grandparent')
      expect(result[2]?.id).toBe('great-grandparent')
    })

    it('should filter ancestors by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="root" class="container">
          <div id="middle">
            <div id="parent" class="container">
              <p id="child">Child</p>
            </div>
          </div>
        </div>
      `

      // Test
      const result = $('#child').parents('.container')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.id).toBe('parent')
      expect(result[1]?.id).toBe('root')
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="ancestor">
          <div class="parent">
            <p class="child">Child 1</p>
          </div>
        </div>
        <div class="ancestor">
          <div class="parent">
            <p class="child">Child 2</p>
          </div>
        </div>
      `

      // Test
      const result = $('.child').parents('.ancestor')

      // Assert
      expect(result).toHaveProperty('length', 2)
    })
  })

  describe('.children()', () => {
    it('should get direct child elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent">
          <p>Child 1</p>
          <span>Child 2</span>
          <div>
            <p>Grandchild</p>
          </div>
        </div>
      `

      // Test
      const result = $('#parent').children()

      // Assert - should only get direct children, not grandchildren
      expect(result).toHaveProperty('length', 3)
      expect(result[0]?.tagName).toBe('P')
      expect(result[1]?.tagName).toBe('SPAN')
      expect(result[2]?.tagName).toBe('DIV')
    })

    it('should filter children by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent">
          <p class="target">Para 1</p>
          <span>Span 1</span>
          <p class="target">Para 2</p>
        </div>
      `

      // Test
      const result = $('#parent').children('.target')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Para 1')
      expect(result[1]?.textContent).toBe('Para 2')
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="parent">
          <p>Child 1A</p>
          <p>Child 1B</p>
        </div>
        <div class="parent">
          <p>Child 2A</p>
        </div>
      `

      // Test
      const result = $('.parent').children('p')

      // Assert
      expect(result).toHaveProperty('length', 3)
      expect(result[0]?.textContent).toBe('Child 1A')
      expect(result[1]?.textContent).toBe('Child 1B')
      expect(result[2]?.textContent).toBe('Child 2A')
    })

    it('should return empty collection if no children', () => {
      // Setup
      document.body.innerHTML = '<div id="empty"></div>'

      // Test
      const result = $('#empty').children()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.siblings()', () => {
    it('should get all sibling elements', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p id="first">First</p>
          <span id="target">Target</span>
          <div id="last">Last</div>
        </div>
      `

      // Test
      const result = $('#target').siblings()

      // Assert - should not include target itself
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.id).toBe('first')
      expect(result[1]?.id).toBe('last')
    })

    it('should filter siblings by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="container">
          <p class="sibling">Para 1</p>
          <span id="target">Target</span>
          <div>Div</div>
          <p class="sibling">Para 2</p>
        </div>
      `

      // Test
      const result = $('#target').siblings('.sibling')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Para 1')
      expect(result[1]?.textContent).toBe('Para 2')
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <span>Sibling 1A</span>
          <div>Sibling 1B</div>
        </div>
        <div>
          <span>Sibling 2A</span>
          <p class="target">Target 2</p>
        </div>
      `

      // Test
      const result = $('.target').siblings()

      // Assert
      expect(result).toHaveProperty('length', 3)
    })

    it('should return empty collection if no siblings', () => {
      // Setup
      document.body.innerHTML =
        '<div id="container"><p id="only">Only child</p></div>'

      // Test
      const result = $('#only').siblings()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.next()', () => {
    it('should get immediately following sibling', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first">First</p>
          <span id="second">Second</span>
          <div id="third">Third</div>
        </div>
      `

      // Test
      const result = $('#first').next()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.id).toBe('second')
    })

    it('should filter next sibling by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first">First</p>
          <span id="second">Second</span>
          <div id="third" class="target">Third</div>
        </div>
      `

      // Test - next sibling doesn't match selector
      const result1 = $('#first').next('.target')
      // Test - next sibling matches selector
      const result2 = $('#second').next('.target')

      // Assert
      expect(result1).toHaveProperty('length', 0)
      expect(result2).toHaveProperty('length', 1)
      expect(result2[0]?.id).toBe('third')
    })

    it('should return empty collection if no next sibling', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first">First</p>
          <span id="last">Last</span>
        </div>
      `

      // Test
      const result = $('#last').next()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="target">Target 1</p>
          <span>Next 1</span>
        </div>
        <div>
          <p class="target">Target 2</p>
          <div>Next 2</div>
        </div>
      `

      // Test
      const result = $('.target').next()

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Next 1')
      expect(result[1]?.textContent).toBe('Next 2')
    })
  })

  describe('.prev()', () => {
    it('should get immediately preceding sibling', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first">First</p>
          <span id="second">Second</span>
          <div id="third">Third</div>
        </div>
      `

      // Test
      const result = $('#second').prev()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.id).toBe('first')
    })

    it('should filter previous sibling by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first" class="target">First</p>
          <span id="second">Second</span>
          <div id="third">Third</div>
        </div>
      `

      // Test - previous sibling matches selector
      const result1 = $('#second').prev('.target')
      // Test - previous sibling doesn't match selector
      const result2 = $('#third').prev('.target')

      // Assert
      expect(result1).toHaveProperty('length', 1)
      expect(result1[0]?.id).toBe('first')
      expect(result2).toHaveProperty('length', 0)
    })

    it('should return empty collection if no previous sibling', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p id="first">First</p>
          <span id="second">Second</span>
        </div>
      `

      // Test
      const result = $('#first').prev()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.closest()', () => {
    it('should get closest ancestor matching selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="root" class="container">
          <div id="middle">
            <div id="parent" class="container">
              <p id="child">Child</p>
            </div>
          </div>
        </div>
      `

      // Test
      const result = $('#child').closest('.container')

      // Assert - should get the closest ancestor with .container class
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.id).toBe('parent')
    })

    it('should include self if it matches selector', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent">
          <p id="child" class="target">Child</p>
        </div>
      `

      // Test
      const result = $('#child').closest('.target')

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.id).toBe('child')
    })

    it('should return empty collection if no ancestor matches', () => {
      // Setup
      document.body.innerHTML = `
        <div id="parent">
          <p id="child">Child</p>
        </div>
      `

      // Test
      const result = $('#child').closest('.nonexistent')

      // Assert
      expect(result).toHaveProperty('length', 0)
    })

    it('should work on multiple elements', () => {
      // Setup
      document.body.innerHTML = `
        <div class="ancestor">
          <div class="parent">
            <p class="child">Child 1</p>
          </div>
        </div>
        <div class="ancestor">
          <div class="parent">
            <p class="child">Child 2</p>
          </div>
        </div>
      `

      // Test
      const result = $('.child').closest('.ancestor')

      // Assert
      expect(result).toHaveProperty('length', 2)
    })
  })

  describe('.filter()', () => {
    it('should filter elements by selector', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="keep">Keep 1</p>
          <p>Remove</p>
          <p class="keep">Keep 2</p>
        </div>
      `

      // Test
      const result = $('p').filter('.keep')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Keep 1')
      expect(result[1]?.textContent).toBe('Keep 2')
    })

    it('should filter elements by function', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>Para 1</p>
          <p>Para 2</p>
          <p>Para 3</p>
        </div>
      `

      // Test
      const result = $('p').filter(function (index) {
        return index % 2 === 0 // Keep even indices (0, 2)
      })

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Para 1')
      expect(result[1]?.textContent).toBe('Para 3')
    })

    it('should return empty collection if no matches', () => {
      // Setup
      document.body.innerHTML = '<div><p>Test</p></div>'

      // Test
      const result = $('p').filter('.nonexistent')

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.not()', () => {
    it('should remove elements matching selector', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p class="remove">Remove 1</p>
          <p>Keep 1</p>
          <p class="remove">Remove 2</p>
          <p>Keep 2</p>
        </div>
      `

      // Test
      const result = $('p').not('.remove')

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Keep 1')
      expect(result[1]?.textContent).toBe('Keep 2')
    })

    it('should remove elements by function', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>Para 1</p>
          <p>Para 2</p>
          <p>Para 3</p>
        </div>
      `

      // Test
      const result = $('p').not(function (index) {
        return index === 1 // Remove middle element
      })

      // Assert
      expect(result).toHaveProperty('length', 2)
      expect(result[0]?.textContent).toBe('Para 1')
      expect(result[1]?.textContent).toBe('Para 3')
    })

    it('should return all elements if no matches to remove', () => {
      // Setup
      document.body.innerHTML = '<div><p>Test 1</p><p>Test 2</p></div>'

      // Test
      const result = $('p').not('.nonexistent')

      // Assert
      expect(result).toHaveProperty('length', 2)
    })
  })

  describe('.eq()', () => {
    it('should return element at specified index', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>Para 0</p>
          <p>Para 1</p>
          <p>Para 2</p>
        </div>
      `

      // Test
      const result = $('p').eq(1)

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.textContent).toBe('Para 1')
    })

    it('should support negative indices', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>Para 0</p>
          <p>Para 1</p>
          <p>Para 2</p>
        </div>
      `

      // Test
      const result = $('p').eq(-1) // Last element

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.textContent).toBe('Para 2')
    })

    it('should return empty collection for out of bounds index', () => {
      // Setup
      document.body.innerHTML = '<div><p>Test</p></div>'

      // Test
      const result = $('p').eq(5)

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.first()', () => {
    it('should return first element', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>First</p>
          <p>Second</p>
          <p>Third</p>
        </div>
      `

      // Test
      const result = $('p').first()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.textContent).toBe('First')
    })

    it('should return empty collection if no elements', () => {
      // Test
      const result = $('nonexistent').first()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('.last()', () => {
    it('should return last element', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <p>First</p>
          <p>Second</p>
          <p>Last</p>
        </div>
      `

      // Test
      const result = $('p').last()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.textContent).toBe('Last')
    })

    it('should return empty collection if no elements', () => {
      // Test
      const result = $('nonexistent').last()

      // Assert
      expect(result).toHaveProperty('length', 0)
    })
  })

  describe('chaining traversal methods', () => {
    it('should allow chaining of traversal methods', () => {
      // Setup
      document.body.innerHTML = `
        <div id="root">
          <div class="container">
            <p class="text">Target</p>
            <span>Sibling</span>
          </div>
        </div>
      `

      // Test
      const result = $('#root').find('.text').parent().children().last()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(result[0]?.textContent).toBe('Sibling')
    })

    it('should maintain jQuery object properties during chaining', () => {
      // Setup
      document.body.innerHTML = '<div><p>Test</p></div>'

      // Test
      const result = $('div').children().first()

      // Assert
      expect(result).toHaveProperty('length', 1)
      expect(typeof result.addClass).toBe('function')
      expect(typeof result.css).toBe('function')
    })
  })
})
