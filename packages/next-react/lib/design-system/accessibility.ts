/**
 * Apple-inspired Accessibility System
 * Based on Apple's accessibility guidelines and WCAG 2.1 AA standards
 * Ensures inclusive design for all users
 */


// Screen Reader Only Classes
export const srOnly = 'sr-only'
export const notSrOnly = 'not-sr-only'

// Focus Management
export const focusStyles = {
  default: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  inset: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
  custom: (color: string) => `focus:outline-none focus-visible:ring-2 focus-visible:ring-${color} focus-visible:ring-offset-2`,
  none: 'focus:outline-none',
}

// Keyboard Navigation
export const keyboardNav = {
  tabIndex: (index: number) => ({ tabIndex: index }),
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50',
  roving: (isActive: boolean) => ({
    tabIndex: isActive ? 0 : -1,
    'aria-selected': isActive,
  }),
}

// ARIA Attributes
export const aria = {
  // Live Regions
  live: {
    polite: { 'aria-live': 'polite' as const },
    assertive: { 'aria-live': 'assertive' as const },
    off: { 'aria-live': 'off' as const },
  },
  
  // Roles
  role: {
    button: { role: 'button' as const },
    navigation: { role: 'navigation' as const },
    main: { role: 'main' as const },
    complementary: { role: 'complementary' as const },
    banner: { role: 'banner' as const },
    contentinfo: { role: 'contentinfo' as const },
    search: { role: 'search' as const },
    form: { role: 'form' as const },
    alert: { role: 'alert' as const },
    dialog: { role: 'dialog' as const },
    menu: { role: 'menu' as const },
    menuitem: { role: 'menuitem' as const },
    tab: { role: 'tab' as const },
    tablist: { role: 'tablist' as const },
    tabpanel: { role: 'tabpanel' as const },
  },
  
  // States
  state: {
    expanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded }),
    selected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
    checked: (isChecked: boolean) => ({ 'aria-checked': isChecked }),
    pressed: (isPressed: boolean) => ({ 'aria-pressed': isPressed }),
    disabled: (isDisabled: boolean) => ({ 'aria-disabled': isDisabled }),
    hidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden }),
    current: (current: 'page' | 'step' | 'location' | 'date' | 'time' | boolean) => ({ 'aria-current': current }),
  },
  
  // Properties
  props: {
    label: (label: string) => ({ 'aria-label': label }),
    labelledBy: (id: string) => ({ 'aria-labelledby': id }),
    describedBy: (id: string) => ({ 'aria-describedby': id }),
    controls: (id: string) => ({ 'aria-controls': id }),
    orientation: (orientation: 'horizontal' | 'vertical') => ({ 'aria-orientation': orientation }),
    valueNow: (value: number) => ({ 'aria-valuenow': value }),
    valueMin: (value: number) => ({ 'aria-valuemin': value }),
    valueMax: (value: number) => ({ 'aria-valuemax': value }),
    valueText: (text: string) => ({ 'aria-valuetext': text }),
    level: (level: number) => ({ 'aria-level': level }),
    setSize: (size: number) => ({ 'aria-setsize': size }),
    posInSet: (position: number) => ({ 'aria-posinset': position }),
  },
}

// Reduced Motion Support
export const motion = {
  reduce: 'motion-reduce:transition-none motion-reduce:animate-none',
  safe: 'motion-safe:transition-all motion-safe:animate-bounce',
}

// High Contrast Mode Support
export const contrast = {
  more: {
    text: 'contrast-more:font-bold contrast-more:text-foreground',
    border: 'contrast-more:border-2 contrast-more:border-foreground',
    outline: 'contrast-more:outline-2 contrast-more:outline-foreground',
  },
  less: {
    text: 'contrast-less:text-foreground/90',
    border: 'contrast-less:border-foreground/30',
  },
}

// Touch Target Sizes (Apple HIG: minimum 44x44 points)
export const touchTarget = {
  minimum: 'min-h-[44px] min-w-[44px]',
  comfortable: 'min-h-[48px] min-w-[48px]',
  spacious: 'min-h-[56px] min-w-[56px]',
}

