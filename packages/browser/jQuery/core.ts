/**
 * jQuery Core - Selector and DOM manipulation
 * A plain JavaScript implementation of jQuery's core functionality
 */

export interface JQueryCollection extends ArrayLike<Element> {
  length: number
  [index: number]: Element

  // DOM Manipulation
  html(): string | undefined
  html(_content: string | ((_index: number) => string)): JQuery

  text(): string
  text(
    _content: string | ((_index: number, _oldText: string) => string),
  ): JQuery

  val(): string | string[] | undefined
  val(
    _value: string | string[] | ((_index: number, _oldValue: string) => string),
  ): JQuery

  // DOM Insertion - Inside
  append(
    _content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery
  prepend(
    _content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery
  appendTo(_target: string | Element | JQuery): JQuery
  prependTo(_target: string | Element | JQuery): JQuery

  // DOM Insertion - Outside
  before(
    _content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery
  after(
    _content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery
  insertBefore(_target: string | Element | JQuery): JQuery
  insertAfter(_target: string | Element | JQuery): JQuery

  // DOM Removal
  remove(): JQuery
  empty(): JQuery
  detach(): JQuery

  // DOM Replacement
  replaceWith(
    _content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery
  replaceAll(_target: string | Element | JQuery): JQuery

  // Attributes
  attr(_name: string): string | undefined
  attr(_name: string, _value: string | number | null): JQuery
  attr(_attributes: Record<string, string | number | null>): JQuery
  attr(
    _name: string,
    _value: (
      _index: number,
      _attr: string | undefined,
    ) => string | number | null | undefined,
  ): JQuery

  removeAttr(_name: string): JQuery

  prop(_name: string): any
  prop(_name: string, _value: any): JQuery
  prop(_properties: Record<string, any>): JQuery
  prop(_name: string, _value: (_index: number, _oldProp: any) => any): JQuery

  removeProp(_name: string): JQuery

  // Class Manipulation
  hasClass(_className: string): boolean
  addClass(_classNames: string): JQuery
  addClass(_function: (_index: number, _currentClass: string) => string): JQuery
  removeClass(): JQuery
  removeClass(_classNames: string): JQuery
  removeClass(
    _function: (_index: number, _currentClass: string) => string,
  ): JQuery
  toggleClass(_classNames: string, _switch?: boolean): JQuery
  toggleClass(
    _function: (
      _index: number,
      _currentClass: string,
      _switch: boolean,
    ) => string,
    _switch?: boolean,
  ): JQuery

  // CSS and Style Methods
  css(_property: string): string | undefined
  css(_property: string, _value: string | number): JQuery
  css(_properties: Record<string, string | number>): JQuery
  css(
    _property: string,
    _value: (_index: number, _currentValue: string) => string | number,
  ): JQuery

  // Dimension Methods
  width(): number | undefined
  width(_value: number | string): JQuery
  width(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery

  height(): number | undefined
  height(_value: number | string): JQuery
  height(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery

  innerWidth(): number | undefined
  innerWidth(_value: number | string): JQuery
  innerWidth(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery

  innerHeight(): number | undefined
  innerHeight(_value: number | string): JQuery
  innerHeight(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery

  outerWidth(_includeMargin?: boolean): number | undefined
  outerWidth(_value: number | string): JQuery
  outerWidth(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery

  outerHeight(_includeMargin?: boolean): number | undefined
  outerHeight(_value: number | string): JQuery
  outerHeight(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery

  // DOM Traversal Methods
  find(_selector: string): JQuery
  parent(_selector?: string): JQuery
  parents(_selector?: string): JQuery
  children(_selector?: string): JQuery
  siblings(_selector?: string): JQuery
  next(_selector?: string): JQuery
  prev(_selector?: string): JQuery
  closest(_selector: string): JQuery
  filter(_selector: string): JQuery
  filter(_function: (_index: number, _element: Element) => boolean): JQuery
  not(_selector: string): JQuery
  not(_function: (_index: number, _element: Element) => boolean): JQuery
  eq(_index: number): JQuery
  first(): JQuery
  last(): JQuery
}

export class JQuery implements JQueryCollection {
  length: number = 0;
  [index: number]: Element

  constructor(
    selector?: string | Element | NodeList | Window | Document | Function,
    context?: Element | JQuery,
  ) {
    // Handle ready function
    if (typeof selector === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', selector as EventListener)
      } else {
        selector()
      }
      return this
    }

    // Handle window object
    if (selector === window) {
      this[0] = window as any
      this.length = 1
      return this
    }

    // Handle document object
    if (selector === document) {
      this[0] = document as any
      this.length = 1
      return this
    }

    // Handle DOM element
    if (selector instanceof Element) {
      this[0] = selector
      this.length = 1
      return this
    }

    // Handle NodeList
    if (selector instanceof NodeList) {
      Array.from(selector).forEach((el, i) => {
        this[i] = el as Element
      })
      this.length = selector.length
      return this
    }

    // Handle string selector
    if (typeof selector === 'string') {
      const trimmedSelector = selector.trim()

      // Check if it's HTML creation
      if (
        trimmedSelector[0] === '<' &&
        trimmedSelector[trimmedSelector.length - 1] === '>'
      ) {
        // Create element
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = trimmedSelector
        const elements = tempDiv.children

        Array.from(elements).forEach((el, i) => {
          this[i] = el
        })
        this.length = elements.length
        return this
      }

      // Regular selector
      let searchContext: Element | Document = document

      // Handle context
      if (context) {
        if (context instanceof JQuery) {
          searchContext = context[0] || document
        } else {
          searchContext = context
        }
      }

      // Handle special character escaping for IDs
      // Only escape when we have #id\\.something or #id\\:something pattern
      let processedSelector = selector
      if (selector.includes('\\')) {
        // Replace escaped dots and colons with temporary placeholders
        processedSelector = selector
          .replace(/\\\./g, '__DOT__')
          .replace(/\\:/g, '__COLON__')
          // Now replace the placeholders with proper CSS escapes
          .replace(/__DOT__/g, '\\.')
          .replace(/__COLON__/g, '\\:')
      }

      try {
        const elements = searchContext.querySelectorAll(processedSelector)
        Array.from(elements).forEach((el, i) => {
          this[i] = el as Element
        })
        this.length = elements.length
      } catch {
        // If selector fails, return empty collection
        this.length = 0
      }
    }

    return this
  }

  // DOM Manipulation Methods

  html(): string | undefined
  html(_content: string | ((_index: number) => string)): JQuery
  html(
    content?: string | ((_index: number) => string),
  ): string | undefined | JQuery {
    // Getting HTML
    if (content === undefined) {
      return this[0]?.innerHTML
    }

    // Setting HTML
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        if (typeof content === 'function') {
          element.innerHTML = content(i)
        } else {
          element.innerHTML = content
        }
      }
    }

    return this
  }

  text(): string
  text(
    _content: string | ((_index: number, _oldText: string) => string),
  ): JQuery
  text(
    content?: string | ((_index: number, _oldText: string) => string),
  ): string | JQuery {
    // Getting text
    if (content === undefined) {
      let result = ''
      for (let i = 0; i < this.length; i++) {
        const element = this[i]
        if (element) {
          result += element.textContent || ''
        }
      }
      return result
    }

    // Setting text
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        if (typeof content === 'function') {
          const oldText = element.textContent || ''
          element.textContent = content(i, oldText)
        } else {
          element.textContent = content
        }
      }
    }

    return this
  }

  val(): string | string[] | undefined
  val(
    _value: string | string[] | ((_index: number, _oldValue: string) => string),
  ): JQuery
  val(
    value?: string | string[] | ((_index: number, _oldValue: string) => string),
  ): string | string[] | undefined | JQuery {
    // Getting value
    if (value === undefined) {
      const element = this[0]
      if (!element) return undefined

      // Handle different element types
      if ('value' in element) {
        if (
          element.tagName === 'SELECT' &&
          (element as HTMLSelectElement).multiple
        ) {
          // Handle select-multiple
          const select = element as HTMLSelectElement
          const values: string[] = []
          for (let i = 0; i < select.options.length; i++) {
            const option = select.options[i]
            if (option?.selected) {
              values.push(option.value)
            }
          }
          return values
        }
        // Handle regular form elements
        return (
          element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        ).value
      }

      return undefined
    }

    // Setting value
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element && 'value' in element) {
        if (element.tagName === 'SELECT' && Array.isArray(value)) {
          // Handle setting multiple select values
          const select = element as HTMLSelectElement
          for (let j = 0; j < select.options.length; j++) {
            const option = select.options[j]
            if (option) {
              option.selected = value.includes(option.value)
            }
          }
        } else if (typeof value === 'function') {
          const oldValue = (
            element as
              | HTMLInputElement
              | HTMLTextAreaElement
              | HTMLSelectElement
          ).value
          ;(
            element as
              | HTMLInputElement
              | HTMLTextAreaElement
              | HTMLSelectElement
          ).value = value(i, oldValue)
        } else if (typeof value === 'string') {
          ;(
            element as
              | HTMLInputElement
              | HTMLTextAreaElement
              | HTMLSelectElement
          ).value = value
        }
      }
    }

    return this
  }

  // DOM Insertion Methods - Inside

  append(
    content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element) continue

      let toAppend: string | Element | JQuery

      if (typeof content === 'function') {
        toAppend = content(i, element.innerHTML)
      } else {
        toAppend = content
      }

      if (typeof toAppend === 'string') {
        element.insertAdjacentHTML('beforeend', toAppend)
      } else if (toAppend instanceof Element) {
        element.appendChild(toAppend)
      } else if (toAppend instanceof JQuery) {
        // Append all elements from jQuery collection
        for (let j = 0; j < toAppend.length; j++) {
          const el = toAppend[j]
          if (el) {
            element.appendChild(el)
          }
        }
      }
    }

    return this
  }

  prepend(
    content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element) continue

      let toPrepend: string | Element | JQuery

      if (typeof content === 'function') {
        toPrepend = content(i, element.innerHTML)
      } else {
        toPrepend = content
      }

      if (typeof toPrepend === 'string') {
        element.insertAdjacentHTML('afterbegin', toPrepend)
      } else if (toPrepend instanceof Element) {
        element.insertBefore(toPrepend, element.firstChild)
      } else if (toPrepend instanceof JQuery) {
        // Prepend all elements from jQuery collection in reverse order
        for (let j = toPrepend.length - 1; j >= 0; j--) {
          const el = toPrepend[j]
          if (el) {
            element.insertBefore(el, element.firstChild)
          }
        }
      }
    }

    return this
  }

