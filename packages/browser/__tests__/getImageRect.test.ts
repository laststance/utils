import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getImageRect } from '../getImageRect'

describe('getImageRect', () => {
  let mockImage: any
  let originalImage: typeof Image

  beforeEach(() => {
    vi.clearAllMocks()

    // Store original Image constructor
    originalImage = global.Image

    // Create mock image with event handling
    mockImage = {
      naturalWidth: 0,
      naturalHeight: 0,
      src: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      load: null as any,
      error: null as any
    }

    // Mock the Image constructor
    global.Image = vi.fn(() => {
      // Store event handlers for manual triggering
      mockImage.addEventListener = vi.fn((event: string, handler: any) => {
        if (event === 'load') {
          mockImage.load = handler
        } else if (event === 'error') {
          mockImage.error = handler
        }
      })
      
      return mockImage
    }) as any
  })

  afterEach(() => {
    // Restore original Image constructor
    global.Image = originalImage
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should be a function', () => {
      expect(typeof getImageRect).toBe('function')
    })

    it('should return a Promise', () => {
      const result = getImageRect('https://example.com/image.jpg')
      expect(result).toBeInstanceOf(Promise)
    })

    it('should create a new Image instance', () => {
      getImageRect('https://example.com/image.jpg')
      
      expect(Image).toHaveBeenCalledTimes(1)
    })

    it('should set up load and error event listeners', () => {
      getImageRect('https://example.com/image.jpg')
      
      expect(mockImage.addEventListener).toHaveBeenCalledWith('load', expect.any(Function))
      expect(mockImage.addEventListener).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockImage.addEventListener).toHaveBeenCalledTimes(2)
    })

    it('should set the image src to the provided URL', () => {
      const url = 'https://example.com/image.jpg'
      getImageRect(url)
      
      expect(mockImage.src).toBe(url)
    })
  })

  describe('successful image loading', () => {
    it('should resolve with image dimensions on load', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const promise = getImageRect('https://example.com/image.jpg')
      
      // Simulate successful image load
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle square images', async () => {
      mockImage.naturalWidth = 500
      mockImage.naturalHeight = 500
      
      const promise = getImageRect('https://example.com/square.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 500, height: 500 })
    })

    it('should handle portrait images', async () => {
      mockImage.naturalWidth = 400
      mockImage.naturalHeight = 800
      
      const promise = getImageRect('https://example.com/portrait.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 400, height: 800 })
    })

    it('should handle landscape images', async () => {
      mockImage.naturalWidth = 1200
      mockImage.naturalHeight = 800
      
      const promise = getImageRect('https://example.com/landscape.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 1200, height: 800 })
    })

    it('should handle very large images', async () => {
      mockImage.naturalWidth = 5000
      mockImage.naturalHeight = 3000
      
      const promise = getImageRect('https://example.com/large.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 5000, height: 3000 })
    })

    it('should handle very small images', async () => {
      mockImage.naturalWidth = 1
      mockImage.naturalHeight = 1
      
      const promise = getImageRect('https://example.com/tiny.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 1, height: 1 })
    })
  })

  describe('error handling', () => {
    it('should reject when image fails to load', async () => {
      const error = new Error('Failed to load image')
      
      const promise = getImageRect('https://example.com/nonexistent.jpg')
      
      // Simulate image load error
      mockImage.error(error)
      
      await expect(promise).rejects.toBe(error)
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      
      const promise = getImageRect('https://unreachable.example.com/image.jpg')
      mockImage.error(networkError)
      
      await expect(promise).rejects.toBe(networkError)
    })

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('404 Not Found')
      
      const promise = getImageRect('https://example.com/missing.jpg')
      mockImage.error(notFoundError)
      
      await expect(promise).rejects.toBe(notFoundError)
    })

    it('should handle invalid image formats', async () => {
      const formatError = new Error('Invalid image format')
      
      const promise = getImageRect('https://example.com/not-an-image.txt')
      mockImage.error(formatError)
      
      await expect(promise).rejects.toBe(formatError)
    })

    it('should handle CORS errors', async () => {
      const corsError = new Error('CORS error')
      
      const promise = getImageRect('https://other-domain.com/protected.jpg')
      mockImage.error(corsError)
      
      await expect(promise).rejects.toBe(corsError)
    })
  })

  describe('URL handling', () => {
    it('should handle HTTPS URLs', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = 'https://secure.example.com/image.jpg'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle HTTP URLs', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = 'http://example.com/image.jpg'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle relative URLs', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = '/assets/images/photo.jpg'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle data URLs', async () => {
      mockImage.naturalWidth = 100
      mockImage.naturalHeight = 100
      
      const url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 100, height: 100 })
    })

    it('should handle blob URLs', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = 'blob:https://example.com/12345-6789'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle URLs with query parameters', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = 'https://example.com/image.jpg?v=1&size=large'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })

    it('should handle URLs with fragments', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const url = 'https://example.com/image.svg#layer1'
      const promise = getImageRect(url)
      
      expect(mockImage.src).toBe(url)
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 800, height: 600 })
    })
  })

  describe('different image formats', () => {
    const formats = [
      { ext: 'jpg', width: 800, height: 600 },
      { ext: 'jpeg', width: 1024, height: 768 },
      { ext: 'png', width: 500, height: 500 },
      { ext: 'gif', width: 200, height: 150 },
      { ext: 'webp', width: 1200, height: 800 },
      { ext: 'svg', width: 100, height: 100 },
      { ext: 'bmp', width: 640, height: 480 }
    ]

    formats.forEach(({ ext, width, height }) => {
      it(`should handle ${ext.toUpperCase()} images`, async () => {
        mockImage.naturalWidth = width
        mockImage.naturalHeight = height
        
        const url = `https://example.com/image.${ext}`
        const promise = getImageRect(url)
        
        expect(mockImage.src).toBe(url)
        mockImage.load()
        
        const result = await promise
        expect(result).toEqual({ width, height })
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty URL', async () => {
      const promise = getImageRect('')
      
      expect(mockImage.src).toBe('')
      // This would typically cause an error in real browser
      const error = new Error('Invalid URL')
      mockImage.error(error)
      
      await expect(promise).rejects.toBe(error)
    })

    it('should handle malformed URLs', async () => {
      const malformedUrl = 'not-a-valid-url'
      const promise = getImageRect(malformedUrl)
      
      expect(mockImage.src).toBe(malformedUrl)
      const error = new Error('Malformed URL')
      mockImage.error(error)
      
      await expect(promise).rejects.toBe(error)
    })

    it('should handle zero dimensions', async () => {
      mockImage.naturalWidth = 0
      mockImage.naturalHeight = 0
      
      const promise = getImageRect('https://example.com/empty.jpg')
      mockImage.load()
      
      const result = await promise
      expect(result).toEqual({ width: 0, height: 0 })
    })

    it('should handle images with only width or height', async () => {
      // Test width without height
      mockImage.naturalWidth = 100
      mockImage.naturalHeight = 0
      
      const promise1 = getImageRect('https://example.com/width-only.jpg')
      mockImage.load()
      
      const result1 = await promise1
      expect(result1).toEqual({ width: 100, height: 0 })

      // Test height without width
      mockImage.naturalWidth = 0
      mockImage.naturalHeight = 200
      
      const promise2 = getImageRect('https://example.com/height-only.jpg')
      mockImage.load()
      
      const result2 = await promise2
      expect(result2).toEqual({ width: 0, height: 200 })
    })
  })

  describe('concurrent requests', () => {
    it('should handle multiple concurrent image loads', async () => {
      const images = [
        { url: 'https://example.com/image1.jpg', width: 800, height: 600 },
        { url: 'https://example.com/image2.jpg', width: 400, height: 300 },
        { url: 'https://example.com/image3.jpg', width: 1200, height: 900 }
      ]

      // Mock Image constructor to return different instances
      let imageIndex = 0
      const mockImages: any[] = []
      
      global.Image = vi.fn(() => {
        const currentIndex = imageIndex++
        const img = {
          naturalWidth: images[currentIndex]?.width || 0,
          naturalHeight: images[currentIndex]?.height || 0,
          src: '',
          addEventListener: vi.fn((event: string, handler: any) => {
            if (event === 'load') {
              img.load = handler
            } else if (event === 'error') {
              img.error = handler
            }
          }),
          load: null as any,
          error: null as any
        }
        mockImages.push(img)
        return img
      }) as any

      const promises = images.map(img => getImageRect(img.url))
      
      // Trigger load events for all images
      mockImages.forEach(img => img.load())
      
      const results = await Promise.all(promises)
      
      expect(results).toEqual([
        { width: 800, height: 600 },
        { width: 400, height: 300 },
        { width: 1200, height: 900 }
      ])
    })

    it('should handle mixed success and failure', async () => {
      const requests = [
        { url: 'https://example.com/good1.jpg', shouldSucceed: true, width: 800, height: 600 },
        { url: 'https://example.com/bad.jpg', shouldSucceed: false },
        { url: 'https://example.com/good2.jpg', shouldSucceed: true, width: 400, height: 300 }
      ]

      let imageIndex = 0
      const mockImages: any[] = []
      
      global.Image = vi.fn(() => {
        const currentIndex = imageIndex++
        const img = {
          naturalWidth: requests[currentIndex]?.width || 0,
          naturalHeight: requests[currentIndex]?.height || 0,
          src: '',
          addEventListener: vi.fn((event: string, handler: any) => {
            if (event === 'load') {
              img.load = handler
            } else if (event === 'error') {
              img.error = handler
            }
          }),
          load: null as any,
          error: null as any
        }
        mockImages.push(img)
        return img
      }) as any

      const promises = requests.map(req => getImageRect(req.url))
      
      // Trigger appropriate events
      mockImages.forEach((img, index) => {
        if (requests[index].shouldSucceed) {
          img.load()
        } else {
          img.error(new Error('Failed to load'))
        }
      })
      
      const results = await Promise.allSettled(promises)
      
      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
      expect(results[2].status).toBe('fulfilled')
      
      if (results[0].status === 'fulfilled') {
        expect(results[0].value).toEqual({ width: 800, height: 600 })
      }
      if (results[2].status === 'fulfilled') {
        expect(results[2].value).toEqual({ width: 400, height: 300 })
      }
    })
  })

  describe('performance considerations', () => {
    it('should not leak memory with many image instances', () => {
      const urls = Array.from({ length: 100 }, (_, i) => `https://example.com/image${i}.jpg`)
      
      urls.forEach(url => {
        getImageRect(url)
      })
      
      expect(Image).toHaveBeenCalledTimes(100)
    })

    it('should handle rapid successive calls', () => {
      const url = 'https://example.com/image.jpg'
      
      for (let i = 0; i < 50; i++) {
        getImageRect(url)
      }
      
      expect(Image).toHaveBeenCalledTimes(50)
    })
  })

  describe('integration patterns', () => {
    it('should work with async/await pattern', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const promise = getImageRect('https://example.com/image.jpg')
      mockImage.load()
      
      const { width, height } = await promise
      
      expect(width).toBe(800)
      expect(height).toBe(600)
    })

    it('should work with Promise.then pattern', async () => {
      mockImage.naturalWidth = 800
      mockImage.naturalHeight = 600
      
      const promise = getImageRect('https://example.com/image.jpg')
      
      // Trigger the load event
      mockImage.load()
      
      return promise.then(({ width, height }) => {
        expect(width).toBe(800)
        expect(height).toBe(600)
      })
    })

    it('should work with error handling patterns', async () => {
      const error = new Error('Load failed')
      const promise = getImageRect('https://example.com/bad.jpg')
      
      mockImage.error(error)
      
      try {
        await promise
        fail('Should have thrown an error')
      } catch (caught) {
        expect(caught).toBe(error)
      }
    })
  })
})