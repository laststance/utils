import { http, HttpResponse } from 'msw'

export const handlers = [
  // Login endpoint handler
  http.post('/api/login', async ({ request }) => {
    const credentials = (await request.json()) as {
      email: string
      password: string
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock successful login
    if (
      credentials.email === 'test@example.com' &&
      credentials.password === 'password123'
    ) {
      return HttpResponse.json({
        success: true,
        user: {
          id: 1,
          email: credentials.email,
        },
      })
    }

    // Mock invalid credentials
    if (
      credentials.email === 'test@example.com' &&
      credentials.password === 'wrongpassword'
    ) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      )
    }

    // Mock network error
    if (credentials.email === 'network@error.com') {
      return HttpResponse.json({ message: 'Network error' }, { status: 500 })
    }

    // Default error response
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }),

  // User profile endpoint (example)
  http.get('/api/user/:id', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2023-01-01T00:00:00.000Z',
    })
  }),

  // Posts endpoint (example for list data)
  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    const limit = url.searchParams.get('limit') || '10'

    const posts = Array.from({ length: Number(limit) }, (_, i) => ({
      id: (Number(page) - 1) * Number(limit) + i + 1,
      title: `Post ${(Number(page) - 1) * Number(limit) + i + 1}`,
      body: 'Lorem ipsum dolor sit amet...',
      userId: 1,
    }))

    return HttpResponse.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 50,
        totalPages: Math.ceil(50 / Number(limit)),
      },
    })
  }),
]