  appendTo(target: string | Element | JQuery): JQuery {
    const $target = target instanceof JQuery ? target : $(target)

    for (let i = 0; i < $target.length; i++) {
      const targetElement = $target[i]
      if (!targetElement) continue

      for (let j = 0; j < this.length; j++) {
        const element = this[j]
        if (element) {
          // Clone for all targets except the last one
          const toAppend =
            i < $target.length - 1
              ? (element.cloneNode(true) as Element)
              : element
          targetElement.appendChild(toAppend)
        }
      }
    }

    return this
  }

  prependTo(target: string | Element | JQuery): JQuery {
    const $target = target instanceof JQuery ? target : $(target)

    for (let i = 0; i < $target.length; i++) {
      const targetElement = $target[i]
      if (!targetElement) continue

      for (let j = this.length - 1; j >= 0; j--) {
        const element = this[j]
        if (element) {
          // Clone for all targets except the last one
          const toPrepend =
            i < $target.length - 1
              ? (element.cloneNode(true) as Element)
              : element
          targetElement.insertBefore(toPrepend, targetElement.firstChild)
        }
      }
    }

    return this
  }

  // DOM Insertion Methods - Outside

  before(
    content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element || !element.parentNode) continue

      let toInsert: string | Element | JQuery

      if (typeof content === 'function') {
        toInsert = content(i, element.innerHTML)
      } else {
        toInsert = content
      }

