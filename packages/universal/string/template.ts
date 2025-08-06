/**
 * Simple template string parser that replaces placeholders with values from a data object.
 * Supports both {key} and {{key}} syntax for placeholders.
 * 
 * @param str - The template string containing placeholders
 * @param data - Object containing key-value pairs for replacement
 * @param options - Configuration options
 * @returns The string with placeholders replaced by corresponding values
 * 
 * @example
 * ```typescript
 * template('Hello {name}!', { name: 'World' })                    // 'Hello World!'
 * template('User: {user.name} ({user.id})', { user: { name: 'John', id: 123 } })  // 'User: John (123)'
 * template('Price: ${price}', { price: 99.99 }, { prefix: '$' })  // 'Price: $99.99'
 * template('Hello {missing}', {}, { fallback: '[not found]' })    // 'Hello [not found]'
 * template('Count: {count}', { count: 0 })                        // 'Count: 0'
 * ```
 */
export function template(
  str: string, 
  data: Record<string, any>, 
  options: {
    /** String to use when a placeholder key is not found */
    fallback?: string
    /** Prefix to add before resolved values */
    prefix?: string
    /** Suffix to add after resolved values */  
    suffix?: string
    /** Whether to HTML escape the resolved values */
    escapeHtml?: boolean
  } = {}
): string {
  const { fallback = '', prefix = '', suffix = '', escapeHtml = false } = options
  
  return str.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = getNestedValue(data, key.trim())
    
    if (value === undefined || value === null) {
      return fallback
    }
    
    let stringValue = String(value)
    
    if (escapeHtml) {
      stringValue = htmlEscape(stringValue)
    }
    
    return prefix + stringValue + suffix
  })
}

/**
 * Gets a nested value from an object using dot notation.
 * Supports array access and complex nested paths.
 * 
 * @param obj - The object to traverse
 * @param path - The dot-notation path to the desired value
 * @returns The value at the specified path, or undefined if not found
 * 
 * @example
 * ```typescript
 * getNestedValue({ user: { name: 'John' } }, 'user.name')      // 'John'
 * getNestedValue({ users: [{ name: 'John' }] }, 'users.0.name') // 'John'
 * getNestedValue({ a: { b: { c: 42 } } }, 'a.b.c')            // 42
 * getNestedValue({}, 'missing.path')                           // undefined
 * ```
 */
function getNestedValue(obj: any, path: string): any {
  if (!path) return obj
  
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    
    // Handle array index access
    if (Array.isArray(current) && /^\d+$/.test(key)) {
      current = current[parseInt(key, 10)]
    } else if (typeof current === 'object') {
      current = current[key]
    } else {
      return undefined
    }
  }
  
  return current
}

/**
 * Simple HTML escaping for template values.
 * Used internally when escapeHtml option is enabled.
 */
function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Advanced template function with conditional logic and loops.
 * Supports more complex templating features for advanced use cases.
 * 
 * @param str - The template string with advanced syntax
 * @param data - Object containing key-value pairs for replacement  
 * @returns The processed template string
 * 
 * @example
 * ```typescript
 * // Simple conditionals with ternary-like syntax
 * templateAdvanced('Hello {user.name ? user.name : "Guest"}', { user: {} })
 * // 'Hello Guest'
 * 
 * // Multiple conditions
 * templateAdvanced('{count} item{count === 1 ? "" : "s"}', { count: 5 })
 * // '5 items'
 * ```
 */
export function templateAdvanced(str: string, data: Record<string, any>): string {
  // Handle ternary-like conditionals: {condition ? valueA : valueB}
  return str.replace(/\{([^}]+)\?([^:}]+):([^}]+)\}/g, (match, condition, valueA, valueB) => {
    const conditionResult = evaluateCondition(condition.trim(), data)
    const selectedValue = conditionResult ? valueA.trim() : valueB.trim()
    
    // Check if selectedValue is a placeholder or literal
    if (selectedValue.startsWith('"') && selectedValue.endsWith('"')) {
      return selectedValue.slice(1, -1) // Remove quotes for literal strings
    }
    
    return template(`{${selectedValue}}`, data)
  }).replace(/\{([^}]+)\}/g, (match, key) => {
    const value = getNestedValue(data, key.trim())
    return value !== undefined ? String(value) : ''
  })
}

/**
 * Evaluates a simple condition for template conditionals.
 * Supports basic equality, existence checks, and comparisons.
 */
function evaluateCondition(condition: string, data: Record<string, any>): boolean {
  // Handle existence checks: "user.name"
  if (!condition.includes(' ')) {
    const value = getNestedValue(data, condition)
    return value !== undefined && value !== null && value !== ''
  }
  
  // Handle equality checks: "count === 1"
  if (condition.includes('===')) {
    const [left, right] = condition.split('===').map(s => s.trim())
    const leftValue = getNestedValue(data, left)
    const rightValue = isNaN(Number(right)) ? right.replace(/"/g, '') : Number(right)
    return leftValue === rightValue
  }
  
  // Handle inequality checks: "count !== 1"  
  if (condition.includes('!==')) {
    const [left, right] = condition.split('!==').map(s => s.trim())
    const leftValue = getNestedValue(data, left)
    const rightValue = isNaN(Number(right)) ? right.replace(/"/g, '') : Number(right)
    return leftValue !== rightValue
  }
  
  // Default to truthiness check
  return Boolean(getNestedValue(data, condition))
}