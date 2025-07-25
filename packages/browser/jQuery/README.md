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