// Color Contrast Utilities
export const colorContrast = {
  // Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
  aa: {
    normal: 'text-foreground', // Assumes proper theming
    large: 'text-foreground/90',
  },
  // Ensure WCAG AAA compliance (7:1 for normal text, 4.5:1 for large text)
  aaa: {
    normal: 'text-foreground font-medium',
    large: 'text-foreground',
  },
}

// Semantic HTML Helpers
export const semantic = {
  landmark: (type: 'main' | 'nav' | 'aside' | 'header' | 'footer' | 'section') => {
    const landmarks = {
      main: { role: 'main' as const },
      nav: { role: 'navigation' as const },
      aside: { role: 'complementary' as const },
      header: { role: 'banner' as const },
      footer: { role: 'contentinfo' as const },
      section: { role: 'region' as const },
    }
    return landmarks[type]
  },
  
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6) => ({
    role: 'heading' as const,
    'aria-level': level,
  }),
  
  list: {
    ordered: { role: 'list' as const },
    unordered: { role: 'list' as const },
    item: { role: 'listitem' as const },
  },
}

// Form Accessibility
export const form = {
  field: {
    required: (isRequired: boolean) => ({ 'aria-required': isRequired }),
    invalid: (isInvalid: boolean) => ({ 'aria-invalid': isInvalid }),
    readonly: (isReadonly: boolean) => ({ 'aria-readonly': isReadonly }),
  },
  
  validation: {
    error: (id: string) => ({ 'aria-errormessage': id }),
    description: (id: string) => ({ 'aria-describedby': id }),
  },
  
  group: {
    fieldset: { role: 'group' as const },
    radiogroup: { role: 'radiogroup' as const },
  },
}

// Announce Helper for Dynamic Content
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = srOnly
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus Trap Helper
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    }
  }
  
  element.addEventListener('keydown', handleKeyDown)
  firstFocusable?.focus()
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

// Skip Navigation Component Props
export interface SkipNavProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

// Visually Hidden Component Props
export interface VisuallyHiddenProps {
  children: React.ReactNode
  asChild?: boolean
}

// Accessibility Checker Helper
export function checkA11y(element: HTMLElement): string[] {
  const issues: string[] = []
  
  // Check for missing alt text on images
  const images = element.querySelectorAll('img')
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.src}`)
    }
  })
  
  // Check for missing labels on form inputs
  const inputs = element.querySelectorAll('input, textarea, select')
  inputs.forEach(input => {
    const id = input.getAttribute('id')
    if (!id || !element.querySelector(`label[for="${id}"]`)) {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push(`Form input missing label: ${input.outerHTML.substring(0, 50)}...`)
      }
    }
  })
  
  // Check for empty buttons
  const buttons = element.querySelectorAll('button')
  buttons.forEach(button => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      issues.push('Button missing accessible text')
    }
  })
  
  // Check for proper heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let lastLevel = 0
  headings.forEach(heading => {
    const tagChar = heading.tagName[1]
    if (tagChar) {
      const level = parseInt(tagChar)
      if (level > lastLevel + 1) {
        issues.push(`Heading hierarchy issue: h${lastLevel} followed by h${level}`)
      }
      lastLevel = level
    }
  })
  
  return issues
}

// Keyboard Navigation Hook Types
export interface UseKeyboardNavOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  loop?: boolean
  onSelect?: (index: number) => void
}

// Roving Tab Index Hook Types
export interface UseRovingTabIndexOptions {
  size: number
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
}

// Export complete accessibility system
export const a11y = {
  sr: { only: srOnly, notOnly: notSrOnly },
  focus: focusStyles,
  keyboard: keyboardNav,
  aria,
  motion,
  contrast,
  touch: touchTarget,
  color: colorContrast,
  semantic,
  form,
  utils: {
    announce,
    trapFocus,
    checkA11y,
  },
}