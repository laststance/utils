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