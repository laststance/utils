import * as fs from 'node:fs/promises'

/**
 * Reads a file from the filesystem and parses it as JSON.
 * Provides clear error messages if the file doesn't exist or contains invalid JSON.
 * 
 * @param filePath - Path to the JSON file to read
 * @returns Parsed JSON content as unknown type (requires type assertion)
 * @throws {Error} If file doesn't exist or contains invalid JSON
 * 
 * @example
 * ```typescript
 * // Read a config file
 * const config = await readFileAsJson('./config.json') as Config
 * 
 * // Read package.json
 * const pkg = await readFileAsJson('./package.json') as { name: string; version: string }
 * 
 * // Handle errors
 * try {
 *   const data = await readFileAsJson('./data.json')
 *   console.log(data)
 * } catch (error) {
 *   console.error('Failed to read JSON file:', error.message)
 * }
 * ```
 */
export async function readFileAsJson(filePath: string) {
  try {
    return JSON.parse((await fs.readFile(filePath)).toString()) as unknown
  } catch (error) {
    throw new Error(
      `Could not read file from ${filePath} as JSON. Please ensure the file exists and is valid JSON.`,
      { cause: error },
    )
  }
}
