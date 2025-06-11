import fs from 'fs'
import os from 'os'

/**
 * Writes an object or array to a JSON file with proper formatting.
 * 
 * Features:
 * - Handles both objects and arrays
 * - Uses platform-specific line endings (EOL)
 * - Pretty prints with 2-space indentation
 * - For arrays, wraps them in an object with the filename as key
 * - Adds JSON serialization support for RegExp objects
 * 
 * @param {string} fileName - Name of the file (without .json extension)
 * @param {object|array} object - Data to write to the JSON file
 * 
 * @example
 * ```javascript
 * // Write object to file
 * const config = { name: 'MyApp', version: '1.0.0' }
 * writeJson('config', config) // Creates config.json
 * 
 * // Write array to file
 * const items = ['item1', 'item2', 'item3']
 * writeJson('items', items) // Creates items.json with { "items": [...] }
 * 
 * // Works with complex objects including RegExp
 * const data = { pattern: /test/g, values: [1, 2, 3] }
 * writeJson('data', data) // Creates data.json
 * ```
 */
export function writeJson(fileName, object) {
  if (Array.isArray(object)) {
    const obj = { [fileName]: object }
    fs.writeFileSync(
      fileName + '.json',
      JSON.stringify(obj, null, 2).replace(/\n/g, os.EOL) + os.EOL,
    )
    return
  }

  RegExp.prototype.toJSON = RegExp.prototype.toString
  fs.writeFileSync(
    fileName + '.json',
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL,
  )
}
