# jQuery Core Implementation in Plain JavaScript

A modern reimplementation of jQuery's core functionality using plain JavaScript. This provides jQuery-like APIs without the jQuery dependency, leveraging modern browser capabilities.

## Status

Currently implemented:
- ✅ Core selector function `$()`
- ✅ Element selection (tag, ID, class, attribute, complex selectors)
- ✅ DOM element creation
- ✅ Context-based selection
- ✅ Special character escaping
- ✅ Window/document wrapping
- ✅ NodeList/Element wrapping
- ✅ Ready function
- ✅ DOM Manipulation Methods:
  - `.html()` - Get/set HTML content
  - `.text()` - Get/set text content
  - `.val()` - Get/set form element values
- ✅ DOM Insertion Methods:
  - `.append()` - Insert content at the end of elements
  - `.prepend()` - Insert content at the beginning of elements
  - `.before()` - Insert content before elements
  - `.after()` - Insert content after elements
  - `.appendTo()` - Append elements to target
  - `.prependTo()` - Prepend elements to target
  - `.insertBefore()` - Insert elements before target
  - `.insertAfter()` - Insert elements after target
- ✅ DOM Removal Methods:
  - `.remove()` - Remove elements from the DOM
  - `.empty()` - Remove all child nodes from elements
  - `.detach()` - Remove elements while preserving jQuery data
- ✅ DOM Replacement Methods:
  - `.replaceWith()` - Replace elements with new content
  - `.replaceAll()` - Replace target elements with matched elements
- ✅ Attribute Methods:
  - `.attr()` - Get/set HTML attributes
  - `.removeAttr()` - Remove HTML attributes
  - `.prop()` - Get/set DOM properties
  - `.removeProp()` - Remove DOM properties
- ✅ Class Manipulation Methods:
  - `.hasClass()` - Check if element has CSS class
  - `.addClass()` - Add CSS classes
  - `.removeClass()` - Remove CSS classes
  - `.toggleClass()` - Toggle CSS classes
- ✅ CSS and Style Methods:
  - `.css()` - Get/set CSS properties
  - `.width()` - Get/set element width
  - `.height()` - Get/set element height
  - `.innerWidth()` - Get/set inner width (including padding)
  - `.innerHeight()` - Get/set inner height (including padding)
  - `.outerWidth()` - Get/set outer width (including padding, border, optionally margin)
  - `.outerHeight()` - Get/set outer height (including padding, border, optionally margin)
- ✅ DOM Traversal Methods:
  - `.find()` - Find descendant elements matching selector
  - `.parent()` - Get immediate parent element
  - `.parents()` - Get all ancestor elements
  - `.children()` - Get direct child elements
  - `.siblings()` - Get sibling elements
  - `.next()` - Get immediately following sibling
  - `.prev()` - Get immediately preceding sibling
  - `.closest()` - Get closest ancestor matching selector
  - `.filter()` - Filter elements by selector or function
  - `.not()` - Remove elements matching selector or function
  - `.eq()` - Get element at specific index
  - `.first()` - Get first element
  - `.last()` - Get last element

## Usage

```javascript
import './core.js'

// Select elements
const divs = $('div')
const element = $('#my-id')
const items = $('.my-class')

// Create elements
const newDiv = $('<div class="new">Hello</div>')

// Context selection
const spans = $('span', '#container')

// DOM Manipulation
$('#content').html('<p>New content</p>')  // Set HTML
const html = $('#content').html()         // Get HTML

$('.message').text('Hello World')         // Set text
const text = $('.message').text()         // Get text

$('input[name="email"]').val('test@example.com')  // Set value
const email = $('input[name="email"]').val()      // Get value

// DOM Insertion
$('#container').append('<p>Appended paragraph</p>')    // Append content
$('#container').prepend('<h2>Prepended heading</h2>')  // Prepend content

$('#target').before('<div>Before target</div>')        // Insert before
$('#target').after('<div>After target</div>')          // Insert after

$('<p>New paragraph</p>').appendTo('#container')       // Append to target
$('<h3>New heading</h3>').prependTo('#container')      // Prepend to target

$('<span>Before</span>').insertBefore('#target')       // Insert before target
$('<span>After</span>').insertAfter('#target')         // Insert after target

// DOM Removal
$('.unwanted').remove()          // Remove elements from DOM
$('#container').empty()          // Remove all child nodes
const detached = $('.item').detach()  // Remove but keep for later use

// DOM Replacement
$('#old').replaceWith('<div id="new">New content</div>')  // Replace element
$('<p>New paragraph</p>').replaceAll('.old-paragraph')    // Replace all targets

// Attributes
$('#element').attr('title', 'Tooltip text')               // Set attribute
const title = $('#element').attr('title')                  // Get attribute
$('#element').attr({ 'data-id': '123', 'aria-label': 'Label' })  // Set multiple

$('#element').removeAttr('title')                          // Remove attribute
$('#element').removeAttr('title aria-label')               // Remove multiple

// Properties (for form elements, boolean attributes, etc.)
$('#checkbox').prop('checked', true)                       // Set property
const isChecked = $('#checkbox').prop('checked')           // Get property
$('#input').prop({ disabled: true, readOnly: true })       // Set multiple

// Class Manipulation
$('#element').addClass('active highlight')                 // Add classes
$('#element').removeClass('old-class')                     // Remove class
$('#element').toggleClass('visible')                       // Toggle class
const hasClass = $('#element').hasClass('active')          // Check class

// CSS Properties
$('#element').css('color', 'red')                          // Set CSS property
$('#element').css({'color': 'red', 'font-size': '16px'})   // Set multiple properties
const color = $('#element').css('color')                   // Get CSS property

// Dimensions
$('#element').width(200)                                   // Set width to 200px
const width = $('#element').width()                        // Get width
$('#element').height('50%')                                // Set height to 50%
const height = $('#element').height()                      // Get height

// Inner dimensions (including padding)
$('#element').innerWidth(250)                              // Set inner width
const innerWidth = $('#element').innerWidth()              // Get inner width
$('#element').innerHeight(150)                             // Set inner height
const innerHeight = $('#element').innerHeight()            // Get inner height

// Outer dimensions (including padding, border, optionally margin)
const outerWidth = $('#element').outerWidth()              // Get outer width
const outerWidthWithMargin = $('#element').outerWidth(true) // Include margin
$('#element').outerWidth(300)                              // Set outer width
const outerHeight = $('#element').outerHeight()            // Get outer height

// DOM Traversal
$('#container').find('.item')                                  // Find descendants
$('#child').parent()                                           // Get parent
$('#child').parents('.ancestor')                               // Get all matching ancestors
$('#parent').children('p')                                     // Get direct children
$('#element').siblings('.sibling')                             // Get siblings
$('#element').next('.next-item')                               // Get next sibling
$('#element').prev('.prev-item')                               // Get previous sibling
$('#element').closest('.container')                            // Get closest ancestor
$('.items').filter('.active')                                  // Filter by selector
$('.items').filter(function(index) { return index % 2 === 0 }) // Filter by function
$('.items').not('.disabled')                                   // Remove matching elements
$('.items').eq(2)                                             // Get element at index 2
$('.items').first()                                           // Get first element
$('.items').last()                                            // Get last element

// Ready function
$(function() {
  console.log('DOM ready!')
})
```

## Testing

Tests use Vitest with real browser environment via Playwright:

```bash
pnpm vitest run --config vitest.browser.config.ts
```

## Implementation Progress

See [Issue #1060](https://github.com/laststance/utils/issues/1060) for the full implementation roadmap.