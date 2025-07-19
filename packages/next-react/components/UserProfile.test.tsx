import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'

import { server } from '../mocks/server'

import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  describe('loading states', () => {
    it('shows loading state while fetching user data', async () => {
      // Mock a delayed response
      server.use(
        http.get('/api/user/:id', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.json({
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            createdAt: '2023-01-01T00:00:00.000Z',
          })
        }),
      )

      render(<UserProfile userId={1} />)

      expect(screen.getByText(/loading user profile/i)).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()

      await waitFor(() => {
        expect(
          screen.queryByText(/loading user profile/i),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('successful data loading', () => {
    it('displays user information when data loads successfully', async () => {
      render(<UserProfile userId={1} />)

      // Should show loading first
      expect(screen.getByText(/loading user profile/i)).toBeInTheDocument()

      // Wait for data to load and display
      expect(await screen.findByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText(/member since/i)).toBeInTheDocument()

      // Loading state should be gone
      expect(
        screen.queryByText(/loading user profile/i),
      ).not.toBeInTheDocument()
    })

    it('formats the creation date correctly', async () => {
      render(<UserProfile userId={1} />)

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Should format the date nicely
      expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('displays error message when user fetch fails', async () => {
      // Mock an error response
      server.use(
        http.get('/api/user/:id', () => {
          return HttpResponse.json(
            { message: 'User not found' },
            { status: 404 },
          )
        }),
      )

      render(<UserProfile userId={999} />)

      expect(
        await screen.findByText(/failed to load user/i),
      ).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('displays generic error for network failures', async () => {
      // Mock a network error
      server.use(
        http.get('/api/user/:id', () => {
          return HttpResponse.error()
        }),
      )

      render(<UserProfile userId={1} />)

      expect(
        await screen.findByText(/failed to load user/i),
      ).toBeInTheDocument()
    })

    it('provides retry functionality on error', async () => {
      let attemptCount = 0

      // Mock failure then success
      server.use(
        http.get('/api/user/:id', () => {
          attemptCount++
          if (attemptCount === 1) {
            return HttpResponse.json(
              { message: 'Server error' },
              { status: 500 },
            )
          }
          return HttpResponse.json({
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            createdAt: '2023-01-01T00:00:00.000Z',
          })
        }),
      )

      render(<UserProfile userId={1} />)

      // Should show error first
      expect(
        await screen.findByText(/failed to load user/i),
      ).toBeInTheDocument()

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()

      await userEvent.setup().click(retryButton)

      // Should show success after retry
      expect(await screen.findByText('Test User')).toBeInTheDocument()
      expect(screen.queryByText(/failed to load user/i)).not.toBeInTheDocument()
    })
  })

  describe('different user data scenarios', () => {
    it('handles users with different data structures', async () => {
      // Mock user with minimal data
      server.use(
        http.get('/api/user/:id', () => {
          return HttpResponse.json({
            id: 2,
            email: 'minimal@example.com',
            name: '',
            createdAt: '2023-06-15T10:30:00.000Z',
          })
        }),
      )

      render(<UserProfile userId={2} />)

      await waitFor(() => {
        expect(screen.getByText('minimal@example.com')).toBeInTheDocument()
      })

      // Should handle empty name gracefully
      expect(screen.getByText(/no name provided/i)).toBeInTheDocument()
    })

    it('handles users with very recent creation dates', async () => {
      const recentDate = new Date()
      recentDate.setMinutes(recentDate.getMinutes() - 5) // 5 minutes ago

      server.use(
        http.get('/api/user/:id', () => {
          return HttpResponse.json({
            id: 3,
            email: 'recent@example.com',
            name: 'Recent User',
            createdAt: recentDate.toISOString(),
          })
        }),
      )

      render(<UserProfile userId={3} />)

      await waitFor(() => {
        expect(screen.getByText('Recent User')).toBeInTheDocument()
      })

      // Should show relative time for recent dates
      expect(screen.getByText(/a few minutes ago/i)).toBeInTheDocument()
    })
  })

  describe('component props', () => {
    it('refetches data when userId prop changes', async () => {
      const { rerender } = render(<UserProfile userId={1} />)

      // Wait for first user to load
      expect(await screen.findByText('Test User')).toBeInTheDocument()

      // Mock different user data
      server.use(
        http.get('/api/user/2', () => {
          return HttpResponse.json({
            id: 2,
            email: 'user2@example.com',
            name: 'Second User',
            createdAt: '2023-02-01T00:00:00.000Z',
          })
        }),
      )

      // Change the userId prop
      rerender(<UserProfile userId={2} />)

      // Should show loading and then new user data
      expect(screen.getByText(/loading user profile/i)).toBeInTheDocument()
      expect(await screen.findByText('Second User')).toBeInTheDocument()
      expect(screen.getByText('user2@example.com')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('provides proper loading announcements', async () => {
      render(<UserProfile userId={1} />)

      const loadingStatus = screen.getByRole('status')
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite')
      expect(loadingStatus).toHaveTextContent(/loading user profile/i)

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })

    it('provides proper error announcements', async () => {
      server.use(
        http.get('/api/user/:id', () => {
          return HttpResponse.json(
            { message: 'User not found' },
            { status: 404 },
          )
        }),
      )

      render(<UserProfile userId={999} />)

      const errorAlert = await screen.findByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent(/failed to load user/i)
    })

    it('provides semantic structure for user information', async () => {
      render(<UserProfile userId={1} />)

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

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
