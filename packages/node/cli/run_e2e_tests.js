#!/usr/bin/env node
// https://github.com/bvaughn/planner/blob/a7d0d15b79b95a7c5a10853bcda0b5f142505a2c/run_e2e_tests.js
'use strict'

import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_PATH = join(__dirname)

const TIMEOUT_DURATION = 60000

let buildProcess = null
let serverProcess = null
let testProcess = null

function format(loggable) {
  return `${loggable}`
    .split('\n')
    .filter((line) => {
      return line.trim() !== ''
    })
    .map((line) => `  ${line}`)
    .join('\n')
}

function logBright(loggable) {
  console.log(`\x1b[1m${loggable}\x1b[0m`)
}

function logDim(loggable) {
  const formatted = format(loggable, 2)
  if (formatted !== '') {
    console.log(`\x1b[2m${formatted}\x1b[0m`)
  }
}

function logError(loggable) {
  const formatted = format(loggable, 2)
  if (formatted !== '') {
    console.error(`\x1b[31m${formatted}\x1b[0m`)
  }
}

function build() {
  const timeoutID = setTimeout(() => {
    logError('Build timed out')

    exitWithCode(1)
  }, TIMEOUT_DURATION)

  logBright('Building project')

  buildProcess = spawn('yarn', ['build'], { cwd: ROOT_PATH })
  buildProcess.stdout.on('data', (data) => {
    logDim(data)
  })
  buildProcess.stderr.on('data', (data) => {
    const stringified = `${data}`.trim()
    if (stringified.startsWith('warn')) {
      logDim(data)
    } else if (stringified) {
      logError(`Error:\n${stringified}`)

      // Most of the things coming through on stderr are warnings.
      // Log them but rely on the build timeout to infer a true fatal error.
      // exitWithCode(1);
    }
  })
  buildProcess.on('close', () => {
    logBright('Project built')

    clearTimeout(timeoutID)

    runServer()
  })
}

function runServer() {
  const timeoutID = setTimeout(() => {
    logError('Server failed to start')

    exitWithCode(1)
  }, TIMEOUT_DURATION)

  logBright('Starting server')

  let severStarted = false

  const localEnv = {}
  try {
    const localEnvContent = readFileSync('./.env.local', { encoding: 'utf8' })
    localEnvContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key) {
          localEnv[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
  } catch (error) {
    // .env.local file not found, continue without it
    logDim('No .env.local file found, using default environment')
  }

  serverProcess = spawn('yarn', ['start'], {
    cwd: ROOT_PATH,
    env: { ...process.env, ...localEnv },
  })
  serverProcess.stdout.on('data', (data) => {
    const stringified = `${data}`.trim()

    if (!severStarted) {
      logDim(stringified)
    }

    if (stringified.includes('started server')) {
      logBright('Testing server running')

      severStarted = true

      clearTimeout(timeoutID)

      runEndToEndTests()
    }
  })
  serverProcess.stderr.on('data', (data) => {
    const stringified = `${data}`.trim()
    if (stringified.includes('EADDRINUSE')) {
      // Something is occuprying this port;
      // We could kill the process and restart but probably better to prompt the user to do this.

      logError('Free up the port and re-run tests:')
      logBright('  kill -9 $(lsof -ti:8080)')

      exitWithCode(1)
    } else if (stringified.includes('ERROR')) {
      logError(`Error:\n${data}`)

      exitWithCode(1)
    } else {
      // Non-fatal stuff like Babel optimization warnings etc.
      logDim(data)
    }
  })
}

async function runEndToEndTests() {
  logBright('Running e2e tests')

  testProcess = spawn('yarn', ['test:e2e'], { cwd: ROOT_PATH })
  testProcess.stdout.on('data', (data) => {
    // Log without formatting because Playwright applies its own formatting.
    const formatted = format(data)
    if (formatted !== '') {
      console.log(formatted)
    }
  })
  testProcess.stderr.on('data', (data) => {
    // Log without formatting because Playwright applies its own formatting.
    const formatted = format(data)
    if (formatted !== '') {
      console.error(formatted)
    }

    exitWithCode(1)
  })
  testProcess.on('close', (code) => {
    logBright(`Tests completed with code: ${code}`)

    exitWithCode(code)
  })
}

function exitWithCode(code) {
  if (buildProcess !== null) {
    try {
      logBright('Shutting down build process')
      buildProcess.kill()
    } catch (error) {
      logError(error)
    }
  }

  if (serverProcess !== null) {
    try {
      logBright('Shutting down server process')
      serverProcess.kill()
    } catch (error) {
      logError(error)
    }
  }

  if (testProcess !== null) {
    try {
      logBright('Shutting down test process')
      testProcess.kill()
    } catch (error) {
      logError(error)
    }
  }

  logBright(`Exiting with code ${code}`)
  process.exit(code)
}

// Export functions for testing
export {
  build,
  runServer,
  runEndToEndTests,
  exitWithCode,
  logBright,
  logDim,
  logError,
  format,
}

// Only run if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  build()
}
