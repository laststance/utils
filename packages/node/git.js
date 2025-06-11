const exec = require('child_process')

/**
 * Executes a git command asynchronously and returns the output.
 * Runs git commands through child_process and handles both success and error cases.
 * 
 * @param {string} args - Git command arguments to execute (without 'git' prefix)
 * @returns {Promise<string>} Promise that resolves with trimmed stdout or rejects with error
 * 
 * @example
 * ```javascript
 * // Get current branch
 * const branch = await git('branch --show-current')
 * 
 * // Get commit hash
 * const hash = await git('rev-parse HEAD')
 * 
 * // Get status
 * const status = await git('status --porcelain')
 * 
 * // Handle errors
 * try {
 *   const result = await git('log --oneline -10')
 *   console.log(result)
 * } catch (error) {
 *   console.error('Git command failed:', error.message)
 * }
 * ```
 */
export async function git(args) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}
