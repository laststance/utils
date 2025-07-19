'use client'

/**
 * UserProfile component displays user information with loading and error states.
 *
 * Features:
 * - Fetches user data on mount and when userId changes
 * - Loading spinner with accessibility
 * - Error handling with retry functionality
 * - Relative date formatting for user creation date
 * - Responsive design with Tailwind CSS
 * - ARIA compliance for screen readers
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const [selectedUserId, setSelectedUserId] = useState(123)
 *
 *   return (
 *     <div className="container mx-auto p-4">
 *       <h1>User Profile</h1>
 *       <UserProfile userId={selectedUserId} />
 *     </div>
 *   )
 * }
 * ```
 */

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/api'

/**
 * Props for the UserProfile component
 */
interface UserProfileProps {
  /** The ID of the user to display */
  userId: number
}

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchUser = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const userData = await getUser(userId)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    )

    if (diffInMinutes < 60) {
      return 'a few minutes ago'
    } else if (diffInMinutes < 1440) {
      // 24 hours
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center p-4"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading user profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md"
      >
        <h3 className="text-red-800 font-medium">Failed to load user</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <Button
          onClick={fetchUser}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div role="alert" className="p-4 text-gray-500">
        No user found
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        {user.name || 'No name provided'}
      </h2>

      <ul className="space-y-2">
        <li className="flex items-center text-gray-600">
          <strong className="mr-2">Email:</strong>
          {user.email}
        </li>
        <li className="flex items-center text-gray-600">
          <strong className="mr-2">Member since:</strong>
          {formatDate(user.createdAt)}
        </li>
      </ul>
    </div>
  )
}
