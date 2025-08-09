/**
 * Converts string to camelCase.
 * Handles various separators (spaces, hyphens, underscores) and removes them.
 *
 * @param str - The string to convert
 * @returns The camelCase version of the string
 *
 * @example
 * ```typescript
 * camelCase('hello world')     // 'helloWorld'
 * camelCase('hello-world')     // 'helloWorld'
 * camelCase('Hello_World')     // 'helloWorld'
 * camelCase('HELLO WORLD')     // 'helloWorld'
 * camelCase('  foo  bar  ')    // 'fooBar'
 * camelCase('xml-http-request') // 'xmlHttpRequest'
 * ```
 */
export function camelCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
}

/**
 * Converts string to kebab-case.
 * Replaces spaces, underscores, and camelCase with hyphens.
 *
 * @param str - The string to convert
 * @returns The kebab-case version of the string
 *
 * @example
 * ```typescript
 * kebabCase('hello world')     // 'hello-world'
 * kebabCase('helloWorld')      // 'hello-world'
 * kebabCase('Hello_World')     // 'hello-world'
 * kebabCase('XMLHttpRequest')  // 'x-m-l-http-request'
 * kebabCase('  foo  bar  ')    // 'foo-bar'
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Handle camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Handle consecutive capitals
    .replace(/[_\s]+/g, '-') // Replace underscores and spaces with hyphens
    .toLowerCase()
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Converts string to PascalCase.
 * Similar to camelCase but capitalizes the first letter.
 *
 * @param str - The string to convert
 * @returns The PascalCase version of the string
 *
 * @example
 * ```typescript
 * pascalCase('hello world')     // 'HelloWorld'
 * pascalCase('hello-world')     // 'HelloWorld'
 * pascalCase('hello_world')     // 'HelloWorld'
 * pascalCase('HELLO WORLD')     // 'HelloWorld'
 * pascalCase('xml-http-request') // 'XmlHttpRequest'
 * ```
 */
export function pascalCase(str: string): string {
  const camelCased = camelCase(str)
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1)
}

/**
 * Converts string to CONSTANT_CASE.
 * Converts to uppercase with underscores separating words.
 *
 * @param str - The string to convert
 * @returns The CONSTANT_CASE version of the string
 *
 * @example
 * ```typescript
 * constantCase('hello world')     // 'HELLO_WORLD'
 * constantCase('helloWorld')      // 'HELLO_WORLD'
 * constantCase('Hello-World')     // 'HELLO_WORLD'
 * constantCase('XMLHttpRequest')  // 'X_M_L_HTTP_REQUEST'
 * constantCase('  foo  bar  ')    // 'FOO_BAR'
 * ```
 */
export function constantCase(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Handle camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Handle consecutive capitals
    .replace(/[-\s]+/g, '_') // Replace hyphens and spaces with underscores
    .toUpperCase()
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
}
