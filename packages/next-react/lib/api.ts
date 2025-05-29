interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  user?: {
    id: number
    email: string
  }
}

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/user/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return response.json()
}

export async function getPosts(page = 1, limit = 10): Promise<PostsResponse> {
  const response = await fetch(`/api/posts?page=${page}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
} 