import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { login, getUser, getPosts } from './api'

describe('API utilities', () => {
  beforeEach(() => {
    // Reset any runtime handlers before each test
    server.resetHandlers()
  })

  describe('login function', () => {
    describe('successful login', () => {
      it('should return user data for valid credentials', async () => {
        const credentials = {
          email: 'test@example.com',
          password: 'password123'
        }

        const result = await login(credentials)

        expect(result.success).toBe(true)
        expect(result.user).toEqual({
          id: 1,
          email: 'test@example.com'
        })
      })

      it('should handle custom successful login scenarios', async () => {
        // Override the handler for this specific test
        server.use(
          http.post('/api/login', async ({ request }) => {
            const credentials = await request.json() as { email: string; password: string }
            
            return HttpResponse.json({
              success: true,
              user: {
                id: 999,
                email: credentials.email
              }
            })
          })
        )

        const credentials = {
          email: 'custom@example.com',
          password: 'anypassword'
        }

        const result = await login(credentials)

        expect(result.success).toBe(true)
        expect(result.user?.id).toBe(999)
        expect(result.user?.email).toBe('custom@example.com')
      })
    })

    describe('failed login', () => {
      it('should throw error for invalid credentials', async () => {
        const credentials = {
          email: 'test@example.com',
          password: 'wrongpassword'
        }

        await expect(login(credentials)).rejects.toThrow('Invalid credentials')
      })

      it('should throw error for network failures', async () => {
        const credentials = {
          email: 'network@error.com',
          password: 'password123'
        }

        await expect(login(credentials)).rejects.toThrow('Network error')
      })

      it('should handle different error status codes', async () => {
        server.use(
          http.post('/api/login', () => {
            return HttpResponse.json(
              { message: 'Server unavailable' },
              { status: 503 }
            )
          })
        )

        const credentials = {
          email: 'test@example.com',
          password: 'password123'
        }

        await expect(login(credentials)).rejects.toThrow('Server unavailable')
      })

      it('should throw generic error when no message provided', async () => {
        server.use(
          http.post('/api/login', () => {
            return HttpResponse.json({}, { status: 400 })
          })
        )

        const credentials = {
          email: 'test@example.com',
          password: 'password123'
        }

        await expect(login(credentials)).rejects.toThrow('Login failed')
      })
    })

    describe('edge cases', () => {
      it('should handle empty credentials', async () => {
        const credentials = {
          email: '',
          password: ''
        }

        await expect(login(credentials)).rejects.toThrow('Invalid credentials')
      })

      it('should handle special characters in credentials', async () => {
        server.use(
          http.post('/api/login', async ({ request }) => {
            const credentials = await request.json() as { email: string; password: string }
            
            return HttpResponse.json({
              success: true,
              user: {
                id: 1,
                email: credentials.email
              }
            })
          })
        )

        const credentials = {
          email: 'user+tag@example.com',
          password: 'p@ssw0rd!#$%^&*()'
        }

        const result = await login(credentials)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('getUser function', () => {
    describe('successful user fetch', () => {
      it('should return user data for valid ID', async () => {
        const result = await getUser(1)

        expect(result).toEqual({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: '2023-01-01T00:00:00.000Z'
        })
      })

      it('should handle different user IDs', async () => {
        server.use(
          http.get('/api/user/:id', ({ params }) => {
            const { id } = params
            return HttpResponse.json({
              id: Number(id),
              email: `user${id}@example.com`,
              name: `User ${id}`,
              createdAt: '2023-01-01T00:00:00.000Z'
            })
          })
        )

        const testIds = [1, 42, 999]
        
        for (const id of testIds) {
          const result = await getUser(id)
          expect(result.id).toBe(id)
          expect(result.email).toBe(`user${id}@example.com`)
          expect(result.name).toBe(`User ${id}`)
        }
      })
    })

    describe('failed user fetch', () => {
      it('should throw error for non-existent user', async () => {
        server.use(
          http.get('/api/user/:id', () => {
            return HttpResponse.json(
              { message: 'User not found' },
              { status: 404 }
            )
          })
        )

        await expect(getUser(999)).rejects.toThrow('Failed to fetch user')
      })

      it('should handle server errors', async () => {
        server.use(
          http.get('/api/user/:id', () => {
            return HttpResponse.json(
              { message: 'Internal server error' },
              { status: 500 }
            )
          })
        )

        await expect(getUser(1)).rejects.toThrow('Failed to fetch user')
      })

      it('should handle network errors', async () => {
        server.use(
          http.get('/api/user/:id', () => {
            return HttpResponse.error()
          })
        )

        await expect(getUser(1)).rejects.toThrow('Failed to fetch')
      })
    })

    describe('edge cases', () => {
      it('should handle zero as user ID', async () => {
        server.use(
          http.get('/api/user/0', () => {
            return HttpResponse.json({
              id: 0,
              email: 'admin@example.com',
              name: 'System Admin',
              createdAt: '2023-01-01T00:00:00.000Z'
            })
          })
        )

        const result = await getUser(0)
        expect(result.id).toBe(0)
        expect(result.name).toBe('System Admin')
      })

      it('should handle large user IDs', async () => {
        const largeId = 999999999
        
        server.use(
          http.get(`/api/user/${largeId}`, () => {
            return HttpResponse.json({
              id: largeId,
              email: 'user@example.com',
              name: 'Large ID User',
              createdAt: '2023-01-01T00:00:00.000Z'
            })
          })
        )

        const result = await getUser(largeId)
        expect(result.id).toBe(largeId)
      })
    })
  })

  describe('getPosts function', () => {
    describe('successful posts fetch', () => {
      it('should return posts with default pagination', async () => {
        const result = await getPosts()

        expect(result.posts).toHaveLength(10)
        expect(result.pagination).toEqual({
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5
        })
        
        // Check first post structure
        expect(result.posts[0]).toHaveProperty('id')
        expect(result.posts[0]).toHaveProperty('title')
        expect(result.posts[0]).toHaveProperty('body')
        expect(result.posts[0]).toHaveProperty('userId')
      })

      it('should return posts with custom pagination', async () => {
        const result = await getPosts(2, 5)

        expect(result.posts).toHaveLength(5)
        expect(result.pagination).toEqual({
          page: 2,
          limit: 5,
          total: 50,
          totalPages: 10
        })
        
        // Check that post IDs are correct for page 2
        expect(result.posts[0].id).toBe(6) // (page 2 - 1) * limit 5 + 1
      })

      it('should handle empty results', async () => {
        server.use(
          http.get('/api/posts', () => {
            return HttpResponse.json({
              posts: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
              }
            })
          })
        )

        const result = await getPosts()

        expect(result.posts).toEqual([])
        expect(result.pagination.total).toBe(0)
      })

      it('should handle large pagination values', async () => {
        const result = await getPosts(100, 50)

        expect(result.pagination.page).toBe(100)
        expect(result.pagination.limit).toBe(50)
      })
    })

    describe('failed posts fetch', () => {
      it('should throw error when posts fetch fails', async () => {
        server.use(
          http.get('/api/posts', () => {
            return HttpResponse.json(
              { message: 'Posts not available' },
              { status: 500 }
            )
          })
        )

        await expect(getPosts()).rejects.toThrow('Failed to fetch posts')
      })

      it('should handle different HTTP error statuses', async () => {
        const errorStatuses = [400, 401, 403, 404, 503]

        for (const status of errorStatuses) {
          server.use(
            http.get('/api/posts', () => {
              return HttpResponse.json(
                { message: 'Error' },
                { status }
              )
            })
          )

          await expect(getPosts()).rejects.toThrow('Failed to fetch posts')
        }
      })

      it('should handle network errors', async () => {
        server.use(
          http.get('/api/posts', () => {
            return HttpResponse.error()
          })
        )

        await expect(getPosts()).rejects.toThrow('Failed to fetch')
      })
    })

    describe('edge cases and parameter validation', () => {
      it('should handle zero page number', async () => {
        const result = await getPosts(0, 10)

        expect(result.pagination.page).toBe(0)
        expect(result.pagination.limit).toBe(10)
      })

      it('should handle zero limit', async () => {
        server.use(
          http.get('/api/posts', ({ request }) => {
            const url = new URL(request.url)
            const limit = url.searchParams.get('limit') || '0'
            
            return HttpResponse.json({
              posts: [],
              pagination: {
                page: 1,
                limit: Number(limit),
                total: 0,
                totalPages: 0
              }
            })
          })
        )

        const result = await getPosts(1, 0)

        expect(result.posts).toEqual([])
        expect(result.pagination.limit).toBe(0)
      })

      it('should handle negative parameters', async () => {
        const result = await getPosts(-1, -5)

        // The MSW handler will still process these, though they may not be meaningful
        expect(typeof result.pagination.page).toBe('number')
        expect(typeof result.pagination.limit).toBe('number')
      })
    })

    describe('response structure validation', () => {
      it('should return posts with all required fields', async () => {
        const result = await getPosts()

        result.posts.forEach(post => {
          expect(post).toHaveProperty('id')
          expect(post).toHaveProperty('title')
          expect(post).toHaveProperty('body')
          expect(post).toHaveProperty('userId')
          
          expect(typeof post.id).toBe('number')
          expect(typeof post.title).toBe('string')
          expect(typeof post.body).toBe('string')
          expect(typeof post.userId).toBe('number')
        })
      })

      it('should return pagination with all required fields', async () => {
        const result = await getPosts()

        expect(result.pagination).toHaveProperty('page')
        expect(result.pagination).toHaveProperty('limit')
        expect(result.pagination).toHaveProperty('total')
        expect(result.pagination).toHaveProperty('totalPages')

        expect(typeof result.pagination.page).toBe('number')
        expect(typeof result.pagination.limit).toBe('number')
        expect(typeof result.pagination.total).toBe('number')
        expect(typeof result.pagination.totalPages).toBe('number')
      })

      it('should handle posts with custom content', async () => {
        server.use(
          http.get('/api/posts', () => {
            return HttpResponse.json({
              posts: [
                {
                  id: 1,
                  title: 'Post with émojis 🚀 and spéciał characters!',
                  body: 'Content with "quotes", <html>, & symbols',
                  userId: 1
                }
              ],
              pagination: {
                page: 1,
                limit: 1,
                total: 1,
                totalPages: 1
              }
            })
          })
        )

        const result = await getPosts()

        expect(result.posts[0].title).toContain('🚀')
        expect(result.posts[0].body).toContain('"quotes"')
      })
    })
  })

  describe('performance and concurrent requests', () => {
    it('should handle multiple concurrent API calls', async () => {
      const startTime = performance.now()

      const promises = [
        login({ email: 'test@example.com', password: 'password123' }),
        getUser(1),
        getPosts(1, 5)
      ]

      const [loginResult, userResult, postsResult] = await Promise.all(promises)

      const endTime = performance.now()
      const duration = endTime - startTime

      expect((loginResult as any).success).toBe(true)
      expect((userResult as any).id).toBe(1)
      expect((postsResult as any).posts).toHaveLength(5)
      
      // Should complete reasonably quickly
      expect(duration).toBeLessThan(1000)
    })

    it('should handle rapid sequential calls', async () => {
      const startTime = performance.now()

      // Make 10 rapid sequential calls
      for (let i = 0; i < 10; i++) {
        await getUser(1)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete in reasonable time
      expect(duration).toBeLessThan(2000)
    })
  })

  describe('type safety and interface compliance', () => {
    it('should return correctly typed login response', async () => {
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      })

      // TypeScript should enforce these properties exist
      expect(typeof result.success).toBe('boolean')
      if (result.user) {
        expect(typeof result.user.id).toBe('number')
        expect(typeof result.user.email).toBe('string')
      }
    })

    it('should return correctly typed user response', async () => {
      const result = await getUser(1)

      expect(typeof result.id).toBe('number')
      expect(typeof result.email).toBe('string')
      expect(typeof result.name).toBe('string')
      expect(typeof result.createdAt).toBe('string')
    })

    it('should return correctly typed posts response', async () => {
      const result = await getPosts()

      expect(Array.isArray(result.posts)).toBe(true)
      expect(typeof result.pagination.page).toBe('number')
      expect(typeof result.pagination.limit).toBe('number')
      expect(typeof result.pagination.total).toBe('number')
      expect(typeof result.pagination.totalPages).toBe('number')

      if (result.posts.length > 0) {
        const post = result.posts[0]
        expect(typeof post.id).toBe('number')
        expect(typeof post.title).toBe('string')
        expect(typeof post.body).toBe('string')
        expect(typeof post.userId).toBe('number')
      }
    })
  })
})