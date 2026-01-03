import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { UserProfile, UserProfileLoading, UserProfileError } from './UserProfile'

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

/**
 * Test wrapper that provides Suspense boundary for UserProfile.
 * Renders UserProfile with loading and error fallbacks.
 */
function TestWrapper({ userPromise }: { userPromise: Promise<User> }) {
  return (
    <React.Suspense fallback={<UserProfileLoading />}>
      <UserProfile userPromise={userPromise} />
    </React.Suspense>
  )
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loading states', () => {
    it('shows loading state while promise is pending', () => {
      // Create a promise that never resolves to keep loading state visible
      const neverResolvingPromise = new Promise<User>(() => {})

      render(<TestWrapper userPromise={neverResolvingPromise} />)

      expect(screen.getByText(/loading user profile/i)).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('transitions from loading to content when promise resolves', async () => {
      const userPromise = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      // After promise resolves, loading should be gone and content should be visible
      expect(
        screen.queryByText(/loading user profile/i),
      ).not.toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
  })

  describe('successful data loading', () => {
    it('displays user information when data loads successfully', async () => {
      const userPromise = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      // Data should be loaded and displayed
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText(/member since/i)).toBeInTheDocument()

      // Loading state should be gone
      expect(
        screen.queryByText(/loading user profile/i),
      ).not.toBeInTheDocument()
    })

    it('formats the creation date correctly', async () => {
      const userPromise = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText('Test User')).toBeInTheDocument()

      // Should format the date nicely
      expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument()
    })
  })

  describe('UserProfileError component', () => {
    it('displays error message', () => {
      const error = new Error('User not found')
      render(<UserProfileError error={error} />)

      expect(screen.getByText(/failed to load user/i)).toBeInTheDocument()
      expect(screen.getByText('User not found')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('displays generic error when no error provided', () => {
      render(<UserProfileError />)

      expect(screen.getByText(/failed to load user/i)).toBeInTheDocument()
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })

    it('provides retry functionality when onRetry is provided', async () => {
      const onRetry = vi.fn()
      render(<UserProfileError error={new Error('Server error')} onRetry={onRetry} />)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()

      await userEvent.setup().click(retryButton)

      expect(onRetry).toHaveBeenCalledOnce()
    })

    it('does not show retry button when onRetry is not provided', () => {
      render(<UserProfileError error={new Error('Server error')} />)

      expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
    })
  })

  describe('UserProfileLoading component', () => {
    it('renders loading state with proper accessibility', () => {
      render(<UserProfileLoading />)

      const loadingStatus = screen.getByRole('status')
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite')
      expect(loadingStatus).toHaveTextContent(/loading user profile/i)
    })
  })

  describe('different user data scenarios', () => {
    it('handles users with empty name', async () => {
      const userPromise = Promise.resolve({
        id: 2,
        email: 'minimal@example.com',
        name: '',
        createdAt: '2023-06-15T10:30:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText('minimal@example.com')).toBeInTheDocument()
      // Should handle empty name gracefully
      expect(screen.getByText(/no name provided/i)).toBeInTheDocument()
    })

    it('handles users with very recent creation dates', async () => {
      const recentDate = new Date()
      recentDate.setMinutes(recentDate.getMinutes() - 5) // 5 minutes ago

      const userPromise = Promise.resolve({
        id: 3,
        email: 'recent@example.com',
        name: 'Recent User',
        createdAt: recentDate.toISOString(),
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText('Recent User')).toBeInTheDocument()
      // Should show relative time for recent dates
      expect(screen.getByText(/a few minutes ago/i)).toBeInTheDocument()
    })

    it('handles users with creation dates a few hours ago', async () => {
      const hoursAgo = new Date()
      hoursAgo.setHours(hoursAgo.getHours() - 3) // 3 hours ago

      const userPromise = Promise.resolve({
        id: 4,
        email: 'hours@example.com',
        name: 'Hours User',
        createdAt: hoursAgo.toISOString(),
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText('Hours User')).toBeInTheDocument()
      // Should show relative time for hours ago
      expect(screen.getByText(/3 hours ago/i)).toBeInTheDocument()
    })

    it('handles null user response', async () => {
      const userPromise = Promise.resolve(null as unknown as User)

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText(/no user found/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('provides proper loading announcements', () => {
      // Create a promise that never resolves to keep loading state visible
      const neverResolvingPromise = new Promise<User>(() => {})

      render(<TestWrapper userPromise={neverResolvingPromise} />)

      const loadingStatus = screen.getByRole('status')
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite')
      expect(loadingStatus).toHaveTextContent(/loading user profile/i)
    })

    it('removes loading status after data loads', async () => {
      const userPromise = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('provides semantic structure for user information', async () => {
      const userPromise = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      })

      await act(async () => {
        render(<TestWrapper userPromise={userPromise} />)
      })

      expect(screen.getByText('Test User')).toBeInTheDocument()

      // Should have proper heading structure
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Test User',
      )

      // Should have proper list structure for user details
      const userDetails = screen.getByRole('list')
      expect(userDetails).toBeInTheDocument()

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(2) // Email and creation date
    })
  })
})
