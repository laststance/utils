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
