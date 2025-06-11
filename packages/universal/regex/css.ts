/**
 * Regular expression to match CSS files.
 * Matches files ending with .css extension.
 * 
 * @example
 * ```typescript
 * cssRegex.test('styles.css')           // true
 * cssRegex.test('component.module.css') // true
 * cssRegex.test('file.scss')            // false
 * ```
 */
export const cssRegex = /\.css$/

/**
 * Regular expression to match CSS Module files.
 * Matches files with .module.css extension.
 * 
 * @example
 * ```typescript
 * cssModuleRegex.test('component.module.css')  // true
 * cssModuleRegex.test('styles.css')            // false
 * cssModuleRegex.test('file.module.scss')      // false
 * ```
 */
export const cssModuleRegex = /\.module\.css$/

/**
 * Regular expression to match Sass/SCSS files.
 * Matches files ending with .scss or .sass extension.
 * 
 * @example
 * ```typescript
 * sassRegex.test('styles.scss')         // true
 * sassRegex.test('styles.sass')         // true
 * sassRegex.test('styles.css')          // false
 * ```
 */
export const sassRegex = /\.(scss|sass)$/

/**
 * Regular expression to match Sass/SCSS Module files.
 * Matches files with .module.scss or .module.sass extension.
 * 
 * @example
 * ```typescript
 * sassModuleRegex.test('component.module.scss')  // true
 * sassModuleRegex.test('component.module.sass')  // true
 * sassModuleRegex.test('styles.scss')            // false
 * sassModuleRegex.test('component.module.css')   // false
 * ```
 */
export const sassModuleRegex = /\.module\.(scss|sass)$/
