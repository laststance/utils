import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('colorful-terminal-message', () => {
  let originalSetTimeout
  let originalConsoleInfo
  let consoleInfoSpy
  let setTimeoutSpy

  beforeEach(() => {
    // Mock console.info
    originalConsoleInfo = console.info
    consoleInfoSpy = vi.fn()
    console.info = consoleInfoSpy

    // Mock setTimeout but don't auto-advance timers
    originalSetTimeout = global.setTimeout
    setTimeoutSpy = vi.fn()
    global.setTimeout = setTimeoutSpy

    // Mock Math.random to make tests deterministic
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // Will select index 2 (middle grabber)
  })

  afterEach(() => {
    // Restore original functions
    console.info = originalConsoleInfo
    global.setTimeout = originalSetTimeout
    vi.restoreAllMocks()
    vi.resetModules()
  })

  describe('script structure and initialization', () => {
    it('should have predefined grabber patterns', async () => {
      // Import the script which will set up the timers
      await import('./colorful-terminal-message.js')

      // Verify setTimeout was called with correct delay
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 300)
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1500)
    })

    it('should set up two timers on module load', async () => {
      await import('./colorful-terminal-message.js')

      expect(setTimeoutSpy).toHaveBeenCalledTimes(2)

      // First timer for message display
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        300,
      )

      // Second timer for reading time
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        1500,
      )
    })
  })

  describe('message display functionality', () => {
    it('should display complete message when first timer executes', async () => {
      await import('./colorful-terminal-message.js')

      // Get the first timer callback and execute it
      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      firstTimerCallback()

      // Verify console.info was called multiple times for the complete message
      expect(consoleInfoSpy).toHaveBeenCalled()

      // Check that various parts of the message were logged
      const allLoggedContent = consoleInfoSpy.mock.calls
        .map((call) => call[0])
        .join('\n')

      expect(allLoggedContent).toContain('Do you rely on Greenlock?')
      expect(allLoggedContent).toContain('STOP WORKING')
      expect(allLoggedContent).toContain('WITHOUT YOUR HELP')
      expect(allLoggedContent).toContain('SAVE GREENLOCK:')
      expect(allLoggedContent).toContain('https://indiegogo.com/at/greenlock')
    })

    it('should use random grabber selection', async () => {
      // Test with different random values
      const testCases = [
        { random: 0.0, expectedIndex: 0 }, // First grabber (fire)
        { random: 0.25, expectedIndex: 1 }, // Second grabber (cherry)
        { random: 0.5, expectedIndex: 2 }, // Third grabber (arrows)
        { random: 0.75, expectedIndex: 3 }, // Fourth grabber (eyes)
      ]

      for (const { random, expectedIndex } of testCases) {
        // Clear previous mocks
        consoleInfoSpy.mockClear()
        vi.resetModules()

        // Mock Math.random for this test case
        vi.spyOn(Math, 'random').mockReturnValue(random)

        await import('./colorful-terminal-message.js')

        // Execute the first timer callback
        const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
        firstTimerCallback()

        // Check that the appropriate emoji pattern was used
        const allLoggedContent = consoleInfoSpy.mock.calls
          .map((call) => call[0])
          .join('\n')

        if (expectedIndex === 0) {
          expect(allLoggedContent).toContain('🔥')
        } else if (expectedIndex === 1) {
          expect(allLoggedContent).toContain('🍒')
        } else if (expectedIndex === 2) {
          expect(allLoggedContent).toContain('👇')
          expect(allLoggedContent).toContain('👉')
          expect(allLoggedContent).toContain('👈')
          expect(allLoggedContent).toContain('👆')
        } else if (expectedIndex === 3) {
          expect(allLoggedContent).toContain('👀')
        }
      }
    })

    it('should include ANSI color codes in message', async () => {
      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      firstTimerCallback()

      const allLoggedContent = consoleInfoSpy.mock.calls
        .map((call) => call[0])
        .join('\n')

      // Check for ANSI color codes
      expect(allLoggedContent).toContain('\u001b[31m') // Red color
      expect(allLoggedContent).toContain('\u001b[0m') // Reset color
    })

    it('should include separator lines', async () => {
      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      firstTimerCallback()

      const allLoggedContent = consoleInfoSpy.mock.calls
        .map((call) => call[0])
        .join('\n')

      // Check for separator lines
      expect(allLoggedContent).toContain(
        '================================================================================',
      )
    })
  })

  describe('message content verification', () => {
    beforeEach(() => {
      // Use a fixed random value for consistent testing
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    it('should include all required message components', async () => {
      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      firstTimerCallback()

      const allLoggedContent = consoleInfoSpy.mock.calls
        .map((call) => call[0])
        .join('\n')

      // Core message components
      expect(allLoggedContent).toContain('Do you rely on Greenlock?')
      expect(allLoggedContent).toContain("Hey! Let's Encrypt will")
      expect(allLoggedContent).toContain('STOP WORKING')
      expect(allLoggedContent).toContain(
        'with Greenlock v2 at the end of October',
      )
      expect(allLoggedContent).toContain('WITHOUT YOUR HELP')
      expect(allLoggedContent).toContain(
        "we won't get the next release out in time",
      )
      expect(allLoggedContent).toContain(
        'If Greenlock has saved you time and money',
      )
      expect(allLoggedContent).toContain('SAVE GREENLOCK:')
      expect(allLoggedContent).toContain('https://indiegogo.com/at/greenlock')
    })

    it('should have proper message structure', async () => {
      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      firstTimerCallback()

      // Verify the number of console.info calls indicates proper message structure
      expect(consoleInfoSpy).toHaveBeenCalled()

      // The message should include grabber + additional content
      const callCount = consoleInfoSpy.mock.calls.length
      expect(callCount).toBeGreaterThan(10) // Should have many lines
    })
  })

  describe('emoji patterns verification', () => {
    it('should have four different grabber patterns', async () => {
      // This test verifies the structure exists by checking random selection works
      const patterns = []

      for (let i = 0; i < 4; i++) {
        consoleInfoSpy.mockClear()
        vi.resetModules()

        vi.spyOn(Math, 'random').mockReturnValue(i / 4 + 0.01) // 0.01, 0.26, 0.51, 0.76

        await import('./colorful-terminal-message.js')

        const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
        firstTimerCallback()

        const content = consoleInfoSpy.mock.calls
          .map((call) => call[0])
          .join('\n')
        patterns.push(content)
      }

      // Verify each pattern is different
      const uniquePatterns = new Set(patterns)
      expect(uniquePatterns.size).toBe(4)
    })

    it('should contain expected emoji types', async () => {
      const emojiTests = [
        { random: 0.0, expectedEmojis: ['🔥'] },
        { random: 0.25, expectedEmojis: ['🍒'] },
        { random: 0.5, expectedEmojis: ['👇', '👉', '👈', '👆'] },
        { random: 0.75, expectedEmojis: ['👀'] },
      ]

      for (const { random, expectedEmojis } of emojiTests) {
        consoleInfoSpy.mockClear()
        vi.resetModules()

        vi.spyOn(Math, 'random').mockReturnValue(random)

        await import('./colorful-terminal-message.js')

        const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
        firstTimerCallback()

        const content = consoleInfoSpy.mock.calls
          .map((call) => call[0])
          .join('\n')

        expectedEmojis.forEach((emoji) => {
          expect(content).toContain(emoji)
        })
      }
    })
  })

  describe('timing behavior', () => {
    it('should use correct delay values', async () => {
      await import('./colorful-terminal-message.js')

      // Verify the exact timing values
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 300)
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1500)
    })

    it('should set up reading time delay', async () => {
      await import('./colorful-terminal-message.js')

      // The second timeout is for giving time to read
      const secondTimerCallback = setTimeoutSpy.mock.calls[1][0]

      // Execute it (should be a no-op function based on the comment)
      expect(() => secondTimerCallback()).not.toThrow()
    })
  })

  describe('script execution model', () => {
    it('should execute immediately when imported', async () => {
      await import('./colorful-terminal-message.js')

      // Timer should be set immediately
      expect(setTimeoutSpy).toHaveBeenCalled()
    })

    it('should not display message immediately', async () => {
      await import('./colorful-terminal-message.js')

      // Message should not be displayed until timer executes
      expect(consoleInfoSpy).not.toHaveBeenCalled()
    })

    it('should be self-contained with no exports', async () => {
      const module = await import('./colorful-terminal-message.js')

      // The script should be self-executing with no exports
      expect(Object.keys(module)).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle Math.random edge values', async () => {
      // Test edge case where Math.random returns exactly 1 (should not happen but test boundary)
      vi.spyOn(Math, 'random').mockReturnValue(0.999999)

      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      expect(() => firstTimerCallback()).not.toThrow()

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should handle Math.random returning 0', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      await import('./colorful-terminal-message.js')

      const firstTimerCallback = setTimeoutSpy.mock.calls[0][0]
      expect(() => firstTimerCallback()).not.toThrow()

      expect(consoleInfoSpy).toHaveBeenCalled()
    })
  })

  describe('CLI shebang compatibility', () => {
    it('should have proper shebang for CLI execution', async () => {
      // Read the file content to verify shebang
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const scriptPath = path.join(__dirname, 'colorful-terminal-message.js')

      const content = fs.readFileSync(scriptPath, 'utf8')
      expect(content.startsWith('#!/usr/bin/env node')).toBe(true)
    })
  })
})
