import http from 'http'

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock http module
vi.mock('http', () => ({
  default: {
    createServer: vi.fn(),
  },
}))

describe('simpleServer', () => {
  let mockServer
  let serverCallback

  beforeEach(() => {
    // Mock server instance
    mockServer = {
      listen: vi.fn((port, hostname, callback) => {
        // Simulate successful server start
        if (callback) callback()
      }),
      close: vi.fn(),
      on: vi.fn(),
    }

    // Mock http.createServer to capture the callback and return our mock server
    http.createServer.mockImplementation((callback) => {
      serverCallback = callback
      return mockServer
    })

    // Mock console.log to verify output
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('should create server with correct configuration', async () => {
    // Import the module which will execute immediately
    await import('./simpleServer.js')

    // Verify http.createServer was called
    expect(http.createServer).toHaveBeenCalledWith(expect.any(Function))

    // Verify server.listen was called with correct parameters
    expect(mockServer.listen).toHaveBeenCalledWith(
      3000,
      '127.0.0.1',
      expect.any(Function),
    )

    // Verify console output
    expect(console.log).toHaveBeenCalledWith(
      'Server running at http://127.0.0.1:3000/',
    )
  })

  it('should handle HTTP requests correctly', async () => {
    await import('./simpleServer.js')

    // Mock request and response objects
    const mockReq = {}
    const mockRes = {
      statusCode: null,
      setHeader: vi.fn(),
      end: vi.fn(),
    }

    // Call the server callback (request handler)
    serverCallback(mockReq, mockRes)

    // Verify response
    expect(mockRes.statusCode).toBe(200)
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain')
    expect(mockRes.end).toHaveBeenCalledWith('Hello World')
  })

  it('should use correct hostname and port constants', async () => {
    await import('./simpleServer.js')

    expect(mockServer.listen).toHaveBeenCalledWith(
      3000, // port
      '127.0.0.1', // hostname
      expect.any(Function),
    )
  })

  it('should respond with Hello World for any request', async () => {
    await import('./simpleServer.js')

    const createMultipleRequests = (count) => {
      const requests = []
      for (let i = 0; i < count; i++) {
        const mockReq = { url: `/path${i}`, method: 'GET' }
        const mockRes = {
          statusCode: null,
          setHeader: vi.fn(),
          end: vi.fn(),
        }
        requests.push({ req: mockReq, res: mockRes })
      }
      return requests
    }

    const requests = createMultipleRequests(5)

    // Process all requests
    requests.forEach(({ req, res }) => {
      serverCallback(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain')
      expect(res.end).toHaveBeenCalledWith('Hello World')
    })
  })

  it('should handle different HTTP methods the same way', async () => {
    await import('./simpleServer.js')

    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

    httpMethods.forEach((method) => {
      const mockReq = { method, url: '/test' }
      const mockRes = {
        statusCode: null,
        setHeader: vi.fn(),
        end: vi.fn(),
      }

      serverCallback(mockReq, mockRes)

      expect(mockRes.statusCode).toBe(200)
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/plain',
      )
      expect(mockRes.end).toHaveBeenCalledWith('Hello World')
    })
  })

  it('should handle requests with different URLs the same way', async () => {
    await import('./simpleServer.js')

    const urls = ['/', '/api', '/users', '/products/123', '/very/long/path']

    urls.forEach((url) => {
      const mockReq = { method: 'GET', url }
      const mockRes = {
        statusCode: null,
        setHeader: vi.fn(),
        end: vi.fn(),
      }

      serverCallback(mockReq, mockRes)

      expect(mockRes.statusCode).toBe(200)
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/plain',
      )
      expect(mockRes.end).toHaveBeenCalledWith('Hello World')
    })
  })

  it('should start server immediately when module is imported', async () => {
    const consoleSpy = vi.spyOn(console, 'log')

    await import('./simpleServer.js')

    // Verify the server was configured and started
    expect(http.createServer).toHaveBeenCalled()
    expect(mockServer.listen).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Server running at http://127.0.0.1:3000/',
    )
  })

  describe('response handling', () => {
    it('should set correct content type header', async () => {
      await import('./simpleServer.js')

      const mockRes = {
        statusCode: null,
        setHeader: vi.fn(),
        end: vi.fn(),
      }

      serverCallback({}, mockRes)

      expect(mockRes.setHeader).toHaveBeenCalledTimes(1)
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/plain',
      )
    })

    it('should set 200 status code', async () => {
      await import('./simpleServer.js')

      const mockRes = {
        statusCode: null,
        setHeader: vi.fn(),
        end: vi.fn(),
      }

      serverCallback({}, mockRes)

      expect(mockRes.statusCode).toBe(200)
    })

    it('should end response with Hello World', async () => {
      await import('./simpleServer.js')

      const mockRes = {
        statusCode: null,
        setHeader: vi.fn(),
        end: vi.fn(),
      }

      serverCallback({}, mockRes)

      expect(mockRes.end).toHaveBeenCalledTimes(1)
      expect(mockRes.end).toHaveBeenCalledWith('Hello World')
    })
  })
})
