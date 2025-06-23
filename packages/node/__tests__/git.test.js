import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { git } from '../git.js'
import { exec } from 'child_process'

// Mock child_process module
vi.mock('child_process', () => ({
  exec: vi.fn()
}))

// Get the mocked exec function
const mockExec = vi.mocked(exec)

describe('git', () => {
  beforeEach(() => {
    mockExec.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('successful git commands', () => {
    it('should execute simple git command and return trimmed output', async () => {
      const mockOutput = '  main  \n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git branch --show-current')
        callback(null, mockOutput)
      })

      const result = await git('branch --show-current')
      
      expect(result).toBe('main')
      expect(mockExec).toHaveBeenCalledWith('git branch --show-current', expect.any(Function))
    })

    it('should handle git status command', async () => {
      const mockOutput = ' M file1.js\n A file2.js\n?? file3.js\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git status --porcelain')
        callback(null, mockOutput)
      })

      const result = await git('status --porcelain')
      
      expect(result).toBe('M file1.js\n A file2.js\n?? file3.js')
    })

    it('should handle git log command', async () => {
      const mockOutput = 'abc123 Initial commit\ndef456 Add feature\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git log --oneline -5')
        callback(null, mockOutput)
      })

      const result = await git('log --oneline -5')
      
      expect(result).toBe('abc123 Initial commit\ndef456 Add feature')
    })

    it('should handle git rev-parse command', async () => {
      const mockOutput = 'abc123def456789\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git rev-parse HEAD')
        callback(null, mockOutput)
      })

      const result = await git('rev-parse HEAD')
      
      expect(result).toBe('abc123def456789')
    })

    it('should handle git config command', async () => {
      const mockOutput = 'user@example.com\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git config user.email')
        callback(null, mockOutput)
      })

      const result = await git('config user.email')
      
      expect(result).toBe('user@example.com')
    })
  })

  describe('git commands with various arguments', () => {
    it('should handle commands with multiple flags', async () => {
      const mockOutput = 'feature/new-feature\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git branch --show-current --no-color')
        callback(null, mockOutput)
      })

      const result = await git('branch --show-current --no-color')
      
      expect(result).toBe('feature/new-feature')
    })

    it('should handle commands with file paths', async () => {
      const mockOutput = 'commit abc123\nAuthor: John Doe\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git log -1 src/file.js')
        callback(null, mockOutput)
      })

      const result = await git('log -1 src/file.js')
      
      expect(result).toBe('commit abc123\nAuthor: John Doe')
    })

    it('should handle commands with special characters', async () => {
      const mockOutput = 'Changes committed\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git commit -m "Fix: resolve issue #123"')
        callback(null, mockOutput)
      })

      const result = await git('commit -m "Fix: resolve issue #123"')
      
      expect(result).toBe('Changes committed')
    })

    it('should handle commands with environment-like syntax', async () => {
      const mockOutput = 'Switched to branch main\n'
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git -c user.name="Test User" checkout main')
        callback(null, mockOutput)
      })

      const result = await git('-c user.name="Test User" checkout main')
      
      expect(result).toBe('Switched to branch main')
    })
  })

  describe('empty and whitespace output handling', () => {
    it('should handle empty output', async () => {
      mockExec.mockImplementation((command, callback) => {
        callback(null, '')
      })

      const result = await git('status --porcelain')
      
      expect(result).toBe('')
    })

    it('should handle output with only whitespace', async () => {
      mockExec.mockImplementation((command, callback) => {
        callback(null, '   \n\t  \n  ')
      })

      const result = await git('status --porcelain')
      
      expect(result).toBe('')
    })

    it('should handle output with leading and trailing whitespace', async () => {
      const mockOutput = '\n\t  main  \n\t\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('branch --show-current')
      
      expect(result).toBe('main')
    })

    it('should preserve internal whitespace but trim edges', async () => {
      const mockOutput = '  commit abc123\n  Author: John  Doe  \n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('log -1 --format=full')
      
      expect(result).toBe('commit abc123\n  Author: John  Doe')
    })
  })

  describe('error handling', () => {
    it('should reject when git command fails', async () => {
      const mockError = new Error('fatal: not a git repository')
      mockExec.mockImplementation((command, callback) => {
        callback(mockError)
      })

      await expect(git('status')).rejects.toThrow('fatal: not a git repository')
    })

    it('should reject with command not found error', async () => {
      const mockError = new Error('git: command not found')
      mockError.code = 'ENOENT'
      mockExec.mockImplementation((command, callback) => {
        callback(mockError)
      })

      await expect(git('version')).rejects.toThrow('git: command not found')
    })

    it('should reject with permission denied error', async () => {
      const mockError = new Error('Permission denied')
      mockError.code = 'EACCES'
      mockExec.mockImplementation((command, callback) => {
        callback(mockError)
      })

      await expect(git('push origin main')).rejects.toThrow('Permission denied')
    })

    it('should reject with network related errors', async () => {
      const mockError = new Error('Could not resolve hostname github.com')
      mockExec.mockImplementation((command, callback) => {
        callback(mockError)
      })

      await expect(git('clone https://github.com/user/repo.git')).rejects.toThrow('Could not resolve hostname github.com')
    })

    it('should handle git errors with non-zero exit codes', async () => {
      const mockError = new Error('Command failed: git diff --name-only HEAD~1..HEAD')
      mockError.code = 128
      mockExec.mockImplementation((command, callback) => {
        callback(mockError)
      })

      await expect(git('diff --name-only HEAD~1..HEAD')).rejects.toThrow('Command failed: git diff --name-only HEAD~1..HEAD')
    })
  })

  describe('concurrent git operations', () => {
    it('should handle multiple concurrent git commands', async () => {
      const commands = [
        'status --porcelain',
        'branch --show-current',
        'rev-parse HEAD',
        'log --oneline -5'
      ]
      
      const outputs = [
        ' M file1.js\n',
        'main\n',
        'abc123def\n',
        'abc123 Commit message\n'
      ]

      mockExec.mockImplementation((command, callback) => {
        const cmdIndex = commands.findIndex(cmd => command === `git ${cmd}`)
        setTimeout(() => callback(null, outputs[cmdIndex]), Math.random() * 10)
      })

      const promises = commands.map(cmd => git(cmd))
      const results = await Promise.all(promises)

      expect(results).toEqual([
        'M file1.js',
        'main',
        'abc123def',
        'abc123 Commit message'
      ])
    })

    it('should handle mixed success and failure in concurrent operations', async () => {
      mockExec.mockImplementation((command, callback) => {
        if (command.includes('success')) {
          callback(null, 'success output\n')
        } else {
          callback(new Error('Command failed'))
        }
      })

      const promises = [
        git('success-command'),
        git('failure-command'),
        git('another-success-command')
      ]

      const results = await Promise.allSettled(promises)

      expect(results[0].status).toBe('fulfilled')
      expect(results[0].value).toBe('success output')
      expect(results[1].status).toBe('rejected')
      expect(results[2].status).toBe('fulfilled')
      expect(results[2].value).toBe('success output')
    })
  })

  describe('real-world git command scenarios', () => {
    it('should handle git diff commands', async () => {
      const mockOutput = 'diff --git a/file.js b/file.js\n+++ added line\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('diff HEAD~1..HEAD')
      
      expect(result).toBe('diff --git a/file.js b/file.js\n+++ added line')
    })

    it('should handle git remote commands', async () => {
      const mockOutput = 'origin\tupstream\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('remote -v')
      
      expect(result).toBe('origin\tupstream')
    })

    it('should handle git tag commands', async () => {
      const mockOutput = 'v1.0.0\nv1.1.0\nv2.0.0\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('tag -l')
      
      expect(result).toBe('v1.0.0\nv1.1.0\nv2.0.0')
    })

    it('should handle git stash commands', async () => {
      const mockOutput = 'stash@{0}: WIP on main: abc123 Work in progress\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('stash list')
      
      expect(result).toBe('stash@{0}: WIP on main: abc123 Work in progress')
    })

    it('should handle git worktree commands', async () => {
      const mockOutput = '/path/to/main      abc123 [main]\n/path/to/feature  def456 [feature]\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, mockOutput)
      })

      const result = await git('worktree list')
      
      expect(result).toBe('/path/to/main      abc123 [main]\n/path/to/feature  def456 [feature]')
    })
  })

  describe('edge cases and special scenarios', () => {
    it('should handle empty git arguments', async () => {
      mockExec.mockImplementation((command, callback) => {
        expect(command).toBe('git ')
        callback(new Error('usage: git [--version] [--help]'))
      })

      await expect(git('')).rejects.toThrow('usage: git [--version] [--help]')
    })

    it('should handle very long git command output', async () => {
      const longOutput = 'line\n'.repeat(10000) + 'end\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, longOutput)
      })

      const result = await git('log --oneline')
      
      expect(result).toBe(longOutput.trim())
      expect(result.endsWith('end')).toBe(true)
    })

    it('should handle unicode characters in git output', async () => {
      const unicodeOutput = '🚀 feat: add new feature\n✨ improvement\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, unicodeOutput)
      })

      const result = await git('log --oneline --format="%s"')
      
      expect(result).toBe('🚀 feat: add new feature\n✨ improvement')
    })

    it('should handle binary data in git output gracefully', async () => {
      // Simulate binary data that might come from git commands
      const binaryOutput = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x57, 0x6f, 0x72, 0x6c, 0x64]).toString() + '\n'
      mockExec.mockImplementation((command, callback) => {
        callback(null, binaryOutput)
      })

      const result = await git('show --format=raw')
      
      expect(result).toBe('Hello\x00World')
    })
  })

  describe('performance and timeout scenarios', () => {
    it('should handle slow git commands', async () => {
      const slowOutput = 'Slow command result\n'
      mockExec.mockImplementation((command, callback) => {
        // Simulate slow command
        setTimeout(() => callback(null, slowOutput), 100)
      })

      const startTime = Date.now()
      const result = await git('clone https://large-repo.com/repo.git')
      const endTime = Date.now()
      
      expect(result).toBe('Slow command result')
      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })

    it('should handle multiple rapid-fire git commands', async () => {
      let callCount = 0
      mockExec.mockImplementation((command, callback) => {
        const count = ++callCount
        setTimeout(() => callback(null, `result-${count}\n`), 1)
      })

      const commands = Array.from({ length: 10 }, (_, i) => git(`command-${i}`))
      const results = await Promise.all(commands)

      expect(results).toHaveLength(10)
      results.forEach((result, i) => {
        expect(result).toBe(`result-${i + 1}`)
      })
    })
  })

  describe('integration patterns', () => {
    it('should work with common git workflow commands', async () => {
      const gitWorkflow = [
        { cmd: 'status --porcelain', output: ' M file.js\n' },
        { cmd: 'add .', output: '' },
        { cmd: 'commit -m "Update file"', output: '[main abc123] Update file\n' },
        { cmd: 'push origin main', output: 'To origin\n   abc123..def456  main -> main\n' }
      ]

      for (const { cmd, output } of gitWorkflow) {
        mockExec.mockImplementation((command, callback) => {
          expect(command).toBe(`git ${cmd}`)
          callback(null, output)
        })

        const result = await git(cmd)
        expect(result).toBe(output.trim())
      }
    })

    it('should handle git commands used in CI/CD environments', async () => {
      const ciCommands = [
        { cmd: 'rev-parse --verify HEAD', output: 'abc123def456\n' },
        { cmd: 'describe --always --tags', output: 'v1.2.3-4-gabc123d\n' },
        { cmd: 'diff --name-only HEAD~1 HEAD', output: 'src/file1.js\nsrc/file2.js\n' },
        { cmd: 'log --format="%H %s" -1', output: 'abc123def456 feat: add new feature\n' }
      ]

      for (const { cmd, output } of ciCommands) {
        mockExec.mockImplementation((command, callback) => {
          callback(null, output)
        })

        const result = await git(cmd)
        expect(result).toBe(output.trim())
      }
    })
  })
})