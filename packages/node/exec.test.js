import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { spawn } from 'node:child_process'
import { exec } from './exec.js'

// Mock spawn
vi.mock('node:child_process', () => ({
  spawn: vi.fn()
}))

describe('exec', () => {
  let mockChild
  let spawnMock

  beforeEach(() => {
    // Create a mock child process object
    mockChild = {
      on: vi.fn()
    }
    
    spawnMock = vi.mocked(spawn)
    spawnMock.mockReturnValue(mockChild)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('successful command execution', () => {
    it('should execute a simple command successfully', async () => {
      // Setup mock to simulate successful execution
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          // Simulate successful exit with code 0
          setTimeout(() => callback(0), 0)
        }
      })

      const promise = exec('echo "hello world"')
      
      expect(spawnMock).toHaveBeenCalledWith('echo "hello world"', {
        shell: true,
        stdio: 'inherit'
      })

      await expect(promise).resolves.toBeUndefined()
    })

    it('should execute command with custom options', async () => {
      const customOptions = {
        cwd: '/tmp',
        env: { NODE_ENV: 'test' },
        encoding: 'utf8'
      }

      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('ls -la', customOptions)

      expect(spawnMock).toHaveBeenCalledWith('ls -la', {
        shell: true,
        stdio: 'inherit',
        ...customOptions
      })
    })

    it('should override default options with provided options', async () => {
      const customOptions = {
        shell: false,
        stdio: 'pipe'
      }

      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('node --version', customOptions)

      expect(spawnMock).toHaveBeenCalledWith('node --version', {
        shell: false,  // Should override default
        stdio: 'pipe', // Should override default
      })
    })
  })

  describe('failed command execution', () => {
    it('should reject when command exits with non-zero code', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          // Simulate failure with exit code 1
          setTimeout(() => callback(1), 0)
        }
      })

      const promise = exec('exit 1')
      
      await expect(promise).rejects.toBeUndefined()
    })

    it('should reject with different exit codes', async () => {
      const testCases = [1, 2, 127, 255]
      
      for (const exitCode of testCases) {
        mockChild.on.mockImplementation((event, callback) => {
          if (event === 'exit') {
            setTimeout(() => callback(exitCode), 0)
          }
        })

        const promise = exec(`exit ${exitCode}`)
        await expect(promise).rejects.toBeUndefined()
      }
    })
  })

  describe('command variations', () => {
    it('should handle commands with arguments', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('git status --porcelain')

      expect(spawnMock).toHaveBeenCalledWith('git status --porcelain', {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle commands with pipes and redirections', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('ls -la | grep test > output.txt')

      expect(spawnMock).toHaveBeenCalledWith('ls -la | grep test > output.txt', {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle commands with environment variables', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('NODE_ENV=production npm start')

      expect(spawnMock).toHaveBeenCalledWith('NODE_ENV=production npm start', {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle complex shell commands', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      const complexCommand = 'for file in *.js; do echo "Processing $file"; done'
      await exec(complexCommand)

      expect(spawnMock).toHaveBeenCalledWith(complexCommand, {
        shell: true,
        stdio: 'inherit'
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty command string', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('')

      expect(spawnMock).toHaveBeenCalledWith('', {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle commands with special characters', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      const specialCommand = 'echo "Hello & goodbye; test | more"'
      await exec(specialCommand)

      expect(spawnMock).toHaveBeenCalledWith(specialCommand, {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle undefined options', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('echo test', undefined)

      expect(spawnMock).toHaveBeenCalledWith('echo test', {
        shell: true,
        stdio: 'inherit'
      })
    })

    it('should handle null options', async () => {
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('echo test', null)

      expect(spawnMock).toHaveBeenCalledWith('echo test', {
        shell: true,
        stdio: 'inherit'
      })
    })
  })

  describe('concurrent execution', () => {
    it('should handle multiple concurrent executions', async () => {
      spawnMock.mockImplementation(() => {
        const child = {
          on: vi.fn((event, callback) => {
            if (event === 'exit') {
              setTimeout(() => callback(0), Math.random() * 10) // Random delay
            }
          })
        }
        return child
      })

      const promises = [
        exec('echo "command1"'),
        exec('echo "command2"'),
        exec('echo "command3"')
      ]

      await Promise.all(promises)

      expect(spawnMock).toHaveBeenCalledTimes(3)
    })

    it('should handle mixed success and failure in concurrent executions', async () => {
      let callCount = 0
      spawnMock.mockImplementation(() => {
        const exitCode = callCount++ % 2 === 0 ? 0 : 1 // Alternate between success and failure
        const child = {
          on: vi.fn((event, callback) => {
            if (event === 'exit') {
              setTimeout(() => callback(exitCode), 0)
            }
          })
        }
        return child
      })

      const promises = [
        exec('echo "success"'),
        exec('echo "failure"'),
        exec('echo "success"')
      ]

      const results = await Promise.allSettled(promises)

      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
      expect(results[2].status).toBe('fulfilled')
    })
  })

  describe('error handling', () => {
    it('should handle spawn errors gracefully', async () => {
      spawnMock.mockImplementation(() => {
        throw new Error('Spawn failed')
      })

      await expect(exec('invalid-command')).rejects.toThrow('Spawn failed')
    })

    it('should handle child process events correctly', async () => {
      const exitCallback = vi.fn()
      
      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          exitCallback.mockImplementation(callback)
        }
      })

      const promise = exec('test-command')
      
      // Simulate exit event
      exitCallback(0)
      
      await expect(promise).resolves.toBeUndefined()
      expect(mockChild.on).toHaveBeenCalledWith('exit', expect.any(Function))
    })
  })

  describe('integration scenarios', () => {
    it('should work with real-world command patterns', async () => {
      const testCommands = [
        'npm install',
        'git commit -m "test message"',
        'docker build -t myapp .',
        'python -m pip install requirements.txt',
        'curl -s https://api.example.com/data',
        'find . -name "*.js" -type f',
        'tar -czf archive.tar.gz src/',
        'chmod +x script.sh && ./script.sh'
      ]

      for (const command of testCommands) {
        mockChild.on.mockImplementation((event, callback) => {
          if (event === 'exit') {
            setTimeout(() => callback(0), 0)
          }
        })

        await exec(command)
        
        expect(spawnMock).toHaveBeenCalledWith(command, {
          shell: true,
          stdio: 'inherit'
        })
      }
    })

    it('should handle options commonly used in build systems', async () => {
      const buildOptions = {
        cwd: '/project/root',
        env: {
          NODE_ENV: 'production',
          CI: 'true',
          PATH: process.env.PATH
        },
        stdio: ['inherit', 'pipe', 'pipe']
      }

      mockChild.on.mockImplementation((event, callback) => {
        if (event === 'exit') {
          setTimeout(() => callback(0), 0)
        }
      })

      await exec('npm run build', buildOptions)

      expect(spawnMock).toHaveBeenCalledWith('npm run build', {
        shell: true,
        ...buildOptions
      })
    })
  })
})