      if (typeof toInsert === 'string') {
        element.insertAdjacentHTML('beforebegin', toInsert)
      } else if (toInsert instanceof Element) {
        element.parentNode!.insertBefore(toInsert, element)
      } else if (toInsert instanceof JQuery) {
        // Insert all elements from jQuery collection
        for (let j = 0; j < toInsert.length; j++) {
          const el = toInsert[j]
          if (el) {
            element.parentNode.insertBefore(el, element)
          }
        }
      }
    }

    return this
  }

  after(
    content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element || !element.parentNode) continue

      let toInsert: string | Element | JQuery

      if (typeof content === 'function') {
        toInsert = content(i, element.innerHTML)
      } else {
        toInsert = content
      }

      if (typeof toInsert === 'string') {
        element.insertAdjacentHTML('afterend', toInsert)
      } else if (toInsert instanceof Element) {
        element.parentNode.insertBefore(toInsert, element.nextSibling)
      } else if (toInsert instanceof JQuery) {
        // Insert all elements from jQuery collection
        const nextSibling = element.nextSibling
        for (let j = 0; j < toInsert.length; j++) {
          const el = toInsert[j]
          if (el) {
            element.parentNode.insertBefore(el, nextSibling)
          }
        }
      }
    }

    return this
  }

  insertBefore(target: string | Element | JQuery): JQuery {
    const $target = target instanceof JQuery ? target : $(target)

    for (let i = 0; i < $target.length; i++) {
      const targetElement = $target[i]
      if (!targetElement || !targetElement.parentNode) continue

      for (let j = 0; j < this.length; j++) {
        const element = this[j]
        if (element) {
          // Clone for all targets except the last one
          const toInsert =
            i < $target.length - 1
              ? (element.cloneNode(true) as Element)
              : element
          targetElement.parentNode!.insertBefore(toInsert, targetElement)
        }
      }
    }

    return this
  }

  insertAfter(target: string | Element | JQuery): JQuery {
    const $target = target instanceof JQuery ? target : $(target)

    for (let i = 0; i < $target.length; i++) {
      const targetElement = $target[i]
      if (!targetElement || !targetElement.parentNode) continue

      for (let j = this.length - 1; j >= 0; j--) {
        const element = this[j]
        if (element) {
          // Clone for all targets except the last one
          const toInsert =
            i < $target.length - 1
              ? (element.cloneNode(true) as Element)
              : element
          targetElement.parentNode.insertBefore(
            toInsert,
            targetElement.nextSibling,
          )
        }
      }
    }

    return this
  }

  // DOM Removal Methods

  remove(): JQuery {
    // Remove each element from the DOM
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }

    // Return the removed elements for potential reuse
    return this
  }

  empty(): JQuery {
    // Empty the content of each element
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        // Remove all child nodes
        while (element.firstChild) {
          element.removeChild(element.firstChild)
        }
      }
    }

    return this
  }

  detach(): JQuery {
    // Detach is like remove but preserves jQuery data and events
    // Since we're not implementing data/events yet, it's the same as remove
    // but returns the detached elements for reattachment
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }

    // Return the detached elements
    return this
  }

  // DOM Replacement Methods

  replaceWith(
    content:
      | string
      | Element
      | JQuery
      | ((_index: number, _html: string) => string | Element | JQuery),
  ): JQuery {
    // Store references to elements before removing them
    const removedElements: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element || !element.parentNode) continue

      removedElements.push(element)

      let replacement: string | Element | JQuery

      if (typeof content === 'function') {
        replacement = content(i, element.innerHTML)
      } else {
        replacement = content
      }

      if (typeof replacement === 'string') {
        // Parse HTML string and insert all resulting nodes
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = replacement
        const nodes = Array.from(tempDiv.childNodes)

        nodes.forEach((node) => {
          element.parentNode!.insertBefore(node, element)
        })
      } else if (replacement instanceof Element) {
        // Clone for all except the last element
        const toInsert =
          i < this.length - 1
            ? (replacement.cloneNode(true) as Element)
            : replacement
        element.parentNode!.insertBefore(toInsert, element)
      } else if (replacement instanceof JQuery) {
        // Insert all elements from jQuery collection
        for (let j = 0; j < replacement.length; j++) {
          const replaceEl = replacement[j]
          if (replaceEl) {
            // Clone for all except the last target
            const toInsert =
              i < this.length - 1
                ? (replaceEl.cloneNode(true) as Element)
                : replaceEl
            element.parentNode!.insertBefore(toInsert, element)
          }
        }
      }

      // Remove the original element
      element.parentNode!.removeChild(element)
    }

    // Return jQuery collection of removed elements
    const result = new JQuery()
    removedElements.forEach((el, i) => {
      result[i] = el
    })
    result.length = removedElements.length
    return result
  }

  replaceAll(target: string | Element | JQuery): JQuery {
    const $target = target instanceof JQuery ? target : $(target)
    const insertedElements: Element[] = []

    for (let i = 0; i < $target.length; i++) {
      const targetElement = $target[i]
      if (!targetElement || !targetElement.parentNode) continue

      // Clone elements for all targets except the last
      for (let j = 0; j < this.length; j++) {
        const element = this[j]
        if (element) {
          const toInsert =
            i < $target.length - 1
              ? (element.cloneNode(true) as Element)
              : element
          targetElement.parentNode!.insertBefore(toInsert, targetElement)
          insertedElements.push(toInsert as Element)
        }
      }

      // Remove the target element
      targetElement.parentNode!.removeChild(targetElement)
    }

    // Return jQuery collection of inserted elements
    const result = new JQuery()
    insertedElements.forEach((el, i) => {
      result[i] = el
    })
    result.length = insertedElements.length
    return result
  }

  // Attribute Methods

  attr(_name: string): string | undefined
  attr(_name: string, _value: string | number | null): JQuery
  attr(_attributes: Record<string, string | number | null>): JQuery
  attr(
    _name: string,
    _value: (
      _index: number,
      _attr: string | undefined,
    ) => string | number | null | undefined,
  ): JQuery
  attr(
    nameOrAttributes:
      | string
      | Record<string, string | number | null>
      | ((
          _index: number,
          _attr: string | undefined,
        ) => string | number | null | undefined),
    value?:
      | string
      | number
      | null
      | ((
          _index: number,
          _attr: string | undefined,
        ) => string | number | null | undefined),
  ): string | undefined | JQuery {
    // Getting attribute
    if (typeof nameOrAttributes === 'string' && value === undefined) {
      const element = this[0]
      if (!element) return undefined
      return element.getAttribute(nameOrAttributes) ?? undefined
    }

    // Setting attributes with object
    if (typeof nameOrAttributes === 'object' && nameOrAttributes !== null) {
      for (let i = 0; i < this.length; i++) {
        const element = this[i]
        if (element) {
          Object.entries(nameOrAttributes).forEach(([attrName, attrValue]) => {
            if (attrValue === null) {
              element.removeAttribute(attrName)
            } else {
              element.setAttribute(attrName, String(attrValue))
            }
          })
        }
      }
      return this
    }

    // Setting attribute with value or function
    if (typeof nameOrAttributes === 'string') {
      for (let i = 0; i < this.length; i++) {
        const element = this[i]
        if (element) {
          let newValue: string | number | null | undefined

          if (typeof value === 'function') {
            const currentValue =
              element.getAttribute(nameOrAttributes) ?? undefined
            newValue = value(i, currentValue)
          } else {
            newValue = value
          }

          if (newValue === null || newValue === undefined) {
            element.removeAttribute(nameOrAttributes)
          } else {
            element.setAttribute(nameOrAttributes, String(newValue))
          }
        }
      }
    }

    return this
  }

  removeAttr(name: string): JQuery {
    const attributeNames = name.split(' ')

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        attributeNames.forEach((attrName) => {
          element.removeAttribute(attrName.trim())
        })
      }
    }

    return this
  }

  prop(_name: string): any
  prop(_name: string, _value: any): JQuery
  prop(_properties: Record<string, any>): JQuery
  prop(_name: string, _value: (_index: number, _oldProp: any) => any): JQuery
  prop(
    nameOrProperties:
      | string
      | Record<string, any>
      | ((_index: number, _oldProp: any) => any),
    value?: any | ((_index: number, _oldProp: any) => any),
  ): any | JQuery {
    // Getting property
    if (typeof nameOrProperties === 'string' && value === undefined) {
      const element = this[0]
      if (!element) return undefined
      return (element as any)[nameOrProperties]
    }

    // Setting properties with object
    if (typeof nameOrProperties === 'object' && nameOrProperties !== null) {
      for (let i = 0; i < this.length; i++) {
        const element = this[i]
        if (element) {
          Object.entries(nameOrProperties).forEach(([propName, propValue]) => {
            ;(element as any)[propName] = propValue
          })
        }
      }
      return this
    }

    // Setting property with value or function
    if (typeof nameOrProperties === 'string') {
      for (let i = 0; i < this.length; i++) {
        const element = this[i]
        if (element) {
          let newValue: any

          if (typeof value === 'function') {
            const currentValue = (element as any)[nameOrProperties]
            newValue = value(i, currentValue)
          } else {
            newValue = value
          }

          ;(element as any)[nameOrProperties] = newValue
        }
      }
    }

    return this
  }

  removeProp(name: string): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        try {
          // Only remove custom properties, not native ones
          delete (element as any)[name]
        } catch {
          // Silently fail for properties that can't be deleted
        }
      }
    }

    return this
  }

  // Class Manipulation Methods

  hasClass(className: string): boolean {
    if (!className || !className.trim()) return false

    const element = this[0]
    if (!element) return false

    return element.classList.contains(className.trim())
  }

  addClass(_classNames: string): JQuery
  addClass(_fn: (_index: number, _currentClass: string) => string): JQuery
  addClass(
    classNamesOrFn:
      | string
      | ((_index: number, _currentClass: string) => string),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element) continue

      let classesToAdd: string

      if (typeof classNamesOrFn === 'function') {
        classesToAdd = classNamesOrFn(i, element.className)
      } else {
        classesToAdd = classNamesOrFn
      }

      if (!classesToAdd || !classesToAdd.trim()) continue

      // Split by whitespace and add each class
      const classes = classesToAdd.trim().split(/\s+/)
      classes.forEach((cls) => {
        if (cls && !element.classList.contains(cls)) {
          element.classList.add(cls)
        }
      })
    }

    return this
  }

  removeClass(): JQuery
  removeClass(_classNames: string): JQuery
  removeClass(_fn: (_index: number, _currentClass: string) => string): JQuery
  removeClass(
    classNamesOrFn?:
      | string
      | ((_index: number, _currentClass: string) => string),
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element) continue

      // Remove all classes if no parameter provided
      if (classNamesOrFn === undefined) {
        element.className = ''
        continue
      }

      let classesToRemove: string

      if (typeof classNamesOrFn === 'function') {
        classesToRemove = classNamesOrFn(i, element.className)
      } else {
        classesToRemove = classNamesOrFn
      }

      if (!classesToRemove || !classesToRemove.trim()) continue

      // Split by whitespace and remove each class
      const classes = classesToRemove.trim().split(/\s+/)
      classes.forEach((cls) => {
        if (cls) {
          element.classList.remove(cls)
        }
      })
    }

    return this
  }

  toggleClass(_classNames: string, _switchValue?: boolean): JQuery
  toggleClass(
    _fn: (
      _index: number,
      _currentClass: string,
      _switchValue: boolean,
    ) => string,
    _switchValue?: boolean,
  ): JQuery
  toggleClass(
    classNamesOrFn:
      | string
      | ((
          _index: number,
          _currentClass: string,
          _switchValue: boolean,
        ) => string),
    switchValue?: boolean,
  ): JQuery {
    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (!element) continue

      let classesToToggle: string

      if (typeof classNamesOrFn === 'function') {
        classesToToggle = classNamesOrFn(
          i,
          element.className,
          switchValue ?? false,
        )
      } else {
        classesToToggle = classNamesOrFn
      }

      if (!classesToToggle || !classesToToggle.trim()) continue

      // Split by whitespace and toggle each class
      const classes = classesToToggle.trim().split(/\s+/)
      classes.forEach((cls) => {
        if (cls) {
          if (switchValue === true) {
            if (!element.classList.contains(cls)) {
              element.classList.add(cls)
            }
          } else if (switchValue === false) {
            element.classList.remove(cls)
          } else {
            // Toggle based on current state
            element.classList.toggle(cls)
          }
        }
      })
    }

    return this
  }

  // CSS and Style Methods

  css(_property: string): string | undefined
  css(_property: string, _value: string | number): JQuery
  css(_properties: Record<string, string | number>): JQuery
  css(
    _property: string,
    _value: (_index: number, _currentValue: string) => string | number,
  ): JQuery
  css(
    propertyOrProperties:
      | string
      | Record<string, string | number>
      | ((_index: number, _currentValue: string) => string | number),
    value?:
      | string
      | number
      | ((_index: number, _currentValue: string) => string | number),
  ): string | undefined | JQuery {
    // Properties that don't get 'px' automatically appended
    const cssNumber = new Set([
      'z-index',
      'font-weight',
      'opacity',
      'zoom',
      'line-height',
      'counter-increment',
      'counter-reset',
      'order',
      'flex-grow',
      'flex-shrink',
      'column-count',
      'columns',
      'font-size-adjust',
      'fill-opacity',
      'flood-opacity',
      'stop-opacity',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-miterlimit',
      'stroke-opacity',
      'stroke-width',
    ])

    // Helper function to convert camelCase to kebab-case
    const camelToKebab = (str: string) => {
      return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    }

    // Helper function to convert kebab-case to camelCase
    const kebabToCamel = (str: string) => {
      return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    }

    // Getting CSS property
    if (typeof propertyOrProperties === 'string' && value === undefined) {
      const element = this[0]
      if (!element) return undefined

      const property = propertyOrProperties
      const computedStyle = window.getComputedStyle(element)

      // Try kebab-case first, then camelCase
      let result = computedStyle.getPropertyValue(camelToKebab(property))
      if (!result) {
        result = (computedStyle as any)[kebabToCamel(property)]
      }

      return result || undefined
    }

    // Setting CSS properties with object
    if (
      typeof propertyOrProperties === 'object' &&
      propertyOrProperties !== null
    ) {
      for (let i = 0; i < this.length; i++) {
        const element = this[i] as HTMLElement
        if (element && element.style) {
          Object.entries(propertyOrProperties).forEach(([prop, val]) => {
            let cssValue = String(val)

            // Add 'px' to numeric values for appropriate properties
            if (typeof val === 'number' && !cssNumber.has(prop)) {
              cssValue = val + 'px'
            }

            element.style.setProperty(camelToKebab(prop), cssValue)
          })
        }
      }
      return this
    }

    // Setting CSS property with value or function
    if (typeof propertyOrProperties === 'string') {
      for (let i = 0; i < this.length; i++) {
        const element = this[i] as HTMLElement
        if (element && element.style) {
          let newValue: string | number

          if (typeof value === 'function') {
            const currentValue =
              window
                .getComputedStyle(element)
                .getPropertyValue(camelToKebab(propertyOrProperties)) || ''
            newValue = value(i, currentValue)
          } else {
            newValue = value!
          }

          let cssValue = String(newValue)

          // Add 'px' to numeric values for appropriate properties
          if (
            typeof newValue === 'number' &&
            !cssNumber.has(propertyOrProperties)
          ) {
            cssValue = newValue + 'px'
          }

          element.style.setProperty(
            camelToKebab(propertyOrProperties),
            cssValue,
          )
        }
      }
    }

    return this
  }

  // Dimension Methods

  width(): number | undefined
  width(_value: number | string): JQuery
  width(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery
  width(
    value?:
      | number
      | string
      | ((_index: number, _currentWidth: number) => number | string),
  ): number | undefined | JQuery {
    // Getting width
    if (value === undefined) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      // Return content width (excluding padding, border, margin)
      const computedStyle = window.getComputedStyle(element)
      const width = parseFloat(computedStyle.width)
      return isNaN(width) ? undefined : width
    }

    // Setting width
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newWidth: number | string

        if (typeof value === 'function') {
          const currentWidth =
            parseFloat(window.getComputedStyle(element).width) || 0
          newWidth = value(i, currentWidth)
        } else {
          newWidth = value
        }

        if (typeof newWidth === 'number') {
          element.style.width = newWidth + 'px'
        } else {
          element.style.width = newWidth
        }
      }
    }

    return this
  }

  height(): number | undefined
  height(_value: number | string): JQuery
  height(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery
  height(
    value?:
      | number
      | string
      | ((_index: number, _currentHeight: number) => number | string),
  ): number | undefined | JQuery {
    // Getting height
    if (value === undefined) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      // Return content height (excluding padding, border, margin)
      const computedStyle = window.getComputedStyle(element)
      const height = parseFloat(computedStyle.height)
      return isNaN(height) ? undefined : height
    }

    // Setting height
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newHeight: number | string

        if (typeof value === 'function') {
          const currentHeight =
            parseFloat(window.getComputedStyle(element).height) || 0
          newHeight = value(i, currentHeight)
        } else {
          newHeight = value
        }

        if (typeof newHeight === 'number') {
          element.style.height = newHeight + 'px'
        } else {
          element.style.height = newHeight
        }
      }
    }

    return this
  }

  innerWidth(): number | undefined
  innerWidth(_value: number | string): JQuery
  innerWidth(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery
  innerWidth(
    value?:
      | number
      | string
      | ((_index: number, _currentWidth: number) => number | string),
  ): number | undefined | JQuery {
    // Getting inner width
    if (value === undefined) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      // Return width + padding
      const computedStyle = window.getComputedStyle(element)
      const width = parseFloat(computedStyle.width)
      const paddingLeft = parseFloat(computedStyle.paddingLeft)
      const paddingRight = parseFloat(computedStyle.paddingRight)

      return (
        (isNaN(width) ? 0 : width) +
        (isNaN(paddingLeft) ? 0 : paddingLeft) +
        (isNaN(paddingRight) ? 0 : paddingRight)
      )
    }

    // Setting inner width
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newInnerWidth: number | string

        if (typeof value === 'function') {
          const computedStyle = window.getComputedStyle(element)
          const currentWidth = parseFloat(computedStyle.width) || 0
          const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
          const paddingRight = parseFloat(computedStyle.paddingRight) || 0
          const currentInnerWidth = currentWidth + paddingLeft + paddingRight
          newInnerWidth = value(i, currentInnerWidth)
        } else {
          newInnerWidth = value
        }

        if (typeof newInnerWidth === 'number') {
          // Calculate content width by subtracting padding
          const computedStyle = window.getComputedStyle(element)
          const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
          const paddingRight = parseFloat(computedStyle.paddingRight) || 0
          const contentWidth = newInnerWidth - paddingLeft - paddingRight
          element.style.width = Math.max(0, contentWidth) + 'px'
        } else {
          element.style.width = newInnerWidth
        }
      }
    }

    return this
  }

  innerHeight(): number | undefined
  innerHeight(_value: number | string): JQuery
  innerHeight(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery
  innerHeight(
    value?:
      | number
      | string
      | ((_index: number, _currentHeight: number) => number | string),
  ): number | undefined | JQuery {
    // Getting inner height
    if (value === undefined) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      // Return height + padding
      const computedStyle = window.getComputedStyle(element)
      const height = parseFloat(computedStyle.height)
      const paddingTop = parseFloat(computedStyle.paddingTop)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)

      return (
        (isNaN(height) ? 0 : height) +
        (isNaN(paddingTop) ? 0 : paddingTop) +
        (isNaN(paddingBottom) ? 0 : paddingBottom)
      )
    }

    // Setting inner height
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newInnerHeight: number | string

        if (typeof value === 'function') {
          const computedStyle = window.getComputedStyle(element)
          const currentHeight = parseFloat(computedStyle.height) || 0
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
          const currentInnerHeight = currentHeight + paddingTop + paddingBottom
          newInnerHeight = value(i, currentInnerHeight)
        } else {
          newInnerHeight = value
        }

        if (typeof newInnerHeight === 'number') {
          // Calculate content height by subtracting padding
          const computedStyle = window.getComputedStyle(element)
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
          const contentHeight = newInnerHeight - paddingTop - paddingBottom
          element.style.height = Math.max(0, contentHeight) + 'px'
        } else {
          element.style.height = newInnerHeight
        }
      }
    }

    return this
  }

  outerWidth(_includeMargin?: boolean): number | undefined
  outerWidth(_value: number | string): JQuery
  outerWidth(
    _value: (_index: number, _currentWidth: number) => number | string,
  ): JQuery
  outerWidth(
    includeMarginOrValue?:
      | boolean
      | number
      | string
      | ((_index: number, _currentWidth: number) => number | string),
  ): number | undefined | JQuery {
    // Getting outer width
    if (
      includeMarginOrValue === undefined ||
      typeof includeMarginOrValue === 'boolean'
    ) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      const includeMargin = includeMarginOrValue === true

      // Return width + padding + border + (optionally margin)
      const computedStyle = window.getComputedStyle(element)
      const width = parseFloat(computedStyle.width)
      const paddingLeft = parseFloat(computedStyle.paddingLeft)
      const paddingRight = parseFloat(computedStyle.paddingRight)
      const borderLeft = parseFloat(computedStyle.borderLeftWidth)
      const borderRight = parseFloat(computedStyle.borderRightWidth)

      let result =
        (isNaN(width) ? 0 : width) +
        (isNaN(paddingLeft) ? 0 : paddingLeft) +
        (isNaN(paddingRight) ? 0 : paddingRight) +
        (isNaN(borderLeft) ? 0 : borderLeft) +
        (isNaN(borderRight) ? 0 : borderRight)

      if (includeMargin) {
        const marginLeft = parseFloat(computedStyle.marginLeft)
        const marginRight = parseFloat(computedStyle.marginRight)
        result +=
          (isNaN(marginLeft) ? 0 : marginLeft) +
          (isNaN(marginRight) ? 0 : marginRight)
      }

      return result
    }

    // Setting outer width
    const value = includeMarginOrValue
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newOuterWidth: number | string

        if (typeof value === 'function') {
          const computedStyle = window.getComputedStyle(element)
          const currentWidth = parseFloat(computedStyle.width) || 0
          const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
          const paddingRight = parseFloat(computedStyle.paddingRight) || 0
          const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
          const borderRight = parseFloat(computedStyle.borderRightWidth) || 0
          const currentOuterWidth =
            currentWidth + paddingLeft + paddingRight + borderLeft + borderRight
          newOuterWidth = value(i, currentOuterWidth)
        } else {
          newOuterWidth = value
        }

        if (typeof newOuterWidth === 'number') {
          // Calculate content width by subtracting padding and border
          const computedStyle = window.getComputedStyle(element)
          const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
          const paddingRight = parseFloat(computedStyle.paddingRight) || 0
          const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
          const borderRight = parseFloat(computedStyle.borderRightWidth) || 0
          const contentWidth =
            newOuterWidth -
            paddingLeft -
            paddingRight -
            borderLeft -
            borderRight
          element.style.width = Math.max(0, contentWidth) + 'px'
        } else {
          element.style.width = newOuterWidth
        }
      }
    }

    return this
  }

  outerHeight(_includeMargin?: boolean): number | undefined
  outerHeight(_value: number | string): JQuery
  outerHeight(
    _value: (_index: number, _currentHeight: number) => number | string,
  ): JQuery
  outerHeight(
    includeMarginOrValue?:
      | boolean
      | number
      | string
      | ((_index: number, _currentHeight: number) => number | string),
  ): number | undefined | JQuery {
    // Getting outer height
    if (
      includeMarginOrValue === undefined ||
      typeof includeMarginOrValue === 'boolean'
    ) {
      const element = this[0] as HTMLElement
      if (!element) return undefined

      const includeMargin = includeMarginOrValue === true

      // Return height + padding + border + (optionally margin)
      const computedStyle = window.getComputedStyle(element)
      const height = parseFloat(computedStyle.height)
      const paddingTop = parseFloat(computedStyle.paddingTop)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)
      const borderTop = parseFloat(computedStyle.borderTopWidth)
      const borderBottom = parseFloat(computedStyle.borderBottomWidth)

      let result =
        (isNaN(height) ? 0 : height) +
        (isNaN(paddingTop) ? 0 : paddingTop) +
        (isNaN(paddingBottom) ? 0 : paddingBottom) +
        (isNaN(borderTop) ? 0 : borderTop) +
        (isNaN(borderBottom) ? 0 : borderBottom)

      if (includeMargin) {
        const marginTop = parseFloat(computedStyle.marginTop)
        const marginBottom = parseFloat(computedStyle.marginBottom)
        result +=
          (isNaN(marginTop) ? 0 : marginTop) +
          (isNaN(marginBottom) ? 0 : marginBottom)
      }

      return result
    }

    // Setting outer height
    const value = includeMarginOrValue
    for (let i = 0; i < this.length; i++) {
      const element = this[i] as HTMLElement
      if (element && element.style) {
        let newOuterHeight: number | string

        if (typeof value === 'function') {
          const computedStyle = window.getComputedStyle(element)
          const currentHeight = parseFloat(computedStyle.height) || 0
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
          const borderTop = parseFloat(computedStyle.borderTopWidth) || 0
          const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0
          const currentOuterHeight =
            currentHeight +
            paddingTop +
            paddingBottom +
            borderTop +
            borderBottom
          newOuterHeight = value(i, currentOuterHeight)
        } else {
          newOuterHeight = value
        }

        if (typeof newOuterHeight === 'number') {
          // Calculate content height by subtracting padding and border
          const computedStyle = window.getComputedStyle(element)
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
          const borderTop = parseFloat(computedStyle.borderTopWidth) || 0
          const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0
          const contentHeight =
            newOuterHeight -
            paddingTop -
            paddingBottom -
            borderTop -
            borderBottom
          element.style.height = Math.max(0, contentHeight) + 'px'
        } else {
          element.style.height = newOuterHeight
        }
      }
    }

    return this
  }

  // DOM Traversal Methods

  find(selector: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        const descendants = element.querySelectorAll(selector)
        results.push(...Array.from(descendants))
      }
    }

    // Remove duplicates while preserving order
    const uniqueResults: Element[] = []
    const seen = new Set<Element>()
    for (const el of results) {
      if (!seen.has(el)) {
        seen.add(el)
        uniqueResults.push(el)
      }
    }

    const result = new JQuery()
    uniqueResults.forEach((el, index) => {
      result[index] = el
    })
    result.length = uniqueResults.length
    return result
  }

  parent(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element && element.parentElement) {
        const parent = element.parentElement

        // Filter by selector if provided
        if (!selector || parent.matches(selector)) {
          results.push(parent)
        }
      }
    }

    // Remove duplicates while preserving order
    const uniqueResults: Element[] = []
    const seen = new Set<Element>()
    for (const el of results) {
      if (!seen.has(el)) {
        seen.add(el)
        uniqueResults.push(el)
      }
    }

    const result = new JQuery()
    uniqueResults.forEach((el, index) => {
      result[index] = el
    })
    result.length = uniqueResults.length
    return result
  }

  parents(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        let parent = element.parentElement

        while (parent) {
          // Filter by selector if provided
          if (!selector || parent.matches(selector)) {
            results.push(parent)
          }
          parent = parent.parentElement
        }
      }
    }

    // Remove duplicates while preserving order
    const uniqueResults: Element[] = []
    const seen = new Set<Element>()
    for (const el of results) {
      if (!seen.has(el)) {
        seen.add(el)
        uniqueResults.push(el)
      }
    }

    const result = new JQuery()
    uniqueResults.forEach((el, index) => {
      result[index] = el
    })
    result.length = uniqueResults.length
    return result
  }

  children(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        const children = Array.from(element.children)

        for (const child of children) {
          // Filter by selector if provided
          if (!selector || child.matches(selector)) {
            results.push(child)
          }
        }
      }
    }

    const result = new JQuery()
    results.forEach((el, index) => {
      result[index] = el
    })
    result.length = results.length
    return result
  }

  siblings(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element && element.parentElement) {
        const siblings = Array.from(element.parentElement.children)

        for (const sibling of siblings) {
          // Skip the element itself
          if (sibling !== element) {
            // Filter by selector if provided
            if (!selector || sibling.matches(selector)) {
              results.push(sibling)
            }
          }
        }
      }
    }

    // Remove duplicates while preserving order
    const uniqueResults: Element[] = []
    const seen = new Set<Element>()
    for (const el of results) {
      if (!seen.has(el)) {
        seen.add(el)
        uniqueResults.push(el)
      }
    }

    const result = new JQuery()
    uniqueResults.forEach((el, index) => {
      result[index] = el
    })
    result.length = uniqueResults.length
    return result
  }

  next(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        const nextSibling = element.nextElementSibling

        if (nextSibling) {
          // Filter by selector if provided
          if (!selector || nextSibling.matches(selector)) {
            results.push(nextSibling)
          }
        }
      }
    }

    const result = new JQuery()
    results.forEach((el, index) => {
      result[index] = el
    })
    result.length = results.length
    return result
  }

  prev(selector?: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        const prevSibling = element.previousElementSibling

        if (prevSibling) {
          // Filter by selector if provided
          if (!selector || prevSibling.matches(selector)) {
            results.push(prevSibling)
          }
        }
      }
    }

    const result = new JQuery()
    results.forEach((el, index) => {
      result[index] = el
    })
    result.length = results.length
    return result
  }

  closest(selector: string): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        let current: Element | null = element

        while (current) {
          if (current.matches(selector)) {
            results.push(current)
            break
          }
          current = current.parentElement
        }
      }
    }

    // Remove duplicates while preserving order
    const uniqueResults: Element[] = []
    const seen = new Set<Element>()
    for (const el of results) {
      if (!seen.has(el)) {
        seen.add(el)
        uniqueResults.push(el)
      }
    }

    const result = new JQuery()
    uniqueResults.forEach((el, index) => {
      result[index] = el
    })
    result.length = uniqueResults.length
    return result
  }

  filter(_selector: string): JQuery
  filter(_fn: (_index: number, _element: Element) => boolean): JQuery
  filter(
    selectorOrFn: string | ((_index: number, _element: Element) => boolean),
  ): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        let shouldInclude = false

        if (typeof selectorOrFn === 'string') {
          shouldInclude = element.matches(selectorOrFn)
        } else {
          shouldInclude = selectorOrFn(i, element)
        }

        if (shouldInclude) {
          results.push(element)
        }
      }
    }

    const result = new JQuery()
    results.forEach((el, index) => {
      result[index] = el
    })
    result.length = results.length
    return result
  }

  not(_selector: string): JQuery
  not(_fn: (_index: number, _element: Element) => boolean): JQuery
  not(
    selectorOrFn: string | ((_index: number, _element: Element) => boolean),
  ): JQuery {
    const results: Element[] = []

    for (let i = 0; i < this.length; i++) {
      const element = this[i]
      if (element) {
        let shouldExclude = false

        if (typeof selectorOrFn === 'string') {
          shouldExclude = element.matches(selectorOrFn)
        } else {
          shouldExclude = selectorOrFn(i, element)
        }

        if (!shouldExclude) {
          results.push(element)
        }
      }
    }

    const result = new JQuery()
    results.forEach((el, index) => {
      result[index] = el
    })
    result.length = results.length
    return result
  }

  eq(index: number): JQuery {
    const result = new JQuery()

    // Handle negative indices
    const actualIndex = index < 0 ? this.length + index : index

    if (actualIndex >= 0 && actualIndex < this.length) {
      const element = this[actualIndex]
      if (element) {
        result[0] = element
        result.length = 1
      }
    }

    return result
  }

  first(): JQuery {
    return this.eq(0)
  }

  last(): JQuery {
    return this.eq(-1)
  }
}

// Global jQuery function
export function $(
  selector?: string | Element | NodeList | Window | Document | Function,
  context?: Element | JQuery,
): JQuery {
  return new JQuery(selector, context)
}

// Make $ available globally for tests
;(window as any).$ = $
