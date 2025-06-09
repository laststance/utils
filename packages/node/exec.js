import { spawn } from 'node:child_process'

/**
 * Executes a command asynchronously.
 *
 * @param {string} command - The command to be executed.
 * @param {object} options - Additional options for the command execution.
 * @return {Promise} A promise that resolves when the command execution is successful and rejects when it fails.
 */
export async function exec(command, options) {
  const child = spawn(command, { shell: true, stdio: 'inherit', ...options })
  await new Promise((res, rej) => {
    child.on('exit', (code) => {
      if (code === 0) {
        res()
      } else {
        rej()
      }
    })
  })
}
