/**
 * API utilities for handling authentication, user management, and content fetching.
 * Provides type-safe interfaces and error handling for common API operations.
 */

/**
 * Login credentials interface for authentication
 */
interface LoginCredentials {
  email: string
  password: string
}

/**
 * Response interface for login API calls
 */
interface LoginResponse {
  success: boolean
  user?: {
    id: number
    email: string
  }
}

/**
 * User profile data interface
 */
interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

/**
 * Blog post or content item interface
 */
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

/**
 * Paginated posts response interface
 */
interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Authenticates a user with email and password.
 * 
 * @param credentials - User email and password
 * @returns Promise resolving to login response with user data
 * @throws Error if login fails or credentials are invalid
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await login({
 *     email: 'user@example.com',
 *     password: 'password123'
 *   })
 *   if (result.success && result.user) {
 *     console.log('Logged in:', result.user.email)
 *   }
 * } catch (error) {
 *   console.error('Login failed:', error.message)
 * }
 * ```
 */
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

/**
 * Fetches user profile data by user ID.
 * 
 * @param id - The user ID to fetch
 * @returns Promise resolving to user profile data
 * @throws Error if user not found or fetch fails
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await getUser(123)
 *   console.log(`User: ${user.name} (${user.email})`)
 * } catch (error) {
 *   console.error('Failed to fetch user:', error.message)
 * }
 * ```
 */
export async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/user/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return response.json()
}

/**
 * Fetches paginated posts from the API.
 * 
 * @param page - Page number (1-based, default: 1)
 * @param limit - Number of posts per page (default: 10)
 * @returns Promise resolving to posts with pagination metadata
 * @throws Error if fetch fails
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await getPosts(1, 20)
 *   console.log(`Found ${response.posts.length} posts`)
 *   console.log(`Page ${response.pagination.page} of ${response.pagination.totalPages}`)
 * } catch (error) {
 *   console.error('Failed to fetch posts:', error.message)
 * }
 * ```
 */
export async function getPosts(page = 1, limit = 10): Promise<PostsResponse> {
  const response = await fetch(`/api/posts?page=${page}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
} 