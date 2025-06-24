import { describe, it, expect } from 'vitest'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Helper function to run the CLI script
const runCLI = (input) => {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, 'snake-to-cameled-space.js')
    const child = spawn('node', [scriptPath, input])
    
    let stdout = ''
    let stderr = ''
    
    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        // Remove only the trailing newline, not other spaces
        const cleanStdout = stdout.replace(/\n$/, '')
        const cleanStderr = stderr.replace(/\n$/, '')
        resolve({ stdout: cleanStdout, stderr: cleanStderr })
      } else {
        reject(new Error(`Process exited with code ${code}. stderr: ${stderr}`))
      }
    })
    
    child.on('error', (error) => {
      reject(error)
    })
  })
}

describe('snake-to-cameled-space CLI', () => {
  describe('basic functionality', () => {
    it('should convert simple kebab-case to title case', async () => {
      const result = await runCLI('hello-world')
      expect(result.stdout).toBe('Hello World')
    })

    it('should handle single words', async () => {
      const result = await runCLI('test')
      expect(result.stdout).toBe('Test')
    })

    it('should handle multiple hyphens', async () => {
      const result = await runCLI('one-two-three-four')
      expect(result.stdout).toBe('One Two Three Four')
    })

    it('should handle the documented example', async () => {
      const input = 'code-piece-of-complete-guide-to-react-client-rendering-behavior'
      const expected = 'Code Piece Of Complete Guide To React Client Rendering Behavior'
      
      const result = await runCLI(input)
      expect(result.stdout).toBe(expected)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', async () => {
      const result = await runCLI('')
      expect(result.stdout).toBe('')
    })

    it('should handle strings without hyphens', async () => {
      const result = await runCLI('singleword')
      expect(result.stdout).toBe('Singleword')
    })

    it('should handle consecutive hyphens', async () => {
      const result = await runCLI('double--hyphen')
      expect(result.stdout).toBe('Double  Hyphen')
    })

    it('should handle hyphens at the beginning', async () => {
      const result = await runCLI('-leading-hyphen')
      expect(result.stdout).toBe(' Leading Hyphen')
    })

    it('should handle hyphens at the end', async () => {
      const result = await runCLI('trailing-hyphen-')
      expect(result.stdout).toBe('Trailing Hyphen ')
    })

    it('should handle only hyphens', async () => {
      const result = await runCLI('---')
      expect(result.stdout).toBe('   ')
    })
  })

  describe('string variations', () => {
    it('should handle strings with numbers', async () => {
      const result = await runCLI('item-1-test-2')
      expect(result.stdout).toBe('Item 1 Test 2')
    })

    it('should handle strings with mixed case', async () => {
      const result = await runCLI('iPhone-app-store')
      expect(result.stdout).toBe('IPhone App Store')
    })

    it('should handle component names', async () => {
      const result = await runCLI('button-primary-large')
      expect(result.stdout).toBe('Button Primary Large')
    })

    it('should handle file names', async () => {
      const result = await runCLI('user-profile-component')
      expect(result.stdout).toBe('User Profile Component')
    })

    it('should handle API endpoint names', async () => {
      const result = await runCLI('api-v1-users-profile')
      expect(result.stdout).toBe('Api V1 Users Profile')
    })
  })

  describe('special characters', () => {
    it('should handle strings with special characters', async () => {
      const result = await runCLI('user@domain-test')
      expect(result.stdout).toBe('User@domain Test')
    })

    it('should handle strings with dots', async () => {
      const result = await runCLI('file.txt-backup')
      expect(result.stdout).toBe('File.txt Backup')
    })

    it('should handle strings with underscores within words', async () => {
      const result = await runCLI('snake_case-to-kebab')
      expect(result.stdout).toBe('Snake_case To Kebab')
    })
  })

  describe('Unicode support', () => {
    it('should handle Unicode characters', async () => {
      const result = await runCLI('café-résumé')
      expect(result.stdout).toBe('Café Résumé')
    })

    it('should handle emojis', async () => {
      const result = await runCLI('hello-world-👋')
      expect(result.stdout).toBe('Hello World 👋')
    })
  })

  describe('real-world examples', () => {
    it('should handle React component names', async () => {
      const examples = [
        ['nav-menu-item', 'Nav Menu Item'],
        ['form-input-field', 'Form Input Field'],
        ['modal-dialog-box', 'Modal Dialog Box'],
        ['user-profile-card', 'User Profile Card'],
        ['shopping-cart-item', 'Shopping Cart Item']
      ]

      for (const [input, expected] of examples) {
        const result = await runCLI(input)
        expect(result.stdout).toBe(expected)
      }
    })

    it('should handle CSS class names', async () => {
      const examples = [
        ['btn-primary-lg', 'Btn Primary Lg'],
        ['text-center-bold', 'Text Center Bold'],
        ['container-fluid-sm', 'Container Fluid Sm']
      ]

      for (const [input, expected] of examples) {
        const result = await runCLI(input)
        expect(result.stdout).toBe(expected)
      }
    })

    it('should handle package names', async () => {
      const examples = [
        ['react-router-dom', 'React Router Dom'],
        ['styled-components', 'Styled Components'],
        ['babel-preset-env', 'Babel Preset Env']
      ]

      for (const [input, expected] of examples) {
        const result = await runCLI(input)
        expect(result.stdout).toBe(expected)
      }
    })
  })

  describe('CLI behavior', () => {
    it('should handle no arguments gracefully', async () => {
      // When no argument is provided, process.argv[2] will be undefined
      try {
        const result = await runCLI()
        // The script should handle undefined gracefully, likely throwing an error
        // or producing empty output
        expect(result.stdout).toBe('') // or expect error
      } catch (error) {
        // It's acceptable if the script fails when no argument is provided
        expect(error).toBeDefined()
      }
    })

    it('should output to stdout', async () => {
      const result = await runCLI('test-output')
      expect(result.stdout).toBe('Test Output')
      expect(result.stderr).toBe('')
    })

    it('should exit successfully with valid input', async () => {
      // This is implicitly tested by all other tests not throwing
      const result = await runCLI('valid-input')
      expect(result.stdout).toBe('Valid Input')
    })
  })

  describe('performance and large inputs', () => {
    it('should handle very long strings', async () => {
      const longInput = Array(100).fill('word').join('-')
      const expectedOutput = Array(100).fill('Word').join(' ')
      
      const result = await runCLI(longInput)
      expect(result.stdout).toBe(expectedOutput)
    })

    it('should handle many hyphens', async () => {
      const manyHyphens = 'a-'.repeat(50) + 'b'
      // This produces "a-a-a-...-a-b", so each 'a' and 'b' should be capitalized
      const expectedOutput = Array(50).fill('A').join(' ') + ' B'
      
      const result = await runCLI(manyHyphens)
      expect(result.stdout).toBe(expectedOutput)
    })
  })

  describe('consistency', () => {
    it('should produce consistent results', async () => {
      const input = 'consistent-test-case'
      
      // Run multiple times and verify same output
      const results = await Promise.all([
        runCLI(input),
        runCLI(input),
        runCLI(input)
      ])
      
      const expectedOutput = 'Consistent Test Case'
      results.forEach(result => {
        expect(result.stdout).toBe(expectedOutput)
      })
    })
  })
})