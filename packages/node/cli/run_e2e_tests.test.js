import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EventEmitter } from 'events'

describe('run_e2e_tests', () => {
  let mockProcess
  let originalConsoleLog
  let originalConsoleError
  let originalProcessExit
  let consoleLogSpy
  let consoleErrorSpy
  let processExitSpy
  let originalSetTimeout
  let originalClearTimeout
  let setTimeoutSpy
  let clearTimeoutSpy
  let mockSpawn
  let mockReadFileSync
  let runE2ETests

  // Helper to create mock child process
  const createMockProcess = () => {
    const process = new EventEmitter()
    process.stdout = new EventEmitter()
    process.stderr = new EventEmitter()
    process.kill = vi.fn()
    return process
  }

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    
    // Mock console methods
    originalConsoleLog = console.log
    originalConsoleError = console.error
    consoleLogSpy = vi.fn()
    consoleErrorSpy = vi.fn()
    console.log = consoleLogSpy
    console.error = consoleErrorSpy

    // Mock process.exit
    originalProcessExit = process.exit
    processExitSpy = vi.fn()
    process.exit = processExitSpy

    // Mock timers
    originalSetTimeout = global.setTimeout
    originalClearTimeout = global.clearTimeout
    setTimeoutSpy = vi.fn((fn, delay) => {
      // Return a mock timer ID
      return { id: 'timer', fn, delay }
    })
    clearTimeoutSpy = vi.fn()
    global.setTimeout = setTimeoutSpy
    global.clearTimeout = clearTimeoutSpy

    // Setup default mock process
    mockProcess = createMockProcess()
    
    // Create mocks
    mockSpawn = vi.fn().mockReturnValue(mockProcess)
    mockReadFileSync = vi.fn().mockReturnValue('NODE_ENV=test\\nAPI_URL=http://localhost:3000')

    // Mock the modules before importing
    vi.doMock('child_process', () => ({
      spawn: mockSpawn
    }))
    
    vi.doMock('fs', () => ({
      readFileSync: mockReadFileSync
    }))
    
    vi.doMock('path', () => ({
      join: vi.fn((...args) => args.join('/')),
      dirname: vi.fn((path) => path.split('/').slice(0, -1).join('/'))
    }))
    
    vi.doMock('url', () => ({
      fileURLToPath: vi.fn((url) => url.replace('file://', ''))
    }))

    // Import the module after mocks are set up
    runE2ETests = await import('../cli/run_e2e_tests.js')
  })

  afterEach(() => {
    // Restore original functions
    console.log = originalConsoleLog
    console.error = originalConsoleError
    process.exit = originalProcessExit
    global.setTimeout = originalSetTimeout
    global.clearTimeout = originalClearTimeout
    vi.restoreAllMocks()
  })

  describe('initialization and build process', () => {
    it('should start build process immediately', async () => {
      // Call build function explicitly
      runE2ETests.build()

      expect(mockSpawn).toHaveBeenCalledWith('yarn', ['build'], expect.objectContaining({
        cwd: expect.any(String)
      }))
    })

    it('should set build timeout', async () => {
      runE2ETests.build()

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
    })

    it('should log build start message', async () => {
      runE2ETests.build()

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Building project'))
    })

    it('should handle build completion', async () => {
      runE2ETests.build()

      // Simulate build completion
      mockProcess.emit('close', 0)

      expect(clearTimeoutSpy).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Project built'))
    })

    it('should handle build timeout', async () => {
      runE2ETests.build()

      // Get the timeout callback and execute it
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Build timed out'))
      expect(processExitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('server startup process', () => {
    it('should start server after build completion', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build
      mockProcess.emit('close', 0)

      // Verify server start
      expect(mockSpawn).toHaveBeenCalledWith('yarn', ['start'], expect.objectContaining({
        cwd: expect.any(String),
        env: expect.any(Object)
      }))
    })

    it('should read .env.local for server environment', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build
      mockProcess.emit('close', 0)

      expect(mockReadFileSync).toHaveBeenCalledWith('./.env.local', { encoding: 'utf8' })
    })

    it('should set server timeout', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build (this triggers server start)
      mockProcess.emit('close', 0)

      // Should have set two timeouts - one for build, one for server
      expect(setTimeoutSpy).toHaveBeenCalledTimes(2)
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 60000)
    })

    it('should detect server startup from stdout', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build
      mockProcess.emit('close', 0)

      // Simulate server startup message
      serverProcess.stdout.emit('data', 'started server on port 8080')

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Testing server running'))
    })

    it('should handle EADDRINUSE error', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build to trigger server
      mockProcess.emit('close', 0)

      // Simulate port in use error
      serverProcess.stderr.emit('data', 'Error: listen EADDRINUSE :::8080')

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Free up the port'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('kill -9 $(lsof -ti:8080)'))
      expect(processExitSpy).toHaveBeenCalledWith(1)
    })

    it('should handle server errors', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete the build to trigger server
      mockProcess.emit('close', 0)

      // Simulate server error
      serverProcess.stderr.emit('data', 'ERROR: Something went wrong')

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'))
      expect(processExitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('e2e test execution', () => {
    it('should start e2e tests after server is ready', async () => {
      // Setup all processes mock
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)
      
      runE2ETests.build()

      // Complete build
      mockProcess.emit('close', 0)
      
      // Server ready
      serverProcess.stdout.emit('data', 'started server on port 8080')

      // Should start e2e tests
      expect(mockSpawn).toHaveBeenCalledWith('yarn', ['test:e2e'], expect.objectContaining({
        cwd: expect.any(String)
      }))
    })

    it('should log e2e test start', async () => {
      // Setup all processes mock
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)
        
      runE2ETests.build()

      // Complete build
      mockProcess.emit('close', 0)
      serverProcess.stdout.emit('data', 'started server')

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Running e2e tests'))
    })

    it('should handle e2e test completion', async () => {
      // Setup all processes mock
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)
        
      runE2ETests.build()

      // Complete build
      mockProcess.emit('close', 0)
      serverProcess.stdout.emit('data', 'started server')

      // Complete tests
      testProcess.emit('close', 0)

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Tests completed with code: 0'))
      expect(processExitSpy).toHaveBeenCalledWith(0)
    })

    it('should handle e2e test failures', async () => {
      // Setup all mocks before calling build
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)

      runE2ETests.build()

      // Complete build
      mockProcess.emit('close', 0)
      
      // Server ready
      serverProcess.stdout.emit('data', 'started server')

      // Test failure
      testProcess.emit('close', 1)

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Tests completed with code: 1'))
      expect(processExitSpy).toHaveBeenCalledWith(1)
    })

    it('should handle e2e test stderr as failure', async () => {
      // Setup all mocks before calling build
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)

      runE2ETests.build()

      // Complete build
      mockProcess.emit('close', 0)
      
      // Server ready
      serverProcess.stdout.emit('data', 'started server')

      // Test stderr output
      testProcess.stderr.emit('data', 'Test failed with error')

      expect(processExitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('process cleanup', () => {
    it('should kill build process on exit', async () => {
      runE2ETests.build()

      const buildProcess = mockProcess
      
      // Simulate exit
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback() // This triggers exitWithCode

      expect(buildProcess.kill).toHaveBeenCalled()
    })

    it('should handle process kill errors gracefully', async () => {
      runE2ETests.build()

      const buildProcess = mockProcess
      buildProcess.kill.mockImplementation(() => {
        throw new Error('Kill failed')
      })
      
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      
      // Should not throw when kill fails
      expect(() => timeoutCallback()).not.toThrow()
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Kill failed'))
    })

    it('should log shutdown messages', async () => {
      runE2ETests.build()

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Shutting down build process'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Exiting with code'))
    })
  })

  describe('logging and formatting', () => {
    it('should format log output correctly', async () => {
      runE2ETests.build()

      // Test the format function indirectly by checking stdout handling
      mockProcess.stdout.emit('data', 'Build output\\nwith multiple lines\\n\\n')

      // Verify output was processed (content will be formatted)
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should use bright logging for important messages', async () => {
      runE2ETests.build()

      // Check for ANSI color codes in logs (using actual ANSI escape sequences)
      const brightLogs = consoleLogSpy.mock.calls.filter(call => 
        call[0] && call[0].includes('\x1b[1m') && call[0].includes('\x1b[0m')
      )
      expect(brightLogs.length).toBeGreaterThan(0)
    })

    it('should use dim logging for process output', async () => {
      runE2ETests.build()

      mockProcess.stdout.emit('data', 'Build output message')

      // Should log with dim formatting (using actual ANSI escape sequences)
      const dimLogs = consoleLogSpy.mock.calls.filter(call => 
        call[0] && call[0].includes('\x1b[2m') && call[0].includes('\x1b[0m')
      )
      expect(dimLogs.length).toBeGreaterThan(0)
    })

    it('should use error logging for failures', async () => {
      runE2ETests.build()

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      // Should log errors with red color codes (using actual ANSI escape sequences)
      const errorLogs = consoleErrorSpy.mock.calls.filter(call => 
        call[0] && call[0].includes('\x1b[31m') && call[0].includes('\x1b[0m')
      )
      expect(errorLogs.length).toBeGreaterThan(0)
    })
  })

  describe('full workflow integration', () => {
    it('should complete successful end-to-end workflow', async () => {
      // Setup mocks for all processes
      const serverProcess = createMockProcess()
      const testProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess)
        .mockReturnValueOnce(serverProcess)
        .mockReturnValueOnce(testProcess)
      
      runE2ETests.build()

      // Step 1: Build completes
      mockProcess.emit('close', 0)

      // Step 2: Server starts
      serverProcess.stdout.emit('data', 'started server on port 8080')

      // Step 3: Tests run and pass
      testProcess.emit('close', 0)

      // Verify complete workflow
      expect(mockSpawn).toHaveBeenCalledTimes(3) // build, server, tests
      expect(processExitSpy).toHaveBeenCalledWith(0)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Building project'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Project built'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Testing server running'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Running e2e tests'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Tests completed'))
    })

    it('should handle workflow failure at any stage', async () => {
      runE2ETests.build()

      // Fail at build stage
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(processExitSpy).toHaveBeenCalledWith(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Build timed out'))
    })
  })

  describe('environment and configuration', () => {
    it('should use correct working directory', async () => {
      runE2ETests.build()

      expect(mockSpawn).toHaveBeenCalledWith('yarn', ['build'], expect.objectContaining({
        cwd: expect.any(String)
      }))
    })

    it('should merge environment variables for server', async () => {
      // Setup server process mock
      const serverProcess = createMockProcess()
      mockSpawn.mockReturnValueOnce(mockProcess).mockReturnValueOnce(serverProcess)
      
      runE2ETests.build()

      // Complete build to trigger server start
      mockProcess.emit('close', 0)

      expect(mockSpawn).toHaveBeenCalledWith('yarn', ['start'], expect.objectContaining({
        env: expect.objectContaining({
          NODE_ENV: expect.any(String)
        })
      }))
    })
  })
})