import type { JQuery } from './core.js'

declare global {
  interface Window {
    $: (
      _selector?: string | Element | NodeList | Window | Document | Function,
      _context?: Element | JQuery,
    ) => JQuery
  }

  // eslint-disable-next-line no-unused-vars
  const $: (
    _selector?: string | Element | NodeList | Window | Document | Function,
    _context?: Element | JQuery,
  ) => JQuery

  // eslint-disable-next-line no-unused-vars
  interface HTMLElement {
    _jQueryEventHandlers?: Record<
      string,
      Array<{
        originalHandler: EventListener | false
        wrappedHandler: EventListener
        selector?: string
        data?: any
      }>
    >
  }
}

export {}
