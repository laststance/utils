/**
 * String literal type that matches HTTP and HTTPS URLs.
 * Uses template literal types to enforce URL format with domain and TLD.
 *
 * @example
 * ```typescript
 * // Valid URLs
 * const url1: URLType = 'https://example.com'
 * const url2: URLType = 'http://subdomain.example.org'
 * const url3: URLType = 'https://api.service.co.uk'
 *
 * // TypeScript will reject invalid formats
 * // const invalid1: URLType = 'ftp://example.com'     // Error: not http/https
 * // const invalid2: URLType = 'https://example'       // Error: no TLD
 * // const invalid3: URLType = 'example.com'           // Error: no protocol
 *
 * // Use in function parameters
 * function fetchFromAPI(endpoint: URLType) {
 *   return fetch(endpoint)
 * }
 *
 * fetchFromAPI('https://api.example.com') // ✅ Valid
 * ```
 */
declare type URLType = `http${'s' | ''}://${string}.${string}`
