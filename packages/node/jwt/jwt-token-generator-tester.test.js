import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock the required modules
vi.mock('jsonwebtoken', () => ({
  default: {
    decode: vi.fn(),
  },
}))

vi.mock('../jwt/token-generator.js', () => ({
  default: vi.fn(),
}))

describe('jwt-token-generator-tester', () => {
  let mockJWT
  let MockTokenGenerator
  let mockTokenGenerator
  let originalSetTimeout
  let originalConsoleLog
  let consoleLogSpy
  let setTimeoutSpy

  beforeEach(() => {
    // Reset all mocks
    vi.resetModules()

    // Mock jsonwebtoken
    mockJWT = {
      decode: vi.fn(),
    }

    // Mock TokenGenerator class
    mockTokenGenerator = {
      sign: vi.fn(),
      refresh: vi.fn(),
    }

    MockTokenGenerator = vi.fn(() => mockTokenGenerator)

    // Mock console.log
    originalConsoleLog = console.log
    consoleLogSpy = vi.fn()
    console.log = consoleLogSpy

    // Mock setTimeout
    originalSetTimeout = global.setTimeout
    setTimeoutSpy = vi.fn()
    global.setTimeout = setTimeoutSpy

    // Setup dynamic imports to return our mocks
    vi.doMock('jsonwebtoken', () => ({ default: mockJWT }))
    vi.doMock('../jwt/token-generator.js', () => ({
      default: MockTokenGenerator,
    }))
  })

  afterEach(() => {
    // Restore original functions
    console.log = originalConsoleLog
    global.setTimeout = originalSetTimeout
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should create TokenGenerator with correct configuration', async () => {
      await import('./token-generator.tester.js')

      expect(MockTokenGenerator).toHaveBeenCalledWith('a', 'a', {
        algorithm: 'HS256',
        expiresIn: '2m',
        keyid: '1',
        notBefore: '2s',
        noTimestamp: false,
      })
    })

    it('should call sign method with correct parameters', async () => {
      const mockToken = 'mock-jwt-token'
      mockTokenGenerator.sign.mockReturnValue(mockToken)

      await import('./token-generator.tester.js')

      expect(mockTokenGenerator.sign).toHaveBeenCalledWith(
        { myclaim: 'something' },
        {
          audience: 'myaud',
          issuer: 'myissuer',
          jwtid: '1',
          subject: 'user',
        },
      )
    })

    it('should set up setTimeout with correct delay', async () => {
      await import('./token-generator.tester.js')

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)
    })
  })

  describe('token generation and refresh', () => {
    it('should generate initial token', async () => {
      const mockToken = 'initial-token'
      mockTokenGenerator.sign.mockReturnValue(mockToken)

      await import('./token-generator.tester.js')

      expect(mockTokenGenerator.sign).toHaveBeenCalled()
    })

    it('should refresh token after timeout', async () => {
      const initialToken = 'initial-token'
      const refreshedToken = 'refreshed-token'

      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockReturnValue(refreshedToken)

      await import('./token-generator.tester.js')

      // Get the timeout callback and execute it
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(mockTokenGenerator.refresh).toHaveBeenCalledWith(initialToken, {
        jwtid: '2',
        verify: { audience: 'myaud', issuer: 'myissuer' },
      })
    })

    it('should decode both tokens after refresh', async () => {
      const initialToken = 'initial-token'
      const refreshedToken = 'refreshed-token'
      const decodedInitial = { header: {}, payload: { myclaim: 'something' } }
      const decodedRefreshed = {
        header: {},
        payload: { myclaim: 'something', jwtid: '2' },
      }

      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockReturnValue(refreshedToken)
      mockJWT.decode
        .mockReturnValueOnce(decodedInitial)
        .mockReturnValueOnce(decodedRefreshed)

      await import('./token-generator.tester.js')

      // Execute the timeout callback
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(mockJWT.decode).toHaveBeenCalledWith(initialToken, {
        complete: true,
      })
      expect(mockJWT.decode).toHaveBeenCalledWith(refreshedToken, {
        complete: true,
      })
    })

    it('should log decoded tokens', async () => {
      const initialToken = 'initial-token'
      const refreshedToken = 'refreshed-token'
      const decodedInitial = {
        header: { alg: 'HS256' },
        payload: { myclaim: 'something' },
      }
      const decodedRefreshed = {
        header: { alg: 'HS256' },
        payload: { myclaim: 'something', jwtid: '2' },
      }

      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockReturnValue(refreshedToken)
      mockJWT.decode
        .mockReturnValueOnce(decodedInitial)
        .mockReturnValueOnce(decodedRefreshed)

      await import('./token-generator.tester.js')

      // Execute the timeout callback
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(consoleLogSpy).toHaveBeenCalledWith(decodedInitial)
      expect(consoleLogSpy).toHaveBeenCalledWith(decodedRefreshed)
    })
  })

  describe('configuration details', () => {
    it('should use correct algorithm', async () => {
      await import('./token-generator.tester.js')

      const config = MockTokenGenerator.mock.calls[0][2]
      expect(config.algorithm).toBe('HS256')
    })

    it('should set correct expiration time', async () => {
      await import('./token-generator.tester.js')

      const config = MockTokenGenerator.mock.calls[0][2]
      expect(config.expiresIn).toBe('2m')
    })

    it('should set correct notBefore delay', async () => {
      await import('./token-generator.tester.js')

      const config = MockTokenGenerator.mock.calls[0][2]
      expect(config.notBefore).toBe('2s')
    })

    it('should include timestamp', async () => {
      await import('./token-generator.tester.js')

      const config = MockTokenGenerator.mock.calls[0][2]
      expect(config.noTimestamp).toBe(false)
    })

    it('should set key ID', async () => {
      await import('./token-generator.tester.js')

      const config = MockTokenGenerator.mock.calls[0][2]
      expect(config.keyid).toBe('1')
    })
  })

  describe('claims and options', () => {
    it('should include custom claim', async () => {
      await import('./token-generator.tester.js')

      const claims = mockTokenGenerator.sign.mock.calls[0][0]
      expect(claims).toEqual({ myclaim: 'something' })
    })

    it('should set audience correctly', async () => {
      await import('./token-generator.tester.js')

      const options = mockTokenGenerator.sign.mock.calls[0][1]
      expect(options.audience).toBe('myaud')
    })

    it('should set issuer correctly', async () => {
      await import('./token-generator.tester.js')

      const options = mockTokenGenerator.sign.mock.calls[0][1]
      expect(options.issuer).toBe('myissuer')
    })

    it('should set subject correctly', async () => {
      await import('./token-generator.tester.js')

      const options = mockTokenGenerator.sign.mock.calls[0][1]
      expect(options.subject).toBe('user')
    })

    it('should set initial JWT ID', async () => {
      await import('./token-generator.tester.js')

      const options = mockTokenGenerator.sign.mock.calls[0][1]
      expect(options.jwtid).toBe('1')
    })
  })

  describe('refresh behavior', () => {
    it('should change JWT ID during refresh', async () => {
      const initialToken = 'initial-token'
      mockTokenGenerator.sign.mockReturnValue(initialToken)

      await import('./token-generator.tester.js')

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      const refreshOptions = mockTokenGenerator.refresh.mock.calls[0][1]
      expect(refreshOptions.jwtid).toBe('2')
    })

    it('should verify audience and issuer during refresh', async () => {
      const initialToken = 'initial-token'
      mockTokenGenerator.sign.mockReturnValue(initialToken)

      await import('./token-generator.tester.js')

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      const refreshOptions = mockTokenGenerator.refresh.mock.calls[0][1]
      expect(refreshOptions.verify).toEqual({
        audience: 'myaud',
        issuer: 'myissuer',
      })
    })

    it('should use original token for refresh', async () => {
      const initialToken = 'specific-initial-token'
      mockTokenGenerator.sign.mockReturnValue(initialToken)

      await import('./token-generator.tester.js')

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(mockTokenGenerator.refresh).toHaveBeenCalledWith(
        initialToken,
        expect.any(Object),
      )
    })
  })

  describe('timing and execution flow', () => {
    it('should wait 3 seconds before refresh', async () => {
      await import('./token-generator.tester.js')

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)
    })

    it('should execute refresh logic only after timeout', async () => {
      await import('./token-generator.tester.js')

      // Before timeout execution
      expect(mockTokenGenerator.refresh).not.toHaveBeenCalled()
      expect(mockJWT.decode).not.toHaveBeenCalled()

      // After timeout execution
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      expect(mockTokenGenerator.refresh).toHaveBeenCalled()
      expect(mockJWT.decode).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle token generation errors gracefully', async () => {
      mockTokenGenerator.sign.mockImplementation(() => {
        throw new Error('Token generation failed')
      })

      // Should not throw when importing
      await expect(import('./token-generator.tester.js')).rejects.toThrow(
        'Token generation failed',
      )
    })

    it('should handle token refresh errors gracefully', async () => {
      const initialToken = 'initial-token'
      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockImplementation(() => {
        throw new Error('Token refresh failed')
      })

      await import('./token-generator.tester.js')

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]

      // Should not throw when refresh fails
      expect(() => timeoutCallback()).toThrow('Token refresh failed')
    })

    it('should handle decode errors gracefully', async () => {
      const initialToken = 'initial-token'
      const refreshedToken = 'refreshed-token'

      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockReturnValue(refreshedToken)
      mockJWT.decode.mockImplementation(() => {
        throw new Error('Decode failed')
      })

      await import('./token-generator.tester.js')

      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]

      expect(() => timeoutCallback()).toThrow('Decode failed')
    })
  })

  describe('integration scenario', () => {
    it('should complete full workflow successfully', async () => {
      const initialToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
      const refreshedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
      const decodedInitial = {
        header: { typ: 'JWT', alg: 'HS256', kid: '1' },
        payload: {
          myclaim: 'something',
          aud: 'myaud',
          iss: 'myissuer',
          sub: 'user',
          jti: '1',
        },
      }
      const decodedRefreshed = {
        header: { typ: 'JWT', alg: 'HS256', kid: '1' },
        payload: {
          myclaim: 'something',
          aud: 'myaud',
          iss: 'myissuer',
          sub: 'user',
          jti: '2',
        },
      }

      mockTokenGenerator.sign.mockReturnValue(initialToken)
      mockTokenGenerator.refresh.mockReturnValue(refreshedToken)
      mockJWT.decode
        .mockReturnValueOnce(decodedInitial)
        .mockReturnValueOnce(decodedRefreshed)

      await import('./token-generator.tester.js')

      // Execute the full workflow
      const timeoutCallback = setTimeoutSpy.mock.calls[0][0]
      timeoutCallback()

      // Verify complete execution
      expect(MockTokenGenerator).toHaveBeenCalled()
      expect(mockTokenGenerator.sign).toHaveBeenCalled()
      expect(mockTokenGenerator.refresh).toHaveBeenCalled()
      expect(mockJWT.decode).toHaveBeenCalledTimes(2)
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })
  })
})
