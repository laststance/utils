'use client'

/**
 * UserProfile component displays user information with loading and error states.
 *
 * Uses React 19+ patterns with Suspense-compatible data fetching via use() hook.
 * Loading and error states are handled declaratively.
 *
 * Features:
 * - Suspense-compatible data fetching with use() hook
 * - Loading spinner with accessibility
 * - Error handling with retry functionality
 * - Relative date formatting for user creation date
 * - Responsive design with Tailwind CSS
 * - ARIA compliance for screen readers
 *
 * @example
 * ```tsx
 * // Parent component creates the promise and handles Suspense boundary
 * function ProfilePage() {
 *   const [selectedUserId, setSelectedUserId] = useState(123)
 *   const userPromise = useMemo(() => getUser(selectedUserId), [selectedUserId])
 *
 *   return (
 *     <div className="container mx-auto p-4">
 *       <h1>User Profile</h1>
 *       <ErrorBoundary fallback={<UserProfileError />}>
 *         <Suspense fallback={<UserProfileLoading />}>
 *           <UserProfile userPromise={userPromise} />
 *         </Suspense>
 *       </ErrorBoundary>
 *     </div>
 *   )
 * }
 * ```
 */

import * as React from 'react'

/**
 * Props for the UserProfile component
 */
interface UserProfileProps {
  /** Promise that resolves to the user data */
  userPromise: Promise<User>
}

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

/**
 * Formats a date string to a relative or absolute date display.
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "a few minutes ago", "2 hours ago", or full date)
 */
function formatDate(dateString: string): string {
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

/**
 * Loading fallback component for UserProfile.
 * Use this as the Suspense fallback when rendering UserProfile.
 */
export function UserProfileLoading() {
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

/**
 * Error fallback component for UserProfile.
 * Use this as the ErrorBoundary fallback when rendering UserProfile.
 */
export function UserProfileError({
  error,
  onRetryAction,
}: {
  error?: Error
  onRetryAction?: () => void
}) {
  return (
    <div
      role="alert"
      className="p-4 bg-red-50 border border-red-200 rounded-md"
    >
      <h3 className="text-red-800 font-medium">Failed to load user</h3>
      <p className="text-red-600 mt-1">
        {error?.message ?? 'An error occurred'}
      </p>
      {onRetryAction && (
        <button
          onClick={onRetryAction}
          type="button"
          className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Retry
        </button>
      )}
    </div>
  )
}

/**
 * UserProfile displays user information using React 19+ Suspense patterns.
 * Wrap with Suspense and ErrorBoundary for proper loading/error states.
 */
export function UserProfile({ userPromise }: UserProfileProps) {
  const user = React.use(userPromise)

